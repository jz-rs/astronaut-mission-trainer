import type Phaser from 'phaser';
import { t } from '../../i18n';
import { BASE_MANUAL_BUTTON } from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';
import { addGlowText } from '../../ui/screenUi';

/**
 * Spec 19 — A little tablet with "MANUAL" on its screen in the base's top bar: the same mission
 * manual as in the ship, to look something up while playing. The base pauses while it is open.
 */
const FRAME_RADIUS = 4;
const BEZEL = 3;
/** The round button on the right side of the tablet, like the big one. */
const HOME = { inset: 4, radius: 1.5 } as const;
const LABEL_SCALE = 1;
const LABEL_RESOLUTION = 4;
const PRESSED_SCALE = 0.92;

export function addManualButton(scene: Phaser.Scene, onPress: () => void): void {
  const { x, y, width, height } = BASE_MANUAL_BUTTON;
  const tablet = scene.add.graphics();
  drawTablet(tablet, width, height);
  const label = addGlowText(scene, -HOME.inset / 2, 0, t('cabin.tablet'), { color: TECH_GLOW });
  label.setResolution(LABEL_RESOLUTION).setScale(LABEL_SCALE);
  const button = scene.add.container(x + width / 2, y + height / 2, [tablet, label]);
  // The whole height of the bar can be tapped, so a finger finds it easily.
  button.setSize(width, height + BEZEL * 4).setInteractive({ useHandCursor: true });
  button.on('pointerdown', () => button.setScale(PRESSED_SCALE));
  button.on('pointerout', () => button.setScale(1));
  button.on('pointerup', () => {
    button.setScale(1);
    onPress();
  });
}

function drawTablet(graphics: Phaser.GameObjects.Graphics, width: number, height: number): void {
  const left = -width / 2;
  const top = -height / 2;
  graphics.fillStyle(PALETTE.metalLight, 1).fillRoundedRect(left, top, width, height, FRAME_RADIUS);
  graphics
    .lineStyle(1, PALETTE.metalDark, 1)
    .strokeRoundedRect(left, top, width, height, FRAME_RADIUS);
  const screenWidth = width - BEZEL * 2 - HOME.inset * 2;
  graphics
    .fillStyle(PALETTE.night, 1)
    .fillRect(left + BEZEL, top + BEZEL, screenWidth, height - BEZEL * 2);
  graphics.fillStyle(PALETTE.metalDark, 1);
  graphics.fillCircle(width / 2 - BEZEL - HOME.inset / 2, 0, HOME.radius);
}
