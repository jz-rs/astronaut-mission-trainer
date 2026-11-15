# 13 — Educational content and languages

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | C | P0 | 1 | ⚪ Proposed |

## Objective
Ensure **every fact in the game is real, verified, and sourced**, written for children aged 7 to 12 in **a single line**, and available in Spanish and English.

## Why it matters
This makes the game educational and is what NASA judges will look at. Invented or poorly cited facts cost us points.

## Scope
**Includes:**
- **Minigame facts**: 1 per minigame (preferably 2–3 to rotate), one line, ES/EN.
- **Events**: `data/events.json` content — at least 8 real events (DONKI, RadLab, OSDR) with date, effect, and source. Format agreed with A (spec 14).
- **Locations**: "why it is difficult" sentence for each of the 5.
- **Real photos**: find and download photos (locations, Sun/storms, rovers), with credit and license.
- **Sources screen**: link list (a simple scene or separate HTML is enough).
- **Text review**: all game text short and clear, in both languages.

**Excludes:** live API calls.

## Acceptance criteria
- [ ] Every fact has a row in `docs/DATA_SOURCES.md` with source and ✅ verified.
- [ ] No on-screen text exceeds ~1 line (except the Sources screen).
- [ ] `es.json` and `en.json` have the same keys (covered by a test).
- [ ] Someone read it aloud and a 7-year-old would understand it.

## Files
**Owned:** `src/i18n/*.json` (content), `data/events.json` content, `public/assets/nasa/`, `docs/DATA_SOURCES.md`, Sources scene.
**Contracts:** `data/events.json` and `data/locations.json` formats (A). Others may **add** i18n keys; C reviews wording.

## Dependencies
**Depends on:** nothing to start. **Blocks:** 14 (events), 12 and 15 (photos).

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
