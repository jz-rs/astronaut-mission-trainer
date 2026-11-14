# Guía de estilo visual

> Estado: **BORRADOR.** Se completa al cerrar el spec [01 Dirección de arte](specs/01-direccion-de-arte.md), después de votar el set de imágenes de referencia. Lo marcado con 🔲 está pendiente de esa votación.

## Principios
1. **Pixel art legible en un celu.** Siluetas claras, poco detalle, mucho contraste.
2. **Mezcla de dos mundos**: todo lo generado es pixel art; **las fotos reales de la NASA van siempre enmarcadas** (ventana, monitor, foto, pantalla del rover) con la etiqueta "📷 Foto real NASA".
3. **Color con significado**: cada barra tiene su color y se usa siempre igual.
4. **Amigable, no infantil**: tiene que gustarle a un nene de 7 y no darle vergüenza a uno de 12.

## Colores de las variables (fijos)
| Variable | Color | Ícono |
|---|---|---|
| Oxígeno | celeste | 💨 |
| Comida | verde | 🥬 |
| Escudo | violeta | ☢️ |
| Energía | amarillo | ⚡ |
| Peligro / barra baja | rojo | — |

## Paleta
🔲 A definir con el set de referencia. Propuesta inicial (en `src/ui/palette.ts`):

`#1a1423` noche · `#2b2340` espacio · `#3d3a52` metal oscuro · `#6b6f8a` metal · `#b4b8cc` metal claro · `#f4f1e8` blanco · `#7a2e1f` Marte oscuro · `#c4532f` Marte · `#e88a4f` Marte claro · `#f2c288` arena · `#5ec8e5` celeste · `#6cc24a` verde · `#f7d94c` sol · `#e5484d` alerta · `#9b6bdf` violeta

Regla: **solo colores de la paleta.** Las imágenes generadas se pasan por la paleta antes de entrar al juego (🔲 definir herramienta, por ejemplo Aseprite o Lospec Palette Converter).

## Tamaños
- Resolución base del juego: **640 × 360** (escala para llenar la pantalla del celu).
- 🔲 Tamaño de tile: 16 × 16 o 32 × 32.
- 🔲 Tamaño de astronauta: aprox. 16 × 24.
- Botones: mínimo 48 × 48 px de juego.

## Tipografía
- Pixel font: **Press Start 2P** (Google Fonts) 🔲 confirmar con el set.
- Tamaños: 8 / 12 / 20 / 28 px.

## Tripulación
- Astronautas con traje blanco y **visor/detalle del color del personaje** (violeta = jugadora, rojo, verde, amarillo = bots). 🔲 confirmar.
- Deben distinguirse a simple vista en pantalla chica.

## Plantilla de prompt para generar imágenes
🔲 Se completa en el spec 01 con el prompt que gane la votación. Estructura:

```
[estilo] pixel art, [resolución] , paleta limitada de [N] colores, vista [cenital/lateral], fondo transparente,
[sujeto], [detalles], sin texto, sin antialiasing
```

## Imágenes reales de la NASA
- Guardar en `public/assets/nasa/` con nombre descriptivo (`gale-crater-curiosity.jpg`).
- Registrar cada una en `docs/DATA_SOURCES.md` (fuente, crédito, licencia).
- Mostrarlas siempre dentro de un marco pixel art + etiqueta "📷 Foto real NASA".
