import Phaser from 'phaser';
import { RUN_BALANCE } from '../../config/balance';
import type { LocationConfig } from '../../core/types';
import { t } from '../../i18n';
import { createButton } from '../../ui/Button';
import { drawFramedPhoto } from '../../ui/framedPhoto';
import { addCloseButton } from '../../ui/closeButton';
import {
  FONT_SIZE,
  GAME_HEIGHT,
  GAME_WIDTH,
  LOCATION_CARD,
  STAT_ICONS,
  type Rect,
} from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { drawTechPanel } from '../../ui/techFrame';
import { addText } from '../../ui/text';
import { locationText } from './locationText';

/**
 * Spec 12 — Card shown when a location is tapped. Top to bottom: name, why it is hard (one line),
 * the real photo next to the 3 objectives, and one big LAND button. The X or a tap outside
 * closes it; the map behind is dimmed so only the card is read.
 */
const CARD_DEPTH = 50;
const DIM_ALPHA = 0.75;
const PHOTO: Rect = { x: LOCATION_CARD.x + 24, y: LOCATION_CARD.y + 70, width: 150, height: 100 };
const GOALS_X = LOCATION_CARD.x + 196;
const GOAL_SPACING = 30;
const CENTER_X = LOCATION_CARD.x + LOCATION_CARD.width / 2;
const CLOSE_CORNER = { x: LOCATION_CARD.x + LOCATION_CARD.width - 20, y: LOCATION_CARD.y + 20 };

export function showLocationCard(
  scene: Phaser.Scene,
  location: LocationConfig,
  onLand: () => void,
): Phaser.GameObjects.Container {
  const card = scene.add.container(0, 0).setDepth(CARD_DEPTH);
  const close = () => card.destroy();
  card.add(createBackground(scene, close));
  card.add(
    addText(scene, CENTER_X, LOCATION_CARD.y + 22, locationText(location.id, 'name'), {
      color: PALETTE.sun,
    }),
  );
  card.add(
    addText(scene, CENTER_X, LOCATION_CARD.y + 46, locationText(location.id, 'why'), {
      size: FONT_SIZE.small,
      color: PALETTE.cyan,
      wrapWidth: LOCATION_CARD.width - 80,
    }),
  );
  card.add(drawFramedPhoto(scene, location.id, PHOTO));
  card.add(addGoals(scene, location));
  card.add(createLandButton(scene, onLand));
  card.add(addCloseButton(scene, close, CLOSE_CORNER));
  return card;
}

function createBackground(
  scene: Phaser.Scene,
  onClose: () => void,
): Phaser.GameObjects.GameObject[] {
  const outside = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, PALETTE.night, DIM_ALPHA);
  outside.setOrigin(0).setInteractive().on('pointerup', onClose);
  const { x, y, width, height } = LOCATION_CARD;
  const inside = scene.add.zone(x, y, width, height).setOrigin(0).setInteractive(); // keeps it open
  const panel = scene.add.graphics();
  drawTechPanel(panel, LOCATION_CARD, PALETTE.marsLight);
  return [outside, panel, inside];
}

function addGoals(scene: Phaser.Scene, location: LocationConfig): Phaser.GameObjects.Text[] {
  const { challenge } = location;
  const goals = [
    `⭐ ${t('map.goal.survive', { sols: RUN_BALANCE.solsPerRun })}`,
    `⭐ 🧪 ${t('map.goal.samples', { goal: location.samplesGoal })}`,
    `⭐ ${t('map.goal.challenge', { stat: STAT_ICONS[challenge.stat], minimum: challenge.minimum })}`,
  ];
  return goals.map((goal, index) => {
    const text = addText(scene, GOALS_X, PHOTO.y + 20 + index * GOAL_SPACING, goal, {
      size: FONT_SIZE.small,
    });
    return text.setOrigin(0, 0.5);
  });
}

function createLandButton(scene: Phaser.Scene, onLand: () => void): Phaser.GameObjects.Container {
  return createButton(scene, {
    x: CENTER_X,
    y: LOCATION_CARD.y + 244,
    width: 240,
    height: 56,
    label: `🚀 ${t('map.land')}`,
    fontSize: FONT_SIZE.large,
    color: PALETTE.green,
    onPress: onLand,
  });
}
