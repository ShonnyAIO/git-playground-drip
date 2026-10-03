# TUC — Lecciones animadas y base UX/accesibilidad

Checklist de aceptación para probar como estudiante, en el sitio desplegado o con
`npm run build && npm run preview`. Cada caso sigue **Dado / Cuando / Entonces**.
Marca la casilla solo si el resultado observado coincide.

La versión automatizada de varios casos vive en `tests/playwright_ux_suite.py`
(TUC-UX-08 a 12) y `scripts/a11y.py`.

## 1. Progreso que no se pierde

- [ ] **Dado** que entré por primera vez, **cuando** ejecuto `git init` en el Simulador,
  **entonces** gano la medalla "Repositorio Iniciado" y veo 100 XP en el menú.
- [ ] **Dado** que tengo XP y medallas, **cuando** recargo la página, **entonces** sigo
  en la misma pestaña con el mismo XP, medallas y lecciones completadas.
- [ ] **Dado** que tengo progreso, **cuando** pulso "Reiniciar progreso" y acepto,
  **entonces** vuelvo a 0 XP y 0 medallas, pero conservo el tema claro/oscuro elegido.
- [ ] **Dado** que pulso "Reiniciar progreso", **cuando** cancelo el diálogo,
  **entonces** no se pierde nada.
- [ ] **Caso borde — navegador en modo privado o con almacenamiento bloqueado:** la app
  funciona igual; el progreso solo dura mientras la pestaña está abierta.

## 2. Usar la app en el teléfono

- [ ] **Dado** un teléfono (o ventana de 375 px), **cuando** abro la app, **entonces**
  veo una barra superior con el logo, mi XP y un botón de menú, y el contenido empieza
  en la primera pantalla.
- [ ] **Cuando** abro el menú y elijo una sección, **entonces** el menú se cierra y la
  sección empieza desde arriba.
- [ ] **Cuando** recorro las 6 secciones, **entonces** nunca aparece scroll horizontal
  (el grafo del Simulador sí puede desplazarse dentro de su propio recuadro).
- [ ] **Caso borde — tablet (768 px) y ventana de 1024 px:** los módulos se reacomodan
  en una columna o dos sin que nada se corte.

## 3. Solo con teclado y con lector de pantalla

- [ ] **Dado** que acabo de cargar la página, **cuando** pulso Tab, **entonces** aparece
  "Saltar al contenido"; con Enter llego al contenido principal.
- [ ] **Cuando** navego con Tab, **entonces** siempre veo un borde de foco visible, en
  tema claro y oscuro.
- [ ] **Cuando** elijo una sección del menú con Enter, **entonces** el foco pasa al
  título de esa sección.
- [ ] **Dado** el menú móvil abierto, **cuando** pulso Tab muchas veces, **entonces** el
  foco no sale del menú; **cuando** pulso Esc, se cierra y el foco vuelve al botón.
- [ ] **Dado** un conflicto en el Conflict Solver, **cuando** elijo una versión con
  Tab + Enter, **entonces** queda seleccionada igual que con el mouse.
- [ ] **Caso borde — movimiento reducido activado en el sistema:** no hay animaciones
  decorativas y las lecciones cambian de paso sin desplazamientos.

## 4. Lecciones animadas

- [ ] **Dado** que abro "Lecciones animadas", **entonces** veo la lección 1 con un póster
  (título, nivel, pasos y duración) y el temario de 6 lecciones.
- [ ] **Cuando** pulso "Ver lección", **entonces** la animación avanza sola paso a paso,
  con el subtítulo y el comando de cada paso.
- [ ] **Cuando** pulso pausa, anterior o siguiente, o hago clic en un tramo de la barra,
  **entonces** la lección responde de inmediato.
- [ ] **Dado** que el reproductor tiene el foco, **cuando** uso Espacio, ← y → e Inicio,
  **entonces** pausa/reanuda, cambia de paso y reinicia.
- [ ] **Cuando** cambio la velocidad a 0,75× o 1,5×, **entonces** la lección va más
  lenta o más rápida.
- [ ] **Cuando** desactivo los subtítulos, **entonces** el texto se oculta sin mover el
  resto del reproductor.
- [ ] **Cuando** activo la narración por voz, **entonces** escucho cada subtítulo en
  español y el paso no avanza hasta que termina la frase.
- [ ] **Caso borde — navegador sin voces (o sin Web Speech):** el botón de voz no aparece
  y todo lo demás funciona.
- [ ] **Cuando** una lección llega al final, **entonces** queda marcada como completada
  en el temario, y sigue así al recargar.
- [ ] **Caso borde — completar las 6 lecciones:** gano la medalla "Autodidacta Visual" y
  el módulo cuenta en el Progreso General.
- [ ] **Cuando** pulso el botón de práctica, **entonces** voy a la sección indicada
  (Simulador, GitHub o Conflictos).
- [ ] **Cuando** abro un enlace de "Para profundizar", **entonces** se abre en otra
  pestaña y el contenido coincide con el título y autor mostrados.
- [ ] **Caso borde — tema claro y oscuro:** en las 6 lecciones se leen los nombres de
  ramas, ids de commit y líneas de código.
- [ ] **Caso borde — teléfono:** las zonas y los grafos local/GitHub se apilan y el texto
  se lee sin hacer zoom.

## 5. Contenido (revisión docente)

- [ ] Cada lección dice lo mismo que el capítulo de Pro Git que cita (1.3, 2.2, 3.1, 3.2,
  3.5, 3.6).
- [ ] Rebase: queda claro que crea commits nuevos y la regla de no reorganizar commits ya
  publicados.
- [ ] Remotos: queda claro que `fetch` no mueve tu rama y que `pull = fetch + merge`.
