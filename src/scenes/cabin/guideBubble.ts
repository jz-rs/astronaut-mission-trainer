import Phaser from 'phaser';
import { PALETTE } from '../../ui/palette';
import { GUIDE_MESSAGE_NAME } from './guideMessage';

/**
 * Spec 19 — A little speech bubble with "..." over the guide's head, like the ones games use for
 * "you can talk to me". In playtests kids didn't know the guide could be tapped. It bobs while
 * no guide message is open and hides while one is, so it never competes with the message.
 */
const SIZE = { width: 22, height: 15 } as const;
/** Where it sits, from the guide's top center, in game pixels. */
const OFFSET = { x: 26, y: -2 } as const;
const TAIL = 5;
const DOT = { size: 3, gap: 2 } as const;
const BOB = { px: 2, ms: 500 } as const;
const DEPTH = 21;

export function addGuideBubble(
  scene: Phaser.Scene,
  guide: Phaser.GameObjects.Image,
  onTap: () => void,
): Phaser.GameObjects.Container {
  const bubble = scene.add.container(0, 0, [drawBubble(scene)]).setDepth(DEPTH);
  bubble.setSize(SIZE.width, SIZE.height + TAIL).setInteractive({ useHandCursor: true });
  bubble.on('pointerup', onTap);
  const bob = { y: 0 };
  scene.tweens.add({ targets: bob, y: -BOB.px, yoyo: true, repeat: -1, duration: BOB.ms });
  const follow = (): void => {
    bubble.setPosition(guide.x + OFFSET.x, guide.y + OFFSET.y + bob.y);
    bubble.setVisible(!scene.children.getByName(GUIDE_MESSAGE_NAME));
  };
  follow();
  scene.events.on(Phaser.Scenes.Events.UPDATE, follow);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    scene.events.off(Phaser.Scenes.Events.UPDATE, follow);
  });
  return bubble;
}

/** White rounded bubble with a dark outline, a tail pointing down-left and three dots. */
function drawBubble(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
  const graphics = scene.add.graphics();
  const left = -SIZE.width / 2;
  const top = -SIZE.height / 2;
  const tailTop = SIZE.height / 2 - 1;
  graphics.fillStyle(PALETTE.white, 1).lineStyle(2, PALETTE.night, 1);
  graphics.fillTriangle(left + 3, tailTop, left + 3 + TAIL, tailTop, left + 1, tailTop + TAIL);
  graphics.strokeTriangle(left + 3, tailTop, left + 3 + TAIL, tailTop, left + 1, tailTop + TAIL);
  graphics.fillRoundedRect(left, top, SIZE.width, SIZE.height, 4);
  graphics.strokeRoundedRect(left, top, SIZE.width, SIZE.height, 4);
  // Cover the tail's top edge so tail and bubble read as one shape.
  graphics.fillRect(left + 4, tailTop - 2, TAIL - 2, 3);
  graphics.fillStyle(PALETTE.night, 1);
  const step = DOT.size + DOT.gap;
  for (let index = -1; index <= 1; index += 1) {
    graphics.fillRect(index * step - DOT.size / 2, -DOT.size / 2, DOT.size, DOT.size);
  }
  return graphics;
}
