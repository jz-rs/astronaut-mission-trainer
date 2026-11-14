import Phaser from 'phaser';
import { BOT_IDS } from '../../core/run';
import type { RunState } from '../../core/types';
import { t } from '../../i18n';
import { FONT_SIZE, HUD_HEIGHT } from '../../ui/layout';
import { CREW_COLORS, cssColor, PALETTE } from '../../ui/palette';
import { addText } from '../../ui/text';

/**
 * Spec 05 — One face per bot in the HUD corner. Tapping a face toggles AUTO / MANUAL,
 * and a ring marks the bot that is waiting for an order.
 */
const FACE_START_X = 524;
const FACE_SPACING = 40;
const FACE_RADIUS = 9;
const FACE_Y = 14;
const LABEL_Y = 34;
const LABEL_SIZE = FONT_SIZE.small - 2;

interface Face {
  ring: Phaser.GameObjects.Graphics;
  label: Phaser.GameObjects.Text;
}

export class BotFaces {
  private readonly faces = new Map<string, Face>();

  constructor(scene: Phaser.Scene, onToggleAuto: (botId: string) => void) {
    BOT_IDS.forEach((botId, index) => {
      const x = FACE_START_X + index * FACE_SPACING;
      this.faces.set(botId, this.createFace(scene, botId, x, onToggleAuto));
    });
  }

  update(state: RunState): void {
    for (const member of state.crew) {
      const face = this.faces.get(member.id);
      face?.label.setText(t(member.autoMode ? 'hud.auto' : 'hud.manual'));
      face?.label.setColor(cssColor(member.autoMode ? PALETTE.cyan : PALETTE.metalLight));
    }
  }

  highlight(selectedBotId: string | null): void {
    for (const [botId, face] of this.faces) face.ring.setVisible(botId === selectedBotId);
  }

  private createFace(
    scene: Phaser.Scene,
    botId: string,
    x: number,
    onToggleAuto: (botId: string) => void,
  ): Face {
    const ring = scene.add.graphics().setVisible(false);
    ring.lineStyle(2, PALETTE.white, 1).strokeCircle(x, FACE_Y, FACE_RADIUS + 4);
    const face = scene.add.graphics();
    face.fillStyle(PALETTE.white, 1).fillCircle(x, FACE_Y, FACE_RADIUS);
    face.fillStyle(CREW_COLORS[botId] ?? PALETTE.white, 1).fillRect(x - 6, FACE_Y - 4, 12, 6);
    const label = addText(scene, x, LABEL_Y, '', { size: LABEL_SIZE });
    const zone = scene.add.zone(x, HUD_HEIGHT / 2, FACE_SPACING, HUD_HEIGHT);
    zone.setInteractive({ useHandCursor: true }).on('pointerup', () => onToggleAuto(botId));
    return { ring, label };
  }
}
