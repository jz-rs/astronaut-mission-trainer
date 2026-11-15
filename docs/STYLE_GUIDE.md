# Visual style guide

> Status: **completed with the vote result** from spec [01 Art direction](specs/01-direccion-de-arte.md) (see `docs/DECISIONS.md`, 2026-11-14). Items marked ❓ remain open and must be decided with the spec 02 owner.

## Principles
1. **Retro art, modern objects.** 16-bit console pixel art, but all visible technology is current: flat screens, touch buttons, LED lights. No vacuum tubes or needles. Levers are allowed (spec 16 uses them), with a modern look: LED-lit handle and white or graphite housing.
2. **Pixel art readable on a phone.** Clear silhouettes, dark outlines, strong contrast.
3. **Mix two worlds**: everything generated is pixel art; **real NASA photos are always framed** (`sprites/ui/marco-foto-nasa.png`, with a transparent screen) and labeled "📷 Real NASA photo".
4. **Meaningful color**: each bar/room has a color, used consistently.
5. **No NASA logos** anywhere.
6. **Friendly, not childish**: a 7-year-old should like it without embarrassing a 12-year-old.

## View
**Isometric** for the base, map, and rooms.

## Variable colors (fixed)
| Variable | Color | Icon (sprite) |
|---|---|---|
| Oxygen | light blue `#5ec8e5` | `ui/icono-oxigeno.png` |
| Food | green `#6cc24a` | `ui/icono-comida.png` |
| Shield | violet `#9b6bdf` | `ui/icono-escudo.png` |
| Energy | yellow `#f7d94c` | `ui/icono-energia.png` |
| Danger / low bar | red `#e5484d` | — |

## Palette
Same as the initial proposal (implemented as code in `src/ui/palette.ts`, spec 02):

`#1a1423` night · `#2b2340` space · `#3d3a52` dark metal · `#6b6f8a` metal · `#b4b8cc` light metal · `#f4f1e8` white · `#7a2e1f` dark Mars · `#c4532f` Mars · `#e88a4f` light Mars · `#f2c288` sand · `#5ec8e5` light blue · `#6cc24a` green · `#f7d94c` sun · `#e5484d` alert · `#9b6bdf` violet

**Where each color goes:**
- Orange, rust, and sand: **Mars only** (ground, sky, rocks, exterior).
- Technology (buttons, lights, screens, details): **light blue, white, and graphite**.
- Each room uses its variable color in lights and details (oxygen light blue, greenhouse green, shield violet, energy yellow).

❓ Generated images have **not yet** been mapped to the exact palette (Gemini gets close, but not exactly). Pending: decide whether to do this (e.g. with Lospec Palette Converter) or accept the approximation.

## Sizes
- Base game resolution: **640 × 360** (scales to fill the phone screen).
- Buttons: at least 48 × 48 game pixels.
- **Rule: each file is twice (2×) its on-screen size**, in PNG (never JPEG: it damages pixel art edges). The game displays it at scale 0.5. This avoids scaling ~10× at runtime, which looks jagged and flickers with `pixelArt: true`.

| Asset | File (2×) | On screen (640 × 360) |
|---|---|---|
| Menu background and base map (`sprites/fondos/`) | 1280 × 720 | full screen |
| Room interiors (`sprites/fondos/sala-*.png`) | 964 × 720 (4:3) | 482 × 360 |
| NASA photo frame (`sprites/ui/marco-foto-nasa.png`) | 1280 × 720, transparent screen at (386, 217) – (894, 503) | full screen |
| Astronaut (each frame, feet aligned at the bottom) | 54 × 80 | ~27 × 40 |
| Bar icons (`ui/icono-*.png`) | 32 × 32 | 16 × 16 |
| Lettuce | longest side 140 | ~70 |
| Solar panels (3 states, aligned with each other) | 300 × 278 | 150 × 139 |
| Oxygen machine | longest side 240 | ~120 |
| Shield wall / blocks | longest side 400 / 80 | ~200 / ~40 |
| Button / round button / stars | 240 wide / 96 / 96 | 120 / 48 / 48 |
| Rover / rocks / samples | 120 / 96–120 / 64–72 | ~60 / ~50 / ~35 |
| Mars ground (`tiles/suelo-marte.png`) | 128 wide | 64 |
| Map sprites (`sprites/mapa/`) | scaled to `mapa-base.png` | — |

Minigame on-screen sizes are estimates based on `MINIGAME_AREA` (520 × 248). If a spec needs a different size, crop again from the original sheet in `docs/arte/hojas/`.

## Typography
- Pixel font: **Press Start 2P** (Google Fonts). ❓ Not yet tested with the art.
- Sizes: 8 / 12 / 20 / 28 px.

## Crew
- White suit, **visor and stripes in the character's color**: violet = player; red, green, yellow = bots.
- Frames per color: front (3/4) idle + 2 steps, back (3/4) idle + 2 steps. Red, green, and yellow are recolored from violet (not regenerated) so they are identical.
- Names: `astronauta-{color}-{frente|espalda}-{quieto|paso1|paso2}.png`.

## Building the base: layers
- The **map** is an empty background (`sprites/fondos/mapa-base.png`) + state sprites on top (`sprites/mapa/`): healthy/thirsty/dry plants in beds, working/broken oxygen machine, clean/dirty panels. When plants wilt in the game, they also wilt on the map.
- **Room interiors** are empty backgrounds + minigame sprites on top.
- Room interiors are the **original**: adapt the map to them, not the other way around.

## Prompt template (Gemini)
What worked best: **always attach a reference image from the kit**, request a **flat magenta background**, and describe the content in JSON. For small fixes (erase, crop, recolor), **do not regenerate**: edit the image locally.

Sprite sheet (separate objects to crop):

```
Generate an image: a 16-bit retro pixel art sprite sheet in EXACTLY the same style, outline and palette as the attached sheet.
Solid flat magenta background (#FF00FF), 6 separate objects in a 2x3 grid, generous spacing, no text, no labels, no logos,
no shadows on the background.
{"style":"16-bit console pixel art, dark outlines, soft shading, same pixel size as reference",
 "palette":["#1a1423","#2b2340","#3d3a52","#6b6f8a","#b4b8cc","#f4f1e8","#7a2e1f","#c4532f","#e88a4f","#f2c288","#5ec8e5","#6cc24a","#f7d94c","#e5484d","#9b6bdf"],
 "rule":"technology is white, graphite and light blue #5ec8e5; orange/rust only for Mars",
 "row1":["object 1","object 2","object 3"],
 "row2":["object 4","object 5","object 6"]}
```

New scene or room: attach a kit room (e.g. `sprites/fondos/sala-invernadero.png`) and request **"edit this image: …"**, changing only what is needed instead of asking for an image from scratch.

## Cropping sprites
The magenta sheets (`docs/arte/hojas/hoja-*.png`) are cropped with a Python script (Pillow + numpy + scipy): it detects the magenta background, removes the pink fringe, separates each object, and saves it as a transparent PNG.
❓ The script is on the author's computer; we still need to decide where to put it in the repo (adding a `tools/` folder changes the folder structure).

## Real NASA images
- Save in `public/assets/nasa/` with a descriptive name (`gale-crater-curiosity.jpg`).
- Register each in `docs/DATA_SOURCES.md` (source, credit, license).
- Always display inside the pixel art frame + "📷 Real NASA photo" label.
