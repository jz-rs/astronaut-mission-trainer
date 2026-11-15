# 09 — Minigame: greenhouse 🥬

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | B | P0 | 1 | ⚪ Proposed |

## Objective
**Give each plant what it requests (water or LED light) before it dries out**, to understand how food is grown in space and that plants also make oxygen.

## Why it matters
No long Mars mission without food. Teaches Veggie, which harvested lettuce on the Space Station: it grows under red and blue LEDs; since Martian soil is toxic (contains perchlorates), plants on Mars would grow in soil brought from Earth, and plants take in CO₂ and release O₂.

## How to play
- Before playing, a 3-step illustrated card (toxic Mars soil → Earth → sprout; water + light → lettuce; CO₂ → lettuce → O₂), with the game paused. The same steps remain in a panel on the left while playing.
- 6 lettuce plants, one per room bed (soil brought from Earth), under the room's pink LED lamps.
- A random plant requests **water** (turns yellow, with a droplet overhead) or **light** (its bed dims as though the lamp went off, and it turns pale, with a lamp overhead).
- Two large tools on the right, **Water** and **Light**: drag the tool to the plant, or tap the tool then the plant.
- The correct tool makes it grow (sprout → young → large) and releases a blue O₂ bubble. The wrong tool does nothing (the bubble shakes).
- Without timely help, it wilts.
- **Performance**: requests helped / requests, + bonus if none wilted.
- Difficulty by location: plants request more often and wait less.

## Acceptance criteria
- [ ] Understandable without reading (droplet, lamp, and color explain everything).
- [ ] Large touch areas (≥ 48 px).
- [ ] Performance from 0 to 1.2.
- [ ] Real fact at the end (i18n).
- [ ] Parameters in `balance.ts`.

## Files
**Owned:** `src/minigames/greenhouse/*`.
**Contracts used:** `MinigameScene`, `registry.ts` (1 line), `palette.ts`, `i18n`.

## Dependencies
**Depends on:** 06. **Uses assets from:** 01.

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
