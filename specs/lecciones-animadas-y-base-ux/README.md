# Lecciones animadas in-app + base UX/accesibilidad

## Next Agent Prompt

> Última actualización: 2026-10-03. Estado: **slices 01–04 cerrados; siguiente: 05 (reproductor).** Para ver el motor: `npm run dev` y abrir `/lab.html`.
>
> Trabajas en la rama `feat/lecciones-animadas-base-ux` (nunca en `main`). Haz commit al
> cerrar cada slice; **no hagas `push` ni deploy a Netlify** sin confirmación de Shonny.
>
> Empieza por el primer slice sin marcar en la lista de abajo. Lee su archivo en
> `slices/`, cumple su contrato, corre sus verificaciones y marca la casilla. Antes de
> terminar tu pase, actualiza esta sección: estado, siguiente punto de partida y
> cualquier bloqueo nuevo.

### TODO global

- [x] [01 — Estado persistente del estudiante](slices/01-estado-persistente.md)
- [x] [02 — Layout responsive](slices/02-layout-responsive.md)
- [x] [03 — Accesibilidad base](slices/03-accesibilidad.md)
- [x] [04 — Motor de escenas (puro)](slices/04-motor-escenas.md)
- [ ] [05 — Reproductor de lecciones](slices/05-reproductor.md)
- [ ] [06 — Lección 1: los tres estados](slices/06-leccion-estados.md)
- [ ] [07 — Lección 2: ramas y HEAD](slices/07-leccion-ramas-head.md)
- [ ] [08 — Lección 3: merge fast-forward vs 3 vías](slices/08-leccion-merge.md)
- [ ] [09 — Lección 4: rebase vs merge](slices/09-leccion-rebase.md)
- [ ] [10 — Lección 5: remotos (push/fetch/pull)](slices/10-leccion-remotos.md)
- [ ] [11 — Lección 6: anatomía de un conflicto](slices/11-leccion-conflictos.md)
- [ ] [12 — Integración en la Videoteca](slices/12-integracion-videoteca.md)
- [ ] [13 — Cierre: docs, TUC y suite E2E](slices/13-cierre.md)

## Objetivo

