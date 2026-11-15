/** One airlock overlay for every biome; the lamp responds to nearby crew sprites. */
import Phaser from 'phaser';
import { SOLAR_AIRLOCK_SIZE, SOLAR_AIRLOCK_SPOT, SOLAR_FOOTPRINTS } from '../../ui/layout';
import { addSprite } from '../../ui/sprites';

const LAMP_OFFSET = { x: 4, y: -48 };
const LAMP_HEIGHT = 7;
const APPROACH_DISTANCE = 27;

export class SolarAirlock {
  private readonly lamp: Phaser.GameObjects.Image;

  constructor(private readonly scene: Phaser.Scene) {
    const { x, y } = SOLAR_AIRLOCK_SPOT;
    addSprite(scene, x, y, 'mapAirlock')
      .setOrigin(0.5, 1)
      .setDisplaySize(SOLAR_AIRLOCK_SIZE.width, SOLAR_AIRLOCK_SIZE.height);
    addSprite(scene, x + 39, y + 3, 'solarBatteryEmpty')
      .setOrigin(0.5, 1)
      .setDisplaySize(22, 32);
    for (const point of SOLAR_FOOTPRINTS) {
      addSprite(scene, point.x, point.y, 'footprints').setDisplaySize(8, 8).setAlpha(0.65);
    }
    this.lamp = addSprite(scene, x + LAMP_OFFSET.x, y + LAMP_OFFSET.y, 'airlockRed');
    this.lamp.setDisplaySize(LAMP_HEIGHT, LAMP_HEIGHT);
  }

  update(): void {
    const nearby = this.scene.children.list.some(
      (child) =>
        child instanceof Phaser.GameObjects.Sprite &&
        child.texture.key.startsWith('astronaut-') &&
        Phaser.Math.Distance.Between(child.x, child.y, SOLAR_AIRLOCK_SPOT.x, SOLAR_AIRLOCK_SPOT.y) <
          APPROACH_DISTANCE,
    );
    this.lamp.setTexture(nearby ? 'airlockGreen' : 'airlockRed');
  }
}
