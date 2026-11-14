# 17 — Deploy y demo

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | C | P0 | 4 (configurar en fase 1) | ⚪ Propuesto |

## Objetivo
Que el jurado y cualquier persona puedan **jugar desde un link público en el celu**, y que la entrega del hackathon esté completa a tiempo.

## Por qué importa
Un juego que no se puede abrir no existe para el jurado.

## Alcance
**Incluye:**
- Publicación automática en cada push a `main` (GitHub Pages o Vercel). **Configurarlo temprano (fase 1)**, no al final.
- Verificar que el link funciona en Android y iPhone.
- QR del link para la presentación.
- Revisar los requisitos de entrega en la página oficial del challenge (video, descripción, uso de datos NASA, etc.) y hacer la checklist.
- Preparar el material de la demo (capturas, video corto de una partida).

## Criterios de aceptación
- [ ] Link público funcionando y actualizándose solo.
- [ ] Checklist de entrega del hackathon completa (anotada en este spec).
- [ ] Probado en ≥ 2 celus distintos.

## Archivos
**Propios:** `.github/workflows/*` (o config de Vercel), material de la entrega.
**Contratos:** `vite.config.ts` → avisar si se cambia.

## Dependencias
**Depende de:** 02 (repo en GitHub).

## Checklist de entrega
Armada con la [guía oficial de entrega de proyectos](https://www.spaceappschallenge.org/resources/project-submission-guide/) (versión 2025, la última publicada al 2026-11-14). **Confirmar contra la guía 2026 cuando salga**: los números pueden cambiar.

**Demo (obligatoria, se elige UNA opción):**
- [ ] Video de **máximo 30 segundos**, con **subtítulos en inglés**, que arranque presentando al equipo, **o**
- [ ] Presentación de diapositivas **en inglés** (la guía 2020 ponía un máximo de 7; confirmar el límite actual).
- [ ] La demo se sube a otra plataforma (YouTube, Drive, etc.) con **link público**: la web de Space Apps no acepta archivos.
- [ ] Imágenes claras y textos legibles.

**Proyecto:**
- [ ] Link público al juego funcionando (este spec) y link al repositorio.
- [ ] Descripción del proyecto y del uso de **datos de NASA** (ver `docs/DATA_SOURCES.md`).
- [ ] Lista de recursos y referencias usados (la pantalla de Fuentes del juego ya los lista).
- [ ] Revisar si la guía 2026 pide declarar el uso de herramientas de IA.

**Antes de entregar:**
- [ ] Probar el link en ≥ 2 celus (Android y iPhone), en horizontal.
- [ ] QR del link para la presentación.
- [ ] Capturas y un video corto de una partida para la demo.

## Estado del deploy (2026-11-14)
- En los PRs del repo aparece un check de **Vercel**: alguien del equipo ya conectó Vercel. Falta confirmar en el panel de Vercel que publica `main` y anotar acá el link público.
- **GitHub Pages** no es opción mientras el repo sea privado en una cuenta gratis (Pages en repos privados requiere un plan pago).
- `vite.config.ts` ya usa `base: './'`, así que el build funciona en cualquier hosting estático.
- El CI de GitHub Actions no arrancaba porque la cuenta dueña del repo está bloqueada por facturación. Se sacó `.github/workflows/ci.yml` hasta que soporte lo resuelva (ver `docs/DECISIONS.md`).

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
