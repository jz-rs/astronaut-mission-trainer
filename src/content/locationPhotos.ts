/**
 * Spec 12/13 — Real NASA photo of each location, shown framed (AGENTS.md §5).
 * Add an entry when the file is in public/assets/nasa/ and registered in docs/DATA_SOURCES.md.
 * Locations without a photo show a pixel-art placeholder.
 */
export interface LocationPhoto {
  file: string;
  credit: string;
}

export const LOCATION_PHOTOS: Partial<Record<string, LocationPhoto>> = {};

export function photoTextureKey(locationId: string): string {
  return `photo-${locationId}`;
}
