# Universidad Central de Venezuela
### Facultad de Ciencias — Escuela de Computación
### Tópicos Avanzados en Interacción Humano-Computador (6215)
### Semestre: I-2026

---

# LABORATORIO 4: Idear y Analizar
## Arquitectura de la Información — Mapa de Contenido

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

## 1. Introducción y Marco Teórico

La **Arquitectura de la Información (AI)** es la disciplina encargada de organizar, estructurar y rotular los elementos de un sistema interactivo para que los usuarios encuentren información y completen tareas con la menor carga cognitiva posible.

En el marco del método **PDCC-IHC** y como continuación del Laboratorio 3 (Casos de Uso y Modelo de Objetos del Dominio), este laboratorio desarrolla el **Mapa de Contenido** de la plataforma **AlgoLearn**, diseñado para sus dos modalidades de despliegue: **Web App** y **Mobile App**.

### Principios Fundamentales Aplicados:
1. **Claridad:** Cada nodo y ruta de navegación utiliza un vocabulario natural y comprensible para estudiantes universitarios novatos y profesores de la UCV, eliminando barreras idiomáticas y burocráticas detectadas en la competencia.
2. **Jerarquía:** Organización taxonómica multinivel que guía al usuario desde la bienvenida y selección libre de ruta hasta la unidad mínima interactiva (ejercicio en editor con feedback predictivo).
3. **Modularidad:** Estructura de bloques consistentes y reutilizables en web y móvil (Cards de lección, Workspace de código, Foros contextuales).

---

## 2. Convención y Notación Cátedra IHC (UCV)

Siguiendo estrictamente la pauta metodológica del Laboratorio 4 de TAIHC:

| Elemento de Notación | Forma Gráfica / Representación | Significado y Aplicación en AlgoLearn |
| :--- | :--- | :--- |
| **Interfaz / Entidad / Objeto** | Rectángulo con bordes suaves y listado de atributos | Pantalla o vista del sistema vinculada a entidades del MOD (ej: `Pantalla: Editor`, `Atributos: - Sintaxis, - CódigoBase`). |
| **Formulario (Entrada de datos)** | Rectángulo con etiqueta `[Formulario]` | Componente donde el usuario ingresa datos (ej: Formulario de Login, Formulario de Comentario). |
| **Acción (Caso de uso)** | Flecha rotulada o conector dirigido | Acción intencional realizada por el actor humano (ej: *Pulsar "Comprobar"*, *Elegir Ruta*). |
| **Acción del Sistema** | Rectángulo con esquinas rectas y borde punteado | Procesamiento autónomo o respuesta del sistema (ej: *Verificar AST*, *Acreditar XP*). |
| **Decisión / Condición** | Rombo de decisión `[¿Condición?]` | Bifurcación lógica del flujo (ej: *¿Código correcto?*, *¿Tiene internet?*). |
| **Entrada del Actor** | Texto en conector de entrada | Información o selección enviada por el usuario al sistema. |
| **Respuesta del Sistema** | Texto en conector de salida | Notificación visual, tooltip o cambio de estado mostrado al usuario (<100ms). |

---

## 3. Taxonomía y Estructura Jerárquica del Sistema

```
[Nivel 0: Acceso y Onboarding Directo]
  ├── Splash / Bienvenida Abierta
  ├── Formulario: Autenticación (Google OAuth / Credenciales)
  └── Pantalla: Selección de Ruta Académica (Pensamiento Computacional / Algoritmos)

[Nivel 1: Dashboard y Árbol de Conocimiento (Skill Tree)]
  ├── Barra Superior / Métricas (XP, Racha de Días, Nivel, Indicador Online/Offline)
  ├── Catálogo de Módulos Temáticos (Variables, Condicionales, Bucles, Arreglos)
  └── Barra de Navegación Global (Móvil: Bottom Nav / Web: Sidebar)
        ├── Aprender (Árbol)
        ├── Comunidad / Foros
        ├── Descargas Offline
        └── Perfil del Usuario

[Nivel 2: Workspace de Aprendizaje y Práctica]
  ├── Vista: Microlearning Teórico (Diagrama de Flujo + Sintaxis Visual en Español)
  └── Vista: Editor de Código Interactivo
        ├── Área de Instrucción Didáctica
        ├── Editor Case-Sensitive con Resaltado Sintáctico
        ├── Franja de Símbolos Rápidos (Mobile) / Atajos de Teclado (Web)
        └── Botón de Acción Principal: "Comprobar Solución"

[Nivel 3: Asistente Predictivo y Feedback (<100ms)]
  ├── Bifurcación: Evaluación del Código
        ├── [SI]: Refuerzo Positivo + Modal Recompensa (+25 XP) + Desbloqueo Siguiente Nodo
        └── [NO]: Tooltip Predictivo de Sintaxis (Línea exacta + Pista didáctica)

[Nivel 4: Capa Social y Discusión Embebida]
  └── Drawer / Bottom Sheet: Foro Contextual de la Lección
        ├── Listado de Hilos de la Lección Actual
        ├── Formulario: Nueva Pregunta (con inserción de bloque de código)
        └── Votación y Marcado de "Solución Verificada" (Docente/Comunidad)

[Nivel 5: Consola Docente (Web)]
  ├── Panel de Analíticas de Cohorte (Tasa de fallo por lección, tiempos medios)
  └── Gestor de Temario y Nuevos Retos Algorítmicos
```

