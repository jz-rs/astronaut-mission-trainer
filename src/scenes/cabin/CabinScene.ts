import Phaser from 'phaser';
import { INTRO_BALANCE } from '../../config/balance';
import { t, type TranslationKey } from '../../i18n';
import { loadProgress, saveProgress } from '../../services/progressStorage';
import { addBackButton } from '../../ui/backButton';
import {
  CABIN_BACK_BUTTON,
  CABIN_GUIDE_SCALE,
  CABIN_GUIDE_SPOT,
  CABIN_CONSOLE_OUTLINE,
  CABIN_DASHBOARD_SCREEN,
  CABIN_DASHBOARD_ZONE,
  CABIN_TABLET_ZONE,
  CABIN_WINDOW,
  type Rect,
} from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addScanlines } from '../../ui/techFrame';
import { drawRouteMap } from '../monitor/routeMap';
import { SCENE_KEYS } from '../sceneKeys';
import { INTRO_PHOTOS, preloadCabinArt, type CabinArtKey } from './cabinArt';
import {
  addCabinBackground,
  addHighlight,
  addPhotoCredit,
  addWindowPhoto,
  drawCabinScreens,
} from './cabinView';
import { addFloatingItems } from './floatingItems';
import { addGuideBubble } from './guideBubble';
import { addGlassGlow, addTabletHaloPulse } from './artGlow';
import { showGuideMessage } from './guideMessage';
import { showWelcomeExtra, WELCOME_STEPS, type CabinTarget } from './welcomeScript';

/**
 * Spec 19, scenes 1 and 3 — The ship cabin, fixed: nothing walks, a kid taps objects.
 * The window shows real Mars; the guide welcomes the player the first time; the tablet opens
 * the mission manual and the dashboard under the window opens the destination console. Tapping the guide replays
 * the welcome. Nothing here uses mission time.
 */
export interface CabinSceneData {
  /** The manual was just finished for the first time: the guide points at the monitor. */
  manualJustDone?: boolean;
}

const TARGET_AREAS: Record<CabinTarget, Rect> = {
  window: CABIN_WINDOW,
  tablet: CABIN_TABLET_ZONE,
  monitor: CABIN_CONSOLE_OUTLINE,
};
const GUIDE_FLOAT_PX = 6;
const GUIDE_DEPTH = 20;
const GUIDE_HALO = { strength: 3, quality: 0.1, distance: 8 } as const;

