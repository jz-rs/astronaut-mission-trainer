import Phaser from 'phaser';
import { FONT_FAMILY, FONT_SIZE } from './layout';
import { cssColor, PALETTE } from './palette';

/** Every text in the game uses the pixel font, centered on its position. */
export interface TextOptions {
  size?: number;
  color?: number;
  wrapWidth?: number;
}

export function addText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  content: string,
  options: TextOptions = {},
): Phaser.GameObjects.Text {
  const { size = FONT_SIZE.medium, color = PALETTE.white, wrapWidth } = options;
  return scene.add
    .text(x, y, content, {
      fontFamily: FONT_FAMILY,
      fontSize: `${size}px`,
      color: cssColor(color),
      align: 'center',
      lineSpacing: size / 2,
      wordWrap: wrapWidth ? { width: wrapWidth } : undefined,
    })
    .setOrigin(0.5);
}