---

## 4. Diagrama del Mapa de Contenido (Representación Arquitectónica)

A continuación se detalla el flujo integral con la notación formal requerida:

```mermaid
flowchart TD
    %% Estilos de Nodos según Notación IHC
    classDef interfaz fill:#EFF6FF,stroke:#2563EB,stroke-width:2px,color:#1E3A8A;
    classDef form fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#92400E;
    classDef accionSistema fill:#F0FDF4,stroke:#10B981,stroke-width:2px,stroke-dasharray: 4 4,color:#065F46;
    classDef decision fill:#FDF2F8,stroke:#DB2777,stroke-width:2px,color:#831843;
    classDef retroalimentacion fill:#FEE2E2,stroke:#EF4444,stroke-width:2px,color:#991B1B;

    %% Nivel 0: Acceso
    I_Bienvenida["Interfaz: Pantalla de Bienvenida\n- Atributos: EstadoRed, Idioma"]:::interfaz
    F_Auth["Formulario: Inicio de Sesión / Registro\n- Entradas: Correo, Clave, GoogleOAuth"]:::form
    S_ValidaAuth["Acción Sistema: Validar Credenciales / Token"]:::accionSistema
    D_Auth{"¿Credenciales Válidas?"}:::decision

    I_Bienvenida -->|Actor pulsa 'Comenzar'| F_Auth
    F_Auth -->|Envía datos| S_ValidaAuth
    S_ValidaAuth --> D_Auth
    D_Auth -- NO -->|Error legible| F_Auth
    D_Auth -- SI --> I_Rutas

    %% Nivel 1: Selección y Dashboard
    I_Rutas["Interfaz: Catálogo Abierto de Rutas\n- Atributos: ListaMaterias, Dificultad"]:::interfaz
    I_Dashboard["Interfaz: Árbol de Aprendizaje (Skill Tree)\n- Atributos: XP, Racha, ModulosActivos, EstadoDescarga"]:::interfaz

    I_Rutas -->|Actor selecciona 'Pensamiento Computacional'| I_Dashboard

    %% Nivel 2: Workspace de Lección
    I_LeccionTeorica["Interfaz: Lección Teórica Visual\n- Atributos: DiagramaFlujo, SintaxisEjemplo, TiempoEst"]:::interfaz
    I_Editor["Interfaz: Editor de Código Interactivo\n- Atributos: PlantillaCodigo, Buffer, BarraSimbolos, LineaError"]:::interfaz

    I_Dashboard -->|Actor pulsa lección activa| I_LeccionTeorica
    I_LeccionTeorica -->|Actor pulsa 'Ir a la Práctica'| I_Editor

    %% Nivel 3: Ejecución y Feedback Predictivo
    S_Evalua["Acción Sistema: Parsear AST y Casos de Prueba"]:::accionSistema
    D_CodigoValido{"¿Código Cumple Sintaxis y Salida?"}:::decision
    I_Exito["Interfaz: Modal de Recompensa\n- Atributos: +XP, AnimacionConfeti, SiguienteId"]:::interfaz
    I_TooltipFeedback["Interfaz: Tooltip Predictivo Guiado\n- Atributos: LineaFallo, MensajeErrorHumano, PistaSugerida"]:::retroalimentacion

    I_Editor -->|Actor pulsa 'Comprobar Solución'| S_Evalua
    S_Evalua --> D_CodigoValido
    D_CodigoValido -- SI -->|Éxito (<100ms)| I_Exito
    I_Exito -->|Actor pulsa 'Continuar'| I_Dashboard
    D_CodigoValido -- NO -->|Fallo sintáctico detectado| I_TooltipFeedback
    I_TooltipFeedback -->|Mantiene foco en línea| I_Editor

    %% Nivel 4: Capa Social Contextual
    I_Foro["Interfaz: Foro Contextual de la Lección\n- Atributos: IdLeccion, TotalHilos, RespuestasVerificadas"]:::interfaz
    F_NuevoAporte["Formulario: Nueva Pregunta / Respuesta\n- Entradas: Titulo, Texto, BloqueCodigo"]:::form
    S_PublicaComentario["Acción Sistema: Indexar Comentario en Hilo"]:::accionSistema

    I_Editor -.->|Actor pulsa 'Discutir'| I_Foro
    I_TooltipFeedback -.->|Actor requiere ayuda comunitaria| I_Foro
    I_Foro -->|Actor pulsa 'Preguntar'| F_NuevoAporte
    F_NuevoAporte -->|Enviar mensaje| S_PublicaComentario
    S_PublicaComentario --> I_Foro

    %% Nivel 5: Modo Offline (Mobile)
    S_Descarga["Acción Sistema: Serializar Módulo en SQLite Local"]:::accionSistema
    I_Dashboard -.->|Actor pulsa icono Descargar| S_Descarga
    S_Descarga -->|Actualizar a 'Listo sin Internet'| I_Dashboard
```

