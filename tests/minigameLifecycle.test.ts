/** Check pause, cancellation and delayed exit behavior without a browser or Phaser renderer. */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MinigameScene } from '../src/minigames/MinigameScene';

const callbacks = vi.hoisted(() => ({ exit: () => {}, continue: () => {} }));

vi.mock('phaser', () => ({
  default: {
    Scene: class {
      private basePaused = false;
      scene = {
        isActive: () => !this.basePaused,
        isPaused: () => this.basePaused,
        pause: vi.fn(() => {
          this.basePaused = true;
        }),
        resume: vi.fn(() => {
          this.basePaused = false;
        }),
        stop: vi.fn(),
      };
      add = {
        rectangle: () => ({
          setOrigin() {
            return this;
          },
          setAlpha() {
            return this;
          },
          setInteractive() {
            return this;
          },
        }),
        graphics: () => ({
          clear() {
            return this;
          },
          fillStyle() {
            return this;
          },
          fillRect() {
            return this;
          },
        }),
      };
    },
  },
}));
vi.mock('../src/ui/techFrame', () => ({ drawTechPanel: vi.fn(), addScanlines: vi.fn() }));
vi.mock('../src/ui/iconLabel', () => ({ addIconLabel: vi.fn() }));
vi.mock('../src/ui/closeButton', () => ({
  addCloseButton: (_scene: unknown, onExit: () => void) => {
    callbacks.exit = onExit;
    return { setVisible: vi.fn() };
  },
}));
vi.mock('../src/minigames/resultCard', () => ({
  showResultCard: (
    _scene: unknown,
    _task: unknown,
    _performance: number,
    onContinue: () => void,
  ) => {
    callbacks.continue = onContinue;
  },
}));

class TestMission extends MinigameScene {
  protected readonly instructionKey = 'minigame.solar-panels.instruction';
  updates = 0;
  backgrounds = 0;
  afterCrossing: (() => void) | null = null;
  constructor() {
    super('test');
  }
  protected buildGame(): void {}
  protected calculatePerformance(): number {
    return 0.8;
  }
  protected drawBackground(): void {
    this.backgrounds++;
  }
  protected updateGame(): void {
    this.updates++;
  }
  protected playExitTransition(done: () => void): void {
    this.afterCrossing = done;
  }
  explain(): void {
    this.pauseGame();
  }
  play(): void {
    this.resumeGame();
  }
  complete(): void {
    this.finish();
  }
  get acceptsInput(): boolean {
    return this.isPlaying;
  }
}

describe('minigame lifecycle with an airlock', () => {
  let mission: TestMission;
  const onFinish = vi.fn();
  const onExit = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    mission = new TestMission();
    mission.init({ taskId: 'solar-panels', difficulty: 1, onFinish, onExit });
    mission.create();
  });

  it('uses the mission background hook and freezes input and clock during explanations', () => {
    expect(mission.backgrounds).toBe(1);
    mission.explain();
    mission.update(0, 12_000);
    expect(mission.acceptsInput).toBe(false);
    expect(mission.updates).toBe(0);
    expect(onFinish).not.toHaveBeenCalled();
    mission.play();
    mission.update(0, 16);
    expect(mission.acceptsInput).toBe(true);
    expect(mission.updates).toBe(1);
  });

  it('keeps the result paused until the return crossing finishes, then reports once', () => {
    mission.complete();
    callbacks.continue();
    expect(mission.acceptsInput).toBe(false);
    expect(mission.scene.isPaused('BaseScene')).toBe(true);
    expect(onFinish).not.toHaveBeenCalled();
    mission.afterCrossing?.();
    expect(onFinish).toHaveBeenCalledExactlyOnceWith({ taskId: 'solar-panels', performance: 0.8 });
    expect(mission.scene.resume).toHaveBeenCalledOnce();
    expect(mission.scene.stop).toHaveBeenCalledOnce();
  });

  it('cancels from the explanation without rewarding or leaving the base paused', () => {
    mission.explain();
    callbacks.exit();
    callbacks.exit();
    expect(onExit).not.toHaveBeenCalled();
    mission.afterCrossing?.();
    expect(onExit).toHaveBeenCalledOnce();
    expect(onFinish).not.toHaveBeenCalled();
    expect(mission.scene.isPaused('BaseScene')).toBe(false);
  });

  it('leaves the base running when the X pauses and resumes it in the same frame', () => {
    // Phaser applies pause/resume of another scene at the end of the frame, in order.
    const queuedSceneChanges: Array<() => void> = [];
    const pause = vi.mocked(mission.scene.pause);
    const resume = vi.mocked(mission.scene.resume);
    const pauseNow = pause.getMockImplementation();
    const resumeNow = resume.getMockImplementation();
    pause.mockImplementation((key) => {
      queuedSceneChanges.push(() => pauseNow?.(key));
      return mission.scene;
    });
    resume.mockImplementation((key) => {
      queuedSceneChanges.push(() => resumeNow?.(key));
      return mission.scene;
    });
    callbacks.exit();
    mission.afterCrossing?.();
    queuedSceneChanges.splice(0).forEach((applyChange) => applyChange());
    expect(onExit).toHaveBeenCalledOnce();
    expect(mission.scene.isPaused('BaseScene')).toBe(false);
  });
});
