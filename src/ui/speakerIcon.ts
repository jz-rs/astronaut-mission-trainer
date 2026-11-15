import type Phaser from 'phaser';
import { PALETTE } from './palette';

/**
 * A pixel speaker for the music button: with sound waves when the music is on, crossed out when
 * it is off. Drawn, because emoji don't show in the pixel font.
 */
const BOX = { x: -9, y: -3, width: 4, height: 6 };
const CONE = [
  { x: -5, y: -3 },
  { x: 0, y: -7 },
  { x: 0, y: 7 },
  { x: -5, y: 3 },
];
const WAVE_RADII = [4, 8];
const WAVE_ANGLE = Math.PI / 4;
const CROSS = { x: 4, size: 4 };

export function addSpeakerIcon(scene: Phaser.Scene, muted: boolean): Phaser.GameObjects.Graphics {
  const icon = scene.add.graphics();
  icon.fillStyle(PALETTE.night, 1);
  icon.fillRect(BOX.x, BOX.y, BOX.width, BOX.height);
  icon.fillPoints(CONE, true);
  icon.lineStyle(2, PALETTE.night, 1);
  if (muted) {
    const { x, size } = CROSS;
    icon.lineBetween(x, -size, x + size * 2, size);
    icon.lineBetween(x, size, x + size * 2, -size);
    return icon;
  }
  for (const radius of WAVE_RADII) {
    icon.beginPath();
    icon.arc(0, 0, radius, -WAVE_ANGLE, WAVE_ANGLE);
    icon.strokePath();
  }
  return icon;
}
