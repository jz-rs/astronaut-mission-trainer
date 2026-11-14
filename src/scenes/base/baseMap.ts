import type Phaser from 'phaser';
import { BASE_MAP_OFFSET_Y } from '../../ui/layout';
import { SPRITE_SCALE } from '../../ui/sprites';
import { MapStatusSprites } from './MapStatusSprites';

/**
 * The empty isometric base on Mars (`fondos/mapa-base.png`) plus the sprites that show its state.
 * Rooms and astronauts are drawn on top. It is moved down a little so the HUD only hides Mars ground.
 */
export function drawBaseMap(scene: Phaser.Scene): MapStatusSprites {
  scene.add.image(0, BASE_MAP_OFFSET_Y, 'baseMap').setOrigin(0).setScale(SPRITE_SCALE);
  return new MapStatusSprites(scene);
}
