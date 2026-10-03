# 12 — Integración en la Videoteca

## Contrato que desbloquea

La pestaña "Clases & Videos" reproduce las 6 lecciones animadas. No quedan iframes de
YouTube ni marcas de tiempo o duraciones inventadas.

## Costura

- `VideoLearning.jsx` se reescribe sobre `LessonPlayer` y `src/lessons/content/index.js`.
  Se elimina el arreglo `LESSONS` con `embedUrl`/`timestamps`.
- Lista de lecciones: título, nivel, número de pasos y duración **calculada**
  (`Σ stepDuration`), estado completado. Filtros por nivel (se conservan).
- Bajo el reproductor: objetivos, comandos de la lección (derivados de los `command` de
  sus pasos, sin duplicar datos), botón de práctica (`practice.tab`) y "Para profundizar"
  con `furtherReading` (enlaces externos, `rel="noopener"`, título y autor).
- Completar: al terminar la reproducción (`ended`) la lección se marca sola vía
  `setLessonCompleted(id, true)`; el botón manual se mantiene para desmarcar.
- Medalla `video_master` al completar las 6 (antes: 3 y con ID equivocado; se corrige en
  el slice 01). `progress.videolearning = true` al completar las 6.
- Dashboard: el botón "Clases en Video (6 Lecciones)" y la descripción del módulo se
  actualizan a "Lecciones animadas".

## Qué puede ver el humano

Producción local (`npm run build && npm run preview`): recorrer la Videoteca completa.

## Verificación

- `grep -r "youtube" src/` vacío.
- Playwright: elegir lección 3, reproducir hasta el final con velocidad 1.5 → queda
  marcada como completada y persiste tras recargar.
- Capturas a 375 y 1440 px. `compare-screenshots` contra la línea base de la Videoteca
  (`assets/baseline/`) para juzgar que la nueva versión no es menos clara; último chequeo
  `screenshot-critique`.

## Decisiones delegadas

Distribución de la información bajo el reproductor y textos de UI.

## Feedback que cambiaría el slice

Si Shonny quiere conservar los videos externos embebidos, "Para profundizar" los muestra
como embeds colapsados en vez de enlaces.
