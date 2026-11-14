import Phaser from 'phaser';
import { PALETTE } from './palette';

/** Five-point star for the result screen and (later) the Mars map. Placeholder for the spec 01 sprite. */
const STAR_POINTS = 5;
const INNER_RADIUS_RATIO = 0.45;

export function drawStar(
  graphics: Phaser.GameObjects.Graphics,
  outerRadius: number,
  earned: boolean,
): void {
  const points: Phaser.Math.Vector2[] = [];
  for (let index = 0; index < STAR_POINTS * 2; index += 1) {
    const radius = index % 2 === 0 ? outerRadius : outerRadius * INNER_RADIUS_RATIO;
    const angle = -Math.PI / 2 + (index * Math.PI) / STAR_POINTS;
    points.push(new Phaser.Math.Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius));
  }
  graphics.clear();
  graphics.fillStyle(earned ? PALETTE.sun : PALETTE.metalDark, 1).fillPoints(points, true);
  graphics.lineStyle(3, earned ? PALETTE.white : PALETTE.metal, 1).strokePoints(points, true);
}
