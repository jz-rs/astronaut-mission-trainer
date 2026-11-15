import type Phaser from 'phaser';
import { NIGHT_BALANCE } from '../config/balance';
import type { Rect } from './layout';
import { PALETTE } from './palette';

/**
 * Day and night on Mars. The sol bar at the top is the Sun moving across the sky: after half the
 * sol it starts to get dark, so the base and the rooms of the missions go darker too. The kid
 * sees that sunlight (and solar energy) does not last all day.
 */

/** 0 = full day, 1 = full night, from how much of the sol has passed (0 to 1). */
export function nightAmount(solFraction: number): number {
  const { nightStarts, fullNight } = NIGHT_BALANCE;
  const progress = (solFraction - nightStarts) / (fullNight - nightStarts);
  return Math.min(1, Math.max(0, progress));
}

/** A see-through dark layer over `area` that gets darker as night comes. */
export class NightShade {
  private readonly shade: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, area: Rect, amount = 0) {
    this.shade = scene.add.rectangle(area.x, area.y, area.width, area.height, PALETTE.night);
    this.shade.setOrigin(0);
    this.setAmount(amount);
  }

  setAmount(amount: number): void {
    this.shade.setAlpha(amount * NIGHT_BALANCE.maxShade);
  }
}
