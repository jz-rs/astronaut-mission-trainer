import type Phaser from 'phaser';
import { t } from '../../i18n';
import { CABIN_TABLET_QUAD, CABIN_TABLET_ZONE, FONT_FAMILY, type Point } from '../../ui/layout';
import { cssColor, TECH_GLOW } from '../../ui/palette';

/**
 * Spec 18 — "MANUAL" printed on the tablet's screen, lying flat in perspective like the tablet.
 * Phaser texts can only turn, not lean, so the word is drawn on a canvas with the same slant as
 * the screen (a 2D transform built from the screen's two sides).
 */
const TEXTURE_KEY = 'cabin-tablet-label';
/** Drawn 4 times bigger and shown at 1/4, so the slanted letters stay sharp. */
const RESOLUTION = 4;
const FONT_SIZE_PX = 8;
/** 0 = letters stand straight on the long side, 1 = the full lean of the screen (hard to read). */
const LEAN = 0.5;
const GLOW_BLUR_PX = 4;

export function addTabletLabel(scene: Phaser.Scene): Phaser.GameObjects.Image {
  const zone = CABIN_TABLET_ZONE;
  if (scene.textures.exists(TEXTURE_KEY)) scene.textures.remove(TEXTURE_KEY);
  const texture = scene.textures.createCanvas(
    TEXTURE_KEY,
    zone.width * RESOLUTION,
    zone.height * RESOLUTION,
  );
  if (!texture) throw new Error('Could not create the tablet label canvas');
  const font = `${FONT_SIZE_PX}px ${FONT_FAMILY}`;
  const draw = (): void => drawSlantedWord(texture, font);
  draw();
  // The pixel font may still be loading the first time: draw again once it is ready.
  if (!document.fonts.check(font)) void document.fonts.load(font).then(draw);
  return scene.add
    .image(zone.x, zone.y, TEXTURE_KEY)
    .setOrigin(0)
    .setScale(1 / RESOLUTION);
}

function drawSlantedWord(texture: Phaser.Textures.CanvasTexture, font: string): void {
  const context = texture.getContext();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, texture.width, texture.height);
  const { along, across, origin } = screenAxes();
  const scaled = (value: number): number => value * RESOLUTION;
  context.setTransform(
    scaled(along.x),
    scaled(along.y),
    scaled(across.x),
    scaled(across.y),
    scaled(origin.x),
    scaled(origin.y),
  );
  context.font = font;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = cssColor(TECH_GLOW);
  context.shadowColor = cssColor(TECH_GLOW);
  context.shadowBlur = GLOW_BLUR_PX * RESOLUTION;
  context.fillText(t('cabin.tablet'), 0, 0);
  texture.refresh();
}

/** The directions of the word (along the long side, and leaning a bit like the screen) and its center. */
function screenAxes(): { along: Point; across: Point; origin: Point } {
  const { left, top, right, bottom } = CABIN_TABLET_QUAD;
  const along = unit(average(minus(top, left), minus(right, bottom)));
  const screenAcross = unit(average(minus(bottom, left), minus(right, top)));
  const across = unit(mix({ x: -along.y, y: along.x }, screenAcross, LEAN));
  const center = average(average(left, right), average(top, bottom));
  return { along, across, origin: minus(center, CABIN_TABLET_ZONE) };
}

function minus(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y };
}

function average(a: Point, b: Point): Point {
  return mix(a, b, 0.5);
}

function mix(a: Point, b: Point, amount: number): Point {
  return { x: a.x + (b.x - a.x) * amount, y: a.y + (b.y - a.y) * amount };
}

function unit(vector: Point): Point {
  const length = Math.hypot(vector.x, vector.y);
  return { x: vector.x / length, y: vector.y / length };
}
