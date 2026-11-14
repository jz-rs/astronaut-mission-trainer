import Phaser from 'phaser';
import { RUN_BALANCE } from '../../config/balance';
import { t } from '../../i18n';
import { GAME_HEIGHT, GAME_WIDTH } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addText } from '../../ui/text';
import { SCENE_KEYS } from '../sceneKeys';

/** Skeleton (spec 02): only proves navigation. The real base comes with spec 04. */
export class BaseScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.base);
  }

  create(): void {
    const sol = t('hud.sol', { current: 1, total: RUN_BALANCE.solsPerRun });
    addText(this, GAME_WIDTH / 2, GAME_HEIGHT / 3, sol);
    addText(this, GAME_WIDTH / 2, (GAME_HEIGHT * 2) / 3, '▶', { color: PALETTE.cyan })
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start(SCENE_KEYS.result));
  }
}
