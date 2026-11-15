# 21 — La consola de destinos se ve "adelantada" a las paredes 🧱

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | C (imágenes) | _(a definir)_ | _(a definir)_ | ⚪ Propuesto |

## Problema
En la consola de destinos (`MonitorScene`, imagen `public/assets/sprites/cabina/consola-fondo.png`), el tablero **no se ve integrado a la cabina**:

- A los costados del tablero se ven las paredes y el pasillo de la nave que **siguen por detrás** del tablero, hasta los bordes de la imagen.
- Por eso el tablero parece una **caja apoyada adelante de las paredes**, en vez de estar empotrado: las paredes deberían **terminar alrededor del tablero**.
- El problema está en las dos franjas de los costados, entre el borde del tablero y el borde de la pantalla (y el piso debajo del estante).

Lo que ya se probó y no funcionó:
- Un fondo de cabina con zoom detrás del tablero recortado: se veía el crédito enorme y se cortaban la pantallita de ruta y el botón ATERRIZAR.
- Una versión con asientos a los costados: los asientos quedaban delante del tablero.
- La versión actual (paredes a los costados): sigue viéndose adelantado.
- Dos pedidos a Gemini para que las paredes terminen alrededor del tablero, el segundo con las zonas marcadas en rojo. El primero devolvió lo mismo y el segundo no llegó a revisarse.

> Por ahora este spec **solo describe el problema**. La solución se define después, cuando el equipo lo revise.

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
