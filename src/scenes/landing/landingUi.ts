import type Phaser from 'phaser';
import { t } from '../../i18n';
import { createButton } from '../../ui/Button';
import { FONT_SIZE, GAME_WIDTH, type Rect } from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';
import { addGlowText, drawScreenPanel } from '../../ui/screenUi';

/**
 * Spec 18, scene 5 — Texts over the landing: the ship's screen line at the top
 * ("Destination confirmed", "We made it!") and the big button that starts the mission.
 */
const BANNER: Rect = { x: 120, y: 14, width: 400, height: 44 };

export function addLandingBanner(
  scene: Phaser.Scene,
  title: string,
  subtitle?: string,
): Phaser.GameObjects.Container {
  const panel = scene.add.graphics();
  drawScreenPanel(panel, BANNER);
  const centerX = GAME_WIDTH / 2;
  const titleY = subtitle ? BANNER.y + 15 : BANNER.y + BANNER.height / 2;
  const parts: Phaser.GameObjects.GameObject[] = [
    panel,
    addGlowText(scene, centerX, titleY, title, { size: FONT_SIZE.medium, color: PALETTE.white }),
  ];
  if (subtitle)
    parts.push(addGlowText(scene, centerX, BANNER.y + 32, subtitle, { color: TECH_GLOW }));
  return scene.add.container(0, 0, parts);
}

export function addStartButton(
  scene: Phaser.Scene,
  onPress: () => void,
): Phaser.GameObjects.Container {
  const button = createButton(scene, {
    x: GAME_WIDTH / 2,
    y: 316,
    width: 220,
    height: 52,
    label: `▶ ${t('landing.start')}`,
    fontSize: FONT_SIZE.large,
    color: PALETTE.green,
    onPress,
  });
  scene.tweens.add({ targets: button, scale: 1.05, yoyo: true, repeat: -1, duration: 600 });
  return button;
}
