import Phaser from 'phaser';
import { OXYGEN_FACTORY_BALANCE } from '../../config/balance';
import type { Rect } from '../../ui/layout';
import { sparkleAt } from '../../ui/sparkle';
import { showGestureHint } from '../gestureHint';
import { MinigameScene } from '../MinigameScene';
import { addMolecule, type MoleculeKind } from './molecules';
import { OxygenStation } from './oxygenStation';

/**
 * Spec 08 — "Break the molecule", like MOXIE on the Perseverance rover:
 *   1. drag (or tap) a CO₂ into MOXIE: it comes out split, the CO goes outside through the pipe
 *      and one loose O stays;
 *   2. join two loose O (drag one onto the other, or tap one): they make O₂, which fills the tank.
 * 2 CO₂ → 2 CO + O₂, the real reaction. Performance = O₂ made / goal (a loose O counts half),
 * with a speed bonus. Harsher locations = faster molecules.
 */
const PLAY_MARGIN = 20;
/** A finger that moves less than this between press and release tapped instead of dragging. */
const TAP_DISTANCE = 8;
const FLY_MS = 250;
const VENT_MS = 700;
const TANK_MS = 450;
const SHAKE_PIXELS = 4;

interface Piece {
  kind: MoleculeKind;
  body: Phaser.GameObjects.Container;
  velocity: Phaser.Math.Vector2;
  /** Being dragged or flying: it stops floating and can't be grabbed twice. */
  busy: boolean;
}

export class OxygenFactoryMinigame extends MinigameScene {
  static readonly KEY = 'OxygenFactoryMinigame';
  protected readonly instructionKey = 'minigame.oxygen-factory.instruction';
  private pieces: Piece[] = [];
  private spawnedCarbon = 0;
  private oxygenMade = 0;
  private station: OxygenStation | null = null;
  private playArea = new Phaser.Geom.Rectangle();

  constructor() {
    super(OxygenFactoryMinigame.KEY);
  }

  protected buildGame(area: Rect): void {
    this.pieces = [];
    this.spawnedCarbon = 0;
    this.oxygenMade = 0;
    const station = new OxygenStation(this, area);
    this.station = station;
    this.playArea.setTo(area.x, area.y, station.machine.left - area.x - PLAY_MARGIN, area.height);
    for (let index = 0; index < OXYGEN_FACTORY_BALANCE.moleculesOnScreen; index += 1) {
      this.spawnCarbonDioxide();
    }
    this.input.on('drag', this.handleDrag, this);
    this.input.on('dragend', this.handleDrop, this);
    const first = this.pieces[0]?.body;
    if (first) {
      const machineCenter = { x: station.machine.centerX, y: station.machine.centerY };
      showGestureHint(this, { x: first.x, y: first.y }, machineCenter);
    }
  }

  protected calculatePerformance(): number {
    const looseOxygen = this.pieces.filter((piece) => piece.kind === 'o').length;
    const completion = (this.oxygenMade + looseOxygen / 2) / OXYGEN_FACTORY_BALANCE.oxygenGoal;
    return this.withSpeedBonus(Math.min(1, completion));
  }

  protected updateGame(deltaMs: number): void {
    const seconds = deltaMs / 1000;
    const margin = OXYGEN_FACTORY_BALANCE.atomRadius * 2;
    const { left, right, top, bottom } = this.playArea;
    for (const { body, velocity, busy } of this.pieces) {
      if (busy) continue;
      body.x += velocity.x * seconds;
      body.y += velocity.y * seconds;
      if (body.x < left + margin || body.x > right - margin) velocity.x *= -1;
      if (body.y < top + margin || body.y > bottom - margin) velocity.y *= -1;
      body.x = Phaser.Math.Clamp(body.x, left + margin, right - margin);
      body.y = Phaser.Math.Clamp(body.y, top + margin, bottom - margin);
    }
  }

  private spawnCarbonDioxide(): void {
    if (this.spawnedCarbon >= OXYGEN_FACTORY_BALANCE.oxygenGoal * 2) return;
    this.spawnedCarbon += 1;
    const margin = OXYGEN_FACTORY_BALANCE.atomRadius * 3;
    const x = Phaser.Math.Between(this.playArea.left + margin, this.playArea.right - margin);
    const y = Phaser.Math.Between(this.playArea.top + margin, this.playArea.bottom - margin);
    this.addPiece('co2', x, y);
  }

  private addPiece(kind: MoleculeKind, x: number, y: number): Piece {
    const body = addMolecule(this, kind, x, y);
    body.setInteractive({ draggable: true, useHandCursor: true });
    const speed = OXYGEN_FACTORY_BALANCE.moleculeSpeed * this.difficulty;
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const piece = {
      kind,
      body,
      velocity: new Phaser.Math.Vector2(speed, 0).rotate(angle),
      busy: false,
    };
    this.pieces.push(piece);
    return piece;
  }

