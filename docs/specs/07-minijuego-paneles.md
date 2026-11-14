# 07 — Minijuego: paneles solares ⚡

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | B | P0 | 1 | ⚪ Propuesto |

## Objetivo
**Deslizar el dedo para sacar el polvo de los paneles solares**, y entender que el polvo de Marte es el gran enemigo de la energía.

## Por qué importa
Es **el único minijuego que genera energía**, la moneda que usan todas las tareas. Y enseña algo real: el polvo apagó a los rovers Opportunity e InSight.

## Cómo se juega
- 3 paneles cubiertos de polvo (tonos de Marte).
- Arrastrar el dedo "barre" el polvo por donde pasa (como una raspadita).
- Termina cuando está todo limpio o se acaba el tiempo (~12 s).
- **Rendimiento**: porcentaje limpio; si quedó todo limpio, bonus por velocidad (hasta 1.2 = perfecto).
- Dificultad por lugar (ej. Gale): más polvo o el polvo vuelve a caer de a poco.

## Criterios de aceptación
- [ ] Se entiende qué hacer sin leer la instrucción (probarlo con alguien).
- [ ] Funciona con el dedo en celu (deslizar no mueve la página).
- [ ] Rendimiento de 0 a 1.2 según el criterio de arriba.
- [ ] Al terminar muestra el dato real (texto en `i18n`).
- [ ] Usa los sprites del spec 01 cuando estén (paneles, polvo).
- [ ] La dificultad sale de `balance.ts`, no de números en el código.

## Archivos
**Propios:** `src/minigames/solar-panels/*`.
**Contratos que usa:** `MinigameScene` (06), `registry.ts` (1 línea), `palette.ts`, `i18n`.

## Dependencias
**Depende de:** 06. **Usa assets de:** 01.

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
