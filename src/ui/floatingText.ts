import type Phaser from 'phaser';
import { addText } from './text';

/** Short message that rises and fades, e.g. "No energy!" over a room. */
const RISE_PX = 24;
const DURATION_MS = 900;

export function floatText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  message: string,
  color: number,
): void {
  const text = addText(scene, x, y, message, { color });
  scene.tweens.add({
    targets: text,
    y: text.y - RISE_PX,
    alpha: 0,
    duration: DURATION_MS,
    onComplete: () => text.destroy(),
  });
}
