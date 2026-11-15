import Phaser from 'phaser';
import { INTRO_BALANCE } from '../../config/balance';
import { addCoverPhoto } from '../../ui/coverPhoto';
import {
  CABIN_MONITOR_OUTLINE,
  CABIN_MONITOR_SCREENS,
  CABIN_TABLET_SCREEN,
  FONT_SIZE,
  type Rect,
} from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';
import { drawVisorCorners } from '../../ui/screenUi';
import { SPRITE_SCALE } from '../../ui/sprites';
import { addText } from '../../ui/text';
import type { CabinArtKey } from './cabinArt';
import { addTabletLabel } from './tabletLabel';

/**
 * Spec 19 — Pieces shared by the cabin and the landing: the ship background with its glass holes,
 * the real photo in the window (always covering it, with its credit) and the yellow brackets that
 * point at the next thing to tap.
 */
const CREDIT_BAND_HEIGHT = 8;
const CREDIT_TEXT_SCALE = 0.6;
const CREDIT_TEXT_RESOLUTION = 4;
const HIGHLIGHT_MARGIN = 4;
const SCREEN_GLOW = { dim: 0.2, bright: 0.45 } as const;
const MONITOR_GLOW = { wide: 6, wideAlpha: 0.3, thin: 2, dimAlpha: 0.35 } as const;
const MONITOR_GLOW_DEPTH = 15;

/** The background goes on top of what is drawn behind its transparent screens. */
export function addCabinBackground(
  scene: Phaser.Scene,
  key: CabinArtKey,
): Phaser.GameObjects.Image {
  return scene.add.image(0, 0, key).setOrigin(0).setScale(SPRITE_SCALE);
}

export function addWindowPhoto(
  scene: Phaser.Scene,
  textureKey: string,
  window: Rect,
): Phaser.GameObjects.Image {
  return addCoverPhoto(scene, textureKey, window);
}

/**
 * Real photos always say where they come from (AGENTS.md §5): a thin band at the bottom with
 * small text. It is drawn sharper than usual so the small size still reads well.
 */
export function addPhotoCredit(
  scene: Phaser.Scene,
  area: Rect,
  credit: string,
): Phaser.GameObjects.GameObject[] {
  const bottom = area.y + area.height;
  const band = scene.add
    .rectangle(
      area.x,
      bottom - CREDIT_BAND_HEIGHT,
      area.width,
      CREDIT_BAND_HEIGHT,
      PALETTE.night,
      0.6,
    )
    .setOrigin(0);
  const text = addText(scene, area.x + 2, bottom - CREDIT_BAND_HEIGHT / 2, credit, {
    size: FONT_SIZE.small,
    color: PALETTE.metalLight,
  });
  text.setResolution(CREDIT_TEXT_RESOLUTION).setScale(CREDIT_TEXT_SCALE).setOrigin(0, 0.5);
  return [band, text];
}

/**
 * Every small screen of the cabin (monitor and tablet) looks switched on: dark glass with a soft
 * cyan glow that breathes. Returned so the landing can put them inside its zooming layer.
 */
export function drawCabinScreens(scene: Phaser.Scene): Phaser.GameObjects.GameObject[] {
  const graphics = scene.add.graphics();
  const parts: Phaser.GameObjects.GameObject[] = [graphics];
  for (const { x, y, width, height } of [...CABIN_MONITOR_SCREENS, CABIN_TABLET_SCREEN]) {
    graphics.fillStyle(PALETTE.space, 1).fillRect(x - 2, y - 2, width + 4, height + 4);
    const glow = scene.add.rectangle(x, y, width, height, TECH_GLOW, SCREEN_GLOW.dim).setOrigin(0);
    scene.tweens.add({
      targets: glow,
      alpha: SCREEN_GLOW.bright,
      yoyo: true,
      repeat: -1,
      duration: INTRO_BALANCE.guideFloatMs,
    });
    parts.push(glow);
  }
  parts.push(addTabletLabel(scene));
  return parts;
}

/** A breathing cyan edge around the monitor console, like the tablet's: "tap me". */
export function addMonitorGlow(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
  const graphics = scene.add.graphics().setDepth(MONITOR_GLOW_DEPTH);
  const outline = CABIN_MONITOR_OUTLINE.map(({ x, y }) => new Phaser.Math.Vector2(x, y));
  graphics
    .lineStyle(MONITOR_GLOW.wide, TECH_GLOW, MONITOR_GLOW.wideAlpha)
    .strokePoints(outline, true);
  graphics.lineStyle(MONITOR_GLOW.thin, TECH_GLOW, 1).strokePoints(outline, true);
  scene.tweens.add({
    targets: graphics,
    alpha: MONITOR_GLOW.dimAlpha,
    yoyo: true,
    repeat: -1,
    duration: INTRO_BALANCE.highlightPulseMs,
  });
  return graphics;
}

/** Pulsing yellow visor corners around what the kid should look at or tap. */
export function addHighlight(scene: Phaser.Scene, area: Rect): Phaser.GameObjects.Graphics {
  const graphics = scene.add.graphics().setDepth(30);
  drawVisorCorners(
    graphics,
    {
      x: area.x - HIGHLIGHT_MARGIN,
      y: area.y - HIGHLIGHT_MARGIN,
      width: area.width + HIGHLIGHT_MARGIN * 2,
      height: area.height + HIGHLIGHT_MARGIN * 2,
    },
    PALETTE.sun,
  );
  scene.tweens.add({
    targets: graphics,
    alpha: 0.3,
    yoyo: true,
    repeat: -1,
    duration: INTRO_BALANCE.highlightPulseMs,
  });
  return graphics;
}
