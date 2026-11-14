# 13 — Contenido educativo e idiomas

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | C | P0 | 1 | ⚪ Propuesto |

## Objetivo
Que **todo dato que aparece en el juego sea real, verificado y con fuente**, esté escrito para chicos de 7 a 12 en **una sola línea**, y exista en español e inglés.

## Por qué importa
Es lo que hace educativo al juego y lo que el jurado de NASA va a mirar. Un dato inventado o mal citado nos resta puntos.

## Alcance
**Incluye:**
- **Datos de minijuegos**: 1 dato por minijuego (mejor 2–3 para rotar), una línea, ES/EN.
- **Eventos**: contenido de `data/events.json` — al menos 8 eventos reales (DONKI, RadLab, OSDR) con fecha, efecto y fuente. Formato acordado con A (spec 14).
- **Lugares**: frase "por qué es difícil" para cada uno de los 5.
- **Fotos reales**: buscar y descargar las fotos (lugares, Sol/tormentas, rovers), con crédito y licencia.
- **Pantalla de Fuentes**: lista de links (puede ser una escena simple o un HTML aparte).
- **Revisión de textos**: todos los textos del juego cortos y claros, en ambos idiomas.

**No incluye:** llamar APIs en vivo.

## Criterios de aceptación
- [ ] Cada dato tiene su fila en `docs/DATA_SOURCES.md` con fuente y ✅ verificado.
- [ ] Ningún texto en pantalla supera ~1 línea (salvo la pantalla de Fuentes).
- [ ] `es.json` y `en.json` tienen las mismas claves (hay un test).
- [ ] Lo leyó en voz alta alguien y lo entendería un chico de 7.

## Archivos
**Propios:** `src/i18n/*.json` (contenido), contenido de `data/events.json`, `public/assets/nasa/`, `docs/DATA_SOURCES.md`, escena de Fuentes.
**Contratos:** formato de `data/events.json` y `data/locations.json` (A). Otras personas pueden **agregar** claves a i18n; C revisa la redacción.

## Dependencias
**Depende de:** nada para empezar. **Bloquea a:** 14 (eventos), 12 y 15 (fotos).

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
