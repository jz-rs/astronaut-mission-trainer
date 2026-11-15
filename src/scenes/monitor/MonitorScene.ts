import Phaser from 'phaser';
import { LOCATIONS } from '../../content/locations';
import {
  countTotalStars,
  isLocationUnlocked,
  landingBlocker,
  starsMissing,
} from '../../core/progression';
import { loadProgress } from '../../services/progressStorage';
import { addScanlines } from '../../ui/techFrame';
import { SPRITE_SCALE } from '../../ui/sprites';
import { consoleButtonTexture, LAND_LOCKED_TEXTURE, preloadCabinArt } from '../cabin/cabinArt';
import { SCENE_KEYS } from '../sceneKeys';
import { createConsoleButton, type ConsoleButton } from './consoleButton';
import { drawMonitorScreens, type BigScreenView, type MonitorState } from './monitorScreens';

/**
 * Spec 18, scene 4 — The destination console, seen up close. Physical buttons browse the
 * places (every one can be explored), show the photo in big or the goals, and LAND.
 * LAND only works after the first manual and on unlocked places; otherwise the screen says
 * what is still missing. It replaces the old Mars map as the way to pick a destination.
 */
const BLOCKED_SHAKE_PX = 3;

/** The place on screen is remembered while the game is open, so coming back keeps it. */
let lastLocationIndex: number | null = null;

export class MonitorScene extends Phaser.Scene {
  private locationIndex = 0;
  private view: BigScreenView = 'summary';
  private screenParts: Phaser.GameObjects.GameObject[] = [];
  private landButton!: ConsoleButton;

  constructor() {
    super(SCENE_KEYS.monitor);
  }

  preload(): void {
    preloadCabinArt(this.load);
  }

  create(): void {
    this.locationIndex = lastLocationIndex ?? this.nextLocationToPlay();
    this.view = 'summary';
    this.screenParts = [];
    this.add.image(0, 0, 'console').setOrigin(0).setScale(SPRITE_SCALE).setDepth(10);
    createConsoleButton(this, 'back', () => this.scene.start(SCENE_KEYS.cabin)).sprite.setDepth(11);
    createConsoleButton(this, 'previous', () => this.browse(-1)).sprite.setDepth(11);
    createConsoleButton(this, 'next', () => this.browse(1)).sprite.setDepth(11);
    createConsoleButton(this, 'photo', () => this.toggleView('photo')).sprite.setDepth(11);
    createConsoleButton(this, 'info', () => this.toggleView('goals')).sprite.setDepth(11);
    this.landButton = createConsoleButton(this, 'land', () => this.land());
    this.landButton.sprite.setDepth(11);
    addScanlines(this);
    this.refresh();
  }

  /** The first unlocked place without stars yet, like the pulsing marker of the old map. */
  private nextLocationToPlay(): number {
    const progress = loadProgress();
    const totalStars = countTotalStars(progress.starsByLocation);
    const next = LOCATIONS.findIndex(
      (location) =>
        isLocationUnlocked(location, totalStars) && !progress.starsByLocation[location.id],
    );
    return Math.max(next, 0);
  }

  private browse(direction: -1 | 1): void {
    this.locationIndex = Phaser.Math.Wrap(this.locationIndex + direction, 0, LOCATIONS.length);
    lastLocationIndex = this.locationIndex;
    this.view = 'summary';
    this.refresh();
  }

  /** Pressing PHOTO or INFO again goes back to the summary. */
  private toggleView(view: BigScreenView): void {
    this.view = this.view === view ? 'summary' : view;
    this.refresh();
  }

  private currentState(): MonitorState {
    const progress = loadProgress();
    const location = LOCATIONS[this.locationIndex] ?? LOCATIONS[0];
    if (!location) throw new Error('data/locations.json has no locations');
    const totalStars = countTotalStars(progress.starsByLocation);
    return {
      location,
      order: this.locationIndex + 1,
      total: LOCATIONS.length,
      view: this.view,
      blocker: landingBlocker(location, totalStars, progress.manualDone),
      stars: progress.starsByLocation[location.id] ?? 0,
      record: progress.bestScoreByLocation[location.id],
      missingStars: starsMissing(location, totalStars),
    };
  }

  private refresh(): void {
    this.screenParts.forEach((part) => part.destroy());
    const state = this.currentState();
    this.screenParts = drawMonitorScreens(this, state);
    this.landButton.setRestingTexture(
      state.blocker ? LAND_LOCKED_TEXTURE : consoleButtonTexture('aterrizar'),
    );
  }

  private land(): void {
    const state = this.currentState();
    if (state.blocker) {
      this.showWhyBlocked();
      return;
    }
    lastLocationIndex = this.locationIndex;
    this.scene.start(SCENE_KEYS.landing, { locationId: state.location.id });
  }

  /** The red line on the screen blinks and the button shakes: "not yet, and this is why". */
  private showWhyBlocked(): void {
    if (this.view !== 'summary') {
      this.view = 'summary';
      this.refresh();
    }
    const status = this.screenParts.find((part) => part.name === 'status');
    if (status)
      this.tweens.add({ targets: status, alpha: 0, yoyo: true, repeat: 2, duration: 120 });
    const { sprite } = this.landButton;
    this.tweens.add({
      targets: sprite,
      x: sprite.x + BLOCKED_SHAKE_PX,
      yoyo: true,
      repeat: 3,
      duration: 40,
    });
  }
}
