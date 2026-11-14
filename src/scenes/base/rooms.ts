import type { TaskId } from '../../core/types';
import { COLORS } from '../../ui/palette';

export interface RoomLayout {
  taskId: TaskId;
  icon: string;
  color: number;
  x: number;
  y: number;
}

export const ROOM_WIDTH = 260;
export const ROOM_HEIGHT = 130;

/** Placeholder 2x2 layout until the Tiled map exists. Positions are room centers. */
export const ROOMS: readonly RoomLayout[] = [
  { taskId: 'oxygen-factory', icon: '💨', color: COLORS.oxygen, x: 170, y: 125 },
  { taskId: 'solar-panels', icon: '⚡', color: COLORS.energy, x: 470, y: 125 },
  { taskId: 'greenhouse', icon: '🥬', color: COLORS.food, x: 170, y: 275 },
  { taskId: 'shield-wall', icon: '☢️', color: COLORS.shield, x: 470, y: 275 },
];

/** The corridor in the middle where idle astronauts wait. */
export const HUB_POSITION = { x: 320, y: 200 } as const;

export function getRoom(taskId: TaskId): RoomLayout {
  const room = ROOMS.find((candidate) => candidate.taskId === taskId);
  if (!room) throw new Error(`No room for task: ${taskId}`);
  return room;
}
