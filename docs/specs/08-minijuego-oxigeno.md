# 08 — Minijuego: fábrica de oxígeno 💨

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | B | P0 | 1 | ⚪ Propuesto |

## Objetivo
**Arrastrar burbujas de CO₂ a la máquina y ver salir burbujas de O₂**, para entender que en Marte se puede fabricar oxígeno a partir de su aire.

## Por qué importa
Oxígeno es la barra que baja más rápido. Y enseña MOXIE, el experimento de Perseverance que hizo oxígeno en Marte de verdad.

## Cómo se juega
- Burbujas de CO₂ (oscuras, con "CO₂" en pixel) flotan por la pantalla.
- La jugadora las arrastra a la máquina (MOXIE simplificada).
- Por cada CO₂ que entra, sale una burbuja de O₂ celeste con un "pop" y la barra del minijuego sube.
- Termina al llegar al objetivo de burbujas o al acabarse el tiempo.
- **Rendimiento**: burbujas metidas / objetivo, + bonus por velocidad.
- Dificultad por lugar: burbujas más rápidas o más cantidad.

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
