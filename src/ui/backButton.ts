import Phaser from 'phaser';
import { t } from '../i18n';
import { createButton } from './Button';
import { FONT_SIZE, MIN_TOUCH_SIZE, type Rect } from './layout';
import { PALETTE } from './palette';

/**
 * "◀ BACK" in a top-left corner: the same chunky button as the start screen, with a drawn arrow
 * (a text glyph comes out tiny in the pixel font). Cream on the light cabin walls, dark on the
 * dark bar of the base.
 */
export type BackButtonLook = 'light' | 'dark';

/** The dark one gets a gray edge: its own dark outline would vanish on the dark bar. */
const LOOKS: Record<BackButtonLook, { face: number; ink: number; edge?: number }> = {
  light: { face: PALETTE.white, ink: PALETTE.night },
  dark: { face: PALETTE.night, ink: PALETTE.white, edge: PALETTE.metal },
};
const DEPTH = 40;
const ARROW = { inset: 10, halfHeight: 4, width: 5 } as const;
/** How far the word moves right to leave room for the arrow (px). */
const LABEL_SHIFT = 5;
/** How far the button face sinks when pressed (same as `createButton`). */
const PRESS_DEPTH = 3;
const EDGE_WIDTH = 2;

export function addBackButton(
  scene: Phaser.Scene,
  area: Rect,
  look: BackButtonLook,
  onPress: () => void,
): Phaser.GameObjects.Container {
  const { face, ink, edge } = LOOKS[look];
  const button = createButton(scene, {
    x: area.x + area.width / 2,
    y: area.y + area.height / 2,
    width: area.width,
    height: area.height,
    label: t('hud.back'),
    fontSize: FONT_SIZE.small,
    color: face,
    textColor: ink,
    onPress,
  }).setDepth(DEPTH);
  shiftLabel(button);
  const marks = scene.add.graphics();
  drawArrow(marks, -area.width / 2 + ARROW.inset, ink);
  if (edge !== undefined) {
    marks.lineStyle(EDGE_WIDTH, edge, 1);
    marks.strokeRect(-area.width / 2, -area.height / 2, area.width, area.height);
  }
  sinkWhenPressed(button, marks);
  button.add(marks);
  addTouchMargin(scene, button, area, onPress);
  return button;
}

/**
 * The button is drawn thin to fit the top bar, but small fingers need 48 px: an invisible zone
 * that tall sits under it, so a tap just above or below the button still counts.
 */
function addTouchMargin(
  scene: Phaser.Scene,
  button: Phaser.GameObjects.Container,
  area: Rect,
  onPress: () => void,
): void {
  const height = Math.max(area.height, MIN_TOUCH_SIZE);
  const zone = scene.add.zone(button.x, button.y, area.width, height).setDepth(DEPTH - 1);
  zone.setInteractive({ useHandCursor: true }).on('pointerup', onPress);
}

/** The word moves right to leave room for the arrow. */
function shiftLabel(button: Phaser.GameObjects.Container): void {
  const label = button.list.find((part) => part instanceof Phaser.GameObjects.Text);
  if (label instanceof Phaser.GameObjects.Text) label.setX(LABEL_SHIFT);
}

/** A left-pointing triangle. */
function drawArrow(arrow: Phaser.GameObjects.Graphics, tipX: number, color: number): void {
  arrow.fillStyle(color, 1);
  arrow.fillTriangle(
    tipX,
    0,
    tipX + ARROW.width,
    -ARROW.halfHeight,
    tipX + ARROW.width,
    ARROW.halfHeight,
  );
}

/** The arrow and edge are drawn on top of the button, so they sink with its face by hand. */
function sinkWhenPressed(
  button: Phaser.GameObjects.Container,
  marks: Phaser.GameObjects.Graphics,
): void {
  button.on('pointerdown', () => marks.setY(PRESS_DEPTH));
  button.on('pointerout', () => marks.setY(0));
  button.on('pointerup', () => marks.setY(0));
}
