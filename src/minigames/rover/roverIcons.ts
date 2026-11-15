import type Phaser from 'phaser';
import type { Rect } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';

/**
 * Mission 5 — The pieces of storing a Mars sample, drawn with the palette so they work at any
 * size: the drill, the rock core (a cylinder a bit thicker than a pencil), the sample tube
 * (white, like Perseverance's, so the Sun does not heat it) and the shelf where tubes are kept.
 */
const DRILL = { width: 22, height: 26, bitWidth: 6, bitHeight: 16 };
const CORE = { width: 10, height: 26 };
const CORE_LAYERS = 3;
const TUBE_WIDTH_RATIO = 0.36;
const CAP_HEIGHT = 8;

/** The drill head, with its bit pointing down at the rock. */
export function addDrill(scene: Phaser.Scene): Phaser.GameObjects.Container {
  const body = scene.add.graphics();
  body
    .fillStyle(PALETTE.metal, 1)
    .fillRect(-DRILL.width / 2, -DRILL.height, DRILL.width, DRILL.height);
  body.lineStyle(2, PALETTE.metalLight, 1);
  body.strokeRect(-DRILL.width / 2, -DRILL.height, DRILL.width, DRILL.height);
  body.fillStyle(PALETTE.cyan, 1).fillRect(-3, -DRILL.height + 5, 6, 4); // LED: it is a machine
  const bit = scene.add.graphics();
  bit.fillStyle(PALETTE.metalLight, 1);
  bit.fillRect(-DRILL.bitWidth / 2, 0, DRILL.bitWidth, DRILL.bitHeight);
  bit.fillTriangle(
    -DRILL.bitWidth / 2,
    DRILL.bitHeight,
    DRILL.bitWidth / 2,
    DRILL.bitHeight,
    0,
    DRILL.bitHeight + 5,
  );
  return scene.add.container(0, 0, [bit, body]);
}

/** The rock core: rust-colored layers, like the rock it was cut from. */
export function addCore(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
  const core = scene.add.graphics();
  const layerHeight = CORE.height / CORE_LAYERS;
  const colors = [PALETTE.marsLight, PALETTE.mars, PALETTE.sand];
  colors.forEach((color, index) => {
    core.fillStyle(color, 1);
    core.fillRect(-CORE.width / 2, -CORE.height / 2 + layerHeight * index, CORE.width, layerHeight);
  });
  core
    .lineStyle(1, PALETTE.marsDark, 1)
    .strokeRect(-CORE.width / 2, -CORE.height / 2, CORE.width, CORE.height);
  return core;
}

export type TubeLook = 'open' | 'sealed' | 'contaminated';

/** Redraws a tube of `height` centered on (0, 0): open at the top, or closed with its cap. */
export function drawTube(tube: Phaser.GameObjects.Graphics, height: number, look: TubeLook): void {
  const width = height * TUBE_WIDTH_RATIO;
  const fill = look === 'contaminated' ? PALETTE.marsLight : PALETTE.white;
  tube.clear();
  tube.fillStyle(fill, look === 'contaminated' ? 0.7 : 0.35);
  tube.fillRoundedRect(-width / 2, -height / 2, width, height, {
    tl: 0,
    tr: 0,
    bl: width / 2,
    br: width / 2,
  });
  tube.lineStyle(2, PALETTE.white, 1);
  tube.strokeRoundedRect(-width / 2, -height / 2, width, height, {
    tl: 0,
    tr: 0,
    bl: width / 2,
    br: width / 2,
  });
  if (look === 'open') return;
  tube
    .fillStyle(PALETTE.metalLight, 1)
    .fillRect(-width / 2 - 2, -height / 2 - CAP_HEIGHT, width + 4, CAP_HEIGHT);
}

export function addTube(
  scene: Phaser.Scene,
  height: number,
  look: TubeLook,
): Phaser.GameObjects.Graphics {
  const tube = scene.add.graphics();
  drawTube(tube, height, look);
  return tube;
}

/** A small rack of sealed tubes, for the how-to pictures. */
export function addShelfIcon(scene: Phaser.Scene, size: number): Phaser.GameObjects.Container {
  const rack = scene.add.graphics();
  rack.fillStyle(PALETTE.metalDark, 1).fillRect(-size / 2, size / 2 - 4, size, 4);
  const tubeHeight = size * 0.7;
  const tubes = [-1, 0, 1].map((column) => {
    const tube = addTube(scene, tubeHeight, 'sealed');
    return tube.setPosition((column * size) / 3, size / 2 - 4 - tubeHeight / 2);
  });
  return scene.add.container(0, 0, [rack, ...tubes]);
}

/** The rover stopped on the ground of Mars, to drill: it covers the road of the drive. */
export function drawStopGround(scene: Phaser.Scene, play: Rect): void {
  const ground = scene.add.graphics();
  ground.fillStyle(PALETTE.marsDark, 1).fillRect(play.x, play.y, play.width, play.height);
  const horizonY = play.y + play.height * 0.55;
  ground
    .fillStyle(PALETTE.mars, 1)
    .fillRect(play.x, horizonY, play.width, play.y + play.height - horizonY);
}
