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

## 2026-11-14 — Minijuegos más claros, rover que explica y balance para chicos que recién aprenden
- Quién: C, con Claude (pedido de memocayar)
- Qué se decidió:
  - **Mano 👆 que muestra el gesto** al empezar cada minijuego (arrastrar, tocar o deslizar); desaparece con el primer toque (`minigames/gestureHint.ts`).
  - **Tocar también sirve**: en el muro, tocar un hueco (o un bloque) lo tapa; en el oxígeno, tocar una burbuja de CO₂ la manda a MOXIE. Arrastrar sigue funcionando.
  - **Rover**: el cartel dice "Rover -20⚡", se apaga si no alcanza la energía, y si estás ocupada avisa "¡Primero terminá tu tarea!". El viaje cuesta 20 ⚡ (antes 25).
  - **Balance**: el desgaste por sol pasa de 60/45/50/25 a 45/35/40/22 (oxígeno/comida/escudo/energía). Los criterios T5 del ROADMAP quedan como tests (`tests/balance.test.ts`).
- Por qué: al probarlo, el muro no se entendía (había que arrastrar justo), el rover parecía no responder y la partida era imposible de ganar. Simulando con la lógica real, una jugadora que saca "¡Casi!" ganaba 4 de 30 partidas en Jezero; ahora las gana todas, con bots solos se sigue perdiendo, y Gale es más difícil.
- A quién afecta: A (spec 04 `BaseScene`/`GarageView`, `layout.ts` `GARAGE_RECT`), B (specs 08, 09, 10, 15), todas (`balance.ts`).
- ¿Avisado al equipo?: sí (pedido en el chat).

## 2026-11-14 — Primer sol guiado y efectos visibles de cada decisión
- Quién: C, con Claude (aprobado por el equipo)
- Qué se decidió:
  - **Sol 1 guiado** (`scenes/base/TutorialGuide.ts`): tarjeta "¡Estás al mando de la base!" con las 4 barras y la meta → flecha "¡Tocá esta sala!" (la base espera quieta hasta el primer toque) → flecha a la barra que subió → flecha a los bots. Se muestra hasta completarlo una vez (`tutorialDone` en el progreso guardado).
  - **Cada tarea muestra su efecto**: "+30" vuela desde la sala a su barra y "−10 ⚡" a la energía, para tareas de la jugadora y de los bots (`TaskEffectsView.ts`). El núcleo registra cada tarea terminada en `RunState.taskNews`; `applyTaskResult` ahora devuelve lo que cambió.
  - **El dato del minijuego queda en pantalla** hasta tocar SEGUIR (máximo 12 s, porque la base sigue corriendo), con letra más grande (`minigames/resultCard.ts`). La primera vez de cada minijuego muestra el "por qué" (`task.*.why`), que conecta lo que hiciste con la ciencia; después rotan los 3 datos. Se reemplaza `resultDisplayMs` por `factMinDisplayMs` / `factMaxDisplayMs`.
  - **La reunión de crisis dice qué crisis viene** (`collab.meetingWhy` reemplaza a `collab.meetingTitle`).
  - **"VOS" sobre la astronauta de la jugadora.** Los bots en AUTO no se pueden tocar, así que tocar su sala manda a la jugadora. Tocar la carita de un bot lo pasa a MANUAL y ya pregunta "¿A qué sala va?".
  - El desafío del lugar se lee "💨 nunca menos de 30" en vez de "siempre ≥ 30".
- Por qué: al probarlo, después de JUGAR no se entendía qué hacer ni se notaba qué se aprendía. El pedido central del track es que se vea que cada decisión cambia las variables.
- A quién afecta: A (specs 03, 04, 05, 16: `types.ts`, `stats.ts`, `actions.ts`, `run.ts`, `BaseScene`, `BotsView`, `MeetingView`), B (spec 06: `MinigameScene.ts`, el resultado pasa a `resultCard.ts`), C (specs 12, 13: textos, `progressStorage.ts`).
- ¿Avisado al equipo?: sí (aprobado en el chat).

## 2026-11-14 — Botón de pantalla completa, aviso para iPhone y juego instalable
- Quién: con Claude, a pedido de quien probó el juego en un iPhone con Chrome
- Qué se decidió:
  - Antes, la pantalla completa se pedía solo al tocar JUGAR. Si la jugadora salía, no podía volver. Ahora hay un **botón fijo a media altura del borde izquierdo** (HTML encima del juego, en `index.html` y `src/ui/screen.ts`). Es el único lugar libre en todas las pantallas: arriba están el HUD y las caras de los bots, abajo los botones, y las salas de la Base arrancan en x=72. En celus más anchos que 16:9 cae en la franja negra del costado. Se ve solo en celu, si el navegador lo soporta y si no estás ya en pantalla completa ni con la app instalada.
  - **iPhone no permite pantalla completa en ningún navegador** (Chrome en iPhone usa el motor de Safari). Por eso la pantalla de inicio muestra "📲 Pantalla completa: Compartir → Agregar a inicio", con ✕. No aparece si se abrió desde la pantalla de inicio.
  - **Juego instalable**: `public/manifest.webmanifest` (fullscreen, horizontal) y la carpeta nueva `public/assets/icons/` con el astronauta violeta sobre `night`. Desde la pantalla de inicio se abre como app, sin barras.
  - Excepción a "colores solo en `palette.ts`": el manifest es un JSON estático y repite `night` (`#1a1423`). Si cambia la paleta, hay que cambiarlo ahí y regenerar los íconos.
  - `MenuScene` conecta los controles (`setUpPhoneControls`) para no tocar `main.ts`.
