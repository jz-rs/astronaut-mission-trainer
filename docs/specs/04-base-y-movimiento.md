# 04 — Base y movimiento

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | A | P0 | 1 | ⚪ Propuesto |

## Objetivo
Que la jugadora vea la base de Marte con sus 4 salas, **toque una sala y su astronauta camine hasta ahí y se abra el minijuego**, sin que nadie le explique nada.

## Por qué importa
Es la sensación "Among Us": moverte por la base y hacer tareas. Y es la primera pantalla de juego: si no se entiende, perdemos al jugador.

## Alcance
**Incluye:**
- Mapa de la base con 4 salas + pasillo central (primero rectángulos, después el arte del spec 01).
- HUD superior: 4 barras con ícono y color + "Sol N/5". Una barra baja titila en rojo.
- **La sala cuya barra está baja titila**, para saber adónde ir sin leer.
- Tocar sala → la astronauta camina → al llegar se abre el minijuego encima. **La base sigue corriendo** (el tiempo apremia).
- Al cerrar el minijuego, su resultado se manda al núcleo.
- Al terminar la partida → pantalla de resultado.
- Mientras se juega un minijuego, no se pueden tocar salas.

**No incluye:** órdenes a bots (05), eventos (14), arte final (01).

## Criterios de aceptación
- [ ] Una persona que nunca vio el juego sabe qué tocar en < 5 segundos (probarlo con alguien).
- [ ] Tocar cualquiera de las 4 salas lleva a la astronauta y abre el minijuego correcto.
- [ ] Las salas con barra < 30 titilan.
- [ ] Funciona con el dedo en un celu en horizontal (áreas táctiles ≥ 48 px).
- [ ] La escena no calcula reglas del juego: solo lee el estado y manda acciones.

## Archivos
**Propios:** `src/scenes/base/*`.
**Contratos que usa:** `GameSession`, `MinigameScene` / `registry.ts` (06), `palette.ts`, `i18n`.

## Dependencias
**Depende de:** 03, 06. **Bloquea a:** 05 (visual de bots), 14, 16.

## Preguntas abiertas
- ¿Movimiento solo tocando salas, o también joystick/arrastrar? Propuesta: solo tocar salas (más simple para 7 años).

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
