import Phaser from 'phaser';
import { INTRO_BALANCE } from '../../config/balance';
import { photoTextureKey } from '../../content/locationPhotos';
import { t } from '../../i18n';
import { setCoverPhoto } from '../../ui/coverPhoto';
import {
  CABIN_DASHBOARD_SCREEN,
  GAME_HEIGHT,
  GAME_WIDTH,
  LANDING_SEATED_GUIDE,
  LANDING_SEATED_PLAYER,
  LANDING_WINDOW,
} from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addGlowText } from '../../ui/screenUi';
import { SPRITE_SCALE } from '../../ui/sprites';
import { addScanlines } from '../../ui/techFrame';
import { preloadCabinArt } from '../cabin/cabinArt';
import { drawCabinScreens } from '../cabin/cabinView';
import { locationText } from '../map/locationText';
import { SCENE_KEYS } from '../sceneKeys';
import { describeLanding, type LandingFrame } from './landingTimeline';
import { addLandingBanner } from './landingUi';

/**
 * Spec 19, scene 5 — Landing, seen from the pilot seats. The window goes from the whole planet
 * to the real photo of the chosen place, the cabin grows toward the window, the ship shakes,
 * a warning light blinks, the rockets raise dust, and then everything stops: we are there.
 * Every number of the sequence comes from landingTimeline.ts; this scene only draws it.
 */
export interface LandingSceneData {
  locationId: string;
}

const SEATED_EXTRA_SHAKE = 0.6;
/** The altitude is small and sharp, to fit the dashboard's little screen. */
const ALTITUDE_TEXT = { scale: 0.6, resolution: 4 } as const;
const ALTITUDE_TOP_SHARE = 0.3;

export class LandingScene extends Phaser.Scene {
  private locationId = '';
  private elapsedMs = 0;
  private landed = false;
  private globe!: Phaser.GameObjects.Image;
  private place!: Phaser.GameObjects.Image;
  private heat!: Phaser.GameObjects.Rectangle;
  private dust!: Phaser.GameObjects.Rectangle;
  private warning!: Phaser.GameObjects.Rectangle;
  private altitude!: Phaser.GameObjects.Text;
  private seated: Phaser.GameObjects.Image[] = [];
  private world!: Phaser.GameObjects.Container;
  private ui!: Phaser.GameObjects.Container;

  constructor() {
    super(SCENE_KEYS.landing);
  }

  preload(): void {
    preloadCabinArt(this.load);
  }

  create(data: LandingSceneData): void {
    this.locationId = data.locationId;
    this.elapsedMs = 0;
    this.landed = false;
    this.world = this.add.container(0, 0);
    this.ui = this.add.container(0, 0).setDepth(100);
    this.buildCabin();
    this.splitCameras();
    const place = locationText(this.locationId, 'name');
    const banner = addLandingBanner(this, t('landing.confirmed', { place }), t('landing.prepare'));
    this.ui.add(banner);
    this.time.delayedCall(INTRO_BALANCE.landingDurationMs * 0.3, () => banner.destroy());
  }

  update(_time: number, deltaMs: number): void {
    if (this.landed) return;
    this.elapsedMs += deltaMs;
    const frame = describeLanding(this.elapsedMs / INTRO_BALANCE.landingDurationMs);
    this.drawFrame(frame);
    if (frame.done) this.touchDown();
  }

  /** The window layers: whole planet, the place's photo, heat glow and rocket dust. */
  private buildWindow(): void {
    this.globe = this.add.image(0, 0, 'marsGlobe').setOrigin(0);
    this.place = this.add.image(0, 0, photoTextureKey(this.locationId)).setOrigin(0);
    const { x, y, width, height } = LANDING_WINDOW;
    this.heat = this.add.rectangle(x, y, width, height, PALETTE.marsLight).setOrigin(0);
    this.dust = this.add.rectangle(x, y, width, height, PALETTE.sand).setOrigin(0);
    this.world.add([this.globe, this.place, this.heat, this.dust]);
  }

