# GitPlayground 🚀
### Plataforma Educativa Interactiva de Git & GitHub (DPRED - UCV Computación)

Este es un proyecto educativo de innovación diseñado para la asignatura **Diseño y Prototipado de Recursos Educativos Digitales (DPRED)** de la **Escuela de Computación de la Universidad Central de Venezuela**.

GitPlayground resuelve el problema de la memorización de comandos de Git sin un entendimiento conceptual real. Ofrece una interfaz visual interactiva que representa en tiempo real los estados internos de Git (`.git`), grafos de ramas vivos y simulaciones colaborativas en la nube de GitHub.

---

Versión en línea: <https://git-playground-ucv.netlify.app/>

## 🎨 Características Clave

0. **Lecciones animadas (motion graphics propios)**
   * Seis micro-lecciones (estados, ramas y HEAD, merge, rebase, remotos, conflictos) que muestran cómo se mueve Git por dentro: los archivos viajan entre zonas, las ramas avanzan y la historia se reescribe a la vista.
   * Se controlan como un video —play, pausa, paso a paso, velocidad— con subtítulos, narración por voz opcional y teclado. Cada una enlaza a su práctica y a lecturas verificadas (Pro Git en español). Ver [docs/lecciones-animadas.md](docs/lecciones-animadas.md).

1. **Módulo 1: El Core (Estados de Git)**
   * **Simulador de Terminal:** Una consola interactiva en tiempo real para escribir comandos reales (`git init`, `git add`, `git commit`, `git checkout`, `git merge`, etc.).
   * **Visualizador de Estados Locales:** Diferenciación visual interactiva en tiempo real entre el **Working Directory** (rojo/modificado), el **Staging Area / Index** (amarillo/preparado) y el **Local Repository** (verde/commiteado).
   * **Grafo Vivo de Commits:** Renderizado SVG dinámico del historial de commits con HEAD, etiquetas de ramas y conexiones.

2. **Módulo 2: El Puente (GitHub & Remotos)**
   * Simulación del comando `git push` y `git pull`.
   * Interfaz interactiva de **Pull Requests** en un servidor GitHub ficticio.
   * Flujo de **Code Review** simulado con aprobación de revisores (Javier, Ricardo).

3. **Módulo 3: Supervivencia (Conflictos)**
   * **Merge vs Rebase:** Recursos teóricos y visuales para entender cuándo reescribir historia y cuándo conservar el historial.
   * **Diff Solver:** Un resolutor de conflictos interactivo donde seleccionas líneas del Cambio Actual (`HEAD`), Cambio Entrante (`feature-branch`) o conservar ambos para crear el merge commit de resolución.

4. **Módulo 4: Quizzes de Flujos de Trabajo**
   * Desafíos de opción múltiple sobre **Gitflow**, **Trunk-Based Development** y buenas prácticas con explicaciones pedagógicas integradas tras responder.

5. **Progreso y accesibilidad**
   * XP, medallas, lecciones y pestaña se guardan en el navegador y sobreviven a recargar; se pueden reiniciar.
   * Usable de teléfono (375 px) a escritorio, operable solo con teclado y con contraste WCAG 2.2 AA en tema claro y oscuro.

6. **Tutor Git Invisible (IA Simulada)**
   * Asistente conversacional flotante que guía al estudiante, ofrece pistas en español y explica conceptos como `rebase`, `merge`, `conflictos` y `HEAD` de forma interactiva y contextual.

---

## 🛠️ Tecnologías y Diseño

* **Núcleo:** React 19 + Vite.
* **Diseño:** CSS Puro (Vanilla CSS) con un sistema de diseño obsidian-dark y glassmorphism, HSL para estados de Git y diseño accesible (DUA).
* **Iconografía:** Lucide React.
* **SEO:** Tags optimizados y descripciones semánticas.

---

## 🚀 Cómo Iniciar el Proyecto

### Requisitos Previos
Asegúrate de tener instalado [Node.js](https://nodejs.org/).

### Instalación de Dependencias
```bash
npm install
```

### Ejecutar Servidor de Desarrollo
Para correr el proyecto en modo local interactivo:
```bash
npm run dev
```

### Compilar para Producción
Para compilar y empaquetar el producto mínimo viable (PMV):
```bash
npm run build
```

---

## 🧪 Pruebas

* `npm test` — pruebas unitarias (Vitest) del estado del estudiante y del motor de lecciones; incluye un oráculo que valida cada lección.
* `npm run lint` — ESLint.
* Pruebas de interfaz con Playwright contra el build (`npm run build && npm run preview`, puerto 4173):
  * `python tests/playwright_ux_suite.py` — recorrido de usuario (TUC-UX-01 a 12).
  * `python scripts/a11y.py` — axe-core en cada sección y tema, más navegación por teclado.
  * `python scripts/capture.py <carpeta>` — capturas de cada sección a 375, 768, 1024 y 1440 px.
  * Con `uv`: `uv run --with playwright==1.57.0 python <script>`.
* Checklist manual de aceptación: [tuc/TUC-lecciones-y-ux.md](tuc/TUC-lecciones-y-ux.md).

## 📂 Estructura del Código

* `src/components/` — un componente por módulo de la barra lateral, más el tutor.
* `src/state/` — el estado del estudiante (progreso, medallas, lecciones, pestaña, tema) y su persistencia; único dueño de `localStorage` para el progreso.
* `src/lessons/` — lecciones animadas: `engine/` (puro, con tests), `render/` (reproductor SVG) y `content/` (una lección por archivo).
* `src/index.css` — sistema de diseño: tokens de color (incluidos los de estados Git) y estilos compartidos. `--primary` es color de relleno; para texto naranja se usa `--primary-text`.
* `lab.html` — laboratorio solo de desarrollo (`npm run dev` → `/lab.html`) para revisar lecciones.
* `specs/` — planes de trabajo y sus decisiones; `docs/` — material de la cátedra DPRED y documentación técnica.
