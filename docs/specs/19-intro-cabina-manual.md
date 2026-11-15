# 19 — Intro, cabin, and mission manual

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| C (Emilia) | C | P0 | Implementation | 🟡 In review |

## Objective
Tapping PLAY enters a ship, introduces the simulation, and prepares the player for the mission. The manual explains how to care for the base; a monitor inside the ship introduces destinations and lets the player choose where to land.

## Status and relationship to other specs
The team approved the general direction (see `docs/DECISIONS.md`, 2026-11-14). This document consolidates planning before image generation: the script and pending details still require review.

- Complements spec 11: PLAY leads to the cabin. The first visit is exempt from the ten-second/two-tap requirements because of the mandatory manual.
- Replaces spec 12's destination selection presentation with the ship's monitor. Keeps locations, stars, records, and unlock rules.
- Coordinates content and sources with spec 13, events with 14, rover with 15.
- Does not redefine another team member's missions or minigames.
- Sketches generated during this conversation and their prompts are not approved references. No front-facing/isometric perspective or final layout is fixed here.
- Update: cabin exploration uses a **front-facing perspective view** (not isometric). Unapproved sketches: `docs/arte/bocetos/cabina/` (cabin background, monitor console, guide, floating objects, manual tablet). See `docs/DECISIONS.md`.
- Update 2026-11-15: the manual is a **mission tablet**, not a book (see `docs/DECISIONS.md`).
- Update 2026-11-15: **implemented** in `src/scenes/cabin/`, `manual/`, `monitor/`, and `landing/`, using sketch art in `public/assets/sprites/cabina/`. Previously open decisions are in `docs/DECISIONS.md` ("Cabin intro implemented").

## Confirmed decisions
- Fixed cabin: interact by tapping objects, without walking around.
- Window showing space and Mars through a framed, sourced real image.
- Astronaut welcomes the player and explains context; skippable intro.
- Manual mandatory the first time: visit its pages, no exercises or quizzes.
- Manual explains the four bars, rover, events, and delayed Earth communications.
- All destinations can be explored, even those locked for landing.
- Destination selection, photo changes, and landing use ship buttons.
- NASA photos and pixel art explicitly related in the manual.

## Proposed flow
First visit: **PLAY → cabin and welcome → manual → cabin → destination monitor → landing → mission**.

Skipping the welcome does not skip the manual. First landing requires visiting every page. Update 2026-11-15: until the manual is complete, tapping the dashboard does not open the destination console: the guide says "First open the mission manual: it is the tablet." and highlights the tablet. The first manual read has no X: the only exit is finishing it (see `docs/DECISIONS.md`).

Later visits (proposal): PLAY leads to the cabin without automatically replaying the welcome; the manual can be consulted again. Remember completion through the progress system without changing mission progress.

The following scenes describe moments in the experience, not necessarily separate Phaser classes.

## Scene 1 — Cabin and welcome
Three recognizable interactive elements: astronaut, manual, monitor. The window shows Mars. A highlighted element indicates the next step. The mission clock does not start during preparation.

### Proposed initial script
One message at a time, with Next and Skip welcome controls:

| Moment | Dialogue | Proposed visual support |
|---|---|---|
| Arrival | "Welcome aboard! Look out the window: we are arriving at Mars." | Astronaut points to the window. |
| Context | "Mars, the fourth planet from the Sun, is cold and has a very thin atmosphere." | Real image highlighted. |
| Simulation | "In this simulation, you will command a base and care for its crew." | Base illustration. |
| Reality | "Pay attention to the details! Everything is based on reality: you will learn how a crew survives on Mars." | Astronaut gives a thumbs-up. |
| Real photos and music | "You will see real NASA photos, like the one in this window. And the music uses real sounds from space!" | Window highlighted (real photo). |
| Variables | "Oxygen, food, shield, and energy: all four bars matter!" | Four icons in their colors. |
| Preparation | "Before landing, open the mission manual." | Tablet highlighted. |

Astronaut name, appearance, and voice pending. Text must work without audio and stay brief; split messages if they do not fit legibly on a phone.

