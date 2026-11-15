# 11 — Start and result screens + phone experience

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | C | P0 | 1 | ⚪ Proposed |

> Planning update: [spec 19](19-intro-cabina-manual.md) documents the intro, initial manual, and destination selection inside the ship. See it for approved flow changes and pending details.

## Objective
Let someone open the link on a phone and **be playing in under 10 seconds without reading anything**, and **want to play again** when finished.

## Why it matters
Exactly where other track projects fail: too much text and a learning curve at entry. First impressions determine whether a child stays.

## Scope
**Start screen:**
- Title + Mars background (art from 01).
- **One huge PLAY button.**
- ES / EN language selector (flags or abbreviations), remembered between visits.
- Small "Sources" link (spec 13).

**Phone:**
- Tapping PLAY: request fullscreen and lock landscape (where the browser allows).
- Fullscreen button midway down the left edge, to return after exiting (Android and others). Visible only if the browser supports it and neither fullscreen nor installed app mode is active.
- iPhone does not allow fullscreen in any browser (Safari or Chrome): the start screen shows "📲 Fullscreen: Share → Add to Home Screen", with ✕ to dismiss. Hidden if already opened from the home screen.
- Installable: `public/manifest.webmanifest` + icons in `public/assets/icons/` (violet astronaut), opening from the home screen as an app without browser bars.
- If portrait: "📱↻ Rotate your phone" screen (needed on iPhone, which does not allow locking).
- No accidental zoom or scrolling.

**Result screen:**
- The **3 stars** first (earned/empty), large and animated.
- "The base survived!" / "The crew had to evacuate".
- Score + "New record!" if applicable.
- **Why a star was lost**, in one line (e.g. "Energy dropped below 20% on sol 3").
- One-line real fact.
- Buttons: 🔁 Retry (large) and 🗺️ Map.

## Acceptance criteria
- [ ] Tested on at least 1 Android and 1 iPhone, in landscape.
- [ ] From opening the link to playing: ≤ 2 taps.
- [ ] Retry is the most visible button on the result screen.
- [ ] All text comes from `i18n`; changing language changes everything.

## Files
**Owned:** `src/scenes/MenuScene.ts`, `src/scenes/ResultScene.ts`, `src/ui/screen.ts`, `src/ui/Button.ts`, `index.html`, `public/manifest.webmanifest`, `public/assets/icons/`.
**Contracts used:** `RunResult` (03), `palette.ts`, `i18n`.

## Dependencies
**Depends on:** 01 (art), 03 (result). **Blocks:** 12 (the Map button).

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
