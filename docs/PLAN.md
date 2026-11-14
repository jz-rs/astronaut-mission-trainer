# Plan de trabajo

Entrega: **mañana a la tarde**. Equipo: 3 programadoras con agentes de IA y generadores de imágenes.

## Roles

| Rol | Se ocupa de | Persona |
|---|---|---|
| **A — Motor** | Lógica del juego, base, movimiento, bots, eventos | _(completar)_ |
| **B — Minijuegos** | Contrato de minijuegos y cada minijuego | _(completar)_ |
| **C — Estética, contenido y pantallas** | Dirección de arte, set de imágenes, pantallas, mapa de Marte, textos, datos NASA, deploy | _(completar)_ |

Cada spec tiene **una sola dueña**. Se puede pedir ayuda, pero la responsable es una.

## Fases

### Fase 0 — Ponernos de acuerdo (≈ 1–2 h) 🟣
Objetivo: que las 3 estemos alineadas antes de producir.
- **Todas**: leer `GDD.md` + los specs, aprobar con ✅ o comentar.
- **C**: [01 Dirección de arte](specs/01-direccion-de-arte.md) — set de imágenes de referencia → **votamos el estilo entre las 3**.
- **A**: [02 Revisión del prototipo](specs/02-revision-prototipo.md) — decidir si el código existente se usa.
- **B**: [06 Contrato de minijuegos](specs/06-contrato-minijuegos.md) — fijar la interfaz para que A y B no se bloqueen.

**Salida de la fase 0**: estilo visual votado, código base decidido, interfaz de minijuegos fijada.

### Fase 1 — Juego mínimo jugable (P0) 🔴
El juego tiene que poder jugarse de punta a punta, aunque sea feo.

| A | B | C |
|---|---|---|
| 03 Núcleo de la partida | 07 Paneles solares | 11 Pantallas inicio/resultado + celu |
| 04 Base y movimiento | 08 Fábrica de oxígeno | 13 Contenido educativo e idiomas |
| 05 Tripulación y bots | 09 Invernadero | (producción de sprites del spec 01) |
| | 10 Muro de escudo | |

**Hito**: se juega una partida completa en el celu, en ES y EN.

### Fase 2 — Lo que nos diferencia (P1) 🟠
| A | B | C |
|---|---|---|
| 14 Eventos y avisos con retraso | 15 Expedición rover | 12 Mapa de Marte y progresión |

### Fase 3 — Colaboración (P2) 🟡
| A | B | C |
|---|---|---|
| 16 Palanca de a dos + reunión de crisis | Pulido de minijuegos | Sonido, animaciones |

### Fase 4 — Entrega 🏁
- **C**: [17 Deploy y demo](specs/17-deploy-y-demo.md).
- **Congelar el código ~3 h antes de la entrega.** Después de eso solo arreglos de bugs.
- Todas: probar en celus distintos, preparar el pitch.

## Prioridades si se nos acaba el tiempo
Se recorta de abajo hacia arriba: P2 → P1. **Nunca se recorta P0.**
Si un minijuego no llega, queda el minijuego provisorio (tocar 5 veces) en su sala.

## Puntos de sincronización
Cortos (10 min), las 3 juntas:
1. Al terminar la fase 0 (votación de estilo y contrato).
2. Al terminar la fase 1 (probar el juego entero).
3. Antes de congelar el código.

Además: cualquier aviso de "⚠️ decisión que afecta al equipo" se comparte en el chat del equipo apenas aparece.
