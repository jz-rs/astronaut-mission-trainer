import type Phaser from 'phaser';
import { astronautFrameKey } from '../../ui/astronautFrames';
import { PALETTE, TECH_GLOW } from '../../ui/palette';
import { addSpriteSized, type SpriteKey } from '../../ui/sprites';

/**
 * Sprites of the shield wall: radiation rays, wall panels, the blocks that plug the holes and the
 * habitat they protect.
 */
export type BlockMaterial = 'water' | 'regolith';

const RAY_THICKNESS = 20;
const RAY_ANGLE = 90;

const BLOCK_SPRITES: Record<BlockMaterial, SpriteKey> = {
  water: 'shieldBlockWater',
  regolith: 'shieldBlockRegolith',
};

/** A radiation ray falling straight down. The sprite is a horizontal zigzag, so it is turned. */
export function addRay(
  scene: Phaser.Scene,
  x: number,
  fromY: number,
  toY: number,
): Phaser.GameObjects.Image {
  const ray = scene.add.image(x, (fromY + toY) / 2, 'radiationRay').setAngle(RAY_ANGLE);
  return ray.setDisplaySize(toY - fromY, RAY_THICKNESS);
}

/** Wall panel, whole or broken (a hole the rays go through), with its top-left corner at (x, y). */
export function addWallPanel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  size: number,
  broken: boolean,
): Phaser.GameObjects.Image {
  const key = broken ? 'shieldPanelHole' : 'shieldPanel';
  return addSpriteSized(scene, x + size / 2, y + size / 2, key, size);
}

/** Block centered on (0, 0), ready to go inside a draggable container. */
export function addShieldBlock(
  scene: Phaser.Scene,
  material: BlockMaterial,
  size: number,
): Phaser.GameObjects.Image {
  return addSpriteSized(scene, 0, 0, BLOCK_SPRITES[material], size);
}

const HABITAT_WIDTH = 200;
const HABITAT_HEIGHT = 40;
const CREW_HEIGHT = 34;
const CREW_SPACING = 30;

/**
 * The habitat seen from the side, with two astronauts inside: they are who the wall protects,
 * so the kid sees the rays that get through fall on them.
 */
export function addHabitat(scene: Phaser.Scene, centerX: number, floorY: number): void {
  const graphics = scene.add.graphics();
  graphics
    .fillStyle(PALETTE.metal, 0.6)
    .fillEllipse(centerX, floorY, HABITAT_WIDTH, HABITAT_HEIGHT);
  graphics.lineStyle(2, TECH_GLOW, 1).strokeEllipse(centerX, floorY, HABITAT_WIDTH, HABITAT_HEIGHT);
  for (const [color, offset] of [
    ['violet', -CREW_SPACING / 2],
    ['green', CREW_SPACING / 2],
  ] as const) {
    const astronaut = scene.add.image(centerX + offset, floorY, astronautFrameKey(color, 'front'));
    astronaut.setOrigin(0.5, 1).setScale(CREW_HEIGHT / astronaut.height);
  }
}
