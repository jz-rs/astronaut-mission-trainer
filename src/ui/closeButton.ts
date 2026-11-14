import type Phaser from 'phaser';
import { MIN_TOUCH_SIZE, MINIGAME_PANEL, type Point } from './layout';
import { PALETTE } from './palette';

/**
 * The red X in the top-right corner of a minigame panel (or of any card, passing its corner):
 * lets a kid leave without playing.
 * The X is drawn (not a text glyph) so it looks the same in every font and language.
 * The visible square is small, but the touch area is the 48 px minimum.
 */
const BOX_SIZE = 26;
const CROSS_INSET = 8;
const CROSS_WIDTH = 3;
const PRESSED_SCALE = 0.9;

/** Center of the X: inside the panel corner, clear of the instruction and the time bar. */
export const CLOSE_BUTTON_CENTER = {
  x: MINIGAME_PANEL.x + MINIGAME_PANEL.width - 22,
  y: MINIGAME_PANEL.y + 18,
};

export function addCloseButton(
  scene: Phaser.Scene,
  onClose: () => void,
  center: Point = CLOSE_BUTTON_CENTER,
): Phaser.GameObjects.Container {
  const button = scene.add.container(center.x, center.y, [drawCross(scene)]);
  button.setSize(MIN_TOUCH_SIZE, MIN_TOUCH_SIZE).setInteractive({ useHandCursor: true });
  let isPressed = false;
  button.on('pointerdown', () => {
    isPressed = true;
    button.setScale(PRESSED_SCALE);
  });
  button.on('pointerout', () => {
    isPressed = false;
    button.setScale(1);
  });
  button.on('pointerup', () => {
    if (!isPressed) return;
    isPressed = false;
    button.setScale(1);
    onClose();
  });
  return button;
}

function drawCross(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
  const half = BOX_SIZE / 2;
  const graphics = scene.add.graphics();
  graphics.fillStyle(PALETTE.alert, 1).fillRect(-half, -half, BOX_SIZE, BOX_SIZE);
  graphics.lineStyle(2, PALETTE.night, 1).strokeRect(-half, -half, BOX_SIZE, BOX_SIZE);
  const arm = half - CROSS_INSET;
  graphics.lineStyle(CROSS_WIDTH, PALETTE.white, 1);
  graphics.lineBetween(-arm, -arm, arm, arm);
  graphics.lineBetween(-arm, arm, arm, -arm);
  return graphics;
}
