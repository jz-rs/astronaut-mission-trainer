# 16 — Palanca de a dos y reunión de crisis

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | A | P2 | 3 | ⚪ Propuesto |

## Objetivo
Dos momentos donde **la tripulación tiene que actuar junta**, como las emergencias y las reuniones de Among Us.

## Por qué importa
Lo social es el gancho de Among Us. Aunque en la v0 sean bots, deja la mecánica lista para cuando haya personas reales, y se puede mostrar en el pitch.

## Alcance
**Palanca de a dos** (con tormenta solar):
- Aparece una emergencia en la sala de escudo. Hacen falta 2 astronautas manteniendo apretado a la vez ~3 s.
- La jugadora va y aprieta; un bot (o el más cercano) va y aprieta el otro.
- Si se logra: el escudo aguanta. Si no: daño grande.

**Reunión de crisis** (al llegar un aviso del spec 14):
- Pantalla con 2 opciones grandes con íconos (ej.: "⚡ limpiar paneles" vs "☢️ subir escudo"), 10 s para votar.
- Los bots votan (con alguna lógica simple). Gana la mayoría → los bots en auto priorizan esa tarea durante el sol.

**No incluye:** multijugador online, chat.

## Criterios de aceptación
- [ ] Ambas mecánicas se entienden sin texto largo.
- [ ] Los bots participan usando `GameAction` (votar y apretar son acciones).
- [ ] Se pueden desactivar desde `balance.ts` si no llegan pulidas.

## Archivos
**Propios:** nuevos archivos en `src/core/` y `src/scenes/` para estas mecánicas.
**Contratos:** agrega tipos nuevos a `GameAction` → **avisar a B** (puede afectar minijuegos).

## Dependencias
**Depende de:** 05, 14.

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
