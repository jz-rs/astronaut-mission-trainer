# 02 — Base técnica: lógica existente + esqueleto del front

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | A | P0 | 0 | ⚪ Propuesto |

## Objetivo
Que las 3 puedan empezar a programar **en paralelo** sobre una base común: la lógica del juego ya funciona y existe un **esqueleto visual mínimo** (sin estética todavía) donde cada una enchufa su parte, con tests automáticos en cada PR.

## Contexto: qué hay hoy

### ✅ Back (se conserva)
Lógica pura en TypeScript, sin nada visual, con 16 tests que pasan.

| Qué | Dónde | Spec que lo continúa |
|---|---|---|
| Configuración Vite + TypeScript estricto + ESLint + Prettier + Vitest | raíz | — |
| Partida: stats, decaimiento por lugar, energía, soles, evacuación/supervivencia | `src/core/run.ts`, `stats.ts`, `types.ts` | 03 |
| Acciones (iguales para bots y personas) | `src/core/actions.ts` | 03 |
| Punto de entrada para las escenas | `src/core/GameSession.ts` | 03 |
| Puntaje y 3 estrellas | `src/core/scoring.ts` | 03 |
| Números de balance | `src/config/balance.ts` | 03 |
| Bots: modo auto (van a la barra más baja) | `src/bots/autoPilot.ts` | 05 |
| Entrenamiento de bots (aprenden de tu mejor resultado) | `src/core/training.ts` | 05 |
| Guardado de progreso en el navegador | `src/services/` | 03, 05, 12 |
| Textos ES/EN + función `t()` | `src/i18n/` | 13 |
| Lugares y 2 eventos de ejemplo | `data/` | 12, 13, 14 |

### ❌ Front (descartado)
Hubo un prototipo visual que **se descartó por feo** (decisión en `docs/DECISIONS.md`). Queda en el historial de git (commit `fb40014`) **solo como referencia técnica** (por ejemplo, cómo se conectaba un minijuego), no como guía estética.

## Alcance
**Incluye:**
- Revisar el back contra `AGENTS.md` y con las 3: ¿se entiende?, ¿falta algo?
- **Esqueleto del front**, sin estética (solo estructura):
  - `src/main.ts`: Phaser 3, resolución 640 × 360, escalado a la pantalla, pixel art, horizontal.
  - Escenas vacías que navegan entre sí: Inicio → Base → Resultado (un texto y un botón cada una alcanza).
  - `src/ui/palette.ts` y `src/ui/layout.ts`: los colores y tamaños de `docs/STYLE_GUIDE.md` como constantes (se actualizan cuando se vote el estilo).
  - Carga correcta de la fuente antes de dibujar textos.
- **CI**: GitHub Actions corre `npm run check` en cada PR.

**No incluye:** ningún diseño visual (spec 01), escenas reales (04, 11), minijuegos (06+).

## Criterios de aceptación
- [ ] Las 3 revisaron el back y lo aprobaron (o pidieron cambios, anotados en `DECISIONS.md`).
- [ ] `npm run dev` abre el esqueleto y se puede ir Inicio → Base → Resultado → Inicio.
- [ ] El CI corre en cada PR y bloquea si `npm run check` falla.
- [ ] Ninguna escena tiene colores o tamaños escritos a mano: todo sale de `palette.ts` / `layout.ts`.

## Archivos
**Propios:** `src/main.ts`, `src/scenes/sceneKeys.ts`, escenas vacías iniciales, `src/ui/palette.ts`, `src/ui/layout.ts`, `.github/workflows/ci.yml`.
Después de este spec, cada escena pasa a ser de su spec (Base → 04, Inicio/Resultado → 11).

## Dependencias
**Depende de:** nada. **Bloquea a:** todos los specs de front (04, 06, 07–11).

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
