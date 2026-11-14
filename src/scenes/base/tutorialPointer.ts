import type Phaser from 'phaser';
import { FONT_SIZE, type Point } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addText } from '../../ui/text';

/**
 * A bouncing yellow arrow with one short line, pointing at what to look at or tap.
 * 'down' = the arrow is above the target; 'up' = below it (for the HUD at the top).
 */
const ARROW_SIZE = 14;
const ARROW_LENGTH = 18;
const TEXT_GAP = 14;
const PADDING = 6;
const BOUNCE_PX = 6;
const DEPTH = 55;

export type PointerDirection = 'up' | 'down';

export function addTutorialPointer(
  scene: Phaser.Scene,
  target: Point,
  direction: PointerDirection,
  message: string,
): Phaser.GameObjects.Container {
  const sign = direction === 'down' ? -1 : 1; // which side of the target the pointer sits on
  const arrow = scene.add.graphics();
  arrow.fillStyle(PALETTE.sun, 1);
  arrow.fillTriangle(0, 0, -ARROW_SIZE / 2, sign * ARROW_SIZE, ARROW_SIZE / 2, sign * ARROW_SIZE);
  arrow.fillRect(-3, sign * ARROW_SIZE, 6, sign * ARROW_LENGTH);
  const textY = sign * (ARROW_SIZE + ARROW_LENGTH + TEXT_GAP);
  const text = addText(scene, 0, textY, message, { size: FONT_SIZE.medium, color: PALETTE.sun });
  const plate = scene.add.rectangle(
    0,
    textY,
    text.width + PADDING * 2,
    text.height + PADDING * 2,
    PALETTE.night,
    0.9,
  );
  plate.setStrokeStyle(2, PALETTE.sun);
  const shift = shiftInsideScreen(target.x, plate.width, scene.scale.width);
  plate.x += shift;
  text.x += shift;
  const pointer = scene.add.container(target.x, target.y, [arrow, plate, text]).setDepth(DEPTH);
  scene.tweens.add({
    targets: arrow,
    y: sign * BOUNCE_PX,
    duration: 350,
    yoyo: true,
    repeat: -1,
  });
  return pointer;
}

/** The text is wider than the arrow: how far to move it so it never leaves the screen. */
function shiftInsideScreen(x: number, textWidth: number, screenWidth: number): number {
  const half = textWidth / 2 + PADDING;
  return Math.max(0, half - x) - Math.max(0, x + half - screenWidth);
}
