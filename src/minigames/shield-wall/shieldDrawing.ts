import type Phaser from 'phaser';
import { addSpriteSized, type SpriteKey } from '../../ui/sprites';

/** Sprites of the shield wall: radiation rays, wall panels and the blocks that plug the holes. */
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
