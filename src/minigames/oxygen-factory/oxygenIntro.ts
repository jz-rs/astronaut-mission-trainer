import type Phaser from 'phaser';
import { t } from '../../i18n';
import { FONT_SIZE, MIN_TOUCH_SIZE, type Rect } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { createButton } from '../../ui/Button';
import { drawTechPanel } from '../../ui/techFrame';
import { addText } from '../../ui/text';
import { addFormula, OXYGEN_RECIPE } from './oxygenRecipe';

/**
 * Spec 08 — Before playing, a card explains how MOXIE makes oxygen in 4 picture steps
 * with one short line each, so the kid learns it first and then plays without stopping to read.
 * The whole game (base included) waits until the kid taps the big button.
 */
const DEPTH = 20;
const TITLE_Y = 14;
const FIRST_ROW_Y = 44;
const ROW_HEIGHT = 44;
const FORMULA_X = 100;
const FORMULA_SCALE = 0.85;
const TEXT_X = 196;
const TEXT_RIGHT_PADDING = 14;
const BUTTON_WIDTH = 200;
const BUTTON_BOTTOM_GAP = 8;

export function showOxygenIntro(scene: Phaser.Scene, area: Rect, onStart: () => void): void {
  const card = scene.add.container(0, 0).setDepth(DEPTH);
  // Swallows the taps, so the molecules under the card can't be grabbed before starting.
  const blocker = scene.add.rectangle(area.x, area.y, area.width, area.height).setOrigin(0);
  blocker.setInteractive();
  const panel = scene.add.graphics();
  drawTechPanel(panel, area, PALETTE.cyan);
  const title = addText(
    scene,
    area.x + area.width / 2,
    area.y + TITLE_Y,
    t('minigame.oxygen-factory.introTitle'),
    {
      size: FONT_SIZE.medium,
      color: PALETTE.sun,
    },
  );
  card.add([blocker, panel, title, ...addSteps(scene, area)]);
  const button = createButton(scene, {
    x: area.x + area.width / 2,
    y: area.y + area.height - MIN_TOUCH_SIZE / 2 - BUTTON_BOTTOM_GAP,
    width: BUTTON_WIDTH,
    height: MIN_TOUCH_SIZE,
    label: t('minigame.oxygen-factory.start'),
    onPress: () => {
      card.destroy();
      onStart();
    },
  });
  card.add(button);
}

function addSteps(scene: Phaser.Scene, area: Rect): Phaser.GameObjects.GameObject[] {
  const wrapWidth = area.width - TEXT_X - TEXT_RIGHT_PADDING;
  return OXYGEN_RECIPE.flatMap(({ formula, textKey }, index) => {
    const y = area.y + FIRST_ROW_Y + index * ROW_HEIGHT;
    const picture = addFormula(scene, area.x + FORMULA_X, y, formula, FORMULA_SCALE);
    const line = addText(scene, area.x + TEXT_X, y, t(textKey), {
      size: FONT_SIZE.small,
      wrapWidth,
    });
    line.setOrigin(0, 0.5).setAlign('left');
    return [picture, line];
  });
}
