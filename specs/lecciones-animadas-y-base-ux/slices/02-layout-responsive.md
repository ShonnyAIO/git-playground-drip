# 02 — Layout responsive

## Contrato que desbloquea

La app es usable de 375 px a 1440 px sin scroll horizontal. Hoy, bajo 1024 px el sidebar
se apila arriba a altura completa y empuja el contenido fuera de la primera pantalla; las
rejillas con `gridTemplateColumns` inline (p. ej. `minmax(0,1fr) 340px` en la Videoteca)
no colapsan porque los estilos inline no responden a media queries.

## Costura

- Bajo 1024 px: barra superior fija (logo, nivel/XP compacto, botón menú) y el sidebar
  completo como **drawer** lateral que se abre con el botón y se cierra con Esc, con clic
  en el fondo o al elegir una pestaña.
- Estado del drawer local a `Sidebar` (no va al store).
- Las rejillas de columnas fijas de cada módulo pasan a clases CSS con breakpoints
  (`.layout-player`, `.layout-two-col`, etc.); solo las que rompen el ancho.
- Al cambiar de pestaña, el contenido principal vuelve arriba (hoy conserva el scroll de
  la pestaña anterior: al abrir el Simulador se cae a la mitad).

## Qué puede ver el humano

Capturas de cada pestaña a 375, 768, 1024 y 1440 px.

## Verificación

- Por pestaña y ancho: `document.documentElement.scrollWidth <= innerWidth` (sin scroll
  horizontal), comprobado en la suite Playwright.
- Guardar la línea base actual (antes de tocar nada) en `assets/baseline/` a 1440 px y
  usar la skill `compare-screenshots` contra ella para confirmar que en escritorio el
  aspecto no retrocede.
- Último chequeo: la skill `screenshot-critique` sobre las capturas de 375 y 768 px.

Variable visual del slice: **ajuste y legibilidad del layout**. Fuera de alcance: colores,
tipografía y estética de cada tarjeta.

## Decisiones delegadas

Animación del drawer, contenido exacto de la barra superior compacta, qué rejillas
internas necesitan clase (solo las que generan desborde).

## Debe seguir verde

Lint, build, tests, suite Playwright. Escritorio a 1440 px sin cambios visibles salvo el
reset de scroll.
