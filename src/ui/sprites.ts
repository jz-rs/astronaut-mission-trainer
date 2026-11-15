import Phaser from 'phaser';
import type { StatId, TaskId } from '../core/types';
import { astronautFiles } from './astronautFrames';

/**
 * Every image of the art kit (spec 01), loaded once by BootScene.
 * Files are drawn at twice their on-screen size (STYLE_GUIDE "Tamaños"), so they are shown at SPRITE_SCALE.
 */
export const SPRITE_SCALE = 0.5;

const SPRITE_FILES = {
  menuBackground: 'fondos/fondo-menu.png',
  baseMap: 'fondos/mapa-base.png',
  mapOxygenMachine: 'mapa/mapa-maquina-oxigeno.png',
  mapOxygenMachineBroken: 'mapa/mapa-maquina-oxigeno-rota.png',
  mapLettuceHealthy: 'mapa/mapa-lechuga-grande.png',
  mapLettuceThirsty: 'mapa/mapa-lechuga-sedienta.png',
  mapLettuceWithered: 'mapa/mapa-lechuga-seca.png',
  mapPanelClean: 'mapa/mapa-panel-limpio.png',
  mapPanelDirty: 'mapa/mapa-panel-sucio.png',
  roomEnergy: 'fondos/sala-energia.png',
  roomShield: 'fondos/sala-escudo.png',
  roomGreenhouse: 'fondos/sala-invernadero.png',
  roomOxygen: 'fondos/sala-oxigeno.png',
  iconOxygen: 'ui/icono-oxigeno.png',
  iconFood: 'ui/icono-comida.png',
  iconShield: 'ui/icono-escudo.png',
  iconEnergy: 'ui/icono-energia.png',
  sol: 'ui/sol.png',
  starEarned: 'ui/estrella-ganada.png',
  starEmpty: 'ui/estrella-vacia.png',
  nasaPhotoFrame: 'ui/marco-foto-nasa.png',
  oxygenMachineOff: 'oxigeno/maquina-oxigeno-apagada.png',
  oxygenMachineOn: 'oxigeno/maquina-oxigeno-funcionando.png',
  bubbleCarbon: 'oxigeno/burbuja-co2.png',
  bubbleOxygen: 'oxigeno/burbuja-o2.png',
  popFlash: 'oxigeno/destello-pop.png',
  lettuceSprout: 'invernadero/lechuga-brote.png',
  lettuceYoung: 'invernadero/lechuga-joven.png',
  lettuceHealthy: 'invernadero/lechuga-grande.png',
  lettuceThirsty: 'invernadero/lechuga-sedienta.png',
  lettuceWithered: 'invernadero/lechuga-seca.png',
  waterDrop: 'invernadero/gota-agua.png',
  solarPanelClean: 'energia/panel-solar-limpio.png',
  solarPanelDirty: 'energia/panel-solar-sucio.png',
  energyFlash: 'energia/destello-energia.png',
  solarBatteryEmpty: 'energia/battery-empty.png',
  solarBatteryFull: 'energia/battery-full.png',
  airlockShutter: 'energia/airlock-shutter.png',
  airlockRed: 'energia/airlock-red.png',
  airlockGreen: 'energia/airlock-green.png',
  mapAirlock: 'energia/map-airlock.png',
  footprints: 'energia/footprints.png',
  shieldPanel: 'escudo/panel-muro.png',
  shieldPanelHole: 'escudo/panel-muro-hueco.png',
  shieldBlockWater: 'escudo/bloque-agua.png',
  shieldBlockRegolith: 'escudo/bloque-regolito.png',
  radiationRay: 'escudo/rayo-radiacion.png',
  rover: 'rover/rover.png',
  rock: 'rover/roca-grande.png',
  shinySample: 'rover/muestra-brillante.png',
  sampleTube: 'rover/tubo-muestra.png',
} as const;

export type SpriteKey = keyof typeof SPRITE_FILES;

/**
 * Sprites shown much smaller than half their file size: smooth scaling keeps their outline
 * instead of dropping whole pixel rows.
 */
const SMOOTH_SPRITES: readonly SpriteKey[] = [
  'starEarned',
  'starEmpty',
  'nasaPhotoFrame',
  'shieldPanel',
  'shieldPanelHole',
];

export const STAT_ICON_SPRITES: Record<StatId, SpriteKey> = {
  oxygen: 'iconOxygen',
  food: 'iconFood',
  shield: 'iconShield',
  energy: 'iconEnergy',
};

/** Empty room drawn behind each minigame (the sprites of the minigame go on top). */
export const ROOM_BACKGROUNDS: Record<TaskId, SpriteKey> = {
  'oxygen-factory': 'roomOxygen',
  greenhouse: 'roomGreenhouse',
  'solar-panels': 'roomEnergy',
  'shield-wall': 'roomShield',
};

/** The monitor of the NASA photo frame (texture pixels), cut out as its own frame. */
export const NASA_MONITOR_FRAME = 'monitor';
const NASA_MONITOR = { x: 362, y: 190, width: 556, height: 350 } as const;
/** The transparent screen, relative to the monitor cut-out. */
export const NASA_MONITOR_SCREEN = { x: 24, y: 27, width: 508, height: 286 } as const;

export function preloadSprites(load: Phaser.Loader.LoaderPlugin): void {
  for (const [key, file] of Object.entries(SPRITE_FILES)) {
    load.image(key, `assets/sprites/${file}`);
  }
  for (const { key, file } of astronautFiles()) {
    load.image(key, `assets/sprites/${file}`);
  }
}

/** Runs once after loading: smooth filters and the monitor cut-out of the photo frame. */
export function prepareSprites(textures: Phaser.Textures.TextureManager): void {
  for (const key of SMOOTH_SPRITES) {
    textures.get(key).setFilter(Phaser.Textures.FilterMode.LINEAR);
  }
  const { x, y, width, height } = NASA_MONITOR;
  textures.get('nasaPhotoFrame').add(NASA_MONITOR_FRAME, 0, x, y, width, height);
}

/** A sprite at its on-screen size. */
export function addSprite(
  scene: Phaser.Scene,
  x: number,
  y: number,
  key: SpriteKey,
): Phaser.GameObjects.Image {
  return scene.add.image(x, y, key).setScale(SPRITE_SCALE);
}

/** A sprite scaled so its longest side measures `size` game pixels (icons, stars, blocks). */
export function addSpriteSized(
  scene: Phaser.Scene,
  x: number,
  y: number,
  key: SpriteKey,
  size: number,
): Phaser.GameObjects.Image {
  const image = scene.add.image(x, y, key);
  return image.setScale(size / Math.max(image.width, image.height));
}
