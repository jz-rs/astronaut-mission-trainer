import Phaser from 'phaser';
import { setLanguage } from './i18n';
import { MINIGAME_SCENES } from './minigames/registry';
import { RoverExpeditionScene } from './minigames/rover/RoverExpeditionScene';
import { BaseScene } from './scenes/base/BaseScene';
import { BootScene } from './scenes/BootScene';
import { CabinScene } from './scenes/cabin/CabinScene';
import { LandingScene } from './scenes/landing/LandingScene';
import { ManualScene } from './scenes/manual/ManualScene';
import { MarsMapScene } from './scenes/map/MarsMapScene';
import { MenuScene } from './scenes/MenuScene';
import { MonitorScene } from './scenes/monitor/MonitorScene';
import { ResultScene } from './scenes/ResultScene';
import { SourcesScene } from './scenes/SourcesScene';
import { loadProgress } from './services/progressStorage';
import { FONT_FAMILY, FONT_SIZE, GAME_HEIGHT, GAME_WIDTH } from './ui/layout';
import { cssColor, PALETTE } from './ui/palette';
import { applyPageColors, updateRotateMessage } from './ui/screen';

/** Every scene of the game; the first one listed starts first. */
const SCENES = [
  BootScene,
  MenuScene,
  BaseScene,
  ResultScene,
  SourcesScene,
  MarsMapScene,
  CabinScene,
  ManualScene,
  MonitorScene,
  LandingScene,
  RoverExpeditionScene,
  ...MINIGAME_SCENES,
];

/** Game entry point: 640×360 pixel art, scaled to fill the phone screen in landscape. */
async function startGame(): Promise<void> {
  setLanguage(loadProgress().language);
  applyPageColors();
  updateRotateMessage();
  await waitForPixelFont();

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: cssColor(PALETTE.night),
    pixelArt: true,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    input: { activePointers: 2 },
    scene: SCENES,
  });
  // Only while developing: lets the browser console inspect the game (window.game).
  if (import.meta.env.DEV) Object.assign(window, { game });
}

/** Otherwise the first texts are drawn with the fallback font. Offline, we just go on. */
async function waitForPixelFont(): Promise<void> {
  try {
    await document.fonts.load(`${FONT_SIZE.medium}px ${FONT_FAMILY}`);
  } catch {
    // Font unavailable: the monospace fallback is used.
  }
}

void startGame();
