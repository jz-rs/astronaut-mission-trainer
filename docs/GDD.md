# GDD — Documento de diseño del juego

> Estado: **borrador para aprobar**. Recoge lo que decidimos en la planificación. Si querés cambiar algo, proponelo antes de programarlo (ver `AGENTS.md` §1.3).

## 1. En una frase
Sos la comandante de una base en Marte: repartís el trabajo entre vos y tu tripulación para que el oxígeno, la comida, el escudo y la energía no se acaben, mientras Marte te tira tormentas encima.

## 2. Objetivos del proyecto
- **Educativo**: que se entienda que **cada decisión afecta las variables** de supervivencia (pedido central del track), con datos reales de la NASA.
- **Para chicos de 7 a 12**, atractivo para cualquier edad.
- **Cero curva de aprendizaje**: entrar y saber qué tocar.
- **Rejugable**: partidas cortas y motivos para volver.

### Lo que hacemos distinto a otros proyectos del track
Analizamos proyectos de otros equipos (little-orbit, astra-mission-trainer, outpost-app). Problemas comunes: **mucho texto, poco intuitivo, curva de aprendizaje alta, poca retención y demasiadas variables.** Cada decisión de este GDD intenta evitar eso.

## 3. Pilares
1. **Decidir es el juego**: nunca alcanza para todo, hay que priorizar.
2. **Se entiende sin leer**: íconos, colores, animación.
3. **Ciencia real como premio**: el dato aparece después de la acción.
4. **Colaborar es necesario**: la tripulación importa.

## 4. Referencias
- **Among Us**: estética, caminar entre salas, tareas como minijuegos, emergencias.
- **Angry Birds / Candy Crush**: mapa de niveles con estrellas.
- **Hades / roguelites**: perder la partida pero no el progreso.

## 5. Ambientación
Marte solamente. Una base con salas. Cada partida es un aterrizaje en un lugar real de Marte.

## 6. Las variables (4 barras)

| Barra | Sala | Qué la sube | Qué la baja |
|---|---|---|---|
| 💨 Oxígeno | Fábrica de oxígeno | Minijuego oxígeno | El paso del tiempo |
| 🥬 Comida | Invernadero | Minijuego invernadero | El paso del tiempo |
| ☢️ Escudo | Muro de escudo | Minijuego escudo | El tiempo, tormentas solares |
| ⚡ Energía | Paneles solares | Minijuego paneles (el único que **genera**) | Cada tarea **gasta** energía, el tiempo, el polvo |

- Las barras van de 0 a 100 y bajan solas.
- **La energía es la moneda compartida**: todas las tareas (menos paneles) la consumen. Si alguien la gasta, al resto no le alcanza.
- Si **cualquier barra llega a 0**, la tripulación evacúa → **game over**.

## 7. La partida (~5 minutos)
- **5 soles** de ~60 segundos cada uno.
- Durante cada sol: caminás por la base, jugás minijuegos, das órdenes a los bots, reaccionás a eventos.
- Al final del sol 5 llega la nave de reabastecimiento → **pantalla de resultado**.

### Ejemplo de partida (Cráter Gale)
1. **Sol 1**: el invernadero titila (comida baja). Vas, jugás, la comida sube y la energía baja. Los bots en auto van a otras salas.
2. **Sol 2**: 📡 llega un aviso de la Tierra (con retraso): tormenta de polvo. Reunión de crisis: votan limpiar paneles.
3. **Sol 3**: la tormenta tapa los paneles. ¿Salís con el rover (cuesta energía, da puntos) o cuidás la energía?
4. **Sol 4**: tormenta solar **sin aviso**. Palanca de a dos con un bot para cerrar el escudo.
5. **Sol 5**: otra expedición, llega la nave. Resultado: ⭐⭐☆ y "la energía bajó del 20% en el sol 3".

## 8. Tripulación: vos sos la comandante
- Vos + **3 bots** (en el futuro, otras personas ocupan su lugar).
- **Tocás una sala** → tu astronauta va y jugás el minijuego.
- **Tocás un bot y después una sala** → el bot va y hace la tarea.
- **Modo 🤖 Auto** por bot: va solo a la barra más baja.

| Quién | Tiempo | Efecto |
|---|---|---|
| 🤖 Bot | Lento (~20 s) | Fijo, 60% |
| 🧑‍🚀 Vos | Rápido (10–15 s) | 0% a 120% según cómo juegues (perfecto = bonus) |

### 🎓 Los bots aprenden de vos (gancho de rejugabilidad)
Tu **mejor resultado** en cada minijuego pasa a ser la eficiencia de los bots en esa tarea. Si hacés un perfecto en Paneles, tus bots limpian al 110%. Rejugar minijuegos = entrenar a tu tripulación = poder con lugares más difíciles.

