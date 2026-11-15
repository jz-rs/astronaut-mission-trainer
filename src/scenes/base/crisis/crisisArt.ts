import Phaser from 'phaser';
import type { LocationPhoto } from '../../../content/locationPhotos';

/**
 * Spec 16 — Art of the crisis tablet: the same tablet as the mission manual, and the real NASA
 * photos that show why each procedure is right or wrong. Credits match docs/DATA_SOURCES.md.
 * Photos are drawn much smaller than their files, so they get smooth scaling.
 */
export const CRISIS_PHOTOS = {
  solarFlare: { file: 'sol-llamarada-sdo.jpg', credit: 'NASA/GSFC/SDO' },
  orionDummies: { file: 'orion-maniquies-radiacion.jpg', credit: 'NASA/Frank Michaux' },
  curiosityRadiation: { file: 'curiosity-radiacion-2024.jpg', credit: 'NASA/JPL-Caltech' },
  mavenAuroras: { file: 'maven-auroras-2024.jpg', credit: 'NASA/University of Colorado/LASP' },
  dustStorm2018: { file: 'tormenta-de-polvo-2018.jpg', credit: 'NASA/JPL-Caltech/MSSS' },
  opportunityDusty: { file: 'opportunity-paneles-2007.jpg', credit: 'NASA/JPL-Caltech/Cornell' },
  opportunityClean: {
    file: 'opportunity-limpio-2014.jpg',
    credit: 'NASA/JPL-Caltech/Cornell Univ./Arizona State Univ.',
  },
} as const satisfies Record<string, LocationPhoto>;

export type CrisisPhotoKey = keyof typeof CRISIS_PHOTOS;

export const TABLET_TEXTURE = 'tablet';

export function crisisPhotoTexture(key: CrisisPhotoKey): string {
  return `crisis-${key}`;
}

export function preloadCrisisArt(load: Phaser.Loader.LoaderPlugin): void {
  load.image(TABLET_TEXTURE, 'assets/sprites/cabina/tablet.png');
  for (const [key, photo] of Object.entries(CRISIS_PHOTOS)) {
    load.image(crisisPhotoTexture(key as CrisisPhotoKey), `assets/nasa/${photo.file}`);
  }
  load.once(Phaser.Loader.Events.COMPLETE, () => smoothPhotos(load.textureManager));
}

function smoothPhotos(textures: Phaser.Textures.TextureManager): void {
  for (const key of Object.keys(CRISIS_PHOTOS)) {
    const texture = crisisPhotoTexture(key as CrisisPhotoKey);
    if (textures.exists(texture))
      textures.get(texture).setFilter(Phaser.Textures.FilterMode.LINEAR);
  }
}
