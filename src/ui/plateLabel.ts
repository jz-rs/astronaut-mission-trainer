import type Phaser from 'phaser';
import { FONT_SIZE } from './layout';
import { PALETTE } from './palette';
import { addText } from './text';

/** A short label on a dark plate, so it stays readable over the busy room pictures. */
const PLATE_PADDING = 4;
const PLATE_ALPHA = 0.8;
const DEPTH = 2;

export function addPlateLabel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  content: string,
  color: number,
): Phaser.GameObjects.Text {
  const label = addText(scene, x, y, content, { size: FONT_SIZE.small, color }).setDepth(DEPTH);
  const plate = scene.add.rectangle(
    x,
    y,
    label.width + PLATE_PADDING * 2,
    label.height + PLATE_PADDING * 2,
    PALETTE.night,
  );
  plate.setAlpha(PLATE_ALPHA).setDepth(DEPTH - 1);
  return label;
}
