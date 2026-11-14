import Phaser from 'phaser';
import { t } from '../../i18n';
import { COLORS } from '../../ui/palette';
import { textStyle } from '../../ui/textStyles';
import { ROOM_HEIGHT, ROOM_WIDTH, type RoomLayout } from './rooms';

const LOW_STAT_THRESHOLD = 30;

/** A tappable room. It pulses when its stat is low so kids know where to go without reading. */
export class RoomView {
  private readonly border: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    readonly layout: RoomLayout,
    onTap: (room: RoomLayout) => void,
  ) {
    this.border = scene.add
      .rectangle(layout.x, layout.y, ROOM_WIDTH, ROOM_HEIGHT, COLORS.panel)
      .setStrokeStyle(3, layout.color)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => onTap(layout));

    scene.add.text(layout.x, layout.y - 18, layout.icon, { fontSize: '32px' }).setOrigin(0.5);
    const name = t(`task.${layout.taskId}.name`);
    scene.add
      .text(layout.x, layout.y + 40, name, textStyle('small', COLORS.textMuted))
      .setOrigin(0.5);
  }

  /** @param statValue current value (0-100) of the stat this room fills */
  refresh(statValue: number, timeMs: number): void {
    const isLow = statValue < LOW_STAT_THRESHOLD;
    const pulse = isLow ? 0.5 + 0.5 * Math.sin(timeMs / 150) : 0;
    this.border.setStrokeStyle(3 + pulse * 3, isLow ? COLORS.danger : this.layout.color);
  }
}
