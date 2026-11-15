# 18 — Paneles solares afuera, bajo el cielo de Marte ☀️

## Approved scope extension — 2026-11-15

The workspace owner approved implementation across specs 04 and 06 (see `docs/DECISIONS.md`). This extension supersedes the exclusion of base-map changes below.

- Add the corner airlock as a pixel-art overlay shared by all base maps. Player and bot routes pass through it to the outdoor solar work spots.
- Show a quick airlock transition on entry and exit, and a suited astronaut celebrating clean panels.
- Add an optional minigame background hook and a live, read-only environment callback (sol time, night and dust-storm presentation). Other minigames retain their indoor backgrounds and immediate exit.
- Use five outdoor pixel-art PNG backgrounds at 1040 × 496. Preserve the Gemini Jezero original; unavailable private Gemini artwork may be recreated from that reference. Do not use code-drawn landscape mockups.
- Dust-storm presentation follows existing events without changing core rules or rewards. Olympus uses the common daytime sky until a darker sky is supported by a source.
- Additional owned files: `src/scenes/base/SolarAirlock.ts`, `src/scenes/base/AstronautSprite.ts`, `src/scenes/base/BaseScene.ts`, solar assets under `public/assets/sprites/energia/`, art source records under `docs/arte/biomas/`.
- Approved shared files: `src/minigames/MinigameScene.ts`, `src/ui/biomes.ts`, `src/ui/sprites.ts`, `src/ui/layout.ts`, `src/config/balance.ts`, `docs/DATA_SOURCES.md`.

## Implementation and validation — 2026-11-15

- Implemented: five outdoor backgrounds generated with ChatGPT, live Sun/twilight/weather, external battery, corner airlock and crew route, paused entry/exit crossing, and astronaut celebration.
- The owner approved the composition preview and requested the existing numbered cyan `StepGuide` UI. Production already uses that component unchanged; the browser preview now mirrors it. No replacement step-guide UI is required at merge.
- Shared types moved to `minigameTypes.ts` and remain re-exported from `MinigameScene.ts` for compatibility.
- Added lifecycle regression tests covering explanation pauses, result return transitions and cancellation without rewards.
- Automated validation: `npm run check` (56 tests) and production build. Existing lint size warnings remain in base/UI files.
- Pending manual acceptance: landscape phone input, children’s playtest, and final in-game visual review of the map overlay. The standalone preview is a composition review, not a substitute for that acceptance.

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | B (minijuego) + C (imágenes) | P1 | 2 | ⚪ Propuesto |

## Problema
Hoy, al tocar **Paneles solares**, el minijuego pasa **adentro de la sala de energía**: los paneles están en el piso de una habitación, se llenan de polvo de Marte y la luz entra por la ventana. Eso **no es real**, por tres motivos:
- adentro de una habitación no cae polvo de Marte;
- una ventana le quitaría luz a los paneles;
- en Marte los paneles solares van **afuera**, al aire libre, mirando al cielo, como los de InSight. En nuestro propio mapa de la base también están afuera, al lado de la sala de energía.

Un chico (o el jurado) que ya sabe algo de Marte lo nota, y el juego enseña algo falso.

## Objetivo
Al tocar **Paneles solares**, el minijuego de limpiar pasa **afuera, en el suelo de Marte**, con el cielo arriba. Todo lo demás de la misión sigue igual: la tarjeta que explica antes de jugar, limpiar como raspadita, los rayitos de energía que van a la batería y la regla de que de noche no se puede.

## Por qué importa
- Track *Junior Astronaut Mission Trainer*: lo que enseñamos tiene que ser verdad y estar respaldado por la NASA (ver `docs/DATA_SOURCES.md`).
- Es la única misión que da energía, así que es la que más se juega.

