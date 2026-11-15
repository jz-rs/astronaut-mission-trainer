import type Phaser from 'phaser';
import type { HowToStep } from '../howTo/howToCard';
import { arrowPart, layoutRow, plusPart, type RowPart } from '../howTo/pictureRow';
import {
  addEarth,
  addGasBubble,
  addLamp,
  addSpriteOfHeight,
  addToxicSoil,
} from './greenhouseIcons';

/**
 * Spec 09 — The 3 steps of growing food in the base, as little pictures so a kid can follow
 * them without reading: the how-to card shows them with one line each before playing, and the
 * side panel shows only the pictures while playing.
 */
type GreenhousePart =
  '→' | '+' | 'toxicSoil' | 'earth' | 'sprout' | 'water' | 'lamp' | 'lettuce' | 'co2' | 'o2';

const ICON_HEIGHT = 28;
const ICON_WIDTH = 32;
const LAMP_OFFSET_Y = -8;

function picture(parts: readonly GreenhousePart[]): HowToStep['picture'] {
  return (scene) =>
    layoutRow(
      scene,
      parts.map((part) => addPart(scene, part)),
    );
}

export const GREENHOUSE_STEPS: readonly HowToStep[] = [
  {
    picture: picture(['toxicSoil', '→', 'earth', '→', 'sprout']),
    textKey: 'minigame.greenhouse.guide1',
  },
  {
    picture: picture(['water', '+', 'lamp', '→', 'lettuce']),
    textKey: 'minigame.greenhouse.guide2',
  },
  { picture: picture(['co2', '→', 'lettuce', '→', 'o2']), textKey: 'minigame.greenhouse.guide3' },
];

function addPart(scene: Phaser.Scene, part: GreenhousePart): RowPart {
  switch (part) {
    case '→':
      return arrowPart(scene);
    case '+':
      return plusPart(scene);
    case 'toxicSoil':
      return { item: addToxicSoil(scene), width: ICON_WIDTH };
    case 'earth':
      return { item: addEarth(scene), width: ICON_HEIGHT };
    case 'lamp':
      return { item: addLamp(scene, 0, LAMP_OFFSET_Y), width: ICON_WIDTH + 4 };
    case 'co2':
    case 'o2':
      return { item: addGasBubble(scene, part), width: ICON_HEIGHT };
    default: {
      const key =
        part === 'water' ? 'waterDrop' : part === 'sprout' ? 'lettuceSprout' : 'lettuceHealthy';
      const image = addSpriteOfHeight(scene, 0, 0, key, ICON_HEIGHT);
      return { item: image, width: image.displayWidth };
    }
  }
}
