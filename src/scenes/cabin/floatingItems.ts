import Phaser from 'phaser';
import { INTRO_BALANCE } from '../../config/balance';
import {
  CABIN_FLOATING_AREA,
  CABIN_FLOATING_ITEM_SIZE,
  CABIN_FLOATING_ITEMS,
} from '../../ui/layout';
import { PALETTE } from '../../ui/palette';

/**
 * Spec 19 — A pen, a water pouch, a toy rocket, a wrench and a snack float around the cabin.
 * Zero gravity: nothing pushes them, so each one keeps a slow, steady drift in a straight line
 * and a slow turn, and only changes direction when it bumps softly into a wall. A thin gray
 * halo keeps them visible over the white walls. Only decoration: they never block a tap.
 */
const ITEM_DEPTH = 18;
const HALO = { strength: 2, quality: 0.1, distance: 3 } as const;

interface FloatingItem {
  image: Phaser.GameObjects.Image;
  velocity: Phaser.Math.Vector2;
}

export function addFloatingItems(scene: Phaser.Scene): void {
  const items = CABIN_FLOATING_ITEMS.map(({ key, x, y, angle }) => {
    const image = scene.add.image(x, y, key).setAngle(angle).setDepth(ITEM_DEPTH);
    image.setScale(CABIN_FLOATING_ITEM_SIZE / Math.max(image.width, image.height));
    image.preFX?.addGlow(PALETTE.metal, HALO.strength, 0, false, HALO.quality, HALO.distance);
    spin(scene, image);
    return { image, velocity: randomDrift() };
  });
  const drift = (_time: number, deltaMs: number) => items.forEach((item) => move(item, deltaMs));
  scene.events.on(Phaser.Scenes.Events.UPDATE, drift);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () =>
    scene.events.off(Phaser.Scenes.Events.UPDATE, drift),
  );
}

function randomDrift(): Phaser.Math.Vector2 {
  const { itemDriftMinPxPerSecond, itemDriftMaxPxPerSecond } = INTRO_BALANCE;
  const speed = Phaser.Math.FloatBetween(itemDriftMinPxPerSecond, itemDriftMaxPxPerSecond);
  return new Phaser.Math.Vector2(speed, 0).rotate(Phaser.Math.FloatBetween(0, Math.PI * 2));
}

/** Straight ahead at the same speed; a soft bounce off the edges of the cabin. */
function move({ image, velocity }: FloatingItem, deltaMs: number): void {
  const { x, y, width, height } = CABIN_FLOATING_AREA;
  image.x += (velocity.x * deltaMs) / 1000;
  image.y += (velocity.y * deltaMs) / 1000;
  if (image.x < x || image.x > x + width)
    velocity.x = Math.sign(x + width / 2 - image.x) * Math.abs(velocity.x);
  if (image.y < y || image.y > y + height)
    velocity.y = Math.sign(y + height / 2 - image.y) * Math.abs(velocity.y);
}

/** A slow turn that never stops, clockwise or not. */
function spin(scene: Phaser.Scene, image: Phaser.GameObjects.Image): void {
  const { itemSpinMinMs, itemSpinMaxMs } = INTRO_BALANCE;
  scene.tweens.add({
    targets: image,
    angle: image.angle + Phaser.Math.RND.pick([-1, 1]) * 360,
    repeat: -1,
    duration: Phaser.Math.Between(itemSpinMinMs, itemSpinMaxMs),
  });
}
