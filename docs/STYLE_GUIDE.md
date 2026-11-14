# Guía de estilo visual

> Estado: **completada con el resultado de la votación** del spec [01 Dirección de arte](specs/01-direccion-de-arte.md) (ver `docs/DECISIONS.md`, 2026-11-14). Lo marcado con ❓ queda abierto y hay que decidirlo con quien hace el spec 02.

## Principios
1. **Dibujo retro, objetos de hoy.** Pixel art de consola de 16 bits, pero todo lo que se ve es tecnología actual: pantallas planas, botones táctiles, luces LED. Nada de tubos ni agujas. Las palancas sí se permiten (las usa el spec 16), con aspecto moderno: mango con luz LED y carcasa blanca o grafito.
2. **Pixel art legible en un celu.** Siluetas claras, contorno oscuro, mucho contraste.
3. **Mezcla de dos mundos**: todo lo generado es pixel art; **las fotos reales de la NASA van siempre enmarcadas** (marco `sprites/ui/marco-foto-nasa.png`, con la pantalla transparente) con la etiqueta "📷 Foto real NASA".
4. **Color con significado**: cada barra/sala tiene su color y se usa siempre igual.
5. **Sin logos de la NASA** en ningún lado.
6. **Amigable, no infantil**: le tiene que gustar a un chico de 7 sin darle vergüenza a uno de 12.

## Vista
**Isométrica** para la base, el mapa y las salas.

## Colores de las variables (fijos)
| Variable | Color | Ícono (sprite) |
|---|---|---|
| Oxígeno | celeste `#5ec8e5` | `ui/icono-oxigeno.png` |
| Comida | verde `#6cc24a` | `ui/icono-comida.png` |
| Escudo | violeta `#9b6bdf` | `ui/icono-escudo.png` |
| Energía | amarillo `#f7d94c` | `ui/icono-energia.png` |
| Peligro / barra baja | rojo `#e5484d` | — |

## Paleta
Igual a la propuesta inicial (se pasa a código en `src/ui/palette.ts`, spec 02):

`#1a1423` noche · `#2b2340` espacio · `#3d3a52` metal oscuro · `#6b6f8a` metal · `#b4b8cc` metal claro · `#f4f1e8` blanco · `#7a2e1f` Marte oscuro · `#c4532f` Marte · `#e88a4f` Marte claro · `#f2c288` arena · `#5ec8e5` celeste · `#6cc24a` verde · `#f7d94c` sol · `#e5484d` alerta · `#9b6bdf` violeta

**Dónde va cada color:**
- Naranja, óxido y arena: **solo Marte** (suelo, cielo, rocas, exterior).
- Tecnología (botones, luces, pantallas, detalles): **celeste, blanco y grafito**.
- Cada sala lleva su color de variable en luces y detalles (oxígeno celeste, invernadero verde, escudo violeta, energía amarillo).

❓ Las imágenes generadas **todavía no** se pasaron por la paleta exacta (Gemini se acerca pero no es exacto). Pendiente: decidir si se hace (por ejemplo con Lospec Palette Converter) o si alcanza con la aproximación.

## Tamaños
- Resolución base del juego: **640 × 360** (escala para llenar la pantalla del celu).
- Botones: mínimo 48 × 48 px de juego.
- **Regla: cada archivo está al doble (2×) de su tamaño en pantalla**, en PNG (nunca JPEG: ensucia los bordes del pixel art). El juego lo muestra a escala 0,5. Así no se escala ~10× en tiempo real, que con `pixelArt: true` queda serruchado y titila.

| Asset | Archivo (2×) | En pantalla (640 × 360) |
|---|---|---|
| Fondo del menú y mapa de la base (`sprites/fondos/`) | 1280 × 720 | pantalla completa |
| Salas por dentro (`sprites/fondos/sala-*.png`) | 964 × 720 (4:3) | 482 × 360 |
| Marco de fotos NASA (`sprites/ui/marco-foto-nasa.png`) | 1280 × 720, pantalla transparente en (386, 217) – (894, 503) | pantalla completa |
| Astronauta (cada frame, pies alineados abajo) | 54 × 80 | ~27 × 40 |
| Íconos de las barras (`ui/icono-*.png`) | 32 × 32 | 16 × 16 |
| Lechugas | lado mayor 140 | ~70 |
| Paneles solares (3 estados, alineados entre sí) | 300 × 278 | 150 × 139 |
| Máquina de oxígeno | lado mayor 240 | ~120 |
| Muro del escudo / bloques | lado mayor 400 / 80 | ~200 / ~40 |
| Botón / botón redondo / estrellas | 240 de ancho / 96 / 96 | 120 / 48 / 48 |
| Rover / rocas / muestras | 120 / 96–120 / 64–72 | ~60 / ~50 / ~35 |
| Suelo de Marte (`tiles/suelo-marte.png`) | 128 de ancho | 64 |
| Sprites para el mapa (`sprites/mapa/`) | a escala de `mapa-base.png` | — |

