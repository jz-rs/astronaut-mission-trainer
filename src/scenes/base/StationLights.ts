import Phaser from 'phaser';
import { NIGHT_BALANCE } from '../../config/balance';
import { GAME_HEIGHT, GAME_WIDTH } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';

/**
 * Night over the base, with the station's lights on. Mars outside goes violet, but inside the
 * rooms and the corridors the floors keep their colors with a warm light, as if the lamps were
 * on. The inside is the shape of each room seen from above (traced on the map pictures; every
 * level uses the same base layout). It goes under the room signs and the astronauts, so they
 * stay crisp and easy to read at night.
 */
const OUTLINES: readonly (readonly number[])[] = [
  // oxygen factory
  [
    95, 91, 188, 47, 268, 86, 268, 121, 251, 124, 209, 133, 183, 144, 159, 137, 131, 146, 126, 109,
    95, 107,
  ],
  // greenhouse (the door arch and the pipes outside stay dark)
  [
    373, 88, 460, 47, 563, 99, 563, 133, 549, 133, 518, 140, 518, 179, 492, 170, 445, 150, 436, 135,
    427, 122, 412, 119, 405, 124, 395, 126, 373, 126,
  ],
  // shield wall
  [75, 249, 160, 205, 244, 238, 240, 266, 174, 297, 131, 286, 78, 269],
  // solar panels room (the panels outside stay dark)
  [400, 238, 449, 218, 549, 273, 549, 292, 505, 305, 397, 262],
  // corridors
  [
    242, 129, 316, 164, 390, 129, 407, 144, 348, 183, 414, 220, 394, 236, 324, 201, 244, 240, 222,
    227, 285, 190, 216, 151,
  ],
];
/** How much of the outside night still reaches the inside (the walls block part of it). */
const INSIDE_NIGHT = 0.45;
/** The warm lamp light added inside at full night. */
const LAMP_ALPHA = 0.08;

export class StationLights {
  private readonly outsideTint: Phaser.GameObjects.Rectangle;
  private readonly outsideShade: Phaser.GameObjects.Rectangle;
  private readonly insideTint: Phaser.GameObjects.Rectangle;
  private readonly lamps: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    const shape = scene.make.graphics({}, false).fillStyle(PALETTE.white, 1);
    for (const outline of OUTLINES) shape.fillPoints(toPoints(outline), true);
    const outside = shape.createGeometryMask().setInvertAlpha(true);
    const inside = shape.createGeometryMask();
    this.outsideTint = addLayer(scene, PALETTE.violet, Phaser.BlendModes.MULTIPLY, outside);
    this.outsideShade = addLayer(scene, PALETTE.night, Phaser.BlendModes.NORMAL, outside);
    this.insideTint = addLayer(scene, PALETTE.violet, Phaser.BlendModes.MULTIPLY, inside);
    this.lamps = addLayer(scene, PALETTE.sand, Phaser.BlendModes.ADD, inside);
    this.setNight(0);
  }

  /** 0 = day (no change), 1 = full night (violet outside, lamps on inside). */
  setNight(amount: number): void {
    this.outsideTint.setAlpha(amount);
    this.outsideShade.setAlpha(amount * NIGHT_BALANCE.maxShade);
    this.insideTint.setAlpha(amount * INSIDE_NIGHT);
    this.lamps.setAlpha(amount * LAMP_ALPHA);
  }
}

function toPoints(outline: readonly number[]): Phaser.Math.Vector2[] {
  const points: Phaser.Math.Vector2[] = [];
  for (let index = 0; index < outline.length; index += 2) {
    points.push(new Phaser.Math.Vector2(outline[index], outline[index + 1]));
  }
  return points;
}

/** A full-screen color layer, shown only where `mask` lets it. */
function addLayer(
  scene: Phaser.Scene,
  color: number,
  blend: Phaser.BlendModes,
  mask: Phaser.Display.Masks.GeometryMask,
): Phaser.GameObjects.Rectangle {
  const layer = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, color).setOrigin(0);
  return layer.setBlendMode(blend).setMask(mask);
}
