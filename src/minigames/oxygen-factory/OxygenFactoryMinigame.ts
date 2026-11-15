import Phaser from 'phaser';
import { OXYGEN_FACTORY_BALANCE } from '../../config/balance';
import { t } from '../../i18n';
import { floatText } from '../../ui/floatingText';
import type { Rect } from '../../ui/layout';
import { PALETTE, STAT_COLORS } from '../../ui/palette';
import { showGestureHint } from '../gestureHint';
import { showHowToCard } from '../howTo/howToCard';
import { StepGuide } from '../howTo/stepGuide';
import { MinigameScene } from '../MinigameScene';
import { MoxieWindow } from './moxieWindow';
import { OXYGEN_STEPS } from './oxygenRecipe';
import { OxygenStation } from './oxygenStation';
import { isDecoy, rejectDecoy, spawnDecoys } from './decoys';
import { createPiece, floatPieces, randomSpot, type Piece } from './pieces';

/**
 * Spec 08 — The air factory, like MOXIE on the Perseverance rover. The kid only feeds MOXIE:
 * drag (or tap) each CO₂ of the Martian air into it. Through MOXIE's window the kid sees the
 * rest happen by itself, as in the real machine: the CO₂ breaks, the CO goes out as smoke,
 * and every 2 O make one O₂ that goes to the tank (2 CO₂ → 2 CO + O₂).
 * N₂ and Ar float around too, like in the real Martian air: MOXIE spits them back (decoys.ts).
 * Performance = CO₂ fed / CO₂ needed, with a speed bonus, minus a bit per decoy fed.
 * Harsher locations = faster molecules.
 */
const PLAY_MARGIN = 20;
/** A finger that moves less than this between press and release tapped instead of dragging. */
const TAP_DISTANCE = 8;
const FLY_MS = 250;
/** "1 more CO₂!" shows up just left of MOXIE, away from its labels and the vent. */
const WAITING_OFFSET_X = 70;
const POP_OFFSET_Y = 30;
/** Pulls "+1 O₂!" a bit left so it is not cut by the frame next to the tank. */
const POP_OFFSET_X = 24;

export class OxygenFactoryMinigame extends MinigameScene {
  static readonly KEY = 'OxygenFactoryMinigame';
  protected readonly instructionKey = 'minigame.oxygen-factory.instruction';
  private pieces: Piece[] = [];
  private spawnedCarbon = 0;
  private carbonFed = 0;
  private oxygenStored = 0;
  private decoysFed = 0;
  private station: OxygenStation | null = null;
  private moxie: MoxieWindow | null = null;
  private guide: StepGuide | null = null;
  private playArea = new Phaser.Geom.Rectangle();

  constructor() {
    super(OxygenFactoryMinigame.KEY);
  }

  private get carbonNeeded(): number {
    return OXYGEN_FACTORY_BALANCE.oxygenGoal * 2;
  }

  private get moleculeSpeed(): number {
    return OXYGEN_FACTORY_BALANCE.moleculeSpeed * this.difficulty;
  }

  protected buildGame(area: Rect): void {
    this.pieces = [];
    this.spawnedCarbon = 0;
    this.carbonFed = 0;
    this.oxygenStored = 0;
    this.decoysFed = 0;
    const station = new OxygenStation(this, area);
    this.station = station;
    this.moxie = new MoxieWindow(this, station);
    this.guide = new StepGuide(this, area, OXYGEN_STEPS);
    const playWidth = station.machine.left - this.guide.right - PLAY_MARGIN;
    this.playArea.setTo(this.guide.right, area.y, playWidth, area.height);
    for (let index = 0; index < OXYGEN_FACTORY_BALANCE.moleculesOnScreen; index += 1) {
      this.spawnCarbonDioxide();
    }
    this.pieces.push(...spawnDecoys(this, this.playArea, this.moleculeSpeed));
    this.input.on('drag', this.handleDrag, this);
    this.input.on('dragend', this.handleDrop, this);
    this.pauseGame();
    const howTo = {
      titleKey: 'minigame.oxygen-factory.introTitle',
      startKey: 'minigame.oxygen-factory.start',
      steps: OXYGEN_STEPS,
    } as const;
    showHowToCard(this, howTo, () => this.startPlaying(station));
  }

