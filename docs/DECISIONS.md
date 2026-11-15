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

## 2026-11-15 — El aterrizaje ya no muestra "Destino confirmado" (spec 19)
- Quién: C (Emilia), con Claude
- Qué se decidió: se saca el cartel "Destino confirmado: [lugar] / ¡Prepará a tu tripulación!" de arriba del aterrizaje. Se borran `src/scenes/landing/landingUi.ts` y las claves `landing.confirmed` y `landing.prepare` (solo las usaba ese cartel).
- Por qué: no hace falta; el aterrizaje ya muestra el lugar por la ventana.
- A quién afecta: solo el spec 19 (`LandingScene`, i18n).
- ¿Avisado al equipo?: no todavía.

## 2026-11-15 — En la base, la X roja de salir pasa a ser "◀ VOLVER"
- Quién: C (Emilia), con Claude
- Qué se decidió: el botón de arriba a la izquierda de la base (salir de la partida, con la pregunta de confirmación de siempre) deja de ser una X roja y pasa a ser **◀ VOLVER / BACK**, oscuro con borde gris, del mismo tamaño que el de la cabina. Los dos salen de un componente compartido nuevo, `src/ui/backButton.ts` (versión clara para la cabina, oscura para la base). La clave de texto pasa a ser `hud.back`. La X roja de los minijuegos y de la tarjeta del mapa no cambia.
- Por qué: a C le gusta más, y el "volver" es igual en la nave y en la base.
- A quién afecta: dueña de la base (spec 04, `src/scenes/base/ExitRunView.ts`: cambia solo el botón, la pregunta sigue igual). `layout.ts` (se agrega `BASE_BACK_BUTTON`). `src/ui/backButton.ts` es nuevo.
- ¿Avisado al equipo?: no todavía.

## 2026-11-15 — Cabina: la ventana también abre la consola, botón Volver y botón físico de la tablet (spec 19)
- Quién: C (Emilia), con Claude
- Qué se decidió: (1) tocar la **ventana con Marte** también abre la consola de destinos, y cuando la guía señala la consola un solo marco de esquinas amarillas rodea la ventana y el tablero juntos; (2) en la cabina hay un botón **◀ Volver / Back** arriba a la izquierda, con el mismo estilo que los botones de la pantalla de inicio (en color crema y con una flecha dibujada), que lleva al inicio; (3) el **botón redondo de la tablet** cierra el manual, igual que la X: solo cuando la X está (la primera lectura sigue siendo obligatoria). La ventana respeta lo mismo que el tablero: hasta terminar el manual, la guía manda a la tablet.
- Por qué: en las pruebas no se entendía qué tocar para elegir destino, y desde la nave no había forma de volver al inicio (ver spec 20).
- A quién afecta: solo archivos del spec 19 (`CabinScene`, `ManualScene`, nuevo `cabin/backButton.ts`). Se agregan 2 valores en `layout.ts` y la clave `cabin.back` en `i18n`.
- ¿Avisado al equipo?: no todavía.

## 2026-11-15 — The first mission manual can't be skipped (spec 19)
- Who: Marianela, with Claude
- What was decided: until the manual is finished, tapping the dashboard in the cabin doesn't open the destination console. The guide says `cabin.manualFirst` ("First open the mission manual: it is the tablet.") and highlights the tablet. The first read of the manual has no X button, so the only way out is reaching the last page. Once it's done, the X comes back and the manual can be reread and closed at any point. This closes the open item in spec 19 about reaching the monitor before the manual.
- Why: in playtesting, skipping the welcome and going straight to the console made LAND bounce back with "Read the manual first". That text overflowed its box, and a new player couldn't tell how to get back to the manual or where they had stopped.
- Affects: spec 19 only (`CabinScene.ts`, `ManualScene.ts`, `docs/specs/19-intro-cabina-manual.md`). It uses an existing i18n key; no shared contract changes.
- Team notified?: not yet (goes in the PR).

## 2026-11-15 — Everything new in the repo goes in English
- Who: the team, with Claude
- What was decided: from now on commit messages, branch names, PR titles and descriptions, GitHub comments and reviews, and code comments are written in English (NASA Space Apps rule). Game texts in `src/i18n/es.json` stay in Spanish. Git history is not rewritten. Rule added to `AGENTS.md` §2 and §6.
- Why: the hackathon requires the repo content to be in English.
- Affects: everyone and every agent (`AGENTS.md`).
- Team notified?: yes (with this PR).

