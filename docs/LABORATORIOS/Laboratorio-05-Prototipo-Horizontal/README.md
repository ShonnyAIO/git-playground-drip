# Universidad Central de Venezuela
### Facultad de Ciencias — Escuela de Computación
### Tópicos Avanzados en Interacción Humano-Computador (6215)
### Semestre: I-2026

---

# LABORATORIO 5: Prototipaje
## Prototipo Horizontal — Modelo de Baja Fidelidad (Wireframes Balsamiq)

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

## 1. Justificación y Alcance del Prototipo Horizontal

En la metodología **PDCC-IHC**, el **Prototipo Horizontal de Baja Fidelidad** busca validar de manera temprana y ágil la amplitud arquitectónica de la aplicación sin incurrir en costes de diseño visual detallado ni en la codificación de la lógica interna profunda.

### Objetivos del Prototipo Horizontal en AlgoLearn:
1. **Validación de la Amplitud Funcional:** Representar todas las áreas neurálgicas del sistema identificadas en el Mapa de Contenido (Onboarding, Árbol de Conocimiento, Workspace de Código, Asistente Predictivo, Foros de Lección y Consola Docente).
2. **Eliminación de Puntos de Dolor Críticos:** Verificar en los wireframes la erradicación de los fallos hallados en los competidores evaluados en la Entrega 2:
   - **Cero bloqueos burocráticos:** El usuario puede explorar el catálogo de lecciones sin verse obligado a llenar cuestionarios universitarios engorrosos ni registrar Facultad $\rightarrow$ Escuela antes de ver contenido.
   - **Ergonomía de codificación móvil:** Disposición explícita de una franja superior de símbolos de programación (`{ } ( ) ; = < >`) desacoplada que respeta el teclado estándar del sistema operativo.
   - **Feedback predictivo no bloqueante:** El asistente de error se despliega como un tooltip o bottom sheet sutil en <100ms, eliminando la reproducción de videos forzados de 12 minutos.
3. **Consistencia Dual (Web & Mobile):** Presentar layouts armonizados que comparten el mismo modelo mental tanto en pantallas de smartphone (390px) como en navegadores de escritorio (1280px).

---

## 2. Inventario de Pantallas y Wireframes Diseñados

| Código Wireframe | Nombre de la Pantalla / Módulo | Plataforma Principal | Función e Interacción Clave |
| :--- | :--- | :--- | :--- |
| **W-01** | Bienvenida y Onboarding Directo | Mobile & Web | Acceso ágil con Google o correo; selección directa de curso sin fricciones. |
| **W-02** | Dashboard y Árbol de Habilidades (*Skill Tree*) | Mobile & Web | Navegación gamificada con estados de nodo (Bloqueado, En Curso, Completado), racha y descargas. |
| **W-03** | Lección Teórica y Sintaxis Visual | Mobile & Web | Microlearning con diagramas de flujo interactivos y conceptos explicados en español nativo. |
| **W-04** | Workspace de Ejercicio y Editor de Código | Mobile | Editor case-sensitive con franja de caracteres especiales sobre teclado táctil nativo. |
| **W-05** | Workspace de Práctica Split-Screen | Web | Vista dividida con enunciado a la izquierda, editor con atajos al centro y consola a la derecha. |
| **W-06** | Asistente de Feedback Predictivo | Mobile & Web | Tooltip reactivo que resalta la línea exacta con pista didáctica sin dar la solución cruda. |
| **W-07** | Modal de Recompensa y Logro (+XP) | Mobile & Web | Refuerzo positivo inmediato con estadísticas de precisión y avance a la siguiente lección. |
| **W-08** | Bottom Sheet / Drawer de Foro Contextual | Mobile & Web | Hilos de discusión específicos del ejercicio con soluciones validadas por preparadores UCV. |
| **W-09** | Consola de Analíticas Académicas | Web | Panel docente con tasas de error por lección y tiempos medios de resolución. |

---

## 3. Especificación Visual y Estructural de los Wireframes (Baja Fidelidad)

### W-01: Bienvenida y Onboarding Directo (Mobile Layout: 390 x 844 px)
```
+------------------------------------------+
|  [Logo AlgoLearn]                        |
|  Gamificación del Pensamiento Comp.      |
|                                          |
|  "Aprende algoritmos paso a paso,        |
|   sin barreras y a tu propio ritmo."     |
|                                          |
|  +------------------------------------+  |
|  | [G] Continuar con Google           |  |
|  +------------------------------------+  |
|                                          |
|  ---------- o con tu correo ----------   |
|                                          |
|  [ Correo electrónico               ]   |
|  [ Contraseña                       ]   |
|                                          |
|  +------------------------------------+  |
|  |        [ Iniciar Sesión ]          |  |
|  +------------------------------------+  |
|                                          |
|  ¿Nuevo en la UCV? [Crear cuenta]       |
|  [Explorar cursos como invitado]         |
+------------------------------------------+
```
*Decisión UX:* Se ofrece un acceso como invitado para visualizar lecciones preliminares antes de exigir registro, neutralizando el abandono temprano.

