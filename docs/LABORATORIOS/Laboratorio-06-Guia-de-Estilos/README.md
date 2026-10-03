# Universidad Central de Venezuela
### Facultad de Ciencias — Escuela de Computación
### Tópicos Avanzados en Interacción Humano-Computador (6215)
### Semestre: I-2026

---

# LABORATORIO 6: Prototipaje
## Guía de Estilos y Sistema de Diseño (Design System)

**Proyecto:** AlgoLearn — Gamificación del Pensamiento Computacional  
**Grupo #4:**
- Jonathan Torres
- Samuel Flores
- Ricardo Riera
- Diego Perdomo

**Docentes:**
- **Profesora:** Keyla Rivas
- **Preparadora:** Alejandra Giannattasio

---

## 1. Fundamentos y Filosofía de Diseño

La guía de estilos de **AlgoLearn** constituye la piedra angular visual y de interacción para unificar las experiencias de **Web App** y **Mobile App**. Está concebida bajo tres atributos fundamentales de usabilidad:
1. **Usable:** Estandariza componentes con estados claros de interacción, feedback reactivo (<100ms) y affordances evidentes tanto para entornos táctiles móviles como de puntero en escritorio.
2. **Educativa:** Reduce la carga cognitiva en el aprendizaje de algoritmos, empleando colores semánticos con un propósito pedagógico (verde para lógica aprobada, ámbar/rojo con ayuda predictiva para sintaxis, azul para concentración en el código).
3. **Accesible (WCAG 2.1 Nivel AA / AAA):** Cada combinación de texto y fondo cumple rigurosamente con los ratios de contraste de luminancia mínima (4.5:1 para texto normal, 3:1 para texto grande y elementos de interfaz).

---

## 2. Identidad Corporativa y Logotipo

El identificador de **AlgoLearn** sintetiza dos conceptos esenciales: los operadores y estructuras de programación (`{ }`, `</>`, `=>`) junto con el crecimiento intelectual y la gamificación amigable (nodo de aprendizaje en progresión).

```
   ISOTIPO:                   ISOLOGOTIPO HORIZONTAL:
    .-------.                 .-------.
   /  { / }  \               /  { / }  \   AlgoLearn
  |   o - o   |             |   o - o   |  Gamificación del Pensamiento Computacional
   \    ~    /               \    ~    /   Escuela de Computación - UCV
    '-------'                 '-------'
```

### Variantes Reglamentarias del Logotipo:

| Variante | Fondo Recomendado | Especificación y Comportamiento |
| :--- | :--- | :--- |
| **1. Horizontal (Principal)** | Claro (`#FFFFFF` / `#F8FAFC`) | Isotipo a la izquierda con tipografía *Plus Jakarta Sans Bold* a la derecha. Utilizado en el Header de la Web App y cabeceras de reportes. |
| **2. Vertical (Secundario)** | Neutro / Centrado | Isotipo centrado en la parte superior con el nombre de la marca debajo. Utilizado en Splash Screens móviles, carátulas y modales de bienvenida. |
| **3. Positivo (Light Mode)** | Fondos claros (`#FFFFFF` a `#E2E8F0`) | Isotipo en *Algo Blue* (`#2563EB`) y *Emerald Logic* (`#10B981`) con tipografía en *Slate 900* (`#0F172A`). |
| **4. Negativo (Dark Mode / Terminal)** | Fondos oscuros (`#0F172A` a `#1E293B`) | Isotipo en *Sky Blue* (`#38BDF8`) y *Neon Emerald* (`#34D399`) con texto en blanco puro (`#FFFFFF`). Especialmente diseñado para el entorno del Editor de Código nocturno. |

> **Zona de Seguridad y Reducción Mínima:**
> - Margen de protección perimetral equivalente a la altura de la letra **"A"** del logotipo ($X$).
> - Tamaño mínimo de reproducción: **120px ancho x 32px alto** en Web; **96px ancho x 28px alto** en Mobile.

---

## 3. Paleta de Colores y Verificación de Contraste (WCAG 2.1)

AlgoLearn implementa un sistema semántico de tokens de diseño donde cada tono cumple una función interactiva concreta.

### 3.1. Colores Primarios y de Identidad

