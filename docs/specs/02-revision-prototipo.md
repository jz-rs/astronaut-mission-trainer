# 02 — Revisión del prototipo existente

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | A | P0 | 0 | ⚪ Propuesto |

## Objetivo
Decidir en **menos de 1 hora** si el código que ya existe en el repo sirve como punto de partida, para no perder tiempo ni reescribir lo que ya funciona.

## Contexto: qué hay hoy
Antes de cerrar la planificación, Claude armó un prototipo técnico. **No está aprobado por el equipo** y **no tiene commits todavía.**

| Qué | Dónde | Spec que lo "hereda" | Estado |
|---|---|---|---|
| Configuración Phaser 3 + TypeScript + Vite + ESLint + Prettier + Vitest | raíz | — | Funciona: `npm run check` y `npm run build` pasan |
| Lógica de la partida: stats, decaimiento, energía, soles, evacuación | `src/core/` | 03 | Con tests |
| Puntaje y estrellas | `src/core/scoring.ts` | 03 | Con tests |
| Números de balance | `src/config/balance.ts` | 03 | Valores a probar |
| Bots: modo auto y entrenamiento | `src/bots/`, `src/core/training.ts` | 05 | Con tests |
| Base: 4 salas (rectángulos), HUD con barras, astronautas (rectángulos) | `src/scenes/base/` | 04 | **Bug:** tocar una sala no mueve a la jugadora |
| Interfaz de minijuegos (clase base) + registro | `src/minigames/MinigameScene.ts`, `registry.ts` | 06 | Sin revisar |
| Minijuego paneles solares | `src/minigames/solar-panels/` | 07 | Sin probar a fondo |
| Minijuego provisorio "tocá 5 veces" | `src/minigames/placeholder/` | 07–10 | Para salas sin minijuego |
| Menú (JUGAR + ES/EN) y resultado (estrellas, puntaje) | `src/scenes/` | 11 | Funciona |
| Pedido de rotar el celu + pantalla completa | `src/ui/screen.ts`, `index.html` | 11 | Sin probar en celu |
| Textos ES/EN | `src/i18n/` | 13 | Funciona |
| Lugares y 2 eventos de ejemplo | `data/` | 12, 14 | Datos de ejemplo |
| Guardado de progreso | `src/services/` | 03, 05, 12 | Sin probar |

**Problemas conocidos:**
- Tocar una sala no lleva a la jugadora (bug a investigar).
- La fuente pixel "Press Start 2P" no se aplica (carga después de dibujar los textos).
- En la compu, pedir pantalla completa da un error en consola (esperable fuera del celu).
- Los números de balance no se probaron jugando.

## Alcance
**Incluye:** correr el prototipo, leer el código, probarlo en un celu y decidir.
**No incluye:** arreglar bugs (eso va a cada spec correspondiente).

## Criterios de aceptación
- [ ] Prototipo corrido en compu y en celu.
- [ ] Código revisado contra `AGENTS.md` (¿es legible? ¿se entiende?).
- [ ] Decisión tomada **con las 3** y anotada en `docs/DECISIONS.md`. Opciones:
  - **Usar como base**: se hace el primer commit y cada spec arranca desde su parte.
  - **Usar parcialmente**: se conserva lo que sirve (por ejemplo `core/` y la configuración) y se borra el resto.
  - **Descartar**: se borra el código y se arranca de cero respetando los specs.
- [ ] Si se usa: primer commit en `main` y repo subido a GitHub con las 3 como colaboradoras.

## Archivos
**Propios:** todo el código (solo durante esta revisión).

## Dependencias
**Depende de:** nada. **Bloquea a:** 03, 04, 05, 06, 07, 11, 13 (saber si arrancan de cero o no).

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
