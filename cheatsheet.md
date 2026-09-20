# ⚡ Cheatsheet: Auditoría de Calidad de Software con CodeGraph
> **Rol:** Senior Full-Stack Architect & Security Auditor  
> **Objetivo:** Enforzar buenas prácticas, usabilidad y seguridad mediante consultas precisas sobre el Grafo de Código.

Este documento contiene las consultas y prompts exactos que puedes hacerme para auditar tu código utilizando el índice de **CodeGraph**.

---

## ⚙️ 1. Calidad y Buenas Prácticas de Backend (Clean Code)
Busca mantener el principio de responsabilidad única, bajo acoplamiento y alta cohesión.

### Consultas de Estructura y Acoplamiento
*   **Detector de Componentes "Pulpo" (God Objects):**
    *   *Propósito:* Identificar clases o módulos que tienen demasiadas dependencias salientes o entrantes.
    *   *Prompt:* `"Usa CodeGraph para listar los 5 archivos con mayor número de dependencias entrantes (imports) y salientes. Analicemos si alguno actúa como 'God Object' y debe dividirse."`
*   **Trazabilidad de Lógica Duplicada:**
    *   *Propósito:* Encontrar implementaciones repetidas de una misma funcionalidad o cálculo.
    *   *Prompt:* `"Busca en CodeGraph todas las funciones que contengan términos como 'format', 'validate' o 'calculate' en sus nombres y mapea en qué archivos están definidas para ver si hay duplicación."`
*   **Complejidad del Grafo de Llamadas:**
    *   *Propósito:* Encontrar llamadas anidadas muy profundas que dificultan la depuración.
    *   *Prompt:* `"Usa el grafo de CodeGraph para analizar el árbol de llamadas (callees) de la función de inicio de sesión o checkout. ¿Supera los 4 niveles de profundidad secuencial?"`

---

## 🎨 2. Usabilidad y Estado en Frontend (UX & React)
Busca asegurar una navegación fluida, manejo correcto de estados de carga/error y un árbol de componentes ergonómico.

### Consultas de Usabilidad y React
*   **Auditoría de Componentes Huérfanos:**
    *   *Propósito:* Detectar vistas u hojas de estilo que el usuario ya no puede alcanzar desde la raíz (`App.jsx` / `main.jsx`).
    *   *Prompt:* `"Revisa con CodeGraph si existen componentes React en la carpeta 'src/components' que no estén conectados (directa o indirectamente) con el componente raíz 'App.jsx'."`
*   **Fugas de Estado y Prop Drilling Caótico:**
    *   *Propósito:* Encontrar componentes que reciben props pero no las usan, actuando solo como intermediarios (drillers).
    *   *Prompt:* `"Analiza las firmas de los componentes en el grafo que reciben la prop 'setProgress'. ¿Todos la consumen directamente o hay alguno que solo la propaga hacia abajo?"`
*   **Consistencia de Estados de Carga/Error (Feedback UX):**
    *   *Propósito:* Validar si las llamadas a servicios asíncronos tienen estados visuales para cargar y errores.
    *   *Prompt:* `"Busca en el grafo las llamadas a APIs o peticiones de red dentro de tus componentes. ¿Tienen asociados estados 'loading' o bloques 'catch' que actualicen la interfaz para el usuario?"`

---

## 🔒 3. Seguridad de Datos y Base de Datos (OWASP & DB)
Busca prevenir fugas de información, inyecciones de código y consultas bloqueantes de base de datos.

### Consultas de Seguridad
*   **Prevención de SQL/NoSQL Injection (Input Sanitization):**
    *   *Propósito:* Asegurar que cualquier entrada de usuario en controladores se valide antes de pasarse al ORM o Query Builder.
    *   *Prompt:* `"Usa CodeGraph para trazar el flujo desde los controladores de entrada de datos (inputs) hasta las llamadas de base de datos. ¿Los parámetros se sanitizan o validan con algún esquema (ej. Zod, Joi) antes de ser procesados?"`
*   **Filtros de Datos Sensibles (Fugas de Información):**
    *   *Propósito:* Evitar retornar contraseñas, tokens o información personal (PII) en respuestas JSON.
    *   *Prompt:* `"Busca las definiciones de funciones que retornan datos de usuario a la API. Verifica en el grafo si en el punto de retorno se filtran o desestructuran propiedades sensibles como 'password', 'token' o 'salt'."`
*   **Auditoría de Consultas en Bucles (Rendimiento Crítico):**
    *   *Propósito:* Identificar operaciones CRUD ineficientes que ralentizan la aplicación en producción.
    *   *Prompt:* `"Consulta el grafo para detectar llamadas a funciones de base de datos que ocurran dentro de estructuras de bucle ('map', 'forEach', 'for'). Sugiere cómo optimizarlas mediante consultas por lote (batching)."`

---

## 🛠️ 4. Plantilla de Comando Rápido (Cheat Sheet)

Para realizar una auditoría rápida de un archivo o flujo completo, puedes enviarme esta instrucción:

> "Usa las herramientas de CodeGraph para analizar el archivo `[Ruta del Archivo]` y evalúa:
> 1. Acoplamiento (¿Tiene demasiadas dependencias?)
> 2. Seguridad (¿Procesa entradas directas del usuario?)
> 3. Buenas prácticas de React (¿Maneja correctamente estados locales y ciclos de vida?)"