---

### W-02: Dashboard y Árbol de Habilidades (Mobile Layout)
```
+------------------------------------------+
|  (Avatar) Eduardo    [🔥 5 días] [⭐ 350 XP]|
|  Modo: [● Online]    [📥 Descargas]      |
+------------------------------------------+
|  Ruta activa: Pensamiento Computacional  |
|  Módulo 1: Introducción y Variables      |
|                                          |
|                 ( ⭐ )                   |
|              Lección 1: ¿Qué es          |
|              un Algoritmo? (100%)        |
|                   |                      |
|                 ( ⭐ )                   |
|              Lección 2: Variables        |
|              y Tipos de Datos (100%)     |
|                   |                      |
|               (( ▶ ))  <- ¡En curso!     |
|              Lección 3: Condicionales    |
|              y Flujo Lógico              |
|                   |                      |
|                 [ 🔒 ]                   |
|              Lección 4: Bucles For/While |
|                                          |
+------------------------------------------+
|  [ 🏠 Aprender ] [ 💬 Foros ] [ 👤 Perfil] |
+------------------------------------------+
```
*Decisión UX:* Gamificación limpia, clara y sin banners invasivos de planes "Premium" (punto crítico reportado en SoloLearn).

---

### W-04: Workspace de Ejercicio Práctico Móvil con Teclado Adaptativo
```
+------------------------------------------+
|  <- Lección 3.2: Condicional If          |
|  Progreso: [==========        ] 60%      |
+------------------------------------------+
|  RETO: Declara una variable 'edad' con   |
|  valor 18 e imprime "Mayor" si edad >= 18|
+------------------------------------------+
|  1 | edad = 18                           |
|  2 | if edad >= 18:                      |
|  3 |     Print("Mayor")                  |
|  4 |                                     |
+------------------------------------------+
|  [Franja Símbolos]:                      |
|  [ { ] [ } ] [ ( ] [ ) ] [ : ] [ = ] [ > ]|
+------------------------------------------+
|  [💬 Discutir]   [⚡ COMPROBAR SOLUCIÓN]  |
+------------------------------------------+
|  [  Teclado Nativo del Teléfono (QWERTY) ]|
|  [  respetando distribución del SO       ]|
+------------------------------------------+
```
*Decisión UX:* La franja superior de símbolos previene que el estudiante deba alternar entre páginas de símbolos en el teclado del sistema, aumentando la eficiencia temporal de codificación en más del 40%.

---

### W-06: Asistente de Feedback Predictivo en Tiempo Real
```
+------------------------------------------+
|  1 | edad = 18                           |
|  2 | if edad >= 18:                      |
|  3 |     Print("Mayor")  <<<< [Error]    |
|    +----------------------------------+  |
|    | ⚠️ Pista de Sintaxis:             |  |
|    | En la línea 3 escribiste 'Print' |  |
|    | con 'P' mayúscula. Recuerda que  |  |
|    | Python y C son sensibles a       |  |
|    | mayúsculas. Debe ser 'print'.    |  |
|    | [ Corregir automáticamente ]     |  |
|    +----------------------------------+  |
|  4 |                                     |
+------------------------------------------+
|  [💬 Ver en Foro (3 dudas similares)]    |
|  [ Intentar de nuevo ]                   |
+------------------------------------------+
```
*Decisión UX:* Resuelve la falla crítica de Fragata/SoloLearn: feedback en menos de 100ms, directo, educativo y con un botón de un solo toque para aplicar la sugerencia si el estudiante lo desea.

---

### W-08: Bottom Sheet del Foro Contextual de la Lección
```
+------------------------------------------+
|  === Dudas de: Lección 3.2 (Condicional) ==|
|  [ X Cerrar ]                            |
+------------------------------------------+
|  [Q] ¿Por qué son necesarios los dos     |
|      puntos ':' al final del 'if'?       |
|  Por: Carlos M. hace 2h                  |
|                                          |
|  [A] (Verificada por Prep. UCV)          |
|      "Los dos puntos indican el inicio   |
|       del bloque de código indentado..." |
|      ▲ 14 votos útiles                   |
|  --------------------------------------- |
|  [ + Hacer una pregunta sobre esta línea ]|
|  [ Escribe tu duda o comparte código... ]|
+------------------------------------------+
```

---

## 4. Archivo de Wireframes en Balsamiq / SVG

Para facilitar la visualización directa e integración en herramientas de prototipado rápido, se incluye el archivo vectorial y estructurado **[`prototipo_horizontal_wireframes.svg`](prototipo_horizontal_wireframes.svg)**, el cual diagrama a escala:
1. Vista Mobile: Splash y Bienvenida.
2. Vista Mobile: Skill Tree y Dashboard Gamificado.
3. Vista Mobile: Editor de Código con Teclado Ergonómico.
4. Vista Mobile: Asistente Predictivo de Errores Sintácticos.
5. Vista Web Desktop: Workspace Split-Screen integrado.

---
*Documento elaborado para TAIHC 6215 - UCV Semestre I-2026 por el Grupo #4.*
