import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, TABLET_SCREEN } from './layout';
import { PALETTE } from './palette';
import { drawScreenScanlines } from './screenUi';
import { SPRITE_SCALE } from './sprites';

/**
 * The mission tablet pops up over the game, like the manual does in the cabin: crises (spec 16)
 * and the how-to and result cards of every minigame are shown on its screen, so everything the
 * kid reads comes from the same device. While it is an alert the screen edges flash black; once
 * the crew decided, the edges glow green (right) or red (wrong). A blocker stops taps from
 * reaching whatever is underneath. The art is loaded by the base (`preloadCrisisArt`), which
 * every minigame opens on top of.
 */
export const TABLET_TEXTURE = 'tablet';

const DIM_ALPHA = 0.6;
const EDGE_WIDTH = 20;
const EDGE_BLINK_MS = 500;
const GLOW_ALPHA = 0.5;
/** The glass goes a bit under the frame, so no sliver of the game peeks between the two. */
const GLASS_BLEED = 3;

export type TabletMood = 'alert' | 'right' | 'wrong' | 'calm';

const MOOD_COLORS: Record<Exclude<TabletMood, 'alert'>, number> = {
  right: PALETTE.green,
  wrong: PALETTE.alert,
  calm: PALETTE.cyan,
};

export class MissionTablet {
  private readonly frame: Phaser.GameObjects.Container;
  private readonly edges: Phaser.GameObjects.Graphics;
  private readonly blink: Phaser.Time.TimerEvent;
  /** What the screen shows now, drawn above the tablet. */
  private readonly screen: Phaser.GameObjects.Container;

  constructor(
    private readonly scene: Phaser.Scene,
    depth: number,
  ) {
    const blocker = scene.add.zone(0, 0, GAME_WIDTH, GAME_HEIGHT).setOrigin(0).setInteractive();
    const dim = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, PALETTE.night, DIM_ALPHA);
    this.edges = scene.add.graphics();
    const glass = scene.add.rectangle(
      TABLET_SCREEN.x - GLASS_BLEED,
      TABLET_SCREEN.y - GLASS_BLEED,
      TABLET_SCREEN.width + GLASS_BLEED * 2,
      TABLET_SCREEN.height + GLASS_BLEED * 2,
      PALETTE.night,
    );
    const tablet = scene.add.image(0, 0, TABLET_TEXTURE).setOrigin(0).setScale(SPRITE_SCALE);
    this.screen = scene.add.container(0, 0);
    this.frame = scene.add.container(0, 0, [
      blocker,
      dim.setOrigin(0),
      this.edges,
      glass.setOrigin(0),
      tablet,
      this.screen,
    ]);
    this.frame.setDepth(depth).setVisible(false);
    this.blink = this.startBlinking();
  }

  /** Only alerts blink; `drawEdges` pauses it for the other moods. */
  private startBlinking(): Phaser.Time.TimerEvent {
    return this.scene.time.addEvent({
      delay: EDGE_BLINK_MS,
      loop: true,
      callback: () => this.edges.setVisible(!this.edges.visible),
    });
  }

  get isVisible(): boolean {
    return this.frame.visible;
  }

  /** Replaces what the screen shows. */
  show(parts: Phaser.GameObjects.GameObject[], mood: TabletMood): void {
    this.clearScreen();
    this.screen.add(parts);
    this.addScanlines();
    this.drawEdges(mood);
    this.frame.setVisible(true);
  }

  /** Adds a part to what the screen already shows (e.g. a button that appears a bit later). */
  addToScreen(part: Phaser.GameObjects.GameObject): void {
    this.screen.addAt(part, this.screen.length - 1); // under the scanlines, which go last
  }

  hide(): void {
    this.clearScreen();
    this.frame.setVisible(false);
  }

  /** For a tablet that is used only once: removes it and its blinking for good. */
  destroy(): void {
    this.clearScreen();
    this.blink.remove();
    this.frame.destroy(true);
  }

  private addScanlines(): void {
    const scanlines = this.scene.add.graphics();
    drawScreenScanlines(scanlines, TABLET_SCREEN);
    this.screen.add(scanlines);
  }

  /** Screens animate their parts: stop those tweens before the parts go away. */
  private clearScreen(): void {
    this.screen.list.forEach((part) => this.scene.tweens.killTweensOf(part));
    this.screen.removeAll(true);
  }

  private drawEdges(mood: TabletMood): void {
    this.blink.paused = mood !== 'alert';
    this.edges.clear().setVisible(true);
    const color = mood === 'alert' ? PALETTE.night : MOOD_COLORS[mood];
    const alpha = mood === 'alert' ? 1 : GLOW_ALPHA;
    this.edges.lineStyle(EDGE_WIDTH * 2, color, alpha).strokeRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  }
}
