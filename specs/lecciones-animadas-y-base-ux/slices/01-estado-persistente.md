# 01 — Estado persistente del estudiante

## Contrato que desbloquea

XP, nivel, medallas, módulos completados, lecciones completadas y la pestaña actual
sobreviven a recargar la página. Hoy todo vive en `useState` de `App.jsx` y se pierde.

## Costura (API)

- `src/state/badges.js` — `BADGES`: catálogo inmutable `{ id, name, desc, icon }` (sale de
  `App.jsx`). `icon` sigue siendo el nombre del ícono de lucide, como hoy.
- `src/state/learnerStore.js` — puro, sin React:
  - `initialLearnerState()` → `{ version: 1, currentTab: 'dashboard', theme: 'dark', progress: { simulator, github, conflicts, quizzes, videolearning }, unlockedBadges: [], completedLessons: [] }`
  - `learnerReducer(state, action)` con acciones `setTab`, `setTheme`, `completeModule`, `unlockBadge`, `toggleLesson`, `reset`.
  - `loadLearnerState(storage)` / `saveLearnerState(storage, state)` con clave
    `gitplayground_learner_v1`. JSON corrupto, `version` distinta o storage que lanza
    excepción ⇒ estado inicial, nunca un crash. Campos desconocidos se descartan.
  - `deriveXp(state)` y `deriveLevel(xp)` (misma fórmula y niveles que hoy en `App.jsx`).
- `src/state/useLearner.js` — hook `useLearner()` = `useReducer` + guardado en `useEffect`.
- `App.jsx` usa el hook; los componentes siguen recibiendo `progress`, `setProgress`,
  `unlockBadge` con la misma forma para no tocar sus internos en este slice.
  `setProgress(fn)` se adapta a `completeModule` (el adaptador vive en `App.jsx` y se
  borra cuando un componente deje de usarlo; ver "andamiaje").
- El mensaje del tutor "🏆 ¡LOGRO DESBLOQUEADO!" se dispara solo cuando el reducer
  reporta un desbloqueo nuevo (no al rehidratar).

### Bugs que este slice corrige

- `VideoLearning` desbloquea `quiz` al completar 3 lecciones; debe ser `video_master`.
- `VideoLearning` escribe su propia clave en `localStorage`; pasa a usar el store.

## Qué puede ver el humano

Completar algo en el simulador, recargar: XP, medallas y pestaña siguen ahí. Un botón
"Reiniciar progreso" en el pie del sidebar (con confirmación) vuelve al estado inicial.

## Verificación

- Agregar Vitest (`npm i -D vitest`, script `"test": "vitest run"`).
- `src/state/learnerStore.test.js`: ida y vuelta guardar→cargar; JSON corrupto; versión
  distinta; storage que lanza; `unlockBadge` idempotente (no duplica ni re-notifica);
  `deriveLevel` en los bordes 249/250, 999/1000.
- Manual: recargar en cada pestaña conserva la pestaña.

## Andamiaje con fecha de muerte

El adaptador `setProgress(fn)` en `App.jsx` muere en el slice 12, cuando la Videoteca
pasa a llamar acciones del store directamente; los demás módulos lo conservan hasta que
se refactoricen (fuera de alcance; anotarlo en el ledger).

## Decisiones delegadas

Nombres internos, forma exacta de las acciones, ubicación del botón de reinicio dentro del pie.

## Debe seguir verde

`npm run lint`, `npm run build`, suite Playwright existente (`tests/playwright_ux_suite.py`).

## Feedback que cambiaría el slice

Si Shonny quiere perfiles múltiples (varios estudiantes en un equipo de laboratorio), la
clave pasa a ser por perfil.
