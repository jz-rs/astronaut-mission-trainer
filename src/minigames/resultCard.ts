import type Phaser from 'phaser';
import { MINIGAME_BALANCE } from '../config/balance';
import { nextFactKey } from '../content/facts';
import type { TaskId } from '../core/types';
import { t, type TranslationKey } from '../i18n';
import { createButton } from '../ui/Button';
import { FONT_SIZE, MIN_TOUCH_SIZE, TABLET_SCREEN } from '../ui/layout';
import { MissionTablet, type TabletMood } from '../ui/MissionTablet';
import { PALETTE } from '../ui/palette';
import { addGlowText } from '../ui/screenUi';

/**
 * The end of every minigame, on the mission tablet: "PERFECT! / Well done! / Almost!" and what
 * it teaches, in one big line. It stays until the kid taps GO ON (the base is paused meanwhile),
 * so the science is a reward that can actually be read.
 */
/** Above the minigame and its scanlines. */
export const RESULT_DEPTH = 200;
const CENTER_X = TABLET_SCREEN.x + TABLET_SCREEN.width / 2;
const MESSAGE_Y = TABLET_SCREEN.y + 44;
const FACT_Y = TABLET_SCREEN.y + 116;
const FACT_MARGIN = 40;
const BUTTON_WIDTH = 200;
const BUTTON_BOTTOM_GAP = 12;

export function showResultCard(
  scene: Phaser.Scene,
  taskId: TaskId,
  performance: number,
  onContinue: () => void,
): void {
  const [messageKey, color, mood] = resultMessage(performance);
  const tablet = new MissionTablet(scene, RESULT_DEPTH);
  const message = addGlowText(scene, CENTER_X, MESSAGE_Y, t(messageKey), {
    size: FONT_SIZE.large,
    color,
  });
  message.setScale(0);
  const fact = addGlowText(scene, CENTER_X, FACT_Y, t(nextFactKey(taskId)), {
    size: FONT_SIZE.medium,
    color: PALETTE.white,
    wrapWidth: TABLET_SCREEN.width - FACT_MARGIN,
  });
  tablet.show([message, fact], mood);
  scene.tweens.add({ targets: message, scale: 1, duration: 250, ease: 'Back.Out' });
  addContinueButton(scene, tablet, onContinue);
}

function resultMessage(performance: number): [TranslationKey, number, TabletMood] {
  const { perfectThreshold, goodThreshold } = MINIGAME_BALANCE;
  if (performance >= perfectThreshold) return ['minigame.result.perfect', PALETTE.sun, 'right'];
  if (performance >= goodThreshold) return ['minigame.result.good', PALETTE.green, 'right'];
  return ['minigame.result.tryAgain', PALETTE.marsLight, 'calm'];
}

/**
 * GO ON at the bottom of the tablet screen. It appears after a short pause, so the fast taps of
 * the game don't skip the fact by accident. Also used by the rover trip.
 */
export function addContinueButton(
  scene: Phaser.Scene,
  tablet: MissionTablet,
  onContinue: () => void,
): void {
  let continued = false;
  const continueOnce = () => {
    if (continued) return;
    continued = true;
    onContinue();
  };
  scene.time.delayedCall(MINIGAME_BALANCE.factMinDisplayMs, () => {
    const button = createButton(scene, {
      x: CENTER_X,
      y: TABLET_SCREEN.y + TABLET_SCREEN.height - MIN_TOUCH_SIZE / 2 - BUTTON_BOTTOM_GAP,
      width: BUTTON_WIDTH,
      height: MIN_TOUCH_SIZE,
      label: t('minigame.continue'),
      color: PALETTE.cyan,
      onPress: continueOnce,
    });
    tablet.addToScreen(button);
  });
}
