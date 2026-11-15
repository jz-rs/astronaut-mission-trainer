import type Phaser from 'phaser';
import { t } from '../../i18n';
import { PALETTE, STAT_COLORS } from '../../ui/palette';
import type { HowToStep } from '../howTo/howToCard';
import { arrowPart, layoutRow, plusPart, wordPart, type RowPart } from '../howTo/pictureRow';
import { addMolecule, type MoleculeKind } from './molecules';

/**
 * Spec 08 — The 4 steps of making oxygen like MOXIE, as little pictures so a kid can follow them
 * without reading: the how-to card shows them with one line each before playing, and the side
 * panel shows only the pictures while playing.
 */
type FormulaPart = MoleculeKind | '→' | '+' | 'MOXIE' | 'tank';

function formula(parts: readonly FormulaPart[]): HowToStep['picture'] {
  return (scene) =>
    layoutRow(
      scene,
      parts.map((part) => addPart(scene, part)),
    );
}

export const OXYGEN_STEPS: readonly HowToStep[] = [
  { picture: formula(['co2', '→', 'MOXIE']), textKey: 'minigame.oxygen-factory.guide1' },
  { picture: formula(['co2', '→', 'co', '+', 'o']), textKey: 'minigame.oxygen-factory.guide2' },
  { picture: formula(['o', '+', 'o', '→', 'o2']), textKey: 'minigame.oxygen-factory.guide3' },
  { picture: formula(['o2', '→', 'tank']), textKey: 'minigame.oxygen-factory.guide4' },
];

function addPart(scene: Phaser.Scene, part: FormulaPart): RowPart {
  if (part === '→') return arrowPart(scene);
  if (part === '+') return plusPart(scene);
  if (part === 'MOXIE') return wordPart(scene, t('minigame.oxygen-factory.machine'), PALETTE.cyan);
  if (part === 'tank') {
    return wordPart(scene, t('minigame.oxygen-factory.tank'), STAT_COLORS.oxygen);
  }
  const molecule = addMolecule(scene, part, 0, 0);
  return { item: molecule, width: molecule.getBounds().width };
}
