import type Phaser from 'phaser';
import { FONT_SIZE } from '../../../ui/layout';
import { PALETTE } from '../../../ui/palette';
import { addText } from '../../../ui/text';

/**
 * Spec 16 — A huge vote button: a big picture and two words, in the color of what it is about.
 * It sinks when touched and only votes when the finger is lifted on it, like every button.
 */
const BORDER = 3;
const PRESS_DEPTH = 3;
const ICON_BOX = 40;
const ICON_Y = -12;
const LABEL_Y = 30;
const FILL_ALPHA = 0.25;

export interface ProcedureButtonOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  icon: { texture: string; color: number };
  label: string;
  onPress: () => void;
}

export function createProcedureButton(
  scene: Phaser.Scene,
  options: ProcedureButtonOptions,
): Phaser.GameObjects.Container {
  const { x, y, width, height, icon, label } = options;
  const shape = scene.add.graphics();
  drawShape(shape, width, height, icon.color);
  const picture = scene.add.image(0, ICON_Y, icon.texture);
  picture.setScale(Math.min(ICON_BOX / picture.width, ICON_BOX / picture.height));
  const text = addText(scene, 0, LABEL_Y, label, { size: FONT_SIZE.medium, color: PALETTE.white });
  const face = scene.add.container(0, 0, [picture, text]);
  const button = scene.add.container(x, y, [shape, face]).setSize(width, height);
  button.setInteractive({ useHandCursor: true });
  bindPress(button, face, options.onPress);
  return button;
}

function drawShape(
  graphics: Phaser.GameObjects.Graphics,
  width: number,
  height: number,
  color: number,
): void {
  const left = -width / 2;
  const top = -height / 2;
  graphics.fillStyle(PALETTE.metalDark, 1).fillRect(left, top + PRESS_DEPTH, width, height);
  graphics.fillStyle(PALETTE.night, 1).fillRect(left, top, width, height);
  graphics.fillStyle(color, FILL_ALPHA).fillRect(left, top, width, height);
  graphics.lineStyle(BORDER, color, 1).strokeRect(left, top, width, height);
}

function bindPress(
  button: Phaser.GameObjects.Container,
  face: Phaser.GameObjects.Container,
  onPress: () => void,
): void {
  let isPressed = false;
  const press = (pressed: boolean) => {
    isPressed = pressed;
    face.setY(pressed ? PRESS_DEPTH : 0);
  };
  button.on('pointerdown', () => press(true));
  button.on('pointerout', () => press(false));
  button.on('pointerup', () => {
    if (!isPressed) return;
    press(false);
    onPress();
  });
}
