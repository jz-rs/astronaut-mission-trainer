import Phaser from 'phaser';
import { ROVER_BALANCE } from '../../config/balance';
import { t } from '../../i18n';
import { SCENE_KEYS } from '../../scenes/sceneKeys';
import { addCloseButton } from '../../ui/closeButton';
import { addIconLabel, type IconLabel } from '../../ui/iconLabel';
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  HUD_HEIGHT,
  MINIGAME_AREA,
  MINIGAME_PANEL,
  type Rect,
} from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addScanlines, drawTechPanel } from '../../ui/techFrame';
import { showGestureHint } from '../gestureHint';
import { showHowToCard } from '../howTo/howToCard';
import { StepGuide } from '../howTo/stepGuide';
import { showRoverResult } from './roverResult';
import {
  drawTripTimeBar,
  flyTubeToCounter,
  sayAboveRover,
  showSavedSamples,
} from './driveFeedback';
import { ROVER_STEPS } from './roverRecipe';
import { TripInstruction } from './tripInstruction';
import { RoverTrack } from './RoverTrack';
import { SampleStorage, type StorageResult } from './SampleStorage';

/**
 * Spec 15 + Mission 5 — A rover trip over the base, which keeps running meanwhile (real risk).
 * First a how-to card (the base waits while the kid reads it). Then ~10 s of driving: tap
 * left/right of the rover to change lane, catch rocks and dodge soft sand. Then the rover stops
 * by a rock to store one sample like Perseverance: drill, tube, seal, shelf (SampleStorage). A sealed tube
 * is one more sample. At the end, the real photo of the place, framed.
 * The X brings the rover back at once with the samples it already has (the energy was paid).
 */
export interface RoverStartData {
  locationId: string;
  onFinish: (samples: number) => void;
}

type TripPhase = 'intro' | 'drive' | 'store' | 'done';

const ICON_SIZE = 20;
/** The hand taps left of the rover (that is how it changes lane), towards the first rock. */
const HINT_OFFSET_X = 70;
const FIRST_ROCK_LANE = 0;
const COUNTER_INSET_X = 40;

export class RoverExpeditionScene extends Phaser.Scene {
  static readonly KEY = 'RoverExpeditionScene';
  private locationId = '';
  private onFinish: RoverStartData['onFinish'] = () => undefined;
  private phase: TripPhase = 'intro';
  private track!: RoverTrack;
  private guide!: StepGuide;
  private storage: SampleStorage | null = null;
  private samples = 0;
  private elapsedMs = 0;
  private stunnedMs = 0;
  private instruction!: TripInstruction;
  private counter!: IconLabel;
  private timeBar!: Phaser.GameObjects.Graphics;
  private closeButton!: Phaser.GameObjects.Container;

  constructor() {
    super(RoverExpeditionScene.KEY);
  }

  init(data: RoverStartData): void {
    this.locationId = data.locationId;
    this.onFinish = data.onFinish;
    this.phase = 'intro';
    this.storage = null;
    this.samples = 0;
    this.elapsedMs = 0;
    this.stunnedMs = 0;
  }

  create(): void {
    const dim = this.add.rectangle(0, HUD_HEIGHT, GAME_WIDTH, GAME_HEIGHT, PALETTE.night);
    dim.setOrigin(0).setAlpha(0.55).setInteractive(); // swallows taps meant for the base
    drawTechPanel(this.add.graphics(), MINIGAME_PANEL, PALETTE.sun);
    this.instruction = new TripInstruction(this);
    this.timeBar = this.add.graphics();
    // The road paints the whole play area, so the step panel goes on top of it.
    this.track = new RoverTrack(this);
    this.guide = new StepGuide(this, MINIGAME_AREA, ROVER_STEPS);
    const counterX = MINIGAME_AREA.x + MINIGAME_AREA.width - COUNTER_INSET_X;
    const counterY = MINIGAME_AREA.y + 20;
    this.counter = addIconLabel(this, counterX, counterY, 'sampleTube', ICON_SIZE, '0', {
      color: PALETTE.sun,
    });
    this.listenToTaps();
    addScanlines(this);
    this.showHowTo();
  }

  /** Like the other missions, the base waits while the card is read; then it runs again. */
  private showHowTo(): void {
    if (this.scene.isActive(SCENE_KEYS.base)) this.scene.pause(SCENE_KEYS.base);
    const howTo = {
      titleKey: 'rover.introTitle',
      startKey: 'rover.start',
      steps: ROVER_STEPS,
    } as const;
    showHowToCard(this, MINIGAME_AREA, howTo, () => {
      this.resumeBase();
      this.phase = 'drive';
      this.track.spawnFirstRock(FIRST_ROCK_LANE);
      showGestureHint(this, { x: this.track.roverX - HINT_OFFSET_X, y: this.track.rover.y });
    });
  }

