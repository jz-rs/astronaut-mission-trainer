/** Sample the whole finger path so fast swipes cannot skip over dust cells. */
import Phaser from 'phaser';
import type { DustCover } from './dustCover';

const SWIPE_SAMPLE_STEP = 4;

export function bindSolarBrush(
  scene: Phaser.Scene,
  dust: DustCover,
  acceptsInput: () => boolean,
  onWipe: (panels: Set<number>) => void,
): void {
  let previous: Phaser.Math.Vector2 | null = null;
  const swipe = (pointer: Phaser.Input.Pointer) => {
    if (!pointer.isDown || !acceptsInput()) return;
    const current = new Phaser.Math.Vector2(pointer.x, pointer.y);
    onWipe(wipeLine(dust, previous ?? current, current));
    previous = current;
  };
  scene.input.on('pointerdown', swipe);
  scene.input.on('pointermove', swipe);
  scene.input.on('pointerup', () => {
    previous = null;
  });
}

function wipeLine(
  dust: DustCover,
  from: Phaser.Math.Vector2,
  to: Phaser.Math.Vector2,
): Set<number> {
  const steps = Math.max(1, Math.ceil(from.distance(to) / SWIPE_SAMPLE_STEP));
  const touched = new Set<number>();
  for (let step = 0; step <= steps; step++) {
    const point = from.clone().lerp(to, step / steps);
    dust.wipeAt(point.x, point.y).forEach((panel) => touched.add(panel));
  }
  return touched;
}
