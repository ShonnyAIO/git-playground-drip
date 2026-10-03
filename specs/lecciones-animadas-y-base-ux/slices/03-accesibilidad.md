# 03 — Accesibilidad base (DUA / WCAG 2.2 AA)

## Contrato que desbloquea

Toda la app se recorre y opera con teclado, el foco siempre se ve, y la auditoría
automática no reporta violaciones `serious` ni `critical`.

## Costura

- Enlace "Saltar al contenido" como primer elemento enfocable (WCAG 2.4.1).
- Estilo `:focus-visible` global con contraste suficiente en ambos temas (2.4.7).
- Navegación: `aria-current="page"` en la pestaña activa. Al cambiar de pestaña, el foco
  va al `h2` del módulo (con `tabIndex={-1}`) para que el lector de pantalla anuncie el
  cambio.
- Drawer móvil (del slice 02): foco atrapado mientras está abierto y devuelto al botón al
  cerrarse; `aria-expanded` en el botón.
- `@media (prefers-reduced-motion: reduce)`: desactiva animaciones decorativas
  (`bg-glow`, pulsos) y acorta transiciones a ≈0.
- Elementos `div` con `onClick` pasan a `button` (o a `role="button"` + teclado si un
  `button` rompe el layout). El tutor flotante tiene `aria-label`.
- Contraste: revisar `--text-tertiary` en ambos temas (≥ 4.5:1 sobre su fondo) y
  ajustarlo si falla.

## Qué puede ver el humano

Recorrer la app solo con Tab, Shift+Tab, Enter y Esc.

## Verificación

- Agregar `axe-core` (devDependency) y, en la suite Playwright, inyectar
  `node_modules/axe-core/axe.min.js` y correr `axe.run()` en cada pestaña y en ambos
  temas: 0 violaciones `serious`/`critical`.
- Prueba de teclado en Playwright: desde la carga, Tab llega al enlace de salto; Enter en
  una pestaña mueve el foco al `h2` del módulo.
- Último chequeo: la skill `screenshot-critique` sobre capturas con foco visible en el
  menú (tema claro y oscuro).

## Decisiones delegadas

Color exacto del anillo de foco, texto del enlace de salto.

## Debe seguir verde

Lint, build, tests, suite Playwright.

## Estado

✅ Implementado. `scripts/a11y.py` (axe en 6 pestañas × 2 temas + 6 pruebas de teclado)
sale con 0 bloqueantes; antes del slice había 12 combinaciones con contraste `serious`.
Evidencia en `assets/slice03/`.

- Tokens de contraste calculados (no tanteados) para ≥ 4.5:1: `--primary` pasa a ser
  solo **relleno** (47 % de luminosidad, texto blanco encima) y se agrega
  `--primary-text` para texto e íconos sobre superficies (40 % claro / 65 % oscuro).
  `--text-tertiary` 42 % / 62 %. Estados Git del tema claro oscurecidos.
- `transition: all` reemplazado por listas explícitas de propiedades: animaba
  `visibility` heredada y dejaba los botones del drawer no enfocables al abrir.
- Paneles de diff del Conflict Solver operables con teclado (`role="button"`,
  `aria-pressed`). El grafo del simulador ya tenía teclado.
- Queda 1 aviso `moderate` (`landmark-unique`) en el Dashboard; no bloquea.
