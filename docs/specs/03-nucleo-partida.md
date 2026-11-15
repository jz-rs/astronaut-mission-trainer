# 03 — Game session core

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | A | P0 | 1 | ⚪ Proposed |

## Objective
Provide **complete session logic**: 4 automatically decreasing bars, energy as shared currency, 5 sols, game over if a bar reaches 0, and a result with score and 3 stars. All tested, without visuals.

## Why it matters
The track's central requirement: **decisions affect variables.** Everything else (base, bots, minigames) connects here.

## Scope
**Includes:**
- Bars from 0 to 100: 💨 oxygen, 🥬 food, ☢️ shield, ⚡ energy. Start at 70 (configurable).
- Continuous decay, multiplied by location difficulty (`data/locations.json`).
- Completing a task raises its bar according to performance (0 to 1.2) and **spends energy** (panels generate rather than spend).
- Tasks cannot be performed without enough energy.
- 5 sols of ~60 s. End of sol 5 → "survived". A bar at 0 → "evacuated".
- Result: `score = average health × 10 + samples × 100`; stars: survived / samples ≥ target / location challenge met (bar X never fell below Y).
- All numbers in `src/config/balance.ts`.
- Single entry point for scenes (`GameSession`): read state, send actions, advance time.

**Excludes:** visuals, events (spec 14), rover (spec 15), bots (spec 05).

## Acceptance criteria
- [ ] `src/core/` does not import Phaser (enforced by ESLint).
- [ ] Tests for: decay, location multiplier, completed task (raises bar + spends energy), insufficient energy, evacuation, survival, score, each star.
- [ ] Balance tested by playing: **doing nothing in Jezero loses before sol 3**, and good play survives with room to spare. (Record chosen numbers in `DECISIONS.md`.)
- [ ] `npm run check` passes.

## Files
**Owned:** `src/core/*` (except contracts), `tests/run.test.ts`, `tests/scoring.test.ts`.
**Contracts defined (notify others about changes):** `src/core/types.ts`, `src/core/actions.ts` (`GameAction`), `src/config/balance.ts`, `data/locations.json` format.

## Dependencies
**Depends on:** 02. **Blocks:** 04, 05, 14, 15, 16.

## Open questions
- Exactly 5 sols at every location, or longer at harder ones? (Proposal: 5 everywhere.)

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
