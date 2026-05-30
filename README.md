# GitPlayground 🚀
### Plataforma Educativa Interactiva de Git & GitHub (DPRED - UCV Computación)

Este es un proyecto educativo de innovación diseñado para la asignatura **Diseño y Prototipado de Recursos Educativos Digitales (DPRED)** de la **Escuela de Computación de la Universidad Central de Venezuela**.

GitPlayground resuelve el problema de la memorización de comandos de Git sin un entendimiento conceptual real. Ofrece una interfaz visual interactiva que representa en tiempo real los estados internos de Git (`.git`), grafos de ramas vivos y simulaciones colaborativas en la nube de GitHub.

---

## 🎨 Características Clave

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

5. **Tutor Git Invisible (IA Simulada)**
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

## 📂 Estructura del Código

* `index.html`: SEO tags, tipografías personalizadas (Outfit, Plus Jakarta Sans, Fira Code).
* `src/App.jsx`: Componente raíz y enrutador de pestañas del taller.
* `src/index.css`: Sistema de diseño responsivo y estilos de componentes.
* `src/components/`:
  * [Sidebar.jsx](file:///home/shonny-torres/Workspace/UCV/Semestre%20I-2026/DRIP/src/components/Sidebar.jsx): Menú de navegación lateral, control de progreso y tema oscuro.
  * [Dashboard.jsx](file:///home/shonny-torres/Workspace/UCV/Semestre%20I-2026/DRIP/src/components/Dashboard.jsx): Portal de bienvenida, mapa interactivo y estadísticas.
  * [VisualSimulator.jsx](file:///home/shonny-torres/Workspace/UCV/Semestre%20I-2026/DRIP/src/components/VisualSimulator.jsx): Simulador del área de trabajo, terminal y grafo SVG de commits.
  * [GitHubHub.jsx](file:///home/shonny-torres/Workspace/UCV/Semestre%20I-2026/DRIP/src/components/GitHubHub.jsx): Enlace local-remoto y flujo de Pull Requests.
  * [ConflictSolver.jsx](file:///home/shonny-torres/Workspace/UCV/Semestre%20I-2026/DRIP/src/components/ConflictSolver.jsx): Resolutor interactivo de conflictos en el editor.
  * [Quizzes.jsx](file:///home/shonny-torres/Workspace/UCV/Semestre%20I-2026/DRIP/src/components/Quizzes.jsx): Evaluaciones con retroalimentación instantánea.
  * [AITutor.jsx](file:///home/shonny-torres/Workspace/UCV/Semestre%20I-2026/DRIP/src/components/AITutor.jsx): Chatbot asistente en español.
* `docs/`: Carpeta con los documentos de la cátedra DPRED de la UCV.
