# 07 — Minigame: solar panels ⚡

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | B | P0 | 1 | ⚪ Proposed |

## Objective
**Swipe to remove dust from solar panels**, and understand that Martian dust is energy's greatest enemy.

## Why it matters
The **only minigame that generates energy**, the currency all tasks use. Teaches a real fact: dust shut down the Opportunity and InSight rovers.

## How to play
- Before the clock starts, a card explains 3 illustrated steps with a "Let's clean!" button (game and base paused). See DECISIONS 2026-11-15.
- 3 dust-covered panels (Mars tones), with sunlight entering through the window as yellow rays: weak where dusty, strong where clean. Little light enters at night (see DECISIONS 2026-11-15).
- Drag a finger to "sweep" dust away along its path (like a scratch card).
- Each clean panel sends energy sparks along a cable to the base battery, filling it.
- Ends when everything is clean or time runs out (~12 s).
- **Performance**: percentage cleaned; if fully clean, a speed bonus (up to 1.2 = perfect).
- Difficulty by location (e.g. Gale): more dust or dust gradually falls again.

## Acceptance criteria
- [ ] Clear what to do without reading the instruction (test with someone).
- [ ] Works with a finger on a phone (swiping does not move the page).
- [ ] Performance from 0 to 1.2 using the criteria above.
- [ ] Shows the real fact at the end (text in `i18n`).
- [ ] Uses spec 01 sprites when available (panels, dust).
- [ ] Difficulty comes from `balance.ts`, not numbers in code.

## Files
**Owned:** `src/minigames/solar-panels/*`.
**Contracts used:** `MinigameScene` (06), `registry.ts` (1 line), `palette.ts`, `i18n`.

## Dependencies
**Depends on:** 06. **Uses assets from:** 01.

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
