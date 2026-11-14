import Phaser from 'phaser';
import { TUTORIAL_BALANCE } from '../../config/balance';
import { STAT_IDS, type StatId, type TaskId } from '../../core/types';
import { t } from '../../i18n';
import { loadProgress, saveProgress } from '../../services/progressStorage';
import { createButton } from '../../ui/Button';
import {
  FONT_SIZE,
  GAME_WIDTH,
  MINIGAME_PANEL,
  ROOM_LAYOUTS,
  rectCenter,
  type Point,
} from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addSpriteSized, STAT_ICON_SPRITES } from '../../ui/sprites';
import { drawTechPanel } from '../../ui/techFrame';
import { addText } from '../../ui/text';
import { BOT_FACES_CENTER } from './BotFaces';
import { statBarCenter } from './Hud';
import { addTutorialPointer } from './tutorialPointer';

/**
 * The guided first sol, shown until it is finished once. Learning by doing, never by reading:
 *   1. "You run the base: no bar may reach 0 for 5 sols" (the 4 bar icons, one button).
 *   2. An arrow on a room: "Tap this room!" The base waits until the first tap.
 *   3. After the first minigame, an arrow on the bar that went up: "It went up! But every task uses ⚡".
 *   4. An arrow on the bot faces: "Your robots help on their own too".
 */
type Step = 'intro' | 'tapRoom' | 'playing' | 'explaining' | 'done';

const DEPTH = 60;
/** The oxygen bar drops fastest, so the first room to show is the oxygen factory. */
const FIRST_ROOM: TaskId = 'oxygen-factory';
const ICON_SIZE = 28;
const ICON_SPACING = 56;
/** The arrow under a HUD bar starts a bit below it. */
const BELOW_HUD_PX = 10;
/** Point a bit under the room center, so the line above the arrow doesn't cover the room's sign. */
const ROOM_POINTER_DROP = 24;

export class TutorialGuide {
  private step: Step;
  private card: Phaser.GameObjects.Container | null = null;
  private pointer: Phaser.GameObjects.Container | null = null;

  constructor(private readonly scene: Phaser.Scene) {
    this.step = loadProgress().tutorialDone ? 'done' : 'intro';
    if (this.step === 'intro') this.card = this.createIntroCard();
  }

  /** The base waits while the kid reads the goal and until the first room is tapped. */
  get pausesGame(): boolean {
    return this.step === 'intro' || this.step === 'tapRoom';
  }

  roomTapped(): void {
    if (this.step !== 'tapRoom') return;
    this.step = 'playing';
    this.clearPointer();
  }

  /** Called when the player's own task changed the bars. */
  playerTaskDone(stat: StatId): void {
    if (this.step !== 'playing') return;
    this.step = 'explaining';
    this.showPointer(this.belowHud(statBarCenter(stat).x), t('tutorial.barRose'));
    this.scene.time.delayedCall(TUTORIAL_BALANCE.explainStepMs, () => {
      this.showPointer(this.belowHud(BOT_FACES_CENTER.x), t('tutorial.bots'));
      this.scene.time.delayedCall(TUTORIAL_BALANCE.explainStepMs, () => this.finish());
    });
  }

  private startPointingAtRoom(): void {
    this.card?.destroy();
    this.card = null;
    this.step = 'tapRoom';
    const center = rectCenter(ROOM_LAYOUTS[FIRST_ROOM].rect);
    const target = { x: center.x, y: center.y + ROOM_POINTER_DROP };
    this.pointer = addTutorialPointer(this.scene, target, 'down', t('tutorial.tapRoom'));
  }

  private finish(): void {
    this.clearPointer();
    this.step = 'done';
    saveProgress({ ...loadProgress(), tutorialDone: true });
  }

  private belowHud(x: number): Point {
    return { x, y: statBarCenter('oxygen').y + BELOW_HUD_PX };
  }

  private showPointer(target: Point, message: string): void {
    this.clearPointer();
    this.pointer = addTutorialPointer(this.scene, target, 'up', message);
  }

  private clearPointer(): void {
    this.pointer?.destroy();
    this.pointer = null;
  }

  private createIntroCard(): Phaser.GameObjects.Container {
    const blocker = this.scene.add.zone(0, 0, this.scene.scale.width, this.scene.scale.height);
    blocker.setOrigin(0).setInteractive(); // nothing behind can be tapped yet
    const panel = this.scene.add.graphics();
    drawTechPanel(panel, MINIGAME_PANEL, PALETTE.cyan);
    const centerX = GAME_WIDTH / 2;
    const top = MINIGAME_PANEL.y;
    const title = addText(this.scene, centerX, top + 40, t('tutorial.welcome'), {
      color: PALETTE.sun,
    });
    const goal = addText(this.scene, centerX, top + 150, t('tutorial.goal'), {
      size: FONT_SIZE.small,
      wrapWidth: MINIGAME_PANEL.width - 60,
    });
    const button = createButton(this.scene, {
      x: centerX,
      y: top + 230,
      width: 220,
      height: 56,
      label: t('tutorial.go'),
      fontSize: FONT_SIZE.large,
      color: PALETTE.green,
      onPress: () => this.startPointingAtRoom(),
    });
    const card = this.scene.add.container(0, 0, [
      blocker,
      panel,
      title,
      ...this.statIcons(top + 95),
      goal,
      button,
    ]);
    return card.setDepth(DEPTH);
  }

  /** The 4 bars the kid must protect, big and in a row. */
  private statIcons(y: number): Phaser.GameObjects.Image[] {
    const firstX = GAME_WIDTH / 2 - (ICON_SPACING * (STAT_IDS.length - 1)) / 2;
    return STAT_IDS.map((statId, index) =>
      addSpriteSized(
        this.scene,
        firstX + index * ICON_SPACING,
        y,
        STAT_ICON_SPRITES[statId],
        ICON_SIZE,
      ),
    );
  }
}
