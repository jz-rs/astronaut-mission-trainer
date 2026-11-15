import type Phaser from 'phaser';
import { FONT_SIZE } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addSpriteSized } from '../../ui/sprites';
import { addText } from '../../ui/text';

/**
 * Mission 5 — What shows up on the rover's road, drawn in the language of games so a kid gets it
 * without reading: a rock to catch looks like a prize (a pulsing cyan target, like the ones
 * scientists mark for Perseverance, and a sample tube bobbing above it); soft sand looks like
 * danger (a dark sinking patch with a red warning sign). A plain rock would read as "dodge me".
 */
const ROCK_SIZE = 36;
const TARGET_RADIUS = 26;
const TUBE_SIZE = 18;
const TUBE_ABOVE = 30;
const SAND = { width: 64, height: 28, ripples: 2 };
const SIGN = { size: 18, above: 24 };

/** The rock, its target ring and the floating tube; the tweens loop until the piece is gone. */
export function addRockTarget(
  scene: Phaser.Scene,
  x: number,
  y: number,
): Phaser.GameObjects.Container {
  const ring = scene.add.circle(0, 0, TARGET_RADIUS, PALETTE.cyan, 0.25);
  ring.setStrokeStyle(2, PALETTE.cyan);
  const rock = addSpriteSized(scene, 0, 0, 'rock', ROCK_SIZE);
  const tube = addSpriteSized(scene, 0, -TUBE_ABOVE, 'sampleTube', TUBE_SIZE);
  scene.tweens.add({
    targets: ring,
    scale: 1.2,
    alpha: 0.5,
    yoyo: true,
    repeat: -1,
    duration: 350,
  });
  scene.tweens.add({ targets: tube, y: -TUBE_ABOVE - 5, yoyo: true, repeat: -1, duration: 300 });
  return scene.add.container(x, y, [ring, rock, tube]);
}

/** Soft sand: a dark patch the wheels sink into, with a red warning sign over it. */
export function addSandPit(
  scene: Phaser.Scene,
  x: number,
  y: number,
): Phaser.GameObjects.Container {
  const sand = scene.add.graphics();
  sand.fillStyle(PALETTE.marsDark, 1).fillEllipse(0, 0, SAND.width, SAND.height);
  sand.lineStyle(2, PALETTE.sand, 0.8);
  for (let ripple = 1; ripple <= SAND.ripples; ripple += 1) {
    const rippleY = -SAND.height / 2 + (SAND.height / (SAND.ripples + 1)) * ripple;
    const halfWidth = SAND.width / 2 - 12;
    sand.lineBetween(-halfWidth, rippleY, halfWidth, rippleY);
  }
  return scene.add.container(x, y, [sand, addWarningSign(scene, -SIGN.above)]);
}

function addWarningSign(scene: Phaser.Scene, y: number): Phaser.GameObjects.Container {
  const half = SIGN.size / 2;
  const triangle = scene.add.graphics();
  triangle.fillStyle(PALETTE.alert, 1).fillTriangle(-half, half, half, half, 0, -half);
  triangle.lineStyle(2, PALETTE.white, 1).strokeTriangle(-half, half, half, half, 0, -half);
  const mark = addText(scene, 0, 2, '!', { size: FONT_SIZE.small, color: PALETTE.white });
  return scene.add.container(0, y, [triangle, mark]);
}
