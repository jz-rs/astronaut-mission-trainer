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
_(completar con los requisitos de la página oficial)_
- [ ] …

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
