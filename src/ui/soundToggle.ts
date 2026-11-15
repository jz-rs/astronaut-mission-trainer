import type Phaser from 'phaser';
import { isMusicMuted, setMusicMuted } from './backgroundMusic';
import { createButton } from './Button';
import { MIN_TOUCH_SIZE, type Rect } from './layout';
import { PALETTE } from './palette';

/**
 * The sound on/off button: a pixel speaker with waves when the sound is on, crossed out when it
 * is off. It mutes the music and the sound effects; the choice lasts while the game is open.
 * Two looks, so it matches the buttons next to it:
 *   - bar: the same dark chunky button as "◀ BACK" on the base's top bar;
 *   - menu: like the ES / EN buttons of the start screen, sun when the sound is on, metal when off.
 */
export type SoundToggleLook = 'bar' | 'menu';

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

export function addSoundToggle(
  scene: Phaser.Scene,
  area: Rect,
  look: SoundToggleLook = 'bar',
): void {
  const parts: Phaser.GameObjects.GameObject[] = [];
  // The button's face color can't change after it is made, so a tap rebuilds it.
  const toggle = () => {
    setMusicMuted(!isMusicMuted());
    for (const part of parts) part.destroy();
    addSoundToggle(scene, area, look);
  };
  const button = createButton(scene, {
    x: area.x + area.width / 2,
    y: area.y + area.height / 2,
    width: area.width,
    height: area.height,
    label: '',
    color: faceColor(look),
    onPress: toggle,
  }).setDepth(DEPTH);
  button.add(
    look === 'bar'
      ? [drawEdge(scene, area), drawIcon(scene, PALETTE.white)]
      : drawIcon(scene, PALETTE.night),
  );
  // Drawn thin to fit, but small fingers need 48 px: a taller invisible zone under it.
  const touchHeight = Math.max(area.height, MIN_TOUCH_SIZE);
  const zone = scene.add.zone(button.x, button.y, area.width, touchHeight).setDepth(DEPTH - 1);
  zone.setInteractive({ useHandCursor: true }).on('pointerup', toggle);
  parts.push(button, zone);
}

function faceColor(look: SoundToggleLook): number {
  if (look === 'bar') return PALETTE.night;
  return isMusicMuted() ? PALETTE.metal : PALETTE.sun;
}

function drawEdge(scene: Phaser.Scene, area: Rect): Phaser.GameObjects.Graphics {
  const edge = scene.add.graphics().lineStyle(EDGE_WIDTH, PALETTE.metal, 1);
  return edge.strokeRect(-area.width / 2, -area.height / 2, area.width, area.height);
}

/** On the dark bar a muted speaker turns gray; on the menu the metal face already says it. */
function drawIcon(scene: Phaser.Scene, onColor: number): Phaser.GameObjects.Graphics {
  const muted = isMusicMuted();
  const color = muted && onColor === PALETTE.white ? PALETTE.metal : onColor;
  const icon = scene.add.graphics().fillStyle(color, 1);
  for (const [x, y, width, height] of [...SPEAKER, ...(muted ? CROSS : WAVES)]) {
    icon.fillRect(x * PIXEL, y * PIXEL, width * PIXEL, height * PIXEL);
  }
  return icon;
}
