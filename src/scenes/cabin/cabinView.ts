import type Phaser from 'phaser';
import { INTRO_BALANCE } from '../../config/balance';
import { addCoverPhoto } from '../../ui/coverPhoto';
import { CABIN_MONITOR_SCREENS, CABIN_TABLET_SCREEN, FONT_SIZE, type Rect } from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';
import { drawVisorCorners } from '../../ui/screenUi';
import { SPRITE_SCALE } from '../../ui/sprites';
import { addText } from '../../ui/text';
import type { CabinArtKey } from './cabinArt';

/**
 * Spec 18 — Pieces shared by the cabin and the landing: the ship background with its glass holes,
 * the real photo in the window (always covering it, with its credit) and the yellow brackets that
 * point at the next thing to tap.
 */
const CREDIT_BAND_HEIGHT = 11;
const HIGHLIGHT_MARGIN = 4;

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

/** Real photos always say where they come from (AGENTS.md §5): a thin band at the bottom. */
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
  const text = addText(scene, area.x + 3, bottom - CREDIT_BAND_HEIGHT / 2, credit, {
    size: FONT_SIZE.small,
    color: PALETTE.metalLight,
  });
  return [band, text.setOrigin(0, 0.5)];
}

/** Dark glass behind the monitor holes, and a soft cyan glow on the tablet. */
export function drawCabinScreens(scene: Phaser.Scene): void {
  const graphics = scene.add.graphics();
  graphics.fillStyle(PALETTE.night, 1);
  for (const screen of CABIN_MONITOR_SCREENS) {
    graphics.fillRect(screen.x - 2, screen.y - 2, screen.width + 4, screen.height + 4);
  }
  const { x, y, width, height } = CABIN_TABLET_SCREEN;
  graphics.fillStyle(PALETTE.space, 1).fillRect(x - 2, y - 2, width + 4, height + 4);
  const glow = scene.add.rectangle(x, y, width, height, TECH_GLOW, 0.25).setOrigin(0);
  scene.tweens.add({
    targets: glow,
    alpha: 0.6,
    yoyo: true,
    repeat: -1,
    duration: INTRO_BALANCE.guideFloatMs,
  });
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
