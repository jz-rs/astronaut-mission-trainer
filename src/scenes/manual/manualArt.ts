import type Phaser from 'phaser';
import { RUN_BALANCE } from '../../config/balance';
import { STAT_IDS } from '../../core/types';
import { t } from '../../i18n';
import { astronautFrameKey, type SuitColor } from '../../ui/astronautFrames';
import { FONT_SIZE, rectCenter, STAT_BAR_SEGMENTS, type Rect } from '../../ui/layout';
import { PALETTE, STAT_COLORS, TECH_GLOW } from '../../ui/palette';
import { addGlowText } from '../../ui/screenUi';
import { STAT_ICON_SPRITES } from '../../ui/sprites';
import type { PageArt } from './manualPages';

/**
 * Spec 19 — The picture of each manual page, drawn with the same sprites the mission uses
 * (so the manual shows exactly what the kid will see while playing).
 */
type Parts = Phaser.GameObjects.GameObject[];
type ArtDrawer = (scene: Phaser.Scene, area: Rect) => Parts;

const CREW: readonly SuitColor[] = ['violet', 'red', 'green', 'yellow'];
/** The "ready" page shows the four bars, one of them almost empty. */
const READY_BAR_FILLS = [0.8, 0.9, 0.7, 0.2] as const;

/** Any loaded texture (kit sprite, astronaut frame or cabin art), its longest side `size` pixels. */
function sprite(scene: Phaser.Scene, x: number, y: number, key: string, size: number) {
  const image = scene.add.image(x, y, key);
  return image.setScale(size / Math.max(image.width, image.height));
}

const DRAWERS: Record<PageArt, ArtDrawer> = {
  mission: (scene, area) => {
    const { x, y } = rectCenter(area);
    const parts: Parts = [sprite(scene, x, y - 14, astronautFrameKey('violet', 'front'), 56)];
    const sols = RUN_BALANCE.solsPerRun;
    for (let index = 0; index < sols; index += 1) {
      parts.push(sprite(scene, x + (index - (sols - 1) / 2) * 22, y + 36, 'sol', 18));
    }
    return parts;
  },
  oxygenMachine: (scene, area) => [
    sprite(scene, rectCenter(area).x, rectCenter(area).y, 'oxygenMachineOn', 64),
  ],
  greenhouse: (scene, area) => {
    const { x, y } = rectCenter(area);
    return [
      sprite(scene, x - 12, y + 4, 'lettuceHealthy', 60),
      sprite(scene, x + 46, y - 4, 'waterDrop', 20),
    ];
  },
  rover: (scene, area) => {
    const { x, y } = rectCenter(area);
    return [
      sprite(scene, x - 16, y, 'rover', 70),
      sprite(scene, x + 58, y + 14, 'shinySample', 26),
    ];
  },
  shield: (scene, area) => {
    const { x, y } = rectCenter(area);
    return [
      sprite(scene, x - 14, y + 4, 'shieldPanel', 72),
      sprite(scene, x + 54, y - 18, 'radiationRay', 40),
    ];
  },
  energy: (scene, area) => {
    const { x, y } = rectCenter(area);
    const arrow = addGlowText(scene, x, y, '>', { size: FONT_SIZE.medium, color: TECH_GLOW });
    return [
      sprite(scene, x - 44, y, 'solarPanelDirty', 64),
      arrow,
      sprite(scene, x + 44, y, 'solarPanelClean', 64),
    ];
  },
  crew: (scene, area) => {
    const { x, y } = rectCenter(area);
    return CREW.map((color, index) => {
      const column = index % 2 === 0 ? -1 : 1;
      const row = index < 2 ? -1 : 1;
      return sprite(scene, x + column * 34, y + row * 26, astronautFrameKey(color, 'front'), 44);
    });
  },
  events: (scene, area) => {
    const { x, y } = rectCenter(area);
    return [
      sprite(scene, x - 18, y, 'dustCloud', 76),
      sprite(scene, x + 50, y + 24, 'radiationRay', 40),
    ];
  },
  messages: drawSignal,
  ready: drawBars,
};

export function drawPageArt(scene: Phaser.Scene, art: PageArt, area: Rect): Parts {
  return DRAWERS[art](scene, area);
}

/** Radio waves leaving Earth toward Mars, with the route under them; centered in the frame. */
const SIGNAL = { radii: [14, 26, 38], labelGap: 18, labelHalfHeight: 4 } as const;

function drawSignal(scene: Phaser.Scene, area: Rect): Parts {
  const { x, y: centerY } = rectCenter(area);
  const outerRadius = SIGNAL.radii[SIGNAL.radii.length - 1] ?? 0;
  // The group goes from the top of the outer wave down to the label: put its middle on the frame's.
  const groupHeight = outerRadius + SIGNAL.labelGap + SIGNAL.labelHalfHeight;
  const dotY = centerY - groupHeight / 2 + outerRadius;
  const graphics = scene.add.graphics();
  graphics.fillStyle(TECH_GLOW, 1).fillCircle(x, dotY, 3);
  for (const radius of SIGNAL.radii) {
    graphics
      .lineStyle(4, TECH_GLOW, 0.25)
      .beginPath()
      .arc(x, dotY, radius, -2.4, -0.74)
      .strokePath();
    graphics
      .lineStyle(1.5, TECH_GLOW, 1)
      .beginPath()
      .arc(x, dotY, radius, -2.4, -0.74)
      .strokePath();
  }
  const route = addGlowText(scene, x, dotY + SIGNAL.labelGap, t('manual.messages.route'), {
    color: PALETTE.metalLight,
  });
  return [graphics, route];
}

/** The four survival bars, each with its icon; the energy one is almost empty. */
function drawBars(scene: Phaser.Scene, area: Rect): Parts {
  const graphics = scene.add.graphics();
  const parts: Parts = [graphics];
  const rowHeight = area.height / (STAT_IDS.length + 1);
  STAT_IDS.forEach((stat, index) => {
    const y = area.y + rowHeight * (index + 1);
    parts.push(sprite(scene, area.x + 22, y, STAT_ICON_SPRITES[stat], 16));
    const filled = Math.round(READY_BAR_FILLS[index] * STAT_BAR_SEGMENTS);
    const color = filled <= 2 ? PALETTE.alert : STAT_COLORS[stat];
    for (let segment = 0; segment < STAT_BAR_SEGMENTS; segment += 1) {
      const alpha = segment < filled ? 1 : 0.2;
      graphics.fillStyle(segment < filled ? color : PALETTE.metal, alpha);
      graphics.fillRect(area.x + 40 + segment * 11, y - 4, 9, 9);
    }
  });
  return parts;
}
