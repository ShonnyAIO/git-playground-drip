# Registro de decisiones (consolidado)

Decisiones que tomé por mi cuenta donde el pedido y el spec no decían nada, revisadas
contra el código final de la rama `feat/lecciones-animadas-base-ux`. Agrupadas por
veredicto y, dentro de cada grupo, de **menos a más segura** (la confianza es qué tan
seguro estoy de que Shonny habría elegido lo mismo).

**Revisa primero:** el naranja de marca más oscuro (N1), el ritmo de las lecciones (N2)
y que una lección cuente como completada aunque se salten pasos (N3).

---

## Necesitan tu decisión (cada una ya tiene un valor provisional aplicado y reversible)

### N1. El naranja de marca quedó más oscuro — confianza: baja
- **Cuándo:** slice 03 (`f6f4c9d`).
- **Qué pasaba:** los botones naranjas con letra blanca tenían contraste 2,9:1 en modo
  oscuro; la norma WCAG AA (la que exige el DUA de la cátedra) pide 4,5:1. La auditoría
  automática lo marcaba como falla grave en las 12 combinaciones de pestaña y tema.
- **Qué hice:** el token `--primary` (el naranja de relleno) bajó al 47 % de luminosidad
  en ambos temas, y creé `--primary-text` para el naranja usado como letra. Resultado:
  botones con un naranja-rojizo más intenso que el original.
- **Alternativa:** mantener el naranja claro y poner letra oscura sobre los botones.
- **Provisional:** quedarse con el naranja oscuro. Revertir es cambiar dos líneas de
  `src/index.css`.

### N2. Las lecciones duran entre 41 y 58 segundos — confianza: media-baja
- **Cuándo:** slices 04 y 06–11.
- **Qué pasa hoy:** cada paso dura 380 ms por palabra del subtítulo, con un mínimo de
  3,5 s. Una lección de 10 pasos dura unos 58 s. El estudiante puede bajar a 0,75×.
- **Riesgo:** para alguien que ve Git por primera vez, la animación puede pasar rápido
  (hay que mirar el movimiento *y* leer el subtítulo).
- **Provisional:** dejarlo así y medirlo con estudiantes; si se queda corto, se cambia un
  número en `src/lessons/engine/timing.js` y afecta a todas las lecciones a la vez.

### N3. Una lección cuenta como completada al llegar al final, aunque se salten pasos — confianza: media
- **Cuándo:** slices 05 y 12.
- **Escenario:** el estudiante abre "Merge", aprieta → siete veces y llega al último
  paso. La lección queda marcada como completada y suma hacia la medalla.
- **Alternativa:** exigir que cada paso se haya reproducido completo.
- **Provisional:** marcar al llegar al final (prioriza no frustrar). El botón "Completada"
  permite desmarcar.

### N4. El botón flotante del tutor tapa texto en el teléfono — confianza: media
- **Cuándo:** slice 02.
- **Qué pasa:** a 375 px, la burbuja del tutor (abajo a la derecha) cubre unas palabras
  mientras se hace scroll; al mover la página quedan visibles.
- **Provisional:** se aceptó como patrón estándar de botón flotante. Si molesta en
  pruebas, se reserva espacio inferior en móvil.

---

## Sólidas (arquitectura que ahora te pertenece)

### Contenido y motor de lecciones

- **S1. El texto que resalta un foco puede iluminar dos paneles a la vez** — confianza
  media. En la lección de remotos, un paso dice "adelanta main" y se iluminan tanto el
  `main` de tu computadora como el de GitHub, porque el foco se identifica por nombre
  (`branch:main`). Separarlos exigiría ampliar el esquema; se dejó así.
- **S2. Regla de carriles del grafo** — confianza media-alta. Una rama que sale de la
  *punta* de otra continúa su misma línea; si sale de un commit anterior, abre una línea
  nueva. Ejemplo: tras `git fetch`, `origin/main` adelantada se dibuja en la misma línea
  que `main` (antes parecía una bifurcación), y el rebase queda como la figura de Pro Git
  3.6. Efecto visible: en "Ramas y HEAD", c4 nace en la línea de main y se desplaza a una
  propia cuando main avanza.
- **S3. Rebase manda a practicar en la pestaña Conflictos** — confianza media. No hay
  práctica de rebase en el simulador; Conflictos tiene la teoría Merge vs Rebase.
- **S4. Orden del temario:** estados → ramas/HEAD → merge → rebase → remotos →
  conflictos. Rebase va antes que remotos (como en el spec) aunque menciona
  `origin/feature`; el subtítulo lo explica. Confianza media-alta.