  private resumeBase(): void {
    if (this.scene.isPaused(SCENE_KEYS.base)) this.scene.resume(SCENE_KEYS.base);
  }

  /** Taps anywhere steer while driving, except on the X, which only closes. */
  private listenToTaps(): void {
    const closeButton = addCloseButton(this, () => this.exit());
    this.closeButton = closeButton;
    this.input.on(
      'pointerdown',
      (pointer: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) => {
        if (!over.includes(closeButton)) this.handleTap(pointer);
      },
    );
  }

  update(_time: number, deltaMs: number): void {
    if (this.phase === 'drive') this.updateDrive(deltaMs);
    else if (this.phase === 'store') this.updateStore(deltaMs);
  }

  private updateDrive(deltaMs: number): void {
    this.elapsedMs += deltaMs;
    drawTripTimeBar(this.timeBar, this.fractionLeft(ROVER_BALANCE.durationMs));
    if (this.elapsedMs >= ROVER_BALANCE.durationMs) {
      this.startStoring();
      return;
    }
    this.stunnedMs = Math.max(0, this.stunnedMs - deltaMs);
    for (const hit of this.track.update(deltaMs)) {
      if (hit === 'sand') this.hitSand();
      else this.catchRock();
    }
  }

  private updateStore(deltaMs: number): void {
    this.elapsedMs += deltaMs;
    drawTripTimeBar(this.timeBar, this.fractionLeft(ROVER_BALANCE.storeDurationMs));
    this.storage?.update(deltaMs);
    if (this.elapsedMs >= ROVER_BALANCE.storeDurationMs) this.finish(this.storage?.stop());
  }

  /** The drive is over: the rover stops by a rock to store samples in tubes. */
  private startStoring(): void {
    this.phase = 'store';
    this.elapsedMs = 0;
    const play: Rect = { ...MINIGAME_AREA, x: this.guide.right };
    play.width = MINIGAME_AREA.x + MINIGAME_AREA.width - play.x;
    this.storage = new SampleStorage(this, play, this.samples, {
      onStep: (step) => this.showStep(step),
      onTube: (tube, total) => this.instruction.showTube(tube, total),
      onDone: (result) => this.finish(result),
    });
  }

  private showStep(step: number): void {
    this.guide.show(step);
    this.instruction.showStep(step);
  }

  private fractionLeft(durationMs: number): number {
    return Math.max(0, 1 - this.elapsedMs / durationMs);
  }

  private handleTap(pointer: Phaser.Input.Pointer): void {
    if (this.phase !== 'drive' || this.stunnedMs > 0) return;
    this.track.moveRover(pointer.x < this.track.roverX ? -1 : 1);
  }

  /** Soft sand: the rover slips for a moment, but keeps the rocks it already has. */
  private hitSand(): void {
    this.stunnedMs = ROVER_BALANCE.sandStuckMs;
    this.track.slip();
    sayAboveRover(this, this.track.rover, t('rover.sandStuck'), PALETTE.sand);
  }

  /** Counted at once (the trip may end mid-flight); the flying tube only shows it. */
  private catchRock(): void {
    this.setSamples(this.samples + 1);
    flyTubeToCounter(this, this.track.rover, this.counter.icon);
  }

  private setSamples(samples: number): void {
    this.samples = samples;
    this.counter.setText(`${samples}`);
  }

  /**
   * The X: the rover comes back at once with everything it has so far (rocks caught and tubes
   * already sealed; a tube still open does not count), and the base never stays paused. The
   * samples are saved right away; a big "+3 saved!" stays a moment so the kid sees it.
   */
  private exit(): void {
    if (this.phase === 'done') return;
    const total = this.totalSamples(this.storage?.stop());
    this.phase = 'done';
    this.resumeBase();
    this.onFinish(total);
    this.closeButton.setVisible(false);
    if (total > 0) showSavedSamples(this, total, () => this.scene.stop());
    else this.scene.stop();
  }

  private totalSamples(tubes: StorageResult = { sealed: 0, contaminated: 0 }): number {
    return this.samples + tubes.sealed * ROVER_BALANCE.sealedTubeSamples;
  }

  /** The base waits while the kid reads the result; only GO ON continues. */
  private finish(tubes: StorageResult = { sealed: 0, contaminated: 0 }): void {
    if (this.phase === 'done') return;
    this.phase = 'done';
    if (this.scene.isActive(SCENE_KEYS.base)) this.scene.pause(SCENE_KEYS.base);
    this.closeButton.setVisible(false);
    const total = this.totalSamples(tubes);
    showRoverResult(this, this.locationId, total, tubes, () => {
      this.resumeBase();
      this.onFinish(total);
      this.scene.stop();
    });
  }
}