GitPlayground (RED de la cátedra DPRED, UCV; desplegado en
<https://git-playground-ucv.netlify.app/>) enseña Git de forma visual. Esta iteración
hace dos cosas:

1. **Lecciones animadas propias** (motion-graphics en SVG/React dentro de la app) que
   reemplazan los embeds de YouTube de la Videoteca. El estudiante las controla: play,
   pausa, paso a paso, velocidad y subtítulos.
2. **Base UX y accesibilidad**: progreso que sobrevive a recargar, layout usable de
   375 px a 1440 px y navegación por teclado conforme a DUA/WCAG 2.2 AA.

## Decisiones tomadas (con su porqué)

| Decisión | Porqué | Alternativa descartada |
|---|---|---|
| Lecciones animadas in-app, no MP4 ni IA | Interactivas, accesibles (subtítulos, pausa, teclado), sin peso ni costo, y comparten el lenguaje visual del simulador | MP4 con Remotion (no interactivo, pesado); Higgsfield (consume créditos, diagramas imprecisos) |
| Reemplazar los videos de YouTube | Verificado el 2026-10-03 vía oEmbed: la lección 5 (`il5k5E_8Z-Y`) da 404, la 3 apunta a "Curso Git Introducción Vídeo 1" en vez de merge FF vs 3 vías, y las duraciones y marcas de tiempo son inventadas | Corregir las marcas de tiempo (los videos son cursos largos genéricos; no hay capítulos que encajen) |
| Los videos externos válidos quedan como "Para profundizar" con título y autor reales, sin marcas de tiempo | Atribuir bien a terceros (Fazt, HolaMundo, freeCodeCamp, pildorasinformaticas) sin inventar contenido | Borrarlos del todo |
| Sin dependencias de animación nuevas: transiciones CSS sobre `transform` de grupos SVG | Las escenas son declarativas y los elementos tienen `key` estable; CSS basta y respeta `prefers-reduced-motion` | `motion`/framer-motion (más peso, otra forma de animar) |
| Narración por voz (Web Speech API, es) opcional y apagada por defecto | Suma accesibilidad sin grabar audio; los subtítulos son la fuente de verdad | Grabar locuciones (sin recursos para eso) |
| Sin migraciones ni compatibilidad | Default del spec y no hay datos de servidor; la clave antigua `gitplayground_completed_lessons` se ignora porque los IDs de lección cambian | Migrar la clave antigua |
| Alcance: solo base UX + videos | Elegido por Shonny; niveles guiados, rebase interactivo en el simulador y refactor del motor del simulador quedan fuera | — |
| Rama feature sin push | Elegido por Shonny; él decide el deploy | Push + PR |

Nota de proceso: `write-spec` pide tres borradores paralelos con subagentes. Se
sintetizó en un solo pase porque la sesión no autoriza lanzar subagentes sin pedido
explícito; las tres lentes (menos slices, riesgo primero, calidad de las costuras) se
aplicaron a mano. El riesgo más alto (motor de escenas + reproductor) va antes que el
contenido.

## Grafo de slices

```
01 estado ─┐
02 layout ─┼─(independientes, base UX)
03 a11y ───┘ (03 depende de 02: el drawer móvil necesita gestión de foco)

04 motor ──► 05 reproductor ──► 06 … 11 (una lección por slice, en cualquier orden tras 06)
                                         └──► 12 integración ──► 13 cierre
01 ─────────────────────────────────────────► 12 (la finalización de lecciones se persiste)
```

## Dueños únicos (invariantes)

- **Estado del estudiante**: `src/state/learnerStore.js` es el único dueño de progreso,
  medallas desbloqueadas, lecciones completadas y pestaña actual, y de su persistencia.
  Ningún componente vuelve a tocar `localStorage` para progreso.
- **Catálogo de medallas**: una sola definición (`src/state/badges.js`); el store guarda
  solo IDs desbloqueados.
- **Escenas**: `src/lessons/engine/` es el único dueño del esquema de escena, del layout
  del grafo y de la validación. Las lecciones son **datos** (`src/lessons/content/*.js`),
  sin JSX propio.
- **Renderizado de escenas**: `src/lessons/render/` dibuja cualquier escena; ninguna
  lección trae su propio componente.
- **Colores de estados Git**: los tokens existentes `--color-working`, `--color-staging`,
  `--color-local`, `--color-remote` en `src/index.css`. Las lecciones no definen colores.
- **Estilos nuevos**: clases en `src/index.css` (o un CSS por módulo), no `style={{}}`
  inline; el inline impide los breakpoints. No se reescriben estilos inline ajenos al
  slice salvo los que bloquean el responsive (slice 02).

El estado final debe leerse como diseñado así desde el inicio: la Videoteca consume el
reproductor como cualquier otro componente y no quedan restos de iframes ni de datos de
YouTube inventados.

## Puertas de verificación permanentes

- `npm run lint` sin errores (quedan 4 warnings `exhaustive-deps` previos en módulos fuera de alcance) y `npm run build` en verde en cada slice.
- La app carga sin `pageerror` (el build pasa aunque la app quede en blanco; se comprobó en el slice 01).
- `npm test` (Vitest) en verde.
- `uv run --with playwright==1.57.0 python scripts/a11y.py` con 0 bloqueantes (axe serious/critical + teclado).
- Colores nuevos: `--primary` solo como relleno; texto naranja con `--primary-text`.
- **Todo slice visual** termina con la skill `screenshot-critique`
  sobre sus capturas como último chequeo antes de aceptarlo. Si el slice cambia un aspecto
  previo, además la skill `compare-screenshots`
  contra la línea base en `assets/baseline/`.
- Capturas con `uv run --with playwright==1.57.0 python scripts/capture.py <dir>` (requiere `npm run preview` en :4173): cada pestaña a 375, 768, 1024 y 1440 px, e informa elementos que se salen del viewport. No usar `full_page=True`: deforma el layout.

## Referencias investigadas

- Pro Git, cap. 1.3 (los tres estados), 3.1 (ramas como punteros), 3.2 (merge FF y de 3 vías),
  3.5 (ramas remotas), 3.6 (rebase): <https://git-scm.com/book/es/v2>
- Learn Git Branching (validación del formato visual): <https://learngitbranching.js.org/>
- WCAG 2.2: 2.2.2 Pausar, detener, ocultar; 2.3.3 Animación desde interacciones;
  1.2.2 Subtítulos; 2.4.1 Evitar bloques; 2.4.7 Foco visible: <https://www.w3.org/TR/WCAG22/>
- `prefers-reduced-motion`: <https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion>
- Web Speech API (`speechSynthesis`): <https://developer.mozilla.org/docs/Web/API/SpeechSynthesis>

## Fuera de alcance (registrado para iteraciones futuras)

- Niveles guiados con objetivo y verificación (estilo learngitbranching).
- Rebase interactivo dentro del simulador y modo "¿qué pasó aquí?".
- Separar el modelo Git de `VisualSimulator.jsx` (1.328 líneas) en un motor puro.
- Lección "botiquín" (stash, restore, reset, reflog): queda como lección 7 futura; el motor
  de escenas ya la soporta con los paneles de zonas y grafo.
- Video promocional MP4 (skill `launch-video`) para la presentación.

## Preguntas abiertas que cambiarían el plan

- Si la cátedra exige video descargable (MP4), se agrega un slice de exportación con
  Remotion reutilizando las mismas escenas.
- Si Shonny quiere conservar los videos de YouTube embebidos, el slice 12 los mueve a la
  pestaña "Para profundizar" como embeds en lugar de enlaces.
