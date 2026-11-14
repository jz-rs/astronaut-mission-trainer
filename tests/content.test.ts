import { describe, expect, it } from 'vitest';
import events from '../data/events.json';
import { LOCATIONS } from '../src/content/locations';
import { TASK_IDS } from '../src/core/types';
import es from '../src/i18n/es.json';

/** Spec 13 — every piece of content shown in the game has its text in both languages. */
const keys = new Set(Object.keys(es));

describe('educational content', () => {
  it('explains every minigame and has 3 facts for it', () => {
    for (const taskId of TASK_IDS) {
      for (const suffix of ['why', 'fact', 'fact2', 'fact3']) {
        expect(keys.has(`task.${taskId}.${suffix}`)).toBe(true);
      }
    }
  });

  it('explains why every location is hard', () => {
    for (const location of LOCATIONS) {
      expect(keys.has(`location.${location.id}.why`)).toBe(true);
    }
  });

  it('has at least 8 real events, each with a source and its texts', () => {
    expect(events.length).toBeGreaterThanOrEqual(8);
    for (const event of events) {
      expect(event.source).toMatch(/https:\/\//);
      expect(keys.has(`event.${event.id}.name`)).toBe(true);
      expect(keys.has(`event.${event.id}.text`)).toBe(true);
    }
  });
});
