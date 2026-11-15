import type Phaser from 'phaser';
import { INTRO_BALANCE } from '../../config/balance';
import { TECH_GLOW } from '../../ui/palette';

/**
 * Spec 19 — A small cyan halo around the console's "i" button, breathing like the tablet's, so
 * kids notice there is more to read about the place (WebGL only).
 */
const HALO = { strength: 2, quality: 0.1, distance: 4 } as const;

export function addInfoHalo(scene: Phaser.Scene, button: Phaser.GameObjects.Image): void {
  const glow = button.preFX?.addGlow(
    TECH_GLOW,
    HALO.strength,
    0,
    false,
    HALO.quality,
    HALO.distance,
  );
  if (!glow) return;
  scene.tweens.add({
    targets: glow,
    outerStrength: 0,
    yoyo: true,
    repeat: -1,
    duration: INTRO_BALANCE.highlightPulseMs,
    ease: 'Sine.InOut',
  });
}
