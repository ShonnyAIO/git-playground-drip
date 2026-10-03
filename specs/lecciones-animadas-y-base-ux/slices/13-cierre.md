# 13 — Cierre: documentación, TUC y suite E2E

## Contrato que desbloquea

El proyecto queda entregable: documentado, con checklist de aceptación para el
estudiante y la suite E2E cubriendo lo nuevo.

## Tareas

- `README.md` raíz: actualizar módulos (lecciones animadas en vez de videos), comandos
  `npm test`, estructura `src/state/` y `src/lessons/`. Seguir la skill `write-docs`:
  principios, no un espejo del código.
- `docs/lecciones-animadas.md`: cómo escribir una lección nueva (esquema de escena,
  reglas de validación, cómo verla en `lab.html`). Es la guía para que el grupo agregue
  la lección 7 sin tocar el motor.
- `tuc/TUC-lecciones-y-ux.md`: checklist `- [ ]` redactado como tareas del estudiante
  final (skill `software-project-standards`), con casos borde: tema claro/oscuro, móvil
  375 px, solo teclado, `prefers-reduced-motion`, voz sin soporte, recargar a mitad de
  lección, reiniciar progreso, localStorage bloqueado (modo privado).
- `tests/playwright_ux_suite.py`: escenarios nuevos (persistencia, responsive sin scroll
  horizontal, axe, reproductor) junto a los 7 TUC existentes.
- Pasar `review` (refactor-clean → code-review → write-docs) y `audit-choices`; resumir
  `specs/lecciones-animadas-y-base-ux/choices.md` en castellano, lo menos seguro primero.
- `close-spec` para archivar este spec en `specs/done/`.

## Verificación

Suite Playwright completa en verde contra `npm run preview`; lint, build y tests en verde.
