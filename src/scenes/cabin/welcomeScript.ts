import type Phaser from 'phaser';
import { STAT_IDS } from '../../core/types';
import type { TranslationKey } from '../../i18n';
import type { Rect } from '../../ui/layout';
import { STAT_COLORS } from '../../ui/palette';
import { drawScreenPanel, drawVisorCorners } from '../../ui/screenUi';
import { addSpriteSized, STAT_ICON_SPRITES } from '../../ui/sprites';
import type { CabinArtKey } from './cabinArt';

/**
 * Spec 18, scene 1 — The guide's welcome, one line at a time (script from the spec).
 * Each step says which pose the guide takes, what gets highlighted and what picture
 * appears above the message.
 */
export type CabinTarget = 'window' | 'tablet' | 'monitor';
type WelcomeExtra = 'base' | 'bars';

export interface WelcomeStep {
  text: TranslationKey;
  pose: CabinArtKey;
  highlight?: CabinTarget;
  extra?: WelcomeExtra;
}

export const WELCOME_STEPS: readonly WelcomeStep[] = [
  { text: 'cabin.welcome.arrival', pose: 'guidePointRight', highlight: 'window' },
  { text: 'cabin.welcome.context', pose: 'guidePointRight', highlight: 'window' },
  { text: 'cabin.welcome.simulation', pose: 'guideWave', extra: 'base' },
  { text: 'cabin.welcome.bars', pose: 'guideThumbsUp', extra: 'bars' },
  { text: 'cabin.welcome.preparation', pose: 'guidePointDown', highlight: 'tablet' },
];

const EXTRA_DEPTH = 35;
const BASE_PICTURE: Rect = { x: 400, y: 160, width: 160, height: 92 };
const BARS_PICTURE: Rect = { x: 380, y: 196, width: 200, height: 56 };
const ICON_SIZE = 32;

/** The picture that goes with a welcome line: the base on Mars, or the four bar icons. */
export function showWelcomeExtra(
  scene: Phaser.Scene,
  extra: WelcomeExtra,
): Phaser.GameObjects.Container {
  return extra === 'base' ? showBasePicture(scene) : showBarIcons(scene);
}

function showBasePicture(scene: Phaser.Scene): Phaser.GameObjects.Container {
  const frame = scene.add.graphics();
  drawScreenPanel(frame, BASE_PICTURE);
  const base = scene.add.image(BASE_PICTURE.x + 4, BASE_PICTURE.y + 4, 'baseMap').setOrigin(0);
  base.setDisplaySize(BASE_PICTURE.width - 8, BASE_PICTURE.height - 8);
  const corners = scene.add.graphics();
  drawVisorCorners(corners, BASE_PICTURE);
  return scene.add.container(0, 0, [frame, base, corners]).setDepth(EXTRA_DEPTH);
}

function showBarIcons(scene: Phaser.Scene): Phaser.GameObjects.Container {
  const frame = scene.add.graphics();
  drawScreenPanel(frame, BARS_PICTURE);
  const parts: Phaser.GameObjects.GameObject[] = [frame];
  const spacing = BARS_PICTURE.width / STAT_IDS.length;
  STAT_IDS.forEach((stat, index) => {
    const x = BARS_PICTURE.x + spacing * (index + 0.5);
    const y = BARS_PICTURE.y + BARS_PICTURE.height / 2;
    const ring = scene.add.graphics();
    ring.lineStyle(2, STAT_COLORS[stat], 1).strokeCircle(x, y, ICON_SIZE / 2 + 3);
    parts.push(ring, addSpriteSized(scene, x, y, STAT_ICON_SPRITES[stat], ICON_SIZE));
  });
  return scene.add.container(0, 0, parts).setDepth(EXTRA_DEPTH);
}
