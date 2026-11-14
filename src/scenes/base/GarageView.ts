import Phaser from 'phaser';
import { ROVER_BALANCE } from '../../config/balance';
import { canStartExpedition } from '../../core/expedition';
import type { RunState } from '../../core/types';
import { t } from '../../i18n';
import { FONT_SIZE, GARAGE_RECT, MIN_TOUCH_SIZE } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { drawTechPanel } from '../../ui/techFrame';
import { addIconLabel } from '../../ui/iconLabel';

/**
 * Spec 15 — The rover garage outside the corridor airlock. It shows what a trip costs (−20 ⚡)
 * and dims while the rover is out or the energy is not enough, so the kid sees at a glance
 * that it cannot leave yet.
 */
const ICON_SIZE = 22;
/** Air between the label and the frame, so the "⚡" is never cut off in any language. */
const SIDE_PADDING = 10;

export class GarageView {
  private readonly bay: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, onTap: () => void) {
    const { height } = GARAGE_RECT;
    const label = addIconLabel(
      scene,
      0,
      height / 2,
      'rover',
      ICON_SIZE,
      t('rover.garageWithCost', { cost: ROVER_BALANCE.energyCost }),
      {
        size: FONT_SIZE.small,
        color: PALETTE.sun,
      },
    );
    // The frame grows to fit the label and stays centered on the garage spot of the layout.
    const labelWidth = label.text.getRightCenter().x - label.icon.getLeftCenter().x;
    const width = Math.max(GARAGE_RECT.width, labelWidth + SIDE_PADDING * 2);
    const centerX = GARAGE_RECT.x + GARAGE_RECT.width / 2;
    label.setText(label.text.text); // re-centers the pair on x = 0
    label.icon.x += width / 2;
    label.text.x += width / 2;
    const panel = scene.add.graphics();
    drawTechPanel(panel, { x: 0, y: 0, width, height }, PALETTE.sun);
    this.bay = scene.add.container(centerX - width / 2, GARAGE_RECT.y, [
      panel,
      label.icon,
      label.text,
    ]);
    const zone = scene.add.zone(centerX, GARAGE_RECT.y + height / 2, width, MIN_TOUCH_SIZE);
    zone.setInteractive({ useHandCursor: true }).on('pointerup', onTap);
  }

  update(state: RunState): void {
    this.bay.setAlpha(canStartExpedition(state) ? 1 : 0.35);
  }
}
