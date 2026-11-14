import Phaser from 'phaser';
import { GameSession } from '../../core/GameSession';
import { BOT_IDS, PLAYER_ID } from '../../core/run';
import type { StatId, TaskId } from '../../core/types';
import type { ResultSceneData } from '../ResultScene';
import { getLocation } from '../../content/locations';
import { MINIGAME_FINISHED_EVENT, type MinigameResult } from '../../minigames/MinigameScene';
import { MINIGAME_SCENE_BY_TASK } from '../../minigames/registry';
import { COLORS } from '../../ui/palette';
import { SCENE_KEYS } from '../sceneKeys';
import { CrewView } from './CrewView';
import { Hud } from './Hud';
import { RoomView } from './RoomView';
import { getRoom, ROOMS, type RoomLayout } from './rooms';
import { loadProgress } from '../../services/progressStorage';
import { recordMinigameResult, recordRunResult } from '../../services/progressUpdates';
import { TASK_BALANCE } from '../../config/balance';

export interface BaseSceneData {
  locationId: string;
}

const BOT_COLORS = [COLORS.botRed, COLORS.botGreen, COLORS.botYellow];

/**
 * The Mars base. Tap a room to go play its minigame yourself,
 * or tap a bot and then a room to send that bot there.
 */
export class BaseScene extends Phaser.Scene {
  private session!: GameSession;
  private hud!: Hud;
  private rooms: RoomView[] = [];
  private player!: CrewView;
  private bots: CrewView[] = [];
  private selectedBotId: string | null = null;
  /** Room the player is walking to, before its minigame opens. */
  private playerDestination: TaskId | null = null;
  private isPlayingMinigame = false;

  constructor() {
    super({ key: SCENE_KEYS.base });
  }

  init(data: BaseSceneData): void {
    this.session = new GameSession(getLocation(data.locationId), loadProgress().training);
    this.selectedBotId = null;
    this.playerDestination = null;
    this.isPlayingMinigame = false;
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.rooms = ROOMS.map(
      (layout) => new RoomView(this, layout, (room) => this.handleRoomTap(room)),
    );
    this.createCrew();
    this.hud = new Hud(this);

    this.game.events.on(MINIGAME_FINISHED_EVENT, this.handleMinigameFinished, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off(MINIGAME_FINISHED_EVENT, this.handleMinigameFinished, this);
    });
  }

  update(timeMs: number, deltaMs: number): void {
    this.session.update(deltaMs);
    this.syncViews(timeMs, deltaMs);
    this.walkPlayerToDestination(deltaMs);
    if (this.session.isOver()) this.endRun();
  }

  private createCrew(): void {
    this.player = new CrewView(this, PLAYER_ID, COLORS.player, 0);
    this.bots = BOT_IDS.map((botId, index) => {
      const bot = new CrewView(this, botId, BOT_COLORS[index], (index - 1) * 24 + 40);
      bot.body.on('pointerup', () => this.toggleBotSelection(botId));
      return bot;
    });
  }

  private syncViews(timeMs: number, deltaMs: number): void {
    const { state } = this.session;
    this.hud.refresh(state, timeMs);
    for (const room of this.rooms) {
      room.refresh(state.stats[getStatOfRoom(room.layout)], timeMs);
    }
    for (const bot of this.bots) {
      const member = state.crew.find((candidate) => candidate.id === bot.crewId);
      if (member) bot.syncWithBot(member, deltaMs);
    }
  }

  private handleRoomTap(room: RoomLayout): void {
    if (this.isPlayingMinigame) return;
    if (this.selectedBotId) {
      this.session.dispatch({
        type: 'assignTask',
        crewId: this.selectedBotId,
        taskId: room.taskId,
      });
      this.toggleBotSelection(this.selectedBotId);
      return;
    }
    this.playerDestination = room.taskId;
  }

  private toggleBotSelection(botId: string): void {
    this.selectedBotId = this.selectedBotId === botId ? null : botId;
    for (const bot of this.bots) bot.setSelected(bot.crewId === this.selectedBotId);
  }

  private walkPlayerToDestination(deltaMs: number): void {
    if (!this.playerDestination || this.isPlayingMinigame) return;
    const room = getRoom(this.playerDestination);
    const hasArrived = this.player.walkToward(room.x, room.y, deltaMs);
    if (hasArrived) this.openMinigame(this.playerDestination);
  }

  /** The base keeps running behind the minigame: time pressure is part of the decision. */
  private openMinigame(taskId: TaskId): void {
    this.isPlayingMinigame = true;
    this.input.enabled = false;
    this.scene.launch(MINIGAME_SCENE_BY_TASK[taskId], { taskId });
  }

  private handleMinigameFinished(result: MinigameResult): void {
    this.session.dispatch({ type: 'completeTask', crewId: PLAYER_ID, ...result });
    recordMinigameResult(result.taskId, result.performance);
    this.isPlayingMinigame = false;
    this.playerDestination = null;
    this.input.enabled = true;
  }

  private endRun(): void {
    for (const sceneKey of Object.values(MINIGAME_SCENE_BY_TASK)) this.scene.stop(sceneKey);
    const { location, status } = this.session.state;
    const result = this.session.getResult();
    recordRunResult(location.id, result);
    const resultData: ResultSceneData = { result, status, locationId: location.id };
    this.scene.start(SCENE_KEYS.result, resultData);
  }
}

function getStatOfRoom(room: RoomLayout): StatId {
  return TASK_BALANCE[room.taskId].stat;
}
