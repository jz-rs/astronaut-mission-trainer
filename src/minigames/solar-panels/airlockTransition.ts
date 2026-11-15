/** A short pixel-art shutter crossing keeps input and the mission clock paused. */
import type Phaser from 'phaser';
import { SOLAR_PANELS_BALANCE } from '../../config/balance';
import type { Rect } from '../../ui/layout';
import { addSprite } from '../../ui/sprites';
import { PALETTE } from '../../ui/palette';

const TRANSITION_DEPTH = 200;

export function crossAirlock(scene: Phaser.Scene, area: Rect, onComplete: () => void): void {
  const centerX = area.x + area.width / 2;
  const centerY = area.y + area.height / 2;
  const shape = scene.make.graphics({}, false);
  shape.fillStyle(PALETTE.white, 1);
  shape.fillRect(area.x, area.y, area.width, area.height);
  const mask = shape.createGeometryMask();
  const shutters = [-1, 1].map((side) => {
    const image = addSprite(scene, centerX + side * area.width, centerY, 'airlockShutter');
    image.setDisplaySize(area.width / 2, area.height);
    image.setDepth(TRANSITION_DEPTH);
    image.setMask(mask);
    return { image, side };
  });
  const light = addSprite(scene, centerX, area.y + 18, 'airlockRed');
  light
    .setDisplaySize(18, 18)
    .setDepth(TRANSITION_DEPTH + 1)
    .setVisible(false);
  for (const { image, side } of shutters) {
    animateShutter(scene, image, light, area, side, () => {
      image.destroy();
      if (side === 1) {
        light.destroy();
        mask.destroy();
        shape.destroy();
        onComplete();
      }
    });
  }
}

function animateShutter(
  scene: Phaser.Scene,
  image: Phaser.GameObjects.Image,
  light: Phaser.GameObjects.Image,
  area: Rect,
  side: number,
  onComplete: () => void,
): void {
  const centerX = area.x + area.width / 2;
  scene.tweens.chain({
    targets: image,
    tweens: [
      { x: centerX + (side * area.width) / 4, duration: SOLAR_PANELS_BALANCE.airlockCloseMs },
      {
        alpha: 1,
        duration: SOLAR_PANELS_BALANCE.airlockHoldMs,
        onStart: () => light.setVisible(true),
        onComplete: () => light.setTexture('airlockGreen'),
      },
      { x: centerX + side * area.width, duration: SOLAR_PANELS_BALANCE.airlockOpenMs },
    ],
    onComplete,
  });
}
