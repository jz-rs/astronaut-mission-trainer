import type Phaser from 'phaser';
import { INTRO_BALANCE } from '../../config/balance';
import { CABIN_FLOATING_ITEM_SIZE, CABIN_FLOATING_ITEMS } from '../../ui/layout';

/**
 * Spec 19 — A pen, a water pouch, a toy rocket, a wrench and a snack drift around the cabin:
 * in zero gravity nothing stays put. They are only decoration; nothing happens when tapped.
 */
const ITEM_DEPTH = 5;
/** Each item starts its drift a bit later, so they never move in step. */
const STAGGER_MS = 450;

export function addFloatingItems(scene: Phaser.Scene): Phaser.GameObjects.Image[] {
  const { itemFloatMs, itemFloatPx, itemSpinDeg } = INTRO_BALANCE;
  return CABIN_FLOATING_ITEMS.map(({ key, x, y, angle }, index) => {
    const item = scene.add.image(x, y, key).setAngle(angle).setDepth(ITEM_DEPTH);
    item.setScale(CABIN_FLOATING_ITEM_SIZE / Math.max(item.width, item.height));
    scene.tweens.add({
      targets: item,
      y: y - itemFloatPx,
      angle: angle + itemSpinDeg,
      yoyo: true,
      repeat: -1,
      delay: index * STAGGER_MS,
      duration: itemFloatMs + index * STAGGER_MS,
      ease: 'Sine.InOut',
    });
    return item;
  });
}
