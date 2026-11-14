import Phaser from 'phaser';
import { randomFactKey } from '../content/facts';
import type { RunResult } from '../core/scoring';
import { TASK_IDS, type LocationChallenge, type StatId } from '../core/types';
import { t } from '../i18n';
import { createButton } from '../ui/Button';
import { FONT_SIZE, GAME_WIDTH } from '../ui/layout';
import { PALETTE } from '../ui/palette';
import { drawStar } from '../ui/star';
import { addScanlines, drawStarfield } from '../ui/techFrame';
import { addText } from '../ui/text';
import { describeLostStar } from './resultText';
import { SCENE_KEYS } from './sceneKeys';

/**
 * Spec 11 — Result screen. Stars first (big and animated), then what happened,
 * the score, why a star was lost, a real fact, and RETRY as the most visible button.
 */
export interface ResultSceneData {
  result: RunResult;
  survived: boolean;
  isNewRecord: boolean;
  emptyStat: StatId | null;
  challenge: LocationChallenge;
  samples: number;
  samplesGoal: number;
  locationId: string;
}

const STAR_Y = 64;
const STAR_SPACING = 84;
const STAR_RADIUS = 30;
const STAR_DELAY_MS = 350;
const CENTER_X = GAME_WIDTH / 2;

export class ResultScene extends Phaser.Scene {
  private locationId = '';

  constructor() {
    super(SCENE_KEYS.result);
  }

  create(data: ResultSceneData): void {
    this.locationId = data.locationId;
    drawStarfield(this, 80);
    this.showStars(data.result);
    const titleKey = data.survived ? 'result.survived' : 'result.evacuated';
    addText(this, CENTER_X, 124, t(titleKey), {
      size: FONT_SIZE.medium,
      color: data.survived ? PALETTE.green : PALETTE.alert,
    });
    addText(this, CENTER_X, 150, t('result.score', { score: data.result.score }), {
      color: PALETTE.sand,
    });
    if (data.isNewRecord) this.showNewRecord();
    const reason = describeLostStar({ ...data, stars: data.result.stars });
    addText(this, CENTER_X, 196, reason, { size: FONT_SIZE.small, color: PALETTE.marsLight });
    const fact = t(randomFactKey(Phaser.Utils.Array.GetRandom([...TASK_IDS])));
    addText(this, CENTER_X, 226, fact, {
      size: FONT_SIZE.small,
      color: PALETTE.cyan,
      wrapWidth: 520,
    });
    this.createButtons();
    addScanlines(this);
  }

  private showStars(result: RunResult): void {
    const earned = [
      result.stars.survived,
      result.stars.samplesGoalReached,
      result.stars.challengeCompleted,
    ];
    // Earned stars first, so a kid reads "2 stars" at a glance.
    earned.sort((a, b) => Number(b) - Number(a));
    earned.forEach((isEarned, index) => {
      const star = this.add.graphics({ x: CENTER_X + (index - 1) * STAR_SPACING, y: STAR_Y });
      drawStar(star, STAR_RADIUS, isEarned);
      star.setScale(0);
      this.tweens.add({
        targets: star,
        scale: 1,
        angle: isEarned ? 360 : 0,
        delay: STAR_DELAY_MS * index,
        duration: 400,
        ease: 'Back.Out',
      });
    });
  }

  private showNewRecord(): void {
    const badge = addText(this, CENTER_X, 172, t('result.newRecord'), {
      size: FONT_SIZE.small,
      color: PALETTE.sun,
    });
    this.tweens.add({ targets: badge, alpha: 0.3, yoyo: true, repeat: -1, duration: 400 });
  }

  private createButtons(): void {
    createButton(this, {
      x: CENTER_X,
      y: 296,
      width: 280,
      height: 56,
      label: `↻ ${t('result.retry')}`,
      fontSize: FONT_SIZE.large,
      color: PALETTE.green,
      onPress: () => this.scene.start(SCENE_KEYS.base, { locationId: this.locationId }),
    });
    createButton(this, {
      x: 72,
      y: 328,
      width: 112,
      height: 40,
      label: `🗺️ ${t('result.map')}`,
      fontSize: FONT_SIZE.small,
      color: PALETTE.metalLight,
      onPress: () => this.scene.start(SCENE_KEYS.map),
    });
  }
}
