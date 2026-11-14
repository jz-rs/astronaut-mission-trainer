import Phaser from 'phaser';
import type { EventNews, RunState } from '../../core/types';
import { t, type TranslationKey } from '../../i18n';
import { FONT_SIZE, GAME_WIDTH, type Rect } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { drawTechPanel } from '../../ui/techFrame';
import { addText } from '../../ui/text';

/**
 * Spec 14 — Announces each warning ("📡 Message from Earth") and each event as it happens:
 * one line inside a glowing banner, plus a shake and a flash when the event lands.
 */
const BANNER: Rect = { x: 60, y: 140, width: GAME_WIDTH - 120, height: 40 };
const BANNER_DEPTH = 40;
const BANNER_MS = 3200;
const SHAKE_MS = 400;
const SHAKE_INTENSITY = 0.012;
const FLASH_MS = 250;

export class EventAnnouncer {
  private announcedCount = 0;
  private banner: Phaser.GameObjects.Container | null = null;

  constructor(private readonly scene: Phaser.Scene) {}

  update(state: RunState): void {
    while (this.announcedCount < state.eventNews.length) {
      const news = state.eventNews[this.announcedCount];
      this.announcedCount += 1;
      if (news) this.announce(news, state);
    }
  }

  private announce(news: EventNews, state: RunState): void {
    const isGood = state.events.find((event) => event.eventId === news.eventId)?.type === 'good';
    if (news.kind === 'warning') {
      const eventName = t(eventKey(news.eventId, 'name'));
      this.showBanner(t('event.warning', { event: eventName }), PALETTE.cyan);
      return;
    }
    this.showBanner(t(eventKey(news.eventId, 'text')), isGood ? PALETTE.green : PALETTE.alert);
    if (isGood) return;
    this.scene.cameras.main.shake(SHAKE_MS, SHAKE_INTENSITY);
    this.scene.cameras.main.flash(FLASH_MS, 229, 72, 77); // PALETTE.alert as RGB
  }

  private showBanner(message: string, accent: number): void {
    this.banner?.destroy();
    const panel = this.scene.add.graphics();
    drawTechPanel(panel, BANNER, accent);
    const text = addText(this.scene, GAME_WIDTH / 2, BANNER.y + BANNER.height / 2, message, {
      size: FONT_SIZE.small,
      color: accent,
    });
    const banner = this.scene.add.container(0, 0, [panel, text]).setDepth(BANNER_DEPTH);
    banner.setScale(1, 0);
    this.scene.tweens.add({ targets: banner, scaleY: 1, duration: 200, ease: 'Back.Out' });
    this.scene.time.delayedCall(BANNER_MS, () => {
      if (this.banner === banner) this.banner = null;
      banner.destroy();
    });
    this.banner = banner;
  }
}

/** Event ids come from data/events.json; tests/content.test.ts checks their texts exist. */
export function eventKey(eventId: string, field: 'name' | 'text'): TranslationKey {
  return `event.${eventId}.${field}` as TranslationKey;
}
