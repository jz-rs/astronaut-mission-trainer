# Specs — project tasks

Each spec is **an individual task with one owner**. It describes **what must be achieved** (objective and acceptance criteria), not necessarily how.

## How to use them
1. **Read** the specs (your own and others that depend on yours).
2. **Approve**: each team member adds their ✅ in each spec's "Approval" section. If you disagree, discuss it in the team chat **before** work begins.
3. **Start** only after all 3 approve the spec. Change status to 🔵 In progress.
4. **Finish**: all acceptance criteria checked + `npm run check` passes + reviewed PR → ✅ Done.
5. **Changing an approved spec**: notify the team and record it in `docs/DECISIONS.md`.

To work with your agent: *"Read AGENTS.md and docs/specs/NN-xxx.md and work on that spec."*

## Statuses
⚪ Proposed · 🟢 Approved · 🔵 In progress · ✅ Done · ⏸️ Cut from scope

## Index

| # | Spec | Role | Priority | Phase | Status |
|---|---|---|---|---|---|
| 01 | [Art direction and image set](01-direccion-de-arte.md) | C | P0 | 0 | ⚪ |
| 02 | [Technical foundation: logic + frontend skeleton](02-base-tecnica.md) | A | P0 | 0 | ⚪ |
| 03 | [Game session core](03-nucleo-partida.md) | A | P0 | 1 | ⚪ |
| 04 | [Base and movement](04-base-y-movimiento.md) | A | P0 | 1 | ⚪ |
| 05 | [Crew and bots](05-tripulacion-bots.md) | A | P0 | 1 | ⚪ |
| 06 | [Minigame contract](06-contrato-minijuegos.md) | B | P0 | 0 | ⚪ |
| 07 | [Minigame: solar panels](07-minijuego-paneles.md) | B | P0 | 1 | ⚪ |
| 08 | [Minigame: oxygen factory](08-minijuego-oxigeno.md) | B | P0 | 1 | ⚪ |
| 09 | [Minigame: greenhouse](09-minijuego-invernadero.md) | B | P0 | 1 | ⚪ |
| 10 | [Minigame: shield wall](10-minijuego-escudo.md) | B | P0 | 1 | ⚪ |
| 11 | [Start and result screens + mobile](11-pantallas-inicio-resultado.md) | C | P0 | 1 | ⚪ |
| 12 | [Mars map and progression](12-mapa-marte-progresion.md) | C | P1 | 2 | ⚪ |
| 13 | [Educational content and languages](13-contenido-educativo-idiomas.md) | C | P0 | 1 | ⚪ |
| 14 | [Events and delayed warnings](14-eventos-avisos.md) | A | P1 | 2 | ⚪ |
| 15 | [Rover expedition](15-expedicion-rover.md) | B | P1 | 2 | ⚪ |
| 16 | [Two-person lever and crisis meeting](16-colaboracion.md) | A | P2 | 3 | ⚪ |
| 17 | [Deployment and demo](17-deploy-y-demo.md) | C | P0 | 4 | ⚪ |
| 18 | [Solar panels outside, under the Martian sky](18-paneles-afuera.md) | B + C | P1 | 2 | ⚪ |
| 19 | [Intro, cabin, and mission manual](19-intro-cabina-manual.md) | C | P0 | Planning | ⚪ |
| 20 | [Change language inside the game](20-cambiar-idioma-en-el-juego.md) | C | _(to be defined)_ | _(to be defined)_ | ⚪ |
| 21 | [The destination console looks set forward from the walls](21-consola-encastrada.md) | C | _(to be defined)_ | _(to be defined)_ | ⚪ |

## Template for new specs

```markdown
# NN — Title

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | A/B/C | P0/P1/P2 | 0–4 | ⚪ Proposed |

## Objective
What must be achieved, in 1–3 sentences, from the player's perspective.

## Why it matters
Which part of the GDD / track it fulfills.

## Scope
**Includes:** …
**Excludes:** …

## Acceptance criteria
- [ ] …

## Files
**Owned (may modify):** …
**Contracts used (do not modify without notification):** …

## Dependencies
**Depends on:** … · **Blocks:** …

## Open questions
- …

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
```