export class CabinScene extends Phaser.Scene {
  private guide!: Phaser.GameObjects.Image;
  /** Message, highlight and picture of the current guide line; cleared before the next one. */
  private moment: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super(SCENE_KEYS.cabin);
  }

  preload(): void {
    preloadCabinArt(this.load);
  }

  create(data: CabinSceneData = {}): void {
    addWindowPhoto(this, 'marsGlobe', CABIN_WINDOW);
    drawCabinScreens(this);
    drawRouteMap(this, -1, CABIN_DASHBOARD_SCREEN);
    addCabinBackground(this, 'cabin');
    addPhotoCredit(this, CABIN_WINDOW, INTRO_PHOTOS.marsGlobe.credit);
    addTabletHaloPulse(this, 'cabin', CABIN_TABLET_ZONE);
    addFloatingItems(this);
    this.guide = this.addGuide();
    this.addTouchZone(CABIN_TABLET_ZONE, () => this.openManual());
    // Kids tap the big window with Mars too: it opens the same console as the dashboard.
    this.addTouchZone(CABIN_WINDOW, () => this.openMonitor());
    this.addTouchZone(CABIN_DASHBOARD_ZONE, () => this.openMonitor());
    addBackButton(this, CABIN_BACK_BUTTON, 'light', () => this.scene.start(SCENE_KEYS.menu));
    addScanlines(this);
    this.startMoment(data);
  }

  /** What the guide does on arrival depends on how far the player got. */
  private startMoment(data: CabinSceneData): void {
    const progress = loadProgress();
    if (!progress.welcomeSeen) this.showWelcomeStep(0);
    else if (data.manualJustDone) this.say('cabin.manualDone', 'guideThumbsUp', 'monitor');
    else if (!progress.manualDone) this.point('guidePointDown', 'tablet');
    else this.point('guideWave', 'monitor');
  }

  private showWelcomeStep(index: number): void {
    const step = WELCOME_STEPS[index];
    if (!step) {
      this.finishWelcome();
      return;
    }
    this.point(step.pose, step.highlight);
    if (step.extra) this.moment.push(showWelcomeExtra(this, step.extra));
    const isLast = index === WELCOME_STEPS.length - 1;
    this.moment.push(
      showGuideMessage(this, {
        text: t(step.text),
        step: { current: index, total: WELCOME_STEPS.length },
        tailX: this.guide.x,
        onNext: () => this.showWelcomeStep(index + 1),
        // Skipping the welcome never skips the manual: it jumps to the line that asks for it.
        onSkip: isLast ? undefined : () => this.showWelcomeStep(WELCOME_STEPS.length - 1),
      }),
    );
  }

  private finishWelcome(): void {
    saveProgress({ ...loadProgress(), welcomeSeen: true });
    const { manualDone } = loadProgress();
    this.point(manualDone ? 'guideWave' : 'guidePointDown', manualDone ? 'monitor' : 'tablet');
  }

  /** The console stays locked until the whole manual was read: the guide says so, in red. */
  private warnManualFirst(): void {
    this.point('guidePointDown', 'tablet');
    const message = showGuideMessage(this, {
      warning: t('cabin.manualFirstWarning'),
      text: t('cabin.manualFirst'),
      tailX: this.guide.x,
      onNext: () => message.destroy(),
    });
    this.moment.push(message);
  }

  /** A single guide line that closes with NEXT, leaving the highlight on. */
  private say(text: TranslationKey, pose: CabinArtKey, target: CabinTarget): void {
    this.point(pose, target);
    const message = showGuideMessage(this, {
      text: t(text),
      tailX: this.guide.x,
      onNext: () => message.destroy(),
    });
    this.moment.push(message);
  }

  private point(pose: CabinArtKey, target?: CabinTarget): void {
    this.moment.forEach((part) => part.destroy());
    this.moment = target ? [this.addTargetLight(target)] : [];
    this.guide.setTexture(pose);
  }

  /** The window and the dashboard screen glow gold along their glass; the tablet gets corners. */
  private addTargetLight(target: CabinTarget): Phaser.GameObjects.GameObject {
    const area = TARGET_AREAS[target];
    return target === 'tablet' ? addHighlight(this, area) : addGlassGlow(this, 'cabin', area);
  }

  private addGuide(): Phaser.GameObjects.Image {
    const guide = this.add
      .image(0, 0, 'guidePointRight')
      .setOrigin(0.5, 0)
      .setScale(CABIN_GUIDE_SCALE);
    // A dark halo separates the white suit from the white cabin walls (WebGL only).
    const { strength, quality, distance } = GUIDE_HALO;
    guide.preFX?.addGlow(PALETTE.night, strength, 0, false, quality, distance);
    guide
      .setPosition(CABIN_GUIDE_SPOT.x + guide.displayWidth / 2, CABIN_GUIDE_SPOT.y)
      .setDepth(GUIDE_DEPTH);
    this.tweens.add({
      targets: guide,
      y: guide.y - GUIDE_FLOAT_PX,
      yoyo: true,
      repeat: -1,
      duration: INTRO_BALANCE.guideFloatMs,
      ease: 'Sine.InOut',
    });
    guide.setInteractive({ useHandCursor: true }).on('pointerup', () => this.showWelcomeStep(0));
    addGuideBubble(this, guide, () => this.showWelcomeStep(0));
    return guide;
  }

  private addTouchZone(area: Rect, onTap: () => void): void {
    const zone = this.add.zone(area.x, area.y, area.width, area.height).setOrigin(0);
    zone.setInteractive({ useHandCursor: true }).on('pointerup', onTap);
  }

  /** The first manual is mandatory: until it is done the guide sends the kid back to the tablet. */
  private openMonitor(): void {
    const progress = loadProgress();
    if (progress.manualDone) {
      this.scene.start(SCENE_KEYS.monitor);
      return;
    }
    saveProgress({ ...progress, welcomeSeen: true });
    this.warnManualFirst();
  }

  private openManual(): void {
    saveProgress({ ...loadProgress(), welcomeSeen: true });
    this.scene.start(SCENE_KEYS.manual);
  }
}
