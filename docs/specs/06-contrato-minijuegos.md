# 06 — Minigame contract

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | B | P0 | 0 | ⚪ Proposed |

## Objective
Define **how a minigame connects to the rest of the game**, so B can build minigames and A the base **in parallel, without blocking or overwriting each other**.

## Why it matters
This is the contact point between two people. Changing it midway breaks both people's work. Set it in phase 0.

## Scope
The contract defines:
- **Input**: what a minigame receives when opened (at least the task; optionally location difficulty).
- **Output**: what it returns on completion → `{ taskId, performance }`, with `performance` from 0 to 1.2 (1 = good, > 1.1 = perfect).
- **What the base class does for all minigames** (so each implements only its own game):
  - Panel over the base, with dimmed background.
  - **One-line** instruction above + time bar (~12 s).
  - On completion: "PERFECT!" / "Well done!" / "Almost!" + **one-line real fact**.
  - Notify the base and close.
- **Registry**: where each room's minigame is assigned.
- **Temporary minigame** ("tap 5 times") for rooms without their own yet, so the whole game is playable from the start.
- **Template/example** for writing a new minigame.

## Acceptance criteria
- [ ] Contract documented at the top of `src/minigames/MinigameScene.ts` (what to implement, what not to touch).
- [ ] A and B reviewed and agreed together (recorded in `DECISIONS.md`).
- [ ] Adding a minigame requires touching **only** its folder + 1 line in `registry.ts`.
- [ ] All 4 rooms open something (real or temporary).

## Files
**Owned / contract defined:** `src/minigames/MinigameScene.ts`, `src/minigames/registry.ts`, `src/minigames/placeholder/`.
⚠️ Once approved, **notify A of any change**.

## Dependencies
**Depends on:** 02. **Blocks:** 04, 07, 08, 09, 10, 15.

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
