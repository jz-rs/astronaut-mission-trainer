import type Phaser from 'phaser';
import { ALERT_BALANCE } from '../../config/balance';
import type { StatId } from '../../core/types';
import {
  MAP_LETTUCE_BEDS,
  MAP_OXYGEN_MACHINE,
  MAP_SOLAR_PANELS,
  type Point,
} from '../../ui/layout';
import { addSprite, type SpriteKey } from '../../ui/sprites';

/**
 * Spec 04 — What happens in the game also shows on the map (STYLE_GUIDE "Cómo se arma la base"):
 * lettuces get thirsty and wither with the food bar, MOXIE breaks when oxygen is low,
 * solar panels get dusty as energy drops.
 */
type Mood = 'fine' | 'worried' | 'critical';

const LETTUCE_SPRITES: Record<Mood, SpriteKey> = {
  fine: 'mapLettuceHealthy',
  worried: 'mapLettuceThirsty',
  critical: 'mapLettuceWithered',
};
const MACHINE_SPRITES: Record<Mood, SpriteKey> = {
  fine: 'mapOxygenMachine',
  worried: 'mapOxygenMachine',
  critical: 'mapOxygenMachineBroken',
};
const PANEL_SPRITES: Record<Mood, SpriteKey> = {
  fine: 'mapPanelClean',
  worried: 'mapPanelDirty',
  critical: 'mapPanelDirty',
};

function moodOf(value: number): Mood {
  if (value < ALERT_BALANCE.lowStatThreshold) return 'critical';
  if (value < ALERT_BALANCE.worriedStatThreshold) return 'worried';
  return 'fine';
}

export class MapStatusSprites {
  private readonly lettuces: Phaser.GameObjects.Image[];
  private readonly machine: Phaser.GameObjects.Image;
  private readonly panels: Phaser.GameObjects.Image[];

  constructor(scene: Phaser.Scene) {
    const standOn = (point: Point, key: SpriteKey) =>
      addSprite(scene, point.x, point.y, key).setOrigin(0.5, 1);
    this.machine = standOn(MAP_OXYGEN_MACHINE, MACHINE_SPRITES.fine);
    this.lettuces = MAP_LETTUCE_BEDS.map((point) => standOn(point, LETTUCE_SPRITES.fine));
    this.panels = MAP_SOLAR_PANELS.map((point) => standOn(point, PANEL_SPRITES.fine));
  }

  update(stats: Record<StatId, number>): void {
    this.machine.setTexture(MACHINE_SPRITES[moodOf(stats.oxygen)]);
    const lettuce = LETTUCE_SPRITES[moodOf(stats.food)];
    this.lettuces.forEach((image) => image.setTexture(lettuce));
    const panel = PANEL_SPRITES[moodOf(stats.energy)];
    this.panels.forEach((image) => image.setTexture(panel));
  }
}
