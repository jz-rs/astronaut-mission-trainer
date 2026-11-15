import Phaser from 'phaser';
import { t } from '../../i18n';
import { createButton } from '../../ui/Button';
import { CABIN_BACK_BUTTON, FONT_SIZE } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';

/**
 * Spec 19 — "BACK" in the cabin's top-left corner, to the start screen. Same chunky button as
 * the start screen, in cream so it stands out on the cabin walls, with a drawn arrow (a text
 * glyph comes out tiny in the pixel font).
 */
const DEPTH = 40;
const ARROW = { inset: 10, halfHeight: 4, width: 5 } as const;
/** The word moves right to leave room for the arrow. */
const LABEL_SHIFT = 5;
/** How far the button face sinks when pressed (same as `createButton`). */
const PRESS_DEPTH = 3;

export function addBackButton(scene: Phaser.Scene, onPress: () => void): void {
  const { x, y, width, height } = CABIN_BACK_BUTTON;
  const button = createButton(scene, {
    x: x + width / 2,
    y: y + height / 2,
    width,
    height,
    label: t('cabin.back'),
    fontSize: FONT_SIZE.small,
    color: PALETTE.white,
    onPress,
  }).setDepth(DEPTH);
  const label = button.list.find((part) => part instanceof Phaser.GameObjects.Text);
  if (label instanceof Phaser.GameObjects.Text) label.setX(LABEL_SHIFT);
  button.add(addArrow(scene, button, -width / 2 + ARROW.inset));
}

/** A left-pointing triangle that sinks with the face when the button is pressed. */
function addArrow(
  scene: Phaser.Scene,
  button: Phaser.GameObjects.Container,
  tipX: number,
): Phaser.GameObjects.Graphics {
  const arrow = scene.add.graphics();
  arrow.fillStyle(PALETTE.night, 1);
  arrow.fillTriangle(
    tipX,
    0,
    tipX + ARROW.width,
    -ARROW.halfHeight,
    tipX + ARROW.width,
    ARROW.halfHeight,
  );
  button.on('pointerdown', () => arrow.setY(PRESS_DEPTH));
  button.on('pointerout', () => arrow.setY(0));
  button.on('pointerup', () => arrow.setY(0));
  return arrow;
}
