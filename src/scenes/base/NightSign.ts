import type Phaser from 'phaser';
import type { TaskId } from '../../core/types';
import { ROOM_LAYOUTS } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';

/**
 * A little moon over a room that needs the Sun (the solar panels) while it is night: the kid
 * sees it can't be used before tapping it. The moon is a light circle with a dark one on top.
 */
const PLATE_RADIUS = 14;
const MOON_RADIUS = 9;
const SHADOW_RADIUS = 8;
const SHADOW_OFFSET = { x: 4, y: -3 };
const CORNER_INSET = 24;
const PLATE_ALPHA = 0.85;
const BOB_PIXELS = 3;
const BOB_MS = 900;

export class NightSign {
  private readonly moon: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, taskId: TaskId) {
    const { x, y, width } = ROOM_LAYOUTS[taskId].rect;
    const centerX = x + width - CORNER_INSET;
    const centerY = y + CORNER_INSET;
    this.moon = scene.add.container(centerX, centerY, [
      scene.add.circle(0, 0, PLATE_RADIUS, PALETTE.night, PLATE_ALPHA),
      scene.add.circle(0, 0, MOON_RADIUS, PALETTE.sand),
      scene.add.circle(SHADOW_OFFSET.x, SHADOW_OFFSET.y, SHADOW_RADIUS, PALETTE.night),
    ]);
    this.moon.setVisible(false);
    scene.tweens.add({
      targets: this.moon,
      y: centerY - BOB_PIXELS,
      duration: BOB_MS,
      yoyo: true,
      repeat: -1,
    });
  }

  setVisible(isNight: boolean): void {
    this.moon.setVisible(isNight);
  }
}
