import type Phaser from 'phaser';
import type { HowToStep } from '../howTo/howToCard';
import { arrowPart, layoutRow, type RowPart } from '../howTo/pictureRow';
import { addBatteryIcon, addSpriteOfHeight, addSun } from './solarIcons';

/**
 * Spec 07 — The 3 steps of getting energy from the Sun on Mars, as little pictures so a kid can
 * follow them without reading: the how-to card shows them with one line each before playing,
 * and the side panel shows only the pictures while playing.
 */
type SolarPart = 'sun' | '→' | 'dirtyPanel' | 'panel' | 'bolt' | 'battery';

const ICON_HEIGHT = 28;
const SUN_RADIUS = 8;

function picture(parts: readonly SolarPart[]): HowToStep['picture'] {
  return (scene) =>
    layoutRow(
      scene,
      parts.map((part) => addPart(scene, part)),
    );
}

export const SOLAR_STEPS: readonly HowToStep[] = [
  { picture: picture(['sun', '→', 'dirtyPanel']), textKey: 'minigame.solar-panels.guide1' },
  {
    picture: picture(['sun', '→', 'panel', '→', 'bolt']),
    textKey: 'minigame.solar-panels.guide2',
  },
  { picture: picture(['bolt', '→', 'battery']), textKey: 'minigame.solar-panels.guide3' },
];

function addPart(scene: Phaser.Scene, part: SolarPart): RowPart {
  if (part === '→') return arrowPart(scene);
  if (part === 'sun') {
    return { item: addSun(scene, 0, 0, SUN_RADIUS), width: SUN_RADIUS * 3 };
  }
  if (part === 'battery') {
    return { item: addBatteryIcon(scene, 1, ICON_HEIGHT), width: ICON_HEIGHT * 0.6 };
  }
  const key =
    part === 'bolt' ? 'iconEnergy' : part === 'panel' ? 'solarPanelClean' : 'solarPanelDirty';
  const image = addSpriteOfHeight(scene, 0, 0, key, ICON_HEIGHT);
  return { item: image, width: image.displayWidth };
}
