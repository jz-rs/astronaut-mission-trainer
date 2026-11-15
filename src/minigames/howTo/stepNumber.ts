import type Phaser from 'phaser';
import { FONT_SIZE } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addText } from '../../ui/text';

/**
 * The number of a mission step in a yellow circle, like a numbered list a kid can follow with a
 * finger. The how-to card and the side panel use the same one, so the order reads the same in both.
 */
export function addStepNumber(
  scene: Phaser.Scene,
  x: number,
  y: number,
  step: number,
  radius: number,
): Phaser.GameObjects.Container {
  const circle = scene.add.circle(0, 0, radius, PALETTE.sun);
  const size = radius >= 10 ? FONT_SIZE.medium : FONT_SIZE.small;
  const digit = addText(scene, 0, 1, `${step}`, { size, color: PALETTE.night });
  return scene.add.container(x, y, [circle, digit]);
}
