import Phaser from 'phaser';
import { TASK_IDS } from '../../core/types';
import { PLAYER_IDLE_SPOT, ROOM_LAYOUTS, type Point } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';

/**
 * At night the station turns its lights on: a warm glow inside every room and in the corridors,
 * while Mars outside stays violet. Each glow is a few stacked ellipses that add light (brighter
 * in the middle, soft at the edges), drawn over the night shade.
 */
const MAX_ALPHA = 0.45;
const GLOW_LAYERS = 8;
/** The glow fills this much of each room's touch area. */
const ROOM_GLOW = { width: 0.75, height: 0.5 };
const CORRIDOR_GLOW = { width: 190, height: 90 };

export class StationLights {
  private readonly glows: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene) {
    this.glows = scene.add.container(0, 0);
    for (const taskId of TASK_IDS) {
      const { rect, workCenter } = ROOM_LAYOUTS[taskId];
      const size = { width: rect.width * ROOM_GLOW.width, height: rect.height * ROOM_GLOW.height };
      this.addGlow(scene, workCenter, size);
    }
    this.addGlow(scene, PLAYER_IDLE_SPOT, CORRIDOR_GLOW);
    this.setNight(0);
  }

  /** 0 = day (lights off), 1 = full night (lights at their brightest). */
  setNight(amount: number): void {
    this.glows.setAlpha(amount * MAX_ALPHA);
  }

  private addGlow(
    scene: Phaser.Scene,
    center: Point,
    size: { width: number; height: number },
  ): void {
    for (let layer = 1; layer <= GLOW_LAYERS; layer += 1) {
      const share = layer / GLOW_LAYERS;
      const ellipse = scene.add.ellipse(
        center.x,
        center.y,
        size.width * share,
        size.height * share,
        PALETTE.sand,
        1 / GLOW_LAYERS,
      );
      ellipse.setBlendMode(Phaser.BlendModes.ADD);
      this.glows.add(ellipse);
    }
  }
}
