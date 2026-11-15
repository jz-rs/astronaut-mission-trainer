import Phaser from 'phaser';
import type { SourceLink } from '../content/sources';
import { FONT_SIZE, GAME_WIDTH } from '../ui/layout';
import { PALETTE } from '../ui/palette';
import { addText } from '../ui/text';

/**
 * The Sources screen's list of links. There are more than fit on the screen, so it scrolls with
 * a finger drag (or the mouse wheel), and a thin bar on the right shows where you are. A link
 * opens only on a tap, never at the end of a drag.
 */
const LIST = { top: 68, bottom: 306, rowHeight: 24 };
const SCROLL_BAR = { x: GAME_WIDTH - 12, width: 4 };
/** A finger that moved less than this was a tap, not a drag. */
const TAP_DISTANCE = 8;

export function addSourceList(scene: Phaser.Scene, links: readonly SourceLink[]): void {
  const viewHeight = LIST.bottom - LIST.top;
  const firstRowY = LIST.top + LIST.rowHeight / 2;
  const lowestY = firstRowY - Math.max(0, links.length * LIST.rowHeight - viewHeight);
  const rows = scene.add.container(0, firstRowY, links.map(linkText(scene)));
  rows.setMask(
    scene.make
      .graphics({}, false)
      .fillRect(0, LIST.top, GAME_WIDTH, viewHeight)
      .createGeometryMask(),
  );
  const bar = scene.add.graphics();
  const scrollTo = (y: number) => {
    rows.setY(Phaser.Math.Clamp(y, lowestY, firstRowY));
    drawScrollBar(bar, (firstRowY - rows.y) / Math.max(1, firstRowY - lowestY), viewHeight);
  };
  scrollTo(firstRowY);
  listenToFinger(scene, rows, scrollTo, links);
}

/** Drag or wheel to scroll; a tap (no drag) opens the link under the finger. */
function listenToFinger(
  scene: Phaser.Scene,
  rows: Phaser.GameObjects.Container,
  scrollTo: (y: number) => void,
  links: readonly SourceLink[],
): void {
  const viewHeight = LIST.bottom - LIST.top;
  const zone = scene.add.zone(GAME_WIDTH / 2, LIST.top + viewHeight / 2, GAME_WIDTH, viewHeight);
  zone.setInteractive({ useHandCursor: true });
  zone.on('pointermove', (pointer: Phaser.Input.Pointer) => {
    if (pointer.isDown) scrollTo(rows.y + pointer.y - pointer.prevPosition.y);
  });
  zone.on('wheel', (_pointer: Phaser.Input.Pointer, _dx: number, dy: number) =>
    scrollTo(rows.y - dy),
  );
  zone.on('pointerup', (pointer: Phaser.Input.Pointer) => {
    if (pointer.getDistance() >= TAP_DISTANCE) return;
    const link = links[Math.floor((pointer.y - rows.y + LIST.rowHeight / 2) / LIST.rowHeight)];
    if (link) window.open(link.url, '_blank', 'noopener');
  });
}

function linkText(scene: Phaser.Scene) {
  return (link: SourceLink, index: number) =>
    addText(scene, GAME_WIDTH / 2, index * LIST.rowHeight, `🔗 ${link.label}`, {
      size: FONT_SIZE.small,
      color: PALETTE.white,
    });
}

/** The track, and the thumb at `progress` (0 = top of the list, 1 = bottom). */
function drawScrollBar(
  bar: Phaser.GameObjects.Graphics,
  progress: number,
  viewHeight: number,
): void {
  const thumbHeight = viewHeight / 4;
  const thumbTop = LIST.top + (viewHeight - thumbHeight) * progress;
  bar.clear().fillStyle(PALETTE.metalDark, 1);
  bar.fillRect(SCROLL_BAR.x, LIST.top, SCROLL_BAR.width, viewHeight);
  bar.fillStyle(PALETTE.cyan, 1).fillRect(SCROLL_BAR.x, thumbTop, SCROLL_BAR.width, thumbHeight);
}
