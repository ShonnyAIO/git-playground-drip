# Universidad Central de Venezuela
### Facultad de Ciencias — Escuela de Computación
### Tópicos Avanzados en Interacción Humano-Computador (6215)
### Semestre: I-2026

---

# LABORATORIO 8: Probar
## Evaluación de la Usabilidad: Inspección Heurística y Plan de Ajustes

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

## 1. Introducción y Metodología de Evaluación

En la etapa final de **Probar** dentro de la metodología **PDCC-IHC**, el prototipo vertical de alta fidelidad desarrollado en Figma es sometido a una rigurosa **Evaluación Heurística**, complementada con pruebas de usabilidad cuantitativas (**SEQ - Single Ease Question** y **SUS - System Usability Scale**).

El objetivo es diagnosticar fricciones residuales de interacción, verificar el cumplimiento de las heurísticas de diseño centrado en el usuario e implementar un **Plan de Ajustes y Mejoras** antes de la entrega definitiva del producto.

---

## 2. Las 10 Heurísticas de Jakob Nielsen Aplicadas a AlgoLearn

Cada principio de usabilidad fue contextualizado para evaluar tanto la interfaz Web como la aplicación Móvil de AlgoLearn:

| Heurística de Nielsen | Interpretación en AlgoLearn | Criterio de Inspección |
| :--- | :--- | :--- |
| **H1: Visibilidad del estado del sistema** | Retroalimentación en tiempo real (<100ms) durante la escritura, ejecución de código y estado de conexión (Online/Offline). | ¿El usuario sabe si su código está compilando, si el paquete offline está listo y cuántos XP ha acumulado? |
| **H2: Coincidencia entre sistema y mundo real** | Metáforas didácticas basadas en el pensum de Algoritmos de la UCV; lenguaje natural en español sin tecnicismos innecesarios. | ¿Los diagramas de flujo y explicaciones usan términos familiares para un estudiante novato? |
| **H3: Control y libertad del usuario** | Capacidad de reiniciar el código base, deshacer cambios, salir al árbol de lecciones o cancelar descargas sin penalización. | ¿El usuario puede revertir una acción errónea en un solo clic sin perder sus estadísticas? |
| **H4: Consistencia y estándares** | Coherencia en la guía de estilos (botones, tipografías, colores de error/éxito) entre la Web App y la Mobile App. | ¿Los atajos y botones cumplen con los estándares conocidos de editores de código (VS Code) y apps educativas (Duolingo)? |
| **H5: Prevención de errores** | Detección previa de errores comunes (case-sensitive, llaves abiertas) y confirmación antes de restablecer ejercicios. | ¿El sistema advierte sutilmente antes de que el usuario ejecute un código con sintaxis rota evidente? |
| **H6: Reconocimiento antes que recuerdo** | Franja de símbolos visibles sobre el teclado móvil y autocompletado de palabras clave en el editor web. | ¿El estudiante puede ver los símbolos `{ } ( ) ;` sin tener que recordar combinaciones complejas de teclado? |
| **H7: Flexibilidad y eficiencia de uso** | Atajos de teclado para usuarios avanzados en Web (`Ctrl+Enter`) y atajos táctiles rápidos en Mobile. | ¿La interfaz se adapta tanto a un programador principiante como a un estudiante con experiencia previa? |
| **H8: Estética y diseño minimalista** | Interfaz limpia, sin publicidad invasiva, pop-ups comerciales de suscripciones ni distracciones fuera del foco educativo. | ¿La pantalla prioriza el espacio de lectura del enunciado y el buffer de código sin elementos superfluos? |
| **H9: Ayuda a diagnosticar y recuperarse de errores** | Mensajes de error constructivos que señalan la línea exacta y sugieren el paso correctivo (cero stack traces crudos). | ¿El sistema explica en español por qué falló el algoritmo y ofrece una pista orientadora? |
| **H10: Ayuda y documentación** | Tooltips contextuales, micro-videos explicativos opcionales de 1 minuto y foros de discusión indexados por lección. | ¿Es fácil consultar cómo funciona un condicional o pedir ayuda a los preparadores UCV dentro del mismo ejercicio? |

---

## 3. Instrumento y Formulario de Evaluación Heurística

Para llevar a cabo la inspección con evaluadores pares de la materia y docentes, se diseñó el formulario estructurado de evaluación (adaptado del instrumento de la cátedra de TAIHC):

