import type Phaser from 'phaser';
import { LOCATIONS } from '../../content/locations';
import {
  CONSOLE_ROUTE_SCREEN,
  MARS_MAP_POINTS,
  MARS_MAP_RECT,
  type Point,
  type Rect,
} from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';

/**
 * Spec 19, scene 4 — The small route screen of the console: a tiny flat map of Mars with the
 * five destinations in the same places as the big Mars map (spec 12). The selected one blinks.
 * The cabin dashboard shows it too, with nothing selected.
 */
const DOT_SIZE = 3;
const SELECTED_DOT_SIZE = 5;
const BLINK_MS = 400;

export function drawRouteMap(
  scene: Phaser.Scene,
  selectedIndex: number,
  screen: Rect = CONSOLE_ROUTE_SCREEN,
): Phaser.GameObjects.GameObject[] {
  const map = scene.add.graphics();
  drawTinyMars(map, screen);
  const dots = LOCATIONS.map((location, index) => {
    const point = toScreen(MARS_MAP_POINTS[location.id] ?? { x: 0, y: 0 }, screen);
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
function drawTinyMars(graphics: Phaser.GameObjects.Graphics, screen: Rect): void {
  const { x, y, width, height } = screen;
  // Positions as shares of the screen, so the map fits any screen size.
  const at = (shareX: number, shareY: number): [number, number] => [
    x + width * shareX,
    y + height * shareY,
  ];
  graphics.fillStyle(PALETTE.mars, 1).fillRect(x, y, width, height);
  graphics.fillStyle(PALETTE.marsLight, 1).fillRect(x, y + height * 0.6, width, height * 0.15);
  graphics.fillStyle(PALETTE.white, 0.9).fillRect(x, y, width, height * 0.08);
  graphics.fillStyle(PALETTE.white, 0.8).fillEllipse(...at(0.5, 0.1), width * 0.3, height * 0.12);
  graphics
    .fillStyle(PALETTE.marsDark, 1)
    .fillTriangle(...at(0.1, 0.55), ...at(0.14, 0.37), ...at(0.18, 0.55));
  graphics.lineStyle(1, PALETTE.marsDark, 1).lineBetween(...at(0.25, 0.63), ...at(0.43, 0.67));
}

function toScreen(point: Point, screen: Rect): Point {
  return {
    x: screen.x + ((point.x - MARS_MAP_RECT.x) / MARS_MAP_RECT.width) * screen.width,
    y: screen.y + ((point.y - MARS_MAP_RECT.y) / MARS_MAP_RECT.height) * screen.height,
  };
}

function blink(scene: Phaser.Scene, dot: Phaser.GameObjects.Rectangle): void {
  scene.tweens.add({ targets: dot, alpha: 0.2, yoyo: true, repeat: -1, duration: BLINK_MS });
  // The screens are redrawn on every button press: the old dot's tween must stop with it.
  dot.once('destroy', () => scene.tweens.killTweensOf(dot));
}
