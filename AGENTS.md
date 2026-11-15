# AGENTS.md — Rules for AI agents (and humans)

Claude, Cursor, Copilot, and any other agent we use read this file. **All 3 of us work with agents, so these rules make the code look as though one person wrote it.**

Project: educational game for NASA Space Apps 2026, *Junior Astronaut Mission Trainer* track. Audience: children aged 7 to 12 (but appealing to any age). Before coding, read `docs/GDD.md` and your task's spec in `docs/specs/`.

---

## 1. Team coordination (MOST IMPORTANT)

We are 3 people working in parallel, each with an agent. The biggest risk is an agent making a decision that breaks someone else's work.

### 1.1 Work only within your spec
- Each task has a spec in `docs/specs/` with an **owner**, **objective**, and **files it touches**.
- Only modify files your spec assigns to you.
- If fulfilling your spec requires touching anything outside that list, **stop and flag it** (see 1.3).

### 1.2 Shared contracts (do not change without notifying others)
Several people use these files. Changing them can break someone else's work:

| Contract | File(s) | Users |
|---|---|---|
| Game types (stats, tasks, crew) | `src/core/types.ts` | Everyone |
| Game actions | `src/core/actions.ts` (`GameAction`) | Engine, bots, minigames |
| Minigame interface *(created by spec 06)* | `src/minigames/MinigameScene.ts`, `src/minigames/registry.ts` | Engine, minigames |
| Balance values | `src/config/balance.ts` | Everyone |
| Palette and visual styles *(code created by spec 02)* | `src/ui/palette.ts`, `src/ui/layout.ts`, `docs/STYLE_GUIDE.md` | Everyone |
| Game startup and navigation *(created by spec 02)* | `src/main.ts`, `src/scenes/sceneKeys.ts` | Everyone |
| Text and languages | `src/i18n/es.json`, `src/i18n/en.json` | Everyone |
| Data format | `data/*.json` | Engine, content |
| Dependencies and configuration | `package.json`, `tsconfig.json`, `eslint.config.js`, `vite.config.ts` | Everyone |
| Folder structure | Entire tree | Everyone |
| Game design | `docs/GDD.md`, `docs/specs/*` | Everyone |

> Exception: **adding** new keys to `i18n/*.json` or new values to `balance.ts` is allowed without notification. **Renaming, deleting, or changing the meaning** of an existing item is not.

### 1.3 Mandatory rule: flag decisions that affect others
If the agent is about to do any of the following:
- modify a shared contract (table 1.2),
- touch files outside its spec,
- make a design, mechanics, or aesthetic decision **not written** in the GDD or spec,
- add a new dependency,
- do something that contradicts any spec (its own or someone else's),

it **MUST stop beforehand** and show the person this warning:

```
⚠️ DECISION AFFECTING THE TEAM
What I want to do: …
Why: …
Who it affects: (spec / person / file) …
Alternative that affects no one else: …
Shall I proceed? If you proceed, notify the team and record it in docs/DECISIONS.md
```

Then wait for confirmation. If the person confirms, the agent adds an entry to `docs/DECISIONS.md`.

### 1.4 If the spec is insufficient
If the spec is ambiguous or missing information, the agent **asks** instead of inventing it. Silently inventing a decision is the fastest way for two people to build incompatible things.

---

## 2. Clean, human-readable code

People (us and the judges) will read the code, not just agents.

- **Full, descriptive names in English**: `oxygenLevel`, `assignTaskToBot()`. Never `oxL`, `tmp`, `data2`, `handleStuff`.
- **Small functions**: one function does one thing. Maximum ~30 lines.
- **Small files**: one concept per file, maximum ~200 lines.
- **No magic numbers**: all game values go in `src/config/balance.ts`. All colors go in `src/ui/palette.ts`.
- **No visible text in code**: all text comes from `src/i18n/*.json` through `t('clave')`.
- **English comments explaining WHY**, not what. Each file starts with a short comment describing its purpose.
- **Strict TypeScript**: no `any`, no `// @ts-ignore`.
- **Simple > clever**: no abstractions “just in case”, complex patterns, or premature optimization. If there are two ways, choose the one a person understands faster.
- **Leave no dead code** or forgotten `console.log` calls.
- **Before declaring anything done**: `npm run check` (lint + types + tests) must pass.

## 3. Architecture

```
src/
  core/        Pure game logic. NEVER import Phaser. Tested with Vitest.
  bots/        Bot decisions. Send GameAction, just like a human.
  config/      balance.ts: all game numbers.
  content/     Loads data/*.json.
  scenes/      Phaser scenes (visuals). Read state, send actions.
  minigames/   One minigame per folder. All extend MinigameScene.
  ui/          Reusable visual components, palette, typography.
  i18n/        Text in es.json / en.json.
  services/    Progress storage (localStorage).
data/          Content editable without coding (locations, events, facts).
public/assets/ Images, sounds, NASA photos.
docs/          GDD, plan, specs, style guide, sources, decisions.
tests/         Tests for src/core and src/bots.
```

Rules:
- **Logic knows nothing about visuals.** `core/` does not import Phaser; scenes do not calculate game rules. This lets us move logic to a multiplayer server later.
- **Bots and humans send the same `GameAction`.** No special shortcuts for bots.
- **Each minigame lives in its own folder** and connects to the rest only through `MinigameScene` and `registry.ts`.

## 4. Design for children aged 7 to 12

- **Zero learning curve**: players must know what to tap immediately. One large primary button per screen.
- **Icons before text.** One-line text. Never a continuous block of text before playing.
  - Exception: a minigame may open with an **explanation card** when the mechanic teaches how something real works (e.g. MOXIE in the Oxygen Factory). Use illustrated steps, one line per step (maximum 4), and a large start button. Pause the game while it is visible (`pauseGame()` / `resumeGame()` from `MinigameScene`).
- **Touch buttons at least 48 game pixels across.**
- **Every action has visual feedback (and sound when audio is available).**
- **Educational content comes after the action, as a reward**, in one line (except for the explanation card above).
- **Mobile first, landscape.** Always test on a phone or in browser device mode.

## 5. Visual style

- Follow `docs/STYLE_GUIDE.md`. Use only palette colors.
- Generated images are pixel art. **Real NASA images are always framed** (window, monitor, photo) and credited in `docs/DATA_SOURCES.md`.

## 6. Git

- One branch per spec: `spec-07-paneles`, `spec-03-nucleo`.
- **Everything added to the repo goes in English** (NASA Space Apps rule): commit messages, branch names, PR titles and descriptions, GitHub comments and reviews, and code comments. Keep commits small and descriptive.
  - Exception: game text in `src/i18n/es.json` stays in Spanish (it is the game's translation).
  - Existing Spanish content (old commits, docs) is not rewritten: never rewrite Git history.
- Nothing enters `main` without a Pull Request reviewed by another team member.
- Never `push --force` to `main`.

## 7. Commands

```bash
npm install       # once
npm run dev       # game at http://localhost:5173 (and on a phone via the LAN IP)
npm run check     # lint + types + tests: must pass before each PR
npm run build     # production build
```
