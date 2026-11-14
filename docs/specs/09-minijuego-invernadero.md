# 09 — Minijuego: invernadero 🥬

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | B | P0 | 1 | ⚪ Propuesto |

## Objetivo
**Tocar las plantas que tienen sed antes de que se sequen**, para entender que cultivar comida en el espacio requiere cuidado constante.

## Por qué importa
Sin comida no hay misión larga a Marte. Enseña el experimento Veggie, que cosechó lechuga en la Estación Espacial.

## Cómo se juega
- Una grilla de macetas (ej. 3 × 2) con plantitas.
- Al azar, una planta se pone amarilla/caída con una gotita arriba (tiene sed).
- Tocarla la riega: se pone verde y crece un poco ("pegale al topo").
- Si no se la toca a tiempo, se marchita.
- **Rendimiento**: plantas salvadas / plantas que tuvieron sed, + bonus si ninguna se marchitó.
- Dificultad por lugar: las plantas tienen sed más seguido o aguantan menos.

## Criterios de aceptación
- [ ] Se entiende sin leer (la gotita y el color lo dicen todo).
- [ ] Áreas táctiles grandes (≥ 48 px).
- [ ] Rendimiento de 0 a 1.2.
- [ ] Dato real al final (i18n).
- [ ] Parámetros en `balance.ts`.

## Archivos
**Propios:** `src/minigames/greenhouse/*`.
**Contratos que usa:** `MinigameScene`, `registry.ts` (1 línea), `palette.ts`, `i18n`.

## Dependencias
**Depende de:** 06. **Usa assets de:** 01.

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
