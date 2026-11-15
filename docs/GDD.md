# GDD — Game design document

> Status: **draft for approval**. Records what we decided during planning. Propose changes before implementing them (see `AGENTS.md` §1.3).

## 1. In one sentence
You command a base on Mars: divide work between yourself and your crew to keep oxygen, food, shielding, and energy from running out while Mars throws storms at you.

## 2. Project goals
- **Educational**: show that **every decision affects survival variables** (the track's central requirement), using real NASA data.
- **For children aged 7 to 12**, appealing to any age.
- **Zero learning curve**: enter and know what to tap.
- **Replayable**: short sessions and reasons to return.

### What we do differently from other projects in the track
We analyzed other teams' projects (little-orbit, astra-mission-trainer, outpost-app). Common problems: **too much text, unintuitive interactions, a steep learning curve, low retention, and too many variables.** Every decision in this GDD aims to avoid them.

## 3. Pillars
1. **Deciding is the game**: there is never enough for everything; prioritize.
2. **Understand without reading**: icons, colors, animation.
3. **Real science as a reward**: facts appear after the action.
4. **Collaboration is necessary**: the crew matters.

## 4. References
- **Among Us**: visual style, walking between rooms, tasks as minigames, emergencies.
- **Angry Birds / Candy Crush**: level map with stars.
- **Hades / roguelites**: lose the session but keep your progress.

## 5. Setting
Mars only. A base with rooms. Each session is a landing at a real location on Mars.

## 6. Variables (4 bars)

| Bar | Room | What raises it | What lowers it |
|---|---|---|---|
| 💨 Oxygen | Oxygen factory | Oxygen minigame | Time passing |
| 🥬 Food | Greenhouse | Greenhouse minigame | Time passing |
| ☢️ Shield | Shield wall | Shield minigame | Time, solar storms |
| ⚡ Energy | Solar panels | Panels minigame (the only one that **generates**) | Every task **spends** energy, time, dust |

- Bars range from 0 to 100 and decrease automatically.
- **Energy is the shared currency**: all tasks (except panels) consume it. When someone spends it, there may not be enough for the others.
- If **any bar reaches 0**, the crew evacuates → **game over**.

## 7. The session (~5 minutes)
- **5 sols**, ~60 seconds each.
- During each sol: walk around the base, play minigames, order bots, respond to events.
- At the end of sol 5, the resupply ship arrives → **result screen**.

### Example session (Gale crater)
1. **Sol 1**: the greenhouse flashes (low food). Go there, play, food rises and energy falls. Bots on auto head to other rooms.
2. **Sol 2**: 📡 a warning arrives from Earth (delayed): dust storm. Crisis meeting: vote to clean panels.
3. **Sol 3**: the storm covers the panels. Take the rover out (costs energy, earns points) or conserve energy?
4. **Sol 4**: solar storm **without warning**. Use a two-person lever with a bot to close the shield.
5. **Sol 5**: another expedition, the ship arrives. Result: ⭐⭐☆ and "energy dropped below 20% on sol 3".

## 8. Crew: you are the commander
- You + **3 bots** (other people will take their place in the future).
- **Tap a room** → your astronaut goes there and you play the minigame.
- **Tap a bot, then a room** → the bot goes there and does the task.
- **🤖 Auto mode** per bot: goes to the lowest bar on its own.

| Who | Time | Effect |
|---|---|---|
| 🤖 Bot | Slow (~20 s) | Fixed, 60% |
| 🧑‍🚀 You | Fast (10–15 s) | 0% to 120% depending on how you play (perfect = bonus) |

### 🎓 Bots learn from you (replay hook)
Your **best result** in each minigame becomes the bots' efficiency at that task. Get a perfect score in Panels and your bots clean at 110%. Replay minigames = train your crew = tackle harder locations.

## 9. Minigames
Common rules: **10–15 seconds, one touch action, no reading**, ending with a one-line real fact.

| | Minigame | How to play | Effect | Real fact |
|---|---|---|---|---|
| 💨 | Oxygen factory | Drag CO₂ bubbles into the machine → O₂ bubbles come out | +💨 −⚡ | MOXIE (Perseverance) made oxygen from Martian air |
| ⚡ | Clean panels | Swipe to remove dust | +⚡ | Martian dust shut down Opportunity and InSight |
| 🥬 | Greenhouse | Tap thirsty plants before they dry out | +🥬 −⚡ | Veggie: lettuce harvested on the Space Station |
| ☢️ | Shield wall | Drag water/regolith blocks to fill gaps | +☢️ −⚡ | Water blocks radiation; Mars has no global magnetic field |
| 🧪 | Rover expedition | Dodge rocks and tap glowing stones | +🧪 points −−⚡ | Real photo of the location + rover fact |
| 🤝 | Two-person lever (event) | Hold together with another astronaut | Prevents solar storm damage | DONKI alerts (NASA) |

Each minigame's difficulty varies by location (parameters in `balance.ts`, no new code).

## 10. Events
- **Different event deck per location**, based on real data (DONKI, RadLab, OSDR). Handwritten in `data/events.json`, without live API calls.
- **Communication delay as a mechanic**: the Earth–Mars signal takes 4 to 24 minutes. Sometimes the warning arrives a sol early (time to prepare), sometimes too late.
- Types: solar storm, dust storm, equipment failure, and positive events (resupply, extra harvest).
- **Crisis meeting** (like Among Us' emergency meeting): when a warning arrives, everyone votes on priorities in 10 s. Bots vote too.

## 11. Progression: the Mars map

| # | Location | Why it is difficult (real fact) | What changes |
|---|---|---|---|
| 1 | Jezero crater | Calm; Perseverance is here | Tutorial, everything balanced |
| 2 | Gale crater | Frequent dust storms | ⚡ falls faster |
| 3 | Olympus Mons | Less protective atmosphere | ☢️ falls faster |
| 4 | Polar cap | Little sunlight | ⚡ and 🥬 are harder |
| 5 | Valles Marineris | Extreme weather | Everything is harder |

### Stars (goals shown as icons at the start)
- ⭐ The base survived all 5 sols.
- ⭐ You collected X rover samples.
- ⭐ Location challenge (e.g. "never drop below 20% energy").

Enough stars unlock the next location. The 3rd star is a reason to return and improve.

### Score
`score = average base health × 10 + samples × 100` — save the record per location.

### What persists between sessions
Bot training, stars and record per location, language. *(Optional, P2: suits, NASA photo stickers.)*

## 12. Visual style
- AI-generated **pixel art**, consistent through the style guide (`docs/STYLE_GUIDE.md`).
- **Framed real NASA images** inside the pixel art world: through the base window, on monitors, during expeditions. Always labeled "📷 Real NASA photo" so children can distinguish what is real.

## 13. Screens
1. **Start**: one huge PLAY button + language selector (ES/EN).
2. **Mars map**: locations, stars, locks.
3. **Base** (the session).
4. **Minigame** (opens over the base; the base keeps running).
5. **Result**: stars, score, why a star was lost, real fact, Retry / Map.
6. **Sources**: links to NASA data.

## 14. Platform
- **Web, mobile first, landscape.** Requests fullscreen and shows "rotate your phone" if the phone is in portrait.
- Phaser 3 + TypeScript + Vite. Published as a static page.
- Selectable Spanish and English.

## 15. Multiplayer
- **v0 (hackathon): bots.** Architecture ready: bots and humans send the same actions.
- **Later**: rooms with codes to play with friends (Colyseus). Present in the pitch as a "next step".

## 16. Out of scope for the hackathon
Real online multiplayer, user accounts, live NASA API calls, more than 5 locations.
