# 18 — Solar panels outside, under the Martian sky ☀️

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | B (minigame) + C (images) | P1 | 2 | ⚪ Proposed |

## Problem
Today, tapping **Solar panels** opens the minigame **inside the energy room**: panels sit on a room's floor, gather Martian dust, and receive light through a window. This is **unrealistic**, for three reasons:
- Martian dust does not fall inside a room;
- a window would reduce the light reaching the panels;
- on Mars, solar panels belong **outside**, in the open air, facing the sky, like InSight's. Our own base map also shows them outside, beside the energy room.

A child (or judge) who knows something about Mars notices, and the game teaches something false.

## Objective
Tapping **Solar panels** opens the cleaning minigame **outside on Martian ground**, with sky above. Everything else stays the same: pre-game explanation card, scratch-card cleaning, energy sparks traveling to the battery, and the rule that panels cannot be used at night.

## Why it matters
- *Junior Astronaut Mission Trainer* track: what we teach must be true and supported by NASA (see `docs/DATA_SOURCES.md`).
- The only mission that provides energy, so it is played most often.

## Appearance
- **Outdoor background**: Martian ground matching the base location (Jezero, Gale, North Pole, Olympus Mons, or Valles Marineris), with the side of the energy room to one side. A cable runs from panels into the base, where the battery is.
- **Sky with Sun**: sky and Sun visible above. The Sun follows the HUD's sol bar: high in the morning, lower as the sol progresses.
- **Sky color tells the time**:
  - caramel-colored by day, the real Martian sky;
  - near sunset, the sky around the Sun turns **blue**: a real fact photographed by Curiosity;
  - at night, the same violet tone as the base (`ui/nightfall.ts`).
- **Dust falling from the sky**: in difficult locations (Gale), returning dust visibly falls like a storm rather than appearing suddenly.
- **Sun rays**: travel directly from the Sun to the panels, no longer through a window.

## Scope
**Includes:**
- an "outside" background per location for this mission, replacing the room photo;
- Sun and sky changing with the sol bar;
- removing light through the window (`WINDOW_GLASS` in `SolarPanelsMinigame.ts` and `darkenWindow` in `solarStation.ts`);
- updating the explanation card if needed, e.g. with a sky illustration.

**Excludes:**
- changing other missions (oxygen, greenhouse, and shield stay inside, correctly: those machines belong indoors);
- changing the base map;
- changing day/night rules (`src/core/daylight.ts`).

## Acceptance criteria
- [ ] Tapping Solar panels shows the minigame outside, on Martian ground, with sky above. No room visible.
- [ ] Background matches the session's location (5 locations).
- [ ] Sun higher in the morning and lower as the sol advances; sky around it is blue at sunset.
- [ ] Light rays travel from Sun to panels: strong on clean panels, weak over dust.
- [ ] Returning dust visibly falls from the sky in Gale.
- [ ] Cable runs from panels to base battery, and energy sparks keep arriving.
- [ ] Still clear what to do without reading (test with someone aged 7 to 12).
- [ ] Explanation card, performance, difficulty, and night blocking work as before.
- [ ] Final fact supported (Curiosity and blue sunset; Martian light ≤ 45% of Earth's), with source in `docs/DATA_SOURCES.md`.
- [ ] `npm run check` passes.

## Files
**Owned (may modify):** `src/minigames/solar-panels/*`, new outdoor images in `public/assets/sprites/biomas/`.
**Contracts used (do not modify without notification):**
- `MinigameScene.ts` (spec 06): currently always draws the task's room (`drawRoom`). Needs an **optional** way for a minigame to use another background, e.g. an overridable `protected` method. ⚠️ Contract change: notify A and B.
- `ui/biomes.ts` (image per location), `ui/sprites.ts`, `ui/nightfall.ts`, `palette.ts`, `balance.ts`, `i18n`.

## Dependencies
**Depends on:** 07 (panels minigame), 01 (image style), DECISIONS 2026-11-15 (day/night).
**Blocks:** nothing.

## Open questions
- New pixel art outdoor backgrounds (5 images, one per location) or drawn in code (sky and ground in palette colors, plus rocks)? The former looks better; the latter is faster and lighter.
- Show a suited astronaut cleaning, or only a hand/finger?
- A short "exit through the airlock" transition, or cut directly outside?

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
