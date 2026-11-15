import Phaser from 'phaser';
import { NIGHT_BALANCE } from '../config/balance';
import type { Rect } from './layout';
import { PALETTE } from './palette';

/**
 * Day and night on Mars. The sol bar at the top is the Sun moving across the sky: after half the
 * sol it starts to get dark, so the base and the rooms of the missions go darker too. The kid
 * sees that sunlight (and solar energy) does not last all day. How dark it is comes from
 * `nightAmount` in core/daylight.ts.
 */

/**
 * Night over `area`: the same picture, tinted violet (a violet layer that multiplies the colors,
 * so oranges turn purple and the lights still read) plus a little darkness.
 */
export class NightShade {
  private readonly tint: Phaser.GameObjects.Rectangle;
  private readonly shade: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, area: Rect, amount = 0) {
    this.tint = scene.add.rectangle(area.x, area.y, area.width, area.height, PALETTE.violet);
    this.tint.setOrigin(0).setBlendMode(Phaser.BlendModes.MULTIPLY);
    this.shade = scene.add.rectangle(area.x, area.y, area.width, area.height, PALETTE.night);
    this.shade.setOrigin(0);
    this.setAmount(amount);
  }

  setAmount(amount: number): void {
    this.tint.setAlpha(amount);
    this.shade.setAlpha(amount * NIGHT_BALANCE.maxShade);
  }
}
