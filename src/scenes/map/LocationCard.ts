import Phaser from 'phaser';
import { RUN_BALANCE } from '../../config/balance';
import type { LocationConfig } from '../../core/types';
import { t } from '../../i18n';
import { createButton } from '../../ui/Button';
import { drawFramedPhoto } from '../../ui/framedPhoto';
import { FONT_SIZE, LOCATION_CARD, STAT_ICONS, type Rect } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { drawTechPanel } from '../../ui/techFrame';
import { addText } from '../../ui/text';
import { locationText } from './locationText';

/**
 * Spec 12 — Card shown when a location is tapped: real photo, why it is hard (one line),
 * the 3 objectives with icons and one big LAND button. Tapping outside closes it.
 */
const CARD_DEPTH = 50;
const PHOTO: Rect = { x: LOCATION_CARD.x + 20, y: LOCATION_CARD.y + 40, width: 140, height: 100 };
const GOALS_X = LOCATION_CARD.x + 180;
const CENTER_X = LOCATION_CARD.x + LOCATION_CARD.width / 2;

export function showLocationCard(
  scene: Phaser.Scene,
  location: LocationConfig,
  onLand: () => void,
): Phaser.GameObjects.Container {
  const card = scene.add.container(0, 0).setDepth(CARD_DEPTH);
  card.add(createBackground(scene, () => card.destroy()));
  card.add(
    addText(scene, CENTER_X, LOCATION_CARD.y + 20, locationText(location.id, 'name'), {
      color: PALETTE.sun,
    }),
  );
  card.add(drawFramedPhoto(scene, location.id, PHOTO));
  card.add(addGoals(scene, location));
  card.add(
    addText(scene, CENTER_X, LOCATION_CARD.y + 168, locationText(location.id, 'why'), {
      size: FONT_SIZE.small,
      color: PALETTE.cyan,
      wrapWidth: LOCATION_CARD.width - 40,
    }),
  );
  card.add(createLandButton(scene, onLand));
  return card;
}

function createBackground(
  scene: Phaser.Scene,
  onClose: () => void,
): Phaser.GameObjects.GameObject[] {
  const outside = scene.add.zone(0, 0, scene.scale.width, scene.scale.height).setOrigin(0);
  outside.setInteractive().on('pointerup', onClose);
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
    const text = addText(scene, GOALS_X, PHOTO.y + 18 + index * 30, goal, {
      size: FONT_SIZE.small,
    });
    return text.setOrigin(0, 0.5);
  });
}

function createLandButton(scene: Phaser.Scene, onLand: () => void): Phaser.GameObjects.Container {
  return createButton(scene, {
    x: CENTER_X,
    y: LOCATION_CARD.y + 236,
    width: 240,
    height: 56,
    label: `🚀 ${t('map.land')}`,
    fontSize: FONT_SIZE.large,
    color: PALETTE.green,
    onPress: onLand,
  });
}
