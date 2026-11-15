import type Phaser from 'phaser';
import { INTRO_BALANCE } from '../../config/balance';
import { t } from '../../i18n';
import { FONT_SIZE } from '../../ui/layout';
import { cssColor, PALETTE } from '../../ui/palette';
import { addText } from '../../ui/text';

/**
 * Spec 19 — Makes the big green LAND button obvious: a name plate over it, and, while the ship
 * can land, a yellow arrow bouncing toward it and a glow on the button. When landing is locked
 * the plate turns gray and the arrow hides (pressing it still explains why on the screen).
 */
export interface LandHint {
  setReady: (ready: boolean) => void;
}

const PLATE = { padding: 4, gap: 4, alpha: 0.85 } as const;
const ARROW = { halfWidth: 7, height: 8, gap: 3, bouncePx: 4 } as const;
const GLOW = { strength: 3, quality: 0.1, distance: 10 } as const;
const DEPTH = 12;

export function addLandHint(scene: Phaser.Scene, button: Phaser.GameObjects.Image): LandHint {
  const centerX = button.x + button.displayWidth / 2;
  const { label, plate } = addNamePlate(scene, centerX, button.y);
  const arrowTip = plate.y - plate.height / 2 - ARROW.gap;
  const arrow = drawArrow(scene, centerX, arrowTip);
  scene.tweens.add({
    targets: arrow,
    y: ARROW.bouncePx,
    yoyo: true,
    repeat: -1,
    duration: INTRO_BALANCE.landArrowBounceMs,
    ease: 'Sine.InOut',
  });
  const glow = button.preFX?.addGlow(
    PALETTE.sun,
    GLOW.strength,
    0,
    false,
    GLOW.quality,
    GLOW.distance,
  );
  return {
    setReady: (ready) => {
      label.setColor(cssColor(ready ? PALETTE.white : PALETTE.metal));
      arrow.setVisible(ready);
      if (glow) glow.active = ready;
    },
  };
}

/** "LAND" on a dark plate, just over the button. */
function addNamePlate(
  scene: Phaser.Scene,
  centerX: number,
  buttonTop: number,
): { label: Phaser.GameObjects.Text; plate: Phaser.GameObjects.Rectangle } {
  const label = addText(scene, centerX, 0, t('monitor.landButton'), { size: FONT_SIZE.small });
  label.setY(buttonTop - PLATE.gap - PLATE.padding - label.height / 2).setDepth(DEPTH);
  const plate = scene.add
    .rectangle(centerX, label.y, label.width + PLATE.padding * 2, label.height + PLATE.padding * 2)
    .setFillStyle(PALETTE.night, PLATE.alpha)
    .setDepth(DEPTH - 1);
  return { label, plate };
}

/** A yellow triangle pointing down, its tip just over the plate. */
function drawArrow(scene: Phaser.Scene, x: number, tipY: number): Phaser.GameObjects.Graphics {
  const arrow = scene.add.graphics().setDepth(DEPTH);
  arrow.fillStyle(PALETTE.sun, 1);
  arrow.fillTriangle(
    x - ARROW.halfWidth,
    tipY - ARROW.height,
    x + ARROW.halfWidth,
    tipY - ARROW.height,
    x,
    tipY,
  );
  return arrow;
}
