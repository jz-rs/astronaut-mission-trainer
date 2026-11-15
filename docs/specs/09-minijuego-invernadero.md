# 09 — Minijuego: invernadero 🥬

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | B | P0 | 1 | ⚪ Propuesto |

## Objetivo
**Darle a cada planta lo que pide (agua o luz LED) antes de que se seque**, para entender cómo se cultiva comida en el espacio y que las plantas también hacen oxígeno.

## Por qué importa
Sin comida no hay misión larga a Marte. Enseña el experimento Veggie, que cosechó lechuga en la Estación Espacial: crece en almohadas de tierra especial (la de Marte es tóxica, tiene percloratos) bajo luces LED rojas y azules, y las plantas toman CO₂ y largan O₂.

## Cómo se juega
- Antes de jugar, una tarjeta de 3 pasos con dibujitos (tierra tóxica → almohada; agua + luz → lechuga; CO₂ → lechuga → O₂), con el juego en pausa. Mientras se juega, los mismos pasos quedan en un panel a la izquierda.
- Una grilla de 3 × 2 lechugas, cada una con su lámpara LED rosa arriba.
- Al azar, una planta pide **agua** (se pone amarilla, con una gotita arriba) o **luz** (se le apaga la lámpara y se pone pálida, con una lámpara arriba).
- A la derecha hay dos herramientas grandes, **Agua** y **Luz**: se arrastra la herramienta a la planta, o se toca la herramienta y después la planta.
- La correcta la hace crecer (brote → joven → grande) y suelta una burbuja azul de O₂. La equivocada no hace nada (la burbuja tiembla).
- Si no se la ayuda a tiempo, se marchita.
- **Rendimiento**: pedidos ayudados / pedidos, + bonus si ninguna se marchitó.
- Dificultad por lugar: las plantas piden más seguido y esperan menos.

## Criterios de aceptación
- [ ] Se entiende sin leer (la gotita, la lámpara y el color lo dicen todo).
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
