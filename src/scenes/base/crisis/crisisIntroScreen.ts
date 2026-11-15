import type Phaser from 'phaser';
import { COLLAB_BALANCE } from '../../../config/balance';
import { t } from '../../../i18n';
import { FONT_SIZE, TABLET_SCREEN } from '../../../ui/layout';
import { PALETTE } from '../../../ui/palette';
import { addGlowText } from '../../../ui/screenUi';

/**
 * Spec 16, step 1 — "Message from Earth": a signal travels from Earth to Mars and the screen
 * says how many minutes it took. Radio waves need 3 to 22 minutes to reach Mars, so the crew
 * always hears about a crisis a bit late.
 */
const CENTER_X = TABLET_SCREEN.x + TABLET_SCREEN.width / 2;
const TITLE_Y = TABLET_SCREEN.y + 34;
const PLANET_Y = TABLET_SCREEN.y + 100;
const PLANET_OFFSET_X = 150;
const PLANET_RADIUS = 20;
const SIGNAL_SIZE = 8;
const SIGNAL_TRAVEL_MS = 1_000;
const DASH = { length: 6, gap: 6 };
const DELAY_Y = TABLET_SCREEN.y + 162;
const BAR = { width: 280, height: 9, y: TABLET_SCREEN.y + 192 };
const TITLE_BLINK_MS = 500;

export function drawIntroScreen(
  scene: Phaser.Scene,
  minutes: number,
): Phaser.GameObjects.GameObject[] {
  const title = addGlowText(scene, CENTER_X, TITLE_Y, t('crisis.incoming'), {
    size: FONT_SIZE.medium,
    color: PALETTE.cyan,
  });
  scene.tweens.add({
    targets: title,
    alpha: 0.3,
    duration: TITLE_BLINK_MS,
    yoyo: true,
    repeat: -1,
  });
  const delay = addGlowText(scene, CENTER_X, DELAY_Y, t('crisis.delay', { minutes }), {
    size: FONT_SIZE.medium,
    color: PALETTE.sand,
  });
  return [title, ...drawPlanets(scene), drawSignal(scene), delay, ...drawLoadingBar(scene)];
}

function drawPlanets(scene: Phaser.Scene): Phaser.GameObjects.GameObject[] {
  const earthX = CENTER_X - PLANET_OFFSET_X;
  const marsX = CENTER_X + PLANET_OFFSET_X;
  const planets = scene.add.graphics();
  planets.fillStyle(PALETTE.cyan, 1).fillCircle(earthX, PLANET_Y, PLANET_RADIUS);
  planets.fillStyle(PALETTE.green, 1).fillRect(earthX - 10, PLANET_Y - 10, 9, 9);
  planets.fillRect(earthX + 2, PLANET_Y + 3, 8, 6);
  planets.fillStyle(PALETTE.mars, 1).fillCircle(marsX, PLANET_Y, PLANET_RADIUS);
  planets.fillStyle(PALETTE.marsDark, 1).fillRect(marsX - 12, PLANET_Y - 2, 9, 6);
  planets.fillStyle(PALETTE.metalDark, 1);
  for (
    let x = earthX + PLANET_RADIUS + DASH.gap;
    x < marsX - PLANET_RADIUS;
    x += DASH.length + DASH.gap
  )
    planets.fillRect(x, PLANET_Y - 1, DASH.length, 2);
  const labelY = PLANET_Y + PLANET_RADIUS + 12;
  const options = { size: FONT_SIZE.small };
  return [
    planets,
    addGlowText(scene, earthX, labelY, t('crisis.earth'), { ...options, color: PALETTE.cyan }),
    addGlowText(scene, marsX, labelY, t('crisis.you'), { ...options, color: PALETTE.marsLight }),
  ];
}

/** A little square flies from Earth to Mars, again and again, while the message arrives. */
function drawSignal(scene: Phaser.Scene): Phaser.GameObjects.Rectangle {
  const fromX = CENTER_X - PLANET_OFFSET_X + PLANET_RADIUS;
  const toX = CENTER_X + PLANET_OFFSET_X - PLANET_RADIUS;
  const signal = scene.add.rectangle(fromX, PLANET_Y, SIGNAL_SIZE, SIGNAL_SIZE, PALETTE.cyan);
  scene.tweens.add({ targets: signal, x: toX, duration: SIGNAL_TRAVEL_MS, repeat: -1 });
  return signal;
}

/** Fills up while the message arrives, so the kid knows the vote is coming. */
function drawLoadingBar(scene: Phaser.Scene): Phaser.GameObjects.GameObject[] {
  const left = CENTER_X - BAR.width / 2;
  const frame = scene.add.rectangle(CENTER_X, BAR.y, BAR.width, BAR.height);
  frame.setStrokeStyle(2, PALETTE.cyan);
  const fill = scene.add.rectangle(left, BAR.y, 0, BAR.height, PALETTE.cyan).setOrigin(0, 0.5);
  scene.tweens.add({ targets: fill, width: BAR.width, duration: COLLAB_BALANCE.meetingIntroMs });
  return [frame, fill];
}