## Cómo se ve
- **Fondo afuera**: suelo de Marte del lugar donde está la base (Jezero, Gale, Polo Norte, Olympus Mons o Valles Marineris), con el costado de la sala de energía a un lado. El cable sale de los paneles y entra a la base, donde está la batería.
- **Cielo con el Sol**: arriba se ve el cielo y el Sol. El Sol sigue la barra del sol del HUD: a la mañana está alto y a medida que avanza el sol va bajando.
- **El color del cielo cuenta la hora**:
  - de día es color caramelo, el cielo real de Marte;
  - al atardecer, cerca del Sol, el cielo se pone **azul**: es un dato real, fotografiado por el rover Curiosity;
  - de noche se ve el mismo tono violeta que la base (`ui/nightfall.ts`).
- **Polvo que cae del cielo**: en los lugares difíciles (Gale) el polvo que vuelve se ve caer como una tormenta, no aparecer de golpe.
- **Rayos de Sol**: van directo del Sol del cielo a los paneles; ya no pasan por la ventana.

## Alcance
**Incluye:**
- un fondo "afuera" por lugar para esta misión, en lugar de la foto de la sala;
- el Sol y el cielo que cambian con la barra del sol;
- sacar la luz que entra por la ventana (`WINDOW_GLASS` en `SolarPanelsMinigame.ts` y `darkenWindow` en `solarStation.ts`);
- actualizar la tarjeta de explicación si hace falta, por ejemplo con un dibujito del cielo.

**No incluye:**
- cambiar las otras misiones (oxígeno, invernadero y escudo siguen adentro, y está bien: esas máquinas sí van adentro);
- cambiar el mapa de la base;
- cambiar la regla de día y noche (`src/core/daylight.ts`).

## Criterios de aceptación
- [ ] Al tocar Paneles solares, el minijuego se ve afuera, en el suelo de Marte, con el cielo arriba. No se ve ninguna habitación.
- [ ] El fondo corresponde al lugar de la partida (5 lugares).
- [ ] El Sol está más alto a la mañana y más bajo cuanto más avanzó el sol; al atardecer el cielo cerca del Sol es azul.
- [ ] Los rayos de luz van del Sol a los paneles: fuertes en los paneles limpios, débiles donde hay polvo.
- [ ] En Gale el polvo que vuelve se ve caer del cielo.
- [ ] El cable va de los paneles a la batería de la base, y los rayitos de energía siguen llegando.
- [ ] Se sigue entendiendo qué hacer sin leer (probarlo con alguien de 7 a 12 años).
- [ ] La tarjeta de explicación, el rendimiento, la dificultad y el bloqueo de noche funcionan igual que antes.
- [ ] El dato del final está respaldado (Curiosity y el atardecer azul; luz en Marte ≤ 45 % de la de la Tierra), con su fuente en `docs/DATA_SOURCES.md`.
- [ ] `npm run check` pasa.

## Archivos
**Propios (los puede modificar):** `src/minigames/solar-panels/*`, las imágenes nuevas de afuera en `public/assets/sprites/biomas/`.
**Contratos que usa (no modificar sin avisar):**
- `MinigameScene.ts` (spec 06): hoy dibuja siempre la sala de la tarea (`drawRoom`). Hace falta una forma **opcional** de que un minijuego use otro fondo, por ejemplo un método `protected` que se pueda reemplazar. ⚠️ Es un cambio de contrato: avisar a A y B.
- `ui/biomes.ts` (la imagen de cada lugar), `ui/sprites.ts`, `ui/nightfall.ts`, `palette.ts`, `balance.ts`, `i18n`.

## Dependencias
**Depende de:** 07 (minijuego de paneles), 01 (estilo de las imágenes), DECISIONS 2026-11-15 (día y noche).
**Bloquea a:** nada.

## Preguntas abiertas
- ¿El fondo de afuera se hace como imagen nueva en pixel art (5 imágenes, una por lugar) o se dibuja con código (cielo y suelo con los colores de la paleta, más piedras)? Lo primero se ve mejor; lo segundo es más rápido y pesa menos.
- ¿Se ve al astronauta con traje limpiando, o solo la mano o el dedo?
- ¿Mostramos una transición corta de "salir por la esclusa" al entrar, o se pasa directo a afuera?

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
