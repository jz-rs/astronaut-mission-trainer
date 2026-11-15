import Phaser from 'phaser';
import { COLLAB_BALANCE } from '../../../config/balance';
import { isMeetingIntro } from '../../../core/collab';
import { isRightChoice } from '../../../core/crisisProcedures';
import type { GameSession } from '../../../core/GameSession';
import { PLAYER_ID } from '../../../core/run';
import type { CrisisMeeting, RunState, ScheduledEvent } from '../../../core/types';
import { t } from '../../../i18n';
import { PALETTE } from '../../../ui/palette';
import { crisisPhotoTexture } from './crisisArt';
import {
  CRISIS_SCREENS,
  isCrisisEventType,
  rewardKeys,
  verdictKeys,
  type CrisisEventType,
} from './crisisContent';
import { drawIntroScreen } from './crisisIntroScreen';
import { drawPhotoScreen } from './crisisPhotoScreen';
import { CrisisTablet } from './CrisisTablet';
import { drawVoteScreen, type VoteScreen } from './crisisVoteScreen';

/**
 * Spec 16 — Which crisis screen the tablet shows, read from the run state:
 *   1. the message arrives and 2. the crew votes (the core pauses the base meanwhile);
 *   3. right or wrong, with the real reason, until the kid taps OK;
 *   5. once the storm is over, a reward photo, until the kid taps GO ON.
 * Steps 3 and 5 pause the base from here (`pausesGame`), so nothing is missed while reading.
 */
type PhotoCard = { kind: 'result' | 'reward'; event: ScheduledEvent };

export class CrisisFlow {
  private readonly tablet: CrisisTablet;
  private newsRead = 0;
  private readonly cards: PhotoCard[] = [];
  private cardOnScreen: PhotoCard | null = null;
  private meetingScreen: { eventId: string; voting: boolean; vote: VoteScreen | null } | null =
    null;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly session: GameSession,
  ) {
    this.tablet = new CrisisTablet(scene);
  }

  get isOnScreen(): boolean {
    return this.tablet.isVisible;
  }

  get pausesGame(): boolean {
    return this.cardOnScreen !== null;
  }

  update(state: RunState): void {
    this.readNews(state);
    if (state.meeting) {
      this.showMeeting(state.meeting);
      return;
    }
    this.meetingScreen = null;
    if (this.cardOnScreen) return;
    const next = this.cards.shift();
    if (next) this.showCard(next);
    else if (this.tablet.isVisible) this.tablet.hide();
  }

  private readNews(state: RunState): void {
    for (; this.newsRead < state.eventNews.length; this.newsRead += 1) {
      const news = state.eventNews[this.newsRead];
      const event = state.events.find((candidate) => candidate.eventId === news?.eventId);
      if (!news || !event || !isCrisisEventType(event.type)) continue;
      if (news.kind === 'decided') this.cards.push({ kind: 'result', event });
      if (news.kind === 'hit' && hadCrisis(event)) {
        // The storm's banner and shake go first; then the reward photo.
        this.scene.time.delayedCall(COLLAB_BALANCE.rewardDelayMs, () =>
          this.cards.push({ kind: 'reward', event }),
        );
      }
    }
  }

  private showMeeting(meeting: CrisisMeeting): void {
    const event = this.session.state.events.find(
      (candidate) => candidate.eventId === meeting.eventId,
    );
    if (!event || !isCrisisEventType(event.type)) return;
    const voting = !isMeetingIntro(meeting);
    const current = this.meetingScreen;
    if (current?.eventId === meeting.eventId && current.voting === voting) {
      current.vote?.update(meeting);
      return;
    }
    this.meetingScreen = { eventId: meeting.eventId, voting, vote: null };
    if (!voting) {
      this.tablet.show(drawIntroScreen(this.scene, randomSignalDelay()), 'alert');
      return;
    }
    const vote = drawVoteScreen(this.scene, meeting, event.type, (procedureId) =>
      this.session.dispatch({ type: 'castVote', crewId: PLAYER_ID, procedureId }),
    );
    this.meetingScreen.vote = vote;
    this.tablet.show(vote.parts, 'alert');
  }

  private showCard(card: PhotoCard): void {
    if (!isCrisisEventType(card.event.type)) return;
    this.cardOnScreen = card;
    const close = () => {
      this.cardOnScreen = null;
    };
    const parts =
      card.kind === 'result'
        ? drawResult(this.scene, card.event, card.event.type, close)
        : drawReward(this.scene, card.event, card.event.type, close);
    const mood = card.kind === 'reward' ? 'calm' : isRight(card.event) ? 'right' : 'wrong';
    this.tablet.show(parts, mood);
  }
}

/** Only crises with a meeting or a shelter get the reward photo; a surprise dust storm does not. */
function hadCrisis(event: ScheduledEvent): boolean {
  return event.crisisChoice !== undefined || event.crewSheltered !== undefined;
}

function isRight(event: ScheduledEvent): boolean {
  return isRightChoice(event.type, event.crisisChoice ?? null);
}

/** Radio waves take 3 to 22 minutes from Earth to Mars, depending on where both planets are. */
function randomSignalDelay(): number {
  const { min, max } = COLLAB_BALANCE.signalDelayMinutes;
  return Phaser.Math.Between(min, max);
}

function drawResult(
  scene: Phaser.Scene,
  event: ScheduledEvent,
  type: CrisisEventType,
  onClose: () => void,
) {
  const verdict = isRight(event) ? 'right' : 'wrong';
  const keys = verdictKeys(type, verdict);
  const screens = CRISIS_SCREENS[type];
  return drawPhotoScreen(scene, {
    verdict,
    title: t(verdict === 'right' ? 'crisis.right' : 'crisis.wrong'),
    color: verdict === 'right' ? PALETTE.green : PALETTE.alert,
    photoTexture: crisisPhotoTexture(verdict === 'right' ? screens.rightPhoto : screens.wrongPhoto),
    caption: t(keys.caption),
    label: t('crisis.why'),
    text: t(keys.why),
    detail: t(keys.detail),
    chip: {
      stat: screens.stat,
      text: t(verdict === 'right' ? 'crisis.lessDamage' : 'crisis.moreDamage'),
    },
    buttonLabel: t('crisis.ok'),
    onButton: onClose,
  });
}

function drawReward(
  scene: Phaser.Scene,
  event: ScheduledEvent,
  type: CrisisEventType,
  onClose: () => void,
) {
  const keys = rewardKeys(type);
  return drawPhotoScreen(scene, {
    verdict: null,
    title: t(event.crewSheltered ? 'crisis.safe' : 'crisis.passed'),
    color: PALETTE.green,
    photoTexture: crisisPhotoTexture(CRISIS_SCREENS[type].rewardPhoto),
    caption: t(keys.caption),
    label: t('crisis.didYouKnow'),
    text: t(keys.text),
    detail: t(keys.detail),
    chip: null,
    buttonLabel: t('crisis.continue'),
    onButton: onClose,
  });
}
