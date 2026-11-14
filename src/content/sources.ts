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
    url: 'https://phys.org/news/2024-06-nasa-mars-epic-solar-storm.html',
  },
  {
    label: 'Geografía de Marte — ESA',
    url: 'https://www.esa.int/Science_Exploration/Space_Science/Mars_Express/Geography_of_Mars',
  },
  { label: 'Clima espacial DONKI — NASA', url: 'https://ccmc.gsfc.nasa.gov/tools/DONKI/' },
  { label: 'Mars Trek — NASA', url: 'https://trek.nasa.gov/mars/' },
  { label: 'Fotos de los lugares — NASA Photojournal', url: 'https://photojournal.jpl.nasa.gov/' },
];
