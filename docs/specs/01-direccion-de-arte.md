# 01 — Art direction and image set

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | C | P0 | 0 → 1 | ⚪ Proposed |

## Objective
Agree among all 3 team members on **how the game looks** before production, then enable anyone to generate new images in the same style.

## Why it matters
- Visual style is the first thing judges see and what draws children in.
- All 3 will generate AI images: without clear rules, each produces a different style.
- Mixing **pixel art + real NASA photos** sets us apart.

## Scope

### Stage 1 — Style proposals (phase 0, ~1 h)
Generate **3 different style proposals** (e.g. colorful 16-bit pixel art / rounder Among Us-style pixel art / more "retro NASA" pixel art). Each proposal includes the same 4 pieces for comparison:
1. An astronaut (front view).
2. A base room interior (e.g. greenhouse).
3. The base overview from above.
4. **Mixing test**: a pixel art window or monitor showing a **real NASA photo** (e.g. Gale crater from Curiosity).

→ **All 3 vote.** One proposal wins (or an explicit combination).

### Stage 2 — Style guide (phase 0)
Complete `docs/STYLE_GUIDE.md` with the winning choice: final palette, sizes (tile, astronaut), typography, a working **prompt template**, and a tool for mapping images to the palette.

### Stage 3 — Game image set (phase 1)
| Asset | Details | Priority |
|---|---|---|
| Astronaut | 4 colors (violet player, red, green, yellow). Idle + walking (2–4 frames) | P0 |
| Base map | Overhead view with 4 rooms + central corridor | P0 |
| 4 bar icons | 💨 🥬 ☢️ ⚡ in pixel art | P0 |
| Menu background | Mars + title | P0 |
| Button | Normal and pressed | P0 |
| Minigame elements | Whatever each minigame spec (07–10) needs, coordinated with B | P0 |
| NASA photo frame | Reusable window / monitor | P1 |
| Rover | Side or overhead view | P1 |
| Mars map | For spec 12 | P1 |
| Stars | Earned / empty | P1 |

**Excludes:** complex animations, sound, programming scenes (deliver images only).

## Acceptance criteria
- [ ] 3 proposals generated with 4 pieces each, saved in `docs/arte/propuesta-1|2|3/` (outside `public/` so they are not published).
- [ ] Vote completed; result recorded in `docs/DECISIONS.md`.
- [ ] No pending 🔲 items in `docs/STYLE_GUIDE.md`.
- [ ] Prompt template written and tested: another team member uses it and gets the same style.
- [ ] P0 assets in `public/assets/sprites/` and `public/assets/tiles/`, with transparent backgrounds and mapped to the palette.
- [ ] Real photos used are registered in `docs/DATA_SOURCES.md` with credit and license.
- [ ] Looks good on a real phone (not just a computer).

## Files
**Owned:** `public/assets/**`, `docs/STYLE_GUIDE.md`.
**Contracts used:** `src/ui/palette.ts` (A creates it in spec 02 with the proposed palette) — when voting on the final palette, **notify everyone** (it affects all) and update it with A.

## Dependencies
**Depends on:** nothing — this comes first.
**Blocks:** replacing placeholders in 04, 07–10, 11, 12.
*(No one is blocked meanwhile: program with colored rectangles and replace them later.)*

## Open questions
- Overhead view (like Among Us) or side view for the base? Recommended: overhead.
- ~~Final game name?~~ Decided: **Astronaut Mission Trainer**.

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
