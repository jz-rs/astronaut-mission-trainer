import Phaser from 'phaser';
import { ALERT_BALANCE, TASK_BALANCE } from '../../config/balance';
import { getLocation } from '../../content/locations';
import { GameSession } from '../../core/GameSession';
import { PLAYER_ID } from '../../core/run';
import { canAffordTask } from '../../core/stats';
import { TASK_IDS, type TaskId } from '../../core/types';
import { t } from '../../i18n';
import type { MinigameResult, MinigameStartData } from '../../minigames/MinigameScene';
import { MINIGAME_KEYS, MINIGAME_REGISTRY } from '../../minigames/registry';
import { loadProgress } from '../../services/progressStorage';
import { recordMinigameResult } from '../../services/progressUpdates';
import { PLAYER_IDLE_SPOT } from '../../ui/layout';
import { CREW_COLORS, PALETTE } from '../../ui/palette';
import { addScanlines } from '../../ui/techFrame';
import { addText } from '../../ui/text';
import { finishRun } from '../runEnd';
import { SCENE_KEYS } from '../sceneKeys';
import { AstronautSprite, type WalkTarget } from './AstronautSprite';
import { drawBaseMap } from './baseMap';
import { Hud } from './Hud';
import { RoomView } from './RoomView';

/**
 * Spec 04 — The base during a run. It never calculates game rules:
 * it reads `session.state` to draw and sends GameActions through the session.
 * Bots already work in AUTO inside the session; drawing them is spec 05.
 */
const DEFAULT_LOCATION_ID = 'jezero'; // the Mars map (spec 12) will choose this
const FLOATING_TEXT_RISE_PX = 24;
const FLOATING_TEXT_MS = 900;

export class BaseScene extends Phaser.Scene {
  private session!: GameSession;
  private rooms = new Map<TaskId, RoomView>();
  private hud!: Hud;
  private player!: AstronautSprite;
  private playerBusy = false;
  private minigameOpen = false;
  private runEnded = false;

  constructor() {
    super(SCENE_KEYS.base);
  }

  init(): void {
    this.playerBusy = false;
    this.minigameOpen = false;
    this.runEnded = false;
    this.rooms = new Map();
  }

  create(): void {
    this.session = new GameSession(getLocation(DEFAULT_LOCATION_ID), loadProgress().training);
    drawBaseMap(this);
    for (const taskId of TASK_IDS) {
      this.rooms.set(taskId, new RoomView(this, taskId, (tapped) => this.handleRoomTap(tapped)));
    }
    this.player = new AstronautSprite(this, PLAYER_IDLE_SPOT, CREW_COLORS.player ?? PALETTE.violet);
    this.hud = new Hud(this);
    addScanlines(this);
  }

  update(time: number, deltaMs: number): void {
    if (this.runEnded) return;
    this.session.update(deltaMs);
    const { state } = this.session;
    this.hud.update(state, time);
    for (const room of this.rooms.values()) {
      const value = state.stats[TASK_BALANCE[room.taskId].stat];
      room.setAlarm(value < ALERT_BALANCE.lowStatThreshold, time);
    }
    if (this.session.isOver()) this.endRun();
  }

  private handleRoomTap(taskId: TaskId): void {
    if (this.minigameOpen || this.runEnded || this.playerBusy) return;
    if (!canAffordTask(this.session.state.stats, taskId)) {
      this.showFloatingText(taskId, t('hud.noEnergy'), PALETTE.alert);
      return;
    }
    this.playerBusy = true;
    this.player.walkTo(this.workSpot(taskId, PLAYER_ID), () => this.openMinigame(taskId));
  }

  private openMinigame(taskId: TaskId): void {
    if (this.runEnded) return;
    this.minigameOpen = true;
    const stat = TASK_BALANCE[taskId].stat;
    const data: MinigameStartData = {
      taskId,
      difficulty: this.session.state.location.decayMultiplier[stat] ?? 1,
      onFinish: (result) => this.handleMinigameFinished(result),
    };
    this.scene.launch(MINIGAME_REGISTRY[taskId].key, data);
  }

  private handleMinigameFinished({ taskId, performance }: MinigameResult): void {
    this.minigameOpen = false;
    this.playerBusy = false;
    if (this.runEnded) return;
    this.session.dispatch({ type: 'completeTask', crewId: PLAYER_ID, taskId, performance });
    recordMinigameResult(taskId, performance);
  }

  /** Each crew member has its own spot in a room so they never overlap. */
  private workSpot(taskId: TaskId, crewId: string): WalkTarget {
    const slot = this.session.state.crew.findIndex((member) => member.id === crewId);
    const room = this.rooms.get(taskId);
    if (!room) return { spot: PLAYER_IDLE_SPOT, doorX: null };
    return { spot: room.workSpot(slot), doorX: room.doorX };
  }

  private showFloatingText(taskId: TaskId, message: string, color: number): void {
    const room = this.rooms.get(taskId);
    if (!room) return;
    const { x, y, width, height } = room.rect;
    const text = addText(this, x + width / 2, y + height / 2, message, { color });
    this.tweens.add({
      targets: text,
      y: text.y - FLOATING_TEXT_RISE_PX,
      alpha: 0,
      duration: FLOATING_TEXT_MS,
      onComplete: () => text.destroy(),
    });
  }

  private endRun(): void {
    this.runEnded = true;
    MINIGAME_KEYS.forEach((key) => this.scene.stop(key));
    finishRun(this, this.session);
  }
}
