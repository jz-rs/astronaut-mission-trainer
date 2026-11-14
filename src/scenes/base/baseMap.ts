import type Phaser from 'phaser';
import { baseMapKey } from '../../ui/biomes';
import { BASE_MAP_OFFSET_Y } from '../../ui/layout';
import { SPRITE_SCALE } from '../../ui/sprites';
import { MapStatusSprites } from './MapStatusSprites';

/**
 * The empty isometric base on Mars plus the sprites that show its state. Each level has its own
 * map (ground, weather and base colors of that place); rooms and astronauts are drawn on top.
 * It is moved down a little so the HUD only hides Mars ground.
 */
export function drawBaseMap(scene: Phaser.Scene, locationId: string): MapStatusSprites {
  scene.add.image(0, BASE_MAP_OFFSET_Y, baseMapKey(locationId)).setOrigin(0).setScale(SPRITE_SCALE);
  return new MapStatusSprites(scene);
}
