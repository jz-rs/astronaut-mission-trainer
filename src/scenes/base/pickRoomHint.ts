import type Phaser from 'phaser';
import { t } from '../../i18n';
import { CORRIDOR_CENTER, FONT_SIZE } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addText } from '../../ui/text';

/** Spec 05 — "Which room?" shown over the corridor while a bot is selected. */
/** Above the heads of the crew waiting in the corridor. */
const HINT_OFFSET_Y = 66;

export function createPickRoomHint(scene: Phaser.Scene): Phaser.GameObjects.Text {
  const hint = addText(
    scene,
    CORRIDOR_CENTER.x,
    CORRIDOR_CENTER.y - HINT_OFFSET_Y,
    t('hud.pickRoom'),
    {
      size: FONT_SIZE.small,
      color: PALETTE.sun,
    },
  );
  return hint.setVisible(false);
}
