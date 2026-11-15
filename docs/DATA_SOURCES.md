# Fuentes de datos e imágenes de NASA

Todo dato científico o imagen real que aparezca en el juego se registra acá. Esta lista se muestra también en la pantalla de Fuentes del juego.

> ⚠️ La mayoría de las imágenes de NASA son de dominio público, pero **no todas** (algunas son de ESA, universidades o empresas). Verificá la licencia de cada imagen antes de usarla y poné el crédito que indique la fuente (por ejemplo "NASA/JPL-Caltech").

## Recursos que vamos a usar

| Tema | Recurso | URL |
|---|---|---|
| Clima espacial (tormentas solares) | DONKI | https://ccmc.gsfc.nasa.gov/tools/DONKI/ |
| Radiación, salud y blindaje | OSDR RadLab | https://visualization.osdr.nasa.gov/radlab/gui/data-api/ |
| Salud humana en el espacio | OSDR | https://osdr.nasa.gov/bio/repo/ |
| Mapas e imágenes de Marte | Mars Trek | https://trek.nasa.gov/mars/ |
| Imágenes y APIs | api.nasa.gov | https://api.nasa.gov/ |

## Datos usados en el juego

Claves de texto en `src/i18n/*.json`. "Verificado" = el dato se chequeó contra la fuente (2026-11-14); falta la revisión de una segunda persona.

