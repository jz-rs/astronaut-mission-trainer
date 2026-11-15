import type Phaser from 'phaser';
import { t } from '../../i18n';
import { BASE_MANUAL_BUTTON } from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';
import { addGlowText } from '../../ui/screenUi';
import { SPRITE_SCALE } from '../../ui/sprites';

/**
 * Spec 19 — The ship's tablet, small, floating in the base's bottom right corner with "MANUAL" on
 * its screen: the same mission manual as in the ship, to look something up while playing.
 * The base pauses while it is open.
 */
const TEXTURE = 'manual-tablet-button';
/** The glass inside the frame, in game pixels from the tablet's center (the art has it see-through). */
const SCREEN = { width: 76, height: 42, shiftX: -2 } as const;
const FLOAT = { distance: 2, durationMs: 900 } as const;
const PRESSED_SCALE = 0.92;
const LABEL_RESOLUTION = 2;

export function preloadManualButton(scene: Phaser.Scene): void {
  scene.load.image(TEXTURE, 'assets/sprites/cabina/tablet-boton.png');
}

export function addManualButton(scene: Phaser.Scene, onPress: () => void): void {
  const { x, y, width, height } = BASE_MANUAL_BUTTON;
  const screen = scene.add.rectangle(SCREEN.shiftX, 0, SCREEN.width, SCREEN.height, PALETTE.night);
  const frame = scene.add.image(0, 0, TEXTURE).setScale(SPRITE_SCALE);
  const label = addGlowText(scene, SCREEN.shiftX, 0, t('cabin.tablet'), { color: TECH_GLOW });
  label.setResolution(LABEL_RESOLUTION);
  const button = scene.add.container(x + width / 2, y + height / 2, [screen, frame, label]);
  button.setSize(width, height).setInteractive({ useHandCursor: true });
  // Bobs gently, like things float in a spaceship: it reads as something to pick up.
  scene.tweens.add({
    targets: button,
    y: button.y - FLOAT.distance,
    duration: FLOAT.durationMs,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.InOut',
  });
  button.on('pointerdown', () => button.setScale(PRESSED_SCALE));
  button.on('pointerout', () => button.setScale(1));
  button.on('pointerup', () => {
    button.setScale(1);
    onPress();
  });
}
