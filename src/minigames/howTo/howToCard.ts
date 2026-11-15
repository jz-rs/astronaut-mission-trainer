import type Phaser from 'phaser';
import { t, type TranslationKey } from '../../i18n';
import { createButton } from '../../ui/Button';
import { FONT_SIZE, MIN_TOUCH_SIZE, TABLET_SCREEN } from '../../ui/layout';
import { MissionTablet } from '../../ui/MissionTablet';
import { PALETTE } from '../../ui/palette';
import { addGlowText } from '../../ui/screenUi';
import { addText } from '../../ui/text';
import { addStepNumber } from './stepNumber';

/**
 * Before playing, the mission tablet pops up and explains the mission in a few picture steps
 * with one short line each, so the kid learns it first and then plays without stopping to read.
 * The minigame calls `pauseGame()` before showing it, and the clock (and the base behind) waits
 * for the big button.
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

/** Above the minigame and its scanlines. */
const DEPTH = 200;
const SCREEN = TABLET_SCREEN;
const TITLE_Y = 16;
/** A long title switches to a smaller size so it never touches the edges of the screen. */
const TITLE_MAX_WIDTH = SCREEN.width - 24;
const TITLE_SMALL_SIZE = 10;
/** The steps share the space between the title and the button. */
const STEPS_TOP = 30;
const STEPS_MARGIN = 2;
const PICTURE_SCALE = 0.72;
/**
 * Numbers, pictures and lines form one block, centered on the screen. The number sits in its own
 * column, in a yellow circle, so it never mixes with the picture or reads as part of the text.
 */
const NUMBER_COLUMN = 20;
const NUMBER_RADIUS = 9;
const PICTURE_COLUMN = 112;
const COLUMN_GAP = 8;
const TEXT_WIDTH = 296;
const BLOCK_WIDTH = NUMBER_COLUMN + COLUMN_GAP + PICTURE_COLUMN + COLUMN_GAP + TEXT_WIDTH;
const BUTTON_WIDTH = 200;
const BUTTON_BOTTOM_GAP = 10;

export function showHowToCard(
  scene: Phaser.Scene,
  options: HowToCardOptions,
  onStart: () => void,
): void {
  const tablet = new MissionTablet(scene, DEPTH);
  const centerX = SCREEN.x + SCREEN.width / 2;
  const title = addGlowText(scene, centerX, SCREEN.y + TITLE_Y, t(options.titleKey), {
    size: FONT_SIZE.medium,
    color: PALETTE.sun,
  });
  if (title.width > TITLE_MAX_WIDTH) title.setFontSize(TITLE_SMALL_SIZE);
  const buttonY = SCREEN.y + SCREEN.height - MIN_TOUCH_SIZE / 2 - BUTTON_BOTTOM_GAP;
  const stepsBottom = buttonY - MIN_TOUCH_SIZE / 2 - STEPS_MARGIN;
  const button = createButton(scene, {
    x: centerX,
    y: buttonY,
    width: BUTTON_WIDTH,
    height: MIN_TOUCH_SIZE,
    label: t(options.startKey),
    onPress: () => {
      tablet.destroy();
      onStart();
    },
  });
  tablet.show([title, ...addSteps(scene, options.steps, stepsBottom), button], 'calm');
}

/** One row per step (number, picture, line), each centered in an equal slice of the screen. */
function addSteps(
  scene: Phaser.Scene,
  steps: readonly HowToStep[],
  stepsBottom: number,
): Phaser.GameObjects.GameObject[] {
  const stepsTop = SCREEN.y + STEPS_TOP + STEPS_MARGIN;
  const rowHeight = (stepsBottom - stepsTop) / Math.max(1, steps.length);
  const blockLeft = SCREEN.x + (SCREEN.width - BLOCK_WIDTH) / 2;
  const pictureLeft = blockLeft + NUMBER_COLUMN + COLUMN_GAP;
  return steps.flatMap(({ picture, textKey }, index) => {
    const y = stepsTop + rowHeight * (index + 0.5);
    const number = addStepNumber(scene, blockLeft + NUMBER_COLUMN / 2, y, index + 1, NUMBER_RADIUS);
    const image = picture(scene)
      .setPosition(pictureLeft + PICTURE_COLUMN / 2, y)
      .setScale(PICTURE_SCALE);
    const line = addText(scene, pictureLeft + PICTURE_COLUMN + COLUMN_GAP, y, t(textKey), {
      size: FONT_SIZE.small,
      wrapWidth: TEXT_WIDTH,
    });
    line.setOrigin(0, 0.5).setAlign('left').setLineSpacing(FONT_SIZE.small / 4);
    return [number, image, line];
  });
}
