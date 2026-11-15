import Phaser from 'phaser';
import { t, type TranslationKey } from '../../i18n';
import { FONT_SIZE } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addText } from '../../ui/text';
import { addMolecule, type MoleculeKind } from './molecules';

/**
 * Spec 08 — The 4 steps of making oxygen like MOXIE, as little pictures ("formulas") so a kid
 * can follow them without reading: the intro card shows them with one line each before playing,
 * and the side panel shows only the pictures while playing.
 */
export type FormulaPart = MoleculeKind | '→' | '+' | 'MOXIE' | 'tank';

export interface RecipeStep {
  formula: readonly FormulaPart[];
  textKey: TranslationKey;
}

export const OXYGEN_RECIPE: readonly RecipeStep[] = [
  { formula: ['co2', '→', 'MOXIE'], textKey: 'minigame.oxygen-factory.guide1' },
  { formula: ['co2', '→', 'co', '+', 'o'], textKey: 'minigame.oxygen-factory.guide2' },
  { formula: ['o', '+', 'o', '→', 'o2'], textKey: 'minigame.oxygen-factory.guide3' },
  { formula: ['o2', '→', 'tank'], textKey: 'minigame.oxygen-factory.guide4' },
];

const PART_GAP = 4;
const ARROW_WIDTH = 16;
const ARROW_HEAD = 5;
const SYMBOL_KEYS: Partial<Record<FormulaPart, TranslationKey>> = {
  MOXIE: 'minigame.oxygen-factory.machine',
  tank: 'minigame.oxygen-factory.tank',
};

interface PlacedPart {
  item: Phaser.GameObjects.Container | Phaser.GameObjects.Text | Phaser.GameObjects.Graphics;
  width: number;
}

/** Lays the parts out left to right, centered on (x, y), at `scale`. */
export function addFormula(
  scene: Phaser.Scene,
  x: number,
  y: number,
  formula: readonly FormulaPart[],
  scale: number,
): Phaser.GameObjects.Container {
  const parts = formula.map((part) => addPart(scene, part));
  const totalWidth =
    parts.reduce((sum, part) => sum + part.width, 0) + PART_GAP * (parts.length - 1);
  let cursor = -totalWidth / 2;
  for (const { item, width } of parts) {
    // Graphics draw from their origin; texts and molecules are centered.
    item.setX(item instanceof Phaser.GameObjects.Graphics ? cursor : cursor + width / 2);
    cursor += width + PART_GAP;
  }
  return scene.add
    .container(
      x,
      y,
      parts.map((part) => part.item),
    )
    .setScale(scale);
}

function addPart(scene: Phaser.Scene, part: FormulaPart): PlacedPart {
  if (part === '→') return { item: addArrow(scene), width: ARROW_WIDTH };
  if (part === '+') {
    const plus = addText(scene, 0, 0, '+', { size: FONT_SIZE.medium, color: PALETTE.sun });
    return { item: plus, width: plus.width };
  }
  const symbolKey = SYMBOL_KEYS[part];
  if (symbolKey) {
    const symbol = addText(scene, 0, 0, t(symbolKey), {
      size: FONT_SIZE.medium,
      color: PALETTE.cyan,
    });
    return { item: symbol, width: symbol.width };
  }
  const molecule = addMolecule(scene, part as MoleculeKind, 0, 0);
  return { item: molecule, width: molecule.getBounds().width };
}

/** The pixel font has no arrow, so it is drawn. */
function addArrow(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
  const arrow = scene.add.graphics();
  arrow.fillStyle(PALETTE.sun, 1).fillRect(0, -1, ARROW_WIDTH - ARROW_HEAD, 3);
  arrow.fillTriangle(
    ARROW_WIDTH - ARROW_HEAD,
    -ARROW_HEAD,
    ARROW_WIDTH,
    0,
    ARROW_WIDTH - ARROW_HEAD,
    ARROW_HEAD,
  );
  return arrow;
}
