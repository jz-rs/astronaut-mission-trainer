import type Phaser from 'phaser';
import { t } from '../../i18n';
import { CABIN_MESSAGE_PANEL } from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';
import {
  addGlowText,
  createScreenButton,
  drawOutlineFace,
  drawScreenPanel,
  drawScreenScanlines,
  drawSegments,
  glowStroke,
} from '../../ui/screenUi';

/**
 * Spec 18 — The guide talks through the ship's radio: a screen-look panel at the bottom with
 * one short line at a time, NEXT and (during the welcome) Skip. The tail points at the guide.
 */
export interface GuideMessageOptions {
  text: string;
  /** Position in the welcome (dashes at the bottom); left out for single messages. */
  step?: { current: number; total: number };
  tailX: number;
  onNext: () => void;
  onSkip?: () => void;
}

const DEPTH = 40;
const PADDING = 12;
const TAIL_HALF_WIDTH = 9;
const TAIL_HEIGHT = 12;
const NEXT_BUTTON = { width: 76, height: 22 } as const;

export function showGuideMessage(
  scene: Phaser.Scene,
  options: GuideMessageOptions,
): Phaser.GameObjects.Container {
  const panel = CABIN_MESSAGE_PANEL;
  const right = panel.x + panel.width - PADDING;
  const message = scene.add.container(0, 0).setDepth(DEPTH);
  message.add(drawPanel(scene, options));
  message.add(
    addGlowText(scene, panel.x + 40, panel.y + 12, t('cabin.message.title'), {
      color: TECH_GLOW,
    }).setOrigin(0, 0.5),
  );
  const text = addGlowText(scene, panel.x + PADDING, panel.y + 26, options.text, {
    wrapWidth: panel.width - NEXT_BUTTON.width - PADDING * 4,
  });
  message.add(text.setOrigin(0, 0).setAlign('left'));
  message.add(createNextButton(scene, right, options.onNext));
  if (options.onSkip) message.add(createSkipButton(scene, right, options.onSkip));
  return message;
}

function drawPanel(scene: Phaser.Scene, options: GuideMessageOptions): Phaser.GameObjects.Graphics {
  const panel = CABIN_MESSAGE_PANEL;
  const graphics = scene.add.graphics();
  drawScreenPanel(graphics, panel);
  drawScreenScanlines(graphics, panel);
  const { tailX } = options;
  graphics.fillStyle(PALETTE.night, 0.94);
  graphics.fillTriangle(
    tailX - TAIL_HALF_WIDTH,
    panel.y,
    tailX,
    panel.y - TAIL_HEIGHT,
    tailX + TAIL_HALF_WIDTH,
    panel.y,
  );
  const glow = glowStroke(graphics);
  glow.line(tailX - TAIL_HALF_WIDTH, panel.y, tailX, panel.y - TAIL_HEIGHT);
  glow.line(tailX, panel.y - TAIL_HEIGHT, tailX + TAIL_HALF_WIDTH, panel.y);
  drawSignalBars(graphics, panel.x + PADDING, panel.y + 16);
  if (options.step) {
    const { current, total } = options.step;
    drawSegments(graphics, panel.x + 60, panel.y + panel.height - 9, current, total);
  }
  return graphics;
}

/** Three growing bars: "radio signal". */
function drawSignalBars(graphics: Phaser.GameObjects.Graphics, left: number, bottom: number): void {
  graphics.fillStyle(TECH_GLOW, 1);
  for (let index = 0; index < 3; index += 1) {
    const height = 3 + index * 3;
    graphics.fillRect(left + index * 5, bottom - height, 3, height);
  }
}

function createNextButton(scene: Phaser.Scene, right: number, onNext: () => void) {
  const panel = CABIN_MESSAGE_PANEL;
  return createScreenButton(scene, {
    x: right - NEXT_BUTTON.width / 2,
    y: panel.y + panel.height - PADDING - NEXT_BUTTON.height / 2,
    width: NEXT_BUTTON.width,
    height: NEXT_BUTTON.height,
    drawFace: drawOutlineFace(NEXT_BUTTON.width, NEXT_BUTTON.height),
    label: `${t('cabin.message.next')} ›`,
    onPress: onNext,
  });
}

function createSkipButton(scene: Phaser.Scene, right: number, onSkip: () => void) {
  return createScreenButton(scene, {
    x: right - NEXT_BUTTON.width / 2,
    y: CABIN_MESSAGE_PANEL.y + 12,
    width: NEXT_BUTTON.width,
    height: 16,
    drawFace: () => undefined,
    label: t('cabin.message.skip'),
    color: PALETTE.metalLight,
    // Its touch area must not reach NEXT, which sits right below it.
    touchHeight: 28,
    onPress: onSkip,
  });
}
