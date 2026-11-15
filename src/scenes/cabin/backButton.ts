import type Phaser from 'phaser';
import { t } from '../../i18n';
import { createButton } from '../../ui/Button';
import { CABIN_BACK_BUTTON, FONT_SIZE } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';

/**
 * Spec 19 — "Back" in the cabin's top-left corner, to the start screen. Same chunky button as
 * the start screen's small ones (languages, sources), so it reads as "the game's menu" and not
 * as part of the ship.
 */
const DEPTH = 40;

export function addBackButton(scene: Phaser.Scene, onPress: () => void): void {
  const { x, y, width, height } = CABIN_BACK_BUTTON;
  createButton(scene, {
    x: x + width / 2,
    y: y + height / 2,
    width,
    height,
    label: `◀ ${t('cabin.back')}`,
    fontSize: FONT_SIZE.small,
    color: PALETTE.metal,
    onPress,
  }).setDepth(DEPTH);
}
