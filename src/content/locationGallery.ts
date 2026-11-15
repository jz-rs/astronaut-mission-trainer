import { LOCATION_PHOTOS, type LocationPhoto } from './locationPhotos';

/**
 * Spec 18 — Every real NASA photo of each destination, for the photo button of the ship's monitor.
 * The first one is the location's main photo (locationPhotos.ts); the rest show the same place
 * from other angles (from orbit, from the ground, details). Never a photo of another place.
 * Each file is registered in docs/DATA_SOURCES.md.
 */
const EXTRA_PHOTOS: Partial<Record<string, readonly LocationPhoto[]>> = {
  jezero: [
    { file: 'jezero-delta-desde-el-suelo.jpg', credit: 'NASA/JPL-Caltech/ASU/MSSS' },
    { file: 'jezero-delta-panoramica.jpg', credit: 'NASA/JPL-Caltech/ASU/MSSS' },
  ],
  gale: [
    { file: 'gale-desde-orbita.jpg', credit: 'NASA/JPL-Caltech/ASU' },
    { file: 'gale-capas-de-roca.jpg', credit: 'NASA/JPL-Caltech/MSSS' },
  ],
  'olympus-mons': [{ file: 'olympus-mons-color.jpg', credit: 'NASA/JPL' }],
  'north-pole': [
    { file: 'north-pole-casquete-espiral.jpg', credit: 'NASA/JPL-Caltech/MSSS' },
    { file: 'north-pole-capas-de-hielo.jpg', credit: 'NASA/JPL-Caltech/Univ. of Arizona' },
  ],
  'valles-marineris': [
    { file: 'valles-marineris-mosaico.jpg', credit: 'NASA/JPL/Arizona State University' },
  ],
};

export function locationGallery(locationId: string): readonly LocationPhoto[] {
  const main = LOCATION_PHOTOS[locationId];
  return [...(main ? [main] : []), ...(EXTRA_PHOTOS[locationId] ?? [])];
}

/** Every gallery photo has its own texture, named after its file. */
export function galleryTextureKey(photo: LocationPhoto): string {
  return `gallery-${photo.file}`;
}

export function allGalleryPhotos(): LocationPhoto[] {
  return Object.keys(LOCATION_PHOTOS).flatMap((locationId) => [...locationGallery(locationId)]);
}
