# 10 — Minijuego: muro de escudo ☢️

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | B | P0 | 1 | ⚪ Propuesto |

## Objetivo
**Arrastrar bloques de agua y regolito para tapar los huecos del muro**, para entender cómo se protegen los astronautas de la radiación.

## Por qué importa
La radiación es un riesgo real e invisible en Marte (no tiene campo magnético global ni atmósfera gruesa). Conecta con los datos de RadLab y DONKI.

## Cómo se juega
- Un muro con huecos por donde entran "rayitos" de radiación (amarillos/violetas, animados).
- Abajo aparecen bloques (agua 💧 / regolito 🪨).
- La jugadora arrastra cada bloque a un hueco; encaja solo si está cerca (snap), sin rotar.
- Cada hueco tapado corta un rayito.
- **Rendimiento**: huecos tapados / total, + bonus por velocidad.
- Dificultad por lugar (ej. Olympus Mons): más huecos.

> Versión simple a propósito: **sin rotación ni piezas raras** (no es un Tetris completo). Si sobra tiempo, se enriquece.

## Criterios de aceptación
- [ ] Se entiende sin leer.
- [ ] Arrastrar y soltar funciona bien con el dedo; el snap es generoso.
- [ ] Rendimiento de 0 a 1.2.
- [ ] Dato real al final (i18n).
- [ ] Parámetros en `balance.ts`.

## Archivos
**Propios:** `src/minigames/shield-wall/*`.
**Contratos que usa:** `MinigameScene`, `registry.ts` (1 línea), `palette.ts`, `i18n`.

## Dependencias
**Depende de:** 06. **Usa assets de:** 01.

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
