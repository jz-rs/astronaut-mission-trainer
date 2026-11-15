import type Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from './layout';
import { PALETTE } from './palette';
import { playErrorSound } from './soundEffects';

/**
 * What every wrong choice looks and sounds like (an N₂ fed to MOXIE, Mars soil on a plant, the
 * rover on soft sand): an "uh-oh" sound, a short shake and a red frame around the whole screen
 * that blinks twice and goes away. It never stops the game: the kid keeps playing at once.
 */
const BORDER_PX = 8;
const BLINK_MS = 140;
const BLINKS = 2;
const FRAME_DEPTH = 1_000;
const SHAKE_MS = 150;
const SHAKE_INTENSITY = 0.004;

export function showWrongChoice(scene: Phaser.Scene): void {
  playErrorSound(scene);
  scene.cameras.main.shake(SHAKE_MS, SHAKE_INTENSITY);
  const half = BORDER_PX / 2;
  const frame = scene.add.graphics().setDepth(FRAME_DEPTH).setScrollFactor(0).setAlpha(0);
  frame.lineStyle(BORDER_PX, PALETTE.alert, 1);
  frame.strokeRect(half, half, GAME_WIDTH - BORDER_PX, GAME_HEIGHT - BORDER_PX);
  scene.tweens.add({
    targets: frame,
    alpha: 1,
    duration: BLINK_MS,
    yoyo: true,
    repeat: BLINKS - 1,
    onComplete: () => frame.destroy(),
  });
}
