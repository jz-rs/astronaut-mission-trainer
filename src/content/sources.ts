/**
 * Spec 13 — What the Sources screen lists. Keep it in sync with docs/DATA_SOURCES.md.
 * Labels are proper names of NASA pages, so they are not translated.
 */
export interface SourceLink {
  label: string;
  url: string;
}

export const SOURCE_LINKS: readonly SourceLink[] = [
  {
    label: 'MOXIE (Perseverance) — NASA/JPL',
    url: 'https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/',
  },
  {
    label: 'Opportunity y la tormenta de 2018 — NASA',
    url: 'https://www.nasa.gov/news-release/nasas-record-setting-opportunity-rover-mission-on-mars-comes-to-end',
  },
  {
    label: 'Spirit: viento que limpia paneles — NASA/JPL',
    url: 'https://www.jpl.nasa.gov/news/spirit-gets-energy-boost-from-cleaner-solar-panels/',
  },
  {
    label: 'Veggie en la Estación Espacial — NASA',
    url: 'https://www.nasa.gov/wp-content/uploads/2019/04/veggie_fact_sheet_508.pdf',
  },
  {
    label: 'Viento solar y atmósfera de Marte — NASA SVS',
    url: 'https://svs.gsfc.nasa.gov/4370/',
  },
  {
    label: 'Tormenta solar de 2017 en Marte — NASA/JPL',
    url: 'https://www.jpl.nasa.gov/news/large-solar-storm-sparks-global-aurora-and-doubles-radiation-levels-on-the-martian-surface/',
  },
  {
    label: 'Tormenta solar de mayo 2024 en Marte — NASA/JPL',
    url: 'https://www.jpl.nasa.gov/news/nasa-watches-mars-light-up-during-epic-solar-storm/',
  },
  {
    label: 'Geografía de Marte — ESA',
    url: 'https://www.esa.int/Science_Exploration/Space_Science/Mars_Express/Geography_of_Mars',
  },
  {
    label: 'Luz del Sol y energía en Marte — NASA',
    url: 'https://www.nasa.gov/wp-content/uploads/2024/12/acr24-mars-surface-power-decision.pdf',
  },
  {
    label: 'InSight y el polvo en sus paneles — NASA',
    url: 'https://www.nasa.gov/missions/insight/nasa-retires-insight-mars-lander-mission-after-years-of-science/',
  },
  {
    label: 'Cómo funciona MOXIE — NASA/JPL',
    url: 'https://www.jpl.nasa.gov/news/moxie-could-help-future-rockets-launch-off-mars/',
  },
  {
    label: 'Marte de un vistazo: aire, sol, frío — NASA/JPL',
    url: 'https://www.jpl.nasa.gov/news/press_kits/insight/landing/facts/mars-at-a-glance/',
  },
  {
    label: 'Veggie: luces LED para plantas — NASA',
    url: 'https://ntrs.nasa.gov/citations/20160004060',
  },
  {
    label: 'Percloratos: tierra tóxica — NASA/JPL',
    url: 'https://www.jpl.nasa.gov/news/phoenix-mars-team-opens-window-on-scientific-process/',
  },
  {
    label: 'Refugio contra la radiación — NASA',
    url: 'https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation-at-the-moon/',
  },
  {
    label: 'Radiación medida por Curiosity (RAD) — NASA',
    url: 'https://science.nasa.gov/resource/radiation-measurements-on-mars/',
  },
  {
    label: 'Tubos de muestras de Perseverance — NASA',
    url: 'https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/a-martian-roundtrip-nasas-perseverance-rover-sample-tubes/',
  },
  {
    label: 'Spirit atrapado en la arena — NASA',
    url: 'https://www.nasa.gov/image-article/spirit-embedded-soft-soil-mars-as-engineers-devise-methods-free-spirit/',
  },
  {
    label: 'Jezero fue un lago — NASA',
    url: 'https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-perseverance-rover-deciphers-ancient-history-of-martian-lake/',
  },
  {
    label: 'Noche polar en Marte — NASA',
    url: 'https://science.nasa.gov/photojournal/growth-and-retreat-of-the-co2-ice-at-the-martian-poles/',
  },
  {
    label: 'Mensajes Tierra-Marte — NASA Goddard',
    url: 'https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/',
  },
  {
    label: 'Fotos de la NASA — NASA Image Library',
    url: 'https://images.nasa.gov/',
  },
  {
    label: 'Música: A Universe of Sound — NASA Chandra',
    url: 'https://chandra.si.edu/sound/index.html',
  },
  {
    label: 'Sonidos: Sounds from Beyond — NASA',
    url: 'https://www.nasa.gov/sounds-from-beyond/',
  },
  { label: 'Clima espacial DONKI — NASA', url: 'https://ccmc.gsfc.nasa.gov/tools/DONKI/' },
  { label: 'Mars Trek — NASA', url: 'https://trek.nasa.gov/mars/' },
  { label: 'Fotos de los lugares — NASA Photojournal', url: 'https://photojournal.jpl.nasa.gov/' },
];
