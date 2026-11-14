import Phaser from 'phaser';
import { TASK_BALANCE } from '../../config/balance';
import { drawEventsForRun } from '../../content/events';
import { getLocation } from '../../content/locations';
import { GameSession } from '../../core/GameSession';
import { PLAYER_ID } from '../../core/run';
import { canStartExpedition } from '../../core/expedition';
import { canAffordTask } from '../../core/stats';
import { TASK_IDS, type TaskId, type TaskNews } from '../../core/types';
import { t } from '../../i18n';
import type { MinigameResult, MinigameStartData } from '../../minigames/MinigameScene';
import { MINIGAME_KEYS, MINIGAME_REGISTRY } from '../../minigames/registry';
import { RoverExpeditionScene } from '../../minigames/rover/RoverExpeditionScene';
import { loadProgress } from '../../services/progressStorage';
import { recordMinigameResult } from '../../services/progressUpdates';
import { GARAGE_SPOT, PLAYER_IDLE_SPOT } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { floatText } from '../../ui/floatingText';
import { addScanlines } from '../../ui/techFrame';
import { finishRun } from '../runEnd';
import { SCENE_KEYS } from '../sceneKeys';
import { AstronautSprite, type WalkTarget } from './AstronautSprite';
import { drawBaseMap } from './baseMap';
import { BotFaces } from './BotFaces';
import { BotsView } from './BotsView';
import { EventAnnouncer } from './EventAnnouncer';
import { ExitRunView } from './ExitRunView';
import { GarageView } from './GarageView';
import type { MapStatusSprites } from './MapStatusSprites';
import { TeamworkViews } from './TeamworkViews';
import { createPickRoomHint } from './pickRoomHint';
import { launchRoverTrip } from './roverTrip';
import { Hud } from './Hud';
import { RoomView } from './RoomView';
import { TaskEffectsView } from './TaskEffectsView';
import { TutorialGuide } from './TutorialGuide';
import { addYouTag } from './youTag';

/**
 * Spec 04 (+ bots from spec 05) — The base during a run. It never calculates game rules:
 * it reads `session.state` to draw and sends GameActions through the session.
 */
const DEFAULT_LOCATION_ID = 'jezero';
/** Scenes that open on top of the base: minigames and the rover trip. */
const OVERLAY_KEYS = [...MINIGAME_KEYS, RoverExpeditionScene.KEY];

/** The Mars map (spec 12) and the result screen's Retry say where to land. */
export interface BaseSceneData {
  locationId?: string;
}

export class BaseScene extends Phaser.Scene {
  private session!: GameSession;
  private rooms = new Map<TaskId, RoomView>();
  private hud!: Hud;
  private mapStatus!: MapStatusSprites;
  private player!: AstronautSprite;
  private bots!: BotsView;
  private botFaces!: BotFaces;
  private eventAnnouncer!: EventAnnouncer;
  private garage!: GarageView;
  private teamwork!: TeamworkViews;
  private taskEffects!: TaskEffectsView;
  private tutorial!: TutorialGuide;
  private exitRun!: ExitRunView;
  private pickRoomHint!: Phaser.GameObjects.Text;
  private playerBusy = false;
  private minigameOpen = false;
  private selectedBotId: string | null = null;
  private runEnded = false;
  private locationId = DEFAULT_LOCATION_ID;

  constructor() {
    super(SCENE_KEYS.base);
  }

  init(data: BaseSceneData = {}): void {
    this.locationId = data.locationId ?? DEFAULT_LOCATION_ID;
    this.freePlayer();
    this.selectedBotId = null;
    this.runEnded = false;
    this.rooms = new Map();
  }

  create(): void {
    this.session = this.createSession();
    this.mapStatus = drawBaseMap(this);
    for (const taskId of TASK_IDS) {
      this.rooms.set(taskId, new RoomView(this, taskId, (tapped) => this.handleRoomTap(tapped)));
    }
    this.player = new AstronautSprite(this, PLAYER_IDLE_SPOT, 'violet');
    addYouTag(this, this.player.image);
    this.bots = new BotsView(
      this,
      this.session.state.crew,
      (taskId, crewId) => this.workSpot(taskId, crewId),
      (botId) => this.selectBot(botId),
    );
    this.hud = new Hud(this);
    this.botFaces = new BotFaces(this, (botId) => this.toggleAuto(botId));
    this.pickRoomHint = createPickRoomHint(this);
    this.eventAnnouncer = new EventAnnouncer(this);
    this.garage = new GarageView(this, () => this.sendRover());
    this.teamwork = new TeamworkViews(this, this.session, OVERLAY_KEYS);
    this.taskEffects = new TaskEffectsView(this, this.rooms);
    this.tutorial = new TutorialGuide(this, this.rooms);
    this.exitRun = new ExitRunView(
      this,
      () => !this.minigameOpen && !this.runEnded,
      () => this.leaveRun(),
    );
    addScanlines(this);
  }

  private createSession(): GameSession {
    return new GameSession(
      getLocation(this.locationId),
      loadProgress().training,
      drawEventsForRun(this.locationId),
    );
  }

