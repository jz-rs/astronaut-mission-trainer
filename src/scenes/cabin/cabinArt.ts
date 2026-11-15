import Phaser from 'phaser';
import { allGalleryPhotos, galleryTextureKey } from '../../content/locationGallery';
import { LOCATION_PHOTOS, photoTextureKey, type LocationPhoto } from '../../content/locationPhotos';

/**
 * Spec 19 — Art of the ship intro (cabin, tablet, console, landing), loaded by the scenes that
 * use it. Phaser skips files already loaded, so every intro scene can call `preloadCabinArt`.
 * Real NASA photos are drawn much smaller than their files, so they get smooth scaling.
 */
const CABIN_FILES = {
  cabin: 'cabina/cabina-fondo.png',
  tablet: 'cabina/tablet.png',
  console: 'cabina/consola-fondo.png',
  guidePointRight: 'cabina/guia-senalando-derecha.png',
  guidePointDown: 'cabina/guia-senalando-abajo.png',
  guideWave: 'cabina/guia-saludando.png',
  guideThumbsUp: 'cabina/guia-pulgar-arriba.png',
  guideSeated: 'cabina/astronauta-guia-sentada.png',
  playerSeated: 'cabina/astronauta-violeta-sentada.png',
  dustCloud: 'energia/nube-polvo.png',
} as const;

export type CabinArtKey = keyof typeof CABIN_FILES;

/** Physical console buttons: each one has a resting, half-pressed and pressed frame. */
export const CONSOLE_BUTTON_FILES = {
  back: 'volver',
  previous: 'destino-anterior',
  photo: 'foto',
  next: 'destino-siguiente',
  land: 'aterrizar',
  info: 'info',
} as const;

export type ConsoleButtonId = keyof typeof CONSOLE_BUTTON_FILES;
export const CONSOLE_PRESS_FRAMES = ['', '-medio', '-apretado'] as const;
export const LAND_LOCKED_TEXTURE = 'consoleButton-aterrizar-bloqueado';

/** Real NASA photos used by the intro, besides each location's photo. Credits match docs/DATA_SOURCES.md. */
export const INTRO_PHOTOS = {
  marsGlobe: { file: 'marte-disco-completo.jpg', credit: 'NASA/JPL/USGS' },
  moxie: { file: 'moxie-dentro-de-perseverance.jpg', credit: 'NASA/JPL-Caltech' },
  veggie: { file: 'veggie-lechugas-en-la-estacion.jpg', credit: 'NASA' },
  perseverance: { file: 'perseverance-selfie-ingenuity.jpg', credit: 'NASA/JPL-Caltech/MSSS' },
} as const satisfies Record<string, LocationPhoto>;

export type IntroPhotoKey = keyof typeof INTRO_PHOTOS;

export function consoleButtonTexture(file: string): string {
  return `consoleButton-${file}`;
}

export function preloadCabinArt(load: Phaser.Loader.LoaderPlugin): void {
  for (const [key, file] of Object.entries(CABIN_FILES)) load.image(key, `assets/sprites/${file}`);
  for (const file of Object.values(CONSOLE_BUTTON_FILES)) {
    for (const frame of CONSOLE_PRESS_FRAMES) {
      load.image(
        consoleButtonTexture(file + frame),
        `assets/sprites/cabina/botones/${file}${frame}.png`,
      );
    }
  }
  load.image(LAND_LOCKED_TEXTURE, 'assets/sprites/cabina/botones/aterrizar-bloqueado.png');
  for (const [key, photo] of Object.entries(INTRO_PHOTOS))
    load.image(key, `assets/nasa/${photo.file}`);
  for (const [locationId, photo] of Object.entries(LOCATION_PHOTOS)) {
    if (photo) load.image(photoTextureKey(locationId), `assets/nasa/${photo.file}`);
  }
  for (const photo of allGalleryPhotos())
    load.image(galleryTextureKey(photo), `assets/nasa/${photo.file}`);
  load.once(Phaser.Loader.Events.COMPLETE, () => smoothPhotos(load.textureManager));
}

function smoothPhotos(textures: Phaser.Textures.TextureManager): void {
  const photoKeys = [
    ...Object.keys(INTRO_PHOTOS),
    ...Object.keys(LOCATION_PHOTOS).map((locationId) => photoTextureKey(locationId)),
    ...allGalleryPhotos().map(galleryTextureKey),
  ];
  for (const key of photoKeys) {
    if (textures.exists(key)) textures.get(key).setFilter(Phaser.Textures.FilterMode.LINEAR);
  }
}
