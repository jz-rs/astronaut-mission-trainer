import type Phaser from 'phaser';
import { INTRO_BALANCE } from '../config/balance';
import { FONT_SIZE, MIN_TOUCH_SIZE, type Rect } from './layout';
import { cssColor, PALETTE, TECH_GLOW } from './palette';
import { addText, type TextOptions } from './text';

/**
 * Spec 18 — "Screen look" for everything digital in the ship (tablet, guide's radio, monitors):
 * thin glowing cyan lines, visor corners, segmented bars and scanlines. It is deliberately
 * different from the chunky physical buttons, so a kid can tell a screen from a real button.
 * Screen buttons light up and act a moment later, like a touch screen.
 */
const GLOW_WIDTH = 4;
const GLOW_ALPHA = 0.25;
const TEXT_GLOW_BLUR = 6;
const CORNER_LENGTH = 8;
const FLASH_ALPHA = 0.45;
const SCANLINE_ALPHA = 0.18;

export function glowStroke(graphics: Phaser.GameObjects.Graphics, color: number = TECH_GLOW) {
  return {
    rect(rect: Rect, radius = 0) {
      graphics.lineStyle(GLOW_WIDTH, color, GLOW_ALPHA);
      graphics.strokeRoundedRect(rect.x, rect.y, rect.width, rect.height, radius);
      graphics.lineStyle(1.5, color, 1);
      graphics.strokeRoundedRect(rect.x, rect.y, rect.width, rect.height, radius);
    },
    line(fromX: number, fromY: number, toX: number, toY: number) {
      graphics.lineStyle(GLOW_WIDTH, color, GLOW_ALPHA).lineBetween(fromX, fromY, toX, toY);
      graphics.lineStyle(1.5, color, 1).lineBetween(fromX, fromY, toX, toY);
    },
  };
}

/** Dark glass with a glowing edge, as drawn by every screen of the ship. */
export function drawScreenPanel(graphics: Phaser.GameObjects.Graphics, rect: Rect): void {
  graphics.fillStyle(PALETTE.night, 0.94).fillRect(rect.x, rect.y, rect.width, rect.height);
  glowStroke(graphics).rect(rect);
}

/** Visor brackets on the four corners of a picture or an area. */
export function drawVisorCorners(
  graphics: Phaser.GameObjects.Graphics,
  rect: Rect,
  color: number = TECH_GLOW,
): void {
  const { x, y, width, height } = rect;
  const glow = glowStroke(graphics, color);
  for (const [cornerX, cornerY, dirX, dirY] of [
    [x, y, 1, 1],
    [x + width, y, -1, 1],
    [x, y + height, 1, -1],
    [x + width, y + height, -1, -1],
  ]) {
    glow.line(cornerX, cornerY, cornerX + dirX * CORNER_LENGTH, cornerY);
    glow.line(cornerX, cornerY, cornerX, cornerY + dirY * CORNER_LENGTH);
  }
}

export function drawScreenScanlines(graphics: Phaser.GameObjects.Graphics, rect: Rect): void {
  graphics.fillStyle(PALETTE.night, SCANLINE_ALPHA);
  for (let y = rect.y; y < rect.y + rect.height; y += 2)
    graphics.fillRect(rect.x, y, rect.width, 1);
}

/** Text that shines like it is lit on a screen. */
export function addGlowText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  content: string,
  options: TextOptions = {},
): Phaser.GameObjects.Text {
  const text = addText(scene, x, y, content, { size: FONT_SIZE.small, ...options });
  return text.setShadow(
    0,
    0,
    cssColor(options.color ?? PALETTE.white),
    TEXT_GLOW_BLUR,
    false,
    true,
  );
}

/** Segmented progress: one dash per step, the current one brighter. */
export function drawSegments(
  graphics: Phaser.GameObjects.Graphics,
  centerX: number,
  y: number,
  current: number,
  total: number,
): void {
  const width = 12;
  const gap = 4;
  const left = centerX - (total * (width + gap) - gap) / 2;
  for (let index = 0; index < total; index += 1) {
    const x = left + index * (width + gap);
    if (index > current) graphics.fillStyle(PALETTE.metal, 0.6).fillRect(x, y + 1, width, 1);
    else
      graphics.fillStyle(index === current ? PALETTE.white : TECH_GLOW, 1).fillRect(x, y, width, 3);
  }
}

