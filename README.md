# Astronaut Mission Trainer

## 🚀 Live links

- **Play the game:** https://jz-rs.github.io/astronaut-mission-trainer/ (best on a phone, in landscape)
- **Repository:** https://github.com/jz-rs/astronaut-mission-trainer
- **NASA data, images, music and sounds we use:** [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md) (also on the game's **Sources** screen)

The game is published again automatically on every merge to `main`.

An educational game for **NASA Space Apps Challenge 2026** — *Junior Astronaut Mission Trainer* track.

You command a base on Mars. Together with your crew (bots, and later friends), you maintain oxygen, food, radiation shielding, and energy by playing short minigames. The bots learn from how you play. Each location on Mars gets harder for real scientific reasons.

---

## 👋 New here? Read these in order

1. **`docs/GDD.md`** — the game we are building (10-minute read).
2. **`docs/PLAN.md`** — phases, priorities, and who does what.
3. **`docs/ROADMAP.md`** — milestones and how we validate and test each one.
4. **`docs/specs/README.md`** — the task list. Each task has a spec describing its objective.
5. **`AGENTS.md`** — the rules our agents (and we) follow.

## 🔁 How we work

1. **Read and approve the specs.** Each spec has an "Approval" section. Add your ✅ if you agree. Otherwise, discuss it before anyone starts.
2. **Each team member takes ownership of their specs** (each spec is an individual task with one owner).
3. **One branch per spec** → PR → review by another team member → `main`.
4. **Flag decisions that affect someone else** and record them in `docs/DECISIONS.md` (the agent is configured to stop and flag them).

## ▶️ Run the game

```bash
npm install
npm run dev      # opens http://localhost:5173
npm run check    # lint + types + tests
```

> **Current code status:** the **game logic** (backend) exists with tests. There is **no visual layer yet**: specs 02, 04, and 11 will build it following the art direction in spec 01. See `docs/specs/02-base-tecnica.md`.

## 📁 Structure

```
AGENTS.md / CLAUDE.md   Agent rules
docs/                   GDD, plan, roadmap, specs, style guide, NASA sources, decisions
data/                   Editable content (locations, events)
src/                    Code (see AGENTS.md §3)
public/assets/          Images, sounds, NASA photos
tests/                  Game logic tests
```
