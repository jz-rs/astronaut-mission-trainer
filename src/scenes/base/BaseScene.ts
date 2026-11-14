import Phaser from 'phaser';
import { RUN_BALANCE } from '../../config/balance';
import { getLocation } from '../../content/locations';
import { GameSession } from '../../core/GameSession';
import { t } from '../../i18n';
import { loadProgress } from '../../services/progressStorage';
import { GAME_HEIGHT, GAME_WIDTH } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addText } from '../../ui/text';
import { finishRun } from '../runEnd';
import { SCENE_KEYS } from '../sceneKeys';

/**
 * Skeleton (spec 02): only proves navigation. The real base comes with spec 04.
 * Tapping ▶ ends a real (empty) run, so the result screen of spec 11 gets real data.
 */
export class BaseScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.base);
  }

  create(): void {
    const session = new GameSession(getLocation('jezero'), loadProgress().training);
    const sol = t('hud.sol', { current: 1, total: RUN_BALANCE.solsPerRun });
    addText(this, GAME_WIDTH / 2, GAME_HEIGHT / 3, sol);
    addText(this, GAME_WIDTH / 2, (GAME_HEIGHT * 2) / 3, '▶', { color: PALETTE.cyan })
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => finishRun(this, session));
  }
}
