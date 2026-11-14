import Phaser from 'phaser';
import { TASK_BALANCE } from '../../config/balance';
import type { GameSession } from '../../core/GameSession';
import { PLAYER_ID } from '../../core/run';
import type { CrisisMeeting, RunState, TaskId } from '../../core/types';
import { t } from '../../i18n';
import { createButton } from '../../ui/Button';
import { floatText } from '../../ui/floatingText';
import { FONT_SIZE, GAME_WIDTH, MINIGAME_PANEL, STAT_ICONS } from '../../ui/layout';
import { CREW_COLORS, PALETTE, STAT_COLORS } from '../../ui/palette';
import { drawTechPanel } from '../../ui/techFrame';
import { addText } from '../../ui/text';

/**
 * Spec 16 — Crisis meeting, like an Among Us emergency meeting: 2 big options with icons,
 * a countdown, and a colored dot for each crew vote. The base is paused meanwhile.
 */
const DEPTH = 60;
const OPTION_Y = 200;
const OPTION_OFFSET_X = 130;
const VOTE_DOT_RADIUS = 6;

export class MeetingView {
  private container: Phaser.GameObjects.Container | null = null;
  private votes: Phaser.GameObjects.Graphics | null = null;
  private countdown: Phaser.GameObjects.Text | null = null;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly session: GameSession,
  ) {}

  /** Returns true while a meeting is on screen. */
  update(state: RunState): boolean {
    const meeting = state.meeting;
    if (!meeting) {
      if (this.container) this.close(state);
      return false;
    }
    if (!this.container) this.open(meeting);
    this.drawVotes(meeting);
    this.countdown?.setText(`⏱ ${Math.ceil(meeting.remainingMs / 1000)}`);
    return true;
  }

  private open(meeting: CrisisMeeting): void {
    const options = meeting.options.map((taskId, index) =>
      this.createOption(
        taskId,
        GAME_WIDTH / 2 + (index === 0 ? -OPTION_OFFSET_X : OPTION_OFFSET_X),
      ),
    );
    this.votes = this.scene.add.graphics();
    this.container = this.scene.add.container(0, 0, [
      ...this.createFrame(),
      ...options,
      this.votes,
    ]);
    this.container.setDepth(DEPTH);
  }

  private createFrame(): Phaser.GameObjects.GameObject[] {
    const blocker = this.scene.add.zone(0, 0, this.scene.scale.width, this.scene.scale.height);
    blocker.setOrigin(0).setInteractive(); // the base is paused: no taps go through
    const panel = this.scene.add.graphics();
    drawTechPanel(panel, MINIGAME_PANEL, PALETTE.alert);
    const centerX = GAME_WIDTH / 2;
    const title = addText(this.scene, centerX, MINIGAME_PANEL.y + 24, t('collab.meetingTitle'), {
      size: FONT_SIZE.small,
      color: PALETTE.sun,
    });
    this.countdown = addText(this.scene, centerX, MINIGAME_PANEL.y + 60, '', {
      color: PALETTE.white,
    });
    return [blocker, panel, title, this.countdown];
  }

  /** Tells everyone what was decided, in one line. */
  private close(state: RunState): void {
    this.container?.destroy();
    this.container = null;
    if (!state.priority) return;
    const task = t(`task.${state.priority.taskId}.name` as const);
    floatText(
      this.scene,
      GAME_WIDTH / 2,
      MINIGAME_PANEL.y + 120,
      t('collab.priority', { task }),
      PALETTE.sun,
    );
  }

  private createOption(taskId: TaskId, x: number): Phaser.GameObjects.Container {
    const stat = TASK_BALANCE[taskId].stat;
    return createButton(this.scene, {
      x,
      y: OPTION_Y,
      width: 220,
      height: 96,
      label: `${STAT_ICONS[stat]}\n${t(`task.${taskId}.name` as const)}`,
      fontSize: FONT_SIZE.small,
      color: STAT_COLORS[stat],
      onPress: () => this.session.dispatch({ type: 'castVote', crewId: PLAYER_ID, taskId }),
    });
  }

  private drawVotes(meeting: CrisisMeeting): void {
    if (!this.votes) return;
    this.votes.clear();
    meeting.options.forEach((taskId, optionIndex) => {
      const voters = Object.keys(meeting.votes).filter(
        (crewId) => meeting.votes[crewId] === taskId,
      );
      const centerX = GAME_WIDTH / 2 + (optionIndex === 0 ? -OPTION_OFFSET_X : OPTION_OFFSET_X);
      voters.forEach((crewId, index) => {
        this.votes?.fillStyle(CREW_COLORS[crewId] ?? PALETTE.white, 1);
        this.votes?.fillCircle(centerX - 30 + index * 20, OPTION_Y + 70, VOTE_DOT_RADIUS);
      });
    });
  }
}
