import type Phaser from 'phaser';
import { PALETTE } from '../../ui/palette';
import { addSpriteSized, type SpriteKey } from '../../ui/sprites';

/**
 * Spec 10 — The little pictures of the shield mission. Violet is radiation (and the shield bar),
 * like the zigzag rays of the wall.
 */
const PLANET_RADIUS = 11;
const RING_GAP = 5;
const METER_WIDTH = 10;
const METER_FILL = 0.7;
const RAY_ANGLE = 90;
const RAY_THICKNESS = 12;

/** Earth inside its magnetic bubble (a violet ring), which stops the radiation. */
export function addShieldedEarth(scene: Phaser.Scene): Phaser.GameObjects.Container {
  const ring = scene.add.circle(0, 0, PLANET_RADIUS + RING_GAP).setStrokeStyle(2, PALETTE.violet);
  const earth = scene.add
    .circle(0, 0, PLANET_RADIUS, PALETTE.cyan)
    .setStrokeStyle(2, PALETTE.green);
  return scene.add.container(0, 0, [ring, earth]);
}

/** Mars, with no bubble: the radiation reaches its ground. */
export function addBareMars(scene: Phaser.Scene): Phaser.GameObjects.Arc {
  return scene.add.circle(0, 0, PLANET_RADIUS, PALETTE.mars).setStrokeStyle(2, PALETTE.marsLight);
}

/** A short radiation ray falling down. */
export function addRayIcon(scene: Phaser.Scene, height: number): Phaser.GameObjects.Image {
  const ray = scene.add.image(0, 0, 'radiationRay').setAngle(RAY_ANGLE);
  return ray.setDisplaySize(height, RAY_THICKNESS);
}

/** A tiny RAD meter, almost full. */
export function addMeterIcon(scene: Phaser.Scene, height: number): Phaser.GameObjects.Graphics {
  const meter = scene.add.graphics();
  meter.fillStyle(PALETTE.night, 1).fillRect(-METER_WIDTH / 2, -height / 2, METER_WIDTH, height);
  const fillHeight = (height - 4) * METER_FILL;
  meter.fillStyle(PALETTE.violet, 1);
  meter.fillRect(-METER_WIDTH / 2 + 2, height / 2 - 2 - fillHeight, METER_WIDTH - 4, fillHeight);
  meter
    .lineStyle(2, PALETTE.metalLight, 1)
    .strokeRect(-METER_WIDTH / 2, -height / 2, METER_WIDTH, height);
  return meter;
}

export function addIcon(
  scene: Phaser.Scene,
  key: SpriteKey,
  size: number,
): Phaser.GameObjects.Image {
  return addSpriteSized(scene, 0, 0, key, size);
}
