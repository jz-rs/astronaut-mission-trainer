import Phaser from 'phaser';
import { ROVER_BALANCE } from '../../config/balance';
import type { Point } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addSpriteSized } from '../../ui/sprites';
import { addDrill } from './roverIcons';

/**
 * Mission 5 — The rock and the rover's drill. The kid keeps a finger on it: the drill shakes and
 * a bar fills; letting go pauses it (nothing is lost). When the bar is full, the core is cut.
 */
const ROCK_SIZE = 96;
const DRILL_ABOVE_ROCK = 62;
const PROGRESS = { width: 80, height: 6, belowRock: 52 };
const TOUCH = { width: 120, height: 160 };

export class RockDrill {
  private progress = 0;
  /** The finger that pressed the drill; it drills only while that finger stays down. */
  private holder: Phaser.Input.Pointer | null = null;
  private readonly drill: Phaser.GameObjects.Container;
  private readonly bar: Phaser.GameObjects.Graphics;

  constructor(
    scene: Phaser.Scene,
    readonly rock: Point,
  ) {
    addSpriteSized(scene, rock.x, rock.y, 'rock', ROCK_SIZE);
    this.drill = addDrill(scene).setPosition(rock.x, rock.y - DRILL_ABOVE_ROCK);
    this.bar = scene.add.graphics();
    const zone = scene.add.zone(this.touchPoint.x, this.touchPoint.y, TOUCH.width, TOUCH.height);
    zone.setInteractive({ useHandCursor: true });
    zone.on('pointerdown', (pointer: Phaser.Input.Pointer) => (this.holder = pointer));
    this.drawBar();
  }

  /** A new core from the same rock: the bar starts empty and the drill waits for a new press. */
  reset(): void {
    this.progress = 0;
    this.holder = null;
    this.drill.setX(this.rock.x);
    this.drawBar();
  }

  /** Where the ghost finger presses. */
  get touchPoint(): Point {
    return { x: this.rock.x, y: this.rock.y - DRILL_ABOVE_ROCK / 2 };
  }

  /** Drills while held; true once the core is cut. */
  update(deltaMs: number): boolean {
    if (!this.holder?.isDown || this.progress >= 1) return this.progress >= 1;
    this.progress = Math.min(1, this.progress + deltaMs / ROVER_BALANCE.drillHoldMs);
    const shake = this.progress < 1 ? Phaser.Math.Between(-1, 1) : 0;
    this.drill.setX(this.rock.x + shake);
    this.drawBar();
    return this.progress >= 1;
  }

  private drawBar(): void {
    const left = this.rock.x - PROGRESS.width / 2;
    const top = this.rock.y + PROGRESS.belowRock;
    this.bar.clear();
    this.bar.fillStyle(PALETTE.metalDark, 1).fillRect(left, top, PROGRESS.width, PROGRESS.height);
    this.bar.fillStyle(PALETTE.sun, 1);
    this.bar.fillRect(left, top, PROGRESS.width * this.progress, PROGRESS.height);
  }
}
