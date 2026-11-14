# 03 — Núcleo de la partida

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | A | P0 | 1 | ⚪ Propuesto |

## Objetivo
Que exista la **lógica de una partida completa**: 4 barras que bajan solas, la energía como moneda compartida, 5 soles, game over si una barra llega a 0, y un resultado con puntaje y 3 estrellas. Todo sin nada visual, testeado.

## Por qué importa
Es el corazón del pedido del track: **las decisiones afectan las variables.** Todo lo demás (base, bots, minijuegos) se conecta acá.

## Alcance
**Incluye:**
- Barras de 0 a 100: 💨 oxígeno, 🥬 comida, ☢️ escudo, ⚡ energía. Arrancan en 70 (configurable).
- Decaimiento continuo, multiplicado por la dificultad del lugar (`data/locations.json`).
- Completar una tarea: sube su barra según el rendimiento (0 a 1.2) y **gasta energía** (paneles no gasta, genera).
- No se puede hacer una tarea sin energía suficiente.
- 5 soles de ~60 s. Al terminar el sol 5 → "sobrevivió". Una barra en 0 → "evacuó".
- Resultado: `puntaje = salud promedio × 10 + muestras × 100`; estrellas: sobrevivió / muestras ≥ objetivo / desafío del lugar cumplido (barra X nunca bajó de Y).
- Todos los números en `src/config/balance.ts`.
- Punto único de entrada para las escenas (`GameSession`): leer estado, mandar acciones, avanzar el tiempo.

**No incluye:** visuales, eventos (spec 14), rover (spec 15), bots (spec 05).

## Criterios de aceptación
- [ ] `src/core/` no importa Phaser (lo controla ESLint).
- [ ] Tests para: decaimiento, multiplicador de lugar, tarea completada (sube barra + gasta energía), no se puede sin energía, evacuación, supervivencia, puntaje, cada estrella.
- [ ] Balance probado jugando: **una partida en Jezero sin hacer nada se pierde antes del sol 3**, y jugando bien se sobrevive con margen. (Anotar los números elegidos en `DECISIONS.md`.)
- [ ] `npm run check` pasa.

## Archivos
**Propios:** `src/core/*` (excepto los contratos), `tests/run.test.ts`, `tests/scoring.test.ts`.
**Contratos que define (cambios = avisar):** `src/core/types.ts`, `src/core/actions.ts` (`GameAction`), `src/config/balance.ts`, formato de `data/locations.json`.

## Dependencias
**Depende de:** 02. **Bloquea a:** 04, 05, 14, 15, 16.

## Preguntas abiertas
- ¿La partida dura exactamente 5 soles en todos los lugares, o los difíciles duran más? (Propuesta: 5 en todos.)

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
