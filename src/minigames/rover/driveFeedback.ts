import type Phaser from 'phaser';
import { floatText } from '../../ui/floatingText';
import { MINIGAME_AREA, MINIGAME_PANEL, type Point } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addSpriteSized } from '../../ui/sprites';

/**
 * Mission 5 — What the kid sees while the rover drives: "+1" and a tube flying to the counter
 * for each rock (so it is clear rocks are good), a message over the rover, and the time bar.
 */
const TUBE_SIZE = 18;
const TUBE_FLY_MS = 350;
const ABOVE_ROVER = 30;
const TIME_BAR = { offsetY: 34, height: 6, lowFraction: 0.25 };

export function flyTubeToCounter(scene: Phaser.Scene, from: Point, counter: Point): void {
  sayAboveRover(scene, from, '+1', PALETTE.cyan);
  const tube = addSpriteSized(scene, from.x, from.y - ABOVE_ROVER / 2, 'sampleTube', TUBE_SIZE);
  scene.tweens.add({
    targets: tube,
    x: counter.x,
    y: counter.y,
    duration: TUBE_FLY_MS,
    ease: 'Sine.In',
    onComplete: () => tube.destroy(),
  });
}

export function sayAboveRover(
  scene: Phaser.Scene,
  rover: Point,
  text: string,
  color: number,
): void {
  floatText(scene, rover.x, rover.y - ABOVE_ROVER, text, color);
}

/** The bar under the instruction empties as the trip (or the storing) runs out of time. */
export function drawTripTimeBar(bar: Phaser.GameObjects.Graphics, fractionLeft: number): void {
  const y = MINIGAME_PANEL.y + TIME_BAR.offsetY;
  const { x, width } = MINIGAME_AREA;
  bar.clear();
  bar.fillStyle(PALETTE.metalDark, 1).fillRect(x, y, width, TIME_BAR.height);
  bar.fillStyle(fractionLeft < TIME_BAR.lowFraction ? PALETTE.alert : PALETTE.cyan, 1);
  bar.fillRect(x, y, width * fractionLeft, TIME_BAR.height);
}
