# 11 — Pantallas de inicio y resultado + experiencia en celu

> Actualización de planificación: el [spec 18](18-intro-cabina-manual.md) documenta la intro, el manual inicial y la selección de destino dentro de la nave. Ver allí los cambios aprobados de recorrido y los detalles pendientes.

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | C | P0 | 1 | ⚪ Propuesto |

## Objetivo
Que alguien abra el link en el celu y **esté jugando en menos de 10 segundos sin leer nada**, y que al terminar **quiera volver a jugar**.

## Por qué importa
Es justo donde fallan los otros proyectos del track: mucho texto y curva de aprendizaje al entrar. La primera impresión decide si el chico se queda.

## Alcance
**Pantalla de inicio:**
- Título + fondo de Marte (arte del 01).
- **Un solo botón gigante JUGAR.**
- Selector de idioma ES / EN (banderas o siglas), se recuerda entre visitas.
- Link chico a "Fuentes" (spec 13).

**Celu:**
- Al tocar JUGAR: pedir pantalla completa y bloquear horizontal (donde el navegador lo permita).
- Botón de pantalla completa a media altura del borde izquierdo, para volver si se sale (Android y compañía). Solo se ve si el navegador lo soporta y no estás ya en pantalla completa ni con la app instalada.
- iPhone no permite pantalla completa en ningún navegador (ni Safari ni Chrome): en la pantalla de inicio se muestra "📲 Pantalla completa: Compartir → Agregar a inicio", con ✕ para cerrarlo. No aparece si el juego ya se abrió desde la pantalla de inicio.
- Instalable: `public/manifest.webmanifest` + íconos en `public/assets/icons/` (astronauta violeta), para que desde la pantalla de inicio se abra como app, sin barras.
- Si el celu está vertical: pantalla "📱↻ Girá el celu" (necesario en iPhone, que no permite bloquear).
- Sin zoom ni scroll accidental.

**Pantalla de resultado:**
- Primero las **3 estrellas** (ganadas/vacías), grandes y animadas.
- "¡La base sobrevivió!" / "La tripulación tuvo que evacuar".
- Puntaje + "¡Nuevo récord!" si corresponde.
- **Por qué perdiste una estrella**, en una línea (ej. "La energía bajó del 20% en el sol 3").
- Dato real de una línea.
- Botones: 🔁 Reintentar (grande) y 🗺️ Mapa.

## Criterios de aceptación
- [ ] Probado en al menos 1 Android y 1 iPhone, en horizontal.
- [ ] Desde que abre el link hasta que juega: ≤ 2 toques.
- [ ] En la pantalla de resultado, el botón Reintentar es lo más visible.
- [ ] Todo texto viene de `i18n`; cambiar idioma cambia todo.

## Archivos
**Propios:** `src/scenes/MenuScene.ts`, `src/scenes/ResultScene.ts`, `src/ui/screen.ts`, `src/ui/Button.ts`, `index.html`, `public/manifest.webmanifest`, `public/assets/icons/`.
**Contratos que usa:** `RunResult` (03), `palette.ts`, `i18n`.

## Dependencias
**Depende de:** 01 (arte), 03 (resultado). **Bloquea a:** 12 (el botón Mapa).

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
