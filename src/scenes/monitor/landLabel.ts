import type Phaser from 'phaser';
import { t } from '../../i18n';
import { FONT_FAMILY } from '../../ui/layout';
import { cssColor, PALETTE } from '../../ui/palette';

/**
 * Spec 19 — "ATERRIZAR ▼" engraved on the face of the LAND button. The face is seen at an
 * angle (a slanted, flattened shape), so the word is drawn on a canvas with that same slant
 * and squash, centered on the face. Engraved = a dark mark with a thin light edge under it.
 */
const TEXTURE_KEY = 'land-button-label';
/** Drawn 4 times bigger and shown at 1/4, so the slanted letters stay sharp. */
const RESOLUTION = 4;
const SIZE = { width: 100, height: 34 } as const;
const FONT_SIZE_PX = 8;
/** A little air between the letters: packed together they blur into one block on the button. */
const LETTER_SPACING_PX = 1;
/** How the button face is seen: its sides lean right going down, and it looks flattened. */
const FACE_SLANT = 0.38;
const FACE_SQUASH = 0.8;
const WORD_Y = -3;
const ARROW = { top: 6, halfWidth: 8, height: 7 } as const;
const ENGRAVE = { dark: 0.8, light: 0.5 } as const;

export function addLandLabel(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Image {
  if (scene.textures.exists(TEXTURE_KEY)) scene.textures.remove(TEXTURE_KEY);
  const texture = scene.textures.createCanvas(
    TEXTURE_KEY,
    SIZE.width * RESOLUTION,
    SIZE.height * RESOLUTION,
  );
  if (!texture) throw new Error('Could not create the LAND button label canvas');
  const font = `${FONT_SIZE_PX}px ${FONT_FAMILY}`;
  const draw = (): void => drawEngraved(texture, font);
  draw();
  // The pixel font may still be loading the first time: draw again once it is ready.
  if (!document.fonts.check(font)) void document.fonts.load(font).then(draw);
  return scene.add.image(x, y, TEXTURE_KEY).setScale(1 / RESOLUTION);
}

function drawEngraved(texture: Phaser.Textures.CanvasTexture, font: string): void {
  const context = texture.getContext();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, texture.width, texture.height);
  const scale = RESOLUTION;
  context.setTransform(
    scale,
    0,
    FACE_SLANT * scale,
    FACE_SQUASH * scale,
    (SIZE.width / 2) * scale,
    (SIZE.height / 2) * scale,
  );
  context.font = font;
  context.letterSpacing = `${LETTER_SPACING_PX}px`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  // The light edge first, one pixel lower: the dark mark on top looks carved into the face.
  drawMark(context, 1, cssColor(PALETTE.white), ENGRAVE.light);
  drawMark(context, 0, cssColor(PALETTE.night), ENGRAVE.dark);
  texture.refresh();
}

function drawMark(
  context: CanvasRenderingContext2D,
  offsetY: number,
  color: string,
  alpha: number,
): void {
  context.globalAlpha = alpha;
  context.fillStyle = color;
  context.fillText(t('monitor.landButton'), 0, WORD_Y + offsetY);
  context.beginPath();
  context.moveTo(-ARROW.halfWidth, ARROW.top + offsetY);
  context.lineTo(ARROW.halfWidth, ARROW.top + offsetY);
  context.lineTo(0, ARROW.top + ARROW.height + offsetY);
  context.closePath();
  context.fill();
  context.globalAlpha = 1;
}
