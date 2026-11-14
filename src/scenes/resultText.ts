import type { StarResults } from '../core/scoring';
import type { LocationChallenge, StatId } from '../core/types';
import { t } from '../i18n';
import { STAT_ICONS } from '../ui/layout';

/**
 * Spec 11 — "Why you lost a star", in one line. Only wording lives here:
 * which stars were earned is decided by src/core/scoring.ts.
 */
export interface LostStarInfo {
  stars: StarResults;
  emptyStat: StatId | null;
  challenge: LocationChallenge;
  samples: number;
  samplesGoal: number;
}

function statLabel(statId: StatId): string {
  return `${STAT_ICONS[statId]} ${t(`stat.${statId}` as const)}`;
}

export function describeLostStar(info: LostStarInfo): string {
  const { stars, emptyStat, challenge } = info;
  if (!stars.survived && emptyStat) {
    return t('result.reason.evacuated', { stat: statLabel(emptyStat) });
  }
  if (!stars.challengeCompleted) {
    return t('result.reason.challenge', {
      stat: statLabel(challenge.stat),
      minimum: challenge.minimum,
    });
  }
  if (!stars.samplesGoalReached) {
    return t('result.reason.samples', { samples: info.samples, goal: info.samplesGoal });
  }
  return t('result.allStars');
}
