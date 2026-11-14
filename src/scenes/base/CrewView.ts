import Phaser from 'phaser';
import { CREW_BALANCE } from '../../config/balance';
import type { CrewMember } from '../../core/types';
import { COLORS } from '../../ui/palette';
import { getRoom, HUB_POSITION } from './rooms';

const WALK_SPEED_PX_PER_MS = 0.12;
const BODY_WIDTH = 14;
const BODY_HEIGHT = 20;
/** Bigger invisible hit area so small fingers can grab a tiny astronaut. */
const TOUCH_PADDING = 16;

/**
 * Placeholder astronaut (a colored block) that walks to the room of its current task.
 * Replace the rectangle with the pixel-art sprite once it exists; the rest stays.
 */
export class CrewView {
  readonly body: Phaser.GameObjects.Rectangle;
  private readonly progressBar: Phaser.GameObjects.Rectangle;
  private readonly hubOffsetX: number;

  constructor(
    scene: Phaser.Scene,
    readonly crewId: string,
    color: number,
    hubOffsetX: number,
  ) {
    this.hubOffsetX = hubOffsetX;
    this.body = scene.add
      .rectangle(HUB_POSITION.x + hubOffsetX, HUB_POSITION.y, BODY_WIDTH, BODY_HEIGHT, color)
      .setStrokeStyle(2, COLORS.text);
    this.body.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(
        -TOUCH_PADDING,
        -TOUCH_PADDING,
        BODY_WIDTH + TOUCH_PADDING * 2,
        BODY_HEIGHT + TOUCH_PADDING * 2,
      ),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true,
    });
    this.progressBar = scene.add
      .rectangle(0, 0, BODY_WIDTH + 10, 4, COLORS.energy)
      .setVisible(false);
  }

  setSelected(isSelected: boolean): void {
    this.body.setStrokeStyle(isSelected ? 4 : 2, isSelected ? COLORS.energy : COLORS.text);
  }

  /** Moves a bot toward where its task is, and shows how much is left. */
  syncWithBot(member: CrewMember, deltaMs: number): void {
    const target = member.task
      ? getRoom(member.task.taskId)
      : { x: HUB_POSITION.x + this.hubOffsetX, y: HUB_POSITION.y };
    this.walkToward(target.x + this.hubOffsetX, target.y, deltaMs);

    this.progressBar.setVisible(member.task !== null);
    if (!member.task) return;
    const progress = 1 - member.task.remainingMs / CREW_BALANCE.botTaskDurationMs;
    this.progressBar.setPosition(this.body.x, this.body.y - 18).setScale(progress, 1);
  }

  /** @returns true when the astronaut arrived */
  walkToward(targetX: number, targetY: number, deltaMs: number): boolean {
    const distance = Phaser.Math.Distance.Between(this.body.x, this.body.y, targetX, targetY);
    const step = WALK_SPEED_PX_PER_MS * deltaMs;
    if (distance <= step) {
      this.body.setPosition(targetX, targetY);
      return true;
    }
    const angle = Phaser.Math.Angle.Between(this.body.x, this.body.y, targetX, targetY);
    this.body.x += Math.cos(angle) * step;
    this.body.y += Math.sin(angle) * step;
    return false;
  }
}
