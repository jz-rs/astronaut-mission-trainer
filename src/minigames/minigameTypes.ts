/** Shared inputs and results keep scene implementations independent of the base. */
import type { TaskId } from '../core/types';

export interface MinigameResult {
  taskId: TaskId;
  performance: number;
}

export interface MinigameEnvironment {
  solElapsedMs: number;
  nightAmount: number;
  dustStorm: boolean;
}

export interface MinigameStartData {
  taskId: TaskId;
  /** Location decay multiplier, used to choose visual and mechanical difficulty. */
  difficulty: number;
  locationId?: string;
  nightAmount?: number;
  /** Read-only presentation data; actions remain the only way to change the base. */
  readEnvironment?: () => MinigameEnvironment;
  onFinish: (result: MinigameResult) => void;
  onExit?: () => void;
}
