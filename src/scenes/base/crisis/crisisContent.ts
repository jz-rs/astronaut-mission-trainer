import type { CrisisProcedureId, EventType, StatId } from '../../../core/types';
import type { TranslationKey } from '../../../i18n';
import { PALETTE } from '../../../ui/palette';
import type { CrisisPhotoKey } from './crisisArt';

/**
 * Spec 16 — What the crisis tablet shows for each crisis: a real NASA photo when the message
 * arrives, one that explains why the vote was right or wrong, and a reward photo once it is over.
 * Texts live in i18n under `crisis.<event type>.…`.
 */
export type CrisisEventType = Extract<EventType, 'solar-storm' | 'dust-storm'>;

export interface CrisisScreens {
  votePhoto: CrisisPhotoKey;
  rightPhoto: CrisisPhotoKey;
  wrongPhoto: CrisisPhotoKey;
  rewardPhoto: CrisisPhotoKey;
  /** The bar the crisis hurts, shown in the "it will hurt less / a lot" line. */
  stat: StatId;
}

export const CRISIS_SCREENS: Record<CrisisEventType, CrisisScreens> = {
  'solar-storm': {
    votePhoto: 'solarFlare',
    rightPhoto: 'orionDummies',
    wrongPhoto: 'curiosityRadiation',
    rewardPhoto: 'mavenAuroras',
    stat: 'shield',
  },
  'dust-storm': {
    votePhoto: 'dustStorm2018',
    rightPhoto: 'dustStorm2018',
    wrongPhoto: 'opportunityDusty',
    rewardPhoto: 'opportunityClean',
    stat: 'energy',
  },
};

export function isCrisisEventType(type: EventType): type is CrisisEventType {
  return type === 'solar-storm' || type === 'dust-storm';
}

/** Big picture on each vote button, with the color of what it is about. */
export const PROCEDURE_ICONS: Record<CrisisProcedureId, { texture: string; color: number }> = {
  shelter: { texture: 'iconShield', color: PALETTE.violet },
  'go-outside': { texture: 'mapPanelClean', color: PALETTE.sun },
  'save-energy': { texture: 'iconEnergy', color: PALETTE.sun },
  'clean-panels': { texture: 'mapPanelDirty', color: PALETTE.marsLight },
};

export type Verdict = 'right' | 'wrong';

export function verdictKeys(type: CrisisEventType, verdict: Verdict) {
  return {
    why: `crisis.${type}.${verdict}.why`,
    detail: `crisis.${type}.${verdict}.detail`,
    caption: `crisis.${type}.${verdict}.caption`,
  } as const satisfies Record<string, TranslationKey>;
}

export function rewardKeys(type: CrisisEventType) {
  return {
    text: `crisis.${type}.reward.text`,
    detail: `crisis.${type}.reward.detail`,
    caption: `crisis.${type}.reward.caption`,
  } as const satisfies Record<string, TranslationKey>;
}
