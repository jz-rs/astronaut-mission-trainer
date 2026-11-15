# 05 — Crew and bots

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | A | P0 | 1 | ⚪ Proposed |

## Objective
Make the player feel like **the commander**: send their 3 bots to tasks or leave them on auto, and **bots improve as the player plays better**.

## Why it matters
- Our version of "collaborative" for v0 (real multiplayer comes later).
- Creates decisions: what do I do and what do I delegate?
- **The hook for replaying**: training the crew.

## Scope
**Includes:**
- 3 differently colored bots visible walking around the base, with a small progress bar overhead while working.
- **Give an order**: tap a bot (highlight it) → tap a room → bot goes there.
- **🤖 Auto mode** per bot (on by default): goes to the lowest bar, without two bots choosing the same task.
- Visible switch to turn each bot's auto mode on/off.
- Bot: takes ~20 s and performs at 60% without training.
- **Training**: the player's best result in each minigame becomes the bots' efficiency for that task. Saved between sessions.
- Bots send the **same `GameAction`** as a person.

**Excludes:** "my crew" screen with levels (could be P2), online multiplayer.

## Acceptance criteria
- [ ] Ordering a bot works with a finger on a phone (bots are small: enlarge touch areas).
- [ ] All bots on auto keep the base running for a while, but **cannot win** without the player playing.
- [ ] A "perfect" minigame result visibly improves bots in the next session.
- [ ] Tests for: auto selection, avoiding duplicate tasks, training.
- [ ] No special shortcuts for bots in `core/`.

## Files
**Owned:** `src/bots/*`, `src/core/training.ts`, bot visuals in `src/scenes/base/`, `tests/autoPilot.test.ts`, `tests/training.test.ts`.
**Contracts used:** `GameAction`, `balance.ts` (`CREW_BALANCE`), `services/progressStorage.ts`.

## Dependencies
**Depends on:** 03, 04. **Blocks:** 16.

## Open questions
- Where does the auto switch go? Proposal: 3 bot faces in a HUD corner; tap a face to toggle auto/manual.

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
