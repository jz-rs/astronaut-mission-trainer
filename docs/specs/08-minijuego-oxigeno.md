# 08 — Minigame: oxygen factory 💨

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | B | P0 | 1 | ⚪ Proposed |

## Objective
**Bring CO₂ from Martian air into MOXIE and watch through its little window as it splits and two O atoms form O₂** (see DECISIONS 2026-11-14), to understand that oxygen can be made from Mars' air.

## Why it matters
Oxygen is the fastest-decreasing bar. Teaches MOXIE, the Perseverance experiment that really made oxygen on Mars.

## How to play
- Before the clock starts, a card explains 4 illustrated steps with a "Let's make oxygen!" button (game and base paused).
- CO₂ molecules (blue O – dark C – blue O) float around the screen; drag or tap them to feed MOXIE.
- Through MOXIE's window: CO₂ heats up (orange) and splits; gray CO exits through the gray pipe; blue O waits ("Need 1 more CO₂!").
- Two O atoms form O₂, which travels through the blue pipe to the tank ("+1 O₂!").
- Ends when the O₂ tank fills (`oxygenGoal`) or time runs out.
- **Performance**: CO₂ fed into MOXIE / CO₂ needed (2 per O₂), + speed bonus.
- Difficulty by location: faster molecules.

## Acceptance criteria
- [ ] Understandable without reading.
- [ ] Dragging works well with a finger (large bubbles, ≥ 40 px).
- [ ] Performance from 0 to 1.2.
- [ ] Real fact at the end (i18n).
- [ ] Parameters in `balance.ts`.

## Files
**Owned:** `src/minigames/oxygen-factory/*`.
**Contracts used:** `MinigameScene`, `registry.ts` (1 line), `palette.ts`, `i18n`.

## Dependencies
**Depends on:** 06. **Uses assets from:** 01.

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
