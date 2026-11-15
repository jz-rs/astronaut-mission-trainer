import type Phaser from 'phaser';
import { t } from '../../i18n';
import { floatText } from '../../ui/floatingText';
import { addIconLabel, type IconLabel } from '../../ui/iconLabel';
import { FONT_SIZE, MINIGAME_AREA, MINIGAME_PANEL, type Point } from '../../ui/layout';
import { cssColor, PALETTE } from '../../ui/palette';
import { addSpriteSized } from '../../ui/sprites';

/**
 * Mission 5 — What the kid sees while the rover drives: "+1" and a tube flying to the counter
 * for each rock (so it is clear rocks are good), a message over the rover, the time bar, and
 * the samples saved when the kid comes back early with the X.
 */
const TUBE_SIZE = 18;
const COUNTER = { iconSize: 20, insetX: 40, offsetY: 20 };
const TUBE_FLY_MS = 350;
const ABOVE_ROVER = 30;
const TIME_BAR = { offsetY: 34, height: 6, lowFraction: 0.25 };
const SAVED = { iconSize: 32, popMs: 250, holdMs: 900, strokePx: 6 };

/** The samples counter, top right of the play area; it starts at 0. */
export function addSampleCounter(scene: Phaser.Scene): IconLabel {
  const x = MINIGAME_AREA.x + MINIGAME_AREA.width - COUNTER.insetX;
  const y = MINIGAME_AREA.y + COUNTER.offsetY;
  return addIconLabel(scene, x, y, 'sampleTube', COUNTER.iconSize, '0', { color: PALETTE.sun });
}

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

/**
 * Leaving early with the X: a big "+3 saved!" with a tube pops in the middle for a moment, so
 * the kid sees the samples were not lost. Then `onDone` closes the trip.
 */
export function showSavedSamples(scene: Phaser.Scene, samples: number, onDone: () => void): void {
  const text = t('rover.samplesSaved', { count: samples });
  const label = addIconLabel(scene, 0, 0, 'sampleTube', SAVED.iconSize, text, {
    size: FONT_SIZE.title,
    color: PALETTE.sun,
  });
  label.text.setStroke(cssColor(PALETTE.night), SAVED.strokePx);
  const centerX = MINIGAME_AREA.x + MINIGAME_AREA.width / 2;
  const centerY = MINIGAME_AREA.y + MINIGAME_AREA.height / 2;
  // In a container so it pops from its own center.
  const pop = scene.add.container(centerX, centerY, [label.icon, label.text]).setScale(0);
  scene.tweens.add({
    targets: pop,
    scale: 1,
    duration: SAVED.popMs,
    ease: 'Back.Out',
    hold: SAVED.holdMs,
    onComplete: onDone,
  });
}
