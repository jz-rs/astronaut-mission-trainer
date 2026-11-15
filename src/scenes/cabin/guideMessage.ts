import type Phaser from 'phaser';
import { t } from '../../i18n';
import { createButton } from '../../ui/Button';
import { CABIN_MESSAGE_PANEL, FONT_SIZE } from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';
import { drawTechPanel } from '../../ui/techFrame';
import { addText } from '../../ui/text';

/**
 * Spec 18 — The guide talks in a regular game panel at the bottom, with the same chunky buttons
 * as the rest of the game: NEXT and (during the welcome) Skip. The tail points at the guide.
 * Only the tablet and the ship's screens use the "screen look".
 */
export interface GuideMessageOptions {
  text: string;
  /** Position in the welcome (dots at the bottom); left out for single messages. */
  step?: { current: number; total: number };
  tailX: number;
  onNext: () => void;
  onSkip?: () => void;
}

const DEPTH = 40;
const PADDING = 12;
const TAIL_HALF_WIDTH = 9;
const TAIL_HEIGHT = 12;
const NEXT_BUTTON = { width: 104, height: 30 } as const;
const SKIP_BUTTON = { width: 84, height: 30 } as const;
const STEP_DOT = { size: 6, gap: 6 } as const;

export function showGuideMessage(
  scene: Phaser.Scene,
  options: GuideMessageOptions,
): Phaser.GameObjects.Container {
  const panel = CABIN_MESSAGE_PANEL;
  const message = scene.add.container(0, 0).setDepth(DEPTH);
  message.add(drawPanel(scene, options));
  const textWidth = panel.width - NEXT_BUTTON.width - PADDING * 3;
  const text = addText(scene, panel.x + PADDING, panel.y + PADDING, options.text, {
    size: FONT_SIZE.small,
    wrapWidth: textWidth,
  });
  message.add(text.setOrigin(0, 0).setAlign('left'));
  addMessageButtons(scene, message, options);
  return message;
}

/** NEXT at the bottom right; Skip (only during the welcome) to its left. */
function addMessageButtons(
  scene: Phaser.Scene,
  message: Phaser.GameObjects.Container,
  options: GuideMessageOptions,
): void {
  const panel = CABIN_MESSAGE_PANEL;
  const buttonsY = panel.y + panel.height - PADDING - NEXT_BUTTON.height / 2;
  const nextX = panel.x + panel.width - PADDING - NEXT_BUTTON.width / 2;
  const shared = { y: buttonsY, fontSize: FONT_SIZE.small };
  const next = { ...shared, ...NEXT_BUTTON, x: nextX, onPress: options.onNext };
  message.add(createButton(scene, { ...next, label: `${t('cabin.message.next')} ›` }));
  if (!options.onSkip) return;
  const skipX = nextX - NEXT_BUTTON.width / 2 - PADDING - SKIP_BUTTON.width / 2;
  const skip = { ...shared, ...SKIP_BUTTON, x: skipX, color: PALETTE.metalLight };
  message.add(
    createButton(scene, { ...skip, label: t('cabin.message.skip'), onPress: options.onSkip }),
  );
}

function drawPanel(scene: Phaser.Scene, options: GuideMessageOptions): Phaser.GameObjects.Graphics {
  const panel = CABIN_MESSAGE_PANEL;
  const graphics = scene.add.graphics();
  const { tailX } = options;
  graphics.fillStyle(TECH_GLOW, 1);
  graphics.fillTriangle(
    tailX - TAIL_HALF_WIDTH - 2,
    panel.y,
    tailX,
    panel.y - TAIL_HEIGHT - 2,
    tailX + TAIL_HALF_WIDTH + 2,
    panel.y,
  );
  drawTechPanel(graphics, panel);
  graphics.fillStyle(PALETTE.night, 1);
  graphics.fillTriangle(
    tailX - TAIL_HALF_WIDTH,
    panel.y + 2,
    tailX,
    panel.y - TAIL_HEIGHT,
    tailX + TAIL_HALF_WIDTH,
    panel.y + 2,
  );
  if (options.step) drawStepDots(graphics, options.step.current, options.step.total);
  return graphics;
}

/** One dot per welcome line, the current one lit. */
function drawStepDots(graphics: Phaser.GameObjects.Graphics, current: number, total: number): void {
  const panel = CABIN_MESSAGE_PANEL;
  const y = panel.y + panel.height - PADDING - STEP_DOT.size;
  for (let index = 0; index < total; index += 1) {
    const color = index === current ? PALETTE.white : index < current ? TECH_GLOW : PALETTE.metal;
    graphics.fillStyle(color, 1);
    graphics.fillRect(
      panel.x + PADDING + index * (STEP_DOT.size + STEP_DOT.gap),
      y,
      STEP_DOT.size,
      STEP_DOT.size,
    );
  }
}
