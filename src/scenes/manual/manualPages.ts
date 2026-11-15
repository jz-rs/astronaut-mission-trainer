import type { StatId } from '../../core/types';
import type { TranslationKey } from '../../i18n';
import { PALETTE, STAT_COLORS } from '../../ui/palette';
import type { SpriteKey } from '../../ui/sprites';
import type { IntroPhotoKey } from '../cabin/cabinArt';
import type { LineKind } from './manualText';

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

export interface ManualLine {
  kind: LineKind;
  text: TranslationKey;
}

export interface ManualPage {
  title: TranslationKey;
  /** One short sentence each: the problem, the real science, and what you do in the game. */
  lines: readonly ManualLine[];
  /** An extra curious fact, shown in a box when there is room. */
  fact?: TranslationKey;
  color: number;
  icon?: SpriteKey;
  art: PageArt;
  /** Real photo shown next to the art, and how the two are labelled. */
  compare?: { photo: IntroPhotoKey; labels: 'real' | 'inspiration' };
  effects?: readonly PageEffect[];
}

const SPENDS_ENERGY: PageEffect = { stat: 'energy', change: -1 };
const STORY: readonly LineKind[] = ['problem', 'science', 'play'];

/** The lines of a page, keyed "manual.<page>.line1, line2…", one per kind given. */
function pageLines(page: string, kinds: readonly LineKind[] = STORY): readonly ManualLine[] {
  return kinds.map((kind, index) => ({
    kind,
    text: `manual.${page}.line${index + 1}` as TranslationKey,
  }));
}

export const MANUAL_PAGES: readonly ManualPage[] = [
  {
    title: 'manual.mission.title',
    lines: pageLines('mission'),
    fact: 'manual.mission.fact',
    color: PALETTE.white,
    art: 'mission',
  },
  {
    title: 'manual.oxygen.title',
    lines: pageLines('oxygen'),
    fact: 'manual.oxygen.fact',
    color: STAT_COLORS.oxygen,
    icon: 'iconOxygen',
    art: 'oxygenMachine',
    compare: { photo: 'moxie', labels: 'inspiration' },
    effects: [{ stat: 'oxygen', change: 1 }, SPENDS_ENERGY],
  },
  {
    title: 'manual.food.title',
    lines: pageLines('food'),
    fact: 'manual.food.fact',
    color: STAT_COLORS.food,
    icon: 'iconFood',
    art: 'greenhouse',
    compare: { photo: 'veggie', labels: 'inspiration' },
    effects: [{ stat: 'food', change: 1 }, SPENDS_ENERGY],
  },
  {
    title: 'manual.shield.title',
    lines: pageLines('shield', ['science', 'science', 'problem', 'play']),
    color: STAT_COLORS.shield,
    icon: 'iconShield',
    art: 'shield',
    effects: [{ stat: 'shield', change: 1 }, SPENDS_ENERGY],
  },
  {
    title: 'manual.energy.title',
    lines: pageLines('energy', ['science', 'problem', 'play']),
    fact: 'manual.energy.fact',
    color: STAT_COLORS.energy,
    icon: 'iconEnergy',
    art: 'energy',
    effects: [{ stat: 'energy', change: 1 }],
  },
  {
    title: 'manual.crew.title',
    lines: pageLines('crew', ['problem', 'play', 'play']),
    color: PALETTE.violet,
    art: 'crew',
  },
  {
    title: 'manual.rover.title',
    lines: pageLines('rover', ['science', 'science', 'play']),
    fact: 'manual.rover.fact',
    color: PALETTE.sun,
    art: 'rover',
    compare: { photo: 'perseverance', labels: 'real' },
    effects: [SPENDS_ENERGY],
  },
  {
    title: 'manual.events.title',
    lines: pageLines('events', ['problem', 'problem', 'play']),
    color: PALETTE.alert,
    art: 'events',
  },
  {
    title: 'manual.messages.title',
    lines: pageLines('messages'),
    fact: 'manual.messages.fact',
    color: PALETTE.cyan,
    art: 'messages',
  },
  {
    title: 'manual.ready.title',
    lines: pageLines('ready', ['problem', 'problem', 'play']),
    color: PALETTE.green,
    art: 'ready',
  },
];
