# 16 — Crisis meeting and shelter

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | A | P2 | 3 | ⚪ Propuesto |

## Objetivo
Dos momentos donde **la tripulación tiene que actuar junta**, como las emergencias y las reuniones de Among Us.

## Por qué importa
Lo social es el gancho de Among Us. Aunque en la v0 sean bots, deja la mecánica lista para cuando haya personas reales, y se puede mostrar en el pitch.

## Alcance
> Updated 2026-11-15 (see `docs/DECISIONS.md`): the crisis meeting votes real NASA procedures on the mission tablet, and the two-person lever was replaced by taking shelter.

**Crisis meeting on the tablet** (when Earth warns of a solar or dust storm, spec 14). The base pauses and the cabin tablet pops up over it, its edges flashing black:
1. *Message from Earth*: a signal travels from Earth to Mars; "It took N minutes to arrive" (3–22 min, the real light delay).
2. *What do we do?*: a small real NASA photo, one line and two huge buttons, 10 s to vote. Solar storm: "Take shelter" (right) vs "Go outside". Dust storm: "Save energy" (right) vs "Clean panels". The right answer changes side with the sol.
3. *Right / Oops*: a real NASA photo and one line on **why**, from real missions (Orion's radiation dummies, Curiosity's radiation specks in 2024, the 2018 global dust storm, Opportunity's dusty panels). OK goes back to the base.
- The player is the commander: bots vote the same as the player, right after the player. Voting right halves the event's damage and sets what bots on auto do first.

**Shelter** (when a solar storm lands, with or without warning): "GET INSIDE!" with a countdown; the shield room blinks. Tapping it gets the player in; bots walk in by themselves. Getting in halves the damage again.

**Reward** (when a crisis is over): the tablet shows a real NASA photo and one fact (MAVEN's 2024 auroras, Opportunity cleaned by the wind in 2014).

**No incluye:** multijugador online, chat.

## Criterios de aceptación
- [ ] Ambas mecánicas se entienden sin texto largo.
- [ ] Los bots participan usando `GameAction` (`castVote` and `enterShelter` are actions).
- [ ] Se pueden desactivar desde `balance.ts` si no llegan pulidas.

## Archivos
**Propios:** nuevos archivos en `src/core/` y `src/scenes/` para estas mecánicas.
**Contratos:** agrega tipos nuevos a `GameAction` → **avisar a B** (puede afectar minijuegos).

## Dependencias
**Depende de:** 05, 14.

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
