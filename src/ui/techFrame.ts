import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, type Rect } from './layout';
import { PALETTE, TECH_GLOW } from './palette';

/**
 * The visual signature of the game: retro pixel art showing current-day technology.
 * Dark glass panels with a glowing edge and corner brackets, plus a light scanline filter.
 */
const BRACKET_LENGTH = 10;
const BRACKET_THICKNESS = 3;
const SCANLINES_TEXTURE = 'scanlines';
const SCANLINES_ALPHA = 0.1;
const SCANLINES_DEPTH = 1000;

export function drawTechPanel(
  graphics: Phaser.GameObjects.Graphics,
  rect: Rect,
  accent: number = TECH_GLOW,
  fill: number = PALETTE.night,
): void {
  const { x, y, width, height } = rect;
  graphics.fillStyle(fill, 0.96).fillRect(x, y, width, height);
  graphics.lineStyle(1, accent, 0.35).strokeRect(x + 3, y + 3, width - 6, height - 6);
  graphics.lineStyle(2, accent, 1).strokeRect(x, y, width, height);
  drawCornerBrackets(graphics, rect, accent);
}

function drawCornerBrackets(graphics: Phaser.GameObjects.Graphics, rect: Rect, accent: number) {
  const { x, y, width, height } = rect;
  const right = x + width;
  const bottom = y + height;
  const offset = BRACKET_THICKNESS - 1;
  graphics.fillStyle(accent, 1);
  for (const [cornerX, cornerY, dirX, dirY] of [
    [x - offset, y - offset, 1, 1],
    [right + offset, y - offset, -1, 1],
    [x - offset, bottom + offset, 1, -1],
    [right + offset, bottom + offset, -1, -1],
  ]) {
    const horizontalX = dirX > 0 ? cornerX : cornerX - BRACKET_LENGTH;
    const verticalY = dirY > 0 ? cornerY : cornerY - BRACKET_LENGTH;
    const horizontalY = dirY > 0 ? cornerY : cornerY - BRACKET_THICKNESS;
    const verticalX = dirX > 0 ? cornerX : cornerX - BRACKET_THICKNESS;
    graphics.fillRect(horizontalX, horizontalY, BRACKET_LENGTH, BRACKET_THICKNESS);
    graphics.fillRect(verticalX, verticalY, BRACKET_THICKNESS, BRACKET_LENGTH);
  }
}

/** A faint CRT filter over the whole scene. It never blocks touches. */
export function addScanlines(scene: Phaser.Scene): void {
  if (!scene.textures.exists(SCANLINES_TEXTURE)) {
    const graphics = scene.make.graphics({}, false);
    graphics.fillStyle(PALETTE.night, 1).fillRect(0, 0, 2, 1);
    graphics.generateTexture(SCANLINES_TEXTURE, 2, 2);
    graphics.destroy();
  }
  scene.add
    .tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, SCANLINES_TEXTURE)
    .setOrigin(0)
    .setAlpha(SCANLINES_ALPHA)
    .setDepth(SCANLINES_DEPTH);
}

/** Starry night sky used behind menus. */
export function drawStarfield(scene: Phaser.Scene, starCount: number): void {
  const graphics = scene.add.graphics();
  graphics.fillStyle(PALETTE.night, 1).fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  for (let index = 0; index < starCount; index += 1) {
    const color = index % 5 === 0 ? PALETTE.cyan : PALETTE.metalLight;
    const size = index % 7 === 0 ? 2 : 1;
    graphics.fillStyle(color, 1);
    graphics.fillRect(
      Phaser.Math.Between(0, GAME_WIDTH),
      Phaser.Math.Between(0, GAME_HEIGHT),
      size,
      size,
    );
  }
}
