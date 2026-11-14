import type { StatId, TaskId } from '../core/types';

/**
 * Sizes and positions shared by every scene, in game pixels (the canvas is scaled to the screen).
 * Values follow docs/STYLE_GUIDE.md. Each spec appends its own section below.
 */
export const GAME_WIDTH = 640;
export const GAME_HEIGHT = 360;

export const FONT_FAMILY = '"Press Start 2P", monospace';
export const FONT_SIZE = { small: 8, medium: 12, large: 20, title: 28 } as const;

/** Smallest touch area for a finger on a phone (AGENTS.md §4). */
export const MIN_TOUCH_SIZE = 48;

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export function rectCenter(rect: Rect): Point {
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
}

/** Top band of the base screen with the 4 bars. */
export const HUD_HEIGHT = 44;

/** Placeholder astronauts are drawn at 14×20 and shown at this scale. */
export const ASTRONAUT_SCALE = 2;

/** Icons stay emoji until the pixel-art set from spec 01 arrives. */
export const STAT_ICONS: Record<StatId, string> = {
  oxygen: '💨',
  food: '🥬',
  shield: '☢️',
  energy: '⚡',
};

/** Minigames open as a panel over the base, leaving the HUD visible so the bar visibly rises (spec 06). */
export const MINIGAME_PANEL: Rect = { x: 48, y: 50, width: 544, height: 302 };
export const MINIGAME_AREA: Rect = { x: 60, y: 96, width: 520, height: 248 };

/** The base: 4 rooms around one central corridor (spec 04). */
export const CORRIDOR: Rect = { x: 16, y: 184, width: 608, height: 40 };

export const ROOM_RECTS: Record<TaskId, Rect> = {
  'oxygen-factory': { x: 32, y: 52, width: 268, height: 124 },
  greenhouse: { x: 340, y: 52, width: 268, height: 124 },
  'solar-panels': { x: 32, y: 232, width: 268, height: 120 },
  'shield-wall': { x: 340, y: 232, width: 268, height: 120 },
};

/** Where the player waits when not working. */
export const PLAYER_IDLE_SPOT: Point = { x: 320, y: 204 };

export const WALK_SPEED_PX_PER_SECOND = 150;

/** Where idle bots wait in the corridor (spec 05). */
export const BOT_IDLE_SPOTS: readonly Point[] = [
  { x: 250, y: 204 },
  { x: 390, y: 204 },
  { x: 460, y: 204 },
];

/** Mars map (spec 12): a flat map, longitude → x and latitude → y. */
export const MARS_MAP_RECT: Rect = { x: 40, y: 56, width: 560, height: 236 };

export const MARS_MAP_POINTS: Record<string, Point> = {
  jezero: { x: 440, y: 150 },
  gale: { x: 534, y: 184 },
  'olympus-mons': { x: 112, y: 150 },
  'north-pole': { x: 320, y: 84 },
  'valles-marineris': { x: 228, y: 196 },
};

export const LOCATION_CARD: Rect = { x: 120, y: 40, width: 400, height: 290 };

/** Rover garage at the left end of the corridor (spec 15). */
export const GARAGE_RECT: Rect = { x: 20, y: 186, width: 72, height: 36 };
export const GARAGE_SPOT: Point = { x: 110, y: 204 };
