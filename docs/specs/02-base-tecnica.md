# 02 — Technical foundation: existing logic + frontend skeleton

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | A | P0 | 0 | ⚪ Proposed |

## Objective
Enable all 3 to start programming **in parallel** on a common foundation: working game logic and a **minimal visual skeleton** (no art yet) where everyone connects their part, with automatic tests on every PR.

## Context: what exists today

### ✅ Backend (kept)
Pure TypeScript logic, no visuals, with 16 passing tests.

| What | Where | Continuing spec |
|---|---|---|
| Vite + strict TypeScript + ESLint + Prettier + Vitest setup | root | — |
| Session: stats, decay per location, energy, sols, evacuation/survival | `src/core/run.ts`, `stats.ts`, `types.ts` | 03 |
| Actions (same for bots and people) | `src/core/actions.ts` | 03 |
| Entry point for scenes | `src/core/GameSession.ts` | 03 |
| Score and 3 stars | `src/core/scoring.ts` | 03 |
| Balance values | `src/config/balance.ts` | 03 |
| Bots: auto mode (go to the lowest bar) | `src/bots/autoPilot.ts` | 05 |
| Bot training (learn from your best result) | `src/core/training.ts` | 05 |
| Browser progress storage | `src/services/` | 03, 05, 12 |
| ES/EN text + `t()` function | `src/i18n/` | 13 |
| Locations and 2 sample events | `data/` | 12, 13, 14 |

### ❌ Frontend (discarded)
A visual prototype was **discarded because it looked bad** (decision in `docs/DECISIONS.md`). It remains in Git history (commit `fb40014`) **as a technical reference only** (e.g. how a minigame connected), not as a visual guide.

## Scope
**Includes:**
- Review the backend against `AGENTS.md` with all 3: is it understandable? Is anything missing?
- **Frontend skeleton**, no visual styling (structure only):
  - `src/main.ts`: Phaser 3, 640 × 360 resolution, screen scaling, pixel art, landscape.
  - Empty scenes with navigation: Start → Base → Result (one text and button each is enough).
  - `src/ui/palette.ts` and `src/ui/layout.ts`: colors and sizes from `docs/STYLE_GUIDE.md` as constants (updated after the style vote).
  - Correct font loading before drawing text.
- **CI**: ~~GitHub Actions runs `npm run check` on every PR.~~ Removed for now (see `docs/DECISIONS.md`): everyone runs `npm run check` before opening a PR.

**Excludes:** any visual design (spec 01), real scenes (04, 11), minigames (06+).

## Acceptance criteria
- [ ] All 3 reviewed and approved the backend (or requested changes, recorded in `DECISIONS.md`).
- [ ] `npm run dev` opens the skeleton with Start → Base → Result → Start navigation.
- [ ] CI runs on every PR and blocks when `npm run check` fails.
- [ ] No scene hardcodes colors or sizes: everything comes from `palette.ts` / `layout.ts`.

## Files
**Owned:** `src/main.ts`, `src/scenes/sceneKeys.ts`, initial empty scenes, `src/ui/palette.ts`, `src/ui/layout.ts`, `.github/workflows/ci.yml`.
After this spec, each scene belongs to its own spec (Base → 04, Start/Result → 11).

## Dependencies
**Depends on:** nothing. **Blocks:** all frontend specs (04, 06, 07–11).

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
