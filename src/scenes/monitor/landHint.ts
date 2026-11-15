import Phaser from 'phaser';
import { INTRO_BALANCE } from '../../config/balance';
import { t } from '../../i18n';
import { FONT_SIZE } from '../../ui/layout';
import { cssColor, PALETTE } from '../../ui/palette';
import { SPRITE_SCALE } from '../../ui/sprites';
import { addText } from '../../ui/text';

/**
 * Spec 19 — The big green LAND button says "IR" (GO) on its face, and while the ship can land a
 * soft yellow light around it breathes. When landing is locked the light is off and the word is
 * gray (pressing it still explains why on the screen). The word sinks with the button frames.
 */
export interface LandHint {
  setReady: (ready: boolean) => void;
}

const GLOW = { color: PALETTE.sun, strength: 2, quality: 0.1, distance: 8 } as const;
/** Center of the button face in the art (1280×720 kit pixels, before SPRITE_SCALE). */
const FACE_CENTER = { x: 118, y: 39 } as const;
/** How far the face sinks in each press frame, in the same art pixels. */
const FACE_SINK: Record<string, number> = { medio: 5, apretado: 9 };
const OUTLINE_PX = 4;

export function addLandHint(scene: Phaser.Scene, button: Phaser.GameObjects.Image): LandHint {
  const restY = button.y + FACE_CENTER.y * SPRITE_SCALE;
  const word = addText(
    scene,
    button.x + FACE_CENTER.x * SPRITE_SCALE,
    restY,
    t('monitor.landButton'),
    {
      size: FONT_SIZE.large,
    },
  );
  word.setStroke(cssColor(PALETTE.night), OUTLINE_PX).setDepth(button.depth + 1);
  const followPress = () => word.setY(restY + sinkOf(button.texture.key) * SPRITE_SCALE);
  scene.events.on(Phaser.Scenes.Events.UPDATE, followPress);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () =>
    scene.events.off(Phaser.Scenes.Events.UPDATE, followPress),
  );
  const glow = addBreathingGlow(scene, button);
  return {
    setReady: (ready) => {
      word.setColor(cssColor(ready ? PALETTE.white : PALETTE.metalLight));
      if (glow) glow.active = ready;
    },
  };
}

function sinkOf(textureKey: string): number {
  const frame = Object.keys(FACE_SINK).find((suffix) => textureKey.endsWith(`-${suffix}`));
  return frame ? (FACE_SINK[frame] ?? 0) : 0;
}

/** A soft yellow light around the button that fades in and out (WebGL only). */
function addBreathingGlow(
  scene: Phaser.Scene,
  button: Phaser.GameObjects.Image,
): Phaser.FX.Glow | undefined {
  const glow = button.preFX?.addGlow(
    GLOW.color,
    GLOW.strength,
    0,
    false,
    GLOW.quality,
    GLOW.distance,
  );
  if (!glow) return undefined;
  scene.tweens.add({
    targets: glow,
    outerStrength: 0,
    yoyo: true,
    repeat: -1,
    duration: INTRO_BALANCE.landGlowPulseMs,
    ease: 'Sine.InOut',
  });
  return glow;
}
