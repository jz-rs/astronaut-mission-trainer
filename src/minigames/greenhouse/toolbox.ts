import Phaser from 'phaser';
import { t } from '../../i18n';
import { FONT_SIZE, MIN_TOUCH_SIZE, type Rect } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addText } from '../../ui/text';
import { addLamp, addSpriteOfHeight } from './greenhouseIcons';
import type { Need } from './plantPot';

/**
 * Spec 09 — The two tools of the greenhouse, big on the right: water and light. The kid can
 * drag a tool onto a plant, or tap a tool (it lights up) and then tap the plant.
 */
const TOOL_SIZE = 60;
const ICON_SIZE = 34;
const LABEL_GAP = 8;
const SELECTED_SCALE = 1.1;
const TAP_DISTANCE = 8;
const RETURN_MS = 150;
const TOOL_DEPTH = 5;

interface Tool {
  need: Need;
  home: { x: number; y: number };
  body: Phaser.GameObjects.Container;
  plate: Phaser.GameObjects.Rectangle;
}

export class Toolbox {
  selected: Need | null = null;
  private readonly tools: Tool[];

  /** `onDrop` is called when a tool is dragged and let go at (x, y). */
  constructor(
    private readonly scene: Phaser.Scene,
    column: Rect,
    private readonly onDrop: (need: Need, x: number, y: number) => void,
  ) {
    const centerX = column.x + column.width / 2;
    const needs: readonly Need[] = ['water', 'light'];
    this.tools = needs.map((need, index) => {
      const y = column.y + (column.height * (index + 0.5)) / needs.length;
      return this.createTool(need, centerX, y);
    });
    scene.input.on('drag', this.handleDrag, this);
    scene.input.on('dragend', this.handleDragEnd, this);
  }

  homeOf(need: Need): { x: number; y: number } {
    return this.tools.find((tool) => tool.need === need)?.home ?? { x: 0, y: 0 };
  }

  select(need: Need | null): void {
    this.selected = need;
    for (const tool of this.tools) {
      const isSelected = tool.need === need;
      tool.plate.setStrokeStyle(isSelected ? 4 : 2, isSelected ? PALETTE.sun : PALETTE.white);
      tool.body.setScale(isSelected ? SELECTED_SCALE : 1);
    }
  }

  private createTool(need: Need, x: number, y: number): Tool {
    const plate = this.scene.add.rectangle(0, 0, TOOL_SIZE, TOOL_SIZE, PALETTE.night, 0.9);
    const icon =
      need === 'water'
        ? addSpriteOfHeight(this.scene, 0, 0, 'waterDrop', ICON_SIZE)
        : addLamp(this.scene, 0, -ICON_SIZE / 3);
    const labelKey = need === 'water' ? 'minigame.greenhouse.water' : 'minigame.greenhouse.light';
    const labelY = TOOL_SIZE / 2 + LABEL_GAP;
    const label = addText(this.scene, 0, labelY, t(labelKey), {
      size: FONT_SIZE.small,
      color: PALETTE.white,
    });
    const body = this.scene.add.container(x, y, [plate, icon, label]).setDepth(TOOL_DEPTH);
    body.setSize(Math.max(TOOL_SIZE, MIN_TOUCH_SIZE), Math.max(TOOL_SIZE, MIN_TOUCH_SIZE));
    body.setInteractive({ useHandCursor: true, draggable: true });
    const tool: Tool = { need, home: { x, y }, body, plate };
    plate.setStrokeStyle(2, PALETTE.white);
    return tool;
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
