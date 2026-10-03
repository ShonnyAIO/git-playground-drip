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
