# 04 — Base and movement

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | A | P0 | 1 | ⚪ Proposed |

## Objective
Let the player see the Mars base with its 4 rooms, **tap a room, watch their astronaut walk there, and open the minigame**, without anyone explaining it.

## Why it matters
It creates the "Among Us" feeling: move around the base and do tasks. It is the first gameplay screen: if it is unclear, we lose the player.

## Scope
**Includes:**
- Base map with 4 rooms + central corridor (rectangles first, then spec 01 art).
- Top HUD: 4 bars with icon and color + "Sol N/5". A low bar flashes red.
- **The room whose bar is low flashes**, showing where to go without reading.
- Tap room → astronaut walks → minigame opens on top upon arrival. **The base keeps running** (time matters).
- Closing a minigame sends its result to the core.
- Session ends → result screen.
- Rooms cannot be tapped while a minigame is being played.

**Excludes:** bot orders (05), events (14), final art (01).

## Acceptance criteria
- [ ] Someone who has never seen the game knows what to tap in < 5 seconds (test with someone).
- [ ] Tapping any of the 4 rooms moves the astronaut and opens the correct minigame.
- [ ] Rooms with a bar < 30 flash.
- [ ] Works with a finger on a phone in landscape (touch areas ≥ 48 px).
- [ ] The scene does not calculate game rules: it only reads state and sends actions.

## Files
**Owned:** `src/scenes/base/*`.
**Contracts used:** `GameSession`, `MinigameScene` / `registry.ts` (06), `palette.ts`, `i18n`.

## Dependencies
**Depends on:** 03, 06. **Blocks:** 05 (bot visuals), 14, 16.

## Open questions
- Movement only by tapping rooms, or also joystick/dragging? Proposal: room taps only (simpler for age 7).

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
