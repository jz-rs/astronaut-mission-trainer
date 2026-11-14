import Phaser from 'phaser';
import { LOCATIONS } from '../content/locations';
import { setLanguage, t, type Language } from '../i18n';
import { loadProgress, saveProgress } from '../services/progressStorage';
import { createButton } from '../ui/Button';
import { COLORS, PALETTE } from '../ui/palette';
import { GAME_WIDTH } from '../ui/layout';
import { enterFullscreenLandscape, refreshRotateOverlayText } from '../ui/screen';
import { textStyle } from '../ui/textStyles';
import { SCENE_KEYS } from './sceneKeys';

/**
 * One giant PLAY button, so a 7-year-old knows what to do instantly.
 * TODO (Persona C): replace the direct jump to Jezero with the Mars map scene.
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.menu });
  }

  create(): void {
    const centerX = GAME_WIDTH / 2;
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.add.circle(centerX, 420, 260, PALETTE.mars);

    this.add
      .text(centerX, 70, 'ASTRONAUT MISSION TRAINER', textStyle('large', COLORS.energy))
      .setOrigin(0.5);
    this.add
      .text(centerX, 110, t('menu.subtitle'), textStyle('small', COLORS.textMuted))
      .setOrigin(0.5);

    createButton(this, {
      x: centerX,
      y: 200,
      width: 240,
      height: 72,
      label: `▶ ${t('menu.play')}`,
      color: PALETTE.mars,
      onPress: () => this.startFirstLocation(),
    });
    this.createLanguageButtons(centerX, 300);
  }

  private startFirstLocation(): void {
    enterFullscreenLandscape(this);
    this.scene.start(SCENE_KEYS.base, { locationId: LOCATIONS[0].id });
  }

  private createLanguageButtons(centerX: number, y: number): void {
    const options: { language: Language; label: string }[] = [
      { language: 'es', label: 'ES' },
      { language: 'en', label: 'EN' },
    ];
    options.forEach(({ language, label }, index) => {
      createButton(this, {
        x: centerX + (index - 0.5) * 80,
        y,
        width: 64,
        label,
        onPress: () => this.changeLanguage(language),
      });
    });
  }

  private changeLanguage(language: Language): void {
    setLanguage(language);
    saveProgress({ ...loadProgress(), language });
    refreshRotateOverlayText();
    this.scene.restart();
  }
}
