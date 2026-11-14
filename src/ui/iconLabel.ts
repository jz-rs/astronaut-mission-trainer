import type Phaser from 'phaser';
import { addSpriteSized, type SpriteKey } from './sprites';
import { addText, type TextOptions } from './text';

/** A sprite icon followed by one line of text, centered together on (x, y). */
const ICON_GAP = 6;

export interface IconLabel {
  icon: Phaser.GameObjects.Image;
  text: Phaser.GameObjects.Text;
  /** Changes the text and re-centers the pair. */
  setText: (content: string) => void;
}

export function addIconLabel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  iconKey: SpriteKey,
  iconSize: number,
  content: string,
  options: TextOptions = {},
): IconLabel {
  const icon = addSpriteSized(scene, x, y, iconKey, iconSize);
  const text = addText(scene, x, y, content, options);
  const setText = (newContent: string) => {
    text.setText(newContent);
    const totalWidth = iconSize + ICON_GAP + text.width;
    const left = x - totalWidth / 2;
    icon.setX(left + iconSize / 2);
    text.setX(left + iconSize + ICON_GAP + text.width / 2);
  };
  setText(content);
  return { icon, text, setText };
}
