# Registro de decisiones (choices ledger)

Decisiones tomadas donde el spec callaba. Se consolida al cerrar el spec.

## Slice 01

- **Saneé el lint previo (37 errores → 0) dentro del slice 01.** El spec suponía lint en
  verde y no lo estaba. Casi todo eran imports sin uso; además: el tutor ahora deriva
  "abierto" del estado en vez de abrirse desde un efecto; la misión 2 del simulador se
  completa en la acción (`completeMission2`) y no en un efecto; `git status` imprimía la
  pista "use git restore --staged" una vez por archivo y ahora una sola vez, como Git real.
  Veredicto: sólido; queda un `eslint-disable` justificado en la misión 1.
- **Sin adaptador `setProgress`**: se pasa `completeModule`. Sólido (más simple que lo planeado).
- **IDs de lección como string** en la Videoteca vieja para que se persistan; se reemplazan
  en el slice 12. Provisional.
- **El reinicio de progreso conserva el tema** elegido. Reversible.
- **La medalla `video_master` exige completar todas las lecciones** (antes 3 y con el ID
  `quiz` por error). El spec ya lo pedía en el slice 12; se adelantó.

## Slice 02

- **Breakpoint de rejillas en 900 px**, distinto del de 1024 px del shell: entre 900 y
  1024 px hay espacio para dos columnas una vez que el sidebar pasa a drawer. Reversible.
- **En móvil el hero del Dashboard oculta su ícono decorativo** (< 600 px) para ganar
  ancho de lectura. Reversible.
- **El botón flotante del tutor tapa texto mientras se hace scroll** en móvil. Se aceptó
  como patrón estándar; no se agregó espacio de reserva. Revisar si molesta en pruebas
  con estudiantes.
- **Se descartaron las capturas de 1024 px** de la evidencia por redundantes (el script las
  sigue generando).

## Slice 03

- **El naranja de marca se oscureció** (47 % de luminosidad en ambos temas) para que el
  texto blanco de los botones cumpla 4.5:1. Es el cambio visual más notorio del slice;
  si la cátedra prefiere el naranja anterior, la alternativa es texto oscuro sobre
  naranja claro. Reversible en un token.
- **El enlace de salto se superpone al logo** mientras tiene foco. Patrón habitual; aceptado.
- **El foco salta al título del módulo solo cuando el estudiante cambia de pestaña**, no
  en la carga inicial (para no secuestrar el foco al entrar).
- **Reducción de movimiento global**: con `prefers-reduced-motion` se anulan todas las
  animaciones y transiciones y se ocultan los brillos. El reproductor (slice 05) define
  además su propio comportamiento.

## Slices 04–05

- **Sin reproducción automática**: el estudiante pulsa Play. Evita sorpresas (y audio) al
  abrir la pestaña y satisface la reducción de movimiento sin lógica extra.
- **Altura del escenario fija por lección** (la del paso más alto): estabilidad sobre
  aprovechamiento del espacio.
- **Un foco puede iluminar dos vistas del mismo commit** (zona Repositorio y grafo).
  Aceptado: es el mismo objeto.
- **Paleta por carril** (main naranja, segunda rama azul, tercera verde, cuarta amarilla)
  reutilizando tokens existentes; los commits `ghost` en gris punteado.
- **Narración por voz**: usa la primera voz `es-*` del sistema; si no hay, la del
  navegador con `lang = es-ES`. Su calidad depende del sistema operativo del estudiante.

## Slices 06–11

- **Lecciones de 41 a 58 segundos** (8–10 pasos): micro-lecciones para ver antes de
  practicar. El ritmo es 380 ms por palabra con mínimo de 3,5 s por paso; el estudiante
  puede bajar a 0,75×. Si en pruebas resulta rápido, se ajusta en `timing.js`.
- **Orden del temario**: estados → ramas/HEAD → merge → rebase → remotos → conflictos.
  Rebase va antes que remotos (como en el spec), aunque su paso de "peligro" menciona
  `origin/feature`; se explica en el propio subtítulo.
- **Rebase en la lección 4 manda a practicar en la pestaña de Conflictos** (que tiene la
  teoría Merge vs Rebase); no existe práctica de rebase en el simulador.
- **El foco `branch:main` ilumina main en ambos paneles** (local y GitHub) en la lección
  de remotos. Aceptado; separar focos por panel exigiría ampliar el esquema.
- **Videos externos en "Para profundizar"**: se reutilizaron los cinco que existían y
  responden (con autor real; los de freeCodeCamp marcados "en inglés"); el que daba 404
  se descartó. Se sumaron Pro Git en español y Learn Git Branching.
- **Una sola regla de carriles para todo**: una rama que sale de la punta de otra la
  continúa. Consecuencia visible: en la lección 2, c4 nace en el carril de main y se
  desplaza a un carril propio cuando main avanza (c5).

## Slice 12

- **Póster con botón "Ver lección"** antes de la primera interacción (no estaba en el
  spec). Corrige la primera impresión de escenario vacío.
- **La lección se marca completada al llegar al final**, aunque el estudiante haya
  saltado pasos con las flechas. Prioriza no frustrar; el botón permite desmarcar.
- **El menú pasa de "Clases & Videos" a "Lecciones animadas"**; el id interno
  `videolearning` se mantiene para no tocar estado guardado ni la suite.