  update(time: number, deltaMs: number): void {
    if (this.runEnded) return;
    if (!this.tutorial.pausesGame && !this.exitRun.isAsking) this.session.update(deltaMs);
    const { state } = this.session;
    this.taskEffects.update(state, (news) => this.handleTaskEffectShown(news));
    this.hud.update(state);
    this.mapStatus.update(state.stats);
    this.botFaces.update(state);
    this.bots.update(state, this.selectedBotId);
    this.eventAnnouncer.update(state);
    this.garage.update(state);
    this.teamwork.update(state, time);
    for (const room of this.rooms.values()) room.update(state.stats, time);
    if (this.session.isOver()) this.endRun();
  }

  private handleRoomTap(taskId: TaskId): void {
    if (this.minigameOpen || this.runEnded) return;
    this.tutorial.roomTapped();
    if (this.selectedBotId) {
      this.orderBot(this.selectedBotId, taskId);
      return;
    }
    this.sendPlayer(taskId);
  }

  private sendPlayer(taskId: TaskId): void {
    if (this.playerBusy) return;
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
      onExit: () => this.freePlayer(), // the X: nothing done, nothing spent
    };
    this.scene.launch(MINIGAME_REGISTRY[taskId].key, data);
  }

  private freePlayer(): void {
    this.minigameOpen = false;
    this.playerBusy = false;
  }

  private handleMinigameFinished({ taskId, performance }: MinigameResult): void {
    this.freePlayer();
    if (this.runEnded) return;
    this.session.dispatch({ type: 'completeTask', crewId: PLAYER_ID, taskId, performance });
    recordMinigameResult(taskId, performance);
  }

  private handleTaskEffectShown(news: TaskNews): void {
    if (news.crewId === PLAYER_ID) this.tutorial.playerTaskDone(TASK_BALANCE[news.taskId].stat);
  }

  /** Tapping the bot again keeps it chosen: the next room tap is still its order. */
  private selectBot(botId: string): void {
    if (this.minigameOpen) return;
    this.setSelectedBot(botId);
  }

  private orderBot(botId: string, taskId: TaskId): void {
    const bot = this.session.state.crew.find((member) => member.id === botId);
    if (bot?.task?.taskId === taskId) {
      this.showFloatingText(taskId, t('hud.botAlreadyThere'), PALETTE.sun); // why it doesn't move
    } else if (canAffordTask(this.session.state.stats, taskId)) {
      this.session.dispatch({ type: 'assignTask', crewId: botId, taskId });
    } else {
      this.showFloatingText(taskId, t('hud.noEnergy'), PALETTE.alert);
    }
    this.setSelectedBot(null);
  }

  private setSelectedBot(botId: string | null): void {
    this.selectedBotId = botId;
    this.botFaces.highlight(botId);
    this.pickRoomHint.setVisible(botId !== null);
  }

  private toggleAuto(botId: string): void {
    const bot = this.session.state.crew.find((member) => member.id === botId);
    if (!bot) return;
    const enableAuto = !bot.autoMode;
    this.session.dispatch({ type: 'setAutoMode', crewId: botId, enabled: enableAuto });
    // Switching a bot to MANUAL means "I want to give it an order": it waits for a room right away.
    this.setSelectedBot(enableAuto ? null : botId);
  }

  /** Each crew member has its own spot in a room so they never overlap. */
  private workSpot(taskId: TaskId, crewId: string): WalkTarget {
    const slot = this.session.state.crew.findIndex((member) => member.id === crewId);
    const room = this.rooms.get(taskId);
    if (!room) return { spot: PLAYER_IDLE_SPOT, door: null };
    return { spot: room.workSpot(slot), door: room.door };
  }

  private showFloatingText(taskId: TaskId, message: string, color: number): void {
    const room = this.rooms.get(taskId);
    if (!room) return;
    const { x, y, width, height } = room.rect;
    floatText(this, x + width / 2, y + height / 2, message, color);
  }

  /** Spec 15 — The player drives the rover out; the base keeps running meanwhile. */
  private sendRover(): void {
    if (this.runEnded) return;
    if (this.minigameOpen || this.playerBusy) {
      floatText(this, GARAGE_SPOT.x, GARAGE_SPOT.y - 24, t('rover.busy'), PALETTE.alert);
      return;
    }
    if (!canStartExpedition(this.session.state)) {
      const message = this.session.state.roverOut ? t('rover.away') : t('hud.noEnergy');
      floatText(this, GARAGE_SPOT.x, GARAGE_SPOT.y - 24, message, PALETTE.alert);
      return;
    }
    this.playerBusy = true;
    this.player.walkTo({ spot: GARAGE_SPOT, door: null }, () => {
      if (this.runEnded) return;
      this.minigameOpen = true;
      launchRoverTrip(this, this.session, this.locationId, () => this.freePlayer());
    });
  }

  /** The X of the base: back to the map, without saving this run's result. */
  private leaveRun(): void {
    this.runEnded = true;
    OVERLAY_KEYS.forEach((key) => this.scene.stop(key));
    this.scene.start(SCENE_KEYS.map);
  }

  private endRun(): void {
    this.runEnded = true;
    OVERLAY_KEYS.forEach((key) => this.scene.stop(key));
    finishRun(this, this.session);
  }
}
