import Phaser from 'phaser';
import { getLanguage, setLanguage, t, type Language } from '../i18n';
import { loadProgress, saveProgress } from '../services/progressStorage';
import { createButton } from '../ui/Button';
import { ensureAstronautTexture } from '../ui/astronautTexture';
import { ASTRONAUT_SCALE, FONT_SIZE, GAME_WIDTH } from '../ui/layout';
import { CREW_COLORS, PALETTE } from '../ui/palette';
import { enterFullscreenLandscape, updateRotateMessage } from '../ui/screen';
import { addScanlines, drawStarfield } from '../ui/techFrame';
import { addText } from '../ui/text';
import { SCENE_KEYS } from './sceneKeys';

/**
 * Spec 11 — Start screen: title over Mars, ONE giant PLAY button, ES/EN.
 * From opening the link to playing: one tap.
 */
const LANGUAGES: readonly Language[] = ['es', 'en'];
const PLANET = { x: 520, y: 400, radius: 190 } as const;
const CENTER_X = GAME_WIDTH / 2;

export class MenuScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.menu);
  }

  create(): void {
    drawStarfield(this, 120);
    this.drawMars();
    this.drawFloatingAstronaut();
    addText(this, CENTER_X, 70, t('menu.title'), { size: FONT_SIZE.large, color: PALETTE.white });
    addText(this, CENTER_X, 122, t('menu.subtitle'), {
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
  }

  private startGame(): void {
    void enterFullscreenLandscape();
    this.scene.start(SCENE_KEYS.map);
  }

  private drawMars(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(PALETTE.marsDark, 1).fillCircle(PLANET.x, PLANET.y, PLANET.radius + 6);
    graphics.fillStyle(PALETTE.mars, 1).fillCircle(PLANET.x, PLANET.y, PLANET.radius);
    graphics
      .fillStyle(PALETTE.marsLight, 1)
      .fillCircle(PLANET.x - 40, PLANET.y - 60, PLANET.radius - 70);
    graphics
      .fillStyle(PALETTE.mars, 1)
      .fillCircle(PLANET.x - 20, PLANET.y - 40, PLANET.radius - 80);
    for (const [offsetX, offsetY, radius] of [
      [-120, -150, 14],
      [-60, -120, 8],
      [10, -170, 10],
      [-150, -80, 6],
    ]) {
      graphics
        .fillStyle(PALETTE.marsDark, 1)
        .fillCircle(PLANET.x + offsetX, PLANET.y + offsetY, radius);
    }
  }

  private drawFloatingAstronaut(): void {
    const texture = ensureAstronautTexture(this, CREW_COLORS.player ?? PALETTE.violet);
    const astronaut = this.add
      .image(96, 220, texture)
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
