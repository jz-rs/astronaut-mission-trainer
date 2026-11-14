# 01 — Dirección de arte y set de imágenes

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | C | P0 | 0 → 1 | ⚪ Propuesto |

## Objetivo
Que las 3 nos pongamos de acuerdo en **cómo se ve el juego** antes de producir, y que después cualquiera pueda generar imágenes nuevas que se vean del mismo estilo.

## Por qué importa
- La estética es lo primero que ve el jurado y lo que engancha a los chicos.
- Las 3 vamos a generar imágenes con IA: sin reglas claras, cada una saca un estilo distinto.
- La mezcla **pixel art + fotos reales de NASA** es nuestro diferencial.

## Alcance

### Etapa 1 — Propuestas de estilo (fase 0, ~1 h)
Generar **3 propuestas de estilo distintas** (por ejemplo: pixel art 16 bits colorido / pixel art estilo Among Us más redondeado / pixel art más "retro NASA"). Cada propuesta incluye las mismas 4 piezas, para poder compararlas:
1. Un astronauta (de frente).
2. Una sala de la base por dentro (ej.: invernadero).
3. La vista general de la base desde arriba.
4. **Prueba de mezcla**: una ventana o monitor pixel art mostrando una **foto real de NASA** (ej.: el cráter Gale desde Curiosity).

→ **Votación entre las 3.** Gana una propuesta (o una combinación explícita).

### Etapa 2 — Guía de estilo (fase 0)
Completar `docs/STYLE_GUIDE.md` con lo que ganó: paleta final, tamaños (tile, astronauta), tipografía, **plantilla de prompt** que funcionó, y herramienta para ajustar las imágenes a la paleta.

### Etapa 3 — Set de imágenes del juego (fase 1)
| Asset | Detalle | Prioridad |
|---|---|---|
| Astronauta | 4 colores (violeta jugadora, rojo, verde, amarillo). Quieto + caminando (2–4 frames) | P0 |
| Mapa de la base | Vista cenital con 4 salas + pasillo central | P0 |
| Íconos de las 4 barras | 💨 🥬 ☢️ ⚡ en pixel art | P0 |
| Fondo del menú | Marte + título | P0 |
| Botón | Normal y apretado | P0 |
| Elementos de minijuegos | Lo que pida cada spec de minijuego (07–10), coordinado con B | P0 |
| Marco para fotos NASA | Ventana / monitor reutilizable | P1 |
| Rover | Vista lateral o cenital | P1 |
| Mapa de Marte | Para el spec 12 | P1 |
| Estrellas | Ganada / vacía | P1 |

**No incluye:** animaciones complejas, sonido, programar escenas (solo entregar imágenes).

## Criterios de aceptación
- [ ] 3 propuestas generadas con las 4 piezas cada una, guardadas en `public/assets/reference/propuesta-1|2|3/`.
- [ ] Votación hecha; resultado anotado en `docs/DECISIONS.md`.
- [ ] `docs/STYLE_GUIDE.md` sin ningún 🔲 pendiente.
- [ ] La plantilla de prompt está escrita y probada: otra integrante la usa y obtiene algo del mismo estilo.
- [ ] Assets P0 del set en `public/assets/sprites/` y `public/assets/tiles/`, con fondo transparente y ajustados a la paleta.
- [ ] Las fotos reales usadas están registradas en `docs/DATA_SOURCES.md` con crédito y licencia.
- [ ] Se ven bien en un celu real (no solo en la compu).

## Archivos
**Propios:** `public/assets/**`, `docs/STYLE_GUIDE.md`.
**Contratos que usa:** `src/ui/palette.ts` — si la paleta final cambia, **avisar** (afecta a todas) y actualizar el archivo junto con A.

## Dependencias
**Depende de:** nada — es lo primero.
**Bloquea a:** reemplazo de placeholders en 04, 07–10, 11, 12.
*(Nadie se bloquea mientras tanto: se programa con rectángulos de color y se reemplazan después.)*

## Preguntas abiertas
- ¿Vista cenital (como Among Us) o lateral para la base? Recomendado: cenital.
- ~~¿Nombre definitivo del juego?~~ Decidido: **Astronaut Mission Trainer**.

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
