import type Phaser from 'phaser';
import { FONT_SIZE } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addText } from '../../ui/text';

/**
 * Little "picture sentences" (like CO₂ → MOXIE, or Sun → panel → ⚡) that explain a mission
 * without reading. Each minigame builds its own pictures; this file only lines them up and
 * draws the arrow and the plus sign, which look the same in every mission.
 */
export interface RowPart {
  item: Phaser.GameObjects.Components.Transform & Phaser.GameObjects.GameObject;
  width: number;
}

const PART_GAP = 4;
const ARROW_WIDTH = 16;
const ARROW_HEAD = 5;

/** Lays the parts out left to right, centered on (0, 0) of the returned container. */
export function layoutRow(
  scene: Phaser.Scene,
  parts: readonly RowPart[],
): Phaser.GameObjects.Container {
  const totalWidth =
    parts.reduce((sum, part) => sum + part.width, 0) + PART_GAP * (parts.length - 1);
  let cursor = -totalWidth / 2;
  for (const { item, width } of parts) {
    item.setX(cursor + width / 2);
    cursor += width + PART_GAP;
  }
  return scene.add.container(
    0,
    0,
    parts.map((part) => part.item),
  );
}

/** The pixel font has no arrow, so it is drawn (centered, like the other parts). */
export function arrowPart(scene: Phaser.Scene): RowPart {
  const arrow = scene.add.graphics();
  const left = -ARROW_WIDTH / 2;
  const headStart = ARROW_WIDTH / 2 - ARROW_HEAD;
  arrow.fillStyle(PALETTE.sun, 1).fillRect(left, -1, ARROW_WIDTH - ARROW_HEAD, 3);
  arrow.fillTriangle(headStart, -ARROW_HEAD, ARROW_WIDTH / 2, 0, headStart, ARROW_HEAD);
  return { item: arrow, width: ARROW_WIDTH };
}

export function plusPart(scene: Phaser.Scene): RowPart {
  const plus = addText(scene, 0, 0, '+', { size: FONT_SIZE.medium, color: PALETTE.sun });
  return { item: plus, width: plus.width };
}

/** A short word inside a picture sentence, like "MOXIE". */
export function wordPart(scene: Phaser.Scene, word: string, color: number): RowPart {
  const text = addText(scene, 0, 0, word, { size: FONT_SIZE.medium, color });
  return { item: text, width: text.width };
}
