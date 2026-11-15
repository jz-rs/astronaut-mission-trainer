import type Phaser from 'phaser';
import { RUN_BALANCE } from '../../config/balance';
import { t } from '../../i18n';
import { FONT_SIZE, TABLET_SCREEN, type Rect } from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';
import { addCoverPhoto } from '../../ui/coverPhoto';
import { addGlowText, drawVisorCorners, glowStroke } from '../../ui/screenUi';
import { STAT_ICON_SPRITES } from '../../ui/sprites';
import { addPhotoCredit } from '../cabin/cabinView';
import { INTRO_PHOTOS } from '../cabin/cabinArt';
import { drawPageArt } from './manualArt';
import type { ManualPage, PageEffect } from './manualPages';

/**
 * Spec 18 — Draws one page of the manual on the tablet glass: title, the bars this action changes
 * and the counter on top; then the picture (or the real photo next to the simulation's version)
 * and a short explanation, a bit longer than a tutorial line so kids learn the science behind it.
 * The tablet scene adds the arrows, the X and the progress dashes around it.
 */
type Parts = Phaser.GameObjects.GameObject[];

const SCREEN = TABLET_SCREEN;
const LEFT = SCREEN.x + 14;
const RIGHT = SCREEN.x + SCREEN.width - 14;
const HEADER_LINE_Y = SCREEN.y + 32;
/** Lowest point the text may reach: the arrows and dashes live below it. */
const TEXT_BOTTOM = SCREEN.y + SCREEN.height - 36;
const SINGLE_ART: Rect = {
  x: LEFT,
  y: SCREEN.y + 42,
  width: 160,
  height: TEXT_BOTTOM - SCREEN.y - 42,
};
const COMPARE_TOP = SCREEN.y + 52;
const COMPARE_WIDTH = 208;
const COMPARE_HEIGHT = 72;
const EFFECT_SPACING = 34;
/** The bar effects sit in the header, just left of the page counter. */
const EFFECTS_RIGHT = RIGHT - 140;

export function drawManualPage(
  scene: Phaser.Scene,
  page: ManualPage,
  index: number,
  total: number,
): Parts {
  const parts: Parts = [...drawHeader(scene, page, index, total)];
  if (page.compare) parts.push(...drawCompare(scene, page));
  else parts.push(...drawSingle(scene, page));
  return parts;
}

function drawHeader(scene: Phaser.Scene, page: ManualPage, index: number, total: number): Parts {
  const parts: Parts = [];
  let titleX = LEFT;
  if (page.icon) {
    const icon = scene.add.image(LEFT + 8, SCREEN.y + 17, page.icon);
    parts.push(icon.setScale(16 / Math.max(icon.width, icon.height)));
    titleX += 22;
  }
  const title = addGlowText(scene, titleX, SCREEN.y + 17, t(page.title), {
    size: FONT_SIZE.medium,
    color: page.color,
  });
  const counter = addGlowText(
    scene,
    RIGHT - 36,
    SCREEN.y + 17,
    t('manual.counter', { current: pad(index + 1), total: pad(total) }),
    { color: PALETTE.metal },
  );
  const line = scene.add.graphics();
  glowStroke(line).line(LEFT, HEADER_LINE_Y, RIGHT, HEADER_LINE_Y);
  parts.push(title.setOrigin(0, 0.5), counter.setOrigin(1, 0.5), line);
  const effects = page.effects ?? [];
  parts.push(
    ...drawEffects(scene, effects, EFFECTS_RIGHT - effects.length * EFFECT_SPACING, SCREEN.y + 17),
  );
  return parts;
}

function drawSingle(scene: Phaser.Scene, page: ManualPage): Parts {
  const corners = scene.add.graphics();
  drawVisorCorners(corners, SINGLE_ART);
  const textX = SINGLE_ART.x + SINGLE_ART.width + 16;
  const text = bodyText(scene, page, textX, SINGLE_ART.y + 4, RIGHT - textX);
  return [corners, ...drawPageArt(scene, page.art, SINGLE_ART), text];
}

/** Real photo on the left, the game's version on the right, one label above each. */
function drawCompare(scene: Phaser.Scene, page: ManualPage): Parts {
  if (!page.compare) return [];
  const { photo, labels } = page.compare;
  const real: Rect = { x: LEFT, y: COMPARE_TOP, width: COMPARE_WIDTH, height: COMPARE_HEIGHT };
  const game: Rect = { ...real, x: RIGHT - COMPARE_WIDTH };
  const realLabel = labels === 'real' ? 'manual.real' : 'manual.inspiration';
  const gameLabel = labels === 'real' ? 'manual.game' : 'manual.ourVersion';
  const frames = scene.add.graphics();
  drawVisorCorners(frames, real);
  drawVisorCorners(frames, game);
  const textTop = COMPARE_TOP + COMPARE_HEIGHT + 8;
  const text = bodyText(scene, page, LEFT, textTop, RIGHT - LEFT);
  return [
    addCoverPhoto(scene, photo, real),
    ...addPhotoCredit(scene, real, INTRO_PHOTOS[photo].credit),
    frames,
    addGlowText(scene, real.x, COMPARE_TOP - 8, t(realLabel), { color: TECH_GLOW }).setOrigin(
      0,
      0.5,
    ),
    addGlowText(scene, game.x, COMPARE_TOP - 8, t(gameLabel), { color: PALETTE.sun }).setOrigin(
      0,
      0.5,
    ),
    ...drawPageArt(scene, page.art, game),
    text,
  ];
}

function bodyText(scene: Phaser.Scene, page: ManualPage, x: number, y: number, width: number) {
  const content = t(page.text, { sols: RUN_BALANCE.solsPerRun });
  return addGlowText(scene, x, y, content, { wrapWidth: width }).setOrigin(0).setAlign('left');
}

/** "bar icon +" in green or "bar icon −" in red: what this action does to the bars. */
function drawEffects(
  scene: Phaser.Scene,
  effects: readonly PageEffect[],
  x: number,
  y: number,
): Parts {
  return effects.flatMap((effect, index) => {
    const left = x + index * EFFECT_SPACING;
    const icon = scene.add.image(left + 6, y, STAT_ICON_SPRITES[effect.stat]);
    icon.setScale(14 / Math.max(icon.width, icon.height));
    const raises = effect.change > 0;
    const sign = addGlowText(scene, left + 20, y, raises ? '+' : '-', {
      size: FONT_SIZE.medium,
      color: raises ? PALETTE.green : PALETTE.alert,
    });
    return [icon, sign];
  });
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}
