# 12 — Mars map and progression

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | C | P1 | 2 | ⚪ Proposed |

> Planning update: [spec 19](19-intro-cabina-manual.md) documents the intro, initial manual, and destination selection inside the ship. See it for approved flow changes and pending details.

## Objective
A **Mars map with 5 real landing locations**, stars, and locks, so the player **always has a next goal** and a reason to return.

## Why it matters
The replay hook (along with bot training). Teaches real Mars geography: each location is hard for a scientific reason.

## Scope
**Includes:**
- Screen with Mars (a framed real Mars Trek image, or pixel art based on it) and 5 points: Jezero, Gale, Olympus Mons, polar cap, Valles Marineris.
- Each location shows: name, stars earned (0–3), record, or 🔒 with remaining stars needed.
- Tap a location → brief card: real photo + **why it is difficult** (one line) + **3 goals with icons** + LAND button.
- Location data in `data/locations.json` (difficulty, sample target, challenge, stars to unlock).

**Excludes:** more than 5 locations, suits/stickers (P2).

## Acceptance criteria
- [ ] Only Jezero is open initially, and it is obvious to tap it.
- [ ] Unlocking a location has an animation/celebration.
- [ ] Photos used are in `DATA_SOURCES.md`.
- [ ] Start (11) leads to the map, and "🗺️ Map" on the result screen returns here.

## Files
**Owned:** `src/scenes/MarsMapScene.ts` (new), `data/locations.json` content.
**Contracts:** A (03) owns the **format** of `data/locations.json` → **notify A** if a new field is needed.

## Dependencies
**Depends on:** 01, 03, 11.

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
