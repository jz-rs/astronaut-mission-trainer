import type { LocationConfig } from './types';

/**
 * Spec 12 — Which Mars locations are open. A location opens when the player has
 * collected enough stars in total (data/locations.json → starsToUnlock).
 */
export function countTotalStars(starsByLocation: Record<string, number>): number {
  return Object.values(starsByLocation).reduce((total, stars) => total + stars, 0);
}

export function isLocationUnlocked(location: LocationConfig, totalStars: number): boolean {
  return totalStars >= location.starsToUnlock;
}

export function starsMissing(location: LocationConfig, totalStars: number): number {
  return Math.max(0, location.starsToUnlock - totalStars);
}

/** Unlocked locations the player has not celebrated yet (the map plays a party for them). */
export function findNewUnlocks(
  locations: readonly LocationConfig[],
  totalStars: number,
  alreadyCelebrated: readonly string[],
): LocationConfig[] {
  return locations.filter(
    (location) =>
      location.starsToUnlock > 0 &&
      isLocationUnlocked(location, totalStars) &&
      !alreadyCelebrated.includes(location.id),
  );
}

/**
 * Spec 18 — Why the ship can't land on a location yet. The first mission manual comes before
 * anything else; exploring destinations on the monitor never unlocks landing early.
 */
export type LandingBlocker = 'manual' | 'stars' | null;

export function landingBlocker(
  location: LocationConfig,
  totalStars: number,
  manualDone: boolean,
): LandingBlocker {
  if (!manualDone) return 'manual';
  return isLocationUnlocked(location, totalStars) ? null : 'stars';
}
