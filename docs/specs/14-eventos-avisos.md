# 14 — Events and delayed warnings

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | A | P1 | 2 | ⚪ Proposed |

## Objective
Let Mars "attack" the base with events based on real data, while **communication delay with Earth** sometimes gives time to prepare and sometimes does not.

## Why it matters
- Makes each session different (replayability).
- Teaches a real, little-known fact: Earth–Mars signals take 4 to 24 minutes.
- Shows cause → effect: "your shield was low when the storm arrived".

## Scope
**Includes:**
- Each location has an event deck (`data/events.json`); draw 2–3 randomly per session.
- Types: solar storm (☢️), dust storm (⚡), equipment failure, and at least 1 positive event.
- **Warning**: some events warn 1 sol ahead ("📡 Message from Earth"), others arrive without warning.
- Warning and event shown with a large icon + one line of text + animation (shake, flash).
- Mention the most damaging event on the result screen.

**Excludes:** crisis meeting and lever (16), live API calls.

## Acceptance criteria
- [ ] Event logic in `src/core/` with tests (draw, warning, effect).
- [ ] At least 8 events in `data/events.json` with real sources (coordinated with C, spec 13).
- [ ] A child understands what happened without reading more than one line.
- [ ] Two sessions at the same location have different events.

## Files
**Owned:** `src/core/events*.ts`, event visuals in `src/scenes/base/`.
**Contracts:** **defines the `data/events.json` format** (C writes content: agree on the format with C before starting).

## Dependencies
**Depends on:** 03, 04, 13. **Blocks:** 16.

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