---

## 5. Especificación Detallada de Interfaces y Entidades

### Interfaz I-01: Árbol de Conocimiento (`I_Dashboard`)
- **Tipo:** Interfaz Principal (Navegación Primaria).
- **Entidad Asociada del MOD:** `RutaAprendizaje`, `Modulo`, `ProgresoLeccion`, `Estudiante`.
- **Atributos Mostrados:**
  - `puntosXP`: Contador acumulativo en la barra superior.
  - `rachaDias`: Indicador con llama de fuego del hábito de estudio continuo.
  - `nodoEstado`: Estado visual de cada lección (*Bloqueada* con candado, *En Curso* pulsante, *Completada* con estrella dorada).
  - `indicadorConexion`: Estado de red activo o insignia de "Modo Offline Activo".
- **Acciones Disponibles:**
  - Pulsar un nodo desbloqueado $\rightarrow$ Despliega ficha previa con objetivos y botón "Iniciar".
  - Pulsar botón "Descargar Módulo" $\rightarrow$ Dispara descarga local para uso sin datos móviles.
  - Alternar pestañas de la barra de navegación inferior (Mobile) o lateral (Web).

---

### Interfaz I-02: Workspace y Editor de Código (`I_Editor`)
- **Tipo:** Interfaz de Tarea Crítica.
- **Entidad Asociada del MOD:** `Ejercicio`, `EditorCodigo`, `FeedbackPredictivo`.
- **Atributos Mostrados:**
  - `instruccionDidactica`: Enunciado conciso y en español con variables resaltadas.
  - `bufferCodigo`: Editor case-sensitive con numeración de líneas y syntax highlighting adaptado a bajo contraste deslumbrante.
  - `barraHerramientas`:
    - En **Mobile**: Franja horizontal sobre el teclado del sistema con accesos directos táctiles: `{ } ( ) [ ] ; = < > print if else`.
    - En **Web**: Panel con atajos `Ctrl + Enter` (Comprobar) y `Ctrl + Space` (Autocompletado sugerido).
- **Formularios Embebidos:** Editor de texto directo sensible a mayúsculas y minúsculas.
- **Acciones del Actor:**
  - Escribir / corregir sintaxis.
  - Pulsar botón flotante "Discutir Lección".
  - Pulsar botón destacado "Comprobar Solución".

---

### Interfaz I-03: Asistente Predictivo y Tooltip de Feedback (`I_TooltipFeedback`)
- **Tipo:** Componente de Interacción No Invasivo (Microinteracción de Feedback).
- **Entidad Asociada del MOD:** `FeedbackPredictivo`, `ErrorSintactico`.
- **Atributos Mostrados:**
  - `lineaError`: Subrayado ondulado rojo/ámbar en la línea específica del fallo.
  - `mensajeExplicativo`: Explicación en lenguaje natural (ej. *"Atención: El identificador 'contador' fue declarado todo en minúsculas en la línea 2, pero aquí escribiste 'Contador' con C mayúscula"*).
  - `accionSugerida`: Botón "Aplicar Corrección" o botón "Ver Explicación en Foro".
- **Respuesta del Sistema:** Aparece en menos de 100ms tras la comprobación, sin pantallas de carga pesadas ni videos obligatorios de 12 minutos.

---

### Interfaz I-04: Foro Contextual Embebido (`I_Foro`)
- **Tipo:** Interfaz Social Deslizable (Side Panel en Web / Bottom Sheet en Mobile).
- **Entidad Asociada del MOD:** `ForoLeccion`, `HiloDiscusion`, `Comentario`.
- **Atributos Mostrados:**
  - `tituloLeccion`: Cabecera indicando el contexto del ejercicio actual.
  - `hilosDestacados`: Lista de preguntas con badge de "Solución Verificada por Preparador UCV".
  - `cajaComentario`: Input rápido con botón "Pegar mi código actual" para solicitar revisión colaborativa.

---

## 6. Archivo Editable Draw.io

Para permitir su edición visual y exportación en alta resolución, se generó el archivo **[`mapa_contenido_lab4.drawio`](mapa_contenido_lab4.drawio)** en esta carpeta, organizado con:
- Paleta semántica estandarizada.
- Conectores direccionados con etiquetas de decisión y acción del sistema.
- Cajas de atributos de entidades conformes a la pauta de la cátedra de IHC de la UCV.

---
*Documento elaborado para TAIHC 6215 - UCV Semestre I-2026 por el Grupo #4.*