export interface ScreenButtonOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Draws the icon or label, centered on (0, 0). */
  drawFace: (graphics: Phaser.GameObjects.Graphics) => void;
  label?: string;
  color?: number;
  /** Only when a neighbour is too close for the usual 48 px touch area. */
  touchHeight?: number;
  onPress: () => void;
}

/** An outlined touch-screen button: it flashes on touch, then acts after a short delay. */
export function createScreenButton(
  scene: Phaser.Scene,
  options: ScreenButtonOptions,
): Phaser.GameObjects.Container {
  const { x, y, width, height, drawFace, label, color = TECH_GLOW, onPress } = options;
  const touchHeight = options.touchHeight ?? Math.max(height, MIN_TOUCH_SIZE);
  const flash = scene.add.graphics().setAlpha(0);
  flash.fillStyle(color, 1).fillRoundedRect(-width / 2, -height / 2, width, height, 6);
  const face = scene.add.graphics();
  drawFace(face);
  const parts: Phaser.GameObjects.GameObject[] = [flash, face];
  if (label) parts.push(addGlowText(scene, 0, 0, label, { size: FONT_SIZE.small, color }));
  const button = scene.add.container(x, y, parts);
  button.setSize(Math.max(width, MIN_TOUCH_SIZE), touchHeight);
  button.setInteractive({ useHandCursor: true });
  bindFlashPress(scene, button, flash, onPress);
  return button;
}

function bindFlashPress(
  scene: Phaser.Scene,
  button: Phaser.GameObjects.Container,
  flash: Phaser.GameObjects.Graphics,
  onPress: () => void,
): void {
  let isPressed = false;
  button.on('pointerdown', () => {
    isPressed = true;
    flash.setAlpha(FLASH_ALPHA);
  });
  button.on('pointerout', () => {
    isPressed = false;
    flash.setAlpha(0);
  });
  button.on('pointerup', () => {
    if (!isPressed) return;
    isPressed = false;
    flash.setAlpha(1);
    scene.tweens.add({ targets: flash, alpha: 0, duration: INTRO_BALANCE.screenFlashMs });
    scene.time.delayedCall(INTRO_BALANCE.screenFlashMs, onPress);
  });
}

/** Outlined circle with an arrow inside, pointing left (-1) or right (1). */
export function drawArrowFace(direction: -1 | 1, radius: number, color: number = TECH_GLOW) {
  return (graphics: Phaser.GameObjects.Graphics) => {
    graphics.lineStyle(GLOW_WIDTH, color, GLOW_ALPHA).strokeCircle(0, 0, radius);
    graphics.lineStyle(1.5, color, 1).strokeCircle(0, 0, radius);
    const tip = (radius / 3) * direction;
    glowStroke(graphics, color).line(-tip, -radius / 3, tip, 0);
    glowStroke(graphics, color).line(tip, 0, -tip, radius / 3);
  };
}

/** Outlined square with an X: closes a screen. */
export function drawCloseFace(size: number, color: number = TECH_GLOW) {
  return (graphics: Phaser.GameObjects.Graphics) => {
    const half = size / 2;
    glowStroke(graphics, color).rect({ x: -half, y: -half, width: size, height: size }, 3);
    const arm = half / 2;
    glowStroke(graphics, color).line(-arm, -arm, arm, arm);
    glowStroke(graphics, color).line(-arm, arm, arm, -arm);
  };
}

/** Outlined rounded rectangle, for buttons with a word inside. */
export function drawOutlineFace(width: number, height: number, color: number = TECH_GLOW) {
  return (graphics: Phaser.GameObjects.Graphics) => {
    glowStroke(graphics, color).rect({ x: -width / 2, y: -height / 2, width, height }, 6);
  };
}