Los tamaños en pantalla de los minijuegos son una estimación según `MINIGAME_AREA` (520 × 248). Si un spec necesita otro tamaño, se vuelve a recortar desde la hoja original en `docs/arte/hojas/`.

## Tipografía
- Pixel font: **Press Start 2P** (Google Fonts). ❓ No se probó todavía junto al arte.
- Tamaños: 8 / 12 / 20 / 28 px.

## Tripulación
- Traje blanco, **visor y franjas del color del personaje**: violeta = jugadora, rojo, verde, amarillo = bots.
- Frames por color: frente (3/4) quieto + 2 pasos, espalda (3/4) quieto + 2 pasos. Los colores rojo, verde y amarillo salen del violeta recoloreado (no se regeneran), así son idénticos.
- Nombres: `astronauta-{color}-{frente|espalda}-{quieto|paso1|paso2}.png`.

## Cómo se arma la base: capas
- El **mapa** es un fondo vacío (`sprites/fondos/mapa-base.png`) + sprites de estado encima (`sprites/mapa/`): plantas sanas/sedientas/secas en las camas, máquina de oxígeno funcionando/rota, paneles limpios/sucios. Así, si las plantas se marchitan en el juego, también se marchitan en el mapa.
- Las **salas por dentro** son fondos vacíos + los sprites del minijuego encima.
- Las salas por dentro son el **original**: el mapa se adapta a ellas, no al revés.

## Plantilla de prompt (Gemini)
Lo que funcionó mejor fue: **siempre adjuntar una imagen de referencia del kit**, pedir **fondo magenta plano** y describir el contenido en JSON. Para arreglos chicos (borrar, recortar, recolorear) **no regenerar**: se edita la imagen localmente.

Hoja de sprites (objetos sueltos para recortar):

```
Generate an image: a 16-bit retro pixel art sprite sheet in EXACTLY the same style, outline and palette as the attached sheet.
Solid flat magenta background (#FF00FF), 6 separate objects in a 2x3 grid, generous spacing, no text, no labels, no logos,
no shadows on the background.
{"style":"16-bit console pixel art, dark outlines, soft shading, same pixel size as reference",
 "palette":["#1a1423","#2b2340","#3d3a52","#6b6f8a","#b4b8cc","#f4f1e8","#7a2e1f","#c4532f","#e88a4f","#f2c288","#5ec8e5","#6cc24a","#f7d94c","#e5484d","#9b6bdf"],
 "rule":"technology is white, graphite and light blue #5ec8e5; orange/rust only for Mars",
 "row1":["objeto 1","objeto 2","objeto 3"],
 "row2":["objeto 4","objeto 5","objeto 6"]}
```

Escena o sala nueva: adjuntar una sala del kit (por ejemplo `sprites/fondos/sala-invernadero.png`) y pedir **"edit this image: …"** cambiando solo lo necesario, en vez de pedir una imagen desde cero.

## Recorte de sprites
Las hojas en magenta (`docs/arte/hojas/hoja-*.png`) se recortan con un script de Python (Pillow + numpy + scipy): detecta el fondo magenta, borra el borde rosado, separa cada objeto y lo guarda como PNG transparente.
❓ El script está en la compu de la autora; falta decidir dónde se sube en el repo (agregar una carpeta `tools/` cambia la estructura de carpetas).

## Imágenes reales de la NASA
- Guardar en `public/assets/nasa/` con nombre descriptivo (`gale-crater-curiosity.jpg`).
- Registrar cada una en `docs/DATA_SOURCES.md` (fuente, crédito, licencia).
- Mostrarlas siempre dentro del marco pixel art + etiqueta "📷 Foto real NASA".
