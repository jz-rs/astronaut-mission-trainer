import type Phaser from 'phaser';
import { PALETTE } from '../../ui/palette';

/** Placeholder drawings for the shield wall until the spec 01 sprites arrive. */
export type BlockMaterial = 'water' | 'regolith';

const ZIGZAG_STEP = 8;
const ZIGZAG_WIDTH = 4;

/** A radiation ray: a vertical zigzag alternating yellow and violet. */
export function drawRay(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  fromY: number,
  toY: number,
): Phaser.GameObjects.Graphics {
  let side = 1;
  for (let y = fromY; y < toY; y += ZIGZAG_STEP) {
    const color = side > 0 ? PALETTE.sun : PALETTE.violet;
    graphics.lineStyle(3, color, 1);
    graphics.lineBetween(
      x - ZIGZAG_WIDTH * side,
      y,
      x + ZIGZAG_WIDTH * side,
      Math.min(toY, y + ZIGZAG_STEP),
    );
    side *= -1;
  }
  return graphics;
}

/** Block drawn around (0, 0): water is light blue with waves, regolith is Mars rock with spots. */
export function drawShieldBlock(
  graphics: Phaser.GameObjects.Graphics,
  material: BlockMaterial,
  width: number,
  height: number,
): Phaser.GameObjects.Graphics {
  const left = -width / 2;
  const top = -height / 2;
  const isWater = material === 'water';
  graphics.fillStyle(isWater ? PALETTE.cyan : PALETTE.mars, 1).fillRect(left, top, width, height);
  graphics.fillStyle(isWater ? PALETTE.white : PALETTE.marsDark, isWater ? 0.6 : 1);
  if (isWater) {
    graphics.fillRect(left + 6, top + 8, 10, 2).fillRect(left + 18, top + 18, 10, 2);
  } else {
    graphics
      .fillRect(left + 6, top + 6, 4, 4)
      .fillRect(left + 22, top + 14, 6, 4)
      .fillRect(left + 10, top + 20, 4, 4);
  }
  graphics.lineStyle(2, PALETTE.night, 1).strokeRect(left, top, width, height);
  return graphics;
}
