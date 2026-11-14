import type Phaser from 'phaser';
import { OXYGEN_FACTORY_BALANCE } from '../../config/balance';
import { FONT_SIZE, MIN_TOUCH_SIZE } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addText } from '../../ui/text';

/**
 * Spec 08 — The molecules of the oxygen minigame, drawn as balls so the kid SEES the chemistry
 * MOXIE does on Mars: CO₂ (O–C–O) loses one O and becomes CO; two loose O join into O₂.
 * Carbon is dark and oxygen is red, like the ball-and-stick models used in school.
 */
export type MoleculeKind = 'co2' | 'co' | 'o' | 'o2';

/** Where each atom sits inside its molecule, in atom radii from the center. */
const ATOM_LAYOUT: Record<MoleculeKind, readonly { element: 'C' | 'O'; offset: number }[]> = {
  co2: [
    { element: 'O', offset: -1.5 },
    { element: 'C', offset: 0 },
    { element: 'O', offset: 1.5 },
  ],
  co: [
    { element: 'C', offset: -0.75 },
    { element: 'O', offset: 0.75 },
  ],
  o: [{ element: 'O', offset: 0 }],
  o2: [
    { element: 'O', offset: -0.75 },
    { element: 'O', offset: 0.75 },
  ],
};

const ATOM_COLORS = { C: PALETTE.night, O: PALETTE.alert } as const;
const OUTLINE_WIDTH = 2;

export function addMolecule(
  scene: Phaser.Scene,
  kind: MoleculeKind,
  x: number,
  y: number,
): Phaser.GameObjects.Container {
  const radius = OXYGEN_FACTORY_BALANCE.atomRadius;
  const molecule = scene.add.container(x, y);
  for (const atom of ATOM_LAYOUT[kind]) {
    const atomX = atom.offset * radius;
    const ball = scene.add.circle(atomX, 0, radius, ATOM_COLORS[atom.element]);
    ball.setStrokeStyle(OUTLINE_WIDTH, PALETTE.white);
    const letter = addText(scene, atomX, 0, atom.element, {
      size: FONT_SIZE.small,
      color: PALETTE.white,
    });
    molecule.add([ball, letter]);
  }
  const width = Math.max(MIN_TOUCH_SIZE, molecule.getBounds().width);
  return molecule.setSize(width, MIN_TOUCH_SIZE);
}
