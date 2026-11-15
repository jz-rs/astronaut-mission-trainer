import type { StatId } from '../../core/types';
import type { TranslationKey } from '../../i18n';
import { PALETTE, STAT_COLORS } from '../../ui/palette';
import type { SpriteKey } from '../../ui/sprites';
import type { IntroPhotoKey } from '../cabin/cabinArt';

/**
 * Spec 19, scene 2 — The ten pages of the mission manual, as data.
 * A "compare" page puts a real NASA photo next to the game's version of the same thing, so kids
 * can tell science from simulation. Labels say "inspiration" when the game only borrows the idea.
 */
export type PageArt =
  | 'mission'
  | 'shield'
  | 'energy'
  | 'crew'
  | 'events'
  | 'messages'
  | 'ready'
  | 'oxygenMachine'
  | 'greenhouse'
  | 'rover';

export interface PageEffect {
  stat: StatId;
  /** +1: this action raises the bar; -1: it spends it. */
  change: 1 | -1;
}

export interface ManualPage {
  title: TranslationKey;
  text: TranslationKey;
  color: number;
  icon?: SpriteKey;
  art: PageArt;
  /** Real photo shown next to the art, and how the two are labelled. */
  compare?: { photo: IntroPhotoKey; labels: 'real' | 'inspiration' };
  effects?: readonly PageEffect[];
}

const SPENDS_ENERGY: PageEffect = { stat: 'energy', change: -1 };

export const MANUAL_PAGES: readonly ManualPage[] = [
  {
    title: 'manual.mission.title',
    text: 'manual.mission.text',
    color: PALETTE.white,
    art: 'mission',
  },
  {
    title: 'manual.oxygen.title',
    text: 'manual.oxygen.text',
    color: STAT_COLORS.oxygen,
    icon: 'iconOxygen',
    art: 'oxygenMachine',
    compare: { photo: 'moxie', labels: 'inspiration' },
    effects: [{ stat: 'oxygen', change: 1 }, SPENDS_ENERGY],
  },
  {
    title: 'manual.food.title',
    text: 'manual.food.text',
    color: STAT_COLORS.food,
    icon: 'iconFood',
    art: 'greenhouse',
    compare: { photo: 'veggie', labels: 'inspiration' },
    effects: [{ stat: 'food', change: 1 }, SPENDS_ENERGY],
  },
  {
    title: 'manual.shield.title',
    text: 'manual.shield.text',
    color: STAT_COLORS.shield,
    icon: 'iconShield',
    art: 'shield',
    effects: [{ stat: 'shield', change: 1 }, SPENDS_ENERGY],
  },
  {
    title: 'manual.energy.title',
    text: 'manual.energy.text',
    color: STAT_COLORS.energy,
    icon: 'iconEnergy',
    art: 'energy',
    effects: [{ stat: 'energy', change: 1 }],
  },
  { title: 'manual.crew.title', text: 'manual.crew.text', color: PALETTE.violet, art: 'crew' },
  {
    title: 'manual.rover.title',
    text: 'manual.rover.text',
    color: PALETTE.sun,
    art: 'rover',
    compare: { photo: 'perseverance', labels: 'real' },
    effects: [SPENDS_ENERGY],
  },
  { title: 'manual.events.title', text: 'manual.events.text', color: PALETTE.alert, art: 'events' },
  {
    title: 'manual.messages.title',
    text: 'manual.messages.text',
    color: PALETTE.cyan,
    art: 'messages',
  },
  { title: 'manual.ready.title', text: 'manual.ready.text', color: PALETTE.green, art: 'ready' },
];
