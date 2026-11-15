import type Phaser from 'phaser';
import { INTRO_BALANCE } from '../../config/balance';
import type { Rect } from '../../ui/layout';
import { cssColor, PALETTE, TECH_GLOW } from '../../ui/palette';
import { SPRITE_SCALE } from '../../ui/sprites';

/**
 * Spec 19 — Glows that follow shapes already in the cabin art, and slowly light up and fade:
 * - gold along the glass of the window and the dashboard screen (the glass is a transparent hole
 *   in the background), to show what to tap;
 * - cyan over the halo painted around the tablet, so it breathes instead of staying still.
 * The shapes are read from the art pixels: nothing is drawn by hand.
 */
type PixelTest = (red: number, green: number, blue: number, alpha: number) => boolean;

interface GlowStyle {
  color: number;
  /** Which art pixels the glow comes from. */
  isShape: PixelTest;
  /** True for glass: its middle is cut out again so the photo behind stays clear. */
  clearInside: boolean;
  /** Lowest alpha of the pulse. */
  dimAlpha: number;
  /** Glass lights go over everything; the tablet halo stays under the guide and floating things. */
  depth: number;
}

const ART_PER_GAME_PX = 1 / SPRITE_SCALE;
/** Room around the area for the glow to spread, in game pixels. */
const MARGIN = 8;
/** How far the glow spreads, and the rim kept just inside the glass (art pixels). */
const BLUR = 10;
const RIM = 3;
const GLOW_PASSES = 3;

const GLASS: GlowStyle = {
  color: PALETTE.sun,
  isShape: (_red, _green, _blue, alpha) => alpha < 128,
  clearInside: true,
  dimAlpha: 0.3,
  depth: 30,
};
/** The painted halo is light cyan: clearly bluer than red, and bright. */
const TABLET_HALO: GlowStyle = {
  color: TECH_GLOW,
  isShape: (red, green, blue, alpha) => alpha > 200 && blue > 170 && green > 150 && blue - red > 50,
  clearInside: false,
  dimAlpha: 0,
  depth: 1,
};

export function addGlassGlow(scene: Phaser.Scene, backgroundKey: string, area: Rect) {
  return addArtGlow(scene, backgroundKey, area, GLASS, 'glass');
}

export function addTabletHaloPulse(scene: Phaser.Scene, backgroundKey: string, area: Rect) {
  return addArtGlow(scene, backgroundKey, area, TABLET_HALO, 'halo');
}

function addArtGlow(
  scene: Phaser.Scene,
  backgroundKey: string,
  area: Rect,
  style: GlowStyle,
  name: string,
): Phaser.GameObjects.Image {
  const key = `art-glow-${name}-${area.x}-${area.y}-${area.width}-${area.height}`;
  if (!scene.textures.exists(key)) createGlowTexture(scene, backgroundKey, area, key, style);
  const glow = scene.add
    .image(area.x - MARGIN, area.y - MARGIN, key)
    .setOrigin(0)
    .setScale(SPRITE_SCALE)
    .setDepth(style.depth);
  scene.tweens.add({
    targets: glow,
    alpha: style.dimAlpha,
    yoyo: true,
    repeat: -1,
    duration: INTRO_BALANCE.highlightPulseMs,
  });
  return glow;
}

function createGlowTexture(
  scene: Phaser.Scene,
  backgroundKey: string,
  area: Rect,
  key: string,
  style: GlowStyle,
): void {
  const box = {
    left: (area.x - MARGIN) * ART_PER_GAME_PX,
    top: (area.y - MARGIN) * ART_PER_GAME_PX,
    width: (area.width + MARGIN * 2) * ART_PER_GAME_PX,
    height: (area.height + MARGIN * 2) * ART_PER_GAME_PX,
  };
  const art = scene.textures.get(backgroundKey).getSourceImage() as CanvasImageSource;
  const shape = shapeMasks(art, box, style);
  const texture = scene.textures.createCanvas(key, box.width, box.height);
  if (!texture) throw new Error('Could not create the glow canvas');
  const context = texture.getContext();
  context.shadowColor = cssColor(style.color);
  context.shadowBlur = BLUR;
  for (let pass = 0; pass < GLOW_PASSES; pass += 1) context.drawImage(shape.whole, 0, 0);
  if (shape.inner) {
    context.shadowBlur = 0;
    context.globalCompositeOperation = 'destination-out';
    context.drawImage(shape.inner, 0, 0);
  }
  texture.refresh();
}

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** The shape painted in the glow color, and (for glass) the shape minus a band along its edge. */
function shapeMasks(art: CanvasImageSource, box: Box, style: GlowStyle) {
  const { width: w, height: h } = box;
  const source = canvasOf(w, h);
  source.getContext('2d')?.drawImage(art, -box.left, -box.top);
  const data = source.getContext('2d')?.getImageData(0, 0, w, h).data;
  if (!data) throw new Error('Could not read the cabin art');
  const at = (x: number, y: number, channel: number): number =>
    data[(y * w + x) * 4 + channel] ?? 0;
  const inShape = (x: number, y: number): boolean =>
    x >= 0 &&
    y >= 0 &&
    x < w &&
    y < h &&
    style.isShape(at(x, y, 0), at(x, y, 1), at(x, y, 2), at(x, y, 3));
  const offsets = [-RIM, 0, RIM];
  const inInner = (x: number, y: number): boolean =>
    offsets.every((dx) => offsets.every((dy) => inShape(x + dx, y + dy)));
  return {
    whole: paintMask(w, h, inShape, style.color),
    inner: style.clearInside ? paintMask(w, h, inInner, style.color) : null,
  };
}

function paintMask(w: number, h: number, inside: (x: number, y: number) => boolean, color: number) {
  const canvas = canvasOf(w, h);
  const context = canvas.getContext('2d');
  const image = context?.createImageData(w, h);
  if (!context || !image) throw new Error('Could not paint the glow mask');
  const rgba = [(color >> 16) & 255, (color >> 8) & 255, color & 255, 255];
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (inside(x, y)) image.data.set(rgba, (y * w + x) * 4);
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
