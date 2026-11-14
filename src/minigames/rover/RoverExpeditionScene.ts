import Phaser from 'phaser';
import { ROVER_BALANCE } from '../../config/balance';
import { t, type TranslationKey } from '../../i18n';
import { addCloseButton } from '../../ui/closeButton';
import { drawFramedPhoto } from '../../ui/framedPhoto';
import { addIconLabel, type IconLabel } from '../../ui/iconLabel';
import {
  FONT_SIZE,
  GAME_HEIGHT,
  GAME_WIDTH,
  HUD_HEIGHT,
  MINIGAME_AREA,
  MINIGAME_PANEL,
  type Rect,
} from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addScanlines, drawTechPanel } from '../../ui/techFrame';
import { addText } from '../../ui/text';
import { showGestureHint } from '../gestureHint';
import { RoverTrack } from './RoverTrack';

/**
 * Spec 15 — Rover trip (~15 s) over the base, which keeps running meanwhile (real risk).
 * One gesture only: tap left/right of the rover to change lane, to catch shiny stones (samples)
 * by driving over them and to dodge rocks. At the end it shows
 * the real photo of the place, framed, and reports how many samples came back.
 * The X brings the rover back at once with the samples it already has (the energy was paid).
 */
export interface RoverStartData {
  locationId: string;
  onFinish: (samples: number) => void;
}

const RESULT_DEPTH = 100;
const PHOTO: Rect = { x: MINIGAME_AREA.x + 30, y: MINIGAME_AREA.y + 30, width: 200, height: 140 };
const TIME_BAR_HEIGHT = 6;
const ICON_SIZE = 20;
/** The hand shows a tap beside the rover: that is how it changes lane. */
const HINT_OFFSET_X = 70;

export class RoverExpeditionScene extends Phaser.Scene {
  static readonly KEY = 'RoverExpeditionScene';
  private locationId = '';
  private onFinish: RoverStartData['onFinish'] = () => undefined;
  private track!: RoverTrack;
  private samples = 0;
  private elapsedMs = 0;
  private stunnedMs = 0;
  private finished = false;
  private counter!: IconLabel;
  private timeBar!: Phaser.GameObjects.Graphics;

  constructor() {
    super(RoverExpeditionScene.KEY);
  }

  init(data: RoverStartData): void {
    this.locationId = data.locationId;
    this.onFinish = data.onFinish;
    this.samples = 0;
    this.elapsedMs = 0;
    this.stunnedMs = 0;
    this.finished = false;
  }

  create(): void {
    const dim = this.add.rectangle(0, HUD_HEIGHT, GAME_WIDTH, GAME_HEIGHT, PALETTE.night);
    dim.setOrigin(0).setAlpha(0.55).setInteractive(); // swallows taps meant for the base
    drawTechPanel(this.add.graphics(), MINIGAME_PANEL, PALETTE.sun);
    addIconLabel(
      this,
      GAME_WIDTH / 2,
      MINIGAME_PANEL.y + 18,
      'rover',
      ICON_SIZE,
      t('rover.instruction'),
      {
        size: FONT_SIZE.small,
      },
    );
    this.timeBar = this.add.graphics();
    this.track = new RoverTrack(this);
    this.counter = addIconLabel(
      this,
      MINIGAME_AREA.x + 50,
      MINIGAME_AREA.y + 20,
      'sampleTube',
      ICON_SIZE,
      '0',
      { color: PALETTE.sun },
    );
    this.listenToTaps();
    showGestureHint(this, { x: this.track.roverX - HINT_OFFSET_X, y: this.track.rover.y });
    addScanlines(this);
  }

  /** Taps anywhere steer, except on the X, which only closes. */
  private listenToTaps(): void {
    const closeButton = addCloseButton(this, () => this.exit());
    this.input.on(
      'pointerdown',
      (pointer: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) => {
        if (!over.includes(closeButton)) this.handleTap(pointer);
      },
    );
  }

  update(_time: number, deltaMs: number): void {
    if (this.finished) return;
    this.elapsedMs += deltaMs;
    this.drawTimeBar();
    if (this.elapsedMs >= ROVER_BALANCE.durationMs) {
      this.finish();
      return;
    }
    this.stunnedMs = Math.max(0, this.stunnedMs - deltaMs);
    for (const hit of this.track.update(deltaMs)) {
      if (hit === 'rock') this.hitRock();
      else this.setSamples(this.samples + 1);
    }
  }

  private handleTap(pointer: Phaser.Input.Pointer): void {
    if (this.finished || this.stunnedMs > 0) return;
    this.track.moveRover(pointer.x < this.track.roverX ? -1 : 1);
  }

  private hitRock(): void {
    this.setSamples(Math.max(0, this.samples - ROVER_BALANCE.samplesLostPerRock));
    this.stunnedMs = ROVER_BALANCE.rockStunMs;
    this.cameras.main.shake(200, 0.01);
  }

  private setSamples(samples: number): void {
    this.samples = samples;
    this.counter.setText(`${samples}`);
  }

  private drawTimeBar(): void {
    const left = Math.max(0, 1 - this.elapsedMs / ROVER_BALANCE.durationMs);
    const y = MINIGAME_PANEL.y + 34;
    this.timeBar.clear();
    this.timeBar.fillStyle(PALETTE.metalDark, 1);
    this.timeBar.fillRect(MINIGAME_AREA.x, y, MINIGAME_AREA.width, TIME_BAR_HEIGHT);
    this.timeBar.fillStyle(left < 0.25 ? PALETTE.alert : PALETTE.cyan, 1);
    this.timeBar.fillRect(MINIGAME_AREA.x, y, MINIGAME_AREA.width * left, TIME_BAR_HEIGHT);
  }

  private exit(): void {
    if (this.finished) return;
    this.finished = true;
    this.onFinish(this.samples);
    this.scene.stop();
  }

  private finish(): void {
    this.finished = true;
    this.showResult();
    this.time.delayedCall(ROVER_BALANCE.resultDisplayMs, () => {
      this.onFinish(this.samples);
      this.scene.stop();
    });
  }

  /** The prize: the real place on Mars, framed, plus what was collected. */
  private showResult(): void {
    const cover = this.add.graphics().setDepth(RESULT_DEPTH);
    drawTechPanel(cover, MINIGAME_AREA, PALETTE.sun, PALETTE.space);
    const photo = this.add.container(0, 0, drawFramedPhoto(this, this.locationId, PHOTO));
    photo.setDepth(RESULT_DEPTH);
    const textX = PHOTO.x + PHOTO.width + 140;
    addText(this, textX, PHOTO.y + 40, t('rover.samples', { samples: this.samples }), {
      size: FONT_SIZE.medium,
      color: PALETTE.sun,
    }).setDepth(RESULT_DEPTH);
    const why = `location.${this.locationId}.why` as TranslationKey;
    addText(this, textX, PHOTO.y + 100, t(why), {
      size: FONT_SIZE.small,
      color: PALETTE.cyan,
      wrapWidth: 240,
    }).setDepth(RESULT_DEPTH);
  }
}
