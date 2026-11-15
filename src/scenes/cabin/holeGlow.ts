import type Phaser from 'phaser';
import { INTRO_BALANCE } from '../../config/balance';
import type { Rect } from '../../ui/layout';
import { cssColor, PALETTE } from '../../ui/palette';
import { SPRITE_SCALE } from '../../ui/sprites';

/**
 * Spec 19 — A golden glow that follows the exact edge of the glass in the cabin art (the window,
 * the dashboard screen), like the cyan glow around the tablet. The glass is a transparent hole in
 * the background, so the outline is read from the art itself: no shape is drawn by hand.
 */
const ART_PER_GAME_PX = 1 / SPRITE_SCALE;
/** Room around the area for the glow to spread, in game pixels. */
const MARGIN = 8;
/** How far the glow spreads, and the gold rim kept just inside the glass (art pixels). */
const BLUR = 10;
const RIM = 3;
const GLOW_PASSES = 3;
const DEPTH = 30;
const DIM_ALPHA = 0.3;

export function addHoleGlow(
  scene: Phaser.Scene,
  backgroundKey: string,
  area: Rect,
): Phaser.GameObjects.Image {
  const key = `hole-glow-${area.x}-${area.y}-${area.width}-${area.height}`;
  if (!scene.textures.exists(key)) createGlowTexture(scene, backgroundKey, area, key);
  const glow = scene.add
    .image(area.x - MARGIN, area.y - MARGIN, key)
    .setOrigin(0)
    .setScale(SPRITE_SCALE)
    .setDepth(DEPTH);
  scene.tweens.add({
    targets: glow,
    alpha: DIM_ALPHA,
    yoyo: true,
    repeat: -1,
    duration: INTRO_BALANCE.highlightPulseMs,
  });
  return glow;
}

function createGlowTexture(scene: Phaser.Scene, backgroundKey: string, area: Rect, key: string) {
  const width = (area.width + MARGIN * 2) * ART_PER_GAME_PX;
  const height = (area.height + MARGIN * 2) * ART_PER_GAME_PX;
  const art = scene.textures.get(backgroundKey).getSourceImage() as CanvasImageSource;
  const left = (area.x - MARGIN) * ART_PER_GAME_PX;
  const top = (area.y - MARGIN) * ART_PER_GAME_PX;
  const glass = holeMasks(art, left, top, width, height);
  const texture = scene.textures.createCanvas(key, width, height);
  if (!texture) throw new Error('Could not create the glow canvas');
  const context = texture.getContext();
  context.shadowColor = cssColor(PALETTE.sun);
  context.shadowBlur = BLUR;
  for (let pass = 0; pass < GLOW_PASSES; pass += 1) context.drawImage(glass.whole, 0, 0);
  // Keep the glass clear (the photo stays visible): only the glow and a thin gold rim remain.
  context.shadowBlur = 0;
  context.globalCompositeOperation = 'destination-out';
  context.drawImage(glass.inner, 0, 0);
  texture.refresh();
}

/** The glass as gold shapes: all of it, and all but a thin band along its edge. */
function holeMasks(art: CanvasImageSource, left: number, top: number, w: number, h: number) {
  const source = canvasOf(w, h);
  source.getContext('2d')?.drawImage(art, -left, -top);
  const pixels = source.getContext('2d')?.getImageData(0, 0, w, h);
  if (!pixels) throw new Error('Could not read the cabin art');
  const isGlass = (x: number, y: number): boolean =>
    x >= 0 && y >= 0 && x < w && y < h && (pixels.data[(y * w + x) * 4 + 3] ?? 255) < 128;
  const offsets = [-RIM, 0, RIM];
  const isInner = (x: number, y: number): boolean =>
    offsets.every((dx) => offsets.every((dy) => isGlass(x + dx, y + dy)));
  return { whole: paintMask(w, h, isGlass), inner: paintMask(w, h, isInner) };
}

function paintMask(w: number, h: number, inside: (x: number, y: number) => boolean) {
  const canvas = canvasOf(w, h);
  const context = canvas.getContext('2d');
  const image = context?.createImageData(w, h);
  if (!context || !image) throw new Error('Could not paint the glass mask');
  const sun = PALETTE.sun;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (!inside(x, y)) continue;
      const index = (y * w + x) * 4;
      image.data.set([(sun >> 16) & 255, (sun >> 8) & 255, sun & 255, 255], index);
    }
  }
  context.putImageData(image, 0, 0);
  return canvas;
}

function canvasOf(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
