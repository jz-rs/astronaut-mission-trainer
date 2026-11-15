import Phaser from 'phaser';
import { OXYGEN_FACTORY_BALANCE } from '../../config/balance';
import { addMolecule, type MoleculeKind } from './molecules';

/**
 * Spec 08 — A molecule the kid can grab in the oxygen minigame, and how the free ones float
 * around the room bouncing off its edges.
 */
export interface Piece {
  kind: MoleculeKind;
  body: Phaser.GameObjects.Container;
  velocity: Phaser.Math.Vector2;
  /** Being dragged or flying: it stops floating and can't be grabbed twice. */
  busy: boolean;
}

export function createPiece(
  scene: Phaser.Scene,
  kind: MoleculeKind,
  x: number,
  y: number,
  speed: number,
): Piece {
  const body = addMolecule(scene, kind, x, y);
  body.setInteractive({ draggable: true, useHandCursor: true });
  const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
  return { kind, body, velocity: new Phaser.Math.Vector2(speed, 0).rotate(angle), busy: false };
}

export function floatPieces(
  pieces: readonly Piece[],
  area: Phaser.Geom.Rectangle,
  seconds: number,
): void {
  const margin = OXYGEN_FACTORY_BALANCE.atomRadius * 2;
  const { left, right, top, bottom } = area;
  for (const { body, velocity, busy } of pieces) {
    if (busy) continue;
    body.x += velocity.x * seconds;
    body.y += velocity.y * seconds;
    if (body.x < left + margin || body.x > right - margin) velocity.x *= -1;
    if (body.y < top + margin || body.y > bottom - margin) velocity.y *= -1;
    body.x = Phaser.Math.Clamp(body.x, left + margin, right - margin);
    body.y = Phaser.Math.Clamp(body.y, top + margin, bottom - margin);
  }
}
