import Phaser from 'phaser';
import type { RunResult } from '../core/scoring';
import type { RunStatus } from '../core/types';
import { t } from '../i18n';
import { createButton } from '../ui/Button';
import { COLORS, PALETTE } from '../ui/palette';
import { GAME_WIDTH } from '../ui/layout';
import { textStyle } from '../ui/textStyles';
import { SCENE_KEYS } from './sceneKeys';

export interface ResultSceneData {
  result: RunResult;
  status: RunStatus;
  locationId: string;
}

/** End of run: stars first (understood without reading), then score, then two big buttons. */
export class ResultScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.result });
  }

  create({ result, status, locationId }: ResultSceneData): void {
    const centerX = GAME_WIDTH / 2;
    this.cameras.main.setBackgroundColor(COLORS.background);

    const titleKey = status === 'survived' ? 'result.survived' : 'result.evacuated';
    this.add.text(centerX, 60, t(titleKey), textStyle('large')).setOrigin(0.5);
    this.drawStars(centerX, 130, Object.values(result.stars));
    this.add
      .text(
        centerX,
        200,
        t('result.score', { score: result.score }),
        textStyle('normal', COLORS.energy),
      )
      .setOrigin(0.5);

    createButton(this, {
      x: centerX - 100,
      y: 290,
      label: `🔁 ${t('result.retry')}`,
      color: PALETTE.mars,
      onPress: () => this.scene.start(SCENE_KEYS.base, { locationId }),
    });
    createButton(this, {
      x: centerX + 100,
      y: 290,
      label: t('result.menu'),
      onPress: () => this.scene.start(SCENE_KEYS.menu),
    });
  }

  private drawStars(centerX: number, y: number, earned: boolean[]): void {
    const spacing = 64;
    earned.forEach((isEarned, index) => {
      const x = centerX + (index - (earned.length - 1) / 2) * spacing;
      this.add
        .text(x, y, isEarned ? '⭐' : '☆', { fontSize: '40px' })
        .setOrigin(0.5)
        .setAlpha(isEarned ? 1 : 0.4);
    });
  }
}
