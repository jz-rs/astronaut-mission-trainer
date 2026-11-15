import type Phaser from 'phaser';
import { COLLAB_BALANCE } from '../../config/balance';
import { PLAYER_ID } from '../../core/run';
import type { RunState } from '../../core/types';
import { t } from '../../i18n';
import { FONT_SIZE, GAME_HEIGHT, GAME_WIDTH, ROOM_LAYOUTS } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { drawTechPanel } from '../../ui/techFrame';
import { addText } from '../../ui/text';

/**
 * Spec 16, step 4 — A solar storm landed: "GET INSIDE!" with a countdown, the base pulsing red,
 * and the shield room blinking with an arrow pointing at it. The kid taps the room to go in
 * (BaseScene sends the action); nothing here blocks the taps.
 */
const DEPTH = 55;
const SHIELD_ROOM = ROOM_LAYOUTS['shield-wall'].rect;
const BANNER = { x: GAME_WIDTH / 2 - 125, y: 52, width: 250, height: 40 };
const PULSE_ALPHA = 0.35;
const PULSE_MS = 600;
const BLINK_MS = 400;
const ARROW = {
  x: SHIELD_ROOM.x + SHIELD_ROOM.width + 14,
  y: SHIELD_ROOM.y + SHIELD_ROOM.height / 2,
  size: 16,
};
const ARROW_NUDGE = 8;

export class ShelterView {
  private readonly container: Phaser.GameObjects.Container;
  private readonly guide: Phaser.GameObjects.Container;
  private readonly countdown: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    const pulse = scene.add
      .rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, PALETTE.alert, PULSE_ALPHA)
      .setOrigin(0);
    scene.tweens.add({ targets: pulse, alpha: 0, duration: PULSE_MS, yoyo: true, repeat: -1 });
    this.guide = this.createGuide(scene);
    const banner = scene.add.graphics();
    drawTechPanel(banner, BANNER, PALETTE.alert, PALETTE.night);
    const centerY = BANNER.y + BANNER.height / 2;
    const title = addText(scene, GAME_WIDTH / 2 - 16, centerY, t('crisis.shelter'), {
      color: PALETTE.white,
    });
    this.countdown = addText(scene, BANNER.x + BANNER.width - 26, centerY, '', {
      size: FONT_SIZE.large,
      color: PALETTE.alert,
    });
    this.container = scene.add.container(0, 0, [pulse, this.guide, banner, title, this.countdown]);
    this.container.setDepth(DEPTH).setVisible(false);
  }

  get isVisible(): boolean {
    return this.container.visible;
  }

  update(state: RunState): void {
    const shelter = state.shelter;
    this.container.setVisible(shelter !== null);
    if (!shelter) return;
    const secondsLeft = Math.ceil((COLLAB_BALANCE.shelterWindowMs - shelter.elapsedMs) / 1000);
    this.countdown.setText(String(Math.max(0, secondsLeft)));
    // Once the kid is inside, the room stops calling.
    this.guide.setVisible(!shelter.sheltered.includes(PLAYER_ID));
  }

  /** Blinking outline around the shield room and an arrow that nudges toward it. */
  private createGuide(scene: Phaser.Scene): Phaser.GameObjects.Container {
    return scene.add.container(0, 0, [createRoomOutline(scene), createArrow(scene)]);
  }
}

function createRoomOutline(scene: Phaser.Scene): Phaser.GameObjects.Rectangle {
  const { x, y, width, height } = SHIELD_ROOM;
  const outline = scene.add.rectangle(
    x + width / 2,
    y + height / 2,
    width,
    height,
    PALETTE.violet,
    0.2,
  );
  outline.setStrokeStyle(4, PALETTE.violet);
  scene.tweens.add({ targets: outline, alpha: 0.4, duration: BLINK_MS, yoyo: true, repeat: -1 });
  return outline;
}

/** A white arrow on the right of the room, pointing at it. */
function createArrow(scene: Phaser.Scene): Phaser.GameObjects.Triangle {
  const { x, y, size } = ARROW;
  const arrow = scene.add.triangle(x, y, 0, size / 2, size, 0, size, size, PALETTE.white);
  arrow.setStrokeStyle(2, PALETTE.night);
  scene.tweens.add({
    targets: arrow,
    x: x + ARROW_NUDGE,
    duration: BLINK_MS,
    yoyo: true,
    repeat: -1,
  });
  return arrow;
}
