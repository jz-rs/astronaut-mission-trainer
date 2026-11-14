import type Phaser from 'phaser';
import { t } from '../../i18n';
import { CORRIDOR, FONT_SIZE, PLAYER_IDLE_SPOT } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addText } from '../../ui/text';

/** Spec 05 — "Which room?" shown over the corridor while a bot is selected. */
const HINT_OFFSET_Y = 10;

export function createPickRoomHint(scene: Phaser.Scene): Phaser.GameObjects.Text {
  const hint = addText(scene, PLAYER_IDLE_SPOT.x, CORRIDOR.y - HINT_OFFSET_Y, t('hud.pickRoom'), {
    size: FONT_SIZE.small,
    color: PALETTE.sun,
  });
  return hint.setVisible(false);
}
