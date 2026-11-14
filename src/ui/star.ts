import type Phaser from 'phaser';
import { addSpriteSized } from './sprites';

/** Star of the result screen and the Mars map: gold when earned, gray when still missing. */
export function addStar(
  scene: Phaser.Scene,
  x: number,
  y: number,
  size: number,
  earned: boolean,
): Phaser.GameObjects.Image {
  return addSpriteSized(scene, x, y, earned ? 'starEarned' : 'starEmpty', size);
}
