import type Phaser from 'phaser';
import type { Rect } from '../../ui/layout';
import { PALETTE, STAT_COLORS } from '../../ui/palette';
import { addSprite, type SpriteKey } from '../../ui/sprites';

/**
 * Spec 07 — The pictures of the solar mission: the Sun, the panels, the bolt and the battery.
 * Colors mean something: yellow is sunlight and energy (the same color as the energy bar),
 * and the dust is the orange-brown of Mars.
 */
const SUN_RAYS = 8;
const RAY_LENGTH = 0.5;
const RAY_WIDTH = 3;
const BATTERY_CAP_WIDTH = 0.4;
const BATTERY_CAP_HEIGHT = 5;
const BATTERY_PADDING = 3;

/** A round yellow Sun with little rays around it. */
export function addSun(scene: Phaser.Scene, x: number, y: number, radius: number) {
  const sun = scene.add.container(x, y);
  const rays = scene.add.graphics();
  rays.lineStyle(RAY_WIDTH, PALETTE.sun, 1);
  for (let ray = 0; ray < SUN_RAYS; ray += 1) {
    const angle = (ray / SUN_RAYS) * Math.PI * 2;
    const inner = radius * 1.15;
    const outer = radius * (1.15 + RAY_LENGTH);
    rays.lineBetween(
      Math.cos(angle) * inner,
      Math.sin(angle) * inner,
      Math.cos(angle) * outer,
      Math.sin(angle) * outer,
    );
  }
  sun.add([rays, scene.add.circle(0, 0, radius, PALETTE.sun).setStrokeStyle(2, PALETTE.white)]);
  return sun;
}

/** A battery that fills with yellow energy from the bottom (`level` from 0 to 1). */
export function drawBattery(graphics: Phaser.GameObjects.Graphics, rect: Rect, level: number) {
  const capWidth = rect.width * BATTERY_CAP_WIDTH;
  const capX = rect.x + (rect.width - capWidth) / 2;
  graphics.clear();
  graphics.fillStyle(PALETTE.metalLight, 1);
  graphics.fillRect(capX, rect.y - BATTERY_CAP_HEIGHT, capWidth, BATTERY_CAP_HEIGHT);
  graphics.fillStyle(PALETTE.night, 1).fillRect(rect.x, rect.y, rect.width, rect.height);
  graphics.lineStyle(2, PALETTE.metalLight, 1).strokeRect(rect.x, rect.y, rect.width, rect.height);
  const innerHeight = rect.height - BATTERY_PADDING * 2;
  const fillHeight = innerHeight * Math.min(1, Math.max(0, level));
  graphics.fillStyle(STAT_COLORS.energy, 1);
  graphics.fillRect(
    rect.x + BATTERY_PADDING,
    rect.y + BATTERY_PADDING + innerHeight - fillHeight,
    rect.width - BATTERY_PADDING * 2,
    fillHeight,
  );
}

/** A small battery for the picture steps, centered on (0, 0). */
export function addBatteryIcon(scene: Phaser.Scene, level: number, height: number) {
  const graphics = scene.add.graphics();
  const width = height * 0.6;
  drawBattery(graphics, { x: -width / 2, y: -height / 2, width, height }, level);
  return graphics;
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
