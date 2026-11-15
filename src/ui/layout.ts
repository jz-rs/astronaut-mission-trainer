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

/** Astronaut sprites are 54×80 files shown at half size (~27×40), like the rest of the kit. */
export const ASTRONAUT_SCALE = 0.5;

/** Emoji version of the bar icons, for icons inside a line of text (the sprites are in ui/sprites.ts). */
export const STAT_ICONS: Record<StatId, string> = {
  oxygen: '💨',
  food: '🥬',
  shield: '☢️',
  energy: '⚡',
};

/** Minigames open as a panel over the base, leaving the HUD visible so the bar visibly rises (spec 06). */
export const MINIGAME_PANEL: Rect = { x: 48, y: 50, width: 544, height: 302 };
export const MINIGAME_AREA: Rect = { x: 60, y: 96, width: 520, height: 248 };

/**
 * The base (spec 04): the isometric map `fondos/mapa-base.png`, 4 rooms around an X-shaped corridor.
 * Points were measured on the image (texture pixel ÷ 2, + BASE_MAP_OFFSET_Y). Astronaut spots are
 * where their feet stand. Walking always goes room door → corridor center → room door, so it
 * follows the corridor arms and never crosses the Mars ground.
 */
export const BASE_MAP_OFFSET_Y = 20;
export const CORRIDOR_CENTER: Point = { x: 320, y: 192 };

export interface RoomLayout {
  /** Touch area, also used to center floating texts and the lever panel. */
  rect: Rect;
  /** End of the corridor arm that leads into the room. */
  door: Point;
  /** Where the crew works; each crew member stands one `workStep` further along the floor. */
  workCenter: Point;
  workStep: Point;
  /** Icon and name of the room. */
  label: Point;
}

export const ROOM_LAYOUTS: Record<TaskId, RoomLayout> = {
  'oxygen-factory': {
    rect: { x: 80, y: 44, width: 200, height: 132 },
    door: { x: 232, y: 146 },
    workCenter: { x: 182, y: 122 },
    workStep: { x: 8, y: -4 },
    label: { x: 180, y: 58 },
  },
  greenhouse: {
    rect: { x: 366, y: 44, width: 194, height: 140 },
    door: { x: 415, y: 149 },
    workCenter: { x: 457, y: 157 },
    workStep: { x: 8, y: -4 },
    label: { x: 465, y: 58 },
  },
  'shield-wall': {
    rect: { x: 72, y: 196, width: 180, height: 150 },
    door: { x: 235, y: 232 },
    workCenter: { x: 167, y: 280 },
    workStep: { x: 6, y: -3 },
    label: { x: 162, y: 206 },
  },
  'solar-panels': {
    rect: { x: 392, y: 210, width: 230, height: 136 },
    door: { x: 402, y: 237 },
    workCenter: { x: 450, y: 285 },
    workStep: { x: 8, y: 4 },
    label: { x: 480, y: 220 },
  },
};

/** Where the player waits when not working: the middle of the corridor. */
export const PLAYER_IDLE_SPOT: Point = { x: 320, y: 196 };

export const WALK_SPEED_PX_PER_SECOND = 150;

/** Where idle bots wait, on the corridor arms next to the center (spec 05). */
export const BOT_IDLE_SPOTS: readonly Point[] = [
  { x: 298, y: 181 },
  { x: 342, y: 181 },
  { x: 298, y: 203 },
];

/** State sprites drawn on the map (`sprites/mapa/`), feet points like the astronauts. */
export const MAP_OXYGEN_MACHINE: Point = { x: 222, y: 110 };
export const MAP_LETTUCE_BEDS: readonly Point[] = [
  { x: 440, y: 128 },
  { x: 465, y: 140 },
  { x: 467, y: 116 },
  { x: 492, y: 127 },
];
export const MAP_SOLAR_PANELS: readonly Point[] = [
  { x: 24, y: 296 },
  { x: 48, y: 308 },
  { x: 72, y: 320 },
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

/** Rover garage outside the airlock of the corridor (spec 15); the player waits at the airlock. */
export const GARAGE_RECT: Rect = { x: 242, y: 318, width: 112, height: 30 };
export const GARAGE_SPOT: Point = { x: 360, y: 212 };

/**
 * Spec 18 — Ship cabin, mission tablet, destination console and landing.
 * The art (`sprites/cabina/`) is 1280×720 shown at SPRITE_SCALE; its screens are transparent
 * holes, so whatever is drawn behind them (photos, screen content) shows through the glass.
 */
export const CABIN_WINDOW: Rect = { x: 261, y: 75, width: 118, height: 77 };
/** Center screen of the dashboard, under the window: tapping it picks the destination. */
export const CABIN_DASHBOARD_SCREEN: Rect = { x: 301, y: 155, width: 40, height: 13 };
export const CABIN_TABLET_SCREEN: Rect = { x: 49, y: 221, width: 79, height: 39 };
/**
 * The tablet lies on the table in perspective: its screen is a slanted quad, measured from the
 * art. Its long side goes from `left` up to `top`; its short side from `left` down to `bottom`.
 */
export const CABIN_TABLET_QUAD = {
  left: { x: 48, y: 249.5 },
  top: { x: 91.5, y: 222.5 },
  right: { x: 128, y: 231.5 },
  bottom: { x: 85, y: 262 },
} as const;
/** Touch areas of the objects a kid can tap in the cabin. */
export const CABIN_TABLET_ZONE: Rect = { x: 24, y: 204, width: 138, height: 74 };
export const CABIN_DASHBOARD_ZONE: Rect = { x: 262, y: 146, width: 116, height: 54 };
/** Edge of the dashboard screens, for its glowing border when the guide points at it. */
export const CABIN_DASHBOARD_OUTLINE: Rect = { x: 278, y: 151, width: 86, height: 26 };
export const CABIN_GUIDE_SPOT: Point = { x: 125, y: 75 };
/** The guide sprites are cut bigger than the rest of the kit. */
export const CABIN_GUIDE_SCALE = 0.425;
export const CABIN_MESSAGE_PANEL: Rect = { x: 75, y: 266, width: 490, height: 86 };

/** The tablet fills the screen; pages are drawn on its glass. */
export const TABLET_SCREEN: Rect = { x: 89, y: 60, width: 461, height: 239 };

/** Destination console: its 3 screens and the physical buttons (top-left corners). */
export const CONSOLE_BIG_SCREEN: Rect = { x: 193, y: 110, width: 254, height: 141 };
export const CONSOLE_STARS_SCREEN: Rect = { x: 62, y: 193, width: 80, height: 66 };
export const CONSOLE_ROUTE_SCREEN: Rect = { x: 37, y: 291, width: 79, height: 27 };
export const CONSOLE_BUTTONS = {
  back: { x: 162.5, y: 291.5 },
  previous: { x: 223, y: 291 },
  photo: { x: 278, y: 294.5 },
  next: { x: 366.5, y: 291.5 },
  land: { x: 497.5, y: 287 },
  info: { x: 135.5, y: 208 },
} as const satisfies Record<string, Point>;

/** Landing: seated astronauts (top-left corners) on the empty pilot seats of the cabin. */
export const LANDING_WINDOW: Rect = CABIN_WINDOW;
export const LANDING_SEATED_GUIDE: Point = { x: 214, y: 116 };
export const LANDING_SEATED_PLAYER: Point = { x: 340.5, y: 118.5 };