## Scene 2 — Mission manual
Mission tablet (resting on the cabin's left console, seen large and from the front), one page per screen, progress indicator, previous/next controls. Tablet UI has a **screen aesthetic**, distinct from the console's physical buttons: thin glowing light-blue lines, visor-like corners, segmented bars, scan lines. Tapping a control causes a **brief flash** (blink/glow with a short delay), making it clearly a screen button. Mockups: `docs/arte/bocetos/cabina/manual/`. No minimum reading timer. Proposal: record visits to every page and allow return to the cabin once complete. Define behavior when closing or reloading before finishing.

### Proposed content: ten pages
Draft texts, subject to mechanics actually included in the game.

| Page | Message and action to teach |
|---|---|
| 1. Your mission | "Keep the base running for five Martian days, called sols." Explain simplified game time. |
| 2. Oxygen | "The crew needs oxygen. Bring CO₂ to MOXIE to make it." Show the task (spec 08: split the molecule, 2 CO₂ → O₂) and its energy consumption. Compare a real MOXIE photo with the game machine. |
| 3. Food | "Care for greenhouse plants to restore food." Show the action and energy consumption. |
| 4. Shield | "Reinforce the shield wall to protect the crew from radiation." Show the action and energy consumption. |
| 5. Energy | "Clean panels to restore energy. Other tasks consume it." Teach that it is shared. |
| 6. Crew | "Your crew can do tasks too." Illustrate tap crew member → tap room; briefly explain Auto, per spec 05. |
| 7. Rover | "Explore with the rover and collect samples. Expeditions consume energy!" Clarify that the base keeps running during exploration. The rover is not an automatic crew member. |
| 8. Events | "Storms and failures can happen during the mission. Watch alerts and decide what to handle first." Show cause → effect → action. |
| 9. Communications | "Check Earth's messages: they can help you prepare. But some arrive late!" Also watch bars and what happens in the base. |
| 10. Preparation complete | "If a bar reaches zero, the crew evacuates. Care for all four!" Closing: "Coordinate your crew and watch alerts. Ready to choose a destination!" |

Bars decrease over time; each page explains what restores its bar and what affects it. Prioritize icons, diagrams, and brief phrases over paragraphs. Page count and layout may still change for readability.

### Compare science and simulation
The tablet's bar and rover pages **must** show a real NASA photo alongside the game representation (current mockups do not yet). Proposal: real photo and pixel art visible together, with a short phrase beneath each. Alternating through a button remains an option if more readable on mobile.

- Labels: "In real life" and "In your mission".
- When the object only inspires the mechanic: "The science that inspires us" and "Our simulator version".
- Examples: MOXIE → oxygen factory; Veggie on the Space Station → greenhouse; NASA rover → game rover.
- Use the same art as gameplay, coordinated with its owners.
- Do not present a fictional factory, video game shield, or Martian crop as real NASA facilities.
- Photos are real and credited; bars, costs, and times are simplified game rules.

### Events and communications
Teaching examples must match spec 14 and implemented content:

| Situation | What the player should understand |
|---|---|
| Dust storm | Can affect energy: check panels and prioritize restoring it. |
| Solar storm | Check protection and attend to the shield using available actions. |
| Equipment failure | Identify affected equipment and the response allowed by that mission. |
| Early warning | "A storm is approaching. Prepare the base!" |
| Delayed warning | "The storm has already started. Check the bars and act!" |

Not all events require the same response or arrive with a warning. Messages help but do not replace observing the base. Do not promise repairs, crisis meetings, or levers if unavailable. Distinguish physical signal delay from its representation in simulation time; verify real figures with NASA.

## Scene 3 — Return to the cabin
After completing the manual, the astronaut directs: "All ready! Tap the monitor to choose where to land." Monitor highlighted; manual remains available.

Future history/science books are possible, outside initial scope. Do not create empty books or nonfunctional controls.

## Scene 4 — Destination monitor
Replaces previous selection UI. The monitor is a ship object that opens a readable view of its controls and content.

- Previous/next destination and previous/next photo are separate controls.
- Destination name, real photo, brief description, photo indicator, access to more information.
- Show goals, stars, record, and unlock condition from the existing system.
- All locations can be browsed; landing only at unlocked destinations after completing the initial manual.
- LAND confirms the selected destination. A locked destination communicates the actual missing requirement.
- Back returns to cabin. Changing photos never changes destination.
- Gallery with several location images: orbital views, details, and surface photos where available. Do not use another location's photos as if they belonged to this destination.
- Brief information cards distinguish scientific facts from game difficulty/rules.

## Scene 5 — Landing
~~Proposed short transition: "Destination confirmed: [location name]. Prepare your crew!"~~ (2026-11-15: removed; landing already shows the location through the window). Then start the corresponding mission using team-agreed navigation.

Visual proposal (2026-11-15, mockups: `docs/arte/bocetos/cabina/aterrizaje/aterrizaje-jezero.gif` and `aterrizaje-olympus-mons.gif`), ~5 seconds, viewed from the cabin:
- Both astronauts are **seated** in pilot seats, backs visible (guide left, violet player right). Background: `docs/arte/bocetos/cabina/cabina-aterrizaje.png`. Crop as sprites so they can shake slightly more than the ship.
- **Landing matches the monitor's chosen destination**: window starts with whole Mars (`public/assets/nasa/marte-disco-completo.jpg`, same cabin window photo), approaches, and transitions to that destination's real photo (`public/assets/nasa/<id>.jpg`). Olympus Mons and Valles Marineris photos are orbital, fitting the descent.
- Window shows the **real destination photo** enlarging as though approaching the ground. Photo **always covers the whole window** ("cover" scaling): never smaller than the glass, no borders.
- **Camera moves into the ship**: entire cabin enlarges toward the window during descent.
1. Entry: orange heat glow across the window fades; gentle shaking.
2. Descent: photo grows, shaking increases, yellow warning light flashes. Proposal: monitor shows decreasing altitude in the tablet's screen style.
3. Rockets: dust briefly covers the window.
4. Touchdown: strong shake, everything still, location visible, guide says "We have arrived at [location]!".
- Reward fact at the end (verify with NASA before use): landing on Mars takes about 7 minutes.

## Sources and art
- Follow the style guide and approved team references. Before art production, align the root guide with completed worktree versions.
- No image generated in this conversation is approved by this spec.
- Real photos inside windows, monitors, or frames, with recognizable label and credit.
- Register each fact/image in `docs/DATA_SOURCES.md`: original URL, exact credit, license, verification. Do not assume every NASA-hosted resource is public domain.
- Final photo selection/editorial checks pending spec 13.
- Initial sources to review: [Mars](https://science.nasa.gov/mars/facts/), [MOXIE](https://www.nasa.gov/solar-system/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/), [Veggie](https://science.nasa.gov/mission/veggie/), [Perseverance and Jezero](https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-perseverance-rover-deciphers-ancient-history-of-martian-lake/).
- Specific sources still needed for shield, dust, communications, and final galleries. This list does not approve photos for use.

## Files and coordination
**Currently authorized scope:** this spec's documentation and cross-references. Do not implement scenes or generate assets.

**Owned by this planning task:** `docs/specs/19-intro-cabina-manual.md`.

**Before implementation:** assign owner and agree on concrete scene/UI files. Coordinate navigation with 02/11, destinations with 12, text/photos with 13, and manual completion with the storage owner. This draft grants no ownership over shared files.

**Contracts involved:** navigation, scene keys, progress, location format, i18n, palette, layout. Do not alter `GameAction`, balance, or mission rules for the intro.

## Proposed acceptance criteria
- [ ] PLAY opens a fixed cabin with astronaut, manual, monitor, and window showing a real Mars image.
- [ ] Welcome skippable without skipping the mandatory initial manual.
- [ ] Visiting all pages suffices, no test/forced wait; completion remembered.
- [ ] Manual explains four bars, actions/costs, crew, rover, events, delayed warnings.
- [ ] Real science distinct from simulation representation.
- [ ] Event examples match available mission actions.
- [ ] All destinations offer multiple photos/information; landing locks respected.
- [ ] Sources, credits, verification recorded for photos/facts.
- [ ] ES/EN text in i18n, controls at least 48 game pixels, landscape phone test.
- [ ] Preparation consumes no session time and does not alter another team member's missions.
- [ ] Before an implementation PR: `npm run check` passes.

## Pending design items
- Implementation owner/files; team script review.
- Astronaut name, appearance, possible voice.
- Visual composition, perspective, assets: no approved design yet.
- Simultaneous/alternating comparison on tablet, final page lengths.
- Monitor access before completing manual, early closing, reading resumption.
- Replay welcome access, return from results to cabin/monitor.
- Photo selection, credits, missing scientific sources.

## Approval
General direction approved by the team according to Emilia's confirmation. This detailed spec remains proposed.
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
