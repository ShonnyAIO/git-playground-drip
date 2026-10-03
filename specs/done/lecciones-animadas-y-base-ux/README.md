# Lecciones animadas in-app + base UX/accesibilidad (cerrado)

Rama: `feat/lecciones-animadas-base-ux`, cerrada el 2026-10-03. Decisiones tomadas sin
indicación explícita y su veredicto: [choices.md](choices.md).

## Qué existe y por qué

GitPlayground (RED de la cátedra DPRED, UCV) enseña Git de forma visual. La pestaña
"Lecciones animadas" tiene seis micro-lecciones propias en motion graphics (estados,
ramas y HEAD, merge, rebase, remotos y conflictos). Muestran cómo se mueve Git por
dentro, y el estudiante las controla como un video: play, pausa, paso a paso, velocidad,
subtítulos y voz opcional. Además, el progreso sobrevive a recargar, la app se usa de
375 px a escritorio y cumple WCAG 2.2 AA con teclado y contraste.

**Por qué lecciones propias y no videos.** La Videoteca anterior embebía YouTube de
terceros. Al verificarlo vía oEmbed (2026-10-03): la lección 5 apuntaba a un video
inexistente (404), la 3 ("Fast-Forward vs 3-Way") era un video de introducción, y las
duraciones y marcas de tiempo no correspondían a los videos (cursos largos y genéricos).
Shonny eligió animaciones dentro de la app frente a MP4 renderizados (no interactivos,
pesados) o video generado por IA (costo y diagramas imprecisos). Los videos externos que
responden se conservan como "Para profundizar", con su autor real.

**Por qué se hizo junto con la base UX.** Fue el alcance que eligió Shonny. Quedaron
fuera: niveles guiados, rebase interactivo en el simulador y separar el modelo Git de
`VisualSimulator.jsx`.

## Principios e invariantes

- **Una lección es datos.** Cada paso declara su escena **completa**, no un diff: así se
  puede saltar a cualquier paso, y el renderer anima por `key` estable (lo que tiene el
  mismo id viaja; lo nuevo aparece). Ninguna lección trae JSX ni colores. Si hace falta
  un panel nuevo, se agrega al esquema y al renderer para todas.
- **El subtítulo es la narración**: lo que se lee, lo que anuncia `aria-live` y lo que dice
  la voz. Las afirmaciones se verifican contra Pro Git en español.
- **Un dueño por concepto.** Estado del estudiante y su persistencia:
  `src/state/learnerStore.js` (nadie más escribe progreso en `localStorage`). Catálogo
  de medallas: `src/state/badges.js`. Esquema, validación, layout del grafo, tiempos y
  reproducción: `src/lessons/engine/`. Dibujo: `src/lessons/render/`. Formato de
  duración: `formatClock` en `engine/timing.js`.
- **Colores por token.** `--primary` es solo relleno (texto blanco encima ≥ 4.5:1); el
  naranja como texto es `--primary-text`. Los estados Git usan `--color-working`,
  `--color-staging`, `--color-local` y `--color-remote`.
- **Carriles del grafo:** una cadena que sale de la *punta* de un carril lo continúa; si
  sale de un commit que ya tiene hijo en su carril, bifurca. La rama de HEAD va arriba de
  su pila de etiquetas. Cada fila reserva el alto de su pila más alta.
- **El SVG usa el ancho real del contenedor** (1 unidad = 1 px): el texto se lee igual en
  móvil, y bajo 640 px los paneles se apilan.
- **Nada de `transition: all`**: animaba `visibility` heredada y dejaba los botones del
  menú móvil sin poder recibir foco al abrirse.
- **Estilos nuevos en clases, no inline**: los estilos inline no responden a media
  queries. Las rejillas de módulo usan `.layout-split` con columnas en `--cols`.

## Dónde está en el código

- Estado: `useLearner`, `learnerReducer`, `loadLearnerState` (tests en
  `src/state/learnerStore.test.js`).
- Motor: `validateLesson`, `layoutGraph`, `stepDuration`/`lessonDuration`,
  `playbackReducer` (tests en `src/lessons/engine/engine.test.js` y `playback.test.js`;
  el oráculo valida cada lección registrada).
- Render: `LessonPlayer`, `SceneView`, `layoutScene` (`src/lessons/render/`).
- Contenido: `src/lessons/content/*.js` y el registro `index.js`. Guía para autores:
  [docs/lecciones-animadas.md](../../../docs/lecciones-animadas.md).
- Integración: `src/components/VideoLearning.jsx`; menú móvil y foco atrapado en
  `src/components/Sidebar.jsx`; enlace de salto y foco al título en `src/App.jsx`.
- Laboratorio solo de desarrollo: `lab.html` + `src/lab/`.
- Verificación: `tests/playwright_ux_suite.py` (TUC-UX-01 a 12), `scripts/a11y.py`
  (axe + teclado), `scripts/capture.py` (capturas por ancho con detección de desbordes),
  `scripts/contact_sheets.py` (hojas de contactos de lecciones). Checklist manual:
  [tuc/TUC-lecciones-y-ux.md](../../../tuc/TUC-lecciones-y-ux.md).

## Divergencias respecto del plan

- No hubo adaptador `setProgress`: los módulos reciben `completeModule(id)` directamente.
- El lint no estaba en verde (37 errores previos); se saneó al inicio.
- Se agregó un **póster** ("Ver lección") sobre el reproductor: sin él, la primera vista
  era un escenario casi vacío que parecía roto.
- La revisión de las hojas de contactos cambió el motor, no las lecciones: espacio por
  fila para etiquetas, HEAD sobre su rama y la regla de continuación de carriles.
- El fixture del laboratorio se eliminó al existir contenido real.

## Callejones sin salida

- **`page.screenshot(full_page=True)` de Chromium deforma este layout** (sidebar
  aplastado) aunque la página real esté bien. `scripts/capture.py` fija la altura del
  viewport en su lugar.
- **`min-width: 0` en el contenido principal sin `flex-shrink: 0` en el sidebar** lo
  encogía a unos 40 px en escritorio. Lo detectó la comparación píxel a píxel contra la
  línea base, no la inspección a ojo.
- **Enfocar el menú móvil en el mismo frame en que se abre** falla mientras `visibility`
  esté en transición (ver invariante de `transition: all`).
- **El build en verde no garantiza una app que cargue**: un error en tiempo de ejecución
  dejó la página en blanco con build exitoso. Por eso existe TUC-UX-12, que falla ante
  cualquier `pageerror`.

## Procedencia visual

- `assets/baseline/` — capturas del sitio **antes** de la rama (las seis pestañas a 375,
  768, 1024 y 1440 px). Fueron el estándar para comprobar que el escritorio no
  retrocedía, y la prueba del problema móvil (a 375 px el menú ocupaba la primera
  pantalla).
- `assets/slice02/` — layout responsive final y menú abierto.
- `assets/slice03/` — anillos de foco y enlace de salto en ambos temas.
- `assets/slice05/` — reproductor en escritorio, móvil, tema claro y un cuadro en plena
  transición.
- `assets/<lección>/hoja_{dark,light}.png` — hoja de contactos de cada lección, con la que
  se juzgó si el mecanismo se entiende sin leer.
- `assets/slice12/` — la Videoteca nueva frente a `baseline/*_videolearning.png` (iframe
  negro con marcas de tiempo inventadas).
