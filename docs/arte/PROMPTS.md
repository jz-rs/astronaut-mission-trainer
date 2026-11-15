# Prompts — Style proposals (spec 01, stage 1)

3 styles × 4 pieces = 12 images. Each style uses **the same 4 pieces** so they can be compared.

## How to use them
- Prompts are in **English** (generators respond better). Notes are also in English.
- Each prompt = **[style block]** + **[piece]**. Copy both together.
- If the tool accepts a *negative prompt*, use the one below. Otherwise, the block already includes "no text, no antialiasing".
- Save each image in `docs/arte/propuesta-N/` as: `1-astronauta.png`, `2-sala.png`, `3-base.png`, `4-mezcla.png`.
- Record the tool used and, if you changed the prompt, paste the version that worked (useful for the final template in `STYLE_GUIDE.md`).

**Negative prompt (all styles):**
```
blurry, antialiasing, gradients, photorealistic, 3D render, text, letters, watermark, signature, noisy dithering, extra limbs, cropped
```

**Palette (paste if the tool supports specifying colors):**
```
#1a1423 #2b2340 #3d3a52 #6b6f8a #b4b8cc #f4f1e8 #7a2e1f #c4532f #e88a4f #f2c288 #5ec8e5 #6cc24a #f7d94c #e5484d #9b6bdf
```

---

## The 4 pieces (the same for all 3 styles)

**P1 — Astronaut**
```
a single astronaut character standing, front view, full body, white spacesuit with a violet (#9b6bdf) visor and violet chest detail, friendly proportions, centered, isolated on a plain transparent background, game sprite
```

**P2 — Room interior (greenhouse)**
```
interior of a small greenhouse room inside a Mars base, top-down 3/4 view, rows of hydroponic trays with green lettuce plants, grow lights, metal walls and floor panels, a round window showing the red Martian landscape, cozy and clean, game room background
```

**P3 — Base overview**
```
top-down view of a small Mars base on red sandy ground, four rooms connected by a central corridor: a greenhouse with green plants, an oxygen factory with pipes and tanks, a solar panel room with panels outside, a radiation shield room with thick walls, small rocks and craters around, readable layout, game map
```

**P4 — Mixing test (monitor for a real photo)**
```
a retro computer monitor inside a Mars base control room, front view, chunky metal frame with small buttons and blinking lights, the screen is completely filled with flat solid magenta (#ff00ff) and nothing else, game UI frame
```
> ⚠️ The generator **cannot** insert the real photo. Request a magenta screen, then overlay the real NASA photo (e.g. Gale crater from Curiosity) using any editor (Photopea, Canva, Aseprite). Add the label "📷 Real NASA photo" underneath. Register the photo in `docs/DATA_SOURCES.md`.

---

## Proposal 1 — Colorful 16-bit pixel art
Classic console feel: saturated colors, clean shading, plenty of readable detail.

**Style block:**
```
16-bit pixel art, SNES-era game style, vibrant saturated colors, clean pixel shading with 2-3 tones per color, crisp 1px dark outlines, limited palette of 15 colors, sharp pixels, no antialiasing, no text,
```

## Proposal 2 — Rounded, "chibi" pixel art
Round, chunky shapes, big heads, very friendly. The easiest to read on a phone.

**Style block:**
```
cute chunky pixel art, rounded soft shapes, chibi proportions with oversized helmet and short body, thick dark outlines, flat colors with one shadow tone, very simple and readable at small size, limited palette of 15 colors, sharp pixels, no antialiasing, no text,
```
> For P1 add: `big round helmet, stubby arms and legs`.

## Proposal 3 — "Retro NASA" pixel art
Inspired by NASA's 1970s technical aesthetic: cream, orange, and gray, with a technical manual and control panel feel.

**Style block:**
```
retro 1970s space agency aesthetic, 8-bit pixel art, muted palette of cream, burnt orange, rust red and steel gray, technical schematic feel, control panels with toggle switches, subtle scanlines, limited palette of 15 colors, sharp pixels, no antialiasing, no text,
```
> For P2 and P3 add: `panels labeled with simple colored stripes instead of text`.

---

## Tool-specific adjustments
- **Midjourney**: append `--ar 1:1` for P1 and P4, `--ar 16:9` for P2 and P3. `--style raw` helps prevent "beautification". Use `--no blurry, text, gradients, 3d` for the negative prompt.
- **DALL·E / ChatGPT**: paste the prompt as written and append: "Make it look like an actual game sprite, pixels must be sharp and blocky."
- **Transparent background**: many generators struggle with it. If a background remains, request `on a solid flat #ff00ff background` and remove it afterward (remove.bg, Photopea, Aseprite).
- **"Fake" pixels** (pixels of different sizes): process afterward with a pixelation / palette tool (Lospec Palette Converter, Pixelorama, Aseprite). It need not be perfect for the vote.

## Delivery checklist
- [ ] propuesta-1: 4 pieces
- [ ] propuesta-2: 4 pieces
- [ ] propuesta-3: 4 pieces
- [ ] Vote completed and result recorded in `docs/DECISIONS.md`
