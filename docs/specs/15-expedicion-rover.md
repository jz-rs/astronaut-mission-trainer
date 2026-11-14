# 15 — Expedición con el rover 🧪

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | B | P1 | 2 | ⚪ Propuesto |

## Objetivo
Que la jugadora pueda **arriesgar energía para salir con el rover a juntar muestras** (puntos), y vea una **foto real del lugar** de Marte donde está.

## Por qué importa
- Es la decisión central de cada partida: ¿me arriesgo por puntos o cuido la base?
- Da la segunda estrella (muestras) y el puntaje.
- Es la mejor vidriera para las fotos reales de NASA (Mars Trek, Curiosity, Perseverance).

## Alcance
**Incluye:**
- Un botón/sala "garaje del rover" en la base (coordinar el lugar con A, spec 04).
- Solo se puede salir si hay energía suficiente (costo alto, en `balance.ts`).
- Minijuego (~15 s): el rover avanza sobre un fondo de Marte; tocar izquierda/derecha para esquivar rocas; tocar piedras brillantes para juntar muestras.
- Al terminar: suma muestras a la partida y muestra **la foto real del lugar en un marco** + dato.

**No incluye:** varios destinos por lugar, inclinar el celu (puede ser P2).

## Criterios de aceptación
- [ ] Mientras el rover está afuera la base sigue corriendo (riesgo real).
- [ ] Suma muestras al núcleo mediante una acción (si hace falta una `GameAction` nueva → **avisar a A**).
- [ ] Muestra foto real con crédito (registrada en `DATA_SOURCES.md`).
- [ ] Rendimiento y parámetros en `balance.ts`.

## Archivos
**Propios:** `src/minigames/rover/*`.
**Contratos que usa / puede necesitar cambiar:** `GameAction` (agregar muestras) → avisar a A; `registry.ts`.

## Dependencias
**Depende de:** 03, 04, 06. **Usa assets de:** 01, fotos del 13.

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
