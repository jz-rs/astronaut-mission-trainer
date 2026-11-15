import Phaser from 'phaser';
import { ROVER_BALANCE } from '../../config/balance';
import type { Point, Rect } from '../../ui/layout';
import { showGestureHint } from '../gestureHint';
import { RockDrill } from './RockDrill';
import { addCore, drawStopGround } from './roverIcons';
import { SampleShelf } from './SampleShelf';
import { SampleTube } from './SampleTube';

/**
 * Mission 5 — After driving, the rover stores rock samples the way Perseverance does: keep the
 * drill pressed to cut a core, drop the core into the tube, tap the tube to seal it and it goes
 * to the shelf. The first tube is guided (ghost finger and step panel); then the kid fills the
 * next ones alone. A tube left open gets dust inside: "Contaminated!", it does not count.
 * Lives inside the rover scene, which owns the clock and the score.
 */
export interface StorageResult {
  sealed: number;
  contaminated: number;
}

export interface StorageCallbacks {
  /** The how-to step the kid is on (2 = drill, 3 = tube, 4 = shelf), only for the guided tube. */
  onStep: (step: number) => void;
  /** A new tube starts (counted from 1). From the second one, the kid is on their own. */
  onTube: (tube: number, total: number) => void;
  onDone: (result: StorageResult) => void;
}

type StorageState = 'drilling' | 'carrying' | 'sealing' | 'between' | 'done';

const ROCK_OFFSET = { x: 70, y: 150 };
const TUBE_OFFSET = { x: 190, y: 130 };
const TUBE_TOUCH = { width: 56, height: 100 };
const CORE_TOUCH = 48;
const CORE_POP_X = 56;
/** A finger that moves less than this between press and release tapped instead of dragging. */
const TAP_DISTANCE = 8;
const NEXT_TUBE_DELAY_MS = 900;

export class SampleStorage {
  private state: StorageState = 'drilling';
  private readonly result: StorageResult = { sealed: 0, contaminated: 0 };
  private tubeNumber = 0;
  private sealLeftMs = 0;
  private readonly tubeAt: Point;
  private readonly drill: RockDrill;
  private readonly shelf: SampleShelf;
  private readonly tubeCount: number;
  private tube!: SampleTube;
  private core: Phaser.GameObjects.Container | null = null;

  constructor(
    private readonly scene: Phaser.Scene,
    play: Rect,
    caughtRocks: number,
    private readonly callbacks: StorageCallbacks,
  ) {
    drawStopGround(scene, play);
    const rock = { x: play.x + ROCK_OFFSET.x, y: play.y + ROCK_OFFSET.y };
    this.drill = new RockDrill(scene, rock);
    this.tubeAt = { x: play.x + TUBE_OFFSET.x, y: play.y + TUBE_OFFSET.y };
    this.shelf = new SampleShelf(scene, play, caughtRocks);
    this.tubeCount = Math.min(ROVER_BALANCE.tubesPerTrip, this.shelf.freeSlots);
    this.listenToTube();
    this.startTube();
  }

  /** Only the first tube shows the ghost finger and moves the step panel. */
  private get isGuided(): boolean {
    return this.tubeNumber === 1;
  }

  update(deltaMs: number): void {
    if (this.state === 'drilling' && this.drill.update(deltaMs)) this.popCore();
    if (this.state === 'sealing') {
      this.sealLeftMs -= deltaMs;
      if (this.sealLeftMs <= 0) this.contaminate();
    }
  }

  /** Time is up: the tubes already sealed count; the one in the middle does not. */
  stop(): StorageResult {
    this.state = 'done';
    return this.result;
  }

  private startTube(): void {
    this.tubeNumber += 1;
    this.state = 'drilling';
    this.core = null;
    this.drill.reset();
    this.tube = new SampleTube(this.scene, this.tubeAt);
    this.callbacks.onTube(this.tubeNumber, this.tubeCount);
    if (!this.isGuided) return;
    this.callbacks.onStep(2);
    showGestureHint(this.scene, this.drill.touchPoint);
  }

  private listenToTube(): void {
    const { width, height } = TUBE_TOUCH;
    const zone = this.scene.add.zone(this.tubeAt.x, this.tubeAt.y, width, height);
    zone.setInteractive({ useHandCursor: true });
    zone.on('pointerdown', () => {
      if (this.state === 'sealing') this.seal();
    });
  }

  /** The cut core jumps out next to the rock, ready to be carried to the tube. */
  private popCore(): void {
    this.state = 'carrying';
    const { rock } = this.drill;
    const home = { x: rock.x + CORE_POP_X, y: rock.y };
    const core = this.scene.add.container(rock.x, rock.y, [addCore(this.scene)]);
    core.setSize(CORE_TOUCH, CORE_TOUCH).setInteractive({ draggable: true, useHandCursor: true });
    this.scene.tweens.add({ targets: core, x: home.x, y: home.y, duration: 200, ease: 'Back.Out' });
    core.on('drag', (_pointer: Phaser.Input.Pointer, x: number, y: number) =>
      core.setPosition(x, y),
    );
    core.on('dragend', (pointer: Phaser.Input.Pointer) => this.dropCore(pointer, home));
    this.core = core;
    if (!this.isGuided) return;
    this.callbacks.onStep(3);
    showGestureHint(this.scene, home, this.tubeAt);
  }

  /** Tapped, or let go near the tube: in it goes. Anywhere else: back next to the rock. */
  private dropCore(pointer: Phaser.Input.Pointer, home: Point): void {
    const core = this.core;
    if (!core || this.state !== 'carrying') return;
    const tapped = pointer.getDistance() < TAP_DISTANCE;
    const distance = Phaser.Math.Distance.Between(core.x, core.y, this.tubeAt.x, this.tubeAt.y);
    if (tapped || distance <= ROVER_BALANCE.coreSnapDistance) this.insertCore(core);
    else this.scene.tweens.add({ targets: core, x: home.x, y: home.y, duration: 200 });
  }

  private insertCore(core: Phaser.GameObjects.Container): void {
    this.state = 'sealing';
    this.sealLeftMs = ROVER_BALANCE.sealWithinMs;
    this.tube.receive(core);
    if (this.isGuided) showGestureHint(this.scene, this.tube.mouth);
  }

  private seal(): void {
    this.state = 'between';
    this.result.sealed += 1;
    this.tube.seal(this.shelf.nextSlot);
    if (this.isGuided) this.callbacks.onStep(4);
    this.scene.time.delayedCall(NEXT_TUBE_DELAY_MS, () => {
      this.shelf.lightNextSlot();
      this.next();
    });
  }

  private contaminate(): void {
    this.state = 'between';
    this.result.contaminated += 1;
    this.tube.contaminate();
    this.scene.time.delayedCall(NEXT_TUBE_DELAY_MS, () => {
      this.tube.discard();
      this.next();
    });
  }

  /** Another tube, or the end of the trip once every tube of this trip was used. */
  private next(): void {
    if (this.state === 'done') return; // the time ran out meanwhile
    if (this.tubeNumber < this.tubeCount) {
      this.startTube();
      return;
    }
    this.state = 'done';
    this.callbacks.onDone(this.result);
  }
}
