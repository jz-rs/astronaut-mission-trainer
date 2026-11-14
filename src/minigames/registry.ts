import type { TaskId } from '../core/types';
import { GreenhouseMinigame } from './greenhouse/GreenhouseMinigame';
import type { MinigameScene } from './MinigameScene';
import { OxygenFactoryMinigame } from './oxygen-factory/OxygenFactoryMinigame';
import { ShieldWallMinigame } from './shield-wall/ShieldWallMinigame';
import { SolarPanelsMinigame } from './solar-panels/SolarPanelsMinigame';

/**
 * Which minigame opens in each room. Adding a minigame = one line here.
 * A room without its real minigame yet uses PlaceholderMinigame ("tap 5 times").
 */
export interface MinigameEntry {
  key: string;
  scene: new () => MinigameScene;
}

export const MINIGAME_REGISTRY: Record<TaskId, MinigameEntry> = {
  'solar-panels': { key: SolarPanelsMinigame.KEY, scene: SolarPanelsMinigame },
  'oxygen-factory': { key: OxygenFactoryMinigame.KEY, scene: OxygenFactoryMinigame },
  greenhouse: { key: GreenhouseMinigame.KEY, scene: GreenhouseMinigame },
  'shield-wall': { key: ShieldWallMinigame.KEY, scene: ShieldWallMinigame },
};

/** Unique lists: several rooms may share the placeholder scene. */
export const MINIGAME_SCENES = [
  ...new Set(Object.values(MINIGAME_REGISTRY).map((entry) => entry.scene)),
];
export const MINIGAME_KEYS = [
  ...new Set(Object.values(MINIGAME_REGISTRY).map((entry) => entry.key)),
];
