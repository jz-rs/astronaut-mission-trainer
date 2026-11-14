# Prompts — Propuestas de estilo (spec 01, etapa 1)

3 estilos × 4 piezas = 12 imágenes. Cada estilo usa **las mismas 4 piezas** para poder compararlos.

## Cómo usarlos
- Los prompts están en **inglés** (los generadores responden mejor). Las notas, en español.
- Cada prompt = **[bloque de estilo]** + **[pieza]**. Copiá los dos juntos.
- Si la herramienta acepta *negative prompt*, usá el de abajo. Si no, ya va incluido "no text, no antialiasing" en el bloque.
- Guardá cada imagen en `public/assets/reference/propuesta-N/` con nombres: `1-astronauta.png`, `2-sala.png`, `3-base.png`, `4-mezcla.png`.
- Anotá qué herramienta usaste y, si tuviste que cambiar el prompt, pegá la versión que funcionó (sirve para la plantilla final de `STYLE_GUIDE.md`).

**Negative prompt (todos):**
```
blurry, antialiasing, gradients, photorealistic, 3D render, text, letters, watermark, signature, noisy dithering, extra limbs, cropped
```

**Paleta (para pegar si la herramienta permite indicar colores):**
```
#1a1423 #2b2340 #3d3a52 #6b6f8a #b4b8cc #f4f1e8 #7a2e1f #c4532f #e88a4f #f2c288 #5ec8e5 #6cc24a #f7d94c #e5484d #9b6bdf
```

---

## Las 4 piezas (iguales para los 3 estilos)

**P1 — Astronauta**
```
a single astronaut character standing, front view, full body, white spacesuit with a violet (#9b6bdf) visor and violet chest detail, friendly proportions, centered, isolated on a plain transparent background, game sprite
```

**P2 — Sala por dentro (invernadero)**
```
interior of a small greenhouse room inside a Mars base, top-down 3/4 view, rows of hydroponic trays with green lettuce plants, grow lights, metal walls and floor panels, a round window showing the red Martian landscape, cozy and clean, game room background
```

**P3 — Vista general de la base**
```
top-down view of a small Mars base on red sandy ground, four rooms connected by a central corridor: a greenhouse with green plants, an oxygen factory with pipes and tanks, a solar panel room with panels outside, a radiation shield room with thick walls, small rocks and craters around, readable layout, game map
```

**P4 — Prueba de mezcla (monitor para foto real)**
```
a retro computer monitor inside a Mars base control room, front view, chunky metal frame with small buttons and blinking lights, the screen is completely filled with flat solid magenta (#ff00ff) and nothing else, game UI frame
```
> ⚠️ El generador **no** puede poner la foto real. Pedimos la pantalla magenta y después pegamos encima la foto real de NASA (ej. cráter Gale desde Curiosity) con cualquier editor (Photopea, Canva, Aseprite). Agregar la etiqueta "📷 Foto real NASA" debajo. Registrar la foto en `docs/DATA_SOURCES.md`.

---

## Propuesta 1 — Pixel art 16 bits colorido
Vibra de consola clásica: colores saturados, sombreado limpio, mucho detalle legible.

**Bloque de estilo:**
```
16-bit pixel art, SNES-era game style, vibrant saturated colors, clean pixel shading with 2-3 tones per color, crisp 1px dark outlines, limited palette of 15 colors, sharp pixels, no antialiasing, no text,
```

## Propuesta 2 — Pixel art redondeado y "chibi"
Formas redondas y gorditas, cabezas grandes, muy amigable. Lo más fácil de leer en un celu.

**Bloque de estilo:**
```
cute chunky pixel art, rounded soft shapes, chibi proportions with oversized helmet and short body, thick dark outlines, flat colors with one shadow tone, very simple and readable at small size, limited palette of 15 colors, sharp pixels, no antialiasing, no text,
```
> Para P1 agregá: `big round helmet, stubby arms and legs`.

## Propuesta 3 — Pixel art "retro NASA"
Inspiración en la estética técnica de la NASA de los 70: crema, naranja y gris, look de manual técnico y paneles de control.

**Bloque de estilo:**
```
retro 1970s space agency aesthetic, 8-bit pixel art, muted palette of cream, burnt orange, rust red and steel gray, technical schematic feel, control panels with toggle switches, subtle scanlines, limited palette of 15 colors, sharp pixels, no antialiasing, no text,
```
> Para P2 y P3 agregá: `panels labeled with simple colored stripes instead of text`.

---

## Ajustes por herramienta
- **Midjourney**: agregá al final `--ar 1:1` para P1 y P4, `--ar 16:9` para P2 y P3. `--style raw` ayuda a que no "embellezca". Negative prompt con `--no blurry, text, gradients, 3d`.
- **DALL·E / ChatGPT**: pegá el prompt tal cual y al final: "Make it look like an actual game sprite, pixels must be sharp and blocky."
- **Fondo transparente**: muchos generadores no lo hacen bien. Si queda con fondo, pedí `on a solid flat #ff00ff background` y borralo después (remove.bg, Photopea, Aseprite).
- **Pixel "falso"** (píxeles de distintos tamaños): pasar después por un pixelador / ajuste de paleta (Lospec Palette Converter, Pixelorama, Aseprite). Para la votación no es necesario dejarlo perfecto.

## Checklist de entrega
- [ ] propuesta-1: 4 piezas
- [ ] propuesta-2: 4 piezas
- [ ] propuesta-3: 4 piezas
- [ ] Votación hecha y resultado en `docs/DECISIONS.md`
