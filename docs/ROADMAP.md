# Roadmap — hitos para validar y testear

El juego avanza en **hitos**. Cada hito termina con **algo que se puede probar** y una **validación** explícita. No se pasa al siguiente hito sin validar el anterior (si algo falla, se arregla o se decide recortar y se anota en `DECISIONS.md`).

Los specs dicen **qué hacer**; este roadmap dice **en qué orden y cómo comprobamos que funciona**.

---

## Cómo testeamos: 5 niveles

| Nivel | Qué es | Cuándo | Quién |
|---|---|---|---|
| **T1 — Automático** | `npm run check`: lint + tipos + tests de la lógica. Corre solo en cada PR (CI). | Cada PR | La máquina |
| **T2 — Revisión de PR** | Otra integrante abre la rama, prueba los **criterios de aceptación del spec** y aprueba. | Cada PR | Otra integrante |
| **T3 — Celu real** | Jugar desde el link publicado en **1 Android + 1 iPhone**, en horizontal. | Fin de cada hito | La dueña del hito + 1 |
| **T4 — Persona nueva** | Alguien que **nunca vio el juego** (ideal: un chico de 7–12) juega **sin que le expliquemos nada**. Observamos y anotamos. | H3, H4, H5 | Cualquiera de las 3 |
| **T5 — Balance** | Jugar varias partidas para ver si es demasiado fácil o difícil. | H2, H3, H4 | A |

### Planilla para T4 (persona nueva)
Copiar en `docs/playtests/AAAA-MM-DD-nombre.md`:
```
Edad: … · Dispositivo: …
¿Cuántos segundos tardó en hacer el primer toque correcto?  …   (objetivo: < 5 s)
¿Entendió qué eran las barras sin preguntar?                sí / no
¿Entendió que tenía que ir a la sala que titila?            sí / no
¿Usó a los bots? ¿Entendió el modo auto?                    sí / no
¿Qué preguntó? (anotar textual)                              …
¿Dónde se trabó?                                            …
¿Quiso jugar otra partida sin que se lo pidiéramos?        sí / no   ← la métrica más importante
¿Recuerda algún dato real al terminar?                      …
```

### Criterios de T5 (balance)
- No hacer nada en Jezero → se pierde **antes del sol 3**.
- Jugando bien en Jezero → se sobrevive con **2–3 estrellas**.
- Con todos los bots en auto y la jugadora sin jugar → **no alcanza** para ganar.
- Gale es notablemente más difícil que Jezero.

---

## Hitos

### H0 — Alineación 🟣 (fase 0)
**Specs:** 01 (etapas 1–2), 02 (revisión del back), 06.
**Qué se puede probar:** nada jugable todavía, sino decisiones.
**Validación:**
- [ ] Las 3 aprobaron (✅) todos los specs P0.
- [ ] Estilo visual votado; `STYLE_GUIDE.md` sin pendientes.
- [ ] Contrato de minijuegos acordado entre A y B.
- [ ] Repo en GitHub con las 3 como colaboradoras.

### H1 — Esqueleto publicado 🔴
**Specs:** 02 (esqueleto + CI), 17 (deploy, adelantado).
**Qué se puede probar:** un **link público** donde se navega Inicio → Base → Resultado (pantallas vacías).
**Validación:**
- [ ] T1: el CI corre en PRs.
- [ ] T3: el link abre en Android y iPhone, en horizontal y sin zoom.

> Tener el link publicado desde temprano permite probar todo lo que sigue directamente en el celu.

### H2 — Primera partida jugable 🔴
**Specs:** 03, 04, 05 (modo auto), 06, 07.
**Qué se puede probar:** una partida completa de 5 soles con **formas simples** (sin arte final): se camina a las salas, paneles es un minijuego real, las otras 3 salas usan el minijuego provisorio, los bots trabajan en auto, se gana o se pierde y aparece el resultado.
**Validación:**
- [ ] T1 + T2 de cada spec.
- [ ] T3 en ambos celus.
- [ ] T5: primera ronda de balance (anotar números en `DECISIONS.md`).

### H3 — Juego mínimo completo (todo P0) 🔴
**Specs:** 01 (etapa 3: arte), 05 completo, 08, 09, 10, 11, 13.
**Qué se puede probar:** el juego **con su estética**: 4 minijuegos reales, órdenes a bots, entrenamiento entre partidas, pantallas de inicio y resultado finales, ES/EN, datos reales.
**Validación:**
- [ ] T3 en ambos celus.
- [ ] **T4 con al menos 2 personas nuevas** → arreglar lo que las trabó.
- [ ] T5: segunda ronda de balance.
- [ ] **Este hito ya es entregable.** Si se acaba el tiempo, se entrega esto.

### H4 — Lo que nos diferencia (P1) 🟠
**Specs:** 12, 14, 15.
**Qué se puede probar:** mapa de Marte con 5 lugares y estrellas, eventos con aviso de la Tierra (o sin aviso), expedición con rover y fotos reales de NASA.
**Validación:**
- [ ] T4: ¿la persona nueva **quiere jugar otra partida**? ¿Intenta conseguir la 3ª estrella?
- [ ] Dos partidas seguidas en el mismo lugar se sienten distintas.
- [ ] T5: Gale más difícil que Jezero.

### H5 — Release candidate 🟡
**Specs:** 16 (si llega), pulido, 17.
**Qué se puede probar:** la versión final.
**Validación:**
- [ ] **Congelar el código ~3 h antes de la entrega**: después de esto, solo arreglos de bugs.
- [ ] Bug bash: las 3 juegan 15 min intentando romperlo; cada bug se anota y se prioriza.
- [ ] T3 en todos los celus que tengamos a mano.
- [ ] Checklist de entrega del hackathon completa (spec 17).

### H6 — Entrega 🏁
- [ ] Link público final funcionando.
- [ ] Material de la entrega subido.
- [ ] Demo ensayada (con QR del link).

---

## Plan B por hito
| Si no llegamos a… | Hacemos… |
|---|---|
| Un minijuego en H3 | Queda el minijuego provisorio en esa sala |
| El arte completo en H3 | Se entrega con las piezas que hay + formas de colores de la paleta |
| H4 completo | Priorizar: mapa (12) > eventos (14) > rover (15) |
| H5 (spec 16) | Se recorta y va al pitch como "próximo paso" |
