import type Phaser from 'phaser';
import { COLLAB_BALANCE } from '../../../config/balance';
import type { CrisisMeeting, CrisisProcedureId } from '../../../core/types';
import { t } from '../../../i18n';
import { FONT_SIZE, TABLET_SCREEN } from '../../../ui/layout';
import { CREW_COLORS, PALETTE } from '../../../ui/palette';
import { crisisPhotoTexture } from './crisisArt';
import { CRISIS_SCREENS, PROCEDURE_ICONS, type CrisisEventType } from './crisisContent';
import { drawPhoto } from './crisisPhoto';
import { createProcedureButton } from './procedureButton';
import { addText } from '../../../ui/text';

/**
 * Spec 16, step 2 — "What do we do?": a small real photo of what is coming, one line, and two
 * huge buttons with a picture and two words each. The bar at the bottom is the time left.
 * Each crew vote shows as a dot of its visor color on the chosen button.
 */
const PHOTO = { x: TABLET_SCREEN.x + 28, y: TABLET_SCREEN.y + 16, width: 64, height: 64 };
const TITLE = { x: TABLET_SCREEN.x + 290, y: TABLET_SCREEN.y + 48, wrap: 300 };
const BUTTON = { width: 200, height: 96, y: TABLET_SCREEN.y + 150, gap: 28 };
const TIMER = { y: TABLET_SCREEN.y + TABLET_SCREEN.height - 18, height: 6, margin: 16 };
const VOTE_DOT = { size: 7, gap: 4, inset: 10 };

export interface VoteScreen {
  parts: Phaser.GameObjects.GameObject[];
  update(meeting: CrisisMeeting): void;
}

export function drawVoteScreen(
  scene: Phaser.Scene,
  meeting: CrisisMeeting,
  type: CrisisEventType,
  onVote: (procedureId: CrisisProcedureId) => void,
): VoteScreen {
  const photo = drawPhoto(
    scene,
    PHOTO,
    crisisPhotoTexture(CRISIS_SCREENS[type].votePhoto),
    PALETTE.cyan,
  );
  const title = addText(scene, TITLE.x, TITLE.y, t(`crisis.${type}.title`), {
    size: FONT_SIZE.medium,
    color: PALETTE.sun,
    wrapWidth: TITLE.wrap,
  });
  const buttons = createButtons(scene, meeting, onVote);
  const votes = scene.add.graphics();
  const timer = scene.add.graphics();
  const update = (current: CrisisMeeting) => {
    drawVotes(votes, current);
    drawTimer(timer, current.remainingMs / COLLAB_BALANCE.meetingVoteMs);
  };
  update(meeting);
  return { parts: [...photo, title, ...buttons, votes, timer], update };
}

function createButtons(
  scene: Phaser.Scene,
  meeting: CrisisMeeting,
  onVote: (procedureId: CrisisProcedureId) => void,
): Phaser.GameObjects.Container[] {
  return meeting.options.map((procedureId, index) =>
    createProcedureButton(scene, {
      x: buttonCenterX(index),
      y: BUTTON.y,
      width: BUTTON.width,
      height: BUTTON.height,
      icon: PROCEDURE_ICONS[procedureId],
      label: t(`crisis.procedure.${procedureId}`),
      onPress: () => onVote(procedureId),
    }),
  );
}

function buttonCenterX(index: number): number {
  const centerX = TABLET_SCREEN.x + TABLET_SCREEN.width / 2;
  const offset = (BUTTON.width + BUTTON.gap) / 2;
  return index === 0 ? centerX - offset : centerX + offset;
}

function drawVotes(graphics: Phaser.GameObjects.Graphics, meeting: CrisisMeeting): void {
  graphics.clear();
  meeting.options.forEach((procedureId, index) => {
    const voters = Object.keys(meeting.votes).filter(
      (crewId) => meeting.votes[crewId] === procedureId,
    );
    const right = buttonCenterX(index) + BUTTON.width / 2 - VOTE_DOT.inset;
    const top = BUTTON.y - BUTTON.height / 2 + VOTE_DOT.inset;
    voters.forEach((crewId, voterIndex) => {
      const x = right - (voterIndex + 1) * (VOTE_DOT.size + VOTE_DOT.gap);
      graphics
        .fillStyle(CREW_COLORS[crewId] ?? PALETTE.white, 1)
        .fillRect(x, top, VOTE_DOT.size, VOTE_DOT.size);
    });
  });
}

function drawTimer(graphics: Phaser.GameObjects.Graphics, share: number): void {
  const left = TABLET_SCREEN.x + TIMER.margin;
  const width = TABLET_SCREEN.width - TIMER.margin * 2;
  graphics.clear();
  graphics.fillStyle(PALETTE.metalDark, 1).fillRect(left, TIMER.y, width, TIMER.height);
  const filled = width * Math.max(0, Math.min(1, share));
  graphics.fillStyle(PALETTE.alert, 1).fillRect(left, TIMER.y, filled, TIMER.height);
}
