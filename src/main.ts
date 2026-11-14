import Phaser from 'phaser';
import { setLanguage } from './i18n';
import { MINIGAME_SCENES } from './minigames/registry';
import { BaseScene } from './scenes/base/BaseScene';
import { MenuScene } from './scenes/MenuScene';
import { ResultScene } from './scenes/ResultScene';
import { loadProgress } from './services/progressStorage';
import { COLORS } from './ui/palette';
import { GAME_HEIGHT, GAME_WIDTH } from './ui/layout';
import { installRotateOverlay } from './ui/screen';

async function startGame(): Promise<void> {
  setLanguage(loadProgress().language);
  installRotateOverlay();
  // Wait for the pixel font, otherwise the first texts render with the fallback font.
  await document.fonts.ready;

  new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: COLORS.background,
    pixelArt: true,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    input: { activePointers: 2 },
    scene: [MenuScene, BaseScene, ResultScene, ...MINIGAME_SCENES],
  });
}

void startGame();
