# Astronaut Mission Trainer

Juego educativo para **NASA Space Apps Challenge 2026** — track *Junior Astronaut Mission Trainer*.

Sos la comandante de una base en Marte. Con tu tripulación (bots, y más adelante amigos) mantenés vivos el oxígeno, la comida, el escudo contra la radiación y la energía, jugando minijuegos cortos. Los bots aprenden de cómo jugás vos. Cada lugar de Marte es más difícil, por razones científicas reales.

---

## 👋 Si es tu primera vez acá, leé en este orden

1. **`docs/GDD.md`** — qué juego estamos haciendo (10 min de lectura).
2. **`docs/PLAN.md`** — fases, prioridades y quién hace qué.
3. **`docs/specs/README.md`** — la lista de tareas. Cada tarea es un spec con su objetivo.
4. **`AGENTS.md`** — las reglas que siguen nuestros agentes (y nosotras).

## 🔁 Cómo trabajamos

1. **Leemos los specs y los aprobamos.** Cada spec tiene una sección "Aprobación". Si estás de acuerdo, poné tu ✅. Si no, comentalo antes de que alguien empiece.
2. **Cada una toma sus specs** (son individuales, tienen una sola dueña).
3. **Rama por spec** → PR → revisión de otra integrante → `main`.
4. **Si una decisión afecta a otra persona, se avisa** y se anota en `docs/DECISIONS.md` (el agente está configurado para frenar y avisar).

## ▶️ Correr el juego

```bash
npm install
npm run dev      # abre http://localhost:5173
npm run check    # lint + tipos + tests
```

> ⚠️ **Estado actual del código:** existe un prototipo técnico armado con Claude antes de terminar la planificación. **Todavía no está aprobado.** El spec `docs/specs/02-revision-prototipo.md` describe qué contiene y la decisión pendiente: usarlo como base o descartarlo.

## 📁 Estructura

```
AGENTS.md / CLAUDE.md   Reglas para agentes
docs/                   GDD, plan, specs, guía de estilo, fuentes NASA, decisiones
data/                   Contenido editable (lugares, eventos)
src/                    Código (ver AGENTS.md §3)
public/assets/          Imágenes, sonidos, fotos NASA
tests/                  Tests de la lógica
```
