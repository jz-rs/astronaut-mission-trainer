import type Phaser from 'phaser';
import type { StatId } from '../../../core/types';
import { createButton } from '../../../ui/Button';
import { FONT_SIZE, MIN_TOUCH_SIZE, TABLET_SCREEN } from '../../../ui/layout';
import { PALETTE } from '../../../ui/palette';
import { STAT_ICON_SPRITES } from '../../../ui/sprites';
import { addText, type TextOptions } from '../../../ui/text';
import { drawPhoto } from './crisisPhoto';

/**
 * Spec 16, steps 3 and 5 — A big title, a real NASA photo on the left and, on the right, why it
 * happened in one line plus the real fact behind it. Used for "right / wrong" after the vote and
 * for the reward photo once the storm is over. One big button closes it.
 */
const TITLE_Y = TABLET_SCREEN.y + 24;
const VERDICT_ICON = 22;
const VERDICT_GAP = 8;
const VERDICT_STROKE = 3;
/** Lines of the check and the cross, from -1 to 1 around the icon's center. */
const CHECK_STROKES = [
  [-0.55, 0, -0.1, 0.45],
  [-0.1, 0.45, 0.55, -0.45],
] as const;
const CROSS_STROKES = [
  [-0.5, -0.5, 0.5, 0.5],
  [0.5, -0.5, -0.5, 0.5],
] as const;
const PHOTO = { x: TABLET_SCREEN.x + 20, y: TABLET_SCREEN.y + 52, width: 190, height: 125 };
const CAPTION_Y = PHOTO.y + PHOTO.height + 24;
const COLUMN = { x: TABLET_SCREEN.x + 232, y: TABLET_SCREEN.y + 50, width: 210, gap: 8 };
const CHIP = { height: 20, icon: 14, padding: 6 };
const BUTTON = { width: 150, y: TABLET_SCREEN.y + TABLET_SCREEN.height - 28 };

export interface PhotoScreenOptions {
  verdict: 'right' | 'wrong' | null;
  title: string;
  color: number;
  photoTexture: string;
  caption: string;
  label: string;
  text: string;
  detail: string;
  chip: { stat: StatId; text: string } | null;
  buttonLabel: string;
  onButton: () => void;
}

export function drawPhotoScreen(
  scene: Phaser.Scene,
  options: PhotoScreenOptions,
): Phaser.GameObjects.GameObject[] {
  const caption = addText(scene, PHOTO.x + PHOTO.width / 2, CAPTION_Y, options.caption, {
    size: FONT_SIZE.small,
    color: PALETTE.sand,
  });
  return [
    ...drawTitle(scene, options),
    ...drawPhoto(scene, PHOTO, options.photoTexture, options.color),
    caption,
    ...drawColumn(scene, options),
    createButton(scene, {
      x: COLUMN.x + COLUMN.width / 2,
      y: BUTTON.y,
      width: BUTTON.width,
      height: MIN_TOUCH_SIZE,
      label: options.buttonLabel,
      color: options.verdict === 'wrong' ? PALETTE.white : PALETTE.green,
      onPress: options.onButton,
    }),
  ];
}

function drawTitle(
  scene: Phaser.Scene,
  options: PhotoScreenOptions,
): Phaser.GameObjects.GameObject[] {
  const centerX = TABLET_SCREEN.x + TABLET_SCREEN.width / 2;
  const title = addText(scene, centerX, TITLE_Y, options.title, {
    size: FONT_SIZE.large,
    color: options.color,
  });
  if (!options.verdict) return [title];
  // Icon and title together stay centered on the screen.
  title.setX(centerX + (VERDICT_ICON + VERDICT_GAP) / 2);
  const iconCenterX = title.x - title.width / 2 - VERDICT_GAP - VERDICT_ICON / 2;
  return [drawVerdictIcon(scene, iconCenterX, options.verdict, options.color), title];
}

/** A colored square with a check (right) or a cross (wrong), drawn on a 1×1 grid around its center. */
function drawVerdictIcon(
  scene: Phaser.Scene,
  centerX: number,
  verdict: 'right' | 'wrong',
  color: number,
): Phaser.GameObjects.Graphics {
  const half = VERDICT_ICON / 2;
  const icon = scene.add.graphics();
  icon.fillStyle(color, 1).fillRect(centerX - half, TITLE_Y - half, VERDICT_ICON, VERDICT_ICON);
  icon.lineStyle(VERDICT_STROKE, PALETTE.night, 1);
  const strokes = verdict === 'right' ? CHECK_STROKES : CROSS_STROKES;
  for (const [fromX, fromY, toX, toY] of strokes) {
    icon.lineBetween(
      centerX + fromX * half,
      TITLE_Y + fromY * half,
      centerX + toX * half,
      TITLE_Y + toY * half,
    );
  }
  return icon;
}

/** "WHY?", the reason, the real fact and what it changes, one under the other. */
function drawColumn(
  scene: Phaser.Scene,
  options: PhotoScreenOptions,
): Phaser.GameObjects.GameObject[] {
  let y = COLUMN.y;
  const add = (content: string, textOptions: TextOptions) => {
    const text = addLeftText(scene, COLUMN.x, y, content, {
      wrapWidth: COLUMN.width,
      ...textOptions,
    });
    y += text.height + COLUMN.gap;
    return text;
  };
  const parts: Phaser.GameObjects.GameObject[] = [
    add(options.label, { size: FONT_SIZE.small, color: options.color }),
    add(options.text, { size: FONT_SIZE.medium, color: PALETTE.white }),
    add(options.detail, { size: FONT_SIZE.small, color: PALETTE.sand }),
  ];
  if (options.chip) parts.push(...drawChip(scene, y, options.chip, options.color));
  return parts;
}

function addLeftText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  content: string,
  options: TextOptions,
) {
  return addText(scene, x, y, content, options).setOrigin(0).setAlign('left');
}

/** "It will hurt less", with the icon of the bar the crisis hits. */
function drawChip(
  scene: Phaser.Scene,
  y: number,
  chip: { stat: StatId; text: string },
  color: number,
): Phaser.GameObjects.GameObject[] {
  const box = scene.add.graphics();
  box.fillStyle(color, 0.2).fillRect(COLUMN.x, y, COLUMN.width, CHIP.height);
  box.lineStyle(2, color, 1).strokeRect(COLUMN.x, y, COLUMN.width, CHIP.height);
  const icon = scene.add.image(
    COLUMN.x + CHIP.padding + CHIP.icon / 2,
    y + CHIP.height / 2,
    STAT_ICON_SPRITES[chip.stat],
  );
  icon.setScale(CHIP.icon / icon.height);
  const text = addLeftText(
    scene,
    COLUMN.x + CHIP.padding * 2 + CHIP.icon,
    y + CHIP.height / 2,
    chip.text,
    {
      size: FONT_SIZE.small,
    },
  ).setOrigin(0, 0.5);
  return [box, icon, text];
}
