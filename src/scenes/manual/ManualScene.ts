import Phaser from 'phaser';
import { t } from '../../i18n';
import { loadProgress, saveProgress } from '../../services/progressStorage';
import { GAME_HEIGHT, GAME_WIDTH, TABLET_SCREEN } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import {
  createScreenButton,
  drawArrowFace,
  drawCloseFace,
  drawOutlineFace,
  drawScreenScanlines,
  drawSegments,
} from '../../ui/screenUi';
import { SPRITE_SCALE } from '../../ui/sprites';
import { preloadCabinArt } from '../cabin/cabinArt';
import type { CabinSceneData } from '../cabin/CabinScene';
import { SCENE_KEYS } from '../sceneKeys';
import { MANUAL_PAGES } from './manualPages';
import { drawManualPage } from './manualPageView';

/**
 * Spec 19, scene 2 — The mission manual on the tablet, one page per screen.
 * There is no reading timer: seeing every page is enough. The first time the last page is
 * reached the manual counts as done and the guide sends the kid to the monitor.
 * The first read is mandatory, so the X only shows once the manual was finished. On later reads
 * closing early keeps the page, so reopening the tablet continues where the kid left off.
 */
const SCREEN = TABLET_SCREEN;
const FOOTER_Y = SCREEN.y + SCREEN.height - 22;
const ARROW_RADIUS = 12;
const FINISH_BUTTON = { width: 84, height: 26 } as const;

/** Page reached in this visit to the game (not saved: a fresh start opens page 1). */
let lastPageIndex = 0;

export class ManualScene extends Phaser.Scene {
  private pageIndex = 0;
  private pageParts: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super(SCENE_KEYS.manual);
  }

  preload(): void {
    preloadCabinArt(this.load);
  }

  create(): void {
    this.pageIndex = lastPageIndex;
    this.drawTablet();
    this.showPage();
  }

  /** The cabin, dimmed, with the tablet held up close in front of it. */
  private drawTablet(): void {
    this.add.image(0, 0, 'cabin').setOrigin(0).setScale(SPRITE_SCALE);
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, PALETTE.night, 0.6).setOrigin(0);
    this.add.rectangle(SCREEN.x, SCREEN.y, SCREEN.width, SCREEN.height, PALETTE.night).setOrigin(0);
    this.add.image(0, 0, 'tablet').setOrigin(0).setScale(SPRITE_SCALE);
  }

  private showPage(): void {
    this.pageParts.forEach((part) => part.destroy());
    const page = MANUAL_PAGES[this.pageIndex];
    if (!page) return;
    lastPageIndex = this.pageIndex;
    const isLast = this.pageIndex === MANUAL_PAGES.length - 1;
    const scanlines = this.add.graphics();
    drawScreenScanlines(scanlines, SCREEN);
    const dashes = this.add.graphics();
    drawSegments(
      dashes,
      SCREEN.x + SCREEN.width / 2,
      FOOTER_Y,
      this.pageIndex,
      MANUAL_PAGES.length,
    );
    this.pageParts = [
      ...drawManualPage(this, page, this.pageIndex, MANUAL_PAGES.length),
      dashes,
      ...(loadProgress().manualDone ? [this.createCloseButton()] : []),
      isLast ? this.createFinishButton() : this.createArrow(1),
      scanlines,
    ];
    if (this.pageIndex > 0) this.pageParts.push(this.createArrow(-1));
  }

  private createArrow(direction: -1 | 1): Phaser.GameObjects.Container {
    const inset = ARROW_RADIUS + 12;
    return createScreenButton(this, {
      x: direction < 0 ? SCREEN.x + inset : SCREEN.x + SCREEN.width - inset,
      y: FOOTER_Y,
      width: ARROW_RADIUS * 2,
      height: ARROW_RADIUS * 2,
      drawFace: drawArrowFace(direction, ARROW_RADIUS),
      onPress: () => {
        this.pageIndex += direction;
        this.showPage();
      },
    });
  }

  private createFinishButton(): Phaser.GameObjects.Container {
    return createScreenButton(this, {
      x: SCREEN.x + SCREEN.width - FINISH_BUTTON.width / 2 - 12,
      y: FOOTER_Y,
      width: FINISH_BUTTON.width,
      height: FINISH_BUTTON.height,
      drawFace: drawOutlineFace(FINISH_BUTTON.width, FINISH_BUTTON.height, PALETTE.green),
      label: t('manual.finish'),
      color: PALETTE.green,
      onPress: () => this.finish(),
    });
  }

  private createCloseButton(): Phaser.GameObjects.Container {
    return createScreenButton(this, {
      x: SCREEN.x + SCREEN.width - 20,
      y: SCREEN.y + 17,
      width: 18,
      height: 18,
      drawFace: drawCloseFace(18),
      onPress: () => this.scene.start(SCENE_KEYS.cabin),
    });
  }

  private finish(): void {
    lastPageIndex = 0;
    const progress = loadProgress();
    const data: CabinSceneData = { manualJustDone: !progress.manualDone };
    saveProgress({ ...progress, manualDone: true });
    this.scene.start(SCENE_KEYS.cabin, data);
  }
}
