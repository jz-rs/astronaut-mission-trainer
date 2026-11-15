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
| Lugar Jezero (`location.jezero.why`) | Fue un lago | NASA — misión Perseverance | ⚠️ falta link |
| Lugar Gale | Polvo: los paneles rinden menos | Simplificación del juego (basada en las tormentas de polvo) | ⚠️ |
| Lugar Olympus Mons | Volcán más alto; arriba hay menos aire | [ESA — Geography of Mars](https://www.esa.int/Science_Exploration/Space_Science/Mars_Express/Geography_of_Mars) | ✅ |
| Lugar casquete polar | Frío y meses de oscuridad | NASA — Mars facts | ⚠️ falta link |
| Lugar Valles Marineris | Cañón de 4.000 km | [ESA — Geography of Mars](https://www.esa.int/Science_Exploration/Space_Science/Mars_Express/Geography_of_Mars) | ✅ |
| Eventos (`data/events.json`) | 8 eventos reales: tormentas solares 2003/2017/2024, tormenta de polvo 2018, polvo de InSight 2022, moho 2016, viento de 2009, cosecha 2015 | El campo `source` de cada evento | ✅ |

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
| `public/assets/nasa/marte-valles-marineris-hemisferio.jpg` | Marte entero: hemisferio de Valles Marineris, mosaico de los Viking (achicada a 960 px). Para la ventana de la cabina (spec 18) | NASA/JPL/USGS | Dominio público (NASA/JPL) | [PIA00003](https://images.nasa.gov/details/PIA00003) |
| `public/assets/nasa/moxie-dentro-de-perseverance.jpg` | MOXIE (dorado) ya instalado dentro del rover Perseverance (achicada a 960 px). Tablet, página de oxígeno | NASA/JPL-Caltech | Dominio público (NASA/JPL) | [PIA24203](https://images.nasa.gov/details/PIA24203) |
| `public/assets/nasa/veggie-cosecha-lechuga.jpg` | El astronauta Steve Swanson cosecha lechuga romana roja crecida en Veggie, Estación Espacial Internacional, 10/06/2014 (achicada a 960 px). Tablet, página de comida | NASA | Dominio público (NASA) | [iss040e009116](https://images.nasa.gov/details/iss040e009116) |
| `public/assets/nasa/perseverance-selfie-ingenuity.jpg` | Selfie de Perseverance con el helicóptero Ingenuity, sol 46 (06/04/2021) (achicada a 960 px). Tablet, página del rover | NASA/JPL-Caltech/MSSS | Dominio público (NASA/JPL) | [PIA24542](https://images.nasa.gov/details/PIA24542) |
| `public/assets/sprites/biomas/sala-*-jezero.png` | Jezero desde el suelo, Perseverance (recortada, vista por la ventana de cada sala) | NASA/JPL-Caltech/ASU/MSSS | Dominio público (NASA/JPL) | [PIA24921](https://photojournal.jpl.nasa.gov/catalog/PIA24921) |
| `public/assets/sprites/biomas/sala-*-gale.png` | Monte Sharp, dentro del cráter Gale, visto por Curiosity (recortada, vista por la ventana de cada sala) | NASA/JPL-Caltech/MSSS | Dominio público (NASA/JPL) | [PIA16099](https://photojournal.jpl.nasa.gov/catalog/PIA16099) |
| `public/assets/sprites/biomas/sala-*-north-pole.png` | Llanura ártica de Vastitas Borealis (~68°N) vista por Phoenix, cerca del casquete pero no encima (recortada, vista por la ventana de cada sala) | NASA/JPL-Caltech/Univ. of Arizona/Texas A&M | Dominio público (NASA/JPL) | [PIA10713](https://photojournal.jpl.nasa.gov/catalog/PIA10713) |
| `public/assets/sprites/biomas/sala-*-olympus-mons.png` | Olympus Mons **desde órbita**, mosaico de los Viking (recortada, vista por la ventana de cada sala) | NASA/JPL/USGS | Dominio público (NASA/JPL) | [PIA00300](https://photojournal.jpl.nasa.gov/catalog/PIA00300) |
| `public/assets/sprites/biomas/sala-*-valles-marineris.png` | Valles Marineris **desde órbita**, mosaico de los Viking (recortada, vista por la ventana de cada sala) | NASA/JPL/USGS | Dominio público (NASA/JPL) | [PIA00425](https://photojournal.jpl.nasa.gov/catalog/PIA00425) |
