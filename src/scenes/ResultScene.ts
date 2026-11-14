import Phaser from 'phaser';
import { t } from '../i18n';
import { GAME_HEIGHT, GAME_WIDTH } from '../ui/layout';
import { PALETTE } from '../ui/palette';
import { addText } from '../ui/text';
import { SCENE_KEYS } from './sceneKeys';

/** Skeleton (spec 02): only proves navigation. The real result screen comes with spec 11. */
export class ResultScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.result);
  }

  create(): void {
    addText(this, GAME_WIDTH / 2, GAME_HEIGHT / 3, t('result.survived'));
    addText(this, GAME_WIDTH / 2, (GAME_HEIGHT * 2) / 3, t('result.menu'), { color: PALETTE.cyan })
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start(SCENE_KEYS.menu));
  }
}
