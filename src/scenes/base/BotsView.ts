import Phaser from 'phaser';
import { CREW_BALANCE } from '../../config/balance';
import { BOT_IDS } from '../../core/run';
import type { CrewMember, RunState, TaskId } from '../../core/types';
import { BOT_IDLE_SPOTS, type Point } from '../../ui/layout';
import { CREW_SUIT_COLORS } from '../../ui/astronautFrames';
import { PALETTE } from '../../ui/palette';
import { AstronautSprite, type WalkTarget } from './AstronautSprite';

/**
 * Spec 05 — Draws the 3 bots. It only READS the run state: when a bot's task changes,
 * its sprite walks to the room (or back to the corridor) and shows a progress bar while working.
 * Tapping a bot on MANUAL (in the corridor or at work) selects it, so the next tapped room
 * becomes its order. A bot on AUTO lets the tap through to its room.
 */
const PROGRESS_WIDTH = 28;
/**
 * Under the feet (astronauts are drawn from their feet up): above the helmet it ran into
 * the room cards and their bars.
 */
const PROGRESS_OFFSET_Y = 4;

interface BotSprite {
  astronaut: AstronautSprite;
  ring: Phaser.GameObjects.Graphics;
  progress: Phaser.GameObjects.Graphics;
  shownTask: TaskId | null;
}

export class BotsView {
  private readonly bots = new Map<string, BotSprite>();

  constructor(
    private readonly scene: Phaser.Scene,
    crew: CrewMember[],
    private readonly getWorkSpot: (taskId: TaskId, crewId: string) => WalkTarget,
    onBotTap: (botId: string) => void,
  ) {
    for (const member of crew) {
      if (!member.isBot) continue;
      const bot = this.createBot(member.id);
      bot.astronaut.image.on('pointerup', () => onBotTap(member.id));
      this.bots.set(member.id, bot);
    }
  }

  update(state: RunState, selectedBotId: string | null): void {
    for (const member of state.crew) {
      const bot = this.bots.get(member.id);
      if (!bot) continue;
      const { image } = bot.astronaut;
      bot.ring.setVisible(member.id === selectedBotId).setPosition(image.x, image.y);
      // Bots on AUTO decide alone: they are not tappable, so a tap on their room reaches the room.
      if (image.input) image.input.enabled = !member.autoMode;
      this.followTask(member, bot);
      this.drawProgress(member, bot);
    }
  }

  private followTask(member: CrewMember, bot: BotSprite): void {
    const taskId = member.task?.taskId ?? null;
    if (taskId === bot.shownTask) return;
    bot.shownTask = taskId;
    const target = taskId
      ? this.getWorkSpot(taskId, member.id)
      : { spot: this.idleSpot(member.id), door: null };
    bot.astronaut.walkTo(target);
  }

  private drawProgress(member: CrewMember, bot: BotSprite): void {
    bot.progress.clear();
    if (!member.task || bot.astronaut.isWalking) return;
    const done = 1 - member.task.remainingMs / CREW_BALANCE.botTaskDurationMs;
    const x = bot.astronaut.image.x - PROGRESS_WIDTH / 2;
    const y = bot.astronaut.image.y + PROGRESS_OFFSET_Y;
    bot.progress.fillStyle(PALETTE.night, 1).fillRect(x - 1, y - 1, PROGRESS_WIDTH + 2, 6);
    bot.progress.fillStyle(PALETTE.cyan, 1).fillRect(x, y, PROGRESS_WIDTH * done, 4);
  }

  private idleSpot(botId: string): Point {
    const index = (BOT_IDS as readonly string[]).indexOf(botId);
    return BOT_IDLE_SPOTS[Math.max(0, index)] ?? BOT_IDLE_SPOTS[0];
  }

  private createBot(botId: string): BotSprite {
    const ring = this.scene.add.graphics().setVisible(false);
    ring.lineStyle(2, PALETTE.white, 1).strokeEllipse(0, 0, 34, 12); // around the feet
    const color = CREW_SUIT_COLORS[botId] ?? 'red';
    const astronaut = new AstronautSprite(this.scene, this.idleSpot(botId), color);
    makeTappable(astronaut.image);
    const progress = this.scene.add.graphics().setDepth(1);
    return { astronaut, ring, progress, shownTask: null };
  }
}

/**
 * Only the astronaut's own body is tappable (not an enlarged square): a MANUAL bot working in a
 * room can be tapped to give it a new order, and the rest of the room still opens the minigame.
 */
function makeTappable(image: Phaser.GameObjects.Sprite): void {
  image.setInteractive({ useHandCursor: true });
}
