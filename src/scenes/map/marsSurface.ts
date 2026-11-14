import type Phaser from 'phaser';
import { MARS_MAP_RECT } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { drawTechPanel } from '../../ui/techFrame';

/**
 * Spec 12 — Pixel-art flat map of Mars (placeholder until the spec 01 / Mars Trek image).
 * Only the big real features are drawn: north polar cap, Tharsis volcanoes, Valles Marineris.
 */
const CRATERS: readonly [number, number, number][] = [
  [0.62, 0.55, 18],
  [0.85, 0.7, 12],
  [0.45, 0.75, 10],
  [0.72, 0.3, 8],
  [0.3, 0.42, 7],
  [0.92, 0.45, 9],
];

export function drawMarsSurface(scene: Phaser.Scene): void {
  const { x, y, width, height } = MARS_MAP_RECT;
  const graphics = scene.add.graphics();
  drawTechPanel(graphics, MARS_MAP_RECT, PALETTE.marsLight, PALETTE.mars);
  graphics
    .fillStyle(PALETTE.marsLight, 1)
    .fillRect(x + 4, y + height * 0.55, width - 8, height * 0.15);
  graphics.fillStyle(PALETTE.white, 1).fillRect(x + 4, y + 4, width - 8, 12); // north polar cap
  graphics.fillStyle(PALETTE.white, 0.9).fillEllipse(x + width / 2, y + 18, 160, 14);
  for (const [fractionX, fractionY, radius] of CRATERS) {
    graphics.fillStyle(PALETTE.marsDark, 1);
    graphics.fillCircle(x + width * fractionX, y + height * fractionY, radius);
  }
  // Tharsis volcanoes, home of Olympus Mons.
  graphics
    .fillStyle(PALETTE.marsDark, 1)
    .fillTriangle(x + 52, y + 104, x + 72, y + 74, x + 92, y + 104);
  // Valles Marineris: a long dark scar.
  graphics.lineStyle(4, PALETTE.marsDark, 1).lineBetween(x + 130, y + 132, x + 230, y + 142);
}
