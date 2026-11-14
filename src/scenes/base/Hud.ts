import Phaser from 'phaser';
import { RUN_BALANCE } from '../../config/balance';
import { STAT_IDS, type RunState, type StatId } from '../../core/types';
import { t } from '../../i18n';
import { COLORS } from '../../ui/palette';
import { StatBar } from '../../ui/StatBar';
import { textStyle } from '../../ui/textStyles';

const STAT_ICONS: Record<StatId, string> = { oxygen: '💨', food: '🥬', shield: '☢️', energy: '⚡' };
const STAT_COLORS: Record<StatId, number> = {
  oxygen: COLORS.oxygen,
  food: COLORS.food,
  shield: COLORS.shield,
  energy: COLORS.energy,
};
const HUD_Y = 22;
const BAR_SPACING = 122;

/** Top bar: the 4 stats plus the sol counter. Icons and colors only, almost no text. */
export class Hud {
  private readonly bars: Record<StatId, StatBar>;
  private readonly solLabel: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    scene.add.rectangle(0, 0, scene.scale.width, HUD_Y * 2, COLORS.panel).setOrigin(0);
    this.bars = Object.fromEntries(
      STAT_IDS.map((statId, index) => [
        statId,
        new StatBar(
          scene,
          12 + index * BAR_SPACING,
          HUD_Y,
          STAT_ICONS[statId],
          STAT_COLORS[statId],
        ),
      ]),
    ) as Record<StatId, StatBar>;
    this.solLabel = scene.add
      .text(scene.scale.width - 12, HUD_Y, '', textStyle('small'))
      .setOrigin(1, 0.5);
  }

  refresh(state: RunState, timeMs: number): void {
    for (const statId of STAT_IDS) {
      this.bars[statId].setValue(state.stats[statId], timeMs);
    }
    this.solLabel.setText(t('hud.sol', { current: state.sol, total: RUN_BALANCE.solsPerRun }));
  }
}
