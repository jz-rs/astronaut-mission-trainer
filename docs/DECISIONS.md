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

## 2026-11-15 — Se permite una tarjeta de explicación antes de un minijuego
- Quién: memocayar
- Qué se decidió: `AGENTS.md` §4 decía "nunca un bloque de texto antes de jugar". Ahora un minijuego puede abrir con una tarjeta de explicación cuando la mecánica enseña algo real: pasos con dibujitos, una línea por paso (máximo 4), un botón grande para empezar y el juego en pausa mientras se ve.
- Por qué: la Misión de oxígeno (PR #29) usa una tarjeta así para explicar MOXIE, y nos gustó cómo quedó.
- A quién afecta: todas (reglas de diseño, `AGENTS.md` §4).
- ¿Avisado al equipo?: pendiente (avisar a maviflora y jz-rs).

## 2026-11-14 — Misión de oxígeno: "Rompé la molécula", como MOXIE
- Quién: C (con Claude)
- Qué se decidió: el minijuego de oxígeno deja de ser "arrastrá burbujas de CO₂". Ahora el chico **solo alimenta a MOXIE**: arrastra (o toca) cada CO₂ (O–C–O) hasta la máquina. MOXIE tiene una **ventanita** para ver adentro: el CO₂ se pone naranja (800 °C), tiembla y se parte; el CO sale gris, como humo, por el caño gris; la O azul espera en uno de 2 lugarcitos ("¡Falta 1 CO₂!"); con dos O se juntan solas en O₂, que viaja por el caño azul al tanque ("¡+1 O₂!"). Así se ve sin leer que hacen falta 2 CO₂ para 1 O₂ (2 CO₂ → 2 CO + O₂). Colores con significado: azul = oxígeno (también dentro del CO₂, el mismo de la barra de oxígeno), gris = lo que sobra, naranja = calor, carbono oscuro. En `balance.ts`, `OXYGEN_FACTORY_BALANCE` cambia `bubblesGoal`, `bubblesOnScreen`, `bubbleSpeed` y `bubbleRadius` por `oxygenGoal`, `moleculesOnScreen`, `moleculeSpeed` y `atomRadius`. Rendimiento = CO₂ metidos / CO₂ necesarios + bonus de velocidad. Antes de que empiece el reloj, una tarjeta explica los 4 pasos con dibujitos y una línea cada uno, y un botón "¡A fabricar!"; mientras se juega, un panel a la izquierda muestra solo esos dibujitos con el paso actual marcado. **Contrato:** `MinigameScene` suma `pauseGame()` / `resumeGame()` (opcional; los demás minijuegos no cambian): mientras se muestra la explicación se frenan el reloj del minijuego y la base de atrás (barras, eventos, bots), así el chico no pierde mientras aprende. Si sale con la X, la base se reanuda. Cambia el texto de la instrucción y de `task.oxygen-factory.why`, y hay claves nuevas de i18n.
- Por qué: que la mecánica misma enseñe cómo se fabrica oxígeno en Marte, no solo el dato del final. Respaldo: NASA, "MOXIE Completes Mars Mission" (2023) y JPL, "MOXIE Could Help Future Rockets Launch Off Mars". Es la primera misión de la propuesta de misiones educativas; las demás esperan revisión.
- A quién afecta: B (spec 08, `src/minigames/oxygen-factory/*`), A y B (`MinigameScene.ts`, solo se agrega), `balance.ts`, `i18n`.
- ¿Avisado al equipo?: sí (este documento y el PR).

---

## 2026-11-15 — El manual de misión es una tablet, no un libro (spec 18)
- Quién: C (Emilia), con Claude
- Qué se decidió: el manual se muestra en una **tablet de misión** (la misma que flota en la cabina, de frente y en grande), una página por pantalla. Su interfaz tiene **estética de pantalla**, distinta de los botones físicos de la consola: líneas celestes finas con brillo, esquinas tipo visor, barras por segmentos, líneas de escaneo y un destello breve al tocar. Las páginas de cada barra y del rover deben comparar la foto real de NASA con la representación del juego. La página de oxígeno sigue la nueva misión de MOXIE (spec 08). Maquetas en `docs/arte/bocetos/cabina/manual/` (no aprobadas).
- Por qué: el libro abierto no convenció; en una tablet, con texto claro sobre fondo oscuro, la letra chica se lee mejor y encaja con "objetos de hoy" de la guía de estilo.
- A quién afecta: spec 18 (escenas 1, 2 y 3; el libro de la cabina pasa a ser la tablet) y spec 13 (fotos para comparar).
- ¿Avisado al equipo?: no todavía.

## 2026-11-14 — Primer boceto de la cabina (spec 18): vista frontal inmersiva
- Quién: C (Emilia), con Claude
- Qué se decidió: se empieza a explorar el arte de la cabina aunque el spec 18 decía "no generar assets". El boceto vive en `docs/arte/bocetos/` (fuera de `public/`, el juego no lo usa) y no es arte aprobado. La cabina va en **vista frontal en perspectiva con punto de fuga**, más inmersiva, como `docs/arte/propuesta-3/2-sala.png`, y **no isométrica** como la base. Mismo estilo de pixel art y paleta que el kit. La ventana y el monitor tienen el vidrio/pantalla en magenta para poner después la foto real de Marte y la interfaz. La astronauta va aparte, como sprite, para que flote en gravedad cero.
- Por qué: la cabina es una escena fija donde se tocan objetos; una vista frontal la hace más inmersiva y deja el centro libre para la astronauta flotando.
- A quién afecta: spec 18 (perspectiva, que estaba pendiente), spec 11 (JUGAR lleva a la cabina), spec 13 (falta una foto real de Marte entero para la ventana).
- ¿Avisado al equipo?: no todavía.

## 2026-11-14 — Consolidar la intro antes de producir imágenes
- Quién: Emilia.
- Qué se decidió: volver a la planificación previa a generar imágenes y documentarla en el spec 18. Incluir comparación de fotos NASA con pixel art, eventos y comunicaciones demoradas. Los bocetos y prompts posteriores no constituyen arte aprobado; perspectiva y composición quedan pendientes.
- Por qué: cerrar el recorrido y el contenido antes de retomar la producción visual.
- A quién afecta: specs 01, 11, 12, 13 y nuevo spec 18. No se implementan cambios en misiones.
- ¿Avisado al equipo?: pendiente compartir el spec detallado; el rumbo general ya había sido aprobado.

## 2026-11-14 — Intro y preparación de misión dentro de la nave
- Quién: el equipo, según confirmación de Emilia en la planificación.
- Qué se decidió: planificar una cabina fija después de JUGAR, con bienvenida salteable de una astronauta, ventana al espacio con una imagen real de Marte y manual obligatorio la primera vez. Completar el manual consiste en recorrer sus páginas, sin ejercicios. Debe explicar las cuatro barras y el rover. La selección de destino reemplazará la UI anterior por un monitor con botones de la nave: explorar todos los destinos, cambiar sus fotos, consultar información y aterrizar solo en destinos desbloqueados.
- Por qué: integrar la preparación de la misión en el mundo del juego.
- A quién afecta: specs 01, 11, 12 y 13; navegación del spec 02 y guardado del progreso. Se aprueba apartarse del límite de diez segundos y dos toques del spec 11 para la primera visita. No se cambian las misiones que está implementando otra integrante.
- ¿Avisado al equipo?: sí, según confirmación de Emilia. La aprobación es del rumbo de diseño; el guion, los detalles visuales y la implementación siguen en planificación.

## 2026-11-14 — Biomas por nivel: cada lugar de Marte se ve distinto
- Quién: maviflora, con Claude (propuesta aprobada: https://claude.ai/artifact/3BGsLZqDjkVsasTe6a8dpG)
- Qué se decidió:
  - **Mapa de la base por nivel** (`public/assets/sprites/biomas/mapa-base-*.png`): suelo, detalles y colores de la base para Gale, Olympus Mons, Casquete polar y Valles Marineris. Jezero sigue usando el mapa del kit. Las salas y el pasillo quedan en el mismo lugar, así que no cambian las zonas táctiles ni los recorridos, y los colores de cada sala no se tocan.
  - **Fotos NASA en las ventanas**: cada sala de minijuego (`sala-*-<lugar>.png`) muestra por la ventana una foto real del lugar. Olympus Mons y Valles Marineris usan fotos **desde órbita** (PIA00300, PIA00425), porque nunca aterrizó nada ahí. Créditos en `DATA_SOURCES.md`.
  - **Clima** (`src/scenes/base/WeatherView.ts`): nieve en el polo y polvo en Gale, más escarcha en las esquinas del polo encima de la UI. Se hace con rectángulos y tweens (no con el emisor de partículas de Phaser, que dejaba la pantalla en negro al reiniciar la base).
  - **Carga por nivel** (`src/ui/biomes.ts`): las imágenes de un nivel (~1,8 MB) se cargan en el `preload()` de `BaseScene` al entrar, no al arrancar el juego. Las ya cargadas no se vuelven a pedir.
  - **Contrato `MinigameStartData`** (`src/minigames/MinigameScene.ts`): se agrega `locationId?` **opcional**, para que el minijuego dibuje la sala del lugar. Sin `locationId` usa la sala del kit. No rompe nada.
- Por qué: que cada nivel se sienta un lugar distinto y real de Marte, y que la foto NASA llegue como premio visual sin texto extra.
- A quién afecta: A (spec 04 `BaseScene`, `baseMap.ts`), B (spec 06 `MinigameScene`: contrato ampliado, minijuegos 07–10 heredan la sala nueva), C (spec 12/13: fotos y `DATA_SOURCES.md`).
- ¿Avisado al equipo?: sí, con la propuesta y el PR #27.

## 2026-11-14 — Tarjetas de los bots más claras (AUTO / MANUAL)
- Quién: C, con Claude (pedido de C)
- Qué se decidió: las caritas de los bots en la barra de arriba pasan a ser tarjetas más grandes (`BotFaces.ts`), pensadas para chicos de 7 años:
  - el astronauta del bot, con el mismo color de traje que en el mapa;
  - el modo en letra más grande y con color: **AUTO** (verde: elige y trabaja solo) o **MANUAL** (amarillo: espera tu orden). Se probó "SOLO" / "VOS", pero C prefirió AUTO / MANUAL;
  - el ícono de la sala donde trabaja, o "?" mientras espera tu orden;
  - al tocarla: si pasa a AUTO aparece "¡Trabaja solo!" (clave nueva `hud.botNowAlone`); si pasa a MANUAL la tarjeta titila en blanco y aparece "¿A qué sala va?" (como antes).
  - `floatText` ahora devuelve el texto, para poder ubicarlo y ponerlo adelante, y todos los mensajes flotantes ("¡Sin energía!", etc.) llevan contorno oscuro para leerse sobre el mapa.
  - **Mandar a un bot en MANUAL** (corrige la regla del PR #24): un bot en MANUAL se puede tocar en el mapa aunque esté trabajando en una sala, porque es lo que hace un chico para "agarrarlo". Solo responde el cuerpo del astronauta (antes, un cuadrado agrandado de 48 px), así el resto de la sala sigue abriendo el minijuego. Los bots en AUTO siguen sin poder tocarse. Tocar un bot ya elegido lo deja elegido (antes lo soltaba y el siguiente toque te mandaba a vos). Si se lo manda a la sala donde ya está, aparece "¡Ya está ahí!" (clave nueva `hud.botAlreadyThere`).
- Por qué (lo de mandar bots): al probarlo, se pasaba un bot a MANUAL, se tocaba al robot y después una sala, y el robot no se movía.
- Por qué: probándolo, las caritas chicas con "AUTO" / "MANUAL" en letra de 6 px no se entendían: no se veía cuál robot era ni qué estaba haciendo.
- A quién afecta: A (spec 05: `BotFaces.ts`, `BotsView.ts`; spec 04: `BaseScene.ts`), todas (`floatingText.ts`, i18n con claves nuevas).
- ¿Avisado al equipo?: pendiente (se avisa con el PR).

## 2026-11-14 — X para salir de la partida
- Quién: C, con Claude (pedido de memocayar)
- Qué se decidió: la base tiene una X roja arriba a la izquierda (`scenes/base/ExitRunView.ts`). Al tocarla, la partida se pausa y pregunta "¿Salir de la partida?" con SALIR (vuelve al mapa, sin guardar el resultado de esa partida) y SEGUIR. No se puede abrir mientras hay un minijuego o el rover encima.
- Por qué: no había forma de abandonar una partida; la pregunta evita que un toque sin querer la termine.
- A quién afecta: A (spec 04 `BaseScene`, spec 11 navegación).
- ¿Avisado al equipo?: sí (pedido en el chat). Si alguien ya tenía una X de salida sin subir, juntar con esta.

## 2026-11-14 — Rover de un solo gesto y tarjeta del lugar más clara
- Quién: C, con Claude (pedido de memocayar)
- Qué se decidió:
  - **Rover**: un solo gesto. Tocar a la izquierda o derecha del rover cambia de carril; las piedras que brillan se atrapan pasando por encima (ya no se tocan) y tienen un halo celeste para distinguirlas de las rocas. Se actualizó el spec 15.
  - **Tarjeta del lugar** (spec 12): X roja para cerrar, la frase celeste ("por qué es difícil") justo debajo del nombre, el mapa de atrás oscurecido, y debajo de la foto la etiqueta "📷 Foto real NASA" en vez del crédito suelto (el crédito sigue en `locationPhotos.ts`, `DATA_SOURCES.md` y la pantalla de Fuentes). `addCloseButton` acepta una posición para usarse fuera de los minijuegos.
- Por qué: mezclar moverse y tocar en el rover era raro; en la tarjeta no había cómo cerrar, el crédito parecía texto de la foto y el mapa se veía a través.
- A quién afecta: B (spec 15), C (specs 12 y 13), `ui/closeButton.ts` (PR #24) y `ui/framedPhoto.ts`.
- ¿Avisado al equipo?: sí (pedido en el chat).

## 2026-11-14 — Todos los lugares de Marte desbloqueados desde el inicio
- Quién: C, con Claude (pedido de la dueña del repo)
- Qué se decidió: los 5 lugares de `data/locations.json` pasan a `starsToUnlock: 0`, así se pueden jugar todos desde la primera partida. Las estrellas y el récord por lugar se siguen guardando y mostrando. La lógica de candados (`core/progression.ts`) y su dibujo en el mapa quedan, por si se quiere volver a bloquear: alcanza con poner otra vez los números (antes: 0, 2, 4, 6, 8).
- Por qué: que todos los lugares se puedan probar y mostrar ya (playtests, balance, demo).
- A quién afecta: spec 12 (progresión por estrellas), ROADMAP H4 ("¿intenta conseguir la 3ª estrella?").
- ¿Avisado al equipo?: pendiente (avisar con el PR).

## 2026-11-14 — Fotos reales de la NASA para los 5 lugares
- Quién: C, con Claude
- Qué se decidió: una foto real por lugar en `public/assets/nasa/` (640 × 360, recortada al monitor del marco), registrada en `src/content/locationPhotos.ts` y en `docs/DATA_SOURCES.md`. Se ven en la tarjeta del mapa y al volver del rover. Son de NASA/JPL Photojournal (dominio público); se evitaron las que incluyen créditos de ESA.
- Por qué: el spec 13 y AGENTS.md §5 piden imágenes reales de la NASA enmarcadas y con crédito.
- A quién afecta: specs 12, 13, 15 (solo contenido; no cambia código de escenas).
- ¿Avisado al equipo?: pendiente (avisar con el PR).

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

## 2026-11-14 — Tocar una sala siempre te lleva a vos; las barras pasan a las salas
- Quién: C, con Claude (pedido de C)
- Qué se decidió:
  - Se suma a la regla de "bots en AUTO no se tocan" (entrada de abajo): un bot en MANUAL que está trabajando o yendo a una sala tampoco se puede tocar; el toque le llega a la sala y vas vos a jugar. Solo se eligen (para darles una orden) los bots que esperan en el pasillo. Antes, tocar una sala donde había un bot lo seleccionaba sin querer, y desde ahí cada toque mandaba al bot: parecía que las salas no respondían.
  - Las 4 barras se sacan de la barra de arriba y pasan a las salas: cada cartel es una tarjeta con ícono + nombre y la barra de esa sala adentro. Cuando está baja, titilan en rojo el borde (más grueso) y la barra; la tarjeta queda oscura para que el nombre se siga leyendo. Arriba quedan solo el Sol (al centro) y las caritas de los bots.
  - Los efectos de cada tarea ("+30" y "−10 ⚡") ahora vuelan a la barra de la sala (la energía, a la tarjeta de Paneles solares) y es esa barra la que brilla (`RoomView.barCenter` / `flashBar`, que reemplazan a `statBarCenter` / `Hud.flash`). La flecha del sol guiado "¡Subió!" apunta a la barra de la sala.
  - La barrita de progreso de cada bot pasa de arriba del casco a debajo de los pies, para que no se pise con las tarjetas de las salas.
- Por qué: en la compu las salas "no abrían" el minijuego; y así se ve cómo está cada sala donde está.
- A quién afecta: A (spec 04: `Hud.ts`, `RoomView.ts`, `TaskEffectsView.ts`, `TutorialGuide.ts`; spec 05: `BotsView.ts`). Contradice el spec 04, que pedía las 4 barras arriba.
- ¿Avisado al equipo?: pendiente (se avisa con el PR).

## 2026-11-14 — X para salir de los minijuegos
- Quién: C, con Claude (pedido de C)
- Qué se decidió: cada minijuego tiene una X roja arriba a la derecha del panel (`src/ui/closeButton.ts`, zona táctil de 48 px). Salir no cuenta como tarea hecha: no hay resultado, no se gasta energía y la barra no sube. En el rover, la X lo trae de vuelta enseguida con las muestras que ya juntó (la energía ya se pagó al salir).
- Contrato: `MinigameStartData` suma un campo **opcional** `onExit?: () => void` (`src/minigames/MinigameScene.ts`). La X la dibuja la clase base, así que ningún minijuego tiene que cambiar.
- Por qué: un chico que entra sin querer, o que no quiere jugar ese minijuego, tenía que esperar los 15 s. La X se oculta cuando aparece la tarjeta de resultado (ahí se sale con SEGUIR).
- A quién afecta: A (spec 04: `BaseScene` libera al astronauta con `onExit`), B (specs 06–10 y 15: contrato de minijuegos y rover).
- ¿Avisado al equipo?: pendiente (se avisa con el PR).

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
