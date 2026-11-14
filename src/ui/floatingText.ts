import type Phaser from 'phaser';
import { cssColor, PALETTE } from './palette';
import { addText } from './text';

/** Short message that rises and fades, e.g. "No energy!" over a room. */
const RISE_PX = 24;
const DURATION_MS = 900;
/** Dark outline: these messages float over the busy map art and must still be readable. */
const STROKE_PX = 4;

export function floatText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  message: string,
  color: number,
): Phaser.GameObjects.Text {
  const text = addText(scene, x, y, message, { color });
  text.setStroke(cssColor(PALETTE.night), STROKE_PX);
  scene.tweens.add({
    targets: text,
    y: text.y - RISE_PX,
    alpha: 0,
    duration: DURATION_MS,
    onComplete: () => text.destroy(),
  });
  return text;
}
