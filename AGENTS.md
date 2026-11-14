# AGENTS.md — Reglas para agentes de IA (y para humanas)

Este archivo lo leen Claude, Cursor, Copilot o cualquier agente que usemos. **Las 3 trabajamos con agentes, así que estas reglas son las que hacen que el código parezca escrito por una sola persona.**

Proyecto: juego educativo para NASA Space Apps 2026, track *Junior Astronaut Mission Trainer*. Público: chicos de 7 a 12 años (pero atractivo para cualquier edad). Antes de programar, leé `docs/GDD.md` y el spec de tu tarea en `docs/specs/`.

---

## 1. Coordinación del equipo (LO MÁS IMPORTANTE)

Somos 3 personas trabajando en paralelo, cada una con su agente. El mayor riesgo es que un agente tome una decisión que rompa el trabajo de otra.

### 1.1 Trabajá solo dentro de tu spec
- Cada tarea tiene un spec en `docs/specs/` con **dueña**, **objetivo** y **archivos que toca**.
- Solo modificá los archivos que tu spec dice que son tuyos.
- Si para cumplir tu spec necesitás tocar algo fuera de esa lista, **pará y avisá** (ver 1.3).

### 1.2 Contratos compartidos (no se cambian sin avisar)
Estos archivos los usan varias personas. Cambiarlos puede romper el trabajo de las demás:

| Contrato | Archivo(s) | Quién lo usa |
|---|---|---|
| Tipos del juego (stats, tareas, tripulación) | `src/core/types.ts` | Todas |
| Acciones del juego | `src/core/actions.ts` (`GameAction`) | Motor, bots, minijuegos |
| Interfaz de minijuegos *(la crea el spec 06)* | `src/minigames/MinigameScene.ts`, `src/minigames/registry.ts` | Motor, minijuegos |
| Números de balance | `src/config/balance.ts` | Todas |
| Paleta y estilos visuales *(código: los crea el spec 02)* | `src/ui/palette.ts`, `src/ui/layout.ts`, `docs/STYLE_GUIDE.md` | Todas |
| Arranque del juego y navegación *(los crea el spec 02)* | `src/main.ts`, `src/scenes/sceneKeys.ts` | Todas |
| Textos e idiomas | `src/i18n/es.json`, `src/i18n/en.json` | Todas |
| Formato de datos | `data/*.json` | Motor, contenido |
| Dependencias y configuración | `package.json`, `tsconfig.json`, `eslint.config.js`, `vite.config.ts` | Todas |
| Estructura de carpetas | todo el árbol | Todas |
| Diseño del juego | `docs/GDD.md`, `docs/specs/*` | Todas |

> Excepción: **agregar** claves nuevas en `i18n/*.json` o valores nuevos en `balance.ts` está permitido sin avisar. **Renombrar, borrar o cambiar el significado** de algo existente, no.

### 1.3 Regla obligatoria: avisar cuando una decisión afecta a otras
Si el agente está por hacer cualquiera de estas cosas:
- modificar un contrato compartido (tabla 1.2),
- tocar archivos que no son de su spec,
- tomar una decisión de diseño, mecánica o estética que **no está escrita** en el GDD o en el spec,
- agregar una dependencia nueva,
- hacer algo que contradice un spec (propio o ajeno),

entonces **DEBE frenar antes de hacerlo** y mostrarle a la persona este aviso:

```
⚠️ DECISIÓN QUE AFECTA AL EQUIPO
Qué quiero hacer: …
Por qué: …
A quién afecta: (spec / persona / archivo) …
Alternativa sin afectar a nadie: …
¿Avanzo? Si avanzás, avisale al equipo y anotalo en docs/DECISIONS.md
```

Y esperar confirmación. Si la persona confirma, el agente agrega una entrada en `docs/DECISIONS.md`.

### 1.4 Si el spec no alcanza
Si el spec es ambiguo o le falta información, el agente **pregunta** en lugar de inventar. Una decisión inventada en silencio es la forma más rápida de que dos personas hagan cosas incompatibles.

