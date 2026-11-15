# 10 — Minigame: shield wall ☢️

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | B | P0 | 1 | ⚪ Proposed |

## Objective
**Drag water and regolith blocks to fill gaps in the wall**, to understand how astronauts protect themselves from radiation.

## Why it matters
Radiation is a real, invisible risk on Mars (no global magnetic field or thick atmosphere). Connects to RadLab and DONKI data.

## How to play
- Before playing, a 3-step illustrated card with the game paused: Earth has a magnetic shield and Mars does not, so radiation reaches the ground; water and regolith block it; Curiosity measures it with its RAD instrument. The same steps remain in a panel on the left while playing.
- A wall with gaps letting radiation "rays" (violet and yellow, animated) into the habitat, where two astronauts stand.
- Blocks at the bottom (water 💧 / regolith 🪨).
- Drag each block to a gap; it snaps into place when nearby, without rotation. Tapping a block also sends it to the first free gap.
- Each filled gap cuts its ray and says "Blocked!".
- A **RAD meter** on the right rises while gaps remain open; it turns red near the end.
- **Performance**: gaps filled / total, + bonus if the meter did not fill.
- Difficulty by location (e.g. Olympus Mons): more gaps.

> Deliberately simple: **no rotation or unusual pieces** (not full Tetris). Expand if time allows.

## Acceptance criteria
- [ ] Understandable without reading.
- [ ] Drag and drop works well with a finger; generous snapping.
- [ ] Performance from 0 to 1.2.
- [ ] Real fact at the end (i18n).
- [ ] Parameters in `balance.ts`.

## Files
**Owned:** `src/minigames/shield-wall/*`.
**Contracts used:** `MinigameScene`, `registry.ts` (1 line), `palette.ts`, `i18n`.

## Dependencies
**Depends on:** 06. **Uses assets from:** 01.

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