## 9. Minijuegos
Reglas comunes: **10–15 segundos, una sola acción táctil, sin leer**, terminan con un dato real de una línea.

| | Minijuego | Cómo se juega | Efecto | Dato real |
|---|---|---|---|---|
| 💨 | Fábrica de oxígeno | Arrastrar burbujas de CO₂ a la máquina → salen burbujas de O₂ | +💨 −⚡ | MOXIE (Perseverance) hizo oxígeno del aire de Marte |
| ⚡ | Limpiar paneles | Deslizar el dedo para sacar el polvo | +⚡ | El polvo de Marte apagó a Opportunity e InSight |
| 🥬 | Invernadero | Tocar las plantas con sed antes de que se sequen | +🥬 −⚡ | Veggie: lechuga cosechada en la Estación Espacial |
| ☢️ | Muro de escudo | Arrastrar bloques de agua/regolito para tapar huecos | +☢️ −⚡ | El agua frena la radiación; Marte no tiene campo magnético global |
| 🧪 | Expedición rover | Esquivar rocas y tocar piedras brillantes | +🧪 puntos −−⚡ | Foto real del lugar + dato del rover |
| 🤝 | Palanca de a dos (evento) | Mantener apretado junto con otro astronauta | Evita daño de tormenta solar | Alertas de DONKI (NASA) |

La dificultad de cada minijuego cambia según el lugar (parámetros en `balance.ts`, no código nuevo).

## 10. Eventos
- **Mazo de eventos distinto por lugar**, basados en datos reales (DONKI, RadLab, OSDR). Escritos a mano en `data/events.json`, sin llamar APIs en vivo.
- **Retraso de comunicaciones como mecánica**: la señal Tierra–Marte tarda entre 4 y 24 minutos. A veces el aviso llega un sol antes (podés prepararte) y a veces llega tarde.
- Tipos: tormenta solar, tormenta de polvo, falla de equipo, y eventos buenos (reabastecimiento, cosecha extra).
- **Reunión de crisis** (como la reunión de emergencia de Among Us): cuando llega un aviso, todos votan qué priorizar en 10 s. Los bots votan.

## 11. Progresión: el mapa de Marte

| # | Lugar | Por qué es difícil (dato real) | Qué cambia |
|---|---|---|---|
| 1 | Cráter Jezero | Tranquilo; acá está Perseverance | Tutorial, todo equilibrado |
| 2 | Cráter Gale | Tormentas de polvo frecuentes | ⚡ baja más rápido |
| 3 | Olympus Mons | Menos atmósfera que proteja | ☢️ baja más rápido |
| 4 | Casquete polar | Poca luz solar | ⚡ y 🥬 más difíciles |
| 5 | Valles Marineris | Clima extremo | Todo más difícil |

### Estrellas (objetivos mostrados con íconos al empezar)
- ⭐ La base sobrevivió los 5 soles.
- ⭐ Juntaste X muestras con el rover.
- ⭐ Desafío del lugar (ej.: "nunca bajes de 20% de energía").

Con suficientes estrellas se desbloquea el siguiente lugar. La 3ª estrella es para volver y hacerlo mejor.

### Puntaje
`puntaje = salud promedio de la base × 10 + muestras × 100` — guardamos el récord por lugar.

### Qué se guarda entre partidas
Entrenamiento de bots, estrellas y récord por lugar, idioma. *(Opcional, P2: trajes, figuritas con fotos NASA.)*

## 12. Estética
- **Pixel art** generado con IA, coherente gracias a la guía de estilo (`docs/STYLE_GUIDE.md`).
- **Imágenes reales de la NASA enmarcadas** dentro del mundo pixel art: por la ventana de la base, en monitores, en la expedición. Siempre con etiqueta "📷 Foto real NASA". Así los chicos distinguen qué es real.

## 13. Pantallas
1. **Inicio**: un botón gigante JUGAR + selector de idioma (ES/EN).
2. **Mapa de Marte**: lugares, estrellas, candados.
3. **Base** (la partida).
4. **Minijuego** (se abre encima de la base; la base sigue corriendo).
5. **Resultado**: estrellas, puntaje, por qué perdiste una estrella, dato real, Reintentar / Mapa.
6. **Fuentes**: links a los datos de NASA.

## 14. Plataforma
- **Web, mobile first, en horizontal.** Pide pantalla completa y, si el celu está vertical, muestra "girá el celu".
- Phaser 3 + TypeScript + Vite. Se publica como página estática.
- Español e inglés, seleccionable.

## 15. Multijugador
- **v0 (hackathon): bots.** Arquitectura lista: bots y humanos mandan las mismas acciones.
- **Después**: salas con código para jugar con amigos (Colyseus). Va en el pitch como "próximo paso".

## 16. Fuera de alcance para el hackathon
Multijugador online real, cuentas de usuario, llamadas a APIs de NASA en vivo, más de 5 lugares.
