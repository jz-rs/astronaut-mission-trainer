import Phaser from 'phaser';
import { COLORS } from './palette';
import { MIN_TOUCH_SIZE } from './layout';
import { textStyle } from './textStyles';

interface ButtonOptions {
  x: number;
  y: number;
  label: string;
  width?: number;
  height?: number;
  color?: number;
  onPress: () => void;
}

/** Big, kid-friendly button: never smaller than MIN_TOUCH_SIZE and it squishes when pressed. */
export function createButton(
  scene: Phaser.Scene,
  options: ButtonOptions,
): Phaser.GameObjects.Container {
  const width = Math.max(options.width ?? 160, MIN_TOUCH_SIZE);
  const height = Math.max(options.height ?? MIN_TOUCH_SIZE, MIN_TOUCH_SIZE);

  const background = scene.add
    .rectangle(0, 0, width, height, options.color ?? COLORS.panel)
    .setStrokeStyle(2, COLORS.panelBorder);
  const label = scene.add.text(0, 0, options.label, textStyle('normal')).setOrigin(0.5);

  const button = scene.add.container(options.x, options.y, [background, label]);
  button.setSize(width, height).setInteractive({ useHandCursor: true });
  button.on('pointerdown', () => button.setScale(0.92));
  button.on('pointerout', () => button.setScale(1));
  button.on('pointerup', () => {
    button.setScale(1);
    options.onPress();
  });
  return button;
}
