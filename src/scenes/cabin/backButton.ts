import type Phaser from 'phaser';
import { t } from '../../i18n';
import { CABIN_BACK_BUTTON } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { createScreenButton, glowStroke } from '../../ui/screenUi';

/**
 * Spec 19 — "Back" in the cabin's top-left corner, to the start screen. It looks like a little
 * ship screen (dark glass, glowing edge) so it reads as a button on the white walls.
 */
const PLATE_ALPHA = 0.85;
const CORNER_RADIUS = 6;
const CHEVRON = { inset: 12, half: 5 } as const;
const DEPTH = 40;

export function addBackButton(scene: Phaser.Scene, onPress: () => void): void {
  const { x, y, width, height } = CABIN_BACK_BUTTON;
  createScreenButton(scene, {
    x: x + width / 2,
    y: y + height / 2,
    width,
    height,
    drawFace: (graphics) => drawPlate(graphics, width, height),
    label: t('cabin.back'),
    onPress,
  }).setDepth(DEPTH);
}

/** Dark glass with a glowing edge and a "<" on the left, like the console's arrows. */
function drawPlate(graphics: Phaser.GameObjects.Graphics, width: number, height: number): void {
  const left = -width / 2;
  const top = -height / 2;
  graphics.fillStyle(PALETTE.night, PLATE_ALPHA);
  graphics.fillRoundedRect(left, top, width, height, CORNER_RADIUS);
  glowStroke(graphics).rect({ x: left, y: top, width, height }, CORNER_RADIUS);
  const tipX = left + CHEVRON.inset - CHEVRON.half / 2;
  const tailX = tipX + CHEVRON.half;
  glowStroke(graphics).line(tailX, -CHEVRON.half, tipX, 0);
  glowStroke(graphics).line(tipX, 0, tailX, CHEVRON.half);
}