- Por qué: en el celu se perdía la pantalla completa y en iPhone nunca funcionaba.
- A quién afecta: spec 11 (dueña de estos archivos), spec 04 (borde izquierdo de la Base, mientras no hay pantalla completa), spec 01 (íconos de la app), spec 17 (el deploy ahora publica el manifest).
- ¿Avisado al equipo?: sí (PR #23).

## 2026-11-14 — Se saca la action de CI hasta resolver la facturación
- Quién: C (dueña del repo)
- Qué se decidió: se borra `.github/workflows/ci.yml`. GitHub no arranca ningún job porque la cuenta dueña del repo está bloqueada por un problema de facturación, y cada PR quedaba con el check en rojo.
- Por qué: el check fallaba siempre sin correr nada, así que no protegía y confundía.
- Mientras tanto: antes de abrir o aprobar un PR, correr `npm run check` (lint + tipos + tests) en la compu, como ya pide `AGENTS.md` §2.
- Para volver: cuando soporte desbloquee la cuenta, restaurar el archivo desde el historial (`git show 9ab1fad:.github/workflows/ci.yml`).
- A quién afecta: todas (spec 02 era la dueña del archivo; spec 17 lo mencionaba).
- ¿Avisado al equipo?: sí (este documento, PR #21).

## 2026-11-14 — El juego usa el kit de imágenes en vez de los dibujos provisorios
- Quién: C, con Claude (aprobado por el equipo)
- Qué se decidió:
  - Escena nueva `BootScene` (primera en `main.ts`, clave `boot` en `sceneKeys.ts`) que carga todo el kit con una barra de progreso. La lista de imágenes vive en `src/ui/sprites.ts` y los astronautas en `src/ui/astronautFrames.ts` (con animación de caminar). Se borró `src/ui/astronautTexture.ts`.
  - Se cambió por sprites: astronautas (base y menú; de espaldas al subir, espejados a la izquierda), íconos de las barras (HUD, salas, consigna de minijuegos), sol del HUD, fondo del menú, estrellas (resultado y mapa de Marte), marco de fotos NASA (se usa solo el monitor del marco), y los 4 minijuegos + el rover con su sala de fondo y sus objetos.
  - `ASTRONAUT_SCALE` pasa de 2 a 0,5 (regla 2× del kit). `STAT_ICONS` (emojis) queda solo para íconos dentro de una línea de texto.
  - Paneles solares: el polvo ahora son cuadraditos recortados del panel sucio encima del panel limpio (misma mecánica de raspadita).
  - Muro del escudo: los paneles del muro pasan a ser cuadrados (40 × 40).
  - La base pasa a la vista isométrica: fondo `mapa-base.png`, salas con zona táctil y cartel (ícono + nombre, titila en rojo con la barra baja), recorridos puerta → centro del pasillo en cruz → puerta, astronautas parados sobre sus pies. Las medidas están en `ROOM_LAYOUTS` (`layout.ts`); se borraron `CORRIDOR`, `ROOM_RECTS` y `roomFurniture.ts`.
  - Sprites de estado en el mapa (`MapStatusSprites`): lechugas sanas/sedientas/secas según la comida, MOXIE rota con oxígeno bajo y paneles con polvo con energía baja. Umbral nuevo `ALERT_BALANCE.worriedStatThreshold` (55).
  - El garaje del rover queda afuera de la esclusa del pasillo.
- Por qué: el kit ya estaba en `main` y el juego no lo usaba.
- A quién afecta: A (specs 02, 04, 05: la base entera; esto reemplaza el PR aparte del spec 04 que estaba pendiente), B (06–10, 15: `MinigameScene.ts` dibuja la sala de fondo), C (11, 12).
- Pendiente: sin usar todavía: botones (`boton*.png`, son solo celestes), `emblema-escudo`, `nube-polvo`, `rayo-energia`, `rocas-chicas`, `mapa-lechuga-brote`, `tiles/suelo-marte.png`. El hábitat del minijuego del escudo sigue dibujado con formas.
- ¿Avisado al equipo?: sí (lo aprobaron antes de hacerlo).

## 2026-11-14 — Las palancas se permiten
- Quién: dueña del spec 01
- Qué se decidió: se corrige la regla de "objetos actuales": las palancas **sí** se permiten, con aspecto moderno (mango con luz LED, carcasa blanca o grafito). Siguen fuera los tubos y las agujas.
- Por qué: el spec 16 usa una palanca de a dos.
- A quién afecta: `docs/STYLE_GUIDE.md`, spec 16.
- ¿Avisado al equipo?: sí (PR #20).

## 2026-11-14 — Assets al doble del tamaño en pantalla y referencias afuera de `public/`
- Quién: dueña del spec 01, a pedido de la revisión del PR #20
- Qué se decidió: cada imagen del juego se guarda en PNG al doble (2×) de su tamaño en pantalla (fondos 1280 × 720, astronauta 54 × 80, íconos 32 × 32; tabla completa en `STYLE_GUIDE.md`). Las hojas magenta, las propuestas y `PROMPTS.md` pasan de `public/assets/reference/` a `docs/arte/`.
- Por qué: el kit pesaba ~29,5 MB y quedaría para siempre en el historial de Git; escalar ~10× en tiempo real con `pixelArt: true` queda serruchado; y todo lo que está en `public/` se publica con el juego.
- A quién afecta: todas las escenas que carguen imágenes; estructura de carpetas (nueva `docs/arte/`).
- ¿Avisado al equipo?: sí (PR #20).

## 2026-11-14 — La base se arma por capas (fondo vacío + sprites de estado)
- Quién: dueña del spec 01 (decidido al producir el kit de imágenes)
- Qué se decidió: el mapa isométrico de la base es un fondo vacío (`public/assets/sprites/fondos/mapa-base.png`) y el estado de cada sala se dibuja encima con sprites (`public/assets/sprites/mapa/`): plantas sanas/sedientas/secas, máquina de oxígeno funcionando/rota, paneles limpios/sucios. Las salas por dentro también son fondos vacíos + sprites. Las salas por dentro son el original y el mapa se adaptó a ellas. Se descartó pasar a 3D.
- Por qué: así lo que pasa en el juego se ve también en el mapa (si las plantas se marchitan, se marchitan en el mapa), sin generar una imagen por cada combinación de estados.
- A quién afecta: spec 04 (la escena del mapa tiene que ubicar los sprites de estado sobre el fondo), specs 07–10 (fondos de sala + sprites).
- Pendiente: el código del spec 04 que está en `main` es cenital (salas rectangulares, pasillo recto). Para usar `mapa-base.png` hay que rehacer `src/scenes/base/baseMap.ts`, `RoomView.ts`, los recorridos de `AstronautSprite` y los `workSpot` de cada sala. Lo toma la dueña del spec 04 en un PR aparte. **Actualización:** se hizo en el PR #21 (ver la entrada de arriba).
- ¿Avisado al equipo?: sí (PR #20).

## 2026-11-14 — Estilo visual ganador: pixel art retro 16 bits con tecnología actual, vista isométrica
- Quién: el equipo (votación del spec 01, etapa 1)
- Qué se decidió:
  - Gana la propuesta "retro 16 bits": el **dibujo** es retro (pixel art de consola de 16 bits), pero los **objetos** son actuales (pantallas planas, botones táctiles, luces LED; nada de tubos ni agujas. Las palancas se permiten: ver la entrada "Las palancas se permiten"). Sin logos de la NASA en ningún lado.
  - La base se ve en **vista isométrica** (no cenital como recomendaba el spec 01).
  - Regla de color: el naranja y el óxido quedan para Marte (suelo, cielo, exterior). Botones, luces, pantallas y detalles tecnológicos van en celeste `#5ec8e5`, blanco y grafito. La paleta no cambia, solo dónde se usa cada color.
  - Cambios pedidos sobre la propuesta: la base en corte y el invernadero se rehacen a partir de la base exterior para que coincidan; el marco de fotos NASA lleva más detalle.
- Por qué: es la propuesta que más gustó; la tecnología actual muestra que la exploración de Marte es de hoy.
- A quién afecta: spec 04 (mapa de la base: pasa a isométrico), spec 01 etapas 2 y 3, `docs/STYLE_GUIDE.md`, y todas las escenas que dibujen la base.
- ¿Avisado al equipo?: sí (votación).

## 2026-11-14 — Solo la dueña del repo mergea a main
- Quién: memocayar
- Qué se decidió: una regla de GitHub ("Solo la dueña mergea a main") hace que solo la admin del repo (memocayar) pueda actualizar `main`. Las demás siguen abriendo, revisando y aprobando PRs, pero no los mergean. También bloquea borrar `main` y hacerle `push --force`.
- Por qué: Vercel bloquea los deploys de commits hechos por quien no es miembro del proyecto en Vercel, y los merges de las demás quedaban bloqueados. Además, GitHub Actions está trabado en la cuenta (se pidió ayuda a GitHub Support), así que el deploy a GitHub Pages (PR #19) todavía no anda.
- A quién afecta: todas. Sigue valiendo que todo PR lo revise otra integrante (§6 de `AGENTS.md`): cuando esté aprobado, se le avisa a memocayar para que lo mergee.
- ¿Avisado al equipo?: pendiente (avisar a maviflora y jz-rs).

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
