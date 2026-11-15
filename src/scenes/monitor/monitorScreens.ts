import type Phaser from 'phaser';
import { RUN_BALANCE } from '../../config/balance';
import { galleryTextureKey, locationGallery } from '../../content/locationGallery';
import type { LandingBlocker } from '../../core/progression';
import type { LocationConfig } from '../../core/types';
import { t, type TranslationKey } from '../../i18n';
import { addCoverPhoto } from '../../ui/coverPhoto';
import {
  CONSOLE_BIG_SCREEN,
  CONSOLE_ROUTE_SCREEN,
  CONSOLE_STARS_SCREEN,
  FONT_SIZE,
  type Rect,
} from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';
import { addGlowText, drawScreenScanlines, drawVisorCorners } from '../../ui/screenUi';
import { addSpriteSized, STAT_ICON_SPRITES } from '../../ui/sprites';
import { addStar } from '../../ui/star';
import { addPhotoCredit } from '../cabin/cabinView';
import { locationText } from '../map/locationText';
import { drawRouteMap } from './routeMap';

/**
 * Spec 18, scene 4 — What the screens of the destination console show. They are drawn behind
 * the console art, which has transparent glass, so the bezel crops them for free.
 * Big screen: the place's name and its real photos ("photo" view, the photo button changes
 * the photo), or why it is hard, its goals and whether the ship can land ("info" view, i button).
 */
export type BigScreenView = 'photo' | 'info';

export interface MonitorState {
  location: LocationConfig;
  order: number;
  total: number;
  view: BigScreenView;
  photoIndex: number;
  blocker: LandingBlocker;
  stars: number;
  record?: number;
  missingStars: number;
}

type Parts = Phaser.GameObjects.GameObject[];
const BIG = CONSOLE_BIG_SCREEN;
const SCREENS = [BIG, CONSOLE_STARS_SCREEN, CONSOLE_ROUTE_SCREEN];
const PAD = 8;
const PHOTO: Rect = {
  x: BIG.x + PAD,
  y: BIG.y + 34,
  width: BIG.width - PAD * 2,
  height: BIG.height - 42,
};
const GOAL_LINE_HEIGHT = 15;
const GOAL_ICON_SIZE = 10;
/** Goals are long lines: a bit smaller (and sharper) so each one fits in one line. */
const GOAL_TEXT = { scale: 0.8, resolution: 4 } as const;

export function drawMonitorScreens(scene: Phaser.Scene, state: MonitorState): Parts {
  const glass = scene.add.graphics();
  glass.fillStyle(PALETTE.night, 1);
  for (const screen of SCREENS) {
    glass.fillRect(screen.x - 6, screen.y - 6, screen.width + 12, screen.height + 12);
  }
  const big = state.view === 'photo' ? drawPhotoView(scene, state) : drawInfoView(scene, state);
  const scanlines = scene.add.graphics();
  for (const screen of SCREENS) drawScreenScanlines(scanlines, screen);
  return [
    glass,
    ...big,
    ...drawStars(scene, state),
    ...drawRouteMap(scene, state.order - 1),
    scanlines,
  ];
}

/** How many real photos the photo button cycles through for this place. */
export function galleryLength(locationId: string): number {
  return locationGallery(locationId).length;
}

function drawHeading(scene: Phaser.Scene, state: MonitorState, rightText?: string): Parts {
  const counter = t('monitor.destination', { current: state.order, total: state.total });
  const name = locationText(state.location.id, 'name');
  const parts: Parts = [
    addGlowText(scene, BIG.x + PAD, BIG.y + 9, counter, { color: PALETTE.metal }).setOrigin(0, 0.5),
    addGlowText(scene, BIG.x + PAD, BIG.y + 23, name, { size: FONT_SIZE.medium }).setOrigin(0, 0.5),
  ];
  if (rightText) {
    const right = addGlowText(scene, BIG.x + BIG.width - PAD, BIG.y + 9, rightText, {
      color: TECH_GLOW,
    });
    parts.push(right.setOrigin(1, 0.5));
  }
  return parts;
}