## 2026-11-15 — Las tarjetas de explicación y el panel de pasos numeran los pasos
- Quién: Jeza (jz-rs), con Claude
- Qué se decidió: la tarjeta de explicación que abre cada misión (`src/minigames/howTo/howToCard.ts`, la usan paneles, oxígeno, invernadero, escudo y rover) muestra el número de cada paso en un círculo amarillo, en su propia columna a la izquierda del dibujo, para que se siga como una lista y el número no se mezcle con el dibujo ni con el texto. El texto de cada paso se achica de 330 a 320 px de ancho para que entre la columna. Los textos no cambian. El **panel de pasos** que se ve a la izquierda mientras se juega (`stepGuide.ts`) también lleva el número, más chico, en la esquina de arriba a la izquierda de cada paso y siempre encendido (aunque el paso esté apagado), para que el orden se lea de un vistazo. El circulito es el mismo en los dos lugares (`howTo/stepNumber.ts`). Como todas las misiones usan estas dos piezas, vale para todas las misiones y todos los niveles.
- Por qué: al probarlo, los pasos se leían mejor con números; ponerlos en el texto ("1. ...") se mezclaba con el resto.
- A quién afecta: B (las tarjetas de los specs 07–10 y 15 se ven con números; no cambia cómo se usan).
- ¿Avisado al equipo?: sí (PR #38).

## 2026-11-15 — Rover: un tubo guiado y después el chico llena otros solo
- Quién: Jeza (jz-rs), con Claude
- Qué se decidió: en el guardado de muestras del rover ya no se llena un solo tubo. Cada viaje tiene **3 tubos** (`tubesPerTrip`): el **primero es guiado** (manito fantasma y panel de pasos, como antes) y en los **otros dos el chico lo hace solo**, sin manito; arriba dice "¡Ahora vos solo! Tubo 2 de 3". Cada tubo sellado suma 1 muestra; uno que queda abierto 4 s se contamina, se tira y se pasa al siguiente. El estante tiene 8 lugares y siempre deja libres los de los tubos del viaje. En el resultado se ven los tubos sellados y, si hubo, los contaminados. **Balance:** `storeDurationMs` pasa de 9 s a 20 s; se agrega `tubesPerTrip` (3); `shelfSlots` pasa de 6 a 8. Las claves `rover.tubeSaved` y `rover.tubeLost`, que eran nuevas de esta misma rama, se reemplazan por `rover.tubesSealed`, `rover.tubesLost` y `rover.soloInstruction`.
- Por qué: al probarlo, la misión explicaba cómo se hace y terminaba enseguida; el chico tiene que poder practicarlo solo después de la explicación.
- A quién afecta: B (spec 15, `src/minigames/rover/*`: archivos nuevos `SampleTube.ts` y `tripInstruction.ts`). `balance.ts` (`ROVER_BALANCE`). Hasta 3 muestras más por viaje y un viaje más largo (~30 s con la base corriendo): revisar en la próxima ronda de balance (T5).
- ¿Avisado al equipo?: sí (PR #38).

## 2026-11-15 — Rover: las rocas se atrapan y lo que se esquiva es la arena blanda
- Quién: Jeza (jz-rs), con Claude
- Qué se decidió: en el manejo del rover (spec 15) se dejan de esquivar rocas. Ahora **cada roca que se atrapa es una muestra**, y lo que se esquiva son **pozos de arena blanda**. Como un chico esquiva por reflejo cualquier roca en un juego de manejo, se usa el idioma de los juegos: **cada roca se ve como un premio** (un círculo celeste que late, como los objetivos que marcan los científicos para Perseverance, y un tubito de muestra flotando encima), y al atraparla sale "+1" y el tubito vuela al contador. **La arena se ve como peligro**: una mancha oscura donde se hunden las ruedas, con un cartel ⚠️ rojo. Todo dibujado con la paleta (`trackPieces.ts`). Lo primero que aparece en el camino es siempre una roca en otro carril, y la manito muestra cómo ir hacia ella. Si el rover cae en la arena, patina y queda frenado un momento (`sandStuckMs`, 700 ms) con el aviso "¡Arena blanda!", pero **no pierde las rocas que ya tenía** (antes chocar una roca restaba 1 muestra). Después, el rover taladra una roca como la que atrapó, así las dos partes de la misión quedan conectadas. El paso 1 de la tarjeta enseña el dato: el rover Spirit quedó atrapado en arena blanda en 2009 y nunca pudo salir. **Balance:** en `ROVER_BALANCE`, `sampleChance` (0.45) pasa a `rockChance` (0.55), `rockStunMs` pasa a `sandStuckMs` y se borra `samplesLostPerRock`. Cambia el texto de `rover.instruction` y `rover.guide1`, y hay una clave nueva, `rover.sandStuck`. El dibujo del manual (`manualArt.ts`, spec 19) sigue mostrando la piedra brillante: no se tocó porque no es de este spec.
- Por qué: al probarlo no se entendía. Primero las rocas eran malas y enseguida había que taladrar una roca; además, la roca y la piedra brillante se parecían mucho a la velocidad del rover.
- A quién afecta: B (spec 15, `src/minigames/rover/RoverTrack.ts` y la escena del rover). `balance.ts` (`ROVER_BALANCE`: 2 valores renombrados y 1 borrado; solo los usa el rover). i18n. C (spec 19): quizás quiera cambiar la piedra brillante del manual por una roca.
- ¿Avisado al equipo?: sí (PR #38).

## 2026-11-15 — La pantalla final de cada misión no se cierra sola y pausa la base
- Quién: Jeza (jz-rs), con Claude
- Qué se decidió: al terminar cualquier misión (paneles, oxígeno, invernadero, escudo y rover), la pantalla del resultado con el dato queda hasta que el chico toca **SEGUIR ▶**, que es el único botón: la X roja de la esquina se oculta en el resultado (se probó dejarla como otra forma de seguir, pero confundía tener dos botones). La X sigue estando mientras se juega, para salir antes de terminar. Mientras se ve, **la base queda en pausa** (no corre el sol ni bajan las barras), con el mismo `pauseGame()` / `resumeGame()` de la tarjeta de explicación. Ya no hay cierre automático: se borran `MINIGAME_BALANCE.factMaxDisplayMs` (12 s) y `ROVER_BALANCE.resultDisplayMs` (3 s). El rover suma el botón SEGUIR (`addContinueButton`, ahora exportado desde `resultCard.ts`) y su resultado se reacomodó para que el dato de los tubos no quede tapado.
- Por qué: al probarlo, el resultado del rover se cerraba a los 3 s y el de las otras misiones con la base corriendo atrás: no se llegaba a leer el dato, que es el premio educativo.
- A quién afecta: A y B (`src/minigames/MinigameScene.ts`: `finish()` pausa la base y la reanuda al tocar SEGUIR; `resultCard.ts`). B (spec 15, rover). `balance.ts`: se borran 2 valores que ya no usa nadie. Reemplaza el "máximo 12 s" de la entrada "El dato del minijuego queda en pantalla".
- ¿Avisado al equipo?: sí (PR #38).

## 2026-11-15 — Misión del rover: guardar la muestra en el tubo, como Perseverance
- Quién: Jeza (jz-rs), con Claude
- Qué se decidió: la expedición del rover (spec 15) suma un segundo momento, el de la Misión 5 de la propuesta "Misiones que enseñan a vivir en una base en Marte". Antes de salir hay una **tarjeta de 4 pasos** (manejar y atrapar piedras → taladrar → meter en el tubo y sellar → estante) con el botón "¡A explorar!"; mientras se lee, la base queda en pausa, y después sigue corriendo todo el viaje como antes. Se maneja **10 s** (antes 15 s) atrapando piedras que brillan, igual que antes. Después el rover para junto a una roca y guarda **una sola muestra por viaje**: mantener apretado el taladro hasta cortar el cilindro, arrastrarlo (o tocarlo) al tubo y tocar el tubo para sellarlo (un anillo que se cierra). El tubo sellado va al estante, donde las piedras atrapadas ya están como tubos y el lugar nuevo se ilumina. **Sellado = +1 muestra** (`sealedTubeSamples`). Si el tubo queda abierto 4 s, entra polvo: "¡Contaminada!" y no suma. Si se termina el tiempo del guardado (9 s), no suma. Panel de pasos a la izquierda, como en las otras misiones. Al final, además de la foto enmarcada, se ve qué pasó con el tubo y el dato "Perseverance lleva 43 tubos y cada muestra es del tamaño de una tiza".
- Por qué: que la mecánica enseñe lo real. Respaldo NASA: Perseverance lleva 43 tubos, taladra cilindros un poco más gruesos que un lápiz y los sella para que nada de la Tierra contamine las muestras (NASA, "A Martian Roundtrip"; JPL, primera muestra sellada en 2021). No se promete una fecha de regreso a la Tierra porque todavía no está decidida.
- A quién afecta: B (spec 15, `src/minigames/rover/*`: archivos nuevos `SampleStorage.ts`, `RockDrill.ts`, `SampleShelf.ts`, `roverIcons.ts`, `roverRecipe.ts`, `roverResult.ts`). `balance.ts` (`ROVER_BALANCE.durationMs` baja de 15 000 a 10 000 y se agregan `storeDurationMs`, `drillHoldMs`, `sealWithinMs`, `sealedTubeSamples`, `shelfSlots`, `coreSnapDistance`). i18n: solo claves nuevas `rover.*`. No cambia `core/` ni `GameAction` (`completeExpedition` ya recibe la cantidad de muestras). Las muestras por viaje quedan parecidas (un poco menos de manejo, +1 por tubo sellado): revisar en la próxima ronda de balance (T5).
- ¿Avisado al equipo?: sí (PR #38).

## 2026-11-15 — Las barras de cada sala pasan a ser de bloques
- Quién: C (Emilia), con Claude
- Qué se decidió: la barra de cada sala (la tarjeta de `RoomView`, las únicas barras de stats del juego) deja de ser una barra continua y pasa a ser de **10 bloques**, como las del manual de la tablet: bloques encendidos en el color de la stat hasta el valor y bloques apagados después. Si la stat está por encima de 0 se ve al menos un bloque. Cuando la barra está baja, los bloques encendidos titilan en rojo como antes y los apagados se ven rojizos. La cantidad de bloques es una sola constante (`STAT_BAR_SEGMENTS` en `layout.ts`) para la base y el manual.
- Por qué: a C le gustan más; los bloques se cuentan de un vistazo y combinan con la estética de pantalla del manual.
- A quién afecta: dueña de la base (spec 04, `src/scenes/base/RoomView.ts`: cambia solo cómo se dibuja la barra; `barCenter` y `flashBar` siguen igual). `layout.ts` (se agregan 2 valores).
- ¿Avisado al equipo?: no todavía (va en el PR #35).

## 2026-11-15 — En la cabina, los destinos se eligen en el tablero del centro (spec 19)
- Quién: C (Emilia), con Claude
- Qué se decidió: el monitor del costado derecho de la cabina se reemplazó por un rincón con trajes colgados, casco, botas y mochila (editado con Gemini solo en esa zona; el resto del dibujo queda igual). Ahora se toca la pantalla del centro del tablero, debajo de la ventana, para abrir la consola de destinos; esa pantalla muestra el mini mapa de Marte y, durante el aterrizaje, la altura. La consola de destinos de cerca se adapta a ese lugar: se ve desde el asiento, con la parte de abajo del parabrisas arriba (con la misma foto real de Marte de la ventana) y la pared de la cabina a los costados, en vez del marco de mueble encastrado en la pared; el beige pasa a los grises claros del tablero. El entorno lo dibujó Gemini y el panel (pantallas y huecos de los botones) quedó idéntico, así no cambian las posiciones. El botón de aterrizar lleva **ATERRIZAR ▼ grabado** en su cara, en la misma perspectiva que el botón (texto traducible, `monitor.landButton`; en inglés LAND), en vez del ícono del módulo de aterrizaje, que no se entendía; cuando se puede aterrizar tiene una luz amarilla suave que late. El contador "FOTO REAL NASA 1/3" pasa a una etiqueta sobre la foto, porque en inglés se pisaba con "DESTINATION 1/5". En la cabina flotan los objetos de `bocetos/cabina/flotantes/` (birome, bolsa de agua, llave, snack; el cohetito se sacó porque confundía) en gravedad cero: deriva lenta en línea recta, giro lento y rebote suave en los bordes.
- Por qué: al probarlo, lo intuitivo era tocar la pantalla del centro para elegir misión.
- A quién afecta: solo el spec 19 (`cabina-fondo.png`, `layout.ts`: `CABIN_DASHBOARD_*` reemplaza a `CABIN_MONITOR_*`, que solo usaba el spec 19; textos `cabin.manualDone` y `cabin.again`; `consola-fondo.png`; `botones/aterrizar*.png` sin ícono; clave nueva `monitor.landButton`; valores nuevos en `INTRO_BALANCE`).
- ¿Avisado al equipo?: no todavía (va en el PR #35).

## 2026-11-15 — La intro en la cabina pasa a ser el spec 19
- Quién: memocayar
- Qué se decidió: la intro en la cabina (PR #33) y "Paneles solares afuera" (PR #31) se crearon las dos como spec 18. Paneles queda como 18 porque se abrió antes, y la cabina pasa a `docs/specs/19-intro-cabina-manual.md`. El 19 estaba libre: el "invernadero sin tierra" se descartó antes de mergearse. Se actualizaron los comentarios "Spec 18" del código de la cabina y las referencias en los docs.
- Por qué: dos specs con el mismo número confunden a las personas y a los agentes.
- A quién afecta: spec 19 (cabina). El spec 18 (paneles) no cambia.
- ¿Avisado al equipo?: pendiente (avisar a maviflora y jz-rs).

## 2026-11-15 — Misión del escudo: por qué hay radiación en Marte y el medidor RAD
- Quién: C (con Claude)
- Qué se decidió: el muro de escudo (spec 10) mantiene "arrastrar bloques de agua y regolito a los huecos", pero ahora explica por qué. Tarjeta de 3 pasos antes de jugar (con pausa): la Tierra tiene un escudo magnético y Marte lo perdió, así que la radiación llega al suelo; el agua y el regolito la frenan; el rover Curiosity la mide con su instrumento RAD. Panel de pasos a la izquierda, como en las otras misiones. A la derecha hay un **medidor RAD** que sube mientras queden huecos abiertos (se pone rojo cerca del final y dice "¡Mucha radiación!" si se llena): así se ve la radiación, que en la vida real es invisible. Dentro del hábitat hay dos astronautas, que son los que el muro protege. Cada bloque bien puesto corta el rayo debajo del muro y dice "¡Bloqueado!". **Rendimiento:** huecos tapados / huecos + `lowRadiationBonus` (0.2) si el medidor no se llenó; antes era + bonus por velocidad. **Balance:** `SHIELD_WALL_BALANCE.wallSlots` baja de 10 a 8 (para que entren el panel de pasos y el medidor) y se agregan `radiationPerHolePerSecond` (0.035) y `lowRadiationBonus` (0.2). Cambian los textos de `minigame.shield-wall.instruction` y `task.shield-wall.why`, y hay claves nuevas.
- Por qué: que la mecánica enseñe lo real. Respaldo NASA: Marte perdió su campo magnético global y tiene una atmósfera muy fina (MAVEN); el instrumento RAD de Curiosity mide la radiación en la superficie; el agua y el regolito sirven de blindaje; en Artemis, la tripulación de Orion arma un refugio con las provisiones de a bordo si llega una tormenta solar.
- A quién afecta: B (spec 10, `src/minigames/shield-wall/*`), `balance.ts` (`SHIELD_WALL_BALANCE`: cambia `wallSlots`, se agregan 2 valores), i18n.
- ¿Avisado al equipo?: sí (este documento y el PR).

---

## 2026-11-15 — Misión del invernadero: agua y luz LED, como Veggie de la NASA
- Quién: C (con Claude)
- Qué se decidió: el invernadero (spec 09) deja de ser solo "regar plantas con sed". Seis lechugas crecen en los 6 canteros de la sala, en tierra traída de la Tierra (la tierra de Marte es tóxica), bajo las lámparas LED rosas de la sala. (Primero probamos con almohadas de Veggie dibujadas, pero no se entendían: se cambió a los canteros.) Cada planta va en el centro de la tierra de su cantero (medido por el color marrón de la foto), y las dos lámparas bajas y la columna verde de la sala se vuelven a dibujar por encima, para que las plantas crezcan debajo de la luz y detrás de la columna. **Contrato:** `MinigameScene` suma `protected addRoomPiece(outline)` (solo se agrega): redibuja encima una parte de la foto de la sala, para que los sprites queden detrás de ella. Al azar una planta pide **agua** (se pone amarilla, con una gota arriba) o **luz** (su cantero se oscurece, como si se apagara la lámpara, y se pone pálida, con una lámpara arriba). A la derecha hay dos herramientas grandes, **Agua** y **Luz**: se arrastra la herramienta a la planta, o se toca la herramienta y después la planta. La correcta hace crecer la planta (brote → joven → grande) y suelta una burbuja azul de O₂; la equivocada no hace nada y la burbuja tiembla. Si nadie la ayuda a tiempo, se marchita. Igual que oxígeno y paneles: tarjeta de 3 pasos antes de jugar (con pausa) y panel de pasos a la izquierda. Colores: verde = comida, rosa = luz LED, azul = O₂. Dato final: "Las plantas de la base no necesitan el Sol: crecen con luces LED, ¡también de noche!". Rendimiento = ayudas / pedidos + bonus si ninguna se marchitó (igual que antes). **Balance:** en `GREENHOUSE_BALANCE` se sacan `columns` y `rows` (las plantas van en los canteros de la foto de la sala) y se reemplazan `thirstEveryMs` y `thirstyForMs` por `needEveryMs` (1800), `needLastsMs` (4500) y `lightNeedShare` (0.5): ahora cada ayuda son dos gestos, así que hay un poco más de tiempo. Sprites nuevos registrados: `lettuceSprout`, `lettuceYoung` (ya estaban en `public/assets`). Cambia el texto de `minigame.greenhouse.instruction` y de `task.greenhouse.why`.
- Por qué: que la mecánica enseñe lo real. Respaldo NASA: el suelo de Marte tiene percloratos, tóxicos para las plantas, por eso se cultivaría en tierra traída de la Tierra (como el sustrato que usa Veggie en la Estación Espacial); Veggie cultiva lechuga con luces LED rojas y azules (por eso se ven rosas); las plantas toman CO₂ y liberan O₂.
- A quién afecta: B (spec 09, `src/minigames/greenhouse/*`), A y B (`MinigameScene.ts`, solo se agrega `addRoomPiece`), `balance.ts` (claves renombradas de `GREENHOUSE_BALANCE`, solo las usa este minijuego), `src/ui/sprites.ts` (2 claves nuevas), i18n.
- ¿Avisado al equipo?: sí (este documento y el PR).

---

## 2026-11-15 — De noche no se pueden usar los paneles solares
- Quién: C (con Claude)
- Qué se decidió: de noche **nadie** está en los paneles solares. El Sol se pone en `NIGHT_BALANCE.noSunFrom` (0.75 de noche = el 80 % de cada sol) y desde ahí hasta el sol siguiente nadie puede usarlos. Además, nadie empieza los paneles si no termina antes de que se ponga el Sol: los bots necesitan `botTaskDurationMs` (20 s) y la persona `NIGHT_BALANCE.playerSolarWorkMs` (15 s: caminar + minijuego). Si igual queda un bot ahí al ponerse el Sol, vuelve adentro sin premio (`sendBotsInAtSunset` en `updateRun`). Al tocar la sala sale "¡Ya se pone el Sol!" (si no llega a terminar) o "¡Sin Sol de noche!" (ya es de noche), y de noche hay una lunita sobre la sala. La noche es violeta: la misma imagen teñida (capa violeta que multiplica los colores) más un poco de oscuridad. **Contratos:** la regla vive en `src/core/daylight.ts` (`nightAmount`, `sunsetMs`, `isAfterSunset`, `isTooDarkFor`, `canStartTask`, `sendBotsInAtSunset`); `actions.ts` (`assignTask`) y `bots/autoPilot.ts` usan `canStartTask`. `nightAmount` pasa de `ui/nightfall.ts` a `core/daylight.ts`. **Equilibrio:** con menos horas de paneles la base se quedaba sin energía, así que (1) los bots en automático, cuando ya no hay Sol para cargar, no gastan la batería por debajo de `NIGHT_BALANCE.nightReserve` (15), como una tripulación real que guarda energía para la noche, y (2) `TASK_BALANCE['solar-panels'].gain` sube de 35 a 45. Con eso los tests de equilibrio siguen pasando (el chico que aprende sobrevive en Jezero, los bots solos no alcanzan, Gale es más difícil), y el chico simulado también respeta la noche. Hay tests nuevos en `tests/daylight.test.ts`.
- Por qué: es real (sin Sol los paneles no dan energía; las misiones de la NASA cargan baterías de día para pasar la noche) y enseña a juntar energía mientras hay Sol.
- A quién afecta: A (`src/core`, `src/bots`, `BaseScene.ts`, `tests/balance.test.ts`), `balance.ts` (`NIGHT_BALANCE`, ganancia de los paneles 35 → 45), i18n (`hud.noSun`, `hud.sunsetSoon`).
- ¿Avisado al equipo?: sí (este documento y el PR).

---

## 2026-11-15 — De día y de noche: la barra del Sol oscurece la base y las salas
- Quién: C (con Claude)
- Qué se decidió: la barra del sol de arriba es el Sol cruzando el cielo. Cuando pasa la mitad del sol (`NIGHT_BALANCE.nightStarts` = 0.5) la base empieza a oscurecerse, hasta la noche cerrada en `fullNight` (0.9); el sol siguiente arranca de día. Es una capa oscura semitransparente (`src/ui/nightfall.ts`: `nightAmount`, `NightShade`) sobre el mapa y los astronautas, debajo del clima y del HUD. **Contratos:** `MinigameStartData` suma `nightAmount?` (opcional, 0 = día, 1 = noche) y `MinigameScene` oscurece la sala con la misma noche, expone `protected nightAmount` y `protected roomPoint(x, y)` (dónde cae en pantalla un píxel de la foto de la sala, por ejemplo su ventana). `BaseScene` crea la capa, la actualiza en `update` y pasa `nightAmount` al abrir un minijuego. Los minijuegos que no lo usan no cambian.
- Además, de noche la estación prende sus luces (`src/scenes/base/StationLights.ts`): afuera Marte se tiñe de violeta, y adentro de las salas y los pasillos (su forma vista desde arriba, calcada del mapa) el piso conserva sus colores con una luz cálida. La noche va **debajo** de los carteles de las salas, las barras y los astronautas, para que se sigan leyendo bien. En la base reemplaza a `NightShade`, que se sigue usando en las salas de los minijuegos.
- Por qué: que se note que la luz del Sol no dura todo el día, y que los paneles solares dependen de ella.
- A quién afecta: A (spec 04, `BaseScene.ts`; `MinigameScene.ts`, solo se agrega), B (todas las salas se ven más oscuras de noche), `balance.ts` (`NIGHT_BALANCE` nuevo).
- ¿Avisado al equipo?: sí (este documento y el PR).

---

## 2026-11-15 — Misión de paneles: el Sol, la luz que el polvo tapa y la batería
- Quién: C (con Claude)
- Qué se decidió: el minijuego de paneles (spec 07) mantiene "limpiar como raspadita", pero ahora se ve de dónde sale la energía. La luz del Sol entra por la ventana de la sala (no hay un Sol dibujado adentro) y llega en rayos amarillos a los 3 paneles: el rayo es débil donde hay polvo y fuerte donde el panel está limpio. De noche la ventana se oscurece y entra poca luz ("¡Es de noche: poca luz!"): llegan menos rayitos a la batería, pero el puntaje sigue siendo cuánto limpió. Cada panel manda rayitos de energía por un cable hasta una batería, tantos como limpio esté, y la batería se llena con lo limpio (el mismo número que el rendimiento). Cuando un panel queda impecable sale "¡+energía!". Igual que en oxígeno: tarjeta de 3 pasos antes de jugar (con pausa) y panel de pasos a la izquierda. Colores: amarillo = luz y energía (el de la barra de energía), marrón-naranja = polvo de Marte. **Código compartido nuevo:** la tarjeta y el panel de pasos pasan a `src/minigames/howTo/` (`showHowToCard`, `StepGuide`, `pictureRow`) para que cualquier minijuego los use; la misión de oxígeno ya los usa. `src/ui/plateLabel.ts` es la etiqueta sobre placa oscura. En `balance.ts` se agrega `SOLAR_PANELS_BALANCE.boltsPerSecond`, y hay claves nuevas de i18n.
- Por qué: que la mecánica enseñe que la luz del Sol es la energía de la base y que el polvo la tapa. Respaldo: a Marte llega como máximo ~45 % de la luz que a la Tierra (NASA Mars Facts); el polvo apagó a Opportunity (2018) y a InSight (2022) (NASA/JPL).
- A quién afecta: B (spec 07, `src/minigames/solar-panels/*`), los minijuegos que quieran explicar antes de jugar (`src/minigames/howTo/`), `balance.ts`, `i18n`.
- ¿Avisado al equipo?: sí (este documento y el PR).

---

## 2026-11-15 — Se permite una tarjeta de explicación antes de un minijuego
- Quién: memocayar
- Qué se decidió: `AGENTS.md` §4 decía "nunca un bloque de texto antes de jugar". Ahora un minijuego puede abrir con una tarjeta de explicación cuando la mecánica enseña algo real: pasos con dibujitos, una línea por paso (máximo 4), un botón grande para empezar y el juego en pausa mientras se ve.
- Por qué: la Misión de oxígeno (PR #29) usa una tarjeta así para explicar MOXIE, y nos gustó cómo quedó.
- A quién afecta: todas (reglas de diseño, `AGENTS.md` §4).
- ¿Avisado al equipo?: pendiente (avisar a maviflora y jz-rs).

---

## 2026-11-14 — Misión de oxígeno: "Rompé la molécula", como MOXIE
- Quién: C (con Claude)
- Qué se decidió: el minijuego de oxígeno deja de ser "arrastrá burbujas de CO₂". Ahora el chico **solo alimenta a MOXIE**: arrastra (o toca) cada CO₂ (O–C–O) hasta la máquina. MOXIE tiene una **ventanita** para ver adentro: el CO₂ se pone naranja (800 °C), tiembla y se parte; el CO sale gris, como humo, por el caño gris; la O azul espera en uno de 2 lugarcitos ("¡Falta 1 CO₂!"); con dos O se juntan solas en O₂, que viaja por el caño azul al tanque ("¡+1 O₂!"). Así se ve sin leer que hacen falta 2 CO₂ para 1 O₂ (2 CO₂ → 2 CO + O₂). Colores con significado: azul = oxígeno (también dentro del CO₂, el mismo de la barra de oxígeno), gris = lo que sobra, naranja = calor, carbono oscuro. En `balance.ts`, `OXYGEN_FACTORY_BALANCE` cambia `bubblesGoal`, `bubblesOnScreen`, `bubbleSpeed` y `bubbleRadius` por `oxygenGoal`, `moleculesOnScreen`, `moleculeSpeed` y `atomRadius`. Rendimiento = CO₂ metidos / CO₂ necesarios + bonus de velocidad. Antes de que empiece el reloj, una tarjeta explica los 4 pasos con dibujitos y una línea cada uno, y un botón "¡A fabricar!"; mientras se juega, un panel a la izquierda muestra solo esos dibujitos con el paso actual marcado. **Contrato:** `MinigameScene` suma `pauseGame()` / `resumeGame()` (opcional; los demás minijuegos no cambian): mientras se muestra la explicación se frenan el reloj del minijuego y la base de atrás (barras, eventos, bots), así el chico no pierde mientras aprende. Si sale con la X, la base se reanuda. Cambia el texto de la instrucción y de `task.oxygen-factory.why`, y hay claves nuevas de i18n.
- Por qué: que la mecánica misma enseñe cómo se fabrica oxígeno en Marte, no solo el dato del final. Respaldo: NASA, "MOXIE Completes Mars Mission" (2023) y JPL, "MOXIE Could Help Future Rockets Launch Off Mars". Es la primera misión de la propuesta de misiones educativas; las demás esperan revisión.
- A quién afecta: B (spec 08, `src/minigames/oxygen-factory/*`), A y B (`MinigameScene.ts`, solo se agrega), `balance.ts`, `i18n`.
- ¿Avisado al equipo?: sí (este documento y el PR).

---

## 2026-11-15 — Ajustes de la intro después de probarla (spec 19)
- Quién: C (Emilia), con Claude
- Qué se decidió: al salir de una partida (resultado o ✕ en la base) se vuelve a la **nave** (cabina), no al mapa ni al monitor. El aterrizaje termina con un fundido a negro directo a la base (sin pantalla de "llegaste"). Los diálogos de la guía usan el panel y los botones normales del juego. En el monitor la pantalla grande muestra solo destino, nombre y fotos reales (el botón de la cámara pasa por **varias fotos NASA por destino**, en `src/content/locationGallery.ts`); la explicación, los objetivos y si se puede aterrizar aparecen con el botón i. La pantallita de ruta es un mini mapa de Marte. Los textos del manual son más explicativos.
- Por qué: pedido de C al probar la intro.
- A quién afecta: navegación (`ResultScene.ts`, `BaseScene.ts`: cambian a dónde vuelven), `i18n` (claves nuevas y textos del manual reescritos; se borraron `landing.arrived` y `landing.start`, que solo usaba el spec 19).
- ¿Avisado al equipo?: no todavía (va en el PR #33).

## 2026-11-15 — Se implementa la intro en la cabina (spec 19)
- Quién: C (Emilia), con Claude
- Qué se decidió: se programa la intro con los bocetos de la cabina como arte del juego (`public/assets/sprites/cabina/`), aunque el spec decía "no implementar". Escenas nuevas: `CabinScene` (cabina, bienvenida de la guía), `ManualScene` (tablet, 10 páginas), `MonitorScene` (consola de destinos) y `LandingScene` (aterrizaje). Decisiones que el spec dejaba abiertas:
  - **JUGAR lleva a la cabina**, no al mapa. Salir de la base y el botón "Mapa" de resultados llevan al **monitor**. `MarsMapScene` queda registrada pero ya no se llega a ella.
  - El **monitor se puede usar antes de leer el manual** (se exploran todos los destinos), pero ATERRIZAR queda bloqueado y la pantalla dice "Primero leé el manual". Regla en `landingBlocker()` de `src/core/progression.ts`, con test.
  - El progreso guarda dos datos nuevos: `welcomeSeen` y `manualDone`. Cerrar la tablet antes de terminar recuerda la página mientras el juego está abierto, no entre recargas.
  - Tocar a la guía repite la bienvenida. "Saltar" lleva al último mensaje (abrir el manual), así nunca se saltea el manual.
  - El botón FOTO del monitor muestra la foto en grande (con crédito) porque cada lugar tiene una sola foto por ahora; cuando haya galerías (spec 13) pasa a cambiar de foto. INFO muestra los objetivos.
  - Etiquetas de comparación: oxígeno y comida usan "La ciencia que nos inspira / Nuestra versión"; rover usa "En la vida real / En tu misión".
  - No se usa todavía el dato de los "7 minutos" del aterrizaje (falta verificarlo).
- Por qué: la persona quiso ver la intro jugable en el juego.
- A quién afecta: spec 11 y 02 (navegación desde JUGAR, `main.ts`, `sceneKeys.ts`), spec 12 (el monitor reemplaza al mapa), spec 05/04 (salida de la base), progreso guardado (`progressStorage.ts`), i18n, `layout.ts` y `balance.ts` (solo se agregaron valores).
- ¿Avisado al equipo?: no todavía.

## 2026-11-15 — El manual de misión es una tablet, no un libro (spec 19)
- Quién: C (Emilia), con Claude
- Qué se decidió: el manual se muestra en una **tablet de misión** (la que está apoyada en la consola izquierda de la cabina, vista de frente y en grande; ya no flota una tablet aparte), una página por pantalla. Su interfaz tiene **estética de pantalla**, distinta de los botones físicos de la consola: líneas celestes finas con brillo, esquinas tipo visor, barras por segmentos, líneas de escaneo y un destello breve al tocar. Las páginas de cada barra y del rover deben comparar la foto real de NASA con la representación del juego. La página de oxígeno sigue la nueva misión de MOXIE (spec 08). Maquetas en `docs/arte/bocetos/cabina/manual/` (no aprobadas).
- Por qué: el libro abierto no convenció; en una tablet, con texto claro sobre fondo oscuro, la letra chica se lee mejor y encaja con "objetos de hoy" de la guía de estilo.
- A quién afecta: spec 19 (escenas 1, 2 y 3; el libro de la cabina pasa a ser la tablet) y spec 13 (fotos para comparar).
- ¿Avisado al equipo?: no todavía.

## 2026-11-14 — Primer boceto de la cabina (spec 19): vista frontal inmersiva
- Quién: C (Emilia), con Claude
- Qué se decidió: se empieza a explorar el arte de la cabina aunque el spec 19 decía "no generar assets". El boceto vive en `docs/arte/bocetos/` (fuera de `public/`, el juego no lo usa) y no es arte aprobado. La cabina va en **vista frontal en perspectiva con punto de fuga**, más inmersiva, como `docs/arte/propuesta-3/2-sala.png`, y **no isométrica** como la base. Mismo estilo de pixel art y paleta que el kit. La ventana y el monitor tienen el vidrio/pantalla en magenta para poner después la foto real de Marte y la interfaz. La astronauta va aparte, como sprite, para que flote en gravedad cero.
- Por qué: la cabina es una escena fija donde se tocan objetos; una vista frontal la hace más inmersiva y deja el centro libre para la astronauta flotando.
- A quién afecta: spec 19 (perspectiva, que estaba pendiente), spec 11 (JUGAR lleva a la cabina), spec 13 (falta una foto real de Marte entero para la ventana).
- ¿Avisado al equipo?: no todavía.

## 2026-11-14 — Consolidar la intro antes de producir imágenes
- Quién: Emilia.
- Qué se decidió: volver a la planificación previa a generar imágenes y documentarla en el spec 19. Incluir comparación de fotos NASA con pixel art, eventos y comunicaciones demoradas. Los bocetos y prompts posteriores no constituyen arte aprobado; perspectiva y composición quedan pendientes.
- Por qué: cerrar el recorrido y el contenido antes de retomar la producción visual.
- A quién afecta: specs 01, 11, 12, 13 y nuevo spec 19. No se implementan cambios en misiones.
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
