# NASA data and image sources

## Outdoor solar mission (spec 18, 2026-11-15)

| Presentation | Scientific source | Scope |
|---|---|---|
| Blue twilight near the Sun | [NASA/JPL — Curiosity views serene sundown](https://www.jpl.nasa.gov/news/nasas-curiosity-rover-views-serene-sundown-on-mars/) (2015) | Fine atmospheric dust makes blue light near the Sun more prominent at sunset. The game's pixel tint is an illustration, not a color-calibrated observation. |
| Polar ice crystals and frost | [NASA/JPL — Phoenix sees falling snow](https://www.jpl.nasa.gov/news/nasa-mars-lander-sees-falling-snow-soil-data-suggest-liquid-past/) (2008) | Phoenix detected snow falling from clouds near its Arctic landing site; that observation showed sublimation before the ground. The game's flakes and polar landscape are stylized, not a reconstruction of that landing site. |
| Exterior backgrounds and airlock sprites | [Generation record](arte/biomas/OUTDOOR_SOLAR_ART.md) | Generated pixel art of an imaginary human base, not NASA photographs. Olympus and Valles surface views are fictional illustrations, not images obtained by a landed mission. |

Dust-storm shading is a presentation of an existing hit event for its hit sol; it adds no stat penalty or new core rule. Day/night timing remains the existing shared gameplay simplification for all locations.

Record every scientific fact or real image used in the game here. This list is also shown on the game's Sources screen.

> ⚠️ Most NASA images are public domain, but **not all** (some belong to ESA, universities, or companies). Check each image's license before use and include the credit specified by its source (for example, "NASA/JPL-Caltech").

## Resources we plan to use

| Topic | Resource | URL |
|---|---|---|
| Space weather (solar storms) | DONKI | https://ccmc.gsfc.nasa.gov/tools/DONKI/ |
| Radiation, health, and shielding | OSDR RadLab | https://visualization.osdr.nasa.gov/radlab/gui/data-api/ |
| Human health in space | OSDR | https://osdr.nasa.gov/bio/repo/ |
| Mars maps and imagery | Mars Trek | https://trek.nasa.gov/mars/ |
| Images and APIs | api.nasa.gov | https://api.nasa.gov/ |

## Facts used in the game

Text keys in `src/i18n/*.json`. "Verified" = checked against the source (2026-11-14); still awaiting a second person's review.

| Where it appears | Fact | Source | Verified |
|---|---|---|---|
| Oxygen minigame (`task.oxygen-factory.why`) | MOXIE extracts oxygen from CO₂ in the air | Same MOXIE source below | ✅ |
| Panels minigame (`task.solar-panels.why`) | Mars gets less than half of Earth's sunlight (at most ~45 %); if dust covers the panels, there is no power | [NASA — Mars Surface Power Technology Decision](https://www.nasa.gov/wp-content/uploads/2024/12/acr24-mars-surface-power-decision.pdf) (2024) + the Opportunity mission-end source below | ✅ |
| Greenhouse minigame (`task.greenhouse.why`) | The base's plants grow under LED lights, also at night | [NASA NTRS — Veggie: space vegetables for the ISS and beyond](https://ntrs.nasa.gov/citations/20160004060) (red, blue and green LEDs) | ✅ |
| Shield minigame (`task.shield-wall.why`) | On Orion, during a solar storm, astronauts build a shelter with the supplies on board | [NASA Science — How NASA will protect astronauts from space radiation](https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation-at-the-moon/) | ✅ |
| Oxygen minigame (`task.oxygen-factory.fact`) | MOXIE made oxygen from Martian air | [NASA/JPL — MOXIE completes Mars mission](https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/) | ✅ |
| Oxygen minigame (`fact2`) | 122 g of oxygen ≈ what a small dog breathes in 10 hours | Same source | ✅ |
| Oxygen minigame (`fact3`) | Martian air is almost entirely CO₂ | Same source (MOXIE separates oxygen from CO₂ in the air) | ✅ |
| Panels minigame (`task.solar-panels.fact`, `minigame.solar-panels.guide1`) | Martian dust builds up on solar panels and takes away their power (the old "as fine as talcum powder" was removed: NASA says it about Moon dust, not Mars) | [NASA — InSight mission ends](https://www.nasa.gov/missions/insight/nasa-retires-insight-mars-lander-mission-after-years-of-science/), [NASA — Opportunity mission ends](https://www.nasa.gov/news-release/nasas-record-setting-opportunity-rover-mission-on-mars-comes-to-end) | ✅ |
| Panels minigame (`fact2`) | The 2018 dust storm shut down Opportunity | Same source | ✅ |
| Panels minigame (`fact3`) | Wind cleaned Spirit's panels in 2009 | [NASA/JPL — Spirit gets energy boost](https://www.jpl.nasa.gov/news/spirit-gets-energy-boost-from-cleaner-solar-panels/) | ✅ |
| Greenhouse minigame (`fact`, `fact3`) | Veggie lettuce on the ISS (2015), red romaine "Outredgeous" | [NASA — Veggie fact sheet](https://www.nasa.gov/wp-content/uploads/2019/04/veggie_fact_sheet_508.pdf) | ✅ |
| Greenhouse minigame (`fact2`) | Zinnias nearly died from mold (2016) and were saved | [Space.com, using NASA data](https://www.space.com/31658-zinnia-flowers-bloom-in-space-photo.html) | ✅ (secondary source) |
| Shield minigame (`fact`) | Mars lost its magnetic field ~4 billion years ago | [NASA SVS — Solar wind strips the Martian atmosphere](https://svs.gsfc.nasa.gov/4370/) | ✅ |
| Shield minigame (`fact2`) | May 2024: solar storm and auroras on Mars (MAVEN) | [NASA/JPL — NASA watches Mars light up during epic solar storm](https://www.jpl.nasa.gov/news/nasa-watches-mars-light-up-during-epic-solar-storm/) | ✅ |
| Shield minigame (`fact3`) | Curiosity measures radiation at the surface (RAD) | [NASA/JPL — 2017 storm](https://www.jpl.nasa.gov/news/large-solar-storm-sparks-global-aurora-and-doubles-radiation-levels-on-the-martian-surface/) | ✅ |
| Oxygen how-to card (`minigame.oxygen-factory.guide1`–`guide4`, `oven`) | MOXIE heats CO₂ to about 800 °C and takes one oxygen atom from each molecule; two O make O₂, so 2 CO₂ give 1 O₂ (the CO left over is released) | [NASA — MOXIE completes Mars mission](https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/), [NASA/JPL — MOXIE could help future rockets launch off Mars](https://www.jpl.nasa.gov/news/moxie-could-help-future-rockets-launch-off-mars/) | ✅ |
| Oxygen decoys (`minigame.oxygen-factory.notNitrogen`, `notArgon`) | Martian air also has a little nitrogen (N₂) and argon (Ar): about 95.3 % CO₂, 2.7 % N₂, 1.6 % Ar | [NASA/JPL — Mars at a Glance](https://www.jpl.nasa.gov/news/press_kits/insight/landing/facts/mars-at-a-glance/), [NASA — Mars Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html) | ✅ |
| Greenhouse how-to card (`minigame.greenhouse.guide1`, `marsSoil`, `toxicSoil`) | Martian soil has perchlorates, salts that are toxic to plants | [NASA Science — Bioweathering of Martian regolith](https://science.nasa.gov/biological-physical/investigations/efri-elis-kpmsg/), [NASA/JPL — Phoenix found perchlorates (2008)](https://www.jpl.nasa.gov/news/phoenix-mars-team-opens-window-on-scientific-process/) | ✅ |
| Greenhouse how-to card (`minigame.greenhouse.guide2`, `guide3`) | Plants need water and LED light; they take in CO₂ and give off O₂ | [NASA NTRS — Veggie: space vegetables for the ISS and beyond](https://ntrs.nasa.gov/citations/20160004060), [NASA — Third lettuce crop begins growing aboard station](https://www.nasa.gov/missions/station/third-lettuce-crop-begins-growing-aboard-station/) (photosynthesis is general science) | ✅ |
| Shield how-to card (`minigame.shield-wall.guide1`, `guide2`) | Earth's magnetic field shields it and Mars lost its own; water and regolith block radiation | [NASA Science — How NASA will protect astronauts from space radiation](https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation-at-the-moon/) + the NASA SVS source below | ✅ |
| Shield how-to card (`minigame.shield-wall.guide3`) | Curiosity measures radiation on the ground with its RAD instrument | [NASA Science — Radiation measurements on Mars](https://science.nasa.gov/resource/radiation-measurements-on-mars/) | ✅ |
| Crisis tablet (`crisis.solar-storm.*`, `crisis.dust-storm.*`) | Thick walls block radiation (Orion manikins, 2022); radiation specks on Curiosity's camera and auroras on Mars (May 2024); the 2018 global dust storm; Opportunity's dusty (2007) and clean (2014) panels | [NASA Science — How NASA will protect astronauts from space radiation](https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation-at-the-moon/), [NASA/JPL — NASA watches Mars light up during epic solar storm](https://www.jpl.nasa.gov/news/nasa-watches-mars-light-up-during-epic-solar-storm/), and each photo's NASA page in "Real images used" | ✅ |
| Rover (`rover.guide2`, `rover.guide4`, `rover.fact`) | Perseverance carries 43 tubes; each sample is a cylinder slightly thicker than a pencil, about the size of a piece of chalk | [NASA — A Martian Roundtrip: Perseverance Rover Sample Tubes](https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/a-martian-roundtrip-nasas-perseverance-rover-sample-tubes/) | ✅ |
| Rover (`rover.guide3`, `rover.contaminated`) | Tubes are sealed to prevent outside contamination; first sample sealed on 2021-09-01 | Same source + [NASA/JPL — Perseverance collects first Mars rock sample](https://www.jpl.nasa.gov/news/nasas-perseverance-rover-collects-first-mars-rock-sample/) | ✅ |
| Rover (`rover.guide1`) | Spirit got stuck in soft sand in 2009 (at "Troy") and never escaped | [NASA/JPL — Mars Rover Spirit](https://www.jpl.nasa.gov/missions/mars-exploration-rover-spirit-mer-spirit/), [NASA — Spirit embedded in soft soil](https://www.nasa.gov/image-article/spirit-embedded-soft-soil-mars-as-engineers-devise-methods-free-spirit/) | ✅ |
| Jezero location (`location.jezero.why`) | It used to be a lake | [NASA — Perseverance deciphers ancient history of Martian lake](https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-perseverance-rover-deciphers-ancient-history-of-martian-lake/) ("a lake that filled Jezero Crater billions of years ago") | ✅ |
| Gale location | Dust: panels produce less power | Game simplification (based on dust storms) | ⚠️ |
| Olympus Mons location | Tallest volcano; less air at the summit | [ESA — Geography of Mars](https://www.esa.int/Science_Exploration/Space_Science/Mars_Express/Geography_of_Mars) | ✅ |
| Polar cap location (`location.north-pole.why`) | Cold and months of darkness | [NASA Science — Growth and retreat of the CO₂ ice at the Martian poles](https://science.nasa.gov/photojournal/growth-and-retreat-of-the-co2-ice-at-the-martian-poles/) (in the polar night "the Sun is below the horizon for weeks or even months") | ✅ |
| Valles Marineris location | 4,000 km canyon | [ESA — Geography of Mars](https://www.esa.int/Science_Exploration/Space_Science/Mars_Express/Geography_of_Mars) | ✅ |
| Events (`data/events.json`) | 8 real events: solar storms in 2003/2017/2024, 2018 dust storm, InSight dust in 2022, mold in 2016, wind in 2009, harvest in 2015 | Each event's `source` field | ✅ |
| Manual, your mission (`manual.mission.fact`) | A sol lasts 24 h 39 min | [NASA/JPL — Mars at a Glance](https://www.jpl.nasa.gov/news/press_kits/insight/landing/facts/mars-at-a-glance/) | ✅ |
| Manual, oxygen | Martian air is almost entirely CO₂; MOXIE traveled inside Perseverance | Same MOXIE completes Mars mission source | ✅ |
| Manual, shield | Mars has no global magnetic field and its air is thin: more radiation reaches it | [NASA Science — Mars facts](https://science.nasa.gov/mars/facts/) | ⚠️ review needed |
| Manual, rover | Sojourner was the first rover on Mars (1997); Perseverance landed in Jezero in 2021 | [NASA — Mars Pathfinder](https://science.nasa.gov/mission/mars-pathfinder/), [NASA — Mars 2020](https://science.nasa.gov/mission/mars-2020-perseverance/) | ⚠️ review needed |
| Manual, communication (`manual.messages.fact`) | A signal takes 4 to 24 minutes between Mars and Earth, depending on where the planets are | [NASA Goddard — Space communications: 7 things you need to know](https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/) | ✅ |

## Which missions landed at each level?

The game's base is **fictional**: an imaginary future crewed mission. As of today (2026), **no one has been to Mars** and **NASA has no bases there**. All missions have been robots: stationary landers and rovers. No game text, image, or fact may imply that something landed at a location where it did not.

| Level | Has anything landed there? | Details | Source |
|---|---|---|---|
| Jezero crater | ✅ Yes | Perseverance (with the Ingenuity helicopter), 2021-02-18 | [NASA — Mars 2020 Perseverance](https://science.nasa.gov/mission/mars-2020-perseverance/) |
| Gale crater | ✅ Yes | Curiosity, 2012-08-06. Still working and climbing Mount Sharp. | [NASA — Curiosity](https://science.nasa.gov/mission/msl-curiosity/) |
| Polar cap | ⚠️ **Not on the cap itself** | Phoenix landed on 2008-05-25 on the Arctic plain (Vastitas Borealis, ~68°N), **near** the cap but not on it: the permanent cap starts at roughly 80°N. It found water ice beneath the soil. | [NASA — Phoenix](https://science.nasa.gov/mission/phoenix/) |
| Olympus Mons | ❌ **Never** | Only photos and measurements from orbit (Viking, Mars Global Surveyor, Mars Reconnaissance Orbiter). | [NASA PIA00300](https://images.nasa.gov/details/PIA00300) |
| Valles Marineris | ❌ **Never** | Only photos from orbit. | [NASA PIA00425](https://images.nasa.gov/details/PIA00425) |

**Consequences for the game:**
- Real photos of **Olympus Mons and Valles Marineris** are **from orbit** and must be presented that way (for example, "Real NASA photo, taken from orbit"). They cannot be shown as ground-level views.
- The ground-level **polar cap** photo is from **Phoenix**, on the nearby Arctic plain. The credit must state where it was taken.
- Olympus Mons height: the old Viking record (PIA00300, 1998) says 27 km. Mars Global Surveyor laser measurements (MOLA) give about 22 km above Mars' reference level, which is what the game uses.

## Real images used

| File | What it shows | Credit | License | Original URL |
|---|---|---|---|---|
| `public/assets/nasa/jezero.jpg` | Jezero from the ground: Perseverance's first high-resolution panorama (cropped) | NASA/JPL-Caltech/ASU/MSSS | Public domain (NASA/JPL) | [PIA23727](https://photojournal.jpl.nasa.gov/catalog/PIA23727) |
| `public/assets/nasa/gale.jpg` | Mount Sharp inside Gale crater, seen by Curiosity (cropped) | NASA/JPL-Caltech/MSSS | Public domain (NASA/JPL) | [PIA16099](https://photojournal.jpl.nasa.gov/catalog/PIA16099) |
| `public/assets/nasa/olympus-mons.jpg` | Olympus Mons from above, Viking mosaic (cropped) | NASA/JPL/USGS | Public domain (NASA/JPL) | [PIA00300](https://photojournal.jpl.nasa.gov/catalog/PIA00300) |
| `public/assets/nasa/north-pole.jpg` | Northern polar cap in summer, Mars Global Surveyor (cropped) | NASA/JPL/MSSS | Public domain (NASA/JPL) | [PIA02800](https://photojournal.jpl.nasa.gov/catalog/PIA02800) |
| `public/assets/nasa/valles-marineris.jpg` | Valles Marineris, Viking mosaic (cropped) | NASA/JPL/USGS | Public domain (NASA/JPL) | [PIA00422](https://photojournal.jpl.nasa.gov/catalog/PIA00422) |
| `public/assets/nasa/marte-disco-completo.jpg` | Whole Mars (round disk, Valles Marineris in the center), Viking mosaic (resized to 960 px). Cabin window and start of landing (spec 19) | NASA/JPL/USGS | Public domain (NASA/JPL) | [PIA00407](https://images.nasa.gov/details/PIA00407) |
| `public/assets/nasa/moxie-dentro-de-perseverance.jpg` | MOXIE (gold) installed inside the Perseverance rover (resized to 960 px). Tablet, oxygen page | NASA/JPL-Caltech | Public domain (NASA/JPL) | [PIA24203](https://images.nasa.gov/details/PIA24203) |
| `public/assets/nasa/veggie-lechugas-en-la-estacion.jpg` | Lettuce growing in Veggie aboard the International Space Station (2014). Tablet, food page (resized to 960 px) | NASA/JSC | Public domain (NASA) | [iss040e007676](https://images.nasa.gov/details/iss040e007676) |
| `public/assets/nasa/jezero-delta-desde-el-suelo.jpg` | Jezero's ancient river delta seen from the ground by Perseverance. Monitor, Jezero gallery (resized to 960 px) | NASA/JPL-Caltech/ASU/MSSS | Public domain (NASA) | [PIA24485](https://images.nasa.gov/details/PIA24485) |
| `public/assets/nasa/jezero-delta-panoramica.jpg` | Jezero delta panorama taken by Perseverance. Monitor, Jezero gallery (resized to 960 px) | NASA/JPL-Caltech/ASU/MSSS | Public domain (NASA) | [PIA25022](https://images.nasa.gov/details/PIA25022) |
| `public/assets/nasa/gale-desde-orbita.jpg` | Gale crater and Mount Sharp seen from orbit. Monitor, Gale gallery (resized to 960 px) | NASA/JPL-Caltech/ASU | Public domain (NASA) | [PIA14290](https://images.nasa.gov/details/PIA14290) |
| `public/assets/nasa/gale-capas-de-roca.jpg` | Rock layers on Mount Sharp seen by Curiosity. Monitor, Gale gallery (resized to 960 px) | NASA/JPL-Caltech/MSSS | Public domain (NASA) | [PIA19068](https://images.nasa.gov/details/PIA19068) |
| `public/assets/nasa/olympus-mons-color.jpg` | Olympus Mons in color, from orbit. Monitor, Olympus Mons gallery (resized to 960 px) | NASA/JPL | Public domain (NASA) | [PIA02982](https://images.nasa.gov/details/PIA02982) |
| `public/assets/nasa/north-pole-casquete-espiral.jpg` | Northern polar cap with spiral troughs, from orbit. Monitor, North Pole gallery (resized to 960 px) | NASA/JPL-Caltech/MSSS | Public domain (NASA) | [PIA13163](https://images.nasa.gov/details/PIA13163) |
| `public/assets/nasa/north-pole-capas-de-hielo.jpg` | Ice and dust layers at the edge of the northern cap (HiRISE). Monitor, North Pole gallery (resized to 960 px) | NASA/JPL-Caltech/Univ. of Arizona | Public domain (NASA) | [PIA21022](https://images.nasa.gov/details/PIA21022) |
| `public/assets/nasa/valles-marineris-mosaico.jpg` | Valles Marineris mosaic (THEMIS, Mars Odyssey). Monitor, Valles Marineris gallery (resized to 960 px) | NASA/JPL/Arizona State University | Public domain (NASA) | [PIA06926](https://images.nasa.gov/details/PIA06926) |
| `public/assets/nasa/perseverance-selfie-ingenuity.jpg` | Perseverance selfie with the Ingenuity helicopter, sol 46 (2021-04-06) (resized to 960 px). Tablet, rover page | NASA/JPL-Caltech/MSSS | Public domain (NASA/JPL) | [PIA24542](https://images.nasa.gov/details/PIA24542) |
| `public/assets/nasa/sol-llamarada-sdo.jpg` | X-class solar flare seen by the Solar Dynamics Observatory, 19/10/2014 (resized to 960 px). Crisis tablet, solar storm vote (spec 16) | NASA/GSFC/SDO | Public domain (NASA) | [GSFC_20171208_Archive_e000934](https://images.nasa.gov/details/GSFC_20171208_Archive_e000934) |
| `public/assets/nasa/orion-maniquies-radiacion.jpg` | The two radiation-measuring manikins (MARE) inside the Artemis I Orion crew module, 2022 (resized to 960 px). Crisis tablet, "take shelter" was right | NASA/Frank Michaux | Public domain (NASA) | [KSC-20220808-PH-FMX01_0011](https://images.nasa.gov/details/KSC-20220808-PH-FMX01_0011) |
| `public/assets/nasa/curiosity-radiacion-2024.jpg` | Curiosity navcam frame full of streaks and specks from the solar storm's charged particles, 20/05/2024. Crisis tablet, "go outside" was wrong | NASA/JPL-Caltech | Public domain (NASA/JPL) | [PIA26302](https://images.nasa.gov/details/PIA26302) |
| `public/assets/nasa/maven-auroras-2024.jpg` | Auroras across Mars' nightside detected by MAVEN during the May 2024 solar storm (resized to 960 px). Crisis tablet, solar storm reward | NASA/University of Colorado/LASP | Public domain (NASA) | [PIA26304](https://images.nasa.gov/details/PIA26304) |
| `public/assets/nasa/tormenta-de-polvo-2018.jpg` | Mars Reconnaissance Orbiter map of the 2018 global dust storm, with Opportunity and Curiosity marked. Crisis tablet, dust storm vote and "save energy" was right | NASA/JPL-Caltech/MSSS | Public domain (NASA/JPL) | [PIA22519](https://images.nasa.gov/details/PIA22519) |
| `public/assets/nasa/opportunity-paneles-2007.jpg` | Opportunity's solar panels photographed after the 2007 dust storm, to check how dusty they were (resized to 960 px). Crisis tablet, "clean panels" was wrong | NASA/JPL-Caltech/Cornell | Public domain (NASA/JPL) | [PIA15114](https://images.nasa.gov/details/PIA15114) |
| `public/assets/nasa/opportunity-limpio-2014.jpg` | Opportunity self-portrait after winds removed much of the dust from its panels, March 2014 (resized to 960 px). Crisis tablet, dust storm reward | NASA/JPL-Caltech/Cornell Univ./Arizona State Univ. | Public domain (NASA/JPL) | [PIA18079](https://images.nasa.gov/details/PIA18079) |
| `public/assets/sprites/biomas/sala-*-jezero.png` | Jezero from the ground, Perseverance (cropped, seen through each room's window) | NASA/JPL-Caltech/ASU/MSSS | Public domain (NASA/JPL) | [PIA24921](https://photojournal.jpl.nasa.gov/catalog/PIA24921) |
| `public/assets/sprites/biomas/sala-*-gale.png` | Mount Sharp inside Gale crater, seen by Curiosity (cropped, seen through each room's window) | NASA/JPL-Caltech/MSSS | Public domain (NASA/JPL) | [PIA16099](https://photojournal.jpl.nasa.gov/catalog/PIA16099) |
| `public/assets/sprites/biomas/sala-*-north-pole.png` | Vastitas Borealis Arctic plain (~68°N) seen by Phoenix, near the cap but not on it (cropped, seen through each room's window) | NASA/JPL-Caltech/Univ. of Arizona/Texas A&M | Public domain (NASA/JPL) | [PIA10713](https://photojournal.jpl.nasa.gov/catalog/PIA10713) |
| `public/assets/sprites/biomas/sala-*-olympus-mons.png` | Olympus Mons **from orbit**, Viking mosaic (cropped, seen through each room's window) | NASA/JPL/USGS | Public domain (NASA/JPL) | [PIA00300](https://photojournal.jpl.nasa.gov/catalog/PIA00300) |
| `public/assets/sprites/biomas/sala-*-valles-marineris.png` | Valles Marineris **from orbit**, Viking mosaic (cropped, seen through each room's window) | NASA/JPL/USGS | Public domain (NASA/JPL) | [PIA00425](https://photojournal.jpl.nasa.gov/catalog/PIA00425) |

## Music (NASA data sonifications)

Real telescope data turned into sound by NASA's *A Universe of Sound* project. NASA invites people to download them and use them in their own music ([NASA Data Sonifications](https://www.nasa.gov/data-sonifications/)). Only the audio track was kept (AAC, `.m4a`).

| File | What it is | When it plays | Credit | Original URL |
|---|---|---|---|---|
| `public/assets/audio/music-galactic-center.m4a` | Sonification of the center of the Milky Way (Chandra X-rays, Hubble optical, Spitzer infrared), 64 s | Background music of the whole game, looping | NASA/CXC/SAO/K. Arcand; SYSTEM Sounds (M. Russo, A. Santaguida) | [chandra.si.edu/sound/gcenter.html](https://chandra.si.edu/sound/gcenter.html) |
| `public/assets/audio/music-pillars-of-creation.m4a` | Sonification of the Pillars of Creation (M16, Chandra + Hubble), 30 s | Only at night in the base (after sunset); loops from second 10 | NASA/CXC/SAO/K. Arcand; SYSTEM Sounds (M. Russo, A. Santaguida) | [chandra.si.edu/sound/m16.html](https://chandra.si.edu/sound/m16.html) |

## Sound effects (real NASA recordings, except the tap)

Cut and converted to AAC (`.m4a`).

| File | What it is | When it plays | Credit | Original URL |
|---|---|---|---|---|
| `public/assets/audio/sfx-tap-bubble-pop.m4a` | A soft bubble "pop" (0.12 s), **synthesized for this game, not a NASA recording** (the team chose it over the NASA options because it fits the calm music) | Every touch on something that reacts (buttons, rooms, tools, molecules) | Made by the team for this project | — |
| `public/assets/audio/sfx-landing-artemis-liftoff.m4a` | The Artemis I launch (16/11/2022), 8 s: the rumble and the NASA announcer | The landing, while the cabin zooms toward the window | NASA | [liftoff1.mp3](https://www.nasa.gov/wp-content/uploads/2023/02/liftoff1.mp3) |
| `public/assets/audio/sfx-alert-apollo-quindar.m4a` | Two Quindar tones (0.25 s, 2525 Hz each, cut at 2.42 s and 3.82 s), the beeps Mission Control used to key the radio to spacecraft | A message from Earth (crisis warning) arrives in the base | NASA (public domain) | [578628main_hskquindar.mp3](https://www.nasa.gov/mp3/578628main_hskquindar.mp3), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Quindar_-_Sound_(1).mp3) |
| `public/assets/audio/sfx-error-insight-donk.m4a` | Two low "donks" (0.9 s): one "dink" of InSight's seismometer (SEIS) on Mars, sol 226 (16/07/2019), played an octave lower and then a bit lower again | Every wrong choice: N₂/Ar fed to MOXIE, Mars soil on a plant, the rover on soft sand | NASA/JPL-Caltech | [Cropped-Dinks-and-Donks-sample.wav](https://www.nasa.gov/wp-content/uploads/2015/01/Cropped-Dinks-and-Donks-sample.wav) (NASA [Sounds from Beyond](https://www.nasa.gov/sounds-from-beyond/)) |
