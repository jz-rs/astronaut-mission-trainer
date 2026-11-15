import type Phaser from 'phaser';
import { astronautFrameKey } from '../../ui/astronautFrames';
import type { HowToStep } from '../howTo/howToCard';
import { arrowPart, layoutRow, plusPart, type RowPart } from '../howTo/pictureRow';
import { addBareMars, addIcon, addMeterIcon, addRayIcon, addShieldedEarth } from './shieldIcons';

/**
 * Spec 10 — The 3 steps of protecting the crew from radiation, as little pictures so a kid can
 * follow them without reading: the how-to card shows them with one line each before playing,
 * and the side panel shows only the pictures while playing.
 */
type ShieldPart =
  '→' | '+' | 'ray' | 'earth' | 'mars' | 'water' | 'regolith' | 'wall' | 'meter' | 'astronaut';

const ICON_SIZE = 26;
const PLANET_WIDTH = 34;
const RAY_WIDTH = 14;
const ASTRONAUT_HEIGHT = 30;

function picture(parts: readonly ShieldPart[]): HowToStep['picture'] {
  return (scene) =>
    layoutRow(
      scene,
      parts.map((part) => addPart(scene, part)),
    );
}

export const SHIELD_STEPS: readonly HowToStep[] = [
  {
    picture: picture(['ray', 'earth', 'ray', '→', 'mars']),
    textKey: 'minigame.shield-wall.guide1',
  },
  {
    picture: picture(['water', '+', 'regolith', '→', 'wall']),
    textKey: 'minigame.shield-wall.guide2',
  },
  { picture: picture(['meter', '→', 'astronaut']), textKey: 'minigame.shield-wall.guide3' },
];

function addPart(scene: Phaser.Scene, part: ShieldPart): RowPart {
  switch (part) {
    case '→':
      return arrowPart(scene);
    case '+':
      return plusPart(scene);
    case 'ray':
      return { item: addRayIcon(scene, ICON_SIZE), width: RAY_WIDTH };
    case 'earth':
      return { item: addShieldedEarth(scene), width: PLANET_WIDTH };
    case 'mars':
      return { item: addBareMars(scene), width: PLANET_WIDTH - 8 };
    case 'meter':
      return { item: addMeterIcon(scene, ICON_SIZE), width: RAY_WIDTH };
    case 'astronaut': {
      const astronaut = scene.add.image(0, 0, astronautFrameKey('violet', 'front'));
      astronaut.setScale(ASTRONAUT_HEIGHT / astronaut.height);
      return { item: astronaut, width: astronaut.displayWidth };
    }
    default: {
      const key =
        part === 'water'
          ? 'shieldBlockWater'
          : part === 'regolith'
            ? 'shieldBlockRegolith'
            : 'shieldPanel';
      return { item: addIcon(scene, key, ICON_SIZE), width: ICON_SIZE };
    }
  }
}
