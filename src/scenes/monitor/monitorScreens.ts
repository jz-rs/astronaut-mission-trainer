import type Phaser from 'phaser';
import { RUN_BALANCE } from '../../config/balance';
import { LOCATION_PHOTOS, photoTextureKey } from '../../content/locationPhotos';
import type { LandingBlocker } from '../../core/progression';
import type { LocationConfig } from '../../core/types';
import { t } from '../../i18n';
import { addCoverPhoto } from '../../ui/coverPhoto';
import {
  CONSOLE_BIG_SCREEN,
  CONSOLE_ROUTE_SCREEN,
  CONSOLE_STARS_SCREEN,
  FONT_SIZE,
  STAT_ICONS,
  type Rect,
} from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';
import { addGlowText, drawScreenScanlines, drawVisorCorners } from '../../ui/screenUi';
import { addStar } from '../../ui/star';
import { addPhotoCredit } from '../cabin/cabinView';
import { locationText } from '../map/locationText';

/**
 * Spec 18, scene 4 — What the three screens of the destination console show. They are drawn
 * behind the console art, which has transparent glass, so the bezel crops them for free.
 * Big screen: name, real photo and why the place is hard (or its goals, or the photo in big).
 */
export type BigScreenView = 'summary' | 'goals' | 'photo';

export interface MonitorState {
  location: LocationConfig;
  order: number;
  total: number;
  view: BigScreenView;
  blocker: LandingBlocker;
  stars: number;
  record?: number;
  missingStars: number;
}

type Parts = Phaser.GameObjects.GameObject[];
const BIG = CONSOLE_BIG_SCREEN;
const PAD = 8;
const SUMMARY_PHOTO: Rect = { x: BIG.x + PAD, y: BIG.y + 36, width: 124, height: 70 };
const STATUS_Y = BIG.y + BIG.height - 12;

export function drawMonitorScreens(scene: Phaser.Scene, state: MonitorState): Parts {
  const glass = scene.add.graphics();
  glass.fillStyle(PALETTE.night, 1);
  for (const screen of [BIG, CONSOLE_STARS_SCREEN, CONSOLE_ROUTE_SCREEN]) {
    glass.fillRect(screen.x - 6, screen.y - 6, screen.width + 12, screen.height + 12);
  }
  const big = { summary: drawSummary, goals: drawGoals, photo: drawBigPhoto }[state.view];
  const scanlines = scene.add.graphics();
  for (const screen of [BIG, CONSOLE_STARS_SCREEN, CONSOLE_ROUTE_SCREEN])
    drawScreenScanlines(scanlines, screen);
  return [
    glass,
    ...big(scene, state),
    ...drawStars(scene, state),
    drawRoute(scene, state),
    scanlines,
  ];
}

function drawHeading(scene: Phaser.Scene, state: MonitorState): Parts {
  const counter = t('monitor.destination', { current: state.order, total: state.total });
  return [
    addGlowText(scene, BIG.x + PAD, BIG.y + 9, counter, { color: PALETTE.metal }).setOrigin(0, 0.5),
    addGlowText(scene, BIG.x + PAD, BIG.y + 24, locationText(state.location.id, 'name'), {
      size: FONT_SIZE.medium,
    }).setOrigin(0, 0.5),
  ];
}

function drawSummary(scene: Phaser.Scene, state: MonitorState): Parts {
  const textX = SUMMARY_PHOTO.x + SUMMARY_PHOTO.width + 10;
  const why = addGlowText(scene, textX, SUMMARY_PHOTO.y, locationText(state.location.id, 'why'), {
    color: PALETTE.metalLight,
    wrapWidth: BIG.x + BIG.width - PAD - textX,
  });
  return [
    ...drawHeading(scene, state),
    ...drawPhoto(scene, state, SUMMARY_PHOTO, false),
    addGlowText(
      scene,
      SUMMARY_PHOTO.x,
      SUMMARY_PHOTO.y + SUMMARY_PHOTO.height + 8,
      t('monitor.realPhoto'),
      {
        color: TECH_GLOW,
      },
    ).setOrigin(0, 0.5),
    why.setOrigin(0).setAlign('left'),
    drawStatus(scene, state),
  ];
}

