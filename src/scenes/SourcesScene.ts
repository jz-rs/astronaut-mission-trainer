import Phaser from 'phaser';
import { SOURCE_LINKS, type SourceLink } from '../content/sources';
import { t } from '../i18n';
import { createButton } from '../ui/Button';
import { FONT_SIZE, GAME_WIDTH } from '../ui/layout';
import { PALETTE } from '../ui/palette';
import { addScanlines, drawStarfield } from '../ui/techFrame';
import { addText } from '../ui/text';
import { SCENE_KEYS } from './sceneKeys';

/**
 * Spec 13 — Sources screen: every real fact in the game comes from one of these pages.
 * It is the only screen allowed to have more than one line of text.
 */
const CENTER_X = GAME_WIDTH / 2;
const FIRST_LINK_Y = 82;
const LINK_SPACING = 24;

export class SourcesScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.sources);
  }

  create(): void {
    drawStarfield(this, 60);
    addText(this, CENTER_X, 28, t('sources.title'), { size: FONT_SIZE.medium, color: PALETTE.sun });
    addText(this, CENTER_X, 52, t('sources.hint'), { size: FONT_SIZE.small, color: PALETTE.cyan });
    SOURCE_LINKS.forEach((link, index) => this.addLink(link, FIRST_LINK_Y + index * LINK_SPACING));
    createButton(this, {
      x: 72,
      y: 328,
      width: 112,
      height: 40,
      label: t('sources.back'),
      fontSize: FONT_SIZE.small,
      color: PALETTE.metalLight,
      onPress: () => this.scene.start(SCENE_KEYS.menu),
    });
    addScanlines(this);
  }

  private addLink(link: SourceLink, y: number): void {
    addText(this, CENTER_X, y, `🔗 ${link.label}`, {
      size: FONT_SIZE.small,
      color: PALETTE.white,
    });
    const row = this.add.zone(CENTER_X, y, GAME_WIDTH - 40, LINK_SPACING);
    row.setInteractive({ useHandCursor: true });
    row.on('pointerup', () => window.open(link.url, '_blank', 'noopener'));
  }
}
