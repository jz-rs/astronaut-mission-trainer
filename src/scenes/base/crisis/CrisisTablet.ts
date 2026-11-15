import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, TABLET_SCREEN } from '../../../ui/layout';
import { PALETTE } from '../../../ui/palette';
import { drawScreenScanlines } from '../../../ui/screenUi';
import { SPRITE_SCALE } from '../../../ui/sprites';
import { TABLET_TEXTURE } from './crisisArt';

/**
 * Spec 16 — The mission tablet pops up over the base to show a crisis, like the manual does in
 * the cabin. While it is an alert the screen edges flash black; once the crew decided, the edges
 * glow green (right) or red (wrong). A blocker stops taps from reaching the base underneath.
 */
const DEPTH = 60;
const DIM_ALPHA = 0.6;
const EDGE_WIDTH = 20;
const EDGE_BLINK_MS = 500;
const GLOW_ALPHA = 0.5;

export type TabletMood = 'alert' | 'right' | 'wrong' | 'calm';

const MOOD_COLORS: Record<Exclude<TabletMood, 'alert'>, number> = {
  right: PALETTE.green,
  wrong: PALETTE.alert,
  calm: PALETTE.cyan,
};

export class CrisisTablet {
  private readonly frame: Phaser.GameObjects.Container;
  private readonly edges: Phaser.GameObjects.Graphics;
  private readonly blink: Phaser.Time.TimerEvent;
  /** What the screen shows now, drawn above the tablet. */
  private readonly screen: Phaser.GameObjects.Container;

  constructor(private readonly scene: Phaser.Scene) {
    const blocker = scene.add.zone(0, 0, GAME_WIDTH, GAME_HEIGHT).setOrigin(0).setInteractive();
    const dim = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, PALETTE.night, DIM_ALPHA);
    this.edges = scene.add.graphics();
    const glass = scene.add.rectangle(
      TABLET_SCREEN.x,
      TABLET_SCREEN.y,
      TABLET_SCREEN.width,
      TABLET_SCREEN.height,
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
    this.frame.setDepth(DEPTH).setVisible(false);
    this.blink = scene.time.addEvent({
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
    const scanlines = this.scene.add.graphics();
    drawScreenScanlines(scanlines, TABLET_SCREEN);
    this.screen.add([...parts, scanlines]);
    this.drawEdges(mood);
    this.frame.setVisible(true);
  }

  hide(): void {
    this.clearScreen();
    this.frame.setVisible(false);
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
