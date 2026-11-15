import type Phaser from 'phaser';
import { t } from '../../i18n';
import type { Rect } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addPlateLabel } from '../../ui/plateLabel';

/**
 * Spec 10 — The radiation meter, like RAD, the instrument on the Curiosity rover that measures
 * how much radiation reaches the ground of Mars. Radiation is invisible: the meter is how the
 * kid sees it. It rises while holes are open, and turns red when it gets close to full.
 */
const BORDER = 2;
const DANGER_LEVEL = 0.75;
const LABEL_GAP = 12;
const MESSAGE_OFFSET_X = 92;
const MESSAGE_OFFSET_Y = 20;

export class RadMeter {
  private level = 0;
  private readonly fill: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    private readonly rect: Rect,
  ) {
    const { x, y, width, height } = rect;
    const tube = scene.add.rectangle(x, y, width, height, PALETTE.night, 0.9).setOrigin(0);
    tube.setStrokeStyle(BORDER, PALETTE.metalLight);
    this.fill = scene.add.rectangle(x + BORDER, y + height - BORDER, width - BORDER * 2, 0);
    this.fill.setOrigin(0, 1).setFillStyle(PALETTE.violet);
    const centerX = x + width / 2;
    addPlateLabel(
      scene,
      centerX,
      y + height + LABEL_GAP,
      t('minigame.shield-wall.meter'),
      PALETTE.white,
    );
  }

  /** Where to say something about the meter: just left of its top, so the frame doesn't cut it. */
  get top(): { x: number; y: number } {
    return { x: this.rect.x - MESSAGE_OFFSET_X, y: this.rect.y + MESSAGE_OFFSET_Y };
  }

  get isFull(): boolean {
    return this.level >= 1;
  }

  /** Adds radiation (0 to 1 is empty to full). */
  add(amount: number): void {
    this.level = Math.min(1, this.level + amount);
    const innerHeight = this.rect.height - BORDER * 2;
    this.fill.setSize(this.fill.width, innerHeight * this.level);
    this.fill.setFillStyle(this.level >= DANGER_LEVEL ? PALETTE.alert : PALETTE.violet);
  }
}