| Dónde aparece | Dato | Fuente | Verificado |
|---|---|---|---|
| Minijuego oxígeno (`task.oxygen-factory.why`) | MOXIE le saca el oxígeno al CO₂ del aire | ídem MOXIE | ✅ |
| Minijuego paneles (`why`) | El polvo tapa los paneles y deja sin energía | ídem fin de Opportunity | ✅ |
| Minijuego invernadero (`why`) | En la ISS los astronautas riegan las plantas de Veggie | ídem Veggie fact sheet | ✅ |
| Minijuego escudo (`why`) | El agua y el regolito frenan la radiación | Falta fuente NASA (blindaje con agua/regolito) | ⚠️ falta link |
| Minijuego oxígeno (`task.oxygen-factory.fact`) | MOXIE fabricó oxígeno con el aire de Marte | [NASA/JPL — MOXIE completes Mars mission](https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/) | ✅ |
| Minijuego oxígeno (`fact2`) | 122 g de oxígeno ≈ lo que respira un perrito en 10 horas | ídem | ✅ |
| Minijuego oxígeno (`fact3`) | El aire de Marte es casi todo CO₂ | ídem (MOXIE separa el oxígeno del CO₂ del aire) | ✅ |
| Minijuego paneles (`fact`) | El polvo de Marte es muy fino y tapa los paneles | [NASA — fin de Opportunity](https://www.nasa.gov/news-release/nasas-record-setting-opportunity-rover-mission-on-mars-comes-to-end) | ⚠️ falta fuente para "como talco" |
| Minijuego paneles (`fact2`) | Tormenta de polvo de 2018 apagó a Opportunity | ídem | ✅ |
| Minijuego paneles (`fact3`) | En 2009 un viento limpió los paneles de Spirit | [NASA/JPL — Spirit gets energy boost](https://www.jpl.nasa.gov/news/spirit-gets-energy-boost-from-cleaner-solar-panels/) | ✅ |
| Minijuego invernadero (`fact`, `fact3`) | Lechuga de Veggie en la ISS (2015), romana roja "Outredgeous" | [NASA — Veggie fact sheet](https://www.nasa.gov/wp-content/uploads/2019/04/veggie_fact_sheet_508.pdf) | ✅ |
| Minijuego invernadero (`fact2`) | Zinnias casi mueren por moho (2016) y se salvaron | [Space.com, con datos de NASA](https://www.space.com/31658-zinnia-flowers-bloom-in-space-photo.html) | ✅ (fuente secundaria) |
| Minijuego escudo (`fact`) | Marte perdió su campo magnético hace ~4.000 millones de años | [NASA SVS — Solar wind strips the Martian atmosphere](https://svs.gsfc.nasa.gov/4370/) | ✅ |
| Minijuego escudo (`fact2`) | Mayo 2024: tormenta solar y auroras en Marte (MAVEN) | [NASA/JPL vía Phys.org](https://phys.org/news/2024-06-nasa-mars-epic-solar-storm.html) | ✅ |
| Minijuego escudo (`fact3`) | Curiosity mide la radiación en el suelo (RAD) | [NASA/JPL — tormenta de 2017](https://www.jpl.nasa.gov/news/large-solar-storm-sparks-global-aurora-and-doubles-radiation-levels-on-the-martian-surface/) | ✅ |
| Rover (`rover.guide2`, `rover.guide4`, `rover.fact`) | Perseverance lleva 43 tubos; cada muestra es un cilindro un poco más grueso que un lápiz, del tamaño de una tiza | [NASA — A Martian Roundtrip: Perseverance Rover Sample Tubes](https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/a-martian-roundtrip-nasas-perseverance-rover-sample-tubes/) | ✅ |
| Rover (`rover.guide3`, `rover.contaminated`) | Los tubos se sellan para que nada de afuera contamine la muestra; primera muestra sellada el 1/9/2021 | ídem + [NASA/JPL — Perseverance collects first Mars rock sample](https://www.jpl.nasa.gov/news/nasas-perseverance-rover-collects-first-mars-rock-sample/) | ✅ |
| Rover (`rover.guide1`) | El rover Spirit quedó atrapado en arena blanda en 2009 (en "Troy") y nunca pudo salir | [NASA/JPL — Mars Rover Spirit](https://www.jpl.nasa.gov/missions/mars-exploration-rover-spirit-mer-spirit/), [NASA — Spirit embedded in soft soil](https://www.nasa.gov/image-article/spirit-embedded-soft-soil-mars-as-engineers-devise-methods-free-spirit/) | ✅ |
| Lugar Jezero (`location.jezero.why`) | Fue un lago | NASA — misión Perseverance | ⚠️ falta link |
| Lugar Gale | Polvo: los paneles rinden menos | Simplificación del juego (basada en las tormentas de polvo) | ⚠️ |
| Lugar Olympus Mons | Volcán más alto; arriba hay menos aire | [ESA — Geography of Mars](https://www.esa.int/Science_Exploration/Space_Science/Mars_Express/Geography_of_Mars) | ✅ |
| Lugar casquete polar | Frío y meses de oscuridad | NASA — Mars facts | ⚠️ falta link |
| Lugar Valles Marineris | Cañón de 4.000 km | [ESA — Geography of Mars](https://www.esa.int/Science_Exploration/Space_Science/Mars_Express/Geography_of_Mars) | ✅ |
| Eventos (`data/events.json`) | 8 eventos reales: tormentas solares 2003/2017/2024, tormenta de polvo 2018, polvo de InSight 2022, moho 2016, viento de 2009, cosecha 2015 | El campo `source` de cada evento | ✅ |
| Manual, tu misión (`manual.page.mission`) | Un sol dura 24 h 39 min | [NASA Science — Mars facts](https://science.nasa.gov/mars/facts/) | ⚠️ revisar |
| Manual, oxígeno | El aire de Marte es casi todo CO₂; MOXIE viajó dentro de Perseverance | ídem MOXIE completes Mars mission | ✅ |
| Manual, escudo | Marte no tiene campo magnético global y su aire es fino: llega más radiación | [NASA Science — Mars facts](https://science.nasa.gov/mars/facts/) | ⚠️ revisar |
| Manual, rover | Sojourner fue el primer rover en Marte (1997); Perseverance aterrizó en Jezero en 2021 | [NASA — Mars Pathfinder](https://science.nasa.gov/mission/mars-pathfinder/), [NASA — Mars 2020](https://science.nasa.gov/mission/mars-2020-perseverance/) | ⚠️ revisar |
| Manual, comunicación | Un mensaje tarda entre ~5 y ~20 minutos entre Marte y la Tierra | [NASA Science — Mars facts](https://science.nasa.gov/mars/facts/) | ⚠️ revisar |

## ¿Qué misiones aterrizaron en cada nivel?

La base del juego es **ficción**: es una misión tripulada imaginaria del futuro. Hasta hoy (2026) **nadie fue a Marte** y **la NASA no tiene bases allá**. Todas las misiones fueron robots: sondas fijas y rovers. Ningún texto, imagen ni dato del juego puede dar a entender que en un lugar aterrizó algo que no aterrizó.

| Nivel | ¿Aterrizó algo? | Detalle | Fuente |
|---|---|---|---|
| Cráter Jezero | ✅ Sí | Perseverance (con el helicóptero Ingenuity), 18/02/2021 | [NASA — Mars 2020 Perseverance](https://science.nasa.gov/mission/mars-2020-perseverance/) |
| Cráter Gale | ✅ Sí | Curiosity, 06/08/2012. Sigue trabajando y sube por el Monte Sharp. | [NASA — Curiosity](https://science.nasa.gov/mission/msl-curiosity/) |
| Casquete polar | ⚠️ **Sobre el casquete, no** | Phoenix bajó el 25/05/2008 en la llanura ártica (Vastitas Borealis, ~68°N), **cerca** del casquete pero no encima: el casquete permanente empieza más o menos a los 80°N. Encontró hielo de agua bajo el suelo. | [NASA — Phoenix](https://science.nasa.gov/mission/phoenix/) |
| Olympus Mons | ❌ **Nunca** | Solo fotos y mediciones desde órbita (Viking, Mars Global Surveyor, Mars Reconnaissance Orbiter). | [NASA PIA00300](https://images.nasa.gov/details/PIA00300) |
| Valles Marineris | ❌ **Nunca** | Solo fotos desde órbita. | [NASA PIA00425](https://images.nasa.gov/details/PIA00425) |

**Consecuencias para el juego:**
- Las fotos reales de **Olympus Mons y Valles Marineris** son **desde órbita** y así hay que presentarlas (por ejemplo, "Foto real NASA, tomada desde órbita"). No se las puede mostrar como si fueran una vista desde el suelo.
- La foto del **casquete polar** desde el suelo es de **Phoenix**, en la llanura ártica cercana. El crédito tiene que decir dónde se tomó.
- La altura de Olympus Mons: la ficha vieja de Viking (PIA00300, 1998) dice 27 km. Las mediciones láser de Mars Global Surveyor (MOLA) dan unos 22 km sobre el nivel de referencia de Marte, que es lo que usa el juego.

## Imágenes reales usadas

| Archivo | Qué muestra | Crédito | Licencia | URL original |
|---|---|---|---|---|
| `public/assets/nasa/jezero.jpg` | Jezero desde el suelo: primera panorámica en alta resolución de Perseverance (recortada) | NASA/JPL-Caltech/ASU/MSSS | Dominio público (NASA/JPL) | [PIA23727](https://photojournal.jpl.nasa.gov/catalog/PIA23727) |
| `public/assets/nasa/gale.jpg` | Monte Sharp, dentro del cráter Gale, visto por Curiosity (recortada) | NASA/JPL-Caltech/MSSS | Dominio público (NASA/JPL) | [PIA16099](https://photojournal.jpl.nasa.gov/catalog/PIA16099) |
| `public/assets/nasa/olympus-mons.jpg` | Olympus Mons visto desde arriba, mosaico de los Viking (recortada) | NASA/JPL/USGS | Dominio público (NASA/JPL) | [PIA00300](https://photojournal.jpl.nasa.gov/catalog/PIA00300) |
| `public/assets/nasa/north-pole.jpg` | Casquete polar norte en verano, Mars Global Surveyor (recortada) | NASA/JPL/MSSS | Dominio público (NASA/JPL) | [PIA02800](https://photojournal.jpl.nasa.gov/catalog/PIA02800) |
| `public/assets/nasa/valles-marineris.jpg` | Valles Marineris, mosaico de los Viking (recortada) | NASA/JPL/USGS | Dominio público (NASA/JPL) | [PIA00422](https://photojournal.jpl.nasa.gov/catalog/PIA00422) |
| `public/assets/nasa/marte-disco-completo.jpg` | Marte entero (disco redondo, con Valles Marineris en el centro), mosaico de los Viking (achicada a 960 px). Para la ventana de la cabina y el inicio del aterrizaje (spec 19) | NASA/JPL/USGS | Dominio público (NASA/JPL) | [PIA00407](https://images.nasa.gov/details/PIA00407) |
| `public/assets/nasa/moxie-dentro-de-perseverance.jpg` | MOXIE (dorado) ya instalado dentro del rover Perseverance (achicada a 960 px). Tablet, página de oxígeno | NASA/JPL-Caltech | Dominio público (NASA/JPL) | [PIA24203](https://images.nasa.gov/details/PIA24203) |
| `public/assets/nasa/veggie-lechugas-en-la-estacion.jpg` | Lechugas creciendo en Veggie, dentro de la Estación Espacial Internacional (2014). Tablet, página de comida (achicada a 960 px) | NASA/JSC | Dominio público (NASA) | [iss040e007676](https://images.nasa.gov/details/iss040e007676) |
| `public/assets/nasa/jezero-delta-desde-el-suelo.jpg` | El delta del antiguo río de Jezero visto desde el suelo por Perseverance. Monitor, galería de Jezero (achicada a 960 px) | NASA/JPL-Caltech/ASU/MSSS | Dominio público (NASA) | [PIA24485](https://images.nasa.gov/details/PIA24485) |
| `public/assets/nasa/jezero-delta-panoramica.jpg` | Panorámica del delta de Jezero tomada por Perseverance. Monitor, galería de Jezero (achicada a 960 px) | NASA/JPL-Caltech/ASU/MSSS | Dominio público (NASA) | [PIA25022](https://images.nasa.gov/details/PIA25022) |
| `public/assets/nasa/gale-desde-orbita.jpg` | El cráter Gale y el Monte Sharp vistos desde órbita. Monitor, galería de Gale (achicada a 960 px) | NASA/JPL-Caltech/ASU | Dominio público (NASA) | [PIA14290](https://images.nasa.gov/details/PIA14290) |
| `public/assets/nasa/gale-capas-de-roca.jpg` | Capas de roca en el Monte Sharp vistas por Curiosity. Monitor, galería de Gale (achicada a 960 px) | NASA/JPL-Caltech/MSSS | Dominio público (NASA) | [PIA19068](https://images.nasa.gov/details/PIA19068) |
| `public/assets/nasa/olympus-mons-color.jpg` | Olympus Mons en color, desde órbita. Monitor, galería de Olympus Mons (achicada a 960 px) | NASA/JPL | Dominio público (NASA) | [PIA02982](https://images.nasa.gov/details/PIA02982) |
| `public/assets/nasa/north-pole-casquete-espiral.jpg` | El casquete polar norte con sus valles en espiral, desde órbita. Monitor, galería del Polo Norte (achicada a 960 px) | NASA/JPL-Caltech/MSSS | Dominio público (NASA) | [PIA13163](https://images.nasa.gov/details/PIA13163) |
| `public/assets/nasa/north-pole-capas-de-hielo.jpg` | Capas de hielo y polvo en el borde del casquete norte (HiRISE). Monitor, galería del Polo Norte (achicada a 960 px) | NASA/JPL-Caltech/Univ. of Arizona | Dominio público (NASA) | [PIA21022](https://images.nasa.gov/details/PIA21022) |
| `public/assets/nasa/valles-marineris-mosaico.jpg` | Mosaico de Valles Marineris (THEMIS, Mars Odyssey). Monitor, galería de Valles Marineris (achicada a 960 px) | NASA/JPL/Arizona State University | Dominio público (NASA) | [PIA06926](https://images.nasa.gov/details/PIA06926) |
| `public/assets/nasa/perseverance-selfie-ingenuity.jpg` | Selfie de Perseverance con el helicóptero Ingenuity, sol 46 (06/04/2021) (achicada a 960 px). Tablet, página del rover | NASA/JPL-Caltech/MSSS | Dominio público (NASA/JPL) | [PIA24542](https://images.nasa.gov/details/PIA24542) |
| `public/assets/nasa/sol-llamarada-sdo.jpg` | X-class solar flare seen by the Solar Dynamics Observatory, 19/10/2014 (resized to 960 px). Crisis tablet, solar storm vote (spec 16) | NASA/GSFC/SDO | Public domain (NASA) | [GSFC_20171208_Archive_e000934](https://images.nasa.gov/details/GSFC_20171208_Archive_e000934) |
| `public/assets/nasa/orion-maniquies-radiacion.jpg` | The two radiation-measuring manikins (MARE) inside the Artemis I Orion crew module, 2022 (resized to 960 px). Crisis tablet, "take shelter" was right | NASA/Frank Michaux | Public domain (NASA) | [KSC-20220808-PH-FMX01_0011](https://images.nasa.gov/details/KSC-20220808-PH-FMX01_0011) |
| `public/assets/nasa/curiosity-radiacion-2024.jpg` | Curiosity navcam frame full of streaks and specks from the solar storm's charged particles, 20/05/2024. Crisis tablet, "go outside" was wrong | NASA/JPL-Caltech | Public domain (NASA/JPL) | [PIA26302](https://images.nasa.gov/details/PIA26302) |
| `public/assets/nasa/maven-auroras-2024.jpg` | Auroras across Mars' nightside detected by MAVEN during the May 2024 solar storm (resized to 960 px). Crisis tablet, solar storm reward | NASA/University of Colorado/LASP | Public domain (NASA) | [PIA26304](https://images.nasa.gov/details/PIA26304) |
| `public/assets/nasa/tormenta-de-polvo-2018.jpg` | Mars Reconnaissance Orbiter map of the 2018 global dust storm, with Opportunity and Curiosity marked. Crisis tablet, dust storm vote and "save energy" was right | NASA/JPL-Caltech/MSSS | Public domain (NASA/JPL) | [PIA22519](https://images.nasa.gov/details/PIA22519) |
| `public/assets/nasa/opportunity-paneles-2007.jpg` | Opportunity's solar panels photographed after the 2007 dust storm, to check how dusty they were (resized to 960 px). Crisis tablet, "clean panels" was wrong | NASA/JPL-Caltech/Cornell | Public domain (NASA/JPL) | [PIA15114](https://images.nasa.gov/details/PIA15114) |
| `public/assets/nasa/opportunity-limpio-2014.jpg` | Opportunity self-portrait after winds removed much of the dust from its panels, March 2014 (resized to 960 px). Crisis tablet, dust storm reward | NASA/JPL-Caltech/Cornell Univ./Arizona State Univ. | Public domain (NASA/JPL) | [PIA18079](https://images.nasa.gov/details/PIA18079) |
| `public/assets/sprites/biomas/sala-*-jezero.png` | Jezero desde el suelo, Perseverance (recortada, vista por la ventana de cada sala) | NASA/JPL-Caltech/ASU/MSSS | Dominio público (NASA/JPL) | [PIA24921](https://photojournal.jpl.nasa.gov/catalog/PIA24921) |
| `public/assets/sprites/biomas/sala-*-gale.png` | Monte Sharp, dentro del cráter Gale, visto por Curiosity (recortada, vista por la ventana de cada sala) | NASA/JPL-Caltech/MSSS | Dominio público (NASA/JPL) | [PIA16099](https://photojournal.jpl.nasa.gov/catalog/PIA16099) |
| `public/assets/sprites/biomas/sala-*-north-pole.png` | Llanura ártica de Vastitas Borealis (~68°N) vista por Phoenix, cerca del casquete pero no encima (recortada, vista por la ventana de cada sala) | NASA/JPL-Caltech/Univ. of Arizona/Texas A&M | Dominio público (NASA/JPL) | [PIA10713](https://photojournal.jpl.nasa.gov/catalog/PIA10713) |
| `public/assets/sprites/biomas/sala-*-olympus-mons.png` | Olympus Mons **desde órbita**, mosaico de los Viking (recortada, vista por la ventana de cada sala) | NASA/JPL/USGS | Dominio público (NASA/JPL) | [PIA00300](https://photojournal.jpl.nasa.gov/catalog/PIA00300) |
| `public/assets/sprites/biomas/sala-*-valles-marineris.png` | Valles Marineris **desde órbita**, mosaico de los Viking (recortada, vista por la ventana de cada sala) | NASA/JPL/USGS | Dominio público (NASA/JPL) | [PIA00425](https://photojournal.jpl.nasa.gov/catalog/PIA00425) |

## Music (NASA data sonifications)

Real telescope data turned into sound by NASA's *A Universe of Sound* project. NASA invites people to download them and use them in their own music ([NASA Data Sonifications](https://www.nasa.gov/data-sonifications/)). Only the audio track was kept (AAC, `.m4a`).

| File | What it is | When it plays | Credit | Original URL |
|---|---|---|---|---|
| `public/assets/audio/music-galactic-center.m4a` | Sonification of the center of the Milky Way (Chandra X-rays, Hubble optical, Spitzer infrared), 64 s | Background music of the whole game, looping | NASA/CXC/SAO/K. Arcand; SYSTEM Sounds (M. Russo, A. Santaguida) | [chandra.si.edu/sound/gcenter.html](https://chandra.si.edu/sound/gcenter.html) |
| `public/assets/audio/music-pillars-of-creation.m4a` | Sonification of the Pillars of Creation (M16, Chandra + Hubble), 30 s | Base at night, in storms, failures, crisis meetings and when a bar is low; loops from second 10 | NASA/CXC/SAO/K. Arcand; SYSTEM Sounds (M. Russo, A. Santaguida) | [chandra.si.edu/sound/m16.html](https://chandra.si.edu/sound/m16.html) |

## Sound effects (real NASA recordings)

Cut and converted to AAC (`.m4a`).

| File | What it is | When it plays | Credit | Original URL |
|---|---|---|---|---|
| `public/assets/audio/sfx-tap-webb-star.m4a` | One star note (0.4 s, the first note of the "Stars Only" track) from the sonification of Webb's Cosmic Cliffs (Carina Nebula) | Every touch on something that reacts (buttons, rooms, tools, molecules) | NASA, ESA, CSA, STScI; sonification: Chandra X-ray Center and SYSTEM Sounds (M. Russo, A. Santaguida) | [chandra.si.edu/sound/carina.html](https://chandra.si.edu/sound/carina.html) |
| `public/assets/audio/sfx-landing-artemis-liftoff.m4a` | The Artemis I launch (16/11/2022), 8 s | The landing, while the cabin zooms toward the window | NASA | [liftoff1.mp3](https://www.nasa.gov/wp-content/uploads/2023/02/liftoff1.mp3) |

