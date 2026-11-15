# Work plan

> How we validate each stage: see [`ROADMAP.md`](ROADMAP.md).

Deadline: **tomorrow afternoon**. Team: 3 developers using AI agents and image generators.

## Roles

| Role | Responsible for | Person |
|---|---|---|
| **A — Engine** | Game logic, base, movement, bots, events | _(to fill in)_ |
| **B — Minigames** | Minigame contract and each minigame | _(to fill in)_ |
| **C — Art, content, and screens** | Art direction, image set, screens, Mars map, text, NASA data, deployment | _(to fill in)_ |

Each spec has **one owner**. Help is welcome, but one person is accountable.

## Phases

### Phase 0 — Agree on the direction (≈ 1–2 h) 🟣
Goal: align all 3 team members before production.
- **Everyone**: read `GDD.md` + the specs, approve with ✅ or comment.
- **C**: [01 Art direction](specs/01-direccion-de-arte.md) — reference image set → **all 3 vote on the style**.
- **A**: [02 Technical foundation](specs/02-base-tecnica.md) — review the existing logic with the team and build the frontend skeleton + CI.
- **B**: [06 Minigame contract](specs/06-contrato-minijuegos.md) — settle the interface so A and B do not block each other.

**Phase 0 outcome**: visual style chosen by vote, code foundation agreed, minigame interface settled.

### Phase 1 — Minimum playable game (P0) 🔴
The game must be playable from start to finish, even if it looks rough.

| A | B | C |
|---|---|---|
| 03 Game session core | 07 Solar panels | 11 Start/result screens + mobile |
| 04 Base and movement | 08 Oxygen factory | 13 Educational content and languages |
| 05 Crew and bots | 09 Greenhouse | (sprite production from spec 01) |
| | 10 Shield wall | |

**Milestone**: a complete session can be played on a phone, in ES and EN.

### Phase 2 — What makes us different (P1) 🟠
| A | B | C |
|---|---|---|
| 14 Events and delayed warnings | 15 Rover expedition | 12 Mars map and progression |

### Phase 3 — Collaboration (P2) 🟡
| A | B | C |
|---|---|---|
| 16 Two-person lever + crisis meeting | Minigame polish | Sound, animations |

### Phase 4 — Submission 🏁
- **C**: [17 Deployment and demo](specs/17-deploy-y-demo.md) (automatic deployment is configured **in phase 1**, to start testing on phones early).
- **Freeze code ~3 h before submission.** Bug fixes only after that.
- Everyone: test on different phones, prepare the pitch.

## Priorities if time runs out
Cut from the bottom up: P2 → P1. **Never cut P0.**
If a minigame is not ready, keep the temporary minigame (tap 5 times) in its room.

## Synchronization points
Short (10 min), with all 3 team members:
1. At the end of phase 0 (style vote and contract).
2. At the end of phase 1 (test the whole game).
3. Before the code freeze.

Also: share any “⚠️ decision affecting the team” warning in the team chat as soon as it appears.
