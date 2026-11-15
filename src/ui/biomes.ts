import type Phaser from 'phaser';
import { TASK_IDS, type TaskId } from '../core/types';
import { ROOM_BACKGROUNDS } from './sprites';

/**
 * How each level looks (spec 01/04): its base map, its rooms (with a real NASA photo of that place
 * in the window) and its weather. Images live in `assets/sprites/biomas/` and are generated from
 * the kit (docs/arte/biomas/). They load when entering the base, only for that level: ~1.8 MB each,
 * so a phone does not download the 5 levels at start.
 */
export type Weather = 'none' | 'snow' | 'dust';

interface BiomeLook {
  weather: Weather;
  /** Ice crystals in the screen corners, over the UI: it is very cold. */
  hasFrost: boolean;
}

const BIOME_LOOKS: Record<string, BiomeLook> = {
  jezero: { weather: 'none', hasFrost: false },
  gale: { weather: 'dust', hasFrost: false },
  'olympus-mons': { weather: 'none', hasFrost: false },
  'north-pole': { weather: 'snow', hasFrost: true },
  'valles-marineris': { weather: 'none', hasFrost: false },
};

/** Jezero is the original kit: its map is the kit's `baseMap`. */
const DEFAULT_BIOME = 'jezero';
const BIOME_FOLDER = 'assets/sprites/biomas';
export const FROST_TEXTURE_KEY = 'biomeFrost';

const ROOM_FILE_NAMES: Record<TaskId, string> = {
  'oxygen-factory': 'sala-oxigeno',
  greenhouse: 'sala-invernadero',
  'solar-panels': 'sala-energia',
  'shield-wall': 'sala-escudo',
};

/** Unknown locations (new content without art yet) look like Jezero. */
function biomeId(locationId: string): string {
  return locationId in BIOME_LOOKS ? locationId : DEFAULT_BIOME;
}

export function biomeLook(locationId: string): BiomeLook {
  return BIOME_LOOKS[biomeId(locationId)] ?? { weather: 'none', hasFrost: false };
}

export function baseMapKey(locationId: string): string {
  const biome = biomeId(locationId);
  return biome === DEFAULT_BIOME ? 'baseMap' : `baseMap-${biome}`;
}

/** Outdoor solar backgrounds have the same framing and twice the play area's resolution. */
export function solarExteriorKey(locationId = DEFAULT_BIOME): string {
  return `solarExterior-${biomeId(locationId)}`;
}

/** Without a location (a minigame opened on its own) the kit's plain room is used. */
export function roomBackgroundKey(taskId: TaskId, locationId?: string): string {
  if (!locationId) return ROOM_BACKGROUNDS[taskId];
  return `room-${taskId}-${biomeId(locationId)}`;
}

/** Queues the images of one level; already loaded ones are skipped (replaying is instant). */
export function preloadBiome(scene: Phaser.Scene, locationId: string): void {
  const biome = biomeId(locationId);
  const files: [string, string][] = TASK_IDS.map((taskId) => [
    roomBackgroundKey(taskId, biome),
    `${ROOM_FILE_NAMES[taskId]}-${biome}.png`,
  ]);
  files.push([solarExteriorKey(biome), `afuera-${biome}.png`]);
  if (biome !== DEFAULT_BIOME) files.push([baseMapKey(biome), `mapa-base-${biome}.png`]);
  if (biomeLook(biome).hasFrost) files.push([FROST_TEXTURE_KEY, 'escarcha-polo.png']);
  for (const [key, file] of files) {
    if (!scene.textures.exists(key)) scene.load.image(key, `${BIOME_FOLDER}/${file}`);
  }
}
