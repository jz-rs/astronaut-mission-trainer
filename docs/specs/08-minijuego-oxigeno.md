# 08 — Minijuego: fábrica de oxígeno 💨

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | B | P0 | 1 | ⚪ Propuesto |

## Objetivo
**Llevar el CO₂ del aire de Marte a MOXIE y ver por su ventanita cómo se parte y cómo dos O forman O₂** (ver DECISIONS 2026-11-14), para entender que en Marte se puede fabricar oxígeno a partir de su aire.

## Por qué importa
Oxígeno es la barra que baja más rápido. Y enseña MOXIE, el experimento de Perseverance que hizo oxígeno en Marte de verdad.

## Cómo se juega
- Antes del reloj, una tarjeta explica los 4 pasos con dibujitos y el botón "¡A fabricar!" (el juego y la base quedan en pausa).
- Moléculas de CO₂ (O azul – C oscuro – O azul) flotan por la pantalla; la jugadora las arrastra o toca para meterlas en MOXIE.
- Por la ventanita de MOXIE se ve: el CO₂ se calienta (naranja) y se parte; el CO sale gris por el caño gris; la O azul espera ("¡Falta 1 CO₂!").
- Con dos O se forma O₂, que va por el caño azul al tanque ("¡+1 O₂!").
- Termina al llenar el tanque de O₂ (`oxygenGoal`) o al acabarse el tiempo.
- **Rendimiento**: CO₂ metidos en MOXIE / CO₂ necesarios (2 por O₂), + bonus por velocidad.
- Dificultad por lugar: moléculas más rápidas.

## Criterios de aceptación
- [ ] Se entiende sin leer.
- [ ] El arrastre funciona bien con el dedo (burbujas grandes, ≥ 40 px).
- [ ] Rendimiento de 0 a 1.2.
- [ ] Dato real al final (i18n).
- [ ] Parámetros en `balance.ts`.

## Archivos
**Propios:** `src/minigames/oxygen-factory/*`.
**Contratos que usa:** `MinigameScene`, `registry.ts` (1 línea), `palette.ts`, `i18n`.

## Dependencias
**Depende de:** 06. **Usa assets de:** 01.

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
