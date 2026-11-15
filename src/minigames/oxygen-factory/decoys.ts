import type Phaser from 'phaser';
import { t, type TranslationKey } from '../../i18n';
import { floatText } from '../../ui/floatingText';
import { PALETTE } from '../../ui/palette';
import { createPiece, randomSpot, type Piece } from './pieces';

/**
 * Mars air is about 95 % CO₂, but it also has a little nitrogen (N₂) and argon (Ar). They float
 * among the CO₂ as decoys: MOXIE can't make oxygen from them, so it spits them back out with a
 * one-line message. A kid who reads the letters on the molecules doesn't fall for them.
 */
const DECOY_KINDS = ['n2', 'ar'] as const;
type DecoyKind = (typeof DECOY_KINDS)[number];

const REJECT_KEYS: Record<DecoyKind, TranslationKey> = {
  n2: 'minigame.oxygen-factory.notNitrogen',
  ar: 'minigame.oxygen-factory.notArgon',
};
const BOUNCE_MS = 450;
/** The message teaches something, so it stays long enough for a young kid to read it. */
const MESSAGE_MS = 2_400;
const MESSAGE_TOP_INSET = 40;

export function spawnDecoys(
  scene: Phaser.Scene,
  area: Phaser.Geom.Rectangle,
  speed: number,
): Piece[] {
  return DECOY_KINDS.map((kind) => {
    const { x, y } = randomSpot(area);
    return createPiece(scene, kind, x, y, speed);
  });
}

export function isDecoy(piece: Piece): piece is Piece & { kind: DecoyKind } {
  return (DECOY_KINDS as readonly string[]).includes(piece.kind);
}

/** MOXIE says no: the molecule bounces back into the air and can be grabbed again. */
export function rejectDecoy(
  scene: Phaser.Scene,
  piece: Piece & { kind: DecoyKind },
  area: Phaser.Geom.Rectangle,
): void {
  piece.busy = true;
  piece.body.disableInteractive();
  const message = t(REJECT_KEYS[piece.kind]);
  floatText(scene, area.centerX, area.top + MESSAGE_TOP_INSET, message, PALETTE.alert, MESSAGE_MS);
  scene.cameras.main.shake(BOUNCE_MS / 3, 0.004);
  const { x, y } = randomSpot(area);
  scene.tweens.add({
    targets: piece.body,
    x,
    y,
    duration: BOUNCE_MS,
    ease: 'Back.easeOut',
    onComplete: () => {
      piece.busy = false;
      piece.body.setInteractive({ draggable: true, useHandCursor: true });
    },
  });
}
