import type Phaser from 'phaser';
import { t, type TranslationKey } from '../../i18n';
import { addIconLabel, type IconLabel } from '../../ui/iconLabel';
import { FONT_SIZE, GAME_WIDTH, MINIGAME_PANEL } from '../../ui/layout';

/**
 * Mission 5 — The one line at the top of the rover trip: what to do now. It follows the steps of
 * the guided tube, and then tells the kid they are on their own and which tube it is.
 */
const ICON_SIZE = 20;
const TOP_OFFSET = 18;

const STEP_INSTRUCTIONS: Record<number, TranslationKey> = {
  1: 'rover.instruction',
  2: 'rover.drillInstruction',
  3: 'rover.tubeInstruction',
  4: 'rover.shelfInstruction',
};

export class TripInstruction {
  private readonly label: IconLabel;

  constructor(scene: Phaser.Scene) {
    const y = MINIGAME_PANEL.y + TOP_OFFSET;
    const text = t('rover.instruction');
    this.label = addIconLabel(scene, GAME_WIDTH / 2, y, 'rover', ICON_SIZE, text, {
      size: FONT_SIZE.small,
    });
  }

  showStep(step: number): void {
    const key = STEP_INSTRUCTIONS[step];
    if (key) this.label.setText(t(key));
  }

  /** From the second tube on, the kid fills them alone. */
  showTube(tube: number, total: number): void {
    if (tube > 1) this.label.setText(t('rover.soloInstruction', { current: tube, total }));
  }
}
