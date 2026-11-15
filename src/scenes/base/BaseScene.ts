import Phaser from 'phaser';
import { CREW_BALANCE, NIGHT_BALANCE, TASK_BALANCE } from '../../config/balance';
import { drawEventsForRun } from '../../content/events';
import { getLocation } from '../../content/locations';
import { GameSession } from '../../core/GameSession';
import { PLAYER_ID } from '../../core/run';
import { canStartExpedition } from '../../core/expedition';
import { canAffordTask } from '../../core/stats';
import { isAfterSunset, isTooDarkFor, nightAmount } from '../../core/daylight';
import { musicMood } from '../../core/musicMood';
import { TASK_IDS, type TaskId, type TaskNews } from '../../core/types';
import { t } from '../../i18n';
import type { MinigameResult, MinigameStartData } from '../../minigames/MinigameScene';
import { MINIGAME_KEYS, MINIGAME_REGISTRY } from '../../minigames/registry';
import { RoverExpeditionScene } from '../../minigames/rover/RoverExpeditionScene';
import { loadProgress } from '../../services/progressStorage';
import { recordMinigameResult } from '../../services/progressUpdates';
import { GARAGE_SPOT, PLAYER_IDLE_SPOT, ROOM_LAYOUTS } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { floatText } from '../../ui/floatingText';
import { preloadBiome } from '../../ui/biomes';
import { addScanlines } from '../../ui/techFrame';
import { setMusicMood } from '../../ui/backgroundMusic';
import { finishRun } from '../runEnd';
import type { ManualSceneData } from '../manual/ManualScene';
import { SCENE_KEYS } from '../sceneKeys';
import { AstronautSprite, type WalkTarget } from './AstronautSprite';
import { drawBaseMap } from './baseMap';
import { BotFaces } from './BotFaces';
import { BotsView } from './BotsView';
import { preloadCrisisArt } from './crisis/crisisArt';
import { EventAnnouncer } from './EventAnnouncer';
import { ExitRunView } from './ExitRunView';
import { addManualButton, preloadManualButton } from './ManualButton';
import { GarageView } from './GarageView';
import type { MapStatusSprites } from './MapStatusSprites';
import { TeamworkViews } from './TeamworkViews';
import { createPickRoomHint } from './pickRoomHint';
import { launchRoverTrip } from './roverTrip';
import { Hud } from './Hud';
import { NightSign } from './NightSign';
import { RoomView } from './RoomView';
import { StationLights } from './StationLights';
import { TaskEffectsView } from './TaskEffectsView';
import { TutorialGuide } from './TutorialGuide';
import { addFrost, addWeather } from './WeatherView';
import { addYouTag } from './youTag';
import { SolarAirlock } from './SolarAirlock';

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
  private nightSign!: NightSign;
  private stationLights!: StationLights;
  private mapStatus!: MapStatusSprites;
  private player!: AstronautSprite;
  private solarAirlock!: SolarAirlock;
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
  /** A minigame or rover trip reached during a crisis opens once the crisis screen is gone. */
  private waitingLaunch: (() => void) | null = null;
  private locationId = DEFAULT_LOCATION_ID;

  constructor() {
    super(SCENE_KEYS.base);
  }

  init(data: BaseSceneData = {}): void {
    this.locationId = data.locationId ?? DEFAULT_LOCATION_ID;
    this.freePlayer();
    this.selectedBotId = null;
    this.runEnded = false;
    this.waitingLaunch = null;
    this.rooms = new Map();
  }

  /** The images of this level (map, rooms, frost); the rest of the kit was loaded at boot. */
  preload(): void {
    preloadBiome(this, this.locationId);
    preloadManualButton(this);
    preloadCrisisArt(this.load);
  }

  create(): void {
    this.session = this.createSession();
    this.createMap();
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
    this.createTopLayer();
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

  private createMap(): void {
    this.mapStatus = drawBaseMap(this, this.locationId);
    this.solarAirlock = new SolarAirlock(this);
    this.stationLights = new StationLights(this); // night goes under the signs and astronauts
    this.stationLights.setNight(this.currentNight());
  }

  /** Weather falls over the base, the HUD goes on top, and the pole's frost covers even the HUD. */
  private createTopLayer(): void {
    this.nightSign = new NightSign(this, 'solar-panels');
    addWeather(this, this.locationId);
    this.hud = new Hud(this);
    this.botFaces = new BotFaces(this, (botId) => this.toggleAuto(botId));
    addManualButton(this, () => this.openManual());
    addFrost(this, this.locationId);
  }

  /**
   * Nobody goes to the panels if the Sun sets before they are done (`workMs`): says why, so the
   * kid isn't left wondering.
   */
  private saysNoSun(taskId: TaskId, workMs: number): boolean {
    const state = this.session.state;
    if (!isTooDarkFor(state, taskId, workMs)) return false;
    const message = isAfterSunset(state) ? t('hud.noSun') : t('hud.sunsetSoon');
    this.showFloatingText(taskId, message, PALETTE.white);
    return true;
  }

  /** After half the sol it gets dark (core/daylight.ts). */
  private currentNight(): number {
    return nightAmount(this.session.state.solElapsedMs);
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
    if (!this.isPaused()) this.session.update(deltaMs);
    const { state } = this.session;
    this.taskEffects.update(state, (news) => this.handleTaskEffectShown(news));
    this.hud.update(state);
    this.stationLights.setNight(this.currentNight());
    this.nightSign.setVisible(isAfterSunset(state));
    setMusicMood(musicMood(state));
    this.mapStatus.update(state.stats);
    this.botFaces.update(state);
    this.bots.update(state, this.selectedBotId);
    this.solarAirlock.update();
    this.eventAnnouncer.update(state);
    this.garage.update(state);
    this.teamwork.update(state);
    this.launchWaitingScene();
    for (const room of this.rooms.values()) room.update(state.stats, time);
    if (this.session.isOver()) this.endRun();
  }

  /** The tutorial, the exit question and the crisis cards stop the clock while they are read. */
  private isPaused(): boolean {
    return this.tutorial.pausesGame || this.exitRun.isAsking || this.teamwork.pausesGame;
  }

  private handleRoomTap(taskId: TaskId): void {
    if (this.runEnded) return;
    if (this.session.state.shelter) {
      this.takeShelter(taskId);
      return;
    }
    if (this.minigameOpen) return;
    this.tutorial.roomTapped();
    if (this.selectedBotId) {
      this.orderBot(this.selectedBotId, taskId);
      return;
    }
    this.sendPlayer(taskId);
  }

  /** Spec 16 — During a solar storm the only room that matters is the shield room. */
  private takeShelter(taskId: TaskId): void {
    if (taskId !== 'shield-wall') return;
    this.session.dispatch({ type: 'enterShelter', crewId: PLAYER_ID });
    if (this.playerBusy) return; // already walking somewhere: the tap still counts
    this.playerBusy = true;
    this.player.walkTo(this.workSpot(taskId, PLAYER_ID), () => this.freePlayer());
  }

  private sendPlayer(taskId: TaskId): void {
    if (this.playerBusy || this.saysNoSun(taskId, NIGHT_BALANCE.playerSolarWorkMs)) return;
    if (!canAffordTask(this.session.state.stats, taskId)) {
      this.showFloatingText(taskId, t('hud.noEnergy'), PALETTE.alert);
      return;
    }
    this.playerBusy = true;
    this.player.walkTo(this.workSpot(taskId, PLAYER_ID), () =>
      this.launchWhenCrisisEnds(() => this.openMinigame(taskId)),
    );
  }

  /**
   * Spec 16 — A minigame launched under the crisis tablet would pause the base to show its card,
   * hidden under the tablet, and freeze both. So it waits until the crisis screen is gone.
   */
  private launchWhenCrisisEnds(launch: () => void): void {
    if (this.teamwork.isShowing) this.waitingLaunch = launch;
    else launch();
  }

  private launchWaitingScene(): void {
    if (!this.waitingLaunch || this.teamwork.isShowing) return;
    const launch = this.waitingLaunch;
    this.waitingLaunch = null;
    launch();
  }

  private openMinigame(taskId: TaskId): void {
    if (this.runEnded) return;
    this.minigameOpen = true;
    const stat = TASK_BALANCE[taskId].stat;
    const data: MinigameStartData = {
      taskId,
      difficulty: this.session.state.location.decayMultiplier[stat] ?? 1,
      locationId: this.locationId,
      nightAmount: this.currentNight(),
      readEnvironment: () => ({
        solElapsedMs: this.session.state.solElapsedMs,
        nightAmount: this.currentNight(),
        dustStorm: this.session.state.events.some(
          (event) =>
            event.type === 'dust-storm' &&
            event.status === 'hit' &&
            event.hitSol === this.session.state.sol,
        ),
      }),
      onFinish: (result) => this.handleMinigameFinished(result),
      onExit: () => this.backFromScene(), // the X: nothing done, nothing spent
    };
    this.enterScene();
    this.scene.launch(MINIGAME_REGISTRY[taskId].key, data);
  }

  /** The mission manual over the base. The whole base pauses (time, bars, taps) until it closes. */
  private openManual(): void {
    // The crisis tablet is already on screen: a second tablet on top would hide it.
    if (this.minigameOpen || this.runEnded || this.exitRun.isAsking || this.teamwork.isShowing) {
      return;
    }
    const data: ManualSceneData = { onClose: () => this.scene.resume() };
    this.scene.launch(SCENE_KEYS.manual, data);
    this.scene.bringToTop(SCENE_KEYS.manual); // scene order can change, the tablet goes on top
    this.scene.pause();
  }

  private freePlayer(): void {
    this.minigameOpen = false;
    this.playerBusy = false;
  }

  /** Spec 16 — While the player is inside a minigame or the rover trip, crises wait. */
  private enterScene(): void {
    this.session.dispatch({ type: 'setBusy', crewId: PLAYER_ID, busy: true });
  }

  private backFromScene(): void {
    this.session.dispatch({ type: 'setBusy', crewId: PLAYER_ID, busy: false });
    this.freePlayer();
  }

  private handleMinigameFinished({ taskId, performance }: MinigameResult): void {
    this.backFromScene();
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
    } else if (this.saysNoSun(taskId, CREW_BALANCE.botTaskDurationMs)) {
      // the panels wait for tomorrow's Sun; saysNoSun already told the kid why
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
    return {
      spot: room.workSpot(slot),
      door: room.door,
      outdoorRoute: ROOM_LAYOUTS[taskId].outdoorRoute,
    };
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
    this.player.walkTo({ spot: GARAGE_SPOT, door: null }, () =>
      this.launchWhenCrisisEnds(() => {
        if (this.runEnded) return;
        this.minigameOpen = true;
        this.enterScene();
        launchRoverTrip(this, this.session, this.locationId, () => this.backFromScene());
      }),
    );
  }

  /** The X of the base: back to the ship, without saving this run's result. */
  private leaveRun(): void {
    this.runEnded = true;
    setMusicMood('calm'); // out of the base (ship, results) the music is calm again
    OVERLAY_KEYS.forEach((key) => this.scene.stop(key));
    this.scene.start(SCENE_KEYS.cabin);
  }

  private endRun(): void {
    this.runEnded = true;
    setMusicMood('calm'); // out of the base (ship, results) the music is calm again
    OVERLAY_KEYS.forEach((key) => this.scene.stop(key));
    finishRun(this, this.session);
  }
}
