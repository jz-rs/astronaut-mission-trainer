# Specs — tareas del proyecto

Cada spec es **una tarea individual con una sola dueña**. Dice **qué hay que lograr** (objetivo y criterios de aceptación), no necesariamente cómo.

## Cómo se usan
1. **Leer** los specs (los propios y los ajenos que dependen de los tuyos).
2. **Aprobar**: en la sección "Aprobación" de cada spec, cada una marca su ✅. Si no estás de acuerdo, comentalo en el chat del equipo **antes** de que se empiece.
3. **Empezar** solo cuando el spec está aprobado por las 3. Cambiar el estado a 🔵 En curso.
4. **Terminar**: todos los criterios de aceptación tildados + `npm run check` pasa + PR revisado → ✅ Hecho.
5. **Cambiar un spec** ya aprobado: se avisa al equipo y se anota en `docs/DECISIONS.md`.

Para trabajar con tu agente: *"Leé AGENTS.md y docs/specs/NN-xxx.md y trabajá ese spec."*

## Estados
⚪ Propuesto · 🟢 Aprobado · 🔵 En curso · ✅ Hecho · ⏸️ Recortado

## Índice

| # | Spec | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|---|
| 01 | [Dirección de arte y set de imágenes](01-direccion-de-arte.md) | C | P0 | 0 | ⚪ |
| 02 | [Base técnica: lógica + esqueleto del front](02-base-tecnica.md) | A | P0 | 0 | ⚪ |
| 03 | [Núcleo de la partida](03-nucleo-partida.md) | A | P0 | 1 | ⚪ |
| 04 | [Base y movimiento](04-base-y-movimiento.md) | A | P0 | 1 | ⚪ |
| 05 | [Tripulación y bots](05-tripulacion-bots.md) | A | P0 | 1 | ⚪ |
| 06 | [Contrato de minijuegos](06-contrato-minijuegos.md) | B | P0 | 0 | ⚪ |
| 07 | [Minijuego: paneles solares](07-minijuego-paneles.md) | B | P0 | 1 | ⚪ |
| 08 | [Minijuego: fábrica de oxígeno](08-minijuego-oxigeno.md) | B | P0 | 1 | ⚪ |
| 09 | [Minijuego: invernadero](09-minijuego-invernadero.md) | B | P0 | 1 | ⚪ |
| 10 | [Minijuego: muro de escudo](10-minijuego-escudo.md) | B | P0 | 1 | ⚪ |
| 11 | [Pantallas de inicio y resultado + celu](11-pantallas-inicio-resultado.md) | C | P0 | 1 | ⚪ |
| 12 | [Mapa de Marte y progresión](12-mapa-marte-progresion.md) | C | P1 | 2 | ⚪ |
| 13 | [Contenido educativo e idiomas](13-contenido-educativo-idiomas.md) | C | P0 | 1 | ⚪ |
| 14 | [Eventos y avisos con retraso](14-eventos-avisos.md) | A | P1 | 2 | ⚪ |
| 15 | [Expedición con el rover](15-expedicion-rover.md) | B | P1 | 2 | ⚪ |
| 16 | [Palanca de a dos y reunión de crisis](16-colaboracion.md) | A | P2 | 3 | ⚪ |
| 17 | [Deploy y demo](17-deploy-y-demo.md) | C | P0 | 4 | ⚪ |
| 18 | [Paneles solares afuera, bajo el cielo de Marte](18-paneles-afuera.md) | B + C | P1 | 2 | ⚪ |
| 19 | [Intro, cabina y manual de misión](19-intro-cabina-manual.md) | C | P0 | Planificación | ⚪ |
| 20 | [Cambiar de idioma dentro del juego](20-cambiar-idioma-en-el-juego.md) | C | _(a definir)_ | _(a definir)_ | ⚪ |

## Plantilla para specs nuevos

```markdown
# NN — Título

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | A/B/C | P0/P1/P2 | 0–4 | ⚪ Propuesto |

## Objetivo
Qué tiene que lograrse, en 1–3 frases, desde el punto de vista de quien juega.

## Por qué importa
Qué parte del GDD / del track cumple.

## Alcance
**Incluye:** …
**No incluye:** …

## Criterios de aceptación
- [ ] …

## Archivos
**Propios (los puede modificar):** …
**Contratos que usa (no modificar sin avisar):** …

## Dependencias
**Depende de:** … · **Bloquea a:** …

## Preguntas abiertas
- …

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
```
