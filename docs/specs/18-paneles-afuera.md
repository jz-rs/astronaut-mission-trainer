# 18 — Solar panels outside, under the Martian sky ☀️

## Approved scope extension — 2026-11-15

The workspace owner approved implementation across specs 04 and 06 (see `docs/DECISIONS.md`). This extension supersedes the exclusion of base-map changes below.

- Add the corner airlock as a pixel-art overlay shared by all base maps. Player and bot routes pass through it to the outdoor solar work spots.
- Show a quick airlock transition on entry and exit, and a suited astronaut celebrating clean panels.
- Add an optional minigame background hook and a live, read-only environment callback (sol time, night and dust-storm presentation). Other minigames retain their indoor backgrounds and immediate exit.
- Use five outdoor pixel-art PNG backgrounds at 1040 × 496. Preserve the Gemini Jezero original; unavailable private Gemini artwork may be recreated from that reference. Do not use code-drawn landscape mockups.
- Dust-storm presentation follows existing events without changing core rules or rewards. Olympus uses the common daytime sky until a darker sky is supported by a source.
- Additional owned files: `src/scenes/base/SolarAirlock.ts`, `src/scenes/base/AstronautSprite.ts`, `src/scenes/base/BaseScene.ts`, solar assets under `public/assets/sprites/energia/`, art source records under `docs/arte/biomas/`.
- Approved shared files: `src/minigames/MinigameScene.ts`, `src/ui/biomes.ts`, `src/ui/sprites.ts`, `src/ui/layout.ts`, `src/config/balance.ts`, `docs/DATA_SOURCES.md`.

## Implementation and validation — 2026-11-15

- Implemented: five outdoor backgrounds generated with ChatGPT, live Sun/twilight/weather, external battery, corner airlock and crew route, paused entry/exit crossing, and astronaut celebration.
- The owner approved the composition preview and requested the existing numbered cyan `StepGuide` UI. Production already uses that component unchanged; the browser preview now mirrors it. No replacement step-guide UI is required at merge.
- Shared types moved to `minigameTypes.ts` and remain re-exported from `MinigameScene.ts` for compatibility.
- Integrated the latest main: how-to/results use the mission tablet, crisis busy-state handling stays intact, and the result tablet closes before the outdoor return transition.
- Added lifecycle regression tests covering explanation pauses, result return transitions and cancellation without rewards.
- Automated validation after integrating main: `npm run check` (63 tests) and production build passed on a clean copy of the committed tree. Non-blocking lint size warnings remain.
- Pending manual acceptance: landscape phone input, children’s playtest, and final in-game visual review of the map overlay. The standalone preview is a composition review, not a substitute for that acceptance.

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
