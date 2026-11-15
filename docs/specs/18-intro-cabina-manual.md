# 18 — Intro, cabina y manual de misión

| Dueña | Rol | Prioridad | Fase | Estado |
|---|---|---|---|---|
| Por asignar | C | P0 | Planificación | ⚪ Propuesto |

## Objetivo
Al tocar JUGAR, entrar a una nave, recibir el contexto de la simulación y prepararse para la misión. El manual explica cómo cuidar la base; un monitor dentro de la nave permite conocer los destinos y elegir dónde aterrizar.

## Estado y relación con otros specs
El equipo aprobó el rumbo general (ver `docs/DECISIONS.md`, 2026-11-14). Este documento consolida la planificación previa a generar imágenes: el guion y los detalles pendientes todavía requieren revisión.

- Complementa el spec 11: JUGAR lleva a la cabina. La primera visita queda exceptuada de los requisitos de diez segundos y dos toques por el manual obligatorio.
- Sustituye la presentación de selección de destinos del spec 12 por el monitor de la nave. Conserva lugares, estrellas, récords y reglas de desbloqueo.
- Coordina contenido y fuentes con el spec 13, eventos con el 14 y rover con el 15.
- No redefine las misiones que está implementando otra integrante ni sus minijuegos.
- Los bocetos generados durante esta conversación y sus prompts no son referencias aprobadas. No se fija aquí una perspectiva frontal o isométrica ni una distribución visual definitiva.
- Actualización: la cabina se explora en **vista frontal en perspectiva** (no isométrica). Bocetos, no aprobados: `docs/arte/bocetos/cabina/` (fondo de la cabina, consola del monitor, guía, objetos flotantes y tablet del manual). Ver `docs/DECISIONS.md`.
- Actualización 2026-11-15: el manual es una **tablet de misión**, no un libro (ver `docs/DECISIONS.md`).

## Decisiones confirmadas
- Cabina fija: se interactúa tocando objetos, sin caminar por ella.
- Ventana que muestra el espacio y Marte mediante una imagen real, enmarcada y con fuente.
- Astronauta que da la bienvenida y explica el contexto; introducción salteable.
- Manual obligatorio la primera vez: basta recorrer las páginas, sin ejercicios ni cuestionarios.
- El manual explica las cuatro barras, el rover, los eventos y las comunicaciones demoradas de la Tierra.
- Todos los destinos se pueden explorar, incluso los bloqueados para aterrizar.
- Selección de destino, cambio de fotografías y aterrizaje mediante botones de la nave.
- Fotografías NASA y representación pixel art relacionadas explícitamente en el manual.

## Recorrido propuesto
Primera visita: **JUGAR → cabina y bienvenida → manual → cabina → monitor de destinos → aterrizaje → misión**.

Saltar la bienvenida no omite el manual. La condición para aterrizar por primera vez es haber recorrido todas sus páginas. El orden exacto de acceso al monitor antes de completar el manual queda pendiente; explorar no debe habilitar el aterrizaje anticipadamente.

Visitas posteriores (propuesta): JUGAR lleva a la cabina sin repetir automáticamente la bienvenida; el manual se puede consultar nuevamente. Recordar su finalización mediante el sistema de progreso, sin alterar el progreso de las misiones.

Las escenas que siguen describen momentos de la experiencia, no necesariamente clases de Phaser distintas.

## Escena 1 — Cabina y bienvenida
Se reconocen tres elementos interactivos: astronauta, manual y monitor. La ventana muestra Marte. Un elemento destacado indica el siguiente paso. No comienza el reloj de la misión durante la preparación.

### Guion inicial propuesto
Una intervención por vez, con controles Siguiente y Saltar bienvenida:

| Momento | Diálogo | Apoyo visual propuesto |
|---|---|---|
| Llegada | «¡Bienvenido a bordo! Mirá por la ventana: estamos llegando a Marte.» | La astronauta señala la ventana. |
| Contexto | «Marte es un mundo frío, con una atmósfera muy delgada.» | Se destaca la imagen real. |
| Simulación | «En esta simulación, vas a dirigir una base y cuidar a su tripulación.» | Representación de la base. |
| Variables | «Oxígeno, comida, escudo y energía: ¡las cuatro barras cuentan!» | Cuatro íconos, con sus colores. |
| Preparación | «Antes de aterrizar, abrí el manual de misión.» | Se destaca la tablet. |

Nombre, aspecto y voz de la astronauta pendientes. El texto debe funcionar sin audio y mantenerse breve; dividir intervenciones si no caben legiblemente en el celular.

## Escena 2 — Manual de misión
Tablet de misión (la misma que flota en la cabina, vista de frente y en grande) con una página por pantalla, indicador de avance y controles anterior/siguiente. La interfaz de la tablet tiene **estética de pantalla**, distinta de los botones físicos de la consola: líneas finas celestes con brillo, esquinas tipo visor, barras por segmentos y líneas de escaneo. Al tocar un control, un **destello breve** (parpadeo o brillo que se enciende con un pequeño retardo) deja claro que es un botón de pantalla. Maquetas: `docs/arte/bocetos/cabina/manual/`. Sin temporizador mínimo de lectura. La propuesta es registrar que se visitaron todas las páginas y permitir volver a la cabina al completar el recorrido. Definir el comportamiento al cerrar o recargar antes de terminar.

