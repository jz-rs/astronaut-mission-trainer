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
const TITLE_Y = 16;
/** The steps share the space between the title and the button, with this margin on each side. */
const STEPS_TOP = 34;
const STEPS_MARGIN = 10;
const PICTURE_SCALE = 0.85;
/** Pictures and lines form one block, centered in the card. */
const PICTURE_COLUMN = 126;
const COLUMN_GAP = 10;
const TEXT_WIDTH = 330;
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
  const stepsBottom = buttonY - MIN_TOUCH_SIZE / 2 - STEPS_MARGIN;
  card.add([blocker, panel, title, ...addSteps(scene, area, options.steps, stepsBottom)]);
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

/** One row per step: each one centered in an equal slice between the title and the button. */
function addSteps(
  scene: Phaser.Scene,
  area: Rect,
  steps: readonly HowToStep[],
  stepsBottom: number,
): Phaser.GameObjects.GameObject[] {
  const stepsTop = area.y + STEPS_TOP + STEPS_MARGIN;
  const rowHeight = (stepsBottom - stepsTop) / Math.max(1, steps.length);
  const blockLeft = area.x + (area.width - (PICTURE_COLUMN + COLUMN_GAP + TEXT_WIDTH)) / 2;
  return steps.flatMap(({ picture, textKey }, index) => {
    const y = stepsTop + rowHeight * (index + 0.5);
    const image = picture(scene)
      .setPosition(blockLeft + PICTURE_COLUMN / 2, y)
      .setScale(PICTURE_SCALE);
    const line = addText(scene, blockLeft + PICTURE_COLUMN + COLUMN_GAP, y, t(textKey), {
      size: FONT_SIZE.small,
      wrapWidth: TEXT_WIDTH,
    });
    line.setOrigin(0, 0.5).setAlign('left');
    return [image, line];
  });
}
