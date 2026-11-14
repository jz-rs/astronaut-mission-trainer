# 14 — Eventos y avisos con retraso

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | A | P1 | 2 | ⚪ Propuesto |

## Objetivo
Que Marte "ataque" la base con eventos basados en datos reales, y que **la demora de las comunicaciones con la Tierra** haga que a veces te puedas preparar y a veces no.

## Por qué importa
- Hace que cada partida sea distinta (rejugabilidad).
- Enseña algo real y poco conocido: la señal Tierra–Marte tarda entre 4 y 24 minutos.
- Muestra causa → efecto: "tu escudo estaba bajo cuando llegó la tormenta".

## Alcance
**Incluye:**
- Cada lugar tiene su mazo de eventos (`data/events.json`); por partida salen 2–3 al azar.
- Tipos: tormenta solar (☢️), tormenta de polvo (⚡), falla de equipo, y al menos 1 evento bueno.
- **Aviso**: algunos eventos avisan 1 sol antes ("📡 Mensaje de la Tierra"), otros llegan sin aviso.
- El aviso y el evento se muestran con ícono grande + una línea de texto + animación (sacudón, flash).
- En la pantalla de resultado, mencionar el evento que más daño hizo.

**No incluye:** reunión de crisis y palanca (16), llamadas a APIs en vivo.

## Criterios de aceptación
- [ ] La lógica de eventos está en `src/core/` con tests (sorteo, aviso, efecto).
- [ ] Al menos 8 eventos en `data/events.json` con fuente real (coordinado con C, spec 13).
- [ ] Un chico entiende qué pasó sin leer más de una línea.
- [ ] Dos partidas en el mismo lugar tienen eventos distintos.

## Archivos
**Propios:** `src/core/events*.ts`, la parte de eventos en `src/scenes/base/`.
**Contratos:** **define el formato de `data/events.json`** (C escribe el contenido: acordar el formato con C antes de empezar).

## Dependencias
**Depende de:** 03, 04, 13. **Bloquea a:** 16.

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