### Contenido propuesto: diez páginas
Los textos son borradores, sujetos a las mecánicas que efectivamente incluya el juego.

| Página | Mensaje y acción que debe enseñar |
|---|---|
| 1. Tu misión | «Mantené la base funcionando durante cinco días marcianos, llamados soles.» Explicar que el tiempo del juego está simplificado. |
| 2. Oxígeno | «La tripulación necesita oxígeno. Llevá CO₂ a MOXIE para fabricarlo.» Mostrar cómo se juega la tarea (spec 08: rompé la molécula, 2 CO₂ → O₂) y que consume energía. Comparar foto real de MOXIE con la máquina del juego. |
| 3. Comida | «Cuidá las plantas del invernadero para recuperar comida.» Mostrar la acción y su consumo de energía. |
| 4. Escudo | «Reforzá el muro de escudo para proteger a la tripulación de la radiación.» Mostrar la acción y su consumo de energía. |
| 5. Energía | «Limpiá los paneles para recuperar energía. Las otras tareas la consumen.» Enseñar que es un recurso compartido. |
| 6. Tripulación | «Tu tripulación también puede hacer tareas.» Ilustrar tocar tripulante → tocar sala y explicar brevemente Auto, según spec 05. |
| 7. Rover | «Explorá con el rover y reuní muestras. ¡La expedición consume energía!» Aclarar que la base sigue funcionando mientras se explora. El rover no es un tripulante automático. |
| 8. Eventos | «Durante la misión pueden ocurrir tormentas y fallas. Prestá atención a las alertas y decidí qué atender primero.» Mostrar causa → efecto → acción. |
| 9. Comunicaciones | «Revisá los mensajes de la Tierra: pueden ayudarte a prepararte. ¡Pero algunos llegan con retraso!» Mirar también las barras y lo que sucede en la base. |
| 10. Preparación completa | «Si una barra llega a cero, la tripulación evacúa. ¡Cuidá las cuatro!» Cierre: «Coordiná a tu tripulación y prestá atención a las alertas. ¡Todo listo para elegir destino!» |

Las barras disminuyen con el tiempo; cada página explica qué recupera su barra y qué la afecta. Priorizar íconos, diagramas y frases breves en lugar de párrafos. La cantidad y distribución de páginas todavía pueden ajustarse para mantener legibilidad.

### Comparar ciencia y simulación
En la tablet, las páginas de cada barra y del rover **deben** mostrar la foto real de NASA junto a la representación del juego (las maquetas actuales todavía no lo hacen). Propuesta de presentación: fotografía real y representación pixel art visibles juntas, con una frase breve bajo cada una. La alternativa de alternarlas con un botón sigue abierta si resulta más legible en móvil.

- Etiquetas: «En la vida real» y «En tu misión».
- Cuando el objeto solo inspire la mecánica: «La ciencia que nos inspira» y «Nuestra versión en el simulador».
- Ejemplos: MOXIE → fábrica de oxígeno; Veggie en la Estación Espacial → invernadero; rover NASA → rover del juego.
- Usar el mismo arte que aparecerá durante la partida, coordinado con sus dueñas.
- No presentar una fábrica ficticia, un escudo de videojuego o un cultivo marciano como instalaciones reales de NASA.
- Las fotos son reales y acreditadas; las barras, costos y tiempos son reglas simplificadas del juego.

### Eventos y comunicaciones
Ejemplos de enseñanza, que deben coincidir con el spec 14 y el contenido implementado:

| Situación | Qué debe entender la jugadora |
|---|---|
| Tormenta de polvo | Puede afectar la energía: revisar los paneles y priorizar recuperarla. |
| Tormenta solar | Revisar la protección y atender el escudo según las acciones disponibles. |
| Falla de equipo | Identificar el equipo afectado y la respuesta que permita esa misión. |
| Aviso anticipado | «Se acerca una tormenta. ¡Prepará la base!» |
| Aviso demorado | «La tormenta ya empezó. ¡Revisá las barras y actuá!» |

No todos los eventos exigen la misma respuesta ni todos llegan con aviso. Los mensajes ayudan, pero no reemplazan observar la base. No prometer reparación, reunión de crisis o palanca si esas funciones aún no están disponibles. Distinguir el retraso físico de las señales de su representación temporal en la simulación; cualquier cifra real debe verificarse con NASA.

## Escena 3 — Regreso a la cabina
Tras completar el manual, la astronauta orienta: «¡Todo listo! Tocá el monitor para elegir dónde aterrizar.» El monitor se destaca; el manual queda disponible para consulta.

Futuros libros de historia o ciencia son una posibilidad, fuera del alcance inicial. No crear libros vacíos ni controles que no funcionen.

