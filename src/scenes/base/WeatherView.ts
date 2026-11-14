import Phaser from 'phaser';
import { FROST_TEXTURE_KEY, biomeLook } from '../../ui/biomes';
import { GAME_HEIGHT, GAME_WIDTH } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { SPRITE_SCALE } from '../../ui/sprites';

/**
 * Spec 04 — The weather of each level over the base: snow falling at the pole, dust blowing
 * across Gale. Each flake/grain is a small rectangle in a looping tween: simple and it survives
 * restarting the base (Phaser's particle emitter left the screen black after a restart).
 */
const SNOW = { count: 110, size: 2, minMs: 9000, maxMs: 18000, drift: 12, alpha: 0.9 };
const DUST = { count: 45, width: 6, height: 2, minMs: 4000, maxMs: 8000, alpha: 0.75 };
/** Frost covers the HUD corners a little, so it stays see-through. */
const FROST_ALPHA = 0.85;

/** Weather goes over the base and the astronauts; call before drawing the HUD. */
export function addWeather(scene: Phaser.Scene, locationId: string): void {
  const { weather } = biomeLook(locationId);
  if (weather === 'snow') addSnow(scene);
  if (weather === 'dust') addDust(scene);
}

/** Frost in the screen corners, over everything (UI included). Call after drawing the HUD. */
export function addFrost(scene: Phaser.Scene, locationId: string): void {
  if (!biomeLook(locationId).hasFrost) return;
  scene.add
    .image(0, 0, FROST_TEXTURE_KEY)
    .setOrigin(0)
    .setScale(SPRITE_SCALE)
    .setAlpha(FROST_ALPHA);
}

function addSnow(scene: Phaser.Scene): void {
  for (let index = 0; index < SNOW.count; index++) {
    const x = Phaser.Math.Between(0, GAME_WIDTH);
    const flake = scene.add.rectangle(x, -SNOW.size, SNOW.size, SNOW.size, PALETTE.white);
    flake.setAlpha(SNOW.alpha);
    const duration = Phaser.Math.Between(SNOW.minMs, SNOW.maxMs);
    scene.tweens.add({
      targets: flake,
      y: GAME_HEIGHT + SNOW.size,
      x: x + Phaser.Math.Between(-SNOW.drift, SNOW.drift),
      duration,
      repeat: -1,
      // starts mid-fall, so the screen is already full of snow
      delay: -Phaser.Math.Between(0, duration),
    });
  }
}

function addDust(scene: Phaser.Scene): void {
  for (let index = 0; index < DUST.count; index++) {
    const y = Phaser.Math.Between(0, GAME_HEIGHT);
    const grain = scene.add.rectangle(-DUST.width, y, DUST.width, DUST.height, PALETTE.sand);
    grain.setAlpha(DUST.alpha);
    const duration = Phaser.Math.Between(DUST.minMs, DUST.maxMs);
    scene.tweens.add({
      targets: grain,
      x: GAME_WIDTH + DUST.width,
      duration,
      repeat: -1,
      delay: -Phaser.Math.Between(0, duration),
    });
  }
}
