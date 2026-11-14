# 06 — Contrato de minijuegos

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | B | P0 | 0 | ⚪ Propuesto |

## Objetivo
Fijar **cómo se conecta un minijuego con el resto del juego**, para que B pueda hacer minijuegos y A la base **en paralelo, sin bloquearse ni pisarse**.

## Por qué importa
Es el punto de contacto entre dos personas. Si cambia a mitad de camino, se rompe el trabajo de las dos. Por eso se fija en la fase 0.

## Alcance
El contrato define:
- **Entrada**: qué recibe un minijuego al abrirse (como mínimo, qué tarea es; opcional: dificultad del lugar).
- **Salida**: qué devuelve al terminar → `{ taskId, performance }`, con `performance` de 0 a 1.2 (1 = bien, > 1.1 = perfecto).
- **Lo que hace la clase base por todos los minijuegos** (para que cada uno sea solo su jueguito):
  - Panel encima de la base, con el fondo oscurecido.
  - Instrucción de **una línea** arriba + barra de tiempo (~12 s).
  - Al terminar: mensaje "¡PERFECTO!" / "¡Bien hecho!" / "¡Casi!" + **dato real de una línea**.
  - Avisar a la base y cerrarse.
- **Registro**: dónde se dice qué minijuego corresponde a cada sala.
- **Minijuego provisorio** ("tocá 5 veces") para las salas que todavía no tienen el suyo, así el juego entero se puede jugar desde el principio.
- **Plantilla/ejemplo** de cómo se escribe un minijuego nuevo.

## Criterios de aceptación
- [ ] El contrato está documentado al principio de `src/minigames/MinigameScene.ts` (qué implementar, qué no tocar).
- [ ] A y B lo revisaron juntas y están de acuerdo (anotado en `DECISIONS.md`).
- [ ] Hacer un minijuego nuevo requiere tocar **solo** su carpeta + 1 línea en `registry.ts`.
- [ ] Las 4 salas abren algo (real o provisorio).

## Archivos
**Propios / contrato que define:** `src/minigames/MinigameScene.ts`, `src/minigames/registry.ts`, `src/minigames/placeholder/`.
⚠️ Una vez aprobado, **cualquier cambio se avisa a A**.

## Dependencias
**Depende de:** 02. **Bloquea a:** 04, 07, 08, 09, 10, 15.

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
