# 12 — Mapa de Marte y progresión

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | C | P1 | 2 | ⚪ Propuesto |

## Objetivo
Un **mapa de Marte con 5 lugares reales** donde aterrizar, con estrellas y candados, para que la jugadora **siempre tenga un próximo objetivo** y ganas de volver.

## Por qué importa
Es el gancho de rejugabilidad (junto con el entrenamiento de bots). Y enseña geografía real de Marte: cada lugar es difícil por una razón científica.

## Alcance
**Incluye:**
- Pantalla con Marte (imagen real de Mars Trek enmarcada, o pixel art basado en ella) y 5 puntos: Jezero, Gale, Olympus Mons, casquete polar, Valles Marineris.
- Cada lugar muestra: nombre, estrellas conseguidas (0–3), récord, o 🔒 con las estrellas que faltan.
- Tocar un lugar → tarjeta breve: foto real + **por qué es difícil** (una línea) + **los 3 objetivos con íconos** + botón ATERRIZAR.
- Datos de cada lugar en `data/locations.json` (dificultad, objetivo de muestras, desafío, estrellas para desbloquear).

**No incluye:** más de 5 lugares, trajes/figuritas (P2).

## Criterios de aceptación
- [ ] La primera vez solo Jezero está abierto y es obvio que hay que tocarlo.
- [ ] Desbloquear un lugar tiene una animación/festejo.
- [ ] Las fotos usadas están en `DATA_SOURCES.md`.
- [ ] El inicio (11) lleva al mapa, y "🗺️ Mapa" en resultado vuelve acá.

## Archivos
**Propios:** `src/scenes/MarsMapScene.ts` (nuevo), contenido de `data/locations.json`.
**Contratos:** el **formato** de `data/locations.json` es de A (03) → si hace falta un campo nuevo, **avisar a A**.

## Dependencias
**Depende de:** 01, 03, 11.

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
