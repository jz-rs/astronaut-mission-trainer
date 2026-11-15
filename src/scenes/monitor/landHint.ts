import type Phaser from 'phaser';
import { INTRO_BALANCE } from '../../config/balance';
import { PALETTE } from '../../ui/palette';

/**
 * Spec 19 — Makes the big green LAND button call for a tap: while the ship can land, a soft
 * yellow light around it breathes. When landing is locked the light is off (pressing it still
 * explains why on the screen). The rocket landing on its icon says what it does.
 */
export interface LandHint {
  setReady: (ready: boolean) => void;
}

const GLOW = { color: PALETTE.sun, strength: 2, quality: 0.1, distance: 8 } as const;

export function addLandHint(scene: Phaser.Scene, button: Phaser.GameObjects.Image): LandHint {
  const glow = button.preFX?.addGlow(
    GLOW.color,
    GLOW.strength,
    0,
    false,
    GLOW.quality,
    GLOW.distance,
  );
  if (glow) {
    scene.tweens.add({
      targets: glow,
      outerStrength: 0,
      yoyo: true,
      repeat: -1,
      duration: INTRO_BALANCE.landGlowPulseMs,
      ease: 'Sine.InOut',
    });
  }
  return {
    setReady: (ready) => {
      if (glow) glow.active = ready;
    },
  };
}
