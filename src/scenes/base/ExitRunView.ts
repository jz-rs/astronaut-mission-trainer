import Phaser from 'phaser';
import { t } from '../../i18n';
import { createButton } from '../../ui/Button';
import { addBackButton } from '../../ui/backButton';
import { BASE_BACK_BUTTON, FONT_SIZE, GAME_HEIGHT, GAME_WIDTH, type Rect } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { drawTechPanel } from '../../ui/techFrame';
import { addText } from '../../ui/text';

/**
 * The dark "◀ BACK" button in the top-left corner of the base: leave the run and go back to the ship.
 * It asks first ("Leave the run?" LEAVE / KEEP PLAYING) and the base waits meanwhile,
 * so a kid who taps it by accident loses nothing.
 */
const CARD: Rect = { x: GAME_WIDTH / 2 - 160, y: 110, width: 320, height: 140 };
const BUTTON_OFFSET_X = 76;
const BUTTON_WIDTH = 132;
const BUTTON_HEIGHT = 48;
const DIM_ALPHA = 0.7;
const DEPTH = 70;

export class ExitRunView {
  private card: Phaser.GameObjects.Container | null = null;

  /**
   * @param canAsk false while something else is on top (a minigame, the rover), so the button
   *               never opens a question hidden behind it.
   */
  constructor(
    private readonly scene: Phaser.Scene,
    canAsk: () => boolean,
    private readonly onLeave: () => void,
  ) {
    addBackButton(scene, BASE_BACK_BUTTON, 'dark', () => {
      if (canAsk() && !this.card) this.card = this.createCard();
    });
  }

  /** The base waits while the question is on screen. */
  get isAsking(): boolean {
    return this.card !== null;
  }

  private close(): void {
    this.card?.destroy();
    this.card = null;
  }

  private createCard(): Phaser.GameObjects.Container {
    const dim = this.scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, PALETTE.night, DIM_ALPHA);
    dim.setOrigin(0).setInteractive(); // nothing behind can be tapped while asking
    const panel = this.scene.add.graphics();
    drawTechPanel(panel, CARD, PALETTE.alert);
    const centerX = CARD.x + CARD.width / 2;
    const question = addText(this.scene, centerX, CARD.y + 36, t('exitRun.question'), {
      color: PALETTE.white,
    });
    const buttonY = CARD.y + CARD.height - BUTTON_HEIGHT / 2 - 20;
    const leave = this.addButton(
      centerX - BUTTON_OFFSET_X,
      buttonY,
      'exitRun.leave',
      PALETTE.alert,
      () => this.onLeave(),
    );
    const stay = this.addButton(
      centerX + BUTTON_OFFSET_X,
      buttonY,
      'exitRun.stay',
      PALETTE.green,
      () => this.close(),
    );
    return this.scene.add.container(0, 0, [dim, panel, question, leave, stay]).setDepth(DEPTH);
  }

  private addButton(
    x: number,
    y: number,
    labelKey: 'exitRun.leave' | 'exitRun.stay',
    color: number,
    onPress: () => void,
  ): Phaser.GameObjects.Container {
    return createButton(this.scene, {
      x,
      y,
      width: BUTTON_WIDTH,
      height: BUTTON_HEIGHT,
      label: t(labelKey),
      fontSize: FONT_SIZE.small,
      color,
      onPress,
    });
  }
}
