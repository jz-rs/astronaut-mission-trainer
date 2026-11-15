# 21 — The destination console looks set forward from the walls 🧱

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | C (images) | _(to be defined)_ | _(to be defined)_ | ⚪ Proposed |

## Problem
In the destination console (`MonitorScene`, image `public/assets/sprites/cabina/consola-fondo.png`), the dashboard **does not look integrated into the cabin**:

- Beside the dashboard, the ship's walls and corridor **continue behind** it to the image edges.
- This makes the dashboard look like a **box placed in front of the walls**, rather than built in: the walls should **end around the dashboard**.
- The problem lies in the two side strips between the dashboard edge and screen edge (and the floor below the shelf).

What has already been tried and did not work:
- A zoomed cabin background behind the cropped dashboard: the credit looked huge, and the route screen and LAND button were cut off.
- A version with seats at the sides: the seats ended up in front of the dashboard.
- The current version (walls at the sides): still looks set forward.
- Two Gemini requests to make the walls end around the dashboard, the second with the areas marked red. The first returned the same image; the second has not been reviewed.

> For now, this spec **only describes the problem**. The solution will be defined after team review.

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