## Escena 4 — Monitor de destinos
Reemplaza la UI anterior de selección. El monitor es un objeto de la nave y abre una vista legible de sus controles y contenido.

- Destino anterior/siguiente y fotografía anterior/siguiente son controles separados.
- Nombre del destino, foto real, descripción breve, indicador de foto y acceso a más información.
- Mostrar objetivos, estrellas, récord y condición de desbloqueo del sistema existente.
- Todos los lugares se pueden consultar; solo se aterriza en los desbloqueados y tras completar el manual inicial.
- ATERRIZAR confirma el destino seleccionado. Un destino bloqueado comunica el requisito real que falta.
- Volver permite regresar a la cabina. Cambiar de foto nunca cambia el destino.
- Galería con varias imágenes del lugar: vistas orbitales, detalles y fotos de superficie cuando existan. No usar fotos de otro lugar como si fueran de ese destino.
- Información en fichas breves, diferenciando hechos científicos de dificultad y reglas del juego.

## Escena 5 — Aterrizaje
Transición breve propuesta: «Destino confirmado: [nombre del lugar]. ¡Prepará a tu tripulación!» Luego se inicia la misión correspondiente mediante la navegación acordada con el equipo.

## Fuentes y arte
- Seguir la guía de estilo y las referencias aprobadas del equipo. Antes de producir arte, resolver que la guía de la raíz y la versión completada en los worktrees estén alineadas.
- Ninguna imagen generada en esta conversación queda aprobada por este spec.
- Fotos reales dentro de ventanas, monitores o marcos, con etiqueta identificable y crédito.
- Registrar cada dato e imagen en `docs/DATA_SOURCES.md`: URL original, crédito exacto, licencia y verificación. No asumir que todo recurso alojado por NASA es de dominio público.
- Selección definitiva de fotos y comprobación editorial pendientes del spec 13.
- Fuentes iniciales para revisar: [Marte](https://science.nasa.gov/mars/facts/), [MOXIE](https://www.nasa.gov/solar-system/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/), [Veggie](https://science.nasa.gov/mission/veggie/), [Perseverance y Jezero](https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-perseverance-rover-deciphers-ancient-history-of-martian-lake/).
- Faltan fuentes específicas para escudo, polvo, comunicaciones y las galerías definitivas. Esta lista no equivale a aprobar fotografías para uso.

## Archivos y coordinación
**Alcance actual autorizado:** documentación de este spec y referencias cruzadas. No implementar escenas ni generar assets.

**Propio de esta planificación:** `docs/specs/18-intro-cabina-manual.md`.

**Antes de implementar:** asignar dueña y acordar la lista concreta de archivos de escenas/UI. Coordinar con 02 y 11 la navegación; con 12 los destinos; con 13 textos/fotos; y con la dueña de guardado la finalización del manual. No se concede propiedad sobre archivos compartidos desde este borrador.

**Contratos involucrados:** navegación, claves de escenas, progreso, formato de lugares, i18n, paleta y layout. No alterar `GameAction`, balance ni reglas de misión para implementar la intro.

## Criterios de aceptación propuestos
- [ ] JUGAR abre una cabina fija con astronauta, manual, monitor y ventana con imagen real de Marte.
- [ ] La bienvenida se puede saltar sin omitir el manual obligatorio inicial.
- [ ] Basta recorrer todas las páginas, sin prueba ni espera forzada; la finalización se recuerda.
- [ ] El manual explica las cuatro barras, sus acciones y costos, tripulación, rover, eventos y avisos demorados.
- [ ] La ciencia real se distingue de la representación del simulador.
- [ ] Los ejemplos de eventos corresponden a acciones disponibles en la misión.
- [ ] Todos los destinos permiten ver varias fotos e información; se respetan los bloqueos para aterrizar.
- [ ] Fotos y datos tienen fuente, crédito y verificación registrados.
- [ ] Textos ES/EN en i18n, controles de al menos 48 px de juego y prueba en celular horizontal.
- [ ] La preparación no consume tiempo de partida ni altera las misiones de otra integrante.
- [ ] Antes de un PR de implementación: `npm run check` pasa.

## Pendientes para cerrar el diseño
- Dueña y archivos de implementación; revisión del guion por el equipo.
- Nombre, aspecto y eventual voz de la astronauta.
- Composición visual, perspectiva y assets, todavía sin diseño aprobado.
- Comparación simultánea o alternada en la tablet y extensión final de sus páginas.
- Acceso al monitor antes de completar el manual, cierre anticipado y reanudación de lectura.
- Acceso para repetir la bienvenida y retorno desde resultados a la cabina/monitor.
- Selección de fotografías, créditos y fuentes científicas faltantes.

## Aprobación
Rumbo general aprobado por el equipo según confirmación de Emilia. Este spec detallado permanece propuesto.
- [ ] A — _(nombre)_
- [ ] B — _(nombre)_
- [ ] C — _(nombre)_
