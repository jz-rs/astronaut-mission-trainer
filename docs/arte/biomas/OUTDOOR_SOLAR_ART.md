# Outdoor solar art

All production backgrounds and sprites are PNG pixel art generated with ChatGPT's built-in image tool on 2026-11-15. The owner's Gemini Jezero JPEG is preserved as `exterior-jezero-original.jpg` solely as a source reference; it is not loaded by the game.

## Final assets

- `public/assets/sprites/biomas/afuera-{jezero,gale,olympus-mons,north-pole,valles-marineris}.png`: 1040 × 496, displayed at 520 × 248.
- `docs/arte/hojas/hoja-exterior-paneles.png`: original transparent atlas.
- `public/assets/sprites/energia/{battery-empty,battery-full,airlock-shutter,airlock-red,airlock-green,map-airlock,footprints}.png`: transparent atlas crops, scaled to their screen positions.

## Prompt set

Each background was generated separately with the downloaded Jezero exterior as a composition and style reference:

> Game background, wide landscape approximately 2.1:1. Preserve the same chunky 16-bit pixel art, dark outlines, flat shading, architecture and white/graphite base module with gray airlock on the right edge. Upper third flat caramel sky, no Sun (animated in the game). Middle and lower ground clear for three solar panels. No people, solar panels, lettering or logos. Palette: #1a1423 #2b2340 #3d3a52 #6b6f8a #b4b8cc #f4f1e8 #7a2e1f #c4532f #e88a4f #f2c288 #5ec8e5 #6cc24a #f7d94c #e5484d #9b6bdf.

Location instructions:

- Jezero: layered crater rim and ochre/rust rocky terrain.
- Gale: pale sandy ochre terrain and distant layered Mount Sharp.
- Olympus Mons: gray/violet basalt terrain with a low, distant horizon. Keep the common caramel daytime sky.
- North pole: pale icy terrain, blue-gray rocks, frost and distant layered ice cliffs.
- Valles Marineris: layered rust-red canyon walls and clear sandy ground.

Atlas prompt, using the base map and Jezero exterior as references:

> One transparent game sprite atlas. Chunky 16-bit pixel art, dark outlines, soft flat shading, generous gutters, no text or logos. Two columns by three rows: identical empty/full white graphite battery enclosures; a gray hazard-striped airlock shutter and separate red/green LED lamps; an isometric cream wall patch with a gray airlock on a plane rising right at slope -0.5, and alternating Martian boot footprints. Technology is white, graphite, gray and cyan; yellow marks energy and hazard stripes.

The atlas was inspected and cropped to the actual object bounds. These are fictional illustrations, not NASA photographs.

## Review preview

The owner reviewed a standalone interactive composition preview with location, sky and cleaning controls. Generated preview files stay local; the production assets and code are the reviewable source of truth. The numbered cyan step guide reuses the existing component unchanged.

Manual acceptance still requires playing the production game on a landscape phone and reviewing airlock placement and sprite scale.
