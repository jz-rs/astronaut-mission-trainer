import Phaser from 'phaser';
import { TASK_BALANCE } from '../../config/balance';
import type { RunState, StatId, TaskNews } from '../../core/types';
import { FONT_SIZE, ROOM_LAYOUTS, type Point } from '../../ui/layout';
import { PALETTE, STAT_COLORS } from '../../ui/palette';
import { addSpriteSized, STAT_ICON_SPRITES } from '../../ui/sprites';
import { addText } from '../../ui/text';
import { statBarCenter, type Hud } from './Hud';

/**
 * The heart of the lesson: every decision changes the bars. When anyone finishes a task,
 * "+30 💨" flies from the room to its bar and "−10 ⚡" to the energy bar, and both bars glow.
 * It only reads `state.taskNews`.
 */
const ICON_SIZE = 14;
const ICON_GAP = 10;
const FLY_MS = 900;
const ENERGY_DELAY_MS = 300;
const DEPTH = 45;

export class TaskEffectsView {
  private shownCount = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly hud: Hud,
  ) {}

  /** Calls `onShown` for every new task effect, after it started flying. */
  update(state: RunState, onShown: (news: TaskNews) => void): void {
    while (this.shownCount < state.taskNews.length) {
      const news = state.taskNews[this.shownCount];
      this.shownCount += 1;
      if (!news) continue;
      this.show(news);
      onShown(news);
    }
  }

  private show(news: TaskNews): void {
    const stat = TASK_BALANCE[news.taskId].stat;
    const from = ROOM_LAYOUTS[news.taskId].label;
    if (Math.round(news.gained) > 0) this.fly(stat, `+${Math.round(news.gained)}`, from, 0);
    if (Math.round(news.spent) > 0) {
      this.fly('energy', `-${Math.round(news.spent)}`, from, ENERGY_DELAY_MS);
    }
  }

  private fly(stat: StatId, amount: string, from: Point, delayMs: number): void {
    const text = addText(this.scene, 0, 0, amount, {
      size: FONT_SIZE.medium,
      color: amount.startsWith('+') ? STAT_COLORS[stat] : PALETTE.alert,
    });
    const icon = addSpriteSized(this.scene, 0, 0, STAT_ICON_SPRITES[stat], ICON_SIZE);
    icon.setX(text.width / 2 + ICON_GAP);
    const badge = this.scene.add.container(from.x, from.y, [text, icon]).setDepth(DEPTH);
    const target = statBarCenter(stat);
    this.scene.tweens.chain({
      targets: badge,
      tweens: [
        { scale: 1.4, duration: 200, delay: delayMs, ease: 'Back.Out' },
        { x: target.x, y: target.y, scale: 0.6, duration: FLY_MS, ease: 'Cubic.In' },
      ],
      onComplete: () => {
        badge.destroy();
        this.hud.flash(this.scene, stat);
      },
    });
  }
}
