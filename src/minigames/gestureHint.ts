import type Phaser from 'phaser';
import type { Point } from '../ui/layout';
import { PALETTE } from '../ui/palette';
import { addText } from '../ui/text';

/**
 * A ghost finger that shows the gesture of a minigame without words: it taps on `from`,
 * or presses on `from` and drags to `to`, over and over. It disappears on the kid's first touch,
 * or when the returned function is called (the step it showed is over).
 */
const HAND_SIZE = 32;
/** The fingertip of 👆 is near the top, a bit left of center. */
const FINGERTIP = { x: 0.4, y: 0.05 };
const RING_RADIUS = 22;
const DRAG_MS = 800;
const PAUSE_MS = 500;
const DEPTH = 50;

export function showGestureHint(scene: Phaser.Scene, from: Point, to?: Point): () => void {
  const ring = scene.add.circle(0, 0, RING_RADIUS);
  ring.setStrokeStyle(2, PALETTE.white).setAlpha(0);
  const hand = addText(scene, 0, 0, '👆', { size: HAND_SIZE }).setOrigin(FINGERTIP.x, FINGERTIP.y);
  const hint = scene.add.container(from.x, from.y, [ring, hand]).setDepth(DEPTH);
  const press = {
    targets: ring,
    alpha: { from: 1, to: 0 },
    scale: { from: 0.4, to: 1 },
    duration: 400,
  };
  const steps = to
    ? [
        { targets: hint, x: from.x, y: from.y, duration: 0 },
        press,
        { targets: hint, x: to.x, y: to.y, duration: DRAG_MS, ease: 'Sine.InOut' },
        { targets: hint, alpha: 0, duration: 200 },
        { targets: hint, alpha: 1, duration: 0, delay: PAUSE_MS },
      ]
    : [press, { targets: ring, alpha: 0, duration: PAUSE_MS }];
  const loop = scene.tweens.chain({ targets: hint, tweens: steps, loop: -1 });
  const hide = () => {
    scene.input.off('pointerdown', hide);
    loop.stop();
    hint.destroy();
  };
  scene.input.once('pointerdown', hide);
  return hide;
}
