import { COLORS } from '../../ui/palette';
import { createButton } from '../../ui/Button';
import { MinigameScene } from '../MinigameScene';

export const PLACEHOLDER_SCENE_KEY = 'PlaceholderMinigame';

const TAPS_TO_COMPLETE = 5;

/**
 * Temporary minigame used by tasks whose real minigame is not built yet,
 * so the whole game loop is playable from day one. Delete when all 4 exist.
 */
export class PlaceholderMinigame extends MinigameScene {
  protected readonly instructionKey = 'minigame.placeholder.instruction';
  private taps = 0;

  constructor() {
    super({ key: PLACEHOLDER_SCENE_KEY });
  }

  protected buildGame(): void {
    this.taps = 0;
    const center = this.playArea.centerX;
    const middle = this.playArea.centerY;
    const counter = this.add
      .text(center, middle - 60, `0/${TAPS_TO_COMPLETE}`, { fontSize: '20px' })
      .setOrigin(0.5);

    createButton(this, {
      x: center,
      y: middle + 10,
      width: 120,
      height: 80,
      label: '👆',
      color: COLORS.danger,
      onPress: () => {
        this.taps++;
        counter.setText(`${this.taps}/${TAPS_TO_COMPLETE}`);
        if (this.taps >= TAPS_TO_COMPLETE) this.finish();
      },
    });
  }

  protected measurePerformance(): number {
    return this.taps / TAPS_TO_COMPLETE + (1 - this.timeProgress()) * 0.2;
  }
}
