import type Phaser from 'phaser';
import { INTRO_BALANCE } from '../../config/balance';
import { CONSOLE_BUTTONS, MIN_TOUCH_SIZE } from '../../ui/layout';
import { SPRITE_SCALE } from '../../ui/sprites';
import {
  CONSOLE_BUTTON_FILES,
  CONSOLE_PRESS_FRAMES,
  consoleButtonTexture,
  type ConsoleButtonId,
} from '../cabin/cabinArt';

/**
 * Spec 18 — A physical button of the destination console: it sinks in three frames while the
 * finger is down and pops back up before acting (it fires only if the finger lifts on it).
 * Unlike the tablet's screen buttons, these feel like real, chunky hardware.
 */
export interface ConsoleButton {
  sprite: Phaser.GameObjects.Image;
  /** Swaps the resting look (the LAND button has a locked version). */
  setRestingTexture: (texture: string) => void;
}

export function createConsoleButton(
  scene: Phaser.Scene,
  id: ConsoleButtonId,
  onPress: () => void,
): ConsoleButton {
  const file = CONSOLE_BUTTON_FILES[id];
  const frames = CONSOLE_PRESS_FRAMES.map((frame) => consoleButtonTexture(file + frame));
  let resting = frames[0] ?? '';
  const { x, y } = CONSOLE_BUTTONS[id];
  const sprite = scene.add.image(x, y, resting).setOrigin(0).setScale(SPRITE_SCALE);
  const show = (texture: string | undefined) => sprite.setTexture(texture ?? resting);
  bindPress(scene, addTouchZone(scene, sprite), {
    down: () => [frames[1], frames[2]],
    up: () => [frames[1], resting],
    show,
    onPress,
  });
  return {
    sprite,
    setRestingTexture: (texture) => {
      resting = texture;
      sprite.setTexture(texture);
    },
  };
}

interface PressFrames {
  down: () => readonly (string | undefined)[];
  up: () => readonly (string | undefined)[];
  show: (texture: string | undefined) => void;
  onPress: () => void;
}

/** Plays frames down while the finger is on the button and back up when it leaves or lifts. */
function bindPress(scene: Phaser.Scene, zone: Phaser.GameObjects.Zone, press: PressFrames): void {
  const play = (sequence: readonly (string | undefined)[], then?: () => void) => {
    const frameMs = INTRO_BALANCE.consolePressFrameMs;
    sequence.forEach((texture, step) =>
      scene.time.delayedCall(step * frameMs, () => press.show(texture)),
    );
    if (then) scene.time.delayedCall(sequence.length * frameMs, then);
  };
  let isPressed = false;
  zone.on('pointerdown', () => {
    isPressed = true;
    play(press.down());
  });
  zone.on('pointerout', () => {
    if (isPressed) play(press.up());
    isPressed = false;
  });
  zone.on('pointerup', () => {
    if (!isPressed) return;
    isPressed = false;
    play(press.up(), press.onPress);
  });
}

/** Small buttons still get a 48 px touch area, centered on the sprite. */
function addTouchZone(
  scene: Phaser.Scene,
  sprite: Phaser.GameObjects.Image,
): Phaser.GameObjects.Zone {
  const width = Math.max(sprite.displayWidth, MIN_TOUCH_SIZE);
  const height = Math.max(sprite.displayHeight, MIN_TOUCH_SIZE);
  const zone = scene.add.zone(
    sprite.x + sprite.displayWidth / 2,
    sprite.y + sprite.displayHeight / 2,
    width,
    height,
  );
  return zone.setInteractive({ useHandCursor: true });
}
