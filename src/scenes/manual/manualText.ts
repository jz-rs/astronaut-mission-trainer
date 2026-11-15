import type Phaser from 'phaser';
import type { StatId } from '../../core/types';
import type { Rect } from '../../ui/layout';
import { PALETTE, STAT_COLORS, TECH_GLOW } from '../../ui/palette';
import { addGlowText, glowStroke } from '../../ui/screenUi';

/**
 * Spec 19 — The manual's text, made easy to scan for kids: one short sentence per line, each with
 * a colored marker for its kind (the problem, the real science, what you do in the game), and key
 * words painted in the color of their bar. Key words are marked in the texts like
 * "[oxygen]oxígeno[/]"; the line is laid out word by word so each word can have its own color.
 */
export type LineKind = 'problem' | 'science' | 'play';

type Parts = Phaser.GameObjects.GameObject[];
type WordTag = StatId | 'mars' | 'crew';

const KIND_COLORS: Record<LineKind, number> = {
  problem: PALETTE.marsLight,
  science: TECH_GLOW,
  play: PALETTE.sun,
};
const TAG_COLORS: Record<WordTag, number> = {
  ...STAT_COLORS,
  mars: PALETTE.marsLight,
  crew: PALETTE.violet,
};
const LINE_HEIGHT = 10;
const LINE_GAP = 5;
const MARKER = { size: 4, top: 2 } as const;
/** Text starts after the marker; wrapped lines keep this indent. */
const INDENT = 10;
const FACT_PADDING = 5;
const FACT_CORNER = 3;
const TAGGED_WORDS = /\[(\w+)\](.*?)\[\/\]/g;

interface Word {
  text: string;
  color: number;
  /** Stuck to the previous word with no space (a "." right after a colored word). */
  glued: boolean;
}

/** Draws the lines from `top` down inside `width`; returns the parts and where the text ended. */
export function drawManualLines(
  scene: Phaser.Scene,
  lines: readonly { kind: LineKind; text: string }[],
  area: { x: number; top: number; width: number },
): { parts: Parts; bottom: number } {
  const parts: Parts = [];
  let y = area.top;
  for (const line of lines) {
    const kindColor = KIND_COLORS[line.kind];
    const marker = scene.add.graphics();
    marker.fillStyle(kindColor, 1).fillRect(area.x, y + MARKER.top, MARKER.size, MARKER.size);
    const textColor = line.kind === 'play' ? PALETTE.sun : PALETTE.white;
    const words = parseWords(line.text, textColor);
    const laid = layoutWords(scene, words, area.x + INDENT, y, area.width - INDENT);
    parts.push(marker, ...laid.parts);
    y = laid.bottom + LINE_GAP;
  }
  return { parts, bottom: y - LINE_GAP };
}

/** The extra fact in a thin box, only if it fits above `maxBottom`. */
export function drawFactBox(
  scene: Phaser.Scene,
  fact: string,
  area: { x: number; top: number; width: number },
  maxBottom: number,
): Parts {
  const innerWidth = area.width - FACT_PADDING * 2;
  const words = parseWords(fact, PALETTE.metalLight);
  const laid = layoutWords(
    scene,
    words,
    area.x + FACT_PADDING,
    area.top + FACT_PADDING,
    innerWidth,
  );
  const box: Rect = {
    x: area.x,
    y: area.top,
    width: area.width,
    height: laid.bottom - area.top + FACT_PADDING,
  };
  if (box.y + box.height > maxBottom) {
    laid.parts.forEach((part) => part.destroy());
    return [];
  }
  const frame = scene.add.graphics();
  glowStroke(frame, PALETTE.metal).rect(box, FACT_CORNER);
  return [frame, ...laid.parts];
}

function parseWords(text: string, baseColor: number): Word[] {
  const words: Word[] = [];
  let last = 0;
  let spaceBefore = true;
  const push = (chunk: string, color: number): void => {
    if (chunk.length === 0) return;
    chunk.split(' ').forEach((word, index) => {
      if (word.length === 0) return;
      // Only a chunk's first piece can touch the previous chunk, when no space separates them.
      words.push({ text: word, color, glued: index === 0 && !spaceBefore });
    });
    spaceBefore = chunk.endsWith(' ');
  };
  for (const match of text.matchAll(TAGGED_WORDS)) {
    push(text.slice(last, match.index), baseColor);
    push(match[2] ?? '', TAG_COLORS[match[1] as WordTag] ?? baseColor);
    last = (match.index ?? 0) + match[0].length;
  }
  push(text.slice(last), baseColor);
  return words;
}

/** Places the words left to right, wrapping when the next one would not fit. */
function layoutWords(
  scene: Phaser.Scene,
  words: readonly Word[],
  left: number,
  top: number,
  width: number,
): { parts: Parts; bottom: number } {
  const parts: Parts = [];
  const probe = addGlowText(scene, 0, 0, 'a');
  const space = probe.width;
  probe.destroy();
  let x = left;
  let y = top;
  for (const word of words) {
    if (word.glued && x > left) x -= space;
    const text = addGlowText(scene, x, y, word.text, { color: word.color }).setOrigin(0);
    // A glued "." never goes alone to the next line: it may stick out a little instead.
    if (!word.glued && x > left && x + text.width > left + width) {
      x = left;
      y += LINE_HEIGHT;
      text.setPosition(x, y);
    }
    x += text.width + space;
    parts.push(text);
  }
  return { parts, bottom: y + LINE_HEIGHT };
}