### 3.1. Ficha Técnica del Formulario
- **Título:** *Evaluación Heurística de Usabilidad — Proyecto AlgoLearn (Grupo #4)*
- **Enlace al Formulario:** Duplicado y compartido en la carpeta de la materia.
- **Enlace al Prototipo Figma:** Enlace interactivo en modo presentación adjunto en la cabecera.
- **Población Evaluadora:** 8 evaluadores (estudiantes de otros grupos de TAIHC y preparadores docentes).

### 3.2. Estructura de Reactivos (Escala Likert 1 a 5)
Para cada una de las 10 heurísticas se aplicó una escala:
- `1:` Muy en desacuerdo / Violación grave de usabilidad
- `2:` En desacuerdo / Fricción perceptible
- `3:` Neutral
- `4:` De acuerdo / Cumple adecuadamente
- `5:` Totalmente de acuerdo / Experiencia óptima

Adicionalmente, se incluyó al final de cada bloque un campo abierto obligatorio:  
*"Describa detalladamente el problema o sugerencia de mejora si calificó con 1, 2 o 3"*.

---

## 4. Métricas de Usabilidad y Registro de Resultados

A partir de la sesión de evaluación heurística y pruebas de tarea con 8 evaluadores pares, se consolidaron las siguientes métricas cuantitativas:

### 4.1. Métricas de Desempeño de Tarea

| Tarea Evaluada | Tasa de Éxito | Tiempo Medio (seg) | Errores Promedio | Puntuación SEQ (1-5) |
| :--- | :---: | :---: | :---: | :---: |
| **T1: Registro directo y acceso al árbol** | **100 %** | `18 s` | `0.1` | **4.9 / 5** |
| **T2: Resolver ejercicio en editor móvil** | **87.5 %** | `75 s` | `1.2` | **4.4 / 5** |
| **T3: Interpretar feedback predictivo y corregir**| **100 %** | `12 s` | `0.0` | **4.8 / 5** |
| **T4: Abrir foro de la lección y ver solución** | **100 %** | `15 s` | `0.2` | **4.7 / 5** |
| **T5: Activar modo offline de un módulo** | **87.5 %** | `22 s` | `0.5` | **4.3 / 5** |

### 4.2. Puntuación Global de Usabilidad (SUS)
- **Puntaje SUS Calculado:** **86.5 / 100** (Grado **A+** - Nivel *Excelente / Best Imaginable*), superando ampliamente el benchmark estándar de la industria (68 puntos) y resolviendo las quejas que afectaban a los competidores.

---

## 5. Matriz de Hallazgos y Severidad de Nielsen

Siguiendo la escala de severidad de Jakob Nielsen (0: No es problema, 1: Problema cosmético, 2: Problema menor, 3: Problema mayor, 4: Catástrofe de usabilidad):

| ID Hallazgo | Heurística Afectada | Descripción del Problema Detectado por Evaluadores | Severidad (0-4) |
| :---: | :---: | :--- | :---: |
| **H-01** | H6 / H7 | En la versión móvil, algunos estudiantes con dedos grandes tuvieron dificultad para presionar el símbolo de dos puntos `:` en la franja de operadores por ser un blanco táctil estrecho. | **2 (Menor)** |
| **H-02** | H1 / H9 | El tooltip de error predictivo desaparecía después de 5 segundos si el usuario no hacía clic, generando incertidumbre sobre qué corregir. | **3 (Mayor)** |
| **H-03** | H3 | Al hacer clic en "Comprobar Reto" de forma accidental antes de terminar, el botón quedaba brevemente en estado de carga sin opción de cancelar inmediatamente. | **1 (Cosmético)** |
| **H-04** | H10 | El acceso al foro de la lección era claro, pero no se distinguía a simple vista si había o no respuestas verificadas por profesores antes de abrir el drawer. | **2 (Menor)** |

---

## 6. Plan de Ajustes Iterativos para la Entrega Final

En respuesta directa al feedback obtenido, el equipo aplicó de inmediato las siguientes modificaciones en el prototipo interactivo de Figma:

```
+-------------------------------------------------------------------------------+
|                      PLAN DE AJUSTES Y MEJORAS EN FIGMA                       |
+-------------------------------------------------------------------------------+
| 1. PERSISTENCIA DEL TOOLTIP PREDICTIVO (Corrige H-02 / Severidad 3):           |
|    - Se eliminó el auto-dismiss por temporizador.                              |
|    - El tooltip permanece anclado a la línea de código hasta que el usuario   |
|      modifique el texto o pulse explícitamente el botón "Cerrar pista".       |
|                                                                               |
| 2. REDISEÑO DEL TOUCH TARGET EN FRANJA DE SÍMBOLOS (Corrige H-01 / Sev. 2):   |
|    - Se incrementó el área táctil mínima de cada botón de operador a 42 x 40px |
|      (cumpliendo la pauta ergonómica de Apple HIG y Material Design 3).       |
|    - Se incrementó la separación visual entre ':' e '='.                       |
|                                                                               |
| 3. BADGE INDICADOR EN BOTÓN DE FORO (Corrige H-04 / Severidad 2):             |
|    - Se incorporó una insignia circular verde con icono de 'check' al botón   |
|      "Discutir Lección" cuando exista al menos una respuesta verificada por   |
|      un preparador de la UCV, evitando aperturas innecesarias.                |
|                                                                               |
| 4. CANCELACIÓN INFLIGHT Y FEEDBACK INMEDIATO (Corrige H-03 / Severidad 1):    |
|    - Se añadió un botón "Cancelar" durante peticiones de red simuladas y      |
|      retroalimentación háptica/visual instantánea (<80ms).                    |
+-------------------------------------------------------------------------------+
```

---

## 7. Conclusiones de la Evaluación

1. **Efectividad del Enfoque Centrado en el Usuario (PDCC-IHC):**  
   La eliminación de barreras burocráticas en el onboarding y la integración del asistente predictivo de errores en lenguaje natural demostraron un impacto decisivo en la reducción de la frustración cognitiva estudiantil.
2. **Validación del Editor Ergonómico:**  
   La franja de símbolos adaptada al teclado del sistema operativo y la persistencia no intrusiva de las sugerencias sintácticas neutralizaron por completo el cuello de botella que presentaban las alternativas comerciales analizadas en el Laboratorio 2.
3. **Cierre Exitoso del Ciclo de Prototipaje:**  
   Con los ajustes aplicados a partir de los hallazgos heurísticos, el prototipo vertical de AlgoLearn queda formalmente validado, robusto y preparado para la entrega final de la cátedra de Tópicos Avanzados en IHC y su posterior fase de desarrollo de software.

---
*Documento elaborado para TAIHC 6215 - UCV Semestre I-2026 por el Grupo #4.*
