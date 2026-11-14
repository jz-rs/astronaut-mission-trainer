import Phaser from 'phaser';
import { TASK_BALANCE } from '../../config/balance';
import { BOT_IDS } from '../../core/run';
import type { CrewMember, RunState } from '../../core/types';
import { t } from '../../i18n';
import { astronautFrameKey, CREW_SUIT_COLORS } from '../../ui/astronautFrames';
import { floatText } from '../../ui/floatingText';
import { FONT_SIZE, GAME_WIDTH } from '../../ui/layout';
import { cssColor, PALETTE } from '../../ui/palette';
import { addSpriteSized, STAT_ICON_SPRITES } from '../../ui/sprites';
import { addText } from '../../ui/text';

/**
 * Spec 05 — One card per bot in the HUD corner, made for kids of 7: the bot itself (same suit
 * color as on the map), its mode in big colored letters and an icon of what it is doing.
 *   AUTO (green): it chooses and works by itself.   MANUAL (yellow): it waits for your order.
 * Tapping the card switches between the two; the card answers with a line or by blinking.
 */
const CARD_START_X = 400;
const CARD_SPACING = 79;
const CARD_WIDTH = 76;
const CARD_HEIGHT = 36;
const CARD_Y = 4;
const BOT_HEIGHT = 30;
const BOT_OFFSET_X = 12;
const INFO_X = 49;
const MODE_Y = 12;
const DOING_Y = 26;
const DOING_ICON_SIZE = 12;
const BLINK_PERIOD_MS = 300;
const CARD_ALPHA = 0.9;
const TOAST_DROP = 30;
const TOAST_DEPTH = 40;
const EDGE_MARGIN = 4;

/** Bottom middle of the 3 cards, so the tutorial can point at them. */
export const BOT_FACES_CENTER = {
  x: CARD_START_X + CARD_SPACING + CARD_WIDTH / 2,
  y: CARD_Y + CARD_HEIGHT - 6,
};

interface BotCard {
  x: number;
  frame: Phaser.GameObjects.Graphics;
  mode: Phaser.GameObjects.Text;
  doingIcon: Phaser.GameObjects.Image;
  waiting: Phaser.GameObjects.Text;
  wasAuto: boolean | null;
}

export class BotFaces {
  private readonly cards = new Map<string, BotCard>();
  private selectedBotId: string | null = null;

  constructor(
    private readonly scene: Phaser.Scene,
    onToggleAuto: (botId: string) => void,
  ) {
    BOT_IDS.forEach((botId, index) => {
      const x = CARD_START_X + index * CARD_SPACING;
      this.cards.set(botId, this.createCard(botId, x, onToggleAuto));
    });
  }

  update(state: RunState): void {
    const blinkOn = Math.floor(this.scene.time.now / BLINK_PERIOD_MS) % 2 === 0;
    for (const member of state.crew) {
      const card = this.cards.get(member.id);
      if (!card) continue;
      this.showMode(card, member);
      this.showDoing(card, member);
      const isSelected = member.id === this.selectedBotId;
      this.drawFrame(card, member.autoMode, isSelected && blinkOn);
    }
  }

  highlight(selectedBotId: string | null): void {
    this.selectedBotId = selectedBotId;
  }

  private showMode(card: BotCard, member: CrewMember): void {
    card.mode.setText(t(member.autoMode ? 'hud.auto' : 'hud.manual'));
    card.mode.setColor(cssColor(modeColor(member.autoMode)));
    // Switching to AUTO gets an answer right there; switching to MANUAL opens "Which room?".
    if (card.wasAuto === false && member.autoMode) this.sayWorksAlone(card);
    card.wasAuto = member.autoMode;
  }

  /** Under the HUD and above the room cards, kept inside the screen on the right edge. */
  private sayWorksAlone(card: BotCard): void {
    const y = CARD_Y + CARD_HEIGHT + TOAST_DROP;
    const text = floatText(this.scene, 0, y, t('hud.botNowAlone'), PALETTE.green);
    const cardCenter = card.x + CARD_WIDTH / 2;
    text
      .setX(Math.min(cardCenter, GAME_WIDTH - text.width / 2 - EDGE_MARGIN))
      .setDepth(TOAST_DEPTH);
  }

  /** The icon of the room it works in, or "?" while it waits for your order. */
  private showDoing(card: BotCard, member: CrewMember): void {
    const taskId = member.task?.taskId;
    if (taskId) card.doingIcon.setTexture(STAT_ICON_SPRITES[TASK_BALANCE[taskId].stat]);
    card.doingIcon.setVisible(Boolean(taskId));
    card.waiting.setVisible(!taskId && !member.autoMode);
  }

  private drawFrame(card: BotCard, isAuto: boolean, highlighted: boolean): void {
    const color = highlighted ? PALETTE.white : modeColor(isAuto);
    card.frame.clear();
    card.frame
      .fillStyle(PALETTE.space, CARD_ALPHA)
      .fillRect(card.x, CARD_Y, CARD_WIDTH, CARD_HEIGHT);
    card.frame.lineStyle(2, color, 1).strokeRect(card.x, CARD_Y, CARD_WIDTH, CARD_HEIGHT);
  }

  private createCard(botId: string, x: number, onToggleAuto: (botId: string) => void): BotCard {
    const frame = this.scene.add.graphics();
    const suit = CREW_SUIT_COLORS[botId] ?? 'red';
    const bot = this.scene.add.image(
      x + BOT_OFFSET_X,
      CARD_Y + CARD_HEIGHT / 2,
      astronautFrameKey(suit, 'front'),
    );
    bot.setScale(BOT_HEIGHT / bot.height);
    const mode = addText(this.scene, x + INFO_X, CARD_Y + MODE_Y, '', { size: FONT_SIZE.small });
    const doingIcon = addSpriteSized(
      this.scene,
      x + INFO_X,
      CARD_Y + DOING_Y,
      'iconEnergy',
      DOING_ICON_SIZE,
    );
    const waiting = addText(this.scene, x + INFO_X, CARD_Y + DOING_Y, '?', {
      size: FONT_SIZE.small,
      color: PALETTE.sun,
    });
    const zone = this.scene.add.zone(
      x + CARD_WIDTH / 2,
      CARD_Y + CARD_HEIGHT / 2,
      CARD_WIDTH,
      CARD_HEIGHT + 8,
    );
    zone.setInteractive({ useHandCursor: true }).on('pointerup', () => onToggleAuto(botId));
    return { x, frame, mode, doingIcon, waiting, wasAuto: null };
  }
}

function modeColor(isAuto: boolean): number {
  return isAuto ? PALETTE.green : PALETTE.sun;
}
