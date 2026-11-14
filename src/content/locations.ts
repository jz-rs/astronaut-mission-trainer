import rawLocations from '../../data/locations.json';
import type { LocationConfig } from '../core/types';

/** Locations are content, edited in data/locations.json, never hardcoded in scenes. */
export const LOCATIONS: readonly LocationConfig[] = (rawLocations as LocationConfig[]).sort(
  (a, b) => a.order - b.order,
);

export function getLocation(locationId: string): LocationConfig {
  const location = LOCATIONS.find((candidate) => candidate.id === locationId);
  if (!location) throw new Error(`Unknown location: ${locationId}`);
  return location;
}
