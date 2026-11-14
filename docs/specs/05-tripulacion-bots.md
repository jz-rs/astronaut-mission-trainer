# 05 — Tripulación y bots

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | A | P0 | 1 | ⚪ Propuesto |

## Objetivo
Que la jugadora sienta que es **la comandante**: puede mandar a sus 3 bots a hacer tareas o dejarlos en automático, y **los bots mejoran cuanto mejor juega ella**.

## Por qué importa
- Es nuestra versión de "colaborativo" para la v0 (el multijugador real viene después).
- Genera decisiones: ¿qué hago yo y qué delego?
- **Es el gancho para volver a jugar**: entrenar a la tripulación.

## Alcance
**Incluye:**
- 3 bots de colores distintos que se ven caminando por la base, con una barrita de progreso arriba cuando trabajan.
- **Dar una orden**: tocar un bot (queda resaltado) → tocar una sala → el bot va.
- **Modo 🤖 Auto** por bot (activado por defecto): va a la barra más baja, sin que dos bots vayan a la misma tarea.
- Interruptor visible para prender/apagar el modo auto de cada bot.
- Bot: tarda ~20 s y rinde al 60% sin entrenamiento.
- **Entrenamiento**: el mejor resultado de la jugadora en cada minijuego pasa a ser la eficiencia de los bots en esa tarea. Se guarda entre partidas.
- Los bots mandan las **mismas `GameAction`** que una persona.

**No incluye:** pantalla de "mi tripulación" con niveles (puede ser P2), multijugador online.

## Criterios de aceptación
- [ ] Ordenar a un bot funciona con el dedo en el celu (los bots son chicos: área táctil ampliada).
- [ ] Con todos en auto, la base se mantiene un rato sola, pero **no alcanza para ganar** sin que la jugadora juegue.
- [ ] Hacer un "perfecto" en un minijuego mejora visiblemente a los bots en la siguiente partida.
- [ ] Tests de: elección del modo auto, no repetir tarea, entrenamiento.
- [ ] Ningún atajo especial para bots en `core/`.

## Archivos
**Propios:** `src/bots/*`, `src/core/training.ts`, `src/scenes/base/CrewView.ts`, `tests/autoPilot.test.ts`, `tests/training.test.ts`.
**Contratos que usa:** `GameAction`, `balance.ts` (`CREW_BALANCE`), `services/progressStorage.ts`.

## Dependencias
**Depende de:** 03, 04. **Bloquea a:** 16.

## Preguntas abiertas
- ¿Dónde va el interruptor de auto? Propuesta: caritas de los 3 bots en una esquina del HUD; tocar la carita alterna auto/manual.

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
