import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    """Sets background color of a cell."""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Sets cell margins (padding) in twentieths of a point (dxa)."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for margin, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(margin)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_report():
    doc = Document()
    
    # Define standard margins (2.5 cm or 1 Inch)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        
    # Styles and Palette Colors
    COLOR_PRIMARY = RGBColor(0x1B, 0x36, 0x5D)    # Deep Navy Blue
    COLOR_SECONDARY = RGBColor(0x00, 0x80, 0x80)  # Teal
    COLOR_TEXT = RGBColor(0x2B, 0x2B, 0x2B)       # Off-black/Charcoal
    COLOR_MUTED = RGBColor(0x7F, 0x8C, 0x8D)      # Muted Gray
    
    # -------------------------------------------------------------
    # 1. PÁGINA DE PORTADA (COVER PAGE)
    # -------------------------------------------------------------
    title_p = doc.add_paragraph()
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_p.paragraph_format.space_before = Pt(30)
    title_p.paragraph_format.space_after = Pt(10)
    
    run_univ = title_p.add_run("UNIVERSIDAD CENTRAL DE VENEZUELA\nFACULTAD DE CIENCIAS\nESCUELA DE COMPUTACIÓN\n")
    run_univ.font.name = 'Calibri'
    run_univ.font.size = Pt(12)
    run_univ.font.bold = True
    run_univ.font.color.rgb = COLOR_PRIMARY
    
    run_dept = title_p.add_run("DISEÑO Y PROTOTIPADO DE RECURSOS EDUCATIVOS DIGITALES (DPRED)\n")
    run_dept.font.name = 'Calibri'
    run_dept.font.size = Pt(11)
    run_dept.font.bold = True
    run_dept.font.color.rgb = COLOR_SECONDARY
    
    # Separator
    p_sep = doc.add_paragraph()
    p_sep.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sep.paragraph_format.space_after = Pt(40)
    run_sep = p_sep.add_run("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    run_sep.font.color.rgb = COLOR_SECONDARY
    
    # Project Title
    p_proj = doc.add_paragraph()
    p_proj.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_proj.paragraph_format.space_after = Pt(20)
    
    run_title = p_proj.add_run("PROPUESTA DE RECURSO EDUCATIVO DIGITAL:\nAPRENDE GIT INTERACTIVO\n")
    run_title.font.name = 'Calibri'
    run_title.font.size = Pt(22)
    run_title.font.bold = True
    run_title.font.color.rgb = COLOR_PRIMARY
    
    run_subtitle = p_proj.add_run('"Plataforma de Simulación Visual y Tutoría Inteligente para la Enseñanza y Comprensión del Control de Versiones"\n')
    run_subtitle.font.name = 'Calibri'
    run_subtitle.font.size = Pt(12)
    run_subtitle.font.italic = True
    run_subtitle.font.color.rgb = COLOR_TEXT
    
    # Delivery Tag
    p_del = doc.add_paragraph()
    p_del.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_del.paragraph_format.space_after = Pt(60)
    run_del = p_del.add_run("INFORME DE INVESTIGACIÓN, ANÁLISIS Y DISEÑO (ENTREGA #1)")
    run_del.font.name = 'Calibri'
    run_del.font.size = Pt(11)
    run_del.font.bold = True
    run_del.font.color.rgb = COLOR_SECONDARY
    
    # Group and Professor Info
    p_info = doc.add_paragraph()
    p_info.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_info.paragraph_format.space_after = Pt(30)
    
    run_group = p_info.add_run("Autores - Grupo #4:\nJonathan Torres\nRicardo Riera\nJavier Darder\n\n")
    run_group.font.name = 'Calibri'
    run_group.font.size = Pt(11)
    run_group.font.color.rgb = COLOR_TEXT
    
    run_prof = p_info.add_run("Docentes de Cátedra:\nProf. Felix Urbano\nProfa. Yusneyi Carballo Barrera\nProf. José Antonio Fernández\n")
    run_prof.font.name = 'Calibri'
    run_prof.font.size = Pt(11)
    run_prof.font.color.rgb = COLOR_TEXT
    
    # Date
    p_date = doc.add_paragraph()
    p_date.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_date.paragraph_format.space_before = Pt(30)
    run_date = p_date.add_run("Caracas, 25 de junio de 2026")
    run_date.font.name = 'Calibri'
    run_date.font.size = Pt(10)
    run_date.font.color.rgb = COLOR_MUTED
    
    doc.add_page_break()
    
    # Helper to add standard styled headings
    def add_section_heading(text, level=1):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.bold = True
        if level == 1:
            run.font.size = Pt(16)
            run.font.color.rgb = COLOR_PRIMARY
            p.paragraph_format.space_before = Pt(24)
        elif level == 2:
            run.font.size = Pt(13)
            run.font.color.rgb = COLOR_SECONDARY
        else:
            run.font.size = Pt(11.5)
            run.font.color.rgb = COLOR_TEXT
        return p
        
    def add_body_paragraph(text, bold_prefix=None, bullet=False, italic=False, indent=0.0):
        p = doc.add_paragraph()
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.space_before = Pt(0)
        
        if indent > 0:
            p.paragraph_format.left_indent = Inches(indent)
            
        if bullet:
            p.paragraph_format.left_indent = Inches(0.25)
            run_bullet = p.add_run("•  ")
            run_bullet.font.name = 'Calibri'
            run_bullet.font.color.rgb = COLOR_SECONDARY
            
        if bold_prefix:
            run_bold = p.add_run(bold_prefix)
            run_bold.font.name = 'Calibri'
            run_bold.font.bold = True
            run_bold.font.color.rgb = COLOR_TEXT
            
        run_text = p.add_run(text)
        run_text.font.name = 'Calibri'
        run_text.font.size = Pt(11)
        run_text.font.color.rgb = COLOR_TEXT
        run_text.font.italic = italic
        return p
        
    # -------------------------------------------------------------
    # 2. SECCIÓN 1: EL PROBLEMA Y DEFINICIÓN DE ALCANCE
    # -------------------------------------------------------------
    add_section_heading("1. Definición del Problema y su Alcance", level=1)
    
    add_body_paragraph(
        "En el ámbito de la ingeniería de sistemas, ciencias de la computación y desarrollo de software, "
        "el control de versiones utilizando Git se ha consolidado como una competencia profesional básica no negociable. "
        "Sin embargo, existe una desconexión crítica entre el aprendizaje académico de la herramienta y las habilidades "
        "requeridas en entornos laborales reales."
    )
    
    add_body_paragraph(
        "Se estima que el 80% de los estudiantes de carreras informáticas llegan a su primer empleo o a las asignaturas de "
        "desarrollo colaborativo (como Ingeniería de Software) sin comprender el modelo mental subyacente de Git. El aprendizaje "
        "tradicional se limita a la memorización mecánica de una secuencia de comandos sintácticos (como git add, git commit, git push) "
        "sin que el estudiante comprenda el flujo de estados internos, la estructura del Grafo Acíclico Dirigido (DAG) o las implicaciones "
        "arquitectónicas de sus acciones. Esta falta de entendimiento genera lo que en la industria se conoce como 'ansiedad ante la terminal' "
        "(CLI anxiety) y deriva en errores críticos en proyectos grupales, como la pérdida accidental de código o la parálisis del flujo "
        "de trabajo ante el primer conflicto de integración."
    )
    
    add_section_heading("1.1. Delimitación y Alcance del Recurso Educativo Digital (RED)", level=2)
    add_body_paragraph(
        "Para transformar este paradigma instructivo, el RED 'Aprende Git Interactivo' se plantea como una plataforma "
        "educativa web estructurada en tres grandes módulos interactivos, diseñados bajo el enfoque de gamificación y "
        "Diseño Universal para el Aprendizaje (DUA):"
    )
    
    add_body_paragraph(
        "Visualiza de manera dinámica la separación conceptual y la transferencia de datos entre el Working Directory (directorio de trabajo), "
        "el Staging Area (zona de preparación) y el Local Repository (repositorio local). Cada comando ejecutado en la consola "
        "simulada dibuja y manipula en tiempo real un Grafo Vivo de commits y referencias (ramas y puntero HEAD), permitiendo "
        "que el usuario 'vea' la estructura interna de Git.",
        bold_prefix="Módulo 1: El Core - Visualización del Entorno Local y Grafo Vivo. ",
        bullet=True
    )
    
    add_body_paragraph(
        "Introduce la conexión con servidores remotos. Simula los flujos de sincronización (push, fetch y pull) "
        "representando al servidor como un segundo grafo espejo. Asimismo, gamifica dinámicamente las mecánicas de "
        "creación de ramas de características (feature branches), simulación de Pull Requests (PR) y procesos de Code Review "
        "con respuestas predefinidas.",
        bold_prefix="Módulo 2: El Puente - Conexión con GitHub y Mecánicas Colaborativas. ",
        bullet=True
    )
    
    add_body_paragraph(
        "Aborda directamente la resolución de conflictos. Contiene un simulador interactivo de resolución "
        "de conflictos con una interfaz simplificada que imita los marcadores visuales de conflicto de editores modernos (como VS Code). "
        "Además, simula y contrasta en paralelo los conceptos de Merge vs. Rebase para que el alumno visualice cómo el rebase "
        "reescribe linealmente la historia y cuándo resulta peligroso.",
        bold_prefix="Módulo 3: El Modo Supervivencia - Resolución de Conflictos e Historiales Rotos. ",
        bullet=True
    )
    
    add_body_paragraph(
        "Se implementará un tutor pedagógico basado en inteligencia artificial (Nova) integrado directamente en el frontend. "
        "Si el estudiante permanece estancado por más de 2 minutos en un nivel o comete errores consecutivos, Nova "
        "se activará discretamente para explicar el origen lógico del conflicto o desalineación del árbol, ofreciendo "
        "andamiaje cognitivo en lugar de resolver la tarea por el usuario.",
        bold_prefix="Tutor Pedagógico con Inteligencia Artificial (Nova): ",
        bullet=True
    )
    
    add_body_paragraph(
        "Exclusiones del Proyecto: El RED no busca emular la totalidad de las opciones avanzadas de Git (como comandos complejos "
        "de git reflog, filter-branch o hooks de servidor), sino asegurar el dominio sólido de los flujos de trabajo profesionales "
        "comunes (Gitflow y Trunk-based Development) para estudiantes y desarrolladores junior."
    )
    
    # -------------------------------------------------------------
    # 2. SECCIÓN 1.2: MATRIZ FODA
    # -------------------------------------------------------------
    add_section_heading("1.2. Matriz FODA (Fortalezas, Oportunidades, Debilidades, Amenazas)", level=2)
    add_body_paragraph(
        "A continuación se presenta la matriz FODA del proyecto para evaluar factores internos controlables y externos del entorno:"
    )
    
    # SWOT Table
    foda_table = doc.add_table(rows=3, cols=2)
    foda_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    # Headers
    foda_hdr = foda_table.rows[0].cells
    foda_hdr[0].text = "ORIGEN INTERNO (Controlable)"
    foda_hdr[1].text = "ORIGEN EXTERNO (Entorno)"
    for idx, cell in enumerate(foda_hdr):
        set_cell_background(cell, "1B365D")
        set_cell_margins(cell, top=120, bottom=120, left=100, right=100)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.name = 'Calibri'
            run.font.bold = True
            run.font.size = Pt(10)
            run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            
    r1_cells = foda_table.rows[1].cells
    r1_cells[0].text = (
        "FORTALEZAS (F)\n"
        "1. Interactividad Real: Enfoque práctico y visual que supera los tutoriales pasivos de video.\n"
        "2. Arquitectura Client-Side: Simulación del motor Git en el navegador del cliente (JS/WebAssembly), reduciendo costos de hosting a cero.\n"
        "3. Tutoría Inteligente Integrada: Asistencia contextual basada en andamiaje con IA (Nova) en atascos.\n"
        "4. Enfoque DUA: Accesibilidad planificada desde el inicio para inclusión educativa."
    )
    r1_cells[1].text = (
        "OPORTUNIDADES (O)\n"
        "1. Alta Demanda Sector Tech: Necesidad obligatoria de aprender control de versiones en el currículo de sistemas.\n"
        "2. Adopción Académica UCV: Oportunidad de ser utilizado como herramienta de apoyo formal en Ingeniería de Software.\n"
        "3. Comunidad de Software Libre: Atracción de desarrolladores colaboradores al liberar el código en GitHub.\n"
        "4. Alianzas y Créditos: Obtención de facilidades gratuitas de despliegue mediante programas como GitHub Education."
    )
    
    r2_cells = foda_table.rows[2].cells
    r2_cells[0].text = (
        "DEBILIDADES (D)\n"
        "1. Presupuesto Limitado: Al ser un proyecto de cátedra, se carece de fondos comerciales para despliegue avanzado.\n"
        "2. Restricción de Tiempo Académico: Cronograma acotado de un semestre para implementar la complejidad del motor de Git.\n"
        "3. Dependencia del Equipo: Avance limitado a las horas y habilidades disponibles del grupo de desarrollo.\n"
        "4. Curva de Desarrollo UI/UX: Complejidad técnica para hacer una emulación de consola que sea 100% amigable y accesible."
    )
    r2_cells[1].text = (
        "AMENAZAS (A)\n"
        "1. Competidores Consolidados: Sitios con alto posicionamiento internacional (ej. Learngitbranching, Oh My Git!).\n"
        "2. Políticas de API de GitHub: Modificaciones externas drásticas en OAuth de GitHub que invaliden el flujo del Módulo 2.\n"
        "3. Frustración Temprana del Alumno: Abandono de la plataforma si los niveles avanzados o la consola virtual resultan muy difíciles.\n"
        "4. Herramientas Automatizadas de IA: Evolución de asistentes de IA que resuelven conflictos solos, reduciendo el interés del estudiante en aprender."
    )
    
    for row in [r1_cells, r2_cells]:
        for col_idx, cell in enumerate(row):
            set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
            p = cell.paragraphs[0]
            if col_idx == 0:
                set_cell_background(cell, "F2F5F8")
            else:
                set_cell_background(cell, "FFFFFF")
            
            lines = cell.text.split('\n')
            p.text = ""
            for line_idx, line in enumerate(lines):
                if line_idx == 0:
                    run = p.add_run(line + "\n")
                    run.font.name = 'Calibri'
                    run.font.bold = True
                    run.font.size = Pt(10.5)
                    run.font.color.rgb = COLOR_PRIMARY
                else:
                    run = p.add_run(line + "\n" if line_idx < len(lines)-1 else line)
                    run.font.name = 'Calibri'
                    run.font.size = Pt(9.5)
                    run.font.color.rgb = COLOR_TEXT

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # 3. SECCIÓN 2: ANÁLISIS PESTEL
    # -------------------------------------------------------------
    add_section_heading("2. Análisis del Entorno (PESTEL)", level=1)
    add_body_paragraph(
        "Para asegurar la viabilidad de la plataforma como un proyecto académico e innovador y evaluar el impacto del entorno, "
        "se desarrolla el análisis PESTEL correspondiente:"
    )
    
    add_body_paragraph(
        "La promoción nacional y regional de la educación STEM y la alfabetización digital. La plataforma encaja como "
        "un recurso de apoyo didáctico para universidades técnicas. Existe un riesgo geopolítico bajo de restricciones "
        "en los servicios de infraestructura cloud usuales (Vercel, Firebase).",
        bold_prefix="Dimensión Política (P): ",
        bullet=True
    )
    
    add_body_paragraph(
        "El elevado costo de la educación técnica formal potencia la demanda de herramientas educativas libres de alta calidad. "
        "La principal restricción económica radica en los costos de infraestructura (servidores interactivas en USD). Para solucionar "
        "esto, la arquitectura se diseñará para ejecutar la simulación de Git directamente en el navegador del cliente, "
        "reduciendo los costos de computación central a cero.",
        bold_prefix="Dimensión Económica (E): ",
        bullet=True
    )
    
    add_body_paragraph(
        "Las nuevas generaciones exigen formatos interactivos y gamificados ('Play-and-Learn'), rechazando manuales "
        "estáticos en PDF o videos instructivos largos y pasivos. La interfaz debe diseñarse con alta empatía cognitiva "
        "para reducir la frustración inicial de interactuar con una consola de comandos.",
        bold_prefix="Dimensión Social (S): ",
        bullet=True
    )
    
    add_body_paragraph(
        "La madurez de JavaScript y WebAssembly permite emular un sandbox del sistema de archivos y el motor "
        "de Git 100% en el frontend del cliente. Se requiere la integración mediante la API de GitHub (OAuth) para posibilitar "
        "que el estudiante conecte opcionalmente su portafolio real.",
        bold_prefix="Dimensión Tecnológica (T): ",
        bullet=True
    )
    
    add_body_paragraph(
        "La optimización de código del lado del cliente (frontend-first) contribuye al Green Computing al disminuir "
        "el uso innecesario de ciclos de CPU y consumo energético en centros de datos. Elimina al 100% la huella ecológica "
        "asociada a guías impresas, evaluaciones físicas o manuales de laboratorio.",
        bold_prefix="Dimensión Ecológica / Ambiental (E): ",
        bullet=True
    )
    
    add_body_paragraph(
        "Obligatoriedad de cumplir con normativas de protección de datos (especialmente al almacenar sesiones u OAuth "
        "con tokens de GitHub). Es legalmente indispensable incorporar un descargo de responsabilidad (disclaimer) que aclare "
        "que el recurso es independiente y no está patrocinado de manera oficial por Microsoft o GitHub.",
        bold_prefix="Dimensión Legal (L): ",
        bullet=True
    )
    
    # -------------------------------------------------------------
    # 4. SECCIÓN 3: ANÁLISIS DE COMPETIDORES
    # -------------------------------------------------------------
    doc.add_page_break()
    add_section_heading("3. Análisis de Competidores (Benchmarking)", level=1)
    add_body_paragraph(
        "El ecosistema de recursos para aprender Git se divide principalmente en herramientas operativas o tutoriales "
        "teóricos pasivos. Para posicionar estratégicamente a 'Aprende Git Interactivo', se realizó un benchmarking competitivo:"
    )
    
    add_body_paragraph(
        "Es el referente directo más exitoso en la web. Ofrece un entorno excelente con "
        "una terminal de comandos interactiva y un árbol visual en tiempo real. No obstante, presenta deficiencias notables: "
        "carece de simulación de flujos de trabajo colaborativos reales (como la revisión de código en Pull Requests con interfaz similar "
        "a la de GitHub), no cuenta con un editor interactivo para resolver conflictos línea por línea, carece de tutoría con "
        "Inteligencia Artificial que explique conceptualmente los atascos y su diseño web no es accesible para estudiantes "
        "con discapacidad visual o de aprendizaje (incumplimiento del Diseño Universal para el Aprendizaje - DUA).",
        bold_prefix="Competidor Directo: Learngitbranching.js.org. "
    )
    
    add_body_paragraph(
        "Juego de escritorio open-source para aprender Git. Es muy visual y "
        "cuenta con mecánicas de juego atractivas, pero al requerir instalación física no es apto para un acceso inmediato "
        "en salas de computación universitaria o teléfonos móviles. No simula la interfaz web de GitHub.",
        bold_prefix="Competidor Directo Secundario: Oh My Git! "
    )
    
    add_body_paragraph(
        "Clientes visuales como GitKraken, Sourcetree o GitHub Desktop. Aunque ayudan "
        "al programador junior a evitar la consola, son herramientas de producción y no plataformas educativas. El usuario aprende "
        "a presionar botones pero no a entender conceptualmente el flujo, perpetuando su dependencia tecnológica.",
        bold_prefix="Competidores Indirectos (Herramientas Visuales): "
    )
    
    add_body_paragraph(
        "Cursos en video de plataformas de e-learning (Udemy, YouTube) y la documentación oficial "
        "de git-scm. Son recursos fundamentalmente pasivos de alto nivel teórico y nula interactividad práctica, propensos a "
        "generar aburrimiento y deserción temprana.",
        bold_prefix="Competidores Indirectos (Contenido Pasivo): "
    )
    
    add_section_heading("Matriz de Benchmarking Competitivo", level=2)
    
    table = doc.add_table(rows=5, cols=7)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    headers = [
        "Competidor",
        "Simulación de Grafo",
        "Mecánica Remota / PR",
        "Editor de Conflictos",
        "Tutoría Inteligente (IA)",
        "Accesibilidad (DUA)",
        "Disponibilidad"
    ]
    
    hdr_cells = table.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        set_cell_background(hdr_cells[i], "1B365D")
        set_cell_margins(hdr_cells[i], top=120, bottom=120, left=100, right=100)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.name = 'Calibri'
            run.font.bold = True
            run.font.size = Pt(9.5)
            run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            
    row_data = [
        ["Aprende Git Interactivo (Propuesta)", "Sí, animado interactivo", "Sí, simulación web de PRs", "Sí, editor línea por línea", "Sí, Nova AI integrada", "Sí, WCAG AA / DUA", "Web/Móvil (Cero costo)"],
        ["Learngitbranching.js.org", "Sí, interactivo de comandos", "No, comandos mock simples", "No, automático por comandos", "No", "No accesible", "Web (Cero costo)"],
        ["Oh My Git!", "Sí, vista gráfica en juego", "No, simulación local", "No, automático por UI", "No", "Medio", "Escritorio (Instalación)"],
        ["Clientes Gráficos (GitKraken)", "Sí, lectura de repo real", "Sólo links e integraciones", "Sí, herramientas de merge", "No educativa (Herramienta)", "Bajo", "Escritorio / Pago"]
    ]
    
    for row_idx, data in enumerate(row_data):
        row_cells = table.rows[row_idx + 1].cells
        for col_idx, text in enumerate(data):
            row_cells[col_idx].text = text
            set_cell_margins(row_cells[col_idx], top=100, bottom=100, left=100, right=100)
            p = row_cells[col_idx].paragraphs[0]
            
            if col_idx == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                
            for run in p.runs:
                run.font.name = 'Calibri'
                run.font.size = Pt(9)
                run.font.color.rgb = COLOR_TEXT
                if row_idx == 0:
                    run.font.bold = True
                    
            if row_idx % 2 == 0:
                set_cell_background(row_cells[col_idx], "F2F5F8")
            else:
                set_cell_background(row_cells[col_idx], "FFFFFF")
                
            if row_idx == 0:
                set_cell_background(row_cells[col_idx], "E1EBF5")
                
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    
    # -------------------------------------------------------------
    # 5. SECCIÓN 4: ANÁLISIS DEL CLIENTE
    # -------------------------------------------------------------
    add_section_heading("4. Análisis del Cliente (User Persona)", level=1)
    add_body_paragraph(
        "Para diseñar una solución centrada en el usuario, se modeló el perfil psicográfico del cliente objetivo "
        "con base en las realidades observadas en los primeros niveles de las carreras tecnológicas de la Universidad Central de Venezuela:"
    )
    
    add_body_paragraph(
        "Carlos Mendoza (El Estudiante de Tecnología Abrumado)",
        bold_prefix="Perfil del Arquetipo: "
    )
    add_body_paragraph("21 años.", bold_prefix="Edad: ", bullet=True)
    add_body_paragraph("Estudiante de los primeros semestres de Licenciatura en Computación en la UCV y desarrollador junior autodidacta.", bold_prefix="Ocupación: ", bullet=True)
    add_body_paragraph(
        "Posee bases de programación conceptual. Sin embargo, carece de experiencia en el trabajo colaborativo en equipos "
        "y el uso formal del control de versiones. La terminal de sistema operativo le genera una barrera psicológica importante.",
        bold_prefix="Contexto Educativo: ",
        bullet=True
    )
    
    add_body_paragraph(
        "Aprobar la asignatura de desarrollo colaborativo de software, coordinar de manera fluida y sin tropiezos la integración "
        "del código de su grupo de proyecto, y desarrollar el portafolio personal en GitHub para aspirar a sus primeras pasantías o empleos.",
        bold_prefix="Trabajos del Cliente (Customer Jobs):",
        bullet=False
    )
    
    add_body_paragraph(
        "La complejidad sintáctica y falta de feedback visual de la terminal, el miedo paralizante de cometer un error "
        "(como git push --force o una fusión fallida) y arruinar el trabajo acumulado del equipo, la naturaleza densa y teórica "
        "de los manuales de Git, y la falta de traducción en español de los errores más comunes.",
        bold_prefix="Frustraciones (Pains):",
        bullet=False
    )
    
    add_body_paragraph(
        "Disponer de un sandbox interactivo y seguro donde poder equivocarse y experimentar sin miedo a perder archivos reales, "
        "recibir retroalimentación correctiva al instante, entender con diagramas de nodos dinámicos qué representa cada comando ejecutado "
        "y sentir un progreso motivador a través de mecánicas de juego estructuradas.",
        bold_prefix="Alegrías (Gains):",
        bullet=False
    )
    
    # -------------------------------------------------------------
    # 6. SECCIÓN 4.2: USER JOURNEY MAP
    # -------------------------------------------------------------
    add_section_heading("4.2. User Journey Map (Mapa de Viaje del Usuario)", level=2)
    add_body_paragraph(
        "A continuación se modela el flujo de experiencia de Carlos Mendoza al interactuar con el recurso interactivo:"
    )
    
    ujm_table = doc.add_table(rows=7, cols=6)
    ujm_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    ujm_headers = [
        "Etapa",
        "Acciones del Usuario",
        "Puntos de Contacto",
        "Pensamientos/Emociones",
        "Puntos de Dolor",
        "Oportunidades en RED"
    ]
    
    ujm_hdr = ujm_table.rows[0].cells
    for i, title in enumerate(ujm_headers):
        ujm_hdr[i].text = title
        set_cell_background(ujm_hdr[i], "008080")
        set_cell_margins(ujm_hdr[i], top=120, bottom=120, left=100, right=100)
        p = ujm_hdr[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.name = 'Calibri'
            run.font.bold = True
            run.font.size = Pt(9.5)
            run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            
    ujm_data = [
        ["1. Descubrimiento", "Entra a la plataforma por recomendación de su profesor en el Aula Virtual UCV.", "Enlace en Classroom / Web pública.", "Curioso, expectante. Siente flojera por tener que leer teoría.", "Enlace caído, carga inicial de la web lenta.", "Garantizar carga ultra-rápida (menos de 2s) y diseño visual atractivo."],
        ["2. Onboarding", "Inicia sesión con su cuenta GitHub y realiza un test rápido diagnóstico.", "OAuth de GitHub. Interfaz de bienvenida.", "Nervioso por conectar su cuenta personal. Intrigado por el nivel inicial.", "Exceso de permisos requeridos por OAuth.", "Solicitar permisos mínimos de lectura pública para su portafolio."],
        ["3. Aprendizaje Core", "Completa comandos básicos de Git local y observa los nodos moverse.", "Consola y panel del Grafo Vivo.", "Motivado y con confianza. '¡Ah, ya entiendo qué hace git commit!'", "Errores tipográficos en la consola simulada.", "Añadir autocompletado y sugerencias sintácticas rápidas."],
        ["4. Conflicto", "En el módulo 3, el sistema le provoca un conflicto al fusionar ramas.", "Interfaz del simulador con archivo de conflicto en rojo.", "Frustrado, ansioso. Siente miedo a romper las ramas del equipo.", "Mensaje tosco de conflicto en pantalla, sensación de bloqueo.", "Habilitar botón de reset de nivel inmediato para disminuir la frustración."],
        ["5. Andamiaje IA", "Permanece 2 minutos bloqueado. El bot Nova IA le abre una ventana con pistas.", "Chat flotante y nodos resaltados en el grafo.", "Aliviado, enfocado. 'Por fin alguien me explica por qué chocó esto'.", "Explicación muy larga o genérica que no ayuda.", "Hacer respuestas de Nova ultra-cortas y apoyadas en el grafo visual."],
        ["6. Logro y Cierre", "Resuelve la colisión de código, avanza de nivel y comparte su certificado.", "Certificado digital en la web. Botón de LinkedIn.", "Orgulloso, con mayor autoeficacia técnica.", "Falta de incentivo real para exportar o mostrar su progreso.", "Permitir exportar los ejercicios resueltos a su GitHub real como commits."]
    ]
    
    for row_idx, row_list in enumerate(ujm_data):
        row_cells = ujm_table.rows[row_idx + 1].cells
        for col_idx, text in enumerate(row_list):
            row_cells[col_idx].text = text
            set_cell_margins(row_cells[col_idx], top=80, bottom=80, left=80, right=80)
            p = row_cells[col_idx].paragraphs[0]
            
            if col_idx == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                for run in p.runs:
                    run.font.bold = True
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                
            for run in p.runs:
                run.font.name = 'Calibri'
                run.font.size = Pt(8.5)
                run.font.color.rgb = COLOR_TEXT
                
            if row_idx % 2 == 0:
                set_cell_background(row_cells[col_idx], "F4F9F9")
            else:
                set_cell_background(row_cells[col_idx], "FFFFFF")
                
    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # 7. SECCIÓN 5: SOLUCIÓN Y JUSTIFICACIÓN
    # -------------------------------------------------------------
    add_section_heading("5. Propuesta de Solución y Justificación", level=1)
    add_body_paragraph(
        "La solución propuesta es el Recurso Educativo Digital 'Aprende Git Interactivo' (GitMaster). "
        "Se plantea como una plataforma Web interactiva de simulación y andamiaje cognitivo que aborda de raíz las frustraciones "
        "detectadas y satisface los trabajos de aprendizaje de Carlos Mendoza de manera eficiente y ágil."
    )
    
    add_section_heading("5.1. Justificación Pedagógica y de Diseño Educativo", level=2)
    
    add_body_paragraph(
        "La plataforma se cimenta sobre la teoría del constructivismo interactivo (Novak & Gowin). "
        "En lugar de la memorización verbal del comando, el estudiante manipula directamente el Grafo Vivo. Al cambiar las ramas, "
        "visualiza cómo se mueven los punteros locales de Git. Así, el alumno autoconstruye el modelo mental de Git como un sistema "
        "de almacenamiento de instantáneas (commits) y referencias dinámicas, lo que asegura un aprendizaje significativo a largo plazo.",
        bold_prefix="Teoría Constructivista y Modelado Mental: ",
        bullet=True
    )
    
    add_body_paragraph(
        "Alineado con el Diseño Universal para el Aprendizaje (DUA) e incorporando los estándares de accesibilidad WCAG AA. "
        "Esto implica el uso de contrastes de color validados (evitando depender solo del color para diferenciar ramas), descripciones "
        "de voz alternativas y soporte de navegación por teclado completa para que el simulador sea inclusivo en el aula.",
        bold_prefix="Inclusión y Accesibilidad Universal: ",
        bullet=True
    )
    
    add_body_paragraph(
        "La simulación local en el frontend (reducción de costos energéticos y de hosting), y la gamificación como potenciador "
        "de la constancia estudiantil para mitigar la deserción temprana.",
        bold_prefix="Sostenibilidad y Gamificación: ",
        bullet=True
    )
    
    add_section_heading("5.2. Mockup Conceptual de la Interfaz del Prototipo", level=2)
    add_body_paragraph(
        "A continuación se presenta el prototipo visual de la interfaz del RED, diseñado para optimizar "
        "la carga cognitiva del usuario y mantener el andamiaje del tutor inteligente de IA (Nova) visible e interactivo:"
    )
    
    # Add Image Mockup
    mockup_path = "/home/shonny-torres/.gemini/antigravity-cli/brain/764ef8c8-8984-4205-a377-1a59c3bddd85/git_learning_mockup_1782310961798.jpg"
    if os.path.exists(mockup_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(12)
        p_img.paragraph_format.space_after = Pt(6)
        
        run_img = p_img.add_run()
        run_img.add_picture(mockup_path, width=Inches(5.8))
        
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_after = Pt(12)
        run_cap = p_cap.add_run("Figura 1: Mockup conceptual de la plataforma 'Aprende Git Interactivo' en modo oscuro. "
                               "Se visualiza a la izquierda el espacio de código y terminal simulada; en el centro, el Grafo Vivo "
                               "del repositorio; y a la derecha, la asistencia de andamiaje pedagógico de la tutora Nova IA.")
        run_cap.font.name = 'Calibri'
        run_cap.font.size = Pt(9.5)
        run_cap.font.italic = True
        run_cap.font.color.rgb = COLOR_MUTED
    else:
        add_body_paragraph("[ERROR: La imagen del prototipo no pudo ser localizada en el sistema de archivos]", bold_prefix="Nota: ")
        
    # -------------------------------------------------------------
    # 8. SECCIÓN 6: ENCAJE DE VALOR (VALUE PROPOSITION CANVAS)
    # -------------------------------------------------------------
    doc.add_page_break()
    add_section_heading("6. Encaje de Valor (Value Proposition Canvas)", level=1)
    add_body_paragraph(
        "El mapa de encaje de valor analiza el acoplamiento directo entre los módulos del Recurso Educativo Digital (RED) "
        "y las necesidades psicográficas de nuestro usuario arquetípico Carlos Mendoza:"
    )
    
    add_body_paragraph(
        "Web App interactiva con terminal virtual emulada en JS, editor visual "
        "de archivos de código con resaltador de sintaxis, simulador dinámico del Grafo Vivo del repositorio en SVG/Canvas, "
        "y chat de tutoría contextual asistida por IA (Nova).",
        bold_prefix="1. Productos y Servicios del RED: ",
        bullet=True
    )
    
    add_body_paragraph(
        "Entorno cerrado de simulación (sandbox) que elimina el riesgo de borrar archivos "
        "reales del equipo, traducción de códigos de error de consola a explicaciones amigables en español, pistas contextuales "
        "automáticas basadas en IA tras periodos de inactividad, y niveles de andamiaje progresivos (init -> conflict solver).",
        bold_prefix="2. Aliviadores de Frustraciones (Pain Relievers): ",
        bullet=True
    )
    
    add_body_paragraph(
        "Actualización inmediata del árbol gráfico de commits y ramas con cada comando, "
        "sistema de progresión gamificado (puntuación, ligas académicas virtuales y medallas), simulaciones interactivas de fusión "
        "colaborativa (PRs) con roles automatizados de revisores, y explicaciones intuitivas sobre Merge vs. Rebase.",
        bold_prefix="3. Creadores de Alegrías (Gain Creators): ",
        bullet=True
    )
    
    add_body_paragraph(
        "El encaje de valor es robusto y se manifiesta de forma directa en tres intersecciones clave del diseño educativo y técnico:"
    )
    
    add_body_paragraph(
        "El temor de Carlos a arruinar repositorios compartidos se neutraliza por completo con el "
        "simulador del lado del cliente. Al tratarse de un entorno sandbox local, el estudiante puede experimentar "
        "libremente, ejecutar rebase destructivos o borrar punteros HEAD sin consecuencias reales, construyendo resiliencia ante el error.",
        bold_prefix="Intersección Sandbox - Reducción del Miedo: ",
        bullet=True
    )
    
    add_body_paragraph(
        "El atasco cognitivo de Carlos frente a la consola se mitiga con la visualización gráfica inmediata. "
        "Si ejecuta 'git checkout -b feature', observa en milisegundos cómo nace una rama derivada del commit actual y cómo el puntero HEAD se "
        "traslada al nuevo nodo. Esto transforma el comando ciego en un movimiento espacial comprensible.",
        bold_prefix="Intersección Grafo Vivo - Superación de CLI Anxiety: ",
        bullet=True
    )
    
    add_body_paragraph(
        "La tutoría contextual de Nova IA llena el vacío de los tutoriales pasivos. Cuando un conflicto "
        "ocurre, en lugar de recibir un mensaje genérico de rechazo no-fast-forward, la IA guía la atención de Carlos "
        "hacia los nodos divergentes en el gráfico, propiciando que deduzca por sí mismo por qué los commits del remoto "
        "no coinciden y cómo resolver el conflicto de integración.",
        bold_prefix="Intersección Nova IA - Andamiaje Pedagógico: ",
        bullet=True
    )
    
    # -------------------------------------------------------------
    # 9. SECCIÓN 7: FUENTES CONSULTADAS / REFERENCIAS
    # -------------------------------------------------------------
    doc.add_page_break()
    add_section_heading("7. Fuentes Consultadas y Referencias Bibliográficas", level=1)
    
    references = [
        ("Álvarez, L., Carballo Barrera, Y., Collazos, C., Echenagusía, J., Gutiérrez, R., Hernández Bieliukas, Y., Muñoz, J., Solano, A., y Velázquez, C. (2015). ", 
         "Objetos de Aprendizaje de Contenidos Abiertos Accesibles: del Diseño a la Reutilización. ", 
         "Iniciativa Latinoamericana de Libros de Texto Abiertos (LATIn). Licencia CC BY-SA 3.0."),
        
        ("Caeiro-Rodríguez, M., Costa-Montenegro, E., Díaz-Otero, F., Cuiñas-Gómez, I., Mariño-Espiñeira, P., y Fernández-Iglesias, M. (2016). ",
         "Evaluación de la implantación de la metodología Design Thinking en una asignatura de proyectos. ",
         "Congreso In-Red 2016 UPV. Valencia, España."),
        
        ("Copley, J. (s.f.). ",
         "Learn Git Branching (Simulador interactivo web de ramas y commits). ",
         "Disponible en https://learngitbranching.js.org"),
        
        ("Del Prado, J. (2024). ",
         "Design Thinking, Waterfall, Agile y Lean UX. Cuál usar. ",
         "Uxables Blog."),
        
        ("Díaz-Barriga, F. y Hernández, G. (2002). ",
         "Estrategias Docentes para un Aprendizaje Significativo: una interpretación constructivista. ",
         "McGraw-Hill. México."),
        
        ("Git Project Authors. (s.f.). ",
         "Git - Reference Manual and Documentation. ",
         "Disponible en https://git-scm.com/doc"),
        
        ("Gros, Begoña. (1997). ",
         "Diseño y Programas educativos. Pautas pedagógicas para la elaboración de software. ",
         "Editorial Ariel. España."),
        
        ("Herrera, M. (2006). ",
         "Consideraciones para el diseño didáctico de ambientes virtuales de aprendizaje: Una propuesta basada en las funciones cognitivas del aprendizaje. ",
         "Revista Iberoamericana de Educación, 38(5)."),
        
        ("IBM Cloud Education. (2022). ",
         "Low-Code vs. No-Code: What’s the difference? ",
         "Recuperado de https://www.ibm.com/think/topics/low-code-vs-no-code"),
        
        ("Lodi, M. y Martini, S. (2021). ",
         "Computational Thinking, Between Papert and Wing. ",
         "Science & Education, 30(4), 883-908. DOI: 10.1007/s11191-021-00202-5."),
        
        ("Novak, J. D. y Gowin, D. (1988). ",
         "Aprendiendo a aprender. ",
         "Editorial Martínez Roca. Barcelona, España."),
        
        ("Ospina, M. y Carballo Barrera, Y. (2022). ",
         "Revisión de Técnicas y Tecnologías para la Construcción del Producto Mínimo Viable en el Contexto del Emprendimiento Universitario. ",
         "Novena Conferencia Nacional de Computación, Informática y Sistemas (CoNCISa 2022). Caracas, Venezuela."),
        
        ("Schneiderman, B. y Plaisant, C. (2006). ",
         "Diseño de interfaces de usuario: Estrategias para la interacción persona-computadora. ",
         "4ta Ed. Addison Wesley."),
        
        ("W3C. (2021). ",
         "Resumen de los estándares de accesibilidad de W3C (Web Accessibility Initiative - WAI). ",
         "Recuperado de https://www.w3.org/WAI/standards-guidelines/es"),
        
        ("Woolf, B. P. (2010). ",
         "Building Intelligent Interactive Tutors: Student-centered thinking in/about education. ",
         "Morgan Kaufmann. (Referente para sistemas de tutoría inteligente asistidos por IA).")
    ]
    
    for ref_prefix, ref_italic, ref_suffix in references:
        p = doc.add_paragraph()
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.left_indent = Inches(0.4) # Hanging indent for APA style
        p.paragraph_format.first_line_indent = Inches(-0.4)
        
        run_prefix = p.add_run(ref_prefix)
        run_prefix.font.name = 'Calibri'
        run_prefix.font.size = Pt(10)
        run_prefix.font.color.rgb = COLOR_TEXT
        
        run_italic = p.add_run(ref_italic)
        run_italic.font.name = 'Calibri'
        run_italic.font.size = Pt(10)
        run_italic.font.italic = True
        run_italic.font.color.rgb = COLOR_TEXT
        
        run_suffix = p.add_run(ref_suffix)
        run_suffix.font.name = 'Calibri'
        run_suffix.font.size = Pt(10)
        run_suffix.font.color.rgb = COLOR_TEXT

    # Save the document
    out_dir = "/home/shonny-torres/Workspace/UCV/Semestre I-2026/DRIP/docs/PROYECTO"
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "Entrega_1_Git_Interactivo.docx")
    doc.save(out_path)
    print(f"Report successfully saved to {out_path}")

if __name__ == "__main__":
    create_report()