---

## 2. Código limpio y legible por humanas

El código lo van a leer personas (nosotras y el jurado), no solo agentes.

- **Nombres completos y descriptivos, en inglés**: `oxygenLevel`, `assignTaskToBot()`. Nunca `oxL`, `tmp`, `data2`, `handleStuff`.
- **Funciones chicas**: una función hace una sola cosa. Máximo ~30 líneas.
- **Archivos chicos**: un concepto por archivo, máximo ~200 líneas.
- **Nada de números mágicos**: todo valor de juego va en `src/config/balance.ts`. Todo color en `src/ui/palette.ts`.
- **Nada de texto visible en el código**: todo texto sale de `src/i18n/*.json` con `t('clave')`.
- **Comentarios que explican el POR QUÉ**, no el qué. Cada archivo empieza con un comentario corto de para qué existe.
- **TypeScript estricto**: prohibido `any`, prohibido `// @ts-ignore`.
- **Simple > ingenioso**: nada de abstracciones "por si acaso", patrones complejos ni optimizaciones prematuras. Si hay dos formas, elegí la que una persona entiende más rápido.
- **No dejes código muerto** ni `console.log` olvidados.
- **Antes de dar algo por terminado**: `npm run check` (lint + tipos + tests) debe pasar.

## 3. Arquitectura

```
src/
  core/        Lógica pura del juego. PROHIBIDO importar Phaser. Se testea con Vitest.
  bots/        Decisiones de los bots. Mandan GameAction, igual que una persona.
  config/      balance.ts: todos los números del juego.
  content/     Carga de data/*.json.
  scenes/      Escenas de Phaser (lo visual). Leen el estado, mandan acciones.
  minigames/   Un minijuego por carpeta. Todos extienden MinigameScene.
  ui/          Componentes visuales reutilizables, paleta, tipografía.
  i18n/        Textos en es.json / en.json.
  services/    Guardado del progreso (localStorage).
data/          Contenido editable sin programar (lugares, eventos, datos).
public/assets/ Imágenes, sonidos, fotos NASA.
docs/          GDD, plan, specs, guía de estilo, fuentes, decisiones.
tests/         Tests de src/core y src/bots.
```

Reglas:
- **La lógica no sabe nada de lo visual.** `core/` no importa Phaser; las escenas no calculan reglas del juego. Así podremos llevar la lógica a un servidor multijugador.
- **Bots y humanos mandan las mismas `GameAction`.** Nunca un atajo especial para bots.
- **Cada minijuego vive en su carpeta** y solo se conecta al resto a través de `MinigameScene` y `registry.ts`.

## 4. Diseño para chicos de 7 a 12 años

- **Cero curva de aprendizaje**: al entrar se tiene que saber qué tocar. Un botón principal grande por pantalla.
- **Íconos antes que texto.** Textos de una línea. Nunca un bloque de texto antes de jugar.
- **Botones táctiles de 48 px de juego como mínimo.**
- **Toda acción tiene respuesta visual (y sonora cuando haya audio).**
- **Lo educativo llega después de la acción, como premio**, en una línea.
- **Mobile first, horizontal.** Probar siempre en el celu o en modo dispositivo del navegador.

## 5. Estética

- Seguí `docs/STYLE_GUIDE.md`. Solo colores de la paleta.
- Lo generado es pixel art. **Las imágenes reales de la NASA van siempre enmarcadas** (ventana, monitor, foto) y con su crédito en `docs/DATA_SOURCES.md`.

## 6. Git

- Una rama por spec: `spec-07-paneles`, `spec-03-nucleo`.
- Commits chicos y descriptivos en español o inglés, siempre el mismo idioma por commit.
- Nada entra a `main` sin un Pull Request revisado por otra integrante.
- Nunca `push --force` a `main`.

## 7. Comandos

```bash
npm install       # una vez
npm run dev       # juego en http://localhost:5173 (y en el celu por la IP de la red)
npm run check     # lint + tipos + tests: tiene que pasar antes de cada PR
npm run build     # build para publicar
```
