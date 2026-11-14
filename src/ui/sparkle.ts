import type Phaser from 'phaser';
import { addSprite, type SpriteKey } from './sprites';

/** Quick reward: a sparkle sprite that grows and fades away (AGENTS.md §4: every action answers). */
const SPARKLE_GROWTH = 1.5;
const SPARKLE_DURATION_MS = 350;

export function sparkleAt(scene: Phaser.Scene, x: number, y: number, key: SpriteKey): void {
  const sparkle = addSprite(scene, x, y, key);
  scene.tweens.add({
    targets: sparkle,
    scale: sparkle.scale * SPARKLE_GROWTH,
    alpha: 0,
    duration: SPARKLE_DURATION_MS,
    onComplete: () => sparkle.destroy(),
  });
}
