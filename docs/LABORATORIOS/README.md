# Portafolio de Laboratorios — Metodología PDCC-IHC
## Tópicos Avanzados en Interacción Humano-Computador (6215)
### Universidad Central de Venezuela — Facultad de Ciencias — Escuela de Computación
### Semestre: I-2026

---

## 🚀 Proyecto: AlgoLearn — Gamificación del Pensamiento Computacional
**Equipo: Grupo #4**
- **Jonathan Torres**
- **Samuel Flores**
- **Ricardo Riera**
- **Diego Perdomo**

**Equipo Docente:**
- **Profesora:** Keyla Rivas
- **Preparadora:** Alejandra Giannattasio

---

## 📋 Índice General de Laboratorios y Entregables

A continuación se presenta el mapa de ruta y la estructura completa de los entregables desarrollados bajo el marco del método ágil de diseño **PDCC-IHC** (*Proceso de Diseño Centrado en el Usuario - IHC*):

```
TAIHC/
├── LABORATORIOS/
│   ├── Laboratorio-03-Casos-de-Uso-y-MOD/
│   │   ├── README.md                 # Informe formal: DCU (especificaciones completas) y MOD
│   │   └── diagramas_lab3.drawio     # Diagramas editables (Draw.io / Diagrams.net)
│   ├── Laboratorio-04-Mapa-de-Contenido/
│   │   ├── README.md                 # Informe formal: Taxonomía y Arquitectura de Información
│   │   └── mapa_contenido_lab4.drawio # Diagrama del Mapa de Contenido con notación oficial IHC
│   ├── Laboratorio-05-Prototipo-Horizontal/
│   │   ├── README.md                 # Informe formal: Prototipo de Baja Fidelidad y Wireframes
│   │   └── prototipo_horizontal_wireframes.svg # Wireframes vectoriales (Mobile y Web Desktop)
│   ├── Laboratorio-06-Guia-de-Estilos/
│   │   ├── README.md                 # Design System: Colores, Tipografías, Contraste WCAG 2.1
│   │   └── logo_variantes_algolearn.svg # Manual gráfico: 4 variantes del logotipo oficial
│   ├── Laboratorio-07-Prototipo-Vertical-Figma-vs-Uizard/
│   │   └── README.md                 # Prototipo Vertical de Alta Fidelidad y Comparativa Figma vs Uizard
│   └── Laboratorio-08-Evaluacion-Usabilidad/
│       └── README.md                 # Evaluación Heurística (10 reglas de Nielsen), SUS, SEQ y Mejoras
```

---

## 📌 Resumen por Etapa de la Metodología PDCC-IHC

### 1. Etapa de Empatizar y Definir (Laboratorios 1 y 2)
- **Entregables:** `Actividad #1`, `Propuesta de Proyecto AlgoLearn` y `Equipo_4_Entrega_2.docx`.
- **Logros:** Encuesta con estudiantes novatos de la UCV, análisis comparativo de la competencia (SoloLearn y Fragata), definición de User Personas (Eduardo y Sebastián), formulación de la **Propuesta de Valor de Usabilidad**, redacción de Requerimientos Funcionales (RF-01 a RF-08) e Historias de Usuario con Criterios de Aceptación.

### 2. Etapa de Idear y Analizar (Laboratorios 3 y 4)
- [📁 **Laboratorio 3: Casos de Uso y Modelo de Objetos del Dominio**](Laboratorio-03-Casos-de-Uso-y-MOD/README.md)
  - Diagrama de Casos de Uso (DCU) con 5 paquetes funcionales: Onboarding, Núcleo de Aprendizaje, Persistencia Offline, Comunidad y Gestión Docente.
  - Especificaciones formales paso a paso (Actor-Sistema), flujos alternos y de excepción.
  - Modelo de Objetos del Dominio (MOD) con relaciones de Composición ($\blacklozenge$), Agregación ($\lozenge$), Generalización/Herencia y Asociación Ternaria.
  - Archivo fuente editable: [`diagramas_lab3.drawio`](Laboratorio-03-Casos-de-Uso-y-MOD/diagramas_lab3.drawio).
- [📁 **Laboratorio 4: Arquitectura de la Información — Mapa de Contenido**](Laboratorio-04-Mapa-de-Contenido/README.md)
  - Mapeo taxonómico multinivel que abarca el ecosistema Web App y Mobile App.
  - Aplicación estricta de la notación de la cátedra de IHC (Interfaces con atributos, Formularios de entrada, Acciones del sistema, Nodos de decisión y Respuestas inmediatas).
  - Archivo fuente editable: [`mapa_contenido_lab4.drawio`](Laboratorio-04-Mapa-de-Contenido/mapa_contenido_lab4.drawio).

### 3. Etapa de Diseñar y Prototipar (Laboratorios 5, 6 y 7)
- [📁 **Laboratorio 5: Prototipo Horizontal — Baja Fidelidad (Balsamiq)**](Laboratorio-05-Prototipo-Horizontal/README.md)
  - Cobertura transversal de la plataforma a través de wireframes: Onboarding, Árbol de Conocimiento, Workspace de Código con teclado adaptativo y atajos, Asistente Predictivo y Foros de Lección.
  - Archivo visual vectorial: [`prototipo_horizontal_wireframes.svg`](Laboratorio-05-Prototipo-Horizontal/prototipo_horizontal_wireframes.svg).
- [📁 **Laboratorio 6: Guía de Estilos y Design System**](Laboratorio-06-Guia-de-Estilos/README.md)
  - Identidad gráfica oficial con 4 variantes de logotipo (Horizontal, Vertical, Positivo y Negativo para Dark Mode / Terminal).
  - Verificación estricta de accesibilidad y contraste según la norma **WCAG 2.1 Nivel AA / AAA**.
  - Paleta cromática semántica en valores HEX/RGB, escala tipográfica (*Plus Jakarta Sans* y *JetBrains Mono*) y especificación de estados de componentes interactivos (<100ms).
  - Archivo vectorial: [`logo_variantes_algolearn.svg`](Laboratorio-06-Guia-de-Estilos/logo_variantes_algolearn.svg).
- [📁 **Laboratorio 7: Prototipo Vertical de Alta Fidelidad & Comparativa Figma vs Uizard**](Laboratorio-07-Prototipo-Vertical-Figma-vs-Uizard/README.md)
  - Definición y prototipado end-to-end de la funcionalidad vertical clave: *Resolución de ejercicio interactivo con asistencia predictiva de sintaxis, ejecución de código y discusión contextual comunitaria*.
  - Prompt estructurado para **Uizard Autodesigner** y análisis de resultados de IA.
  - Matriz comparativa multidimensional de 8 factores entre Figma y Uizard, justificando a Figma como fuente de verdad oficial del producto.

### 4. Etapa de Probar y Ajustar (Laboratorio 8)
- [📁 **Laboratorio 8: Evaluación de la Usabilidad e Inspección Heurística**](Laboratorio-08-Evaluacion-Usabilidad/README.md)
  - Inspección basada en las **10 Heurísticas de Usabilidad de Jakob Nielsen**.
  - Diseño del formulario de evaluación con evaluadores pares de la materia.
  - Métricas cuantitativas obtenidas (SEQ promedio 4.6/5, escala SUS de **86.5/100 - Grado A+**, Tasa de éxito 95%).
  - Matriz de severidad de problemas y **Plan de Ajustes y Mejoras** implementado en Figma para la entrega definitiva.

---
*AlgoLearn — Universidad Central de Venezuela — Semestre I-2026*
