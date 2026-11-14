import Phaser from 'phaser';
import type { RunState } from '../../core/types';
import { t } from '../../i18n';
import { FONT_SIZE, GARAGE_RECT, MIN_TOUCH_SIZE } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { drawTechPanel } from '../../ui/techFrame';
import { addText } from '../../ui/text';

/**
 * Spec 15 — The rover garage at the end of the corridor. It dims while the rover is out,
 * so the kid sees at a glance that the rover cannot leave again yet.
 */
export class GarageView {
  private readonly bay: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, onTap: () => void) {
    const { x, y, width, height } = GARAGE_RECT;
    const panel = scene.add.graphics();
    drawTechPanel(panel, { x: 0, y: 0, width, height }, PALETTE.sun);
    const label = addText(scene, width / 2, height / 2, `🚙 ${t('rover.garage')}`, {
      size: FONT_SIZE.small,
      color: PALETTE.sun,
    });
    this.bay = scene.add.container(x, y, [panel, label]);
    const zone = scene.add.zone(x + width / 2, y + height / 2, width, MIN_TOUCH_SIZE);
    zone.setInteractive({ useHandCursor: true }).on('pointerup', onTap);
  }

  update(state: RunState): void {
    this.bay.setAlpha(state.roverOut ? 0.35 : 1);
  }
}