  private buildCabin(): void {
    this.buildWindow();
    const screen = CABIN_DASHBOARD_SCREEN;
    const screens = drawCabinScreens(this);
    // On the upper half of the dashboard screen: the joystick covers the lower half.
    this.altitude = this.addAltitude(
      screen.x + screen.width / 2,
      screen.y + ALTITUDE_TOP_SHARE * screen.height,
    );
    const cabin = this.add.image(0, 0, 'cabin').setOrigin(0).setScale(SPRITE_SCALE);
    this.seated = [
      this.add.image(LANDING_SEATED_GUIDE.x, LANDING_SEATED_GUIDE.y, 'guideSeated'),
      this.add.image(LANDING_SEATED_PLAYER.x, LANDING_SEATED_PLAYER.y, 'playerSeated'),
    ].map((image) => image.setOrigin(0).setScale(SPRITE_SCALE));
    this.warning = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, PALETTE.sun, 0).setOrigin(0);
    this.world.add([...screens, this.altitude, cabin, ...this.seated, this.warning]);
  }

  private addAltitude(x: number, y: number): Phaser.GameObjects.Text {
    const text = addGlowText(this, x, y, '', { color: PALETTE.white });
    return text.setResolution(ALTITUDE_TEXT.resolution).setScale(ALTITUDE_TEXT.scale);
  }

  /** The cabin zooms toward the window; texts and buttons stay put on their own camera. */
  private splitCameras(): void {
    const uiCamera = this.cameras.add(0, 0, this.scale.width, this.scale.height);
    uiCamera.ignore(this.world);
    this.cameras.main.ignore(this.ui);
    addScanlines(this);
    this.children.list
      .filter((child) => child !== this.world && child !== this.ui)
      .forEach((child) => {
        this.cameras.main.ignore(child);
      });
  }

  private drawFrame(frame: LandingFrame): void {
    setCoverPhoto(this.globe, LANDING_WINDOW, frame.globeZoom).setAlpha(frame.globeAlpha);
    setCoverPhoto(this.place, LANDING_WINDOW, frame.placeZoom).setAlpha(frame.placeAlpha);
    this.heat.setAlpha(frame.heatAlpha);
    this.dust.setAlpha(frame.dustAlpha);
    this.warning.setAlpha(frame.warningAlpha);
    this.altitude.setText(`${t('landing.altitude')}\n${frame.altitudeM}`);
    const camera = this.cameras.main;
    // Bounds keep the zoom and the shaking from showing anything outside the cabin.
    camera.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT).setZoom(frame.cameraZoom);
    const windowCenterX = LANDING_WINDOW.x + LANDING_WINDOW.width / 2;
    const windowCenterY = LANDING_WINDOW.y + LANDING_WINDOW.height / 2;
    camera.centerOn(
      Phaser.Math.Linear(GAME_WIDTH / 2, windowCenterX, frame.cameraPull) +
        this.jitter(frame.shakePx),
      Phaser.Math.Linear(GAME_HEIGHT / 2, windowCenterY, frame.cameraPull) +
        this.jitter(frame.shakePx),
    );
    // The seated astronauts bounce a bit more than the ship.
    const seatShake = frame.shakePx * SEATED_EXTRA_SHAKE;
    this.seated.forEach((image, index) => {
      const spot = index === 0 ? LANDING_SEATED_GUIDE : LANDING_SEATED_PLAYER;
      image.setPosition(spot.x + this.jitter(seatShake), spot.y + this.jitter(seatShake));
    });
  }

  private jitter(amount: number): number {
    return amount > 0 ? Phaser.Math.FloatBetween(-amount, amount) : 0;
  }

  /** Everything stays still for a moment, the screen goes black and the base fades in. */
  private touchDown(): void {
    this.landed = true;
    this.drawFrame(describeLanding(1));
    this.time.delayedCall(INTRO_BALANCE.landingStillMs, () => {
      this.cameras.cameras.forEach((camera) => camera.fadeOut(INTRO_BALANCE.landingFadeMs));
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
        this.openBase(),
      );
    });
  }

  private openBase(): void {
    const base = this.scene.get(SCENE_KEYS.base);
    base.events.once(Phaser.Scenes.Events.CREATE, () =>
      base.cameras.main.fadeIn(INTRO_BALANCE.landingFadeMs),
    );
    this.scene.start(SCENE_KEYS.base, { locationId: this.locationId });
  }
}