  private removePiece(piece: Piece): void {
    this.pieces = this.pieces.filter((candidate) => candidate !== piece);
    piece.body.destroy();
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

  private handleDrop(pointer: Phaser.Input.Pointer, target: Phaser.GameObjects.GameObject): void {
    const piece = this.findPiece(target);
    if (!piece || this.isFinished || !this.station) return;
    const tapped = pointer.getDistance() < TAP_DISTANCE;
    piece.busy = false;
    if (piece.kind === 'co2') this.dropCarbonDioxide(piece, this.station, tapped);
    else this.dropOxygen(piece, tapped);
  }

  /** Tapped: it flies into MOXIE. Dragged: it splits only if it was let go on the machine. */
  private dropCarbonDioxide(piece: Piece, station: OxygenStation, tapped: boolean): void {
    const { centerX, centerY } = station.machine;
    if (tapped) this.flyTo(piece, centerX, centerY, () => this.split(piece));
    else if (station.isOnMachine(piece.body.x, piece.body.y)) this.split(piece);
  }

  /** Tapped: it looks for any other O. Dragged: it joins the O it was let go on. */
  private dropOxygen(piece: Piece, tapped: boolean): void {
    const partner = this.findPartner(
      piece,
      tapped ? Infinity : OXYGEN_FACTORY_BALANCE.joinDistance,
    );
    if (!partner && tapped) this.shake(piece);
    if (!partner) return;
    if (tapped) this.flyTo(piece, partner.body.x, partner.body.y, () => this.join(piece, partner));
    else this.join(piece, partner);
  }

  /** The closest other loose O within reach. */
  private findPartner(piece: Piece, reach: number): Piece | undefined {
    const distance = (other: Piece) =>
      Phaser.Math.Distance.Between(piece.body.x, piece.body.y, other.body.x, other.body.y);
    return this.pieces
      .filter(
        (other) => other !== piece && other.kind === 'o' && !other.busy && distance(other) <= reach,
      )
      .sort((first, second) => distance(first) - distance(second))[0];
  }

  private flyTo(piece: Piece, x: number, y: number, onArrive: () => void): void {
    piece.busy = true;
    piece.body.disableInteractive();
    this.tweens.add({ targets: piece.body, x, y, duration: FLY_MS, onComplete: onArrive });
  }

  /** "Needs a partner": a loose O alone can't become O₂. */
  private shake(piece: Piece): void {
    this.tweens.add({
      targets: piece.body,
      x: piece.body.x + SHAKE_PIXELS,
      duration: 50,
      yoyo: true,
      repeat: 2,
    });
  }

  /** MOXIE takes one O out of the CO₂: the CO goes outside and the O comes back to play. */
  private split(piece: Piece): void {
    const station = this.station;
    if (!station) return;
    this.removePiece(piece);
    station.switchOn();
    sparkleAt(this, station.machine.centerX, station.machine.centerY, 'popFlash');
    const carbonMonoxide = addMolecule(this, 'co', station.ventExit.x, station.machine.top);
    this.tweens.add({
      targets: carbonMonoxide,
      y: station.ventExit.y,
      alpha: 0,
      duration: VENT_MS,
      onComplete: () => carbonMonoxide.destroy(),
    });
    const oxygen = this.addPiece('o', station.outlet.x, station.outlet.y);
    const landingX = Phaser.Math.Between(this.playArea.centerX, this.playArea.right - PLAY_MARGIN);
    this.flyTo(oxygen, landingX, station.outlet.y, () => {
      oxygen.busy = false;
      oxygen.body.setInteractive();
    });
    this.spawnCarbonDioxide();
  }

  /** Two O make one O₂, which flies into the tank. */
  private join(first: Piece, second: Piece): void {
    const station = this.station;
    if (!station) return;
    const { x, y } = second.body;
    this.removePiece(first);
    this.removePiece(second);
    sparkleAt(this, x, y, 'popFlash');
    const oxygen = addMolecule(this, 'o2', x, y);
    this.oxygenMade += 1;
    this.tweens.add({
      targets: oxygen,
      x: station.tank.centerX,
      y: station.tank.centerY,
      scale: 0.5,
      duration: TANK_MS,
      onComplete: () => oxygen.destroy(),
    });
    station.setTankLevel(this.oxygenMade);
    if (this.oxygenMade >= OXYGEN_FACTORY_BALANCE.oxygenGoal) this.finish();
  }
}