function drawGoals(scene: Phaser.Scene, state: MonitorState): Parts {
  const { challenge, samplesGoal } = state.location;
  const goals = [
    t('map.goal.survive', { sols: RUN_BALANCE.solsPerRun }),
    t('map.goal.samples', { goal: samplesGoal }),
    t('map.goal.challenge', { stat: STAT_ICONS[challenge.stat], minimum: challenge.minimum }),
  ];
  const lines = goals.map((goal, index) =>
    addGlowText(scene, BIG.x + PAD, BIG.y + 64 + index * 20, `⭐ ${goal}`).setOrigin(0, 0.5),
  );
  const title = addGlowText(scene, BIG.x + PAD, BIG.y + 44, t('monitor.goals'), {
    color: PALETTE.sun,
  });
  return [
    ...drawHeading(scene, state),
    title.setOrigin(0, 0.5),
    ...lines,
    drawStatus(scene, state),
  ];
}

function drawBigPhoto(scene: Phaser.Scene, state: MonitorState): Parts {
  return drawPhoto(scene, state, BIG, true);
}

function drawPhoto(
  scene: Phaser.Scene,
  state: MonitorState,
  area: Rect,
  withCredit: boolean,
): Parts {
  const photo = LOCATION_PHOTOS[state.location.id];
  const key = photoTextureKey(state.location.id);
  if (!photo || !scene.textures.exists(key)) return [];
  const image = addCoverPhoto(scene, key, area).setAlpha(state.blocker === 'stars' ? 0.5 : 1);
  const corners = scene.add.graphics();
  drawVisorCorners(corners, area);
  const credit = withCredit ? addPhotoCredit(scene, area, photo.credit) : [];
  return [image, ...credit, corners];
}

function drawStatus(scene: Phaser.Scene, state: MonitorState): Phaser.GameObjects.Text {
  const { blocker } = state;
  const message =
    blocker === 'manual'
      ? t('monitor.needManual')
      : blocker === 'stars'
        ? t('monitor.needStars', { stars: state.missingStars })
        : t('monitor.ready');
  const color = blocker ? PALETTE.alert : PALETTE.green;
  return addGlowText(scene, BIG.x + BIG.width / 2, STATUS_Y, message, { color }).setName('status');
}

function drawStars(scene: Phaser.Scene, state: MonitorState): Parts {
  const screen = CONSOLE_STARS_SCREEN;
  const centerX = screen.x + screen.width / 2;
  const parts: Parts = [
    addGlowText(scene, centerX, screen.y + 9, t('monitor.stars'), { color: PALETTE.metal }),
  ];
  for (let index = 0; index < 3; index += 1) {
    parts.push(addStar(scene, centerX + (index - 1) * 22, screen.y + 27, 18, index < state.stars));
  }
  parts.push(
    addGlowText(scene, centerX, screen.y + 45, t('monitor.record'), { color: PALETTE.metal }),
  );
  parts.push(
    addGlowText(scene, centerX, screen.y + 57, state.record ? String(state.record) : '---', {
      color: PALETTE.sun,
    }),
  );
  return parts;
}

/** Five stops on a tiny route; the selected one is bigger and yellow. */
function drawRoute(scene: Phaser.Scene, state: MonitorState): Phaser.GameObjects.Graphics {
  const screen = CONSOLE_ROUTE_SCREEN;
  const graphics = scene.add.graphics();
  const step = (screen.width - 20) / (state.total - 1);
  for (let index = 0; index < state.total; index += 1) {
    const x = screen.x + 10 + index * step;
    const y = screen.y + screen.height / 2 + 4 - index * 2;
    const selected = index === state.order - 1;
    const size = selected ? 6 : 4;
    graphics
      .fillStyle(selected ? PALETTE.sun : TECH_GLOW, 1)
      .fillRect(x - size / 2, y - size / 2, size, size);
  }
  return graphics;
}
