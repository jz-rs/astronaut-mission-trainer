import Phaser from 'phaser';
import { getLanguage, setLanguage, t, type Language } from '../i18n';
import { loadProgress, saveProgress } from '../services/progressStorage';
import { createButton } from '../ui/Button';
import { astronautFrameKey } from '../ui/astronautFrames';
import { ASTRONAUT_SCALE, FONT_SIZE, GAME_WIDTH } from '../ui/layout';
import { PALETTE } from '../ui/palette';
import {
  enterFullscreenLandscape,
  setUpPhoneControls,
  showHomeScreenHint,
  updateRotateMessage,
} from '../ui/screen';
import { SPRITE_SCALE } from '../ui/sprites';
import { addScanlines } from '../ui/techFrame';
import { addText } from '../ui/text';
import { SCENE_KEYS } from './sceneKeys';

/**
 * Spec 11 — Start screen: title over the base on Mars, ONE giant PLAY button, ES/EN.
 * From opening the link to playing: one tap.
 */
const LANGUAGES: readonly Language[] = ['es', 'en'];
const TITLE_BAND = { y: 46, height: 96, alpha: 0.75 } as const;
/** The 2-line title and the subtitle sit inside the band, with air above and below. */
const TITLE_Y = TITLE_BAND.y + 36;
const SUBTITLE_Y = TITLE_BAND.y + TITLE_BAND.height - 16;
const CENTER_X = GAME_WIDTH / 2;

export class MenuScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.menu);
  }

  create(): void {
    this.drawBackground();
    this.drawFloatingAstronaut();
    addText(this, CENTER_X, TITLE_Y, t('menu.title'), {
      size: FONT_SIZE.large,
      color: PALETTE.white,
    });
    addText(this, CENTER_X, SUBTITLE_Y, t('menu.subtitle'), {
      size: FONT_SIZE.small,
      color: PALETTE.cyan,
    });
    const play = createButton(this, {
      x: CENTER_X,
      y: 210,
      width: 240,
      height: 72,
      label: `▶ ${t('menu.play')}`,
      fontSize: FONT_SIZE.title,
      color: PALETTE.cyan,
      onPress: () => this.startGame(),
    });
    this.tweens.add({ targets: play, scale: 1.05, yoyo: true, repeat: -1, duration: 600 });
    this.createLanguageButtons();
    this.createSourcesButton();
    addScanlines(this);
    this.showPhoneControls();
  }

  /** The first screen wires the fullscreen button; the iPhone hint lives only on this screen. */
  private showPhoneControls(): void {
    setUpPhoneControls();
    showHomeScreenHint(true);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => showHomeScreenHint(false));
  }

  private startGame(): void {
    void enterFullscreenLandscape();
    this.scene.start(SCENE_KEYS.cabin);
  }

  /** The base on Mars fills the screen; a dark band keeps the title readable on top of it. */
  private drawBackground(): void {
    this.add.image(0, 0, 'menuBackground').setOrigin(0).setScale(SPRITE_SCALE);
    this.add
      .rectangle(0, TITLE_BAND.y, GAME_WIDTH, TITLE_BAND.height, PALETTE.night)
      .setOrigin(0)
      .setAlpha(TITLE_BAND.alpha);
  }

  private drawFloatingAstronaut(): void {
    const astronaut = this.add
      .image(96, 220, astronautFrameKey('violet', 'front'))
      .setScale(ASTRONAUT_SCALE * 2)
      .setAngle(-12);
    this.tweens.add({
      targets: astronaut,
      y: 200,
      angle: 8,
      yoyo: true,
      repeat: -1,
      duration: 1800,
      ease: 'Sine.InOut',
    });
  }

  private createLanguageButtons(): void {
    LANGUAGES.forEach((language, index) => {
      const isCurrent = language === getLanguage();
      createButton(this, {
        x: 40 + index * 60,
        y: 330,
        width: 52,
        height: 36,
        label: language.toUpperCase(),
        fontSize: FONT_SIZE.small,
        color: isCurrent ? PALETTE.sun : PALETTE.metal,
        onPress: () => this.changeLanguage(language),
      });
    });
  }

  private createSourcesButton(): void {
    createButton(this, {
      x: 572,
      y: 330,
      width: 112,
      height: 36,
      label: `📚 ${t('menu.sources')}`,
      fontSize: FONT_SIZE.small,
      color: PALETTE.metal,
      onPress: () => this.scene.start(SCENE_KEYS.sources),
    });
  }

  private changeLanguage(language: Language): void {
    setLanguage(language);
    saveProgress({ ...loadProgress(), language });
    updateRotateMessage();
    this.scene.restart();
  }
}
