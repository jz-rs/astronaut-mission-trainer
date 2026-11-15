import type Phaser from 'phaser';
import { LOCATIONS } from '../../content/locations';
import { CONSOLE_ROUTE_SCREEN, MARS_MAP_POINTS, MARS_MAP_RECT, type Point } from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';

/**
 * Spec 18, scene 4 — The small route screen of the console: a tiny flat map of Mars with the
 * five destinations in the same places as the big Mars map (spec 12). The selected one blinks.
 */
const SCREEN = CONSOLE_ROUTE_SCREEN;
const DOT_SIZE = 3;
const SELECTED_DOT_SIZE = 5;
const BLINK_MS = 400;

export function drawRouteMap(
  scene: Phaser.Scene,
  selectedIndex: number,
): Phaser.GameObjects.GameObject[] {
  const map = scene.add.graphics();
  drawTinyMars(map);
  const dots = LOCATIONS.map((location, index) => {
    const point = toScreen(MARS_MAP_POINTS[location.id] ?? { x: 0, y: 0 });
    const selected = index === selectedIndex;
    const size = selected ? SELECTED_DOT_SIZE : DOT_SIZE;
    const dot = scene.add.rectangle(
      point.x,
      point.y,
      size,
      size,
      selected ? PALETTE.sun : TECH_GLOW,
    );
    if (selected) blink(scene, dot);
    return dot;
  });
  return [map, ...dots];
}

/** Same features as the big map, much simpler: rusty ground, polar cap, Tharsis and the canyon. */
function drawTinyMars(graphics: Phaser.GameObjects.Graphics): void {
  const { x, y, width, height } = SCREEN;
  graphics.fillStyle(PALETTE.mars, 1).fillRect(x, y, width, height);
  graphics.fillStyle(PALETTE.marsLight, 1).fillRect(x, y + height * 0.6, width, height * 0.15);
  graphics.fillStyle(PALETTE.white, 0.9).fillRect(x, y, width, 2);
  graphics.fillStyle(PALETTE.white, 0.8).fillEllipse(x + width / 2, y + 3, width * 0.3, 3);
  graphics
    .fillStyle(PALETTE.marsDark, 1)
    .fillTriangle(x + 8, y + 15, x + 11, y + 10, x + 14, y + 15);
  graphics.lineStyle(1, PALETTE.marsDark, 1).lineBetween(x + 20, y + 17, x + 34, y + 18);
}

function toScreen(point: Point): Point {
  return {
    x: SCREEN.x + ((point.x - MARS_MAP_RECT.x) / MARS_MAP_RECT.width) * SCREEN.width,
    y: SCREEN.y + ((point.y - MARS_MAP_RECT.y) / MARS_MAP_RECT.height) * SCREEN.height,
  };
}

function blink(scene: Phaser.Scene, dot: Phaser.GameObjects.Rectangle): void {
  scene.tweens.add({ targets: dot, alpha: 0.2, yoyo: true, repeat: -1, duration: BLINK_MS });
  // The screens are redrawn on every button press: the old dot's tween must stop with it.
  dot.once('destroy', () => scene.tweens.killTweensOf(dot));
}
