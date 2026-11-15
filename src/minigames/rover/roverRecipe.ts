import type Phaser from 'phaser';
import { addSpriteSized } from '../../ui/sprites';
import type { HowToStep } from '../howTo/howToCard';
import { arrowPart, layoutRow, plusPart, type RowPart } from '../howTo/pictureRow';
import { addCore, addDrill, addShelfIcon, addTube } from './roverIcons';

/**
 * Mission 5 — The 4 steps of a rover trip, as little pictures so a kid can follow them without
 * reading: drive and catch rocks, drill a rock, put the core in a tube and seal it, keep the
 * tube on the shelf. The how-to card shows them with one line each before playing, and the side
 * panel shows only the pictures while playing.
 */
type RoverPart = '→' | '+' | 'rover' | 'drill' | 'rock' | 'core' | 'open' | 'sealed' | 'shelf';

const ICON_SIZE = 28;
const TUBE_HEIGHT = 26;
const SMALL_WIDTH = 14;

function picture(parts: readonly RoverPart[]): HowToStep['picture'] {
  return (scene) =>
    layoutRow(
      scene,
      parts.map((part) => addPart(scene, part)),
    );
}

export const ROVER_STEPS: readonly HowToStep[] = [
  { picture: picture(['rover', '→', 'rock']), textKey: 'rover.guide1' },
  { picture: picture(['drill', '+', 'rock', '→', 'core']), textKey: 'rover.guide2' },
  { picture: picture(['core', '→', 'open', '→', 'sealed']), textKey: 'rover.guide3' },
  { picture: picture(['sealed', '→', 'shelf']), textKey: 'rover.guide4' },
];

function addPart(scene: Phaser.Scene, part: RoverPart): RowPart {
  switch (part) {
    case '→':
      return arrowPart(scene);
    case '+':
      return plusPart(scene);
    case 'rover':
      return { item: addSpriteSized(scene, 0, 0, 'rover', ICON_SIZE), width: ICON_SIZE };
    case 'rock':
      return { item: addSpriteSized(scene, 0, 0, 'rock', ICON_SIZE), width: ICON_SIZE };
    case 'drill':
      return { item: addDrill(scene).setScale(0.7), width: SMALL_WIDTH + 4 };
    case 'core':
      return { item: addCore(scene), width: SMALL_WIDTH };
    case 'open':
      return { item: addTube(scene, TUBE_HEIGHT, 'open'), width: SMALL_WIDTH };
    case 'sealed':
      return { item: addTube(scene, TUBE_HEIGHT, 'sealed'), width: SMALL_WIDTH };
    case 'shelf':
      return { item: addShelfIcon(scene, ICON_SIZE), width: ICON_SIZE };
  }
}
