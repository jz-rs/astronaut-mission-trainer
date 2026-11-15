import Phaser from 'phaser';
import { SOURCE_LINKS } from '../content/sources';
import { t } from '../i18n';
import { createButton } from '../ui/Button';
import { FONT_SIZE, GAME_WIDTH } from '../ui/layout';
import { PALETTE } from '../ui/palette';
import { addScanlines, drawStarfield } from '../ui/techFrame';
import { addText } from '../ui/text';
import { SCENE_KEYS } from './sceneKeys';
import { addSourceList } from './sourcesList';

/**
 * Spec 13 — Sources screen: every real fact in the game comes from one of these pages.
 * It is the only screen allowed to have more than one line of text. The list scrolls
 * (sourcesList.ts), so every source fits: facts, photos, music and sounds.
 */
const CENTER_X = GAME_WIDTH / 2;

export class SourcesScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.sources);
  }

  create(): void {
    drawStarfield(this, 60);
    addText(this, CENTER_X, 28, t('sources.title'), { size: FONT_SIZE.medium, color: PALETTE.sun });
    addText(this, CENTER_X, 52, t('sources.hint'), { size: FONT_SIZE.small, color: PALETTE.cyan });
    addSourceList(this, SOURCE_LINKS);
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
}
