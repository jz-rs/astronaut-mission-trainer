import type Phaser from 'phaser';
import { MINIGAME_BALANCE } from '../config/balance';
import { nextFactKey } from '../content/facts';
import type { TaskId } from '../core/types';
import { t, type TranslationKey } from '../i18n';
import { createButton } from '../ui/Button';
import { FONT_SIZE, MINIGAME_AREA } from '../ui/layout';
import { PALETTE } from '../ui/palette';
import { drawTechPanel } from '../ui/techFrame';
import { addText } from '../ui/text';

/**
 * The end of every minigame: "PERFECT! / Well done! / Almost!" and what it teaches, in one big line.
 * It stays until the kid taps GO ON (the base is paused meanwhile), so the science
 * is a reward that can actually be read.
 */
const RESULT_DEPTH = 100;
const CENTER_X = MINIGAME_AREA.x + MINIGAME_AREA.width / 2;
const BUTTON_WIDTH = 200;
const BUTTON_HEIGHT = 52;

export function showResultCard(
  scene: Phaser.Scene,
  taskId: TaskId,
  performance: number,
  onContinue: () => void,
): void {
  const [messageKey, color] = resultMessage(performance);
  const cover = scene.add.graphics().setDepth(RESULT_DEPTH);
  drawTechPanel(cover, MINIGAME_AREA, color, PALETTE.space);
  const message = addText(scene, CENTER_X, MINIGAME_AREA.y + 40, t(messageKey), {
    size: FONT_SIZE.large,
    color,
  });
  message.setDepth(RESULT_DEPTH).setScale(0);
  scene.tweens.add({ targets: message, scale: 1, duration: 250, ease: 'Back.Out' });
  addText(scene, CENTER_X, MINIGAME_AREA.y + 112, t(nextFactKey(taskId)), {
    size: FONT_SIZE.medium,
    color: PALETTE.white,
    wrapWidth: MINIGAME_AREA.width - 60,
  }).setDepth(RESULT_DEPTH);
  addContinueButton(scene, onContinue);
}

function resultMessage(performance: number): [TranslationKey, number] {
  const { perfectThreshold, goodThreshold } = MINIGAME_BALANCE;
  if (performance >= perfectThreshold) return ['minigame.result.perfect', PALETTE.sun];
  if (performance >= goodThreshold) return ['minigame.result.good', PALETTE.green];
  return ['minigame.result.tryAgain', PALETTE.marsLight];
}

/**
 * GO ON at the bottom of a result card. It appears after a short pause, so the fast taps of the
 * game don't skip the fact by accident. Also used by the rover trip.
 */
export function addContinueButton(scene: Phaser.Scene, onContinue: () => void): void {
  let continued = false;
  const continueOnce = () => {
    if (continued) return;
    continued = true;
    onContinue();
  };
  scene.time.delayedCall(MINIGAME_BALANCE.factMinDisplayMs, () => {
    const button = createButton(scene, {
      x: CENTER_X,
      y: MINIGAME_AREA.y + MINIGAME_AREA.height - BUTTON_HEIGHT / 2 - 16,
      width: BUTTON_WIDTH,
      height: BUTTON_HEIGHT,
      label: t('minigame.continue'),
      color: PALETTE.cyan,
      onPress: continueOnce,
    });
    button.setDepth(RESULT_DEPTH);
  });
}
