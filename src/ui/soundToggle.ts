import type Phaser from 'phaser';
import { isMusicMuted, setMusicMuted } from './backgroundMusic';
import { createButton } from './Button';
import { MIN_TOUCH_SIZE, type Rect } from './layout';
import { PALETTE } from './palette';

/**
 * The sound on/off button, the same dark chunky button as "◀ BACK" on the base's top bar: a
 * pixel speaker with waves when the sound is on, crossed out when it is off. It mutes the music
 * and the sound effects; the choice lasts while the game is open.
 */
const DEPTH = 40;
const EDGE_WIDTH = 2;
const PIXEL = 2;
/** The speaker, in pixels of PIXEL size, centered on the button: [x, y, width, height]. */
const SPEAKER: readonly (readonly [number, number, number, number])[] = [
  [-5, -1, 2, 3],
  [-3, -2, 1, 5],
  [-2, -3, 1, 7],
];
const WAVES: readonly (readonly [number, number, number, number])[] = [
  [0, -1, 1, 3],
  [2, -3, 1, 1],
  [2, 3, 1, 1],
  [3, -2, 1, 5],
];
const CROSS: readonly (readonly [number, number, number, number])[] = [
  [0, -2, 1, 1],
  [1, -1, 1, 1],
  [2, 0, 1, 1],
  [3, 1, 1, 1],
  [3, -2, 1, 1],
  [2, -1, 1, 1],
  [1, 0, 1, 1],
  [0, 1, 1, 1],
];

export function addSoundToggle(scene: Phaser.Scene, area: Rect): Phaser.GameObjects.Container {
  const icon = scene.add.graphics();
  const toggle = () => {
    setMusicMuted(!isMusicMuted());
    drawIcon(icon);
  };
  const button = createButton(scene, {
    x: area.x + area.width / 2,
    y: area.y + area.height / 2,
    width: area.width,
    height: area.height,
    label: '',
    color: PALETTE.night,
    onPress: toggle,
  }).setDepth(DEPTH);
  const edge = scene.add.graphics().lineStyle(EDGE_WIDTH, PALETTE.metal, 1);
  edge.strokeRect(-area.width / 2, -area.height / 2, area.width, area.height);
  button.add([edge, icon]);
  drawIcon(icon);
  // Drawn thin to fit the bar, but small fingers need 48 px: a taller invisible zone under it.
  const touchHeight = Math.max(area.height, MIN_TOUCH_SIZE);
  const zone = scene.add.zone(button.x, button.y, area.width, touchHeight).setDepth(DEPTH - 1);
  zone.setInteractive({ useHandCursor: true }).on('pointerup', toggle);
  return button;
}

function drawIcon(icon: Phaser.GameObjects.Graphics): void {
  const muted = isMusicMuted();
  icon.clear().fillStyle(muted ? PALETTE.metal : PALETTE.white, 1);
  for (const [x, y, width, height] of [...SPEAKER, ...(muted ? CROSS : WAVES)]) {
    icon.fillRect(x * PIXEL, y * PIXEL, width * PIXEL, height * PIXEL);
  }
}