| Nombre del Token | Muestra | Valor HEX | Valor RGB | Uso Principal |
| :--- | :---: | :--- | :--- | :--- |
| **Primary Brand (Algo Blue)** | ![#2563EB](https://via.placeholder.com/15/2563EB/000000?text=+) | `#2563EB` | `rgb(37, 99, 235)` | Botones de acción primaria, enlaces activos, nodos en curso. |
| **Primary Dark (UCV Navy)** | ![#0F172A](https://via.placeholder.com/15/0F172A/000000?text=+) | `#0F172A` | `rgb(15, 23, 42)` | Fondo del editor de código, headers de escritorio, texto de máxima jerarquía. |
| **Surface Light (Pure Canvas)** | ![#FFFFFF](https://via.placeholder.com/15/FFFFFF/000000?text=+) | `#FFFFFF` | `rgb(255, 255, 255)` | Fondo de tarjetas, modales y áreas de contenido en Modo Claro. |
| **Surface Subtle (Soft Canvas)** | ![#F8FAFC](https://via.placeholder.com/15/F8FAFC/000000?text=+) | `#F8FAFC` | `rgb(248, 250, 252)` | Fondo global de la aplicación web y móvil en Modo Claro. |

### 3.2. Colores Secundarios y Gamificación

| Nombre del Token | Muestra | Valor HEX | Valor RGB | Uso Principal |
| :--- | :---: | :--- | :--- | :--- |
| **Gamification Streak (Fire Amber)** | ![#F59E0B](https://via.placeholder.com/15/F59E0B/000000?text=+) | `#F59E0B` | `rgb(245, 158, 11)` | Contador de racha diaria de estudio, insignias de perseverancia. |
| **Gamification XP (Star Gold)** | ![#EAB308](https://via.placeholder.com/15/EAB308/000000?text=+) | `#EAB308` | `rgb(234, 179, 8)` | Puntos de experiencia ganados, lecciones completadas con 3 estrellas. |
| **Social Violet (Community Purple)** | ![#8B5CF6](https://via.placeholder.com/15/8B5CF6/000000?text=+) | `#8B5CF6` | `rgb(139, 92, 246)` | Hilos de discusión, foros de la lección, botón "Discutir". |

### 3.3. Colores Semánticos de Retroalimentación y Feedback

| Estado del Sistema | Valor HEX | Fondo Contenedor | Ratio Contraste | Cumplimiento WCAG | Significado en AlgoLearn |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Éxito (Success Green)** | `#16A34A` | `#DCFCE7` (Light) | **4.8 : 1** | **AA / AAA** | Algoritmo correcto, pruebas unitarias superadas, XP sumada. |
| **Error Sintáctico (Alert Red)** | `#DC2626` | `#FEE2E2` (Light) | **5.2 : 1** | **AA / AAA** | Error en línea de código, fallo en caso de prueba. |
| **Pista Predictiva (Guidance Amber)**| `#D97706` | `#FEF3C7` (Light) | **4.9 : 1** | **AA / AAA** | Sugerencia contextual en tooltip para orientar sin frustrar. |
| **Informativo (Info Cyan)** | `#0284C7` | `#E0F2FE` (Light) | **5.0 : 1** | **AA / AAA** | Notificaciones de descarga offline, estado de sincronización. |

---

## 4. Tipografía y Escala Tipográfica

AlgoLearn utiliza dos familias tipográficas de código abierto y alta legibilidad:
1. **Familia UI / Lectura:** `Plus Jakarta Sans` (alternativa: `Inter`). Proporciona proporciones geométricas optimizadas para lectura rápida en pantallas móviles pequeñas.
2. **Familia Monospace / Código:** `JetBrains Mono` (alternativa: `Fira Code`). Esencial en el editor para evitar la ambigüedad entre `1`, `l`, `I` o `0`, `O`, soportando ligaduras de programación (`!=`, `<=`, `=>`).

### Escala Tipográfica Estandarizada:

| Nivel Jerárquico | Familia Tipográfica | Tamaño (Desktop / Mobile) | Interlineado (Line-Height) | Peso (Font-Weight) | Uso |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **H1 (Título Principal)** | Plus Jakarta Sans | `32px` / `26px` | `1.2` (38px / 31px) | Bold (700) | Títulos de módulos, bienvenida. |
| **H2 (Subtítulo de Sección)** | Plus Jakarta Sans | `24px` / `20px` | `1.3` (31px / 26px) | SemiBold (600) | Títulos de lecciones, cabeceras de foros. |
| **H3 (Encabezado de Tarjeta)** | Plus Jakarta Sans | `18px` / `16px` | `1.4` (25px / 22px) | SemiBold (600) | Nombres de ejercicios, widgets de progreso. |
| **Body (Párrafo Estándar)** | Plus Jakarta Sans | `16px` / `14px` | `1.5` (24px / 21px) | Regular (400) | Enunciados de retos, respuestas del foro. |
| **Caption / Labels** | Plus Jakarta Sans | `13px` / `12px` | `1.4` (18px / 16px) | Medium (500) | Métricas, tiempo estimado, insignias. |
| **Code Primary (Editor)** | JetBrains Mono | `15px` / `13px` | `1.6` (24px / 21px) | Medium (500) | Buffer editable de código fuente. |
| **Code Snippet (Inline)** | JetBrains Mono | `14px` / `12px` | `1.4` (19px / 17px) | Regular (400) | Palabras reservadas en explicaciones teóricas. |

---

## 5. Estilos de Interacción y Componentes UI

En consonancia con la directriz técnica de **inmediatez visual (<100ms)** y prevención de errores:

### 5.1. Botones de Acción (Button States)

| Tipo de Botón | Estado Default | Estado Hover / Press | Estado Disabled | Estado In-Flight (Loading) |
| :--- | :--- | :--- | :--- | :--- |
| **Primario ("Comprobar")** | Fondo `#2563EB`, texto blanco, sombra sutil. | Fondo `#1D4ED8`, elevación -1px. | Fondo `#CBD5E1`, texto `#94A3B8`, cursor `not-allowed`. | Spinner rotatorio sutil, texto oculto o "Evaluando..." (<100ms). |
| **Secundario / Gamificado** | Fondo `#10B981`, texto blanco. | Fondo `#059669`. | Fondo `#E2E8F0`, texto `#94A3B8`. | Botón deshabilitado temporalmente para evitar doble clic. |
| **Ghost ("Discutir Lección")**| Fondo transparente, borde `#8B5CF6`, texto `#8B5CF6`. | Fondo `#F5F3FF`, texto `#7C3AED`. | Opacidad 40%. | Spinner violeta de carga. |

### 5.2. Entradas de Formulario e Inputs

- **Default:** Borde `#CBD5E1` (1.5px), radio de borde `8px`, relleno vertical `12px`, padding horizontal `16px`.
- **Foco (Focus-Visible):** Anillo exterior de foco `#93C5FD` (3px) y borde `#2563EB`. Accesible para navegación por teclado.
- **Error Sintáctico / Validación:** Borde `#EF4444`, icono de advertencia a la derecha y texto de ayuda en lenguaje humano (nunca código de error HTTP crudo).

### 5.3. Franja Ergonómica de Símbolos Rápidos (Mobile)

Para resolver la fricción identificada en los competidores (donde alternar teclados para hallar `{ } ;` tardaba hasta 8 segundos por línea), se define un componente fijo posicionado sobre el teclado táctil:
- **Contenedor:** Fondo `#E2E8F0`, altura `38px`, desplazamiento horizontal suave (*horizontal scroll*).
- **Teclas de Símbolos:** Fondo `#FFFFFF`, esquinas redondeadas `6px`, borde `#CBD5E1`, texto monospace `14px`, tamaño táctil mínimo de `32x32px`.
- **Set de Caracteres Disponibles:** `{`, `}`, `(`, `)`, `:`, `=`, `>`, `<`, `;`, `print`, `if`, `else`.

### 5.4. Cards de Microlearning y Nodos del Árbol

- **Nodo Bloqueado:** Escala de grises (`#94A3B8`), icono de candado cerrado, no interactivo.
- **Nodo En Curso:** Borde brillante animado en `#2563EB` con pulsación sutil (2s de duración), icono de play.
- **Nodo Completado:** Fondo `#DCFCE7`, borde `#16A34A`, estrella dorada central, accesible para repaso ilimitado.

### 5.5. Sistema de Iconografía

- **Biblioteca Base:** Lucide Icons / Feather Icons.
- **Estilo:** Trazo lineal uniforme (*stroke*) de `2px`, esquinas redondeadas, retícula base de `24 x 24 px` (con padding de `2px`).
- **Iconos Principales:** `Code2` (editor), `Flame` (racha), `Sparkles` (XP), `HelpCircle` (pista), `MessageSquare` (foros), `DownloadCloud` (modo offline), `CheckCircle2` (éxito).

---

## 6. Archivo Vectorial de Variantes del Logotipo

Se genera el archivo gráfico oficial **[`logo_variantes_algolearn.svg`](logo_variantes_algolearn.svg)** que contiene:
1. Variante Horizontal en Fondo Positivo.
2. Variante Vertical en Fondo Positivo.
3. Variante Negativa para Dark Mode / Terminal de Código.
4. Muestrario de paleta de colores y escala tipográfica.

---
*Documento elaborado para TAIHC 6215 - UCV Semestre I-2026 por el Grupo #4.*