function drawPhotoView(scene: Phaser.Scene, state: MonitorState): Parts {
  const gallery = locationGallery(state.location.id);
  const photo = gallery[state.photoIndex];
  if (!photo || !scene.textures.exists(galleryTextureKey(photo))) return drawHeading(scene, state);
  const label = `${t('monitor.realPhoto')} ${state.photoIndex + 1}/${gallery.length}`;
  const image = addCoverPhoto(scene, galleryTextureKey(photo), PHOTO);
  const corners = scene.add.graphics();
  drawVisorCorners(corners, PHOTO);
  return [
    ...drawHeading(scene, state, label),
    image,
    ...addPhotoCredit(scene, PHOTO, photo.credit),
    corners,
  ];
}

function drawInfoView(scene: Phaser.Scene, state: MonitorState): Parts {
  const why = addGlowText(scene, BIG.x + PAD, BIG.y + 34, locationText(state.location.id, 'why'), {
    color: PALETTE.metalLight,
    wrapWidth: BIG.width - PAD * 2,
  });
  why.setOrigin(0).setAlign('left');
  const title = addGlowText(scene, BIG.x + PAD, why.y + why.height + 8, t('monitor.goals'), {
    color: PALETTE.sun,
  }).setOrigin(0, 0.5);
  const goalsTop = title.y + GOAL_LINE_HEIGHT;
  return [
    ...drawHeading(scene, state),
    why,
    title,
    ...drawGoals(scene, state, goalsTop),
    drawStatus(scene, state),
  ];
}

/** One line per star to win; the last one names the bar to keep up, with its icon. */
function drawGoals(scene: Phaser.Scene, state: MonitorState, top: number): Parts {
  const { challenge, samplesGoal } = state.location;
  const lines = [
    t('map.goal.survive', { sols: RUN_BALANCE.solsPerRun }),
    t('map.goal.samples', { goal: samplesGoal }),
    t(`monitor.challenge.${challenge.stat}` as TranslationKey, { minimum: challenge.minimum }),
  ];
  return lines.flatMap((line, index) => {
    const y = top + index * GOAL_LINE_HEIGHT;
    const star = addStar(scene, BIG.x + PAD + 5, y, GOAL_ICON_SIZE, true);
    const text = addGlowText(scene, BIG.x + PAD + 14, y, line).setOrigin(0, 0.5);
    text.setResolution(GOAL_TEXT.resolution).setScale(GOAL_TEXT.scale);
    const parts: Parts = [star, text];
    if (index === lines.length - 1) {
      const iconX = text.x + text.displayWidth + GOAL_ICON_SIZE;
      parts.push(
        addSpriteSized(scene, iconX, y, STAT_ICON_SPRITES[challenge.stat], GOAL_ICON_SIZE),
      );
    }
    return parts;
  });
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
  const status = addGlowText(scene, BIG.x + BIG.width / 2, BIG.y + BIG.height - 9, message, {
    color,
  });
  return status.setName('status');
}

function drawStars(scene: Phaser.Scene, state: MonitorState): Parts {
  const screen = CONSOLE_STARS_SCREEN;
  const centerX = screen.x + screen.width / 2;
  const record = state.record ? String(state.record) : '---';
  const parts: Parts = [
    addGlowText(scene, centerX, screen.y + 9, t('monitor.stars'), { color: PALETTE.metal }),
    addGlowText(scene, centerX, screen.y + 45, t('monitor.record'), { color: PALETTE.metal }),
    addGlowText(scene, centerX, screen.y + 57, record, { color: PALETTE.sun }),
  ];
  for (let index = 0; index < 3; index += 1) {
    parts.push(addStar(scene, centerX + (index - 1) * 22, screen.y + 27, 18, index < state.stars));
  }
  return parts;
}
