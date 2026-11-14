# Registro de decisiones

Toda decisión que afecte el trabajo de otra persona (ver `AGENTS.md` §1.3) se anota acá. Las más nuevas arriba.

Formato:

```
## AAAA-MM-DD — Título corto
- Quién: …
- Qué se decidió: …
- Por qué: …
- A quién afecta: (specs / personas / archivos)
- ¿Avisado al equipo?: sí / no
```

---

## 2026-11-14 — La base se arma por capas (fondo vacío + sprites de estado)
- Quién: dueña del spec 01 (decidido al producir el kit de imágenes)
- Qué se decidió: el mapa isométrico de la base es un fondo vacío (`public/assets/sprites/fondos/mapa-base.jpeg`) y el estado de cada sala se dibuja encima con sprites (`public/assets/sprites/mapa/`): plantas sanas/sedientas/secas, máquina de oxígeno funcionando/rota, paneles limpios/sucios. Las salas por dentro también son fondos vacíos + sprites. Las salas por dentro son el original y el mapa se adaptó a ellas. Se descartó pasar a 3D.
- Por qué: así lo que pasa en el juego se ve también en el mapa (si las plantas se marchitan, se marchitan en el mapa), sin generar una imagen por cada combinación de estados.
- A quién afecta: spec 04 (la escena del mapa tiene que ubicar los sprites de estado sobre el fondo), specs 07–10 (fondos de sala + sprites).
- ¿Avisado al equipo?: no todavía — avisar a quien hace el spec 04.

## 2026-11-14 — Estilo visual ganador: pixel art retro 16 bits con tecnología actual, vista isométrica
- Quién: el equipo (votación del spec 01, etapa 1)
- Qué se decidió:
  - Gana la propuesta "retro 16 bits": el **dibujo** es retro (pixel art de consola de 16 bits), pero los **objetos** son actuales (pantallas planas, botones táctiles, luces LED; nada de tubos, agujas ni palancas). Sin logos de la NASA en ningún lado.
  - La base se ve en **vista isométrica** (no cenital como recomendaba el spec 01).
  - Regla de color: el naranja y el óxido quedan para Marte (suelo, cielo, exterior). Botones, luces, pantallas y detalles tecnológicos van en celeste `#5ec8e5`, blanco y grafito. La paleta no cambia, solo dónde se usa cada color.
  - Cambios pedidos sobre la propuesta: la base en corte y el invernadero se rehacen a partir de la base exterior para que coincidan; el marco de fotos NASA lleva más detalle.
- Por qué: es la propuesta que más gustó; la tecnología actual muestra que la exploración de Marte es de hoy.
- A quién afecta: spec 04 (mapa de la base: pasa a isométrico), spec 01 etapas 2 y 3, `docs/STYLE_GUIDE.md`, y todas las escenas que dibujen la base.
- ¿Avisado al equipo?: sí (votación).

## 2026-11-14 — Segunda tanda de PRs: specs 13, 12, 14, 15 y 16 (más 03 y 17 aparte)
- Quién: C, con Claude
- Qué se decidió: seguir la cadena del front con un PR por spec: 13 → 12 → 14 → 15 → 16, encima del PR del spec 10. El 03 (tests del núcleo) y el 17 (deploy) van aparte, contra `main`.
- Cambios a contratos (solo agregan, nada se renombra ni se borra):
  - `src/core/types.ts`: estado de eventos (14), del rover (15) y de la palanca/reunión (16) dentro de `RunState`.
  - `src/core/actions.ts`: acciones nuevas `startExpedition` / `completeExpedition` (15) y `holdLever` / `castVote` (16).
  - `data/events.json`: se mantiene el formato que ya existía; solo se completa el contenido (13).
  - `src/services/progressStorage.ts`: campo nuevo `celebratedUnlocks` (12).
  - `src/main.ts`, `src/scenes/sceneKeys.ts`, `src/ui/layout.ts`: escenas y medidas nuevas.
  - `MinigameScene.ts`: el dato del final rota entre 3 (13).
- Por qué: tener el juego completo para probar y que cada dueña revise su parte.
- A quién afecta: A (14, 16, contratos del núcleo), B (15, `MinigameScene`), C (12, 13, 17). Cada una aprueba o pide cambios en su PR.
- ¿Avisado al equipo?: sí, con los PRs.

## 2026-11-14 — Front propuesto en PRs encadenados (specs 02, 11, 06, 04, 05, 07–10)
- Quién: C, con Claude
- Qué se decidió: proponer un front jugable de punta a punta (Inicio → Base → 4 minijuegos → Resultado), dividido en **un PR por spec**, encadenados en este orden: 02 → 11 → 06 → 04 → 05 → 07 → 08 → 09 → 10. Todo se dibuja con formas y colores de la paleta (sin imágenes), listo para reemplazar por los sprites del spec 01. Línea estética propuesta: **pixel art retro, pero con tecnología actual** (paneles oscuros con borde y LEDs cian, scanlines suaves). Pendiente de votación (spec 01).
- Por qué: tener algo jugable para testear ya (compu y celu) y que cada dueña revise y adopte su parte, en vez de empezar de cero.
- A quién afecta: A (02, 04, 05) y B (06–10) son las dueñas de esos specs: **cada una revisa y aprueba su PR**, o pide cambios. Crea los contratos `src/main.ts`, `src/scenes/sceneKeys.ts`, `src/ui/palette.ts`, `src/ui/layout.ts`, `src/minigames/MinigameScene.ts` y `src/minigames/registry.ts`. En `balance.ts` e `i18n/*.json` solo **agrega** valores.
- ¿Avisado al equipo?: sí, con los PRs.

## 2026-11-14 — Se conserva el back y se descarta el front del prototipo
- Quién: el equipo
- Qué se decidió: la lógica (`src/core`, `src/bots`, `src/config`, `src/services`, `src/i18n`, `data`, tests) queda como base. Toda la parte visual del prototipo se borró por no cumplir con la calidad estética buscada.
- Por qué: la lógica está testeada y sigue el GDD; la estética se define primero con el spec 01.
- A quién afecta: todas. El front se rehace desde el spec 02 (esqueleto) siguiendo `STYLE_GUIDE.md`. El prototipo visual queda en el commit `fb40014` solo como referencia técnica.
- ¿Avisado al equipo?: sí (este documento).

## 2026-11-14 — Nombre del proyecto: Astronaut Mission Trainer
- Quién: el equipo
- Qué se decidió: el juego y el repo se llaman **Astronaut Mission Trainer** (paquete `astronaut-mission-trainer`).
- Por qué: conecta directo con el track *Junior Astronaut Mission Trainer*.
- A quién afecta: todas (título del menú, título de la página, clave de guardado en el navegador).
- ¿Avisado al equipo?: sí (este documento).

## 2026-11-14 — Decisiones de la planificación inicial
- Quién: el equipo (planificación con Claude)
- Qué se decidió: web con Phaser 3 + TypeScript + Vite (no Godot); mobile first en horizontal; ES/EN; partidas de 5 soles (~5 min); 4 barras con la energía como moneda compartida; progresión por lugares de Marte con 3 estrellas; los bots reciben órdenes, tienen modo auto y aprenden de la jugadora; multijugador v0 con bots.
- Por qué: carga rápida en celu, multijugador web más simple a futuro, mejor colaboración en git y con agentes; partidas cortas para rejugar.
- A quién afecta: todas.
- ¿Avisado al equipo?: sí (este documento).