  /** After the intro: the game goes on and a ghost finger shows the first move. */
  private startPlaying(station: OxygenStation): void {
    this.resumeGame();
    const first = this.pieces[0]?.body;
    if (!first) return;
    const machineCenter = { x: station.machine.centerX, y: station.machine.centerY };
    showGestureHint(this, { x: first.x, y: first.y }, machineCenter);
  }

  protected calculatePerformance(): number {
    const completion = this.withSpeedBonus(Math.min(1, this.carbonFed / this.carbonNeeded));
    return Math.max(0, completion - this.decoysFed * OXYGEN_FACTORY_BALANCE.decoyPenalty);
  }

  protected updateGame(deltaMs: number): void {
    floatPieces(this.pieces, this.playArea, deltaMs / 1000);
  }

  private spawnCarbonDioxide(): void {
    if (this.spawnedCarbon >= this.carbonNeeded) return;
    this.spawnedCarbon += 1;
    const { x, y } = randomSpot(this.playArea);
    this.pieces.push(createPiece(this, 'co2', x, y, this.moleculeSpeed));
  }

  private findPiece(target: Phaser.GameObjects.GameObject): Piece | undefined {
    return this.pieces.find((piece) => piece.body === target);
  }

  private handleDrag(
    _pointer: Phaser.Input.Pointer,
    target: Phaser.GameObjects.GameObject,
    x: number,
    y: number,
  ): void {
    const piece = this.findPiece(target);
    if (!piece || this.isFinished) return;
    piece.busy = true;
    piece.body.setPosition(x, y);
  }

  /** Tapped: it flies into MOXIE. Dragged: it goes in only if it was let go on the machine. */
  private handleDrop(pointer: Phaser.Input.Pointer, target: Phaser.GameObjects.GameObject): void {
    const piece = this.findPiece(target);
    const station = this.station;
    // A piece already flying ignores a second "let go", or one CO₂ would go in twice.
    if (!piece?.body.input?.enabled || this.isFinished || !station) return;
    piece.busy = false;
    const { centerX, centerY } = station.machine;
    if (pointer.getDistance() < TAP_DISTANCE) this.flyTo(piece, centerX, centerY);
    else if (station.isOnMachine(piece.body.x, piece.body.y)) this.feedMoxie(piece);
  }

  private flyTo(piece: Piece, x: number, y: number): void {
    piece.busy = true;
    piece.body.disableInteractive();
    const onComplete = () => this.feedMoxie(piece);
    this.tweens.add({ targets: piece.body, x, y, duration: FLY_MS, onComplete });
  }

  /** The CO₂ goes into MOXIE; what happens inside is shown through its window. */
  private feedMoxie(piece: Piece): void {
    if (!this.pieces.includes(piece) || !this.moxie) return;
    if (isDecoy(piece)) {
      this.decoysFed += 1;
      rejectDecoy(this, piece, this.playArea);
      return;
    }
    this.pieces = this.pieces.filter((candidate) => candidate !== piece);
    piece.body.destroy();
    this.carbonFed += 1;
    this.guide?.show(2);
    this.moxie.feed(
      () => this.announceWaiting(),
      (oxygen) => this.storeOxygen(oxygen),
    );
    this.spawnCarbonDioxide();
  }

  /** A new O₂ goes to the tank; the game ends when the tank is full. */
  private storeOxygen(oxygen: Phaser.GameObjects.Container): void {
    const station = this.station;
    if (!station) return;
    this.guide?.show(3);
    station.storeOxygen(oxygen, () => {
      this.oxygenStored += 1;
      station.setTankLevel(this.oxygenStored);
      this.guide?.show(4);
      const { centerX, top } = station.tank;
      this.announce(
        'minigame.oxygen-factory.madePop',
        STAT_COLORS.oxygen,
        centerX - POP_OFFSET_X,
        top - POP_OFFSET_Y,
      );
      if (this.oxygenStored >= OXYGEN_FACTORY_BALANCE.oxygenGoal) this.finish();
    });
  }

  private announceWaiting(): void {
    const machine = this.station?.machine;
    if (!machine) return;
    const x = machine.left - WAITING_OFFSET_X;
    this.announce('minigame.oxygen-factory.needOneMore', PALETTE.white, x, machine.top);
  }

  private announce(
    key: 'minigame.oxygen-factory.needOneMore' | 'minigame.oxygen-factory.madePop',
    color: number,
    x: number,
    y: number,
  ): void {
    if (!this.isFinished) floatText(this, x, y, t(key), color);
  }
}
