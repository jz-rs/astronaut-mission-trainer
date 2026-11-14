import Phaser from 'phaser';
import { FONT_SIZE } from './layout';
import { PALETTE } from './palette';
import { addText } from './text';

/**
 * Big chunky button with a pressed state. It only fires when the finger is
 * lifted on top of it, so a kid can slide away to cancel.
 */
export interface ButtonOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  onPress: () => void;
  color?: number;
  textColor?: number;
  fontSize?: number;
}

const PRESS_DEPTH = 3;

export function createButton(
  scene: Phaser.Scene,
  options: ButtonOptions,
): Phaser.GameObjects.Container {
  const { x, y, width, height, label, onPress } = options;
  const { color = PALETTE.cyan, textColor = PALETTE.night, fontSize = FONT_SIZE.medium } = options;

  const background = scene.add.graphics();
  const text = addText(scene, 0, 0, label, { size: fontSize, color: textColor });
  const button = scene.add.container(x, y, [background, text]);
  button.setSize(width, height).setInteractive({ useHandCursor: true });

  const draw = (pressed: boolean) => {
    drawButtonShape(background, width, height, color, pressed);
    text.setY(pressed ? PRESS_DEPTH : 0);
  };
  draw(false);
  bindPressEvents(button, draw, onPress);
  return button;
}

function bindPressEvents(
  button: Phaser.GameObjects.Container,
  draw: (pressed: boolean) => void,
  onPress: () => void,
): void {
  let isPressed = false;
  button.on('pointerdown', () => {
    isPressed = true;
    draw(true);
  });
  button.on('pointerout', () => {
    isPressed = false;
    draw(false);
  });
  button.on('pointerup', () => {
    if (!isPressed) return;
    isPressed = false;
    draw(false);
    onPress();
  });
}

function drawButtonShape(
  graphics: Phaser.GameObjects.Graphics,
  width: number,
  height: number,
  color: number,
  pressed: boolean,
): void {
  const left = -width / 2;
  const top = -height / 2 + (pressed ? PRESS_DEPTH : 0);
  graphics.clear();
  if (!pressed) {
    graphics.fillStyle(PALETTE.metalDark, 1).fillRect(left, top + PRESS_DEPTH, width, height);
  }
  graphics.fillStyle(color, 1).fillRect(left, top, width, height);
  graphics.fillStyle(PALETTE.white, 0.35).fillRect(left + 3, top + 3, width - 6, 2);
  graphics.lineStyle(2, PALETTE.night, 1).strokeRect(left, top, width, height);
}
