# 05 — Reproductor de lecciones

## Contrato que desbloquea

`<LessonPlayer lesson onComplete />` reproduce cualquier lección válida como un "video"
controlable. Se prueba con un fixture mínimo (3 pasos con zonas y grafo) mientras no
exista contenido real.

## Costura

- `src/lessons/engine/playback.js` — reducer puro `playbackReducer(state, action)`:
  estado `{ index, playing, elapsedMs, speed, ended }`; acciones `play`, `pause`,
  `toggle`, `next`, `prev`, `seek(index)`, `tick(ms)`, `setSpeed(0.75|1|1.25|1.5)`,
  `restart`. `tick` avanza de paso al superar `stepDuration`; al terminar el último paso
  queda `ended: true, playing: false`.
- `src/lessons/render/SceneView.jsx` — dibuja una escena en SVG responsivo
  (`viewBox` + `width: 100%`): paneles `zones`, `graph`/`remote`, `code`. Cada elemento con
  `key` estable; la posición se aplica como `style.transform` en un `<g>` con
  `transition: transform` para que los nodos **viajen** entre pasos (un archivo que pasa
  de Working a Staging se desliza; una etiqueta de rama se mueve de commit a commit).
  Elementos nuevos entran con una animación `pop-in`; los `ghost` se atenúan con trazo
  punteado. `focus` aplica un halo pulsante.
- `src/lessons/render/LessonPlayer.jsx` — controles: play/pausa, anterior, siguiente,
  barra de progreso segmentada por paso (clic = `seek`), selector de velocidad,
  subtítulos activables, voz activable. Teclado cuando el reproductor tiene foco:
  Espacio/K = play/pausa, ←/→ = paso anterior/siguiente, Inicio = reiniciar.
- Subtítulo del paso actual en una región `aria-live="polite"`; el comando del paso en una
  "terminal" pequeña con efecto de tipeo.
- Voz: `speechSynthesis` con voz `es-*` si existe; apagada por defecto; si el navegador no
  la soporta, el control no aparece. Con voz activa, el paso no avanza antes de que
  termine la locución.
- `prefers-reduced-motion`: sin viaje ni pop-in (los elementos cambian en el sitio con un
  fundido corto) y la reproducción **no** arranca sola.
- Colores solo por tokens (`--color-working`, etc.); se ve bien en tema claro y oscuro.

## Qué puede ver el humano

En `lab.html`, el reproductor con el fixture, más una "hoja de contactos": todos los pasos
renderizados estáticos en una grilla.

## Verificación

- `playback.test.js`: avance por `tick`, borde del último paso, `seek` fuera de rango
  (se acota), `prev` en el paso 0, `setSpeed` cambia la duración efectiva.
- Playwright en `lab.html`: play → tras la duración el paso cambia; Espacio pausa; →
  avanza; el subtítulo cambia en la región `aria-live`.
- Capturas del fixture en tema claro y oscuro, a 375 y 1440 px. Último chequeo: la skill
  `screenshot-critique` (variable: **legibilidad y jerarquía del reproductor**; fuera de
  alcance el contenido de las lecciones).

## Decisiones delegadas

Iconografía de los controles (lucide), curva de easing (una sola para todo el motor),
tamaños del SVG, diseño de la mini-terminal.

## Debe seguir verde

Lint, build, tests del motor.
