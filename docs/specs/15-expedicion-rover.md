# 15 — Rover expedition 🧪

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | B | P1 | 2 | ⚪ Proposed |

## Objective
Let the player **risk energy to take the rover out and collect samples** (points), and see a **real photo of their location** on Mars.

## Why it matters
- The central decision each session: risk it for points or protect the base?
- Provides the second star (samples) and score.
- The best showcase for real NASA photos (Mars Trek, Curiosity, Perseverance).

## Scope
**Includes:**
- A "rover garage" button/room in the base (coordinate placement with A, spec 04).
- Can depart only with enough energy (high cost, in `balance.ts`).
- Minigame (~15 s): rover moves over a Mars background; tap left/right of the rover to change lanes: dodge rocks and collect glowing stones (samples) by driving over them. *(Changed 2026-11-14: previously stones had to be tapped; see `docs/DECISIONS.md`.)* *(Changed 2026-11-15: rocks are now samples; dodge soft sand like the sand that trapped Spirit; see `docs/DECISIONS.md`.)*
- *(Added 2026-11-15, Mission 5: see `docs/DECISIONS.md`.)* Before departure, a 4-step card (base paused only while reading). Drive for ~10 s, then the rover **stores a sample in a tube, like Perseverance**: hold the drill → move the cylinder to the tube → tap to seal → tube goes on the rack. Sealed = +1 sample; left open = "Contaminated!" and no points. *(Changed the same day: 3 tubes per trip, first guided, the other two filled independently by the child.)*
- At the end: add samples to the session and show **the real location photo in a frame** + fact.

**Excludes:** multiple destinations per location, tilting the phone (could be P2).

## Acceptance criteria
- [ ] Base keeps running while the rover is outside (real risk).
- [ ] Adds samples to the core through an action (if a new `GameAction` is needed → **notify A**).
- [ ] Shows real photo with credit (registered in `DATA_SOURCES.md`).
- [ ] Performance and parameters in `balance.ts`.

## Files
**Owned:** `src/minigames/rover/*`.
**Contracts used / potentially changed:** `GameAction` (add samples) → notify A; `registry.ts`.

## Dependencies
**Depends on:** 03, 04, 06. **Uses assets from:** 01, photos from 13.

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
