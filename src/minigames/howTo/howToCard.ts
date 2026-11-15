import type Phaser from 'phaser';
import { t, type TranslationKey } from '../../i18n';
import { createButton } from '../../ui/Button';
import { FONT_SIZE, MIN_TOUCH_SIZE, type Rect } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { drawTechPanel } from '../../ui/techFrame';
import { addText } from '../../ui/text';

/**
 * Before playing, a card explains the mission in a few picture steps with one short line each,
 * so the kid learns it first and then plays without stopping to read. The minigame calls
 * `pauseGame()` before showing it, and the clock (and the base behind) waits for the big button.
 */
export interface HowToStep {
  /** Builds the picture centered on (0, 0), at its natural size. */
  picture: (scene: Phaser.Scene) => Phaser.GameObjects.Container;
  textKey: TranslationKey;
}

export interface HowToCardOptions {
  titleKey: TranslationKey;
  startKey: TranslationKey;
  steps: readonly HowToStep[];
}

const DEPTH = 20;
const TITLE_Y = 14;
const FIRST_ROW_Y = 44;
const LAST_ROW_GAP = 16;
const PICTURE_X = 100;
const PICTURE_SCALE = 0.85;
const TEXT_X = 196;
const TEXT_RIGHT_PADDING = 14;
const BUTTON_WIDTH = 200;
const BUTTON_BOTTOM_GAP = 8;

export function showHowToCard(
  scene: Phaser.Scene,
  area: Rect,
  options: HowToCardOptions,
  onStart: () => void,
): void {
  const card = scene.add.container(0, 0).setDepth(DEPTH);
  // Swallows the taps, so nothing under the card can be touched before starting.
  const blocker = scene.add.rectangle(area.x, area.y, area.width, area.height).setOrigin(0);
  blocker.setInteractive();
  const panel = scene.add.graphics();
  drawTechPanel(panel, area, PALETTE.cyan);
  const titleStyle = { size: FONT_SIZE.medium, color: PALETTE.sun };
  const centerX = area.x + area.width / 2;
  const title = addText(scene, centerX, area.y + TITLE_Y, t(options.titleKey), titleStyle);
  const buttonY = area.y + area.height - MIN_TOUCH_SIZE / 2 - BUTTON_BOTTOM_GAP;
  const lastRowY = buttonY - MIN_TOUCH_SIZE / 2 - LAST_ROW_GAP;
  card.add([blocker, panel, title, ...addSteps(scene, area, options.steps, lastRowY)]);
  const button = createButton(scene, {
    x: centerX,
    y: buttonY,
    width: BUTTON_WIDTH,
    height: MIN_TOUCH_SIZE,
    label: t(options.startKey),
    onPress: () => {
      card.destroy();
      onStart();
    },
  });
  card.add(button);
}

/** One row per step, spread evenly between the title and the button. */
function addSteps(
  scene: Phaser.Scene,
  area: Rect,
  steps: readonly HowToStep[],
  lastRowY: number,
): Phaser.GameObjects.GameObject[] {
  const firstRowY = area.y + FIRST_ROW_Y;
  const rowHeight = (lastRowY - firstRowY) / Math.max(1, steps.length - 1);
  const wrapWidth = area.width - TEXT_X - TEXT_RIGHT_PADDING;
  return steps.flatMap(({ picture, textKey }, index) => {
    const y = firstRowY + index * rowHeight;
    const image = picture(scene)
      .setPosition(area.x + PICTURE_X, y)
      .setScale(PICTURE_SCALE);
    const line = addText(scene, area.x + TEXT_X, y, t(textKey), {
      size: FONT_SIZE.small,
      wrapWidth,
    });
    line.setOrigin(0, 0.5).setAlign('left');
    return [image, line];
  });
}
