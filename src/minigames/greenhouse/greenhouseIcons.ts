import type Phaser from 'phaser';
import { FONT_SIZE } from '../../ui/layout';
import { PALETTE, STAT_COLORS } from '../../ui/palette';
import { addSprite, type SpriteKey } from '../../ui/sprites';
import { addText } from '../../ui/text';

/**
 * Spec 09 — The little pictures of the greenhouse. Colors mean something: pink is the LED light
 * of Veggie (red + blue LEDs look pink), blue is oxygen (like in the oxygen mission), green is
 * food (the food bar), and Mars soil is the red-brown of Mars.
 */
export const LED_PINK = PALETTE.violet;
const LAMP_WIDTH = 34;
const LAMP_HEIGHT = 6;
const LAMP_GLOW = 0.3;
/** The light spreads down from the lamp, a bit wider at the bottom. */
const GLOW_HEIGHT = 30;
const GLOW_SPREAD = 10;
const BUBBLE_RADIUS = 11;
const SOIL_WIDTH = 30;
const SOIL_HEIGHT = 14;
const CROSS_SIZE = 9;
const EARTH_RADIUS = 11;
/** The Mars soil tool: a red-brown heap with darker grains, with no cross (the kid must know). */
const HEAP_WIDTH = 34;
const HEAP_HEIGHT = 18;
const GRAINS: readonly { x: number; y: number }[] = [
  { x: -8, y: -2 },
  { x: 3, y: -6 },
  { x: 9, y: 1 },
  { x: -2, y: 3 },
];
const GRAIN_SIZE = 3;

/** A LED lamp: a pink bar with a soft glow under it when it is on, dark when it is off. */
export function addLamp(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Graphics {
  const lamp = scene.add.graphics({ x, y });
  drawLamp(lamp, true);
  return lamp;
}

function drawLamp(lamp: Phaser.GameObjects.Graphics, on: boolean): void {
  lamp.clear();
  if (on) {
    const half = LAMP_WIDTH / 2;
    lamp.fillStyle(LED_PINK, LAMP_GLOW);
    lamp.fillPoints(
      [
        { x: -half, y: LAMP_HEIGHT },
        { x: half, y: LAMP_HEIGHT },
        { x: half + GLOW_SPREAD, y: LAMP_HEIGHT + GLOW_HEIGHT },
        { x: -half - GLOW_SPREAD, y: LAMP_HEIGHT + GLOW_HEIGHT },
      ],
      true,
    );
  }
  lamp.fillStyle(PALETTE.metalDark, 1).fillRect(-LAMP_WIDTH / 2 - 2, -3, LAMP_WIDTH + 4, 3);
  lamp.fillStyle(on ? LED_PINK : PALETTE.night, 1);
  lamp.fillRect(-LAMP_WIDTH / 2, 0, LAMP_WIDTH, LAMP_HEIGHT);
}

/** A round chip with a formula inside: "CO₂" or "O₂". */
export function addGasBubble(scene: Phaser.Scene, gas: 'co2' | 'o2'): Phaser.GameObjects.Container {
  const isOxygen = gas === 'o2';
  const color = isOxygen ? STAT_COLORS.oxygen : PALETTE.metal;
  const ball = scene.add.circle(0, 0, BUBBLE_RADIUS, color).setStrokeStyle(2, PALETTE.white);
  const label = addText(scene, 0, 0, isOxygen ? 'O₂' : 'CO₂', {
    size: FONT_SIZE.small,
    color: isOxygen ? PALETTE.night : PALETTE.white,
  });
  return scene.add.container(0, 0, [ball, label]);
}

/** Mars soil with a red cross: it is toxic for plants. */
export function addToxicSoil(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
  const soil = scene.add.graphics();
  soil.fillStyle(PALETTE.mars, 1);
  soil.fillRect(-SOIL_WIDTH / 2, -SOIL_HEIGHT / 2, SOIL_WIDTH, SOIL_HEIGHT);
  soil.lineStyle(3, PALETTE.alert, 1);
  soil.lineBetween(-CROSS_SIZE, -CROSS_SIZE, CROSS_SIZE, CROSS_SIZE);
  soil.lineBetween(-CROSS_SIZE, CROSS_SIZE, CROSS_SIZE, -CROSS_SIZE);
  return soil;
}

/** A heap of Mars soil, the decoy tool: it looks like soil, but it is toxic for the plants. */
export function addMarsSoilHeap(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
  const heap = scene.add.graphics();
  heap.fillStyle(PALETTE.mars, 1);
  heap.fillEllipse(0, HEAP_HEIGHT / 4, HEAP_WIDTH, HEAP_HEIGHT);
  heap.fillStyle(PALETTE.marsDark, 1);
  for (const { x, y } of GRAINS) heap.fillRect(x, y, GRAIN_SIZE, GRAIN_SIZE);
  return heap;
}

/** The Earth: the soil of the greenhouse comes from there. */
export function addEarth(scene: Phaser.Scene): Phaser.GameObjects.Arc {
  return scene.add.circle(0, 0, EARTH_RADIUS, PALETTE.cyan).setStrokeStyle(3, PALETTE.green);
}

/** Any sprite, scaled so its height is `height` game pixels. */
export function addSpriteOfHeight(
  scene: Phaser.Scene,
  x: number,
  y: number,
  key: SpriteKey,
  height: number,
): Phaser.GameObjects.Image {
  const image = addSprite(scene, x, y, key);
  return image.setScale((image.scale * height) / image.displayHeight);
}
