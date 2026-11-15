# 16 — Crisis meeting and shelter

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | A | P2 | 3 | ⚪ Proposed |

## Objective
Two moments when **the crew must act together**, like emergencies and meetings in Among Us.

## Why it matters
Social interaction is the hook in Among Us. Even with bots in v0, this prepares the mechanic for real people and can be shown in the pitch.

## Scope
> Updated 2026-11-15 (see `docs/DECISIONS.md`): the crisis meeting votes real NASA procedures on the mission tablet, and the two-person lever was replaced by taking shelter.

**Crisis meeting on the tablet** (when Earth warns of a solar or dust storm, spec 14). The base pauses and the cabin tablet pops up over it, its edges flashing black:
1. *Message from Earth*: a signal travels from Earth to Mars; "It took N minutes to arrive" (3–22 min, the real light delay).
2. *What do we do?*: a small real NASA photo, one line and two huge buttons, 10 s to vote. Solar storm: "Take shelter" (right) vs "Go outside". Dust storm: "Save energy" (right) vs "Clean panels". The right answer changes side with the sol.
3. *Right / Oops*: a real NASA photo and one line on **why**, from real missions (Orion's radiation dummies, Curiosity's radiation specks in 2024, the 2018 global dust storm, Opportunity's dusty panels). OK goes back to the base.
- The player is the commander: bots vote the same as the player, right after the player. Voting right halves the event's damage and sets what bots on auto do first.

**Shelter** (when a solar storm lands, with or without warning): "GET INSIDE!" with a countdown; the shield room blinks. Tapping it gets the player in; bots walk in by themselves. Getting in halves the damage again.

**Reward** (when a crisis is over): the tablet shows a real NASA photo and one fact (MAVEN's 2024 auroras, Opportunity cleaned by the wind in 2014).

**Excludes:** online multiplayer, chat.

## Acceptance criteria
- [ ] Both mechanics are understandable without long text.
- [ ] Bots participate using `GameAction` (`castVote` and `enterShelter` are actions).
- [ ] Can be disabled through `balance.ts` if not polished in time.

## Files
**Owned:** new files in `src/core/` and `src/scenes/` for these mechanics.
**Contracts:** adds new `GameAction` types → **notify B** (may affect minigames).

## Dependencies
**Depends on:** 05, 14.

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
