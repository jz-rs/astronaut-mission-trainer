import Phaser from 'phaser';
import { GREENHOUSE_BALANCE } from '../../config/balance';
import type { Point, Rect } from '../../ui/layout';
import { showGestureHint } from '../gestureHint';
import { showHowToCard } from '../howTo/howToCard';
import { StepGuide } from '../howTo/stepGuide';
import { MinigameScene } from '../MinigameScene';
import { addGasBubble } from './greenhouseIcons';
import { GREENHOUSE_STEPS } from './greenhouseRecipe';
import { PlantPot, type Need } from './plantPot';
import { Toolbox } from './toolbox';

/**
 * Spec 09 — The greenhouse: lettuces grow in the beds of the room, in soil brought from Earth
 * (Mars soil is toxic for them), under pink LED lamps like NASA's Veggie on the Space Station.
 * Each plant shows what it needs, water or light, and the kid brings the right tool (drag it,
 * or tap tool then plant).
 * Helped, it grows and gives off O₂; forgotten, it withers.
 * Performance = needs helped / needs asked, + bonus if none withered.
 * Harsher locations = plants ask more often and wait less.
 */
const TOOL_COLUMN_WIDTH = 76;
/**
 * The middle of each of the 6 beds of the greenhouse room picture (every location uses the same
 * room layout), back row first so the front plants are drawn over the back ones.
 */
const BEDS_IN_PICTURE: readonly Point[] = [
  { x: 410, y: 361 },
  { x: 578, y: 404 },
  { x: 717, y: 447 },
  { x: 305, y: 442 },
  { x: 468, y: 490 },
  { x: 650, y: 533 },
];
const OXYGEN_RISE_PX = 40;
const OXYGEN_MS = 900;

export class GreenhouseMinigame extends MinigameScene {
  static readonly KEY = 'GreenhouseMinigame';
  protected readonly instructionKey = 'minigame.greenhouse.instruction';
  private pots: PlantPot[] = [];
  private toolbox: Toolbox | null = null;
  private guide: StepGuide | null = null;
  private nextNeedMs = 0;
  private asked = 0;
  private helped = 0;
  private withered = 0;

  constructor() {
    super(GreenhouseMinigame.KEY);
  }

  protected buildGame(area: Rect): void {
    this.asked = 0;
    this.helped = 0;
    this.withered = 0;
    this.nextNeedMs = 0;
    this.guide = new StepGuide(this, area, GREENHOUSE_STEPS);
    const toolsX = area.x + area.width - TOOL_COLUMN_WIDTH;
    this.pots = this.createPots();
    const toolColumn = { x: toolsX, y: area.y, width: TOOL_COLUMN_WIDTH, height: area.height };
    this.toolbox = new Toolbox(this, toolColumn, (need, x, y) => {
      const pot = this.pots.find((candidate) => candidate.contains(x, y));
      if (pot) this.give(pot, need);
    });
    this.pauseGame();
    const howTo = {
      titleKey: 'minigame.greenhouse.introTitle',
      startKey: 'minigame.greenhouse.start',
      steps: GREENHOUSE_STEPS,
    } as const;
    showHowToCard(this, area, howTo, () => this.resumeGame());
  }

  private createPots(): PlantPot[] {
    return BEDS_IN_PICTURE.map(({ x, y }) => {
      const pot = new PlantPot(this, this.roomPoint(x, y));
      pot.body.on('pointerdown', () => {
        const selected = this.toolbox?.selected;
        if (selected) this.give(pot, selected);
      });
      return pot;
    });
  }

  protected calculatePerformance(): number {
    if (this.asked === 0) return 1;
    const bonus = this.withered === 0 ? GREENHOUSE_BALANCE.noWitheredBonus : 0;
    return this.helped / this.asked + bonus;
  }

  protected updateGame(deltaMs: number): void {
    const waitLimitMs = GREENHOUSE_BALANCE.needLastsMs / this.difficulty;
    for (const pot of this.pots) {
      if (pot.state !== 'needy') continue;
      pot.waitedMs += deltaMs;
      if (pot.waitedMs >= waitLimitMs) {
        this.withered += 1;
        pot.wither();
      }
    }
    this.nextNeedMs -= deltaMs;
    if (this.nextNeedMs <= 0) {
      this.nextNeedMs = GREENHOUSE_BALANCE.needEveryMs / this.difficulty;
      this.askForSomething();
    }
    if (this.pots.every((pot) => pot.state === 'withered')) this.finish();
  }

  private askForSomething(): void {
    const healthy = this.pots.filter((pot) => pot.state === 'healthy');
    const pot = Phaser.Utils.Array.GetRandom(healthy);
    if (!pot) return;
    const need: Need = Math.random() < GREENHOUSE_BALANCE.lightNeedShare ? 'light' : 'water';
    this.asked += 1;
    pot.ask(need);
    // The very first time, a ghost finger shows how to bring the tool to the plant.
    if (this.asked === 1 && this.toolbox)
      showGestureHint(this, this.toolbox.homeOf(need), pot.center);
  }

  private give(pot: PlantPot, need: Need): void {
    if (this.isFinished || !pot.help(need)) return;
    this.helped += 1;
    this.guide?.show(2);
    this.giveOffOxygen(pot);
  }

  /** A healthy plant takes CO₂ from the air and gives off O₂: a blue bubble rises from it. */
  private giveOffOxygen(pot: PlantPot): void {
    const { x, y } = pot.top;
    const bubble = addGasBubble(this, 'o2').setPosition(x, y).setDepth(3);
    this.tweens.add({
      targets: bubble,
      y: y - OXYGEN_RISE_PX,
      alpha: 0,
      duration: OXYGEN_MS,
      onComplete: () => {
        bubble.destroy();
        this.guide?.show(3);
      },
    });
  }
}
