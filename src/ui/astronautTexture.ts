import Phaser from 'phaser';
import { PALETTE } from './palette';

/**
 * Placeholder astronaut drawn pixel by pixel until the sprites of spec 01 arrive.
 * White suit, colored visor and LED chest strip (STYLE_GUIDE: "Tripulación").
 */
const TEXTURE_WIDTH = 14;
const TEXTURE_HEIGHT = 20;

/** [x, y, width, height] in texture pixels, drawn in this order. */
type Part = readonly [number, number, number, number];

const SUIT_PARTS: readonly Part[] = [
  [3, 1, 8, 1], // helmet top
  [2, 2, 10, 5], // helmet
  [1, 8, 1, 5], // backpack left
  [12, 8, 1, 5], // backpack right
  [3, 7, 8, 6], // body
  [1, 8, 2, 4], // left arm
  [11, 8, 2, 4], // right arm
  [4, 13, 2, 5], // left leg
  [8, 13, 2, 5], // right leg
];
const VISOR: Part = [3, 3, 8, 3];
const VISOR_SHINE: Part = [4, 3, 2, 1];
const CHEST_LIGHT: Part = [5, 9, 4, 1];
const BELT: Part = [3, 12, 8, 1];
const GLOVES: readonly Part[] = [
  [1, 12, 2, 1],
  [11, 12, 2, 1],
];
const BOOTS: readonly Part[] = [
  [3, 18, 4, 1],
  [7, 18, 4, 1],
];

export function astronautTextureKey(visorColor: number): string {
  return `astronaut-${visorColor.toString(16)}`;
}

export function ensureAstronautTexture(scene: Phaser.Scene, visorColor: number): string {
  const key = astronautTextureKey(visorColor);
  if (scene.textures.exists(key)) return key;

  const graphics = scene.make.graphics({}, false);
  const fill = (part: Part, color: number) => graphics.fillStyle(color, 1).fillRect(...part);
  const outline = ([x, y, width, height]: Part) =>
    graphics.fillStyle(PALETTE.night, 1).fillRect(x - 1, y - 1, width + 2, height + 2);

  [...SUIT_PARTS, ...BOOTS].forEach(outline);
  SUIT_PARTS.forEach((part) => fill(part, PALETTE.white));
  fill(VISOR, visorColor);
  fill(VISOR_SHINE, PALETTE.white);
  fill(CHEST_LIGHT, visorColor);
  fill(BELT, PALETTE.metalLight);
  GLOVES.forEach((part) => fill(part, PALETTE.metalLight));
  BOOTS.forEach((part) => fill(part, PALETTE.metal));

  graphics.generateTexture(key, TEXTURE_WIDTH, TEXTURE_HEIGHT);
  graphics.destroy();
  return key;
}
