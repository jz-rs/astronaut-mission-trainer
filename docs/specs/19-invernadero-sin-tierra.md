# 19 — Invernadero sin tierra: lechugas en almohadas Veggie 🥬

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| _(nombre)_ | C (imágenes) + B (minijuego) | P1 | 2 | ⚪ Propuesto |

## Problema
La misión del invernadero enseña que **la tierra de Marte es tóxica** y que por eso las plantas crecen en **almohadas de tierra especial**, como en Veggie de la NASA. Pero los dibujos dicen lo contrario:
- **las lechugas traen tierra marrón dibujada** abajo (`lechuga-brote.png`, `lechuga-joven.png`, `lechuga-grande.png`, `lechuga-sedienta.png`, `lechuga-seca.png`). Hoy la tapamos con una almohada dibujada con código (`addPillow` en `greenhouseIcons.ts`), pero la tierra igual asoma por arriba;
- **la almohada hecha con código es muy simple**: un rectángulo redondeado color arena con dos costuras. Se entiende, pero no se parece a una almohada de Veggie ni al resto del pixel art;
- **la foto de la sala** (`sala-invernadero*.png`) tiene canteros con tierra marrón, debajo de las plantas.

Un chico mira el dibujo antes que el texto: si ve tierra, aprende "las plantas en Marte crecen en tierra", que es justo lo que la tarjeta dice que no.

## Objetivo
Que en toda la misión del invernadero **no se vea tierra**: cada lechuga sale de una **almohada de Veggie** bien dibujada, en pixel art, y la sala parece un cultivo de la NASA (estantes con luces LED rosas), no una huerta.

## Por qué importa
- Track *Junior Astronaut Mission Trainer*: lo que enseñamos tiene que ser verdad y estar respaldado por la NASA (ver `docs/DATA_SOURCES.md`).
- El dato de la tierra tóxica (percloratos en el suelo de Marte) es el primer paso de la tarjeta: el dibujo lo tiene que mostrar, no contradecir.

## Cómo es una almohada de Veggie (referencia NASA)
- Es una **bolsita de tela** chica, más o menos del tamaño de una mano, color **crema o beige**.
- Adentro tiene un **sustrato tipo arcilla** con fertilizante. No se ve: está cerrada, y la planta sale por un **agujerito arriba** (a veces con una mecha de tela).
- Van **en fila sobre una base** (la "estera de raíces", que les pasa el agua), bajo un panel de **LED rojos y azules**: por eso todo se ve rosa.
- Fotos reales: NASA, experimento Veggie en la Estación Espacial (VEG-01 a VEG-03). Buscar las de dominio público y anotarlas en `docs/DATA_SOURCES.md`.

## Cómo se ve
- **Lechugas sin tierra**: las 5 imágenes de lechuga (brote, joven, grande, sedienta y seca) solo con la planta, sin tierra, con la base del tallo abajo y fondo transparente, para que salgan de la almohada.
- **Almohada en pixel art** (`invernadero/almohada.png` o parecido): bolsita crema con relieve de tela, una costura y el agujerito arriba, de donde sale el tallo. Opcional: una versión "con sed" un poco más oscura y arrugada, y una "con agua" con un brillito.
- **Sala sin canteros de tierra**: la foto de la sala del invernadero (una por lugar) con estantes de Veggie, la estera de raíces y paneles de LED rosas, en lugar de canteros marrones.
- **Tarjeta de explicación**: el dibujito del paso 1 (tierra tóxica → almohada) usa la almohada nueva.

## Alcance
**Incluye:**
- redibujar las 5 lechugas sin tierra;
- una almohada en pixel art (y, si se puede, sus variantes con sed y con agua);
- redibujar la sala del invernadero (5 lugares) sin canteros de tierra;
- en el código: cambiar la almohada hecha con código (`addPillow` en `greenhouseIcons.ts`) por la imagen, y ajustar la posición de la planta (`PLANT_LIFT`, `POT_PILLOW` en `plantPot.ts`) para que el tallo salga del agujerito.

**No incluye:**
- cambiar la mecánica (pedidos de agua y luz, herramientas, O₂, rendimiento): sigue igual;
- cambiar otras misiones o el mapa de la base.

## Criterios de aceptación
- [ ] En el minijuego no se ve tierra marrón en ninguna planta, en ningún estado (brote, joven, grande, con sed, sin luz, seca).
- [ ] Cada planta sale de una almohada en pixel art que se reconoce como bolsita de tela.
- [ ] La sala del invernadero no tiene canteros de tierra en ninguno de los 5 lugares.
- [ ] El paso 1 de la tarjeta muestra la almohada nueva.
- [ ] Las imágenes siguen la guía de estilo (`docs/STYLE_GUIDE.md`: pixel art, el doble de tamaño, solo colores de la paleta).
- [ ] La foto de referencia de Veggie tiene su crédito en `docs/DATA_SOURCES.md`.
- [ ] `npm run check` pasa.

## Archivos
**Propios (los puede modificar):** `public/assets/sprites/invernadero/*`, `public/assets/sprites/fondos/sala-invernadero.png`, `public/assets/sprites/biomas/sala-invernadero-*.png`, `src/minigames/greenhouse/*`.
**Contratos que usa (no modificar sin avisar):** `ui/sprites.ts` (se **agrega** la clave de la almohada; las de las lechugas siguen con el mismo nombre), `palette.ts`, `docs/STYLE_GUIDE.md`.

## Dependencias
**Depende de:** 09 (minijuego del invernadero), 01 (estilo de las imágenes), DECISIONS 2026-11-15 (misión del invernadero).
**Bloquea a:** nada.

## Preguntas abiertas
- ¿La planta "con sed" se dibuja aparte (caída y amarilla) o seguimos usando la lechuga normal teñida de amarillo, como hoy?
- ¿Las almohadas van en fila sobre una estera dibujada en la sala, o cada planta tiene su almohada suelta en su lugar de la grilla, como hoy?

## Aprobación
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
