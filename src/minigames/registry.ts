import type { TaskId } from '../core/types';
import { PLACEHOLDER_SCENE_KEY, PlaceholderMinigame } from './placeholder/PlaceholderMinigame';
import { SOLAR_PANELS_SCENE_KEY, SolarPanelsMinigame } from './solar-panels/SolarPanelsMinigame';

/**
 * Which scene runs for each task. When you finish a minigame:
 *  1. add its class to MINIGAME_SCENES
 *  2. point its task to the new scene key below
 */
export const MINIGAME_SCENES = [SolarPanelsMinigame, PlaceholderMinigame];

export const MINIGAME_SCENE_BY_TASK: Record<TaskId, string> = {
  'oxygen-factory': PLACEHOLDER_SCENE_KEY,
  'solar-panels': SOLAR_PANELS_SCENE_KEY,
  greenhouse: PLACEHOLDER_SCENE_KEY,
  'shield-wall': PLACEHOLDER_SCENE_KEY,
};
