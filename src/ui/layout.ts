/** Base resolution. Phaser scales it to fit any landscape phone screen. */
export const GAME_WIDTH = 640;
export const GAME_HEIGHT = 360;

/** Minimum touch target for small hands (in game pixels, ~56 CSS px on a phone). */
export const MIN_TOUCH_SIZE = 48;

export const FONT_FAMILY = '"Press Start 2P", monospace';

export const FONT_SIZES = {
  small: '8px',
  normal: '12px',
  large: '20px',
  title: '28px',
} as const;
