import type Phaser from 'phaser';
import { PALETTE } from '../../ui/palette';

/**
 * Placeholder plant in a hydroponic pot, drawn around (0, 0).
 * Color says everything (spec 09): green = fine, yellow and drooping = thirsty, brown = withered.
 */
export type PlantState = 'healthy' | 'thirsty' | 'withered';

const LEAF_COLORS: Record<PlantState, number> = {
  healthy: PALETTE.green,
  thirsty: PALETTE.sun,
  withered: PALETTE.marsDark,
};

export function drawPlant(graphics: Phaser.GameObjects.Graphics, state: PlantState): void {
  graphics.clear();
  drawPot(graphics);
  const leafColor = LEAF_COLORS[state];
  const droop = state === 'healthy' ? 0 : 8;
  const size = state === 'withered' ? 6 : 10;
  graphics
    .fillStyle(PALETTE.green, state === 'withered' ? 0.4 : 1)
    .fillRect(-2, -14 + droop, 4, 26 - droop);
  graphics.fillStyle(leafColor, 1);
  graphics.fillCircle(-12, -10 + droop * 1.5, size);
  graphics.fillCircle(12, -10 + droop * 1.5, size);
  graphics.fillCircle(0, -20 + droop, size + 2);
}

function drawPot(graphics: Phaser.GameObjects.Graphics): void {
  graphics.fillStyle(PALETTE.metal, 1).fillRect(-24, 12, 48, 22);
  graphics.fillStyle(PALETTE.metalDark, 1).fillRect(-20, 16, 40, 14);
  graphics.fillStyle(PALETTE.violet, 1).fillRect(-20, 12, 40, 3); // grow-light LED strip
}
