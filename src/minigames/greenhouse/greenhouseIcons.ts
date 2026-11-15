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
const PILLOW_WIDTH = 30;
const PILLOW_HEIGHT = 10;

/** A LED lamp: a pink bar with a soft glow under it when it is on, dark when it is off. */
export function addLamp(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Graphics {
  const lamp = scene.add.graphics({ x, y });
  drawLamp(lamp, true);
  return lamp;
}

export function drawLamp(lamp: Phaser.GameObjects.Graphics, on: boolean): void {
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

/** A Veggie plant pillow (a little bag of special soil) with a sprout on top. */
export function addPillowWithSprout(
  scene: Phaser.Scene,
  height: number,
): Phaser.GameObjects.Container {
  const pillow = scene.add.rectangle(
    0,
    height / 2 - PILLOW_HEIGHT / 2,
    PILLOW_WIDTH,
    PILLOW_HEIGHT,
    PALETTE.sand,
  );
  pillow.setStrokeStyle(1, PALETTE.white);
  const sprout = addSpriteOfHeight(scene, 0, 0, 'lettuceSprout', height - PILLOW_HEIGHT);
  sprout.setOrigin(0.5, 1).setY(height / 2 - PILLOW_HEIGHT + 2);
  return scene.add.container(0, 0, [pillow, sprout]);
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
