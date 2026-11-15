import Phaser from 'phaser';
import { createWalkAnimations } from '../ui/astronautFrames';
import { preloadMusic, startBackgroundMusic } from '../ui/backgroundMusic';
import { GAME_HEIGHT, GAME_WIDTH } from '../ui/layout';
import { PALETTE } from '../ui/palette';
import { preloadSprites, prepareSprites } from '../ui/sprites';
import { SCENE_KEYS } from './sceneKeys';

/**
 * Loads the whole art kit and the music once, with a progress bar, so no other scene has to
 * wait. Then the music starts (after the first tap) and it opens the start screen.
 */
const BAR_WIDTH = 240;
const BAR_HEIGHT = 12;
const BAR_BORDER = 2;

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.boot);
  }

  preload(): void {
    this.showProgressBar();
    preloadSprites(this.load);
    preloadMusic(this.load);
  }

  create(): void {
    prepareSprites(this.textures);
    createWalkAnimations(this.anims);
    startBackgroundMusic(this.game);
    this.scene.start(SCENE_KEYS.menu);
  }

  private showProgressBar(): void {
    const left = (GAME_WIDTH - BAR_WIDTH) / 2;
    const top = (GAME_HEIGHT - BAR_HEIGHT) / 2;
    const frame = this.add.graphics();
    frame
      .fillStyle(PALETTE.metal, 1)
      .fillRect(
        left - BAR_BORDER,
        top - BAR_BORDER,
        BAR_WIDTH + BAR_BORDER * 2,
        BAR_HEIGHT + BAR_BORDER * 2,
      );
    frame.fillStyle(PALETTE.night, 1).fillRect(left, top, BAR_WIDTH, BAR_HEIGHT);
    const fill = this.add.graphics();
    this.load.on('progress', (fraction: number) => {
      fill
        .clear()
        .fillStyle(PALETTE.cyan, 1)
        .fillRect(left, top, BAR_WIDTH * fraction, BAR_HEIGHT);
    });
  }
}
