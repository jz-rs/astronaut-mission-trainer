import Phaser from 'phaser';
import { t, type TranslationKey } from '../../i18n';
import { FONT_SIZE, MIN_TOUCH_SIZE, type Rect } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addText } from '../../ui/text';
import { addLamp, addMarsSoilHeap, addSpriteOfHeight } from './greenhouseIcons';
import type { Need } from './plantPot';

/**
 * Spec 09 — The tools of the greenhouse, big on the right: water, light and Mars soil. The
 * soil is a decoy: it is toxic for the plants, and the kid who learned it never uses it.
 * The kid can drag a tool onto a plant, or tap a tool (it lights up) and then tap the plant.
 */
export type ToolKind = Need | 'marsSoil';
const TOOL_KINDS: readonly ToolKind[] = ['water', 'light', 'marsSoil'];
const LABEL_KEYS: Record<ToolKind, TranslationKey> = {
  water: 'minigame.greenhouse.water',
  light: 'minigame.greenhouse.light',
  marsSoil: 'minigame.greenhouse.marsSoil',
};
const TOOL_SIZE = 60;
const ICON_SIZE = 34;
/** Space between the tool and the top of its label. */
const LABEL_GAP = 3;
const SELECTED_SCALE = 1.1;
const TAP_DISTANCE = 8;
const RETURN_MS = 150;
const TOOL_DEPTH = 5;
/** Each tool sits a bit above the middle of its slot, so its label (maybe 2 lines) fits below. */
const TOOL_LIFT = 10;

interface Tool {
  need: ToolKind;
  home: { x: number; y: number };
  body: Phaser.GameObjects.Container;
  plate: Phaser.GameObjects.Rectangle;
}

export class Toolbox {
  selected: ToolKind | null = null;
  private readonly tools: Tool[];

  /** `onDrop` is called when a tool is dragged and let go at (x, y). */
  constructor(
    private readonly scene: Phaser.Scene,
    column: Rect,
    private readonly onDrop: (tool: ToolKind, x: number, y: number) => void,
  ) {
    const centerX = column.x + column.width / 2;
    this.tools = TOOL_KINDS.map((need, index) => {
      const y = column.y + (column.height * (index + 0.5)) / TOOL_KINDS.length - TOOL_LIFT;
      return this.createTool(need, centerX, y);
    });
    scene.input.on('drag', this.handleDrag, this);
    scene.input.on('dragend', this.handleDragEnd, this);
  }

  homeOf(need: ToolKind): { x: number; y: number } {
    return this.tools.find((tool) => tool.need === need)?.home ?? { x: 0, y: 0 };
  }

  select(need: ToolKind | null): void {
    this.selected = need;
    for (const tool of this.tools) {
      const isSelected = tool.need === need;
      tool.plate.setStrokeStyle(isSelected ? 4 : 2, isSelected ? PALETTE.sun : PALETTE.white);
      tool.body.setScale(isSelected ? SELECTED_SCALE : 1);
    }
  }

  private createTool(need: ToolKind, x: number, y: number): Tool {
    const plate = this.scene.add.rectangle(0, 0, TOOL_SIZE, TOOL_SIZE, PALETTE.night, 0.9);
    const icon = this.createIcon(need);
    const labelY = TOOL_SIZE / 2 + LABEL_GAP;
    const label = addText(this.scene, 0, labelY, t(LABEL_KEYS[need]), {
      size: FONT_SIZE.small,
      color: PALETTE.white,
    }).setOrigin(0.5, 0);
    const body = this.scene.add.container(x, y, [plate, icon, label]).setDepth(TOOL_DEPTH);
    body.setSize(Math.max(TOOL_SIZE, MIN_TOUCH_SIZE), Math.max(TOOL_SIZE, MIN_TOUCH_SIZE));
    body.setInteractive({ useHandCursor: true, draggable: true });
    const tool: Tool = { need, home: { x, y }, body, plate };
    plate.setStrokeStyle(2, PALETTE.white);
    return tool;
  }

  private createIcon(need: ToolKind): Phaser.GameObjects.GameObject {
    if (need === 'water') return addSpriteOfHeight(this.scene, 0, 0, 'waterDrop', ICON_SIZE);
    if (need === 'light') return addLamp(this.scene, 0, -ICON_SIZE / 3);
    return addMarsSoilHeap(this.scene);
  }

  private findTool(target: Phaser.GameObjects.GameObject): Tool | undefined {
    return this.tools.find((tool) => tool.body === target);
  }

  private handleDrag(
    _pointer: Phaser.Input.Pointer,
    target: Phaser.GameObjects.GameObject,
    x: number,
    y: number,
  ): void {
    this.findTool(target)?.body.setPosition(x, y);
  }

  /** A tap selects the tool; a drag uses it where it was let go. Either way it goes back home. */
  private handleDragEnd(
    pointer: Phaser.Input.Pointer,
    target: Phaser.GameObjects.GameObject,
  ): void {
    const tool = this.findTool(target);
    if (!tool) return;
    if (pointer.getDistance() < TAP_DISTANCE) {
      this.select(this.selected === tool.need ? null : tool.need);
    } else {
      this.onDrop(tool.need, tool.body.x, tool.body.y);
    }
    this.scene.tweens.add({ targets: tool.body, ...tool.home, duration: RETURN_MS });
  }
}