- **S5. Lecturas externas** — confianza alta. Se reutilizaron los cinco videos que
  existían y responden, ahora con su título y autor reales (los de freeCodeCamp marcados
  "en inglés"); el que daba 404 se descartó. Se sumaron Pro Git en español y Learn Git
  Branching. Los siete enlaces se comprobaron (HTTP 200).
- **S6. Lecciones como datos, validadas solo en tests** — confianza alta. Cada lección es
  un archivo en `src/lessons/content/`; un test rechaza ramas a commits inexistentes,
  focos que no están en la escena, enlaces sin https, etc. La app no valida en
  ejecución (el contenido lo escribe el equipo, no el usuario).
- **S7. Laboratorio `lab.html` solo para desarrollo** — confianza alta. `npm run dev` →
  `/lab.html` muestra cada lección con su validación, el reproductor y una hoja de
  contactos. No entra en el build de Netlify.

### Reproductor

- **S8. Sin reproducción automática; póster con "Ver lección"** — confianza alta. Al
  abrir la pestaña se ve el título y un botón grande, como un video. Evita sonido o
  movimiento sorpresa y cumple "movimiento reducido" sin código extra.
- **S9. Alto del escenario fijo por lección** (el del paso más alto) — confianza
  media-alta. El reproductor no salta de tamaño entre pasos, a costa de espacio vacío en
  los pasos cortos (el póster lo cubre al inicio).
- **S10. El dibujo usa el ancho real de la pantalla** — confianza alta. 1 unidad del SVG =
  1 píxel, así el texto mide lo mismo en el teléfono; bajo 640 px las zonas y los grafos
  local/GitHub se apilan.
- **S11. Narración por voz opcional** — confianza alta. Usa la primera voz en español del
  sistema; el paso espera a que termine la frase. Apagada por defecto; si el navegador no
  la soporta, el botón no aparece. Su calidad depende del sistema operativo.

### Estado del estudiante

- **S12. Una sola clave en `localStorage`** (`gitplayground_learner_v1`) — confianza alta.
  Guarda pestaña, tema, módulos, medallas y lecciones. Datos corruptos o de otra versión
  ⇒ se empieza de cero sin error. La clave vieja de lecciones se ignora (sin migración:
  nunca hubo datos de servidor).
- **S13. "Reiniciar progreso" conserva el tema** elegido — confianza media-alta.
- **S14. La medalla "Autodidacta Visual" exige las 6 lecciones** — confianza alta. Antes
  se daba con 3 y por error desbloqueaba la medalla del quiz.
- **S15. Los módulos reciben `completeModule('x')`** en vez del `setProgress` anterior
  — confianza alta; más simple que el adaptador que había planeado.

### Interfaz y accesibilidad

- **S16. Puntos de quiebre:** 1024 px (menú lateral → barra superior + menú
  desplegable), 900 px (rejillas a una columna), 600 px (se oculta el ícono decorativo
  del Dashboard) — confianza media-alta.
- **S17. El foco va al título del módulo solo cuando el estudiante cambia de pestaña**,
  no al cargar la página — confianza alta.
- **S18. Movimiento reducido global** — confianza alta. Con la preferencia del sistema
  activa se anulan animaciones y transiciones y se ocultan los brillos de fondo.
- **S19. `transition: all` reemplazado por propiedades explícitas** — confianza alta. Era
  la causa de que el menú móvil no pudiera recibir el foco al abrirse.
- **S20. Brillos decorativos recortados** (`overflow-x: clip`) — confianza alta; se salían
  hasta 1512 px en escritorio.
- **S21. El menú móvil se cierra solo al pasar a escritorio** (p. ej. al rotar una tablet),
  para no dejar el foco atrapado — confianza alta.
- **S22. Menú renombrado a "Lecciones animadas"**; el id interno `videolearning` se
  mantiene — confianza alta.

### Calidad y herramientas

- **S23. Lint saneado de 37 errores a 0** en el slice 01 — confianza media-alta. Implicó
  cambios de comportamiento menores: `git status` del simulador muestra la pista
  "use git restore --staged" una sola vez (como Git real); el tutor deriva si está
  abierto en vez de abrirse desde un efecto; la misión 2 se completa en la acción. Quedan
  4 avisos `exhaustive-deps` previos en módulos fuera de alcance.
- **S24. Dependencias nuevas de desarrollo:** `vitest` y `axe-core` (ninguna en
  producción). Las pruebas de interfaz siguen en Python con Playwright 1.57.0, que se
  ejecuta con `uv run --with playwright==1.57.0` porque no estaba instalado.
- **S25. Evidencia visual versionada** en `specs/.../assets` (12 MB de PNG) — confianza
  media. Sirve para la entrega de la cátedra; si pesa en el repo, se puede mover a un
  release o borrar al cerrar el semestre.

Discreción menor (nombres internos, textos de UI, iconos, curvas de animación): no listada.
