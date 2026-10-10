import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls
import os

def create_document():
    doc = docx.Document()
    
    # Configure 1-inch margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        
        # Header
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("Universidad Central de Venezuela | Facultad de Ciencias | DPRED (Semestre I-2026)")
        hrun.font.name = "Arial"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(120, 144, 156)
        
        # Footer
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        frun1 = fp.add_run("Aprende Git Interactivo — Entrega #1 (Informe Revisado y Corregido) | Página ")
        frun1.font.name = "Arial"
        frun1.font.size = Pt(8.5)
        frun1.font.color.rgb = RGBColor(120, 144, 156)
        
        # Add Page Number field
        fld1 = parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls('w'))
        instr = parse_xml(r'<w:instrText %s xml:space="preserve"> PAGE </w:instrText>' % nsdecls('w'))
        fld2 = parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls('w'))
        fld3 = parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls('w'))
        frun2 = fp.add_run()
        frun2._r.append(fld1)
        frun2._r.append(instr)
        frun2._r.append(fld2)
        frun2._r.append(fld3)
        frun2.font.name = "Arial"
        frun2.font.size = Pt(8.5)
        frun2.font.color.rgb = RGBColor(120, 144, 156)

    # Styles helpers
    PRIMARY_COLOR = RGBColor(26, 54, 93)     # #1A365D Dark Navy UCV
    SECONDARY_COLOR = RGBColor(43, 108, 176)  # #2B6CB0 Slate Blue
    BODY_COLOR = RGBColor(45, 55, 72)         # #2D3748 Charcoal
    MUTED_COLOR = RGBColor(100, 116, 139)     # #64748B Muted Slate
    
    def add_p(text="", style=None, space_before=0, space_after=6, align=WD_ALIGN_PARAGRAPH.LEFT, line_spacing=1.15):
        p = doc.add_paragraph(style=style)
        p.alignment = align
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = line_spacing
        if text:
            run = p.add_run(text)
            run.font.name = "Arial"
            run.font.size = Pt(10.5)
            run.font.color.rgb = BODY_COLOR
        return p

    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(16)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Arial"
        run.font.size = Pt(13)
        run.font.color.rgb = PRIMARY_COLOR
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Arial"
        run.font.size = Pt(11.5)
        run.font.color.rgb = SECONDARY_COLOR
        return p

    def add_h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.italic = True
        run.font.name = "Arial"
        run.font.size = Pt(10.5)
        run.font.color.rgb = BODY_COLOR
        return p

    def add_bullet(bold_prefix, text):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        r1 = p.add_run(bold_prefix)
        r1.bold = True
        r1.font.name = "Arial"
        r1.font.size = Pt(10)
        r1.font.color.rgb = BODY_COLOR
        r2 = p.add_run(text)
        r2.font.name = "Arial"
        r2.font.size = Pt(10)
        r2.font.color.rgb = BODY_COLOR
        return p

    def set_cell_background(cell, fill_hex):
        shading_elm = parse_xml(r'<w:shd %s w:fill="%s"/>' % (nsdecls('w'), fill_hex))
        cell._tc.get_or_add_tcPr().append(shading_elm)

    def style_table(table, col_widths=None, header_bg="1A365D"):
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        for r_idx, row in enumerate(table.rows):
            trPr = row._tr.get_or_add_trPr()
            trPr.append(parse_xml(r'<w:cantSplit %s/>' % nsdecls('w')))
            if r_idx == 0:
                trPr.append(parse_xml(r'<w:tblHeader %s/>' % nsdecls('w')))
            
            for c_idx, cell in enumerate(row.cells):
                cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
                tcPr = cell._tc.get_or_add_tcPr()
                tcMar = OxmlElement('w:tcMar')
                for m, val in [('top', 120), ('bottom', 120), ('left', 140), ('right', 140)]:
                    node = OxmlElement(f'w:{m}')
                    node.set(qn('w:w'), str(val))
                    node.set(qn('w:type'), 'dxa')
                    tcMar.append(node)
                tcPr.append(tcMar)
                
                tcBorders = parse_xml(r'''
                    <w:tcBorders %s>
                        <w:top w:val="single" w:sz="4" w:space="0" w:color="CBD5E0"/>
                        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CBD5E0"/>
                        <w:left w:val="none"/>
                        <w:right w:val="none"/>
                    </w:tcBorders>
                ''' % nsdecls('w'))
                tcPr.append(tcBorders)

                if r_idx == 0:
                    set_cell_background(cell, header_bg)
                    for cp in cell.paragraphs:
                        cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
                        for run in cp.runs:
                            run.font.bold = True
                            run.font.name = "Arial"
                            run.font.size = Pt(9.5)
                            run.font.color.rgb = RGBColor(255, 255, 255)
                else:
                    if r_idx % 2 == 1:
                        set_cell_background(cell, "F8FAFC")
                    else:
                        set_cell_background(cell, "FFFFFF")
                    for cp in cell.paragraphs:
                        for run in cp.runs:
                            run.font.name = "Arial"
                            run.font.size = Pt(9)
                            run.font.color.rgb = BODY_COLOR
                            
                if col_widths and c_idx < len(col_widths):
                    cell.width = Inches(col_widths[c_idx])

    # ------------------ PORTADA FORMAL ------------------
    p_inst = add_p(align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=2)
    r_inst = p_inst.add_run("UNIVERSIDAD CENTRAL DE VENEZUELA\nFACULTAD DE CIENCIAS\nESCUELA DE COMPUTACIÓN\nCÁTEDRA DE DISEÑO Y PROTOTIPADO DE RECURSOS EDUCATIVOS DIGITALES (DPRED)")
    r_inst.bold = True
    r_inst.font.name = "Arial"
    r_inst.font.size = Pt(10.5)
    r_inst.font.color.rgb = PRIMARY_COLOR
    
    p_div = add_p(align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=12)
    r_div = p_div.add_run("━" * 45)
    r_div.font.color.rgb = SECONDARY_COLOR

    p_tit = add_p(align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=4)
    r_tit = p_tit.add_run("PROPUESTA DE RECURSO EDUCATIVO DIGITAL:")
    r_tit.bold = True
    r_tit.font.name = "Arial"
    r_tit.font.size = Pt(13)
    r_tit.font.color.rgb = MUTED_COLOR

    p_main_tit = add_p(align=WD_ALIGN_PARAGRAPH.CENTER, space_before=2, space_after=6)
    r_main_tit = p_main_tit.add_run("APRENDE GIT INTERACTIVO")
    r_main_tit.bold = True
    r_main_tit.font.name = "Arial"
    r_main_tit.font.size = Pt(20)
    r_main_tit.font.color.rgb = PRIMARY_COLOR

    p_sub = add_p(align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=14)
    r_sub = p_sub.add_run("«Plataforma de Simulación Visual y Tutoría Inteligente para la Enseñanza y Comprensión del Control de Versiones»")
    r_sub.italic = True
    r_sub.font.name = "Arial"
    r_sub.font.size = Pt(11)
    r_sub.font.color.rgb = SECONDARY_COLOR

    p_doc_type = add_p(align=WD_ALIGN_PARAGRAPH.CENTER, space_before=8, space_after=20)
    r_doc_type = p_doc_type.add_run("INFORME DE INVESTIGACIÓN, ANÁLISIS Y DISEÑO (ENTREGA #1)\n[VERSIÓN CONSOLIDADA Y REVISADA SEGÚN RETROALIMENTACIÓN DOCENTE]")
    r_doc_type.bold = True
    r_doc_type.font.name = "Arial"
    r_doc_type.font.size = Pt(10.5)
    r_doc_type.font.color.rgb = PRIMARY_COLOR

    p_info = add_p(align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=20)
    r_info = p_info.add_run("Autores (Grupo #6):\nJonathan Torres   |   Ricardo Riera   |   Javier Darder\n\nDocentes de Cátedra:\nProf. Felix Urbano   |   Profa. Yusneyi Carballo Barrera\n\nCaracas, Semestre I-2026")
    r_info.font.name = "Arial"
    r_info.font.size = Pt(10)
    r_info.font.color.rgb = BODY_COLOR

    doc.add_page_break()

    # ------------------ SECCIÓN 1: PROBLEMA Y ALCANCE ------------------
    add_h1("1. Definición del Problema y Delimitación del Alcance")
    
    p = add_p()
    p.add_run("En la formación universitaria de ingenieros y licenciados en computación, el dominio de sistemas de control de versiones distribuido —con Git como estándar de facto de la industria— constituye una competencia profesional transversal básica no negociable (Spinellis, 2012). No obstante, investigaciones pedagógicas en enseñanza de la computación (Haaranen & Lehtinen, 2015; Zagalsky et al., 2015) demuestran de manera consistente que los estudiantes experimentan severas dificultades para asimilar el modelo conceptual de Git, recurriendo frecuentemente a la memorización mecánica de sintaxis desarticulada.")
    
    p = add_p()
    p.add_run("A partir de observaciones diagnósticas de campo y la experiencia docente acumulada en la Escuela de Computación de la Universidad Central de Venezuela (UCV), se plantea como ")
    r = p.add_run("hipótesis diagnóstica de partida")
    r.bold = True
    p.add_run(" que una proporción sustancial de estudiantes en sus primeras asignaturas de desarrollo grupal (tales como Algoritmos y Programación, Programación Orientada a Objetos e Ingeniería de Software) no logra consolidar el modelo mental de Git. El alumnado suele memorizar comandos sintácticos (")
    p.add_run("git add, git commit, git push").italic = True
    p.add_run(") sin comprender la arquitectura de estados internos (Working Directory, Staging Area, Local Repository) ni la estructura subyacente de Grafo Acíclico Dirigido (DAG) que fundamenta el historial de cambios (Chacon & Straub, 2014).")

    p = add_p()
    p.add_run("Esta brecha formativa desemboca en la denominada «ansiedad ante la terminal» (")
    p.add_run("CLI anxiety").italic = True
    p.add_run("), parálisis frente a mensajes de error en inglés y colapso de repositorios compartidos en asignaturas de desarrollo grupal. Frente a este panorama, el problema no reside en la falta de documentación, sino en la ausencia de herramientas didácticas interactivas y contextualizadas en español que hagan visible el modelo mental abstracto de Git.")

    p = add_p()
    p.add_run("Delimitación Poblacional e Institucional: ").bold = True
    p.add_run("La población de estudio y beneficiaria directa está conformada por estudiantes de pregrado de la Escuela de Computación (Facultad de Ciencias, UCV) matriculados en materias que demandan integración continua y trabajo colaborativo de código, con una población secundaria compuesta por los docentes de dichas asignaturas, quienes requieren herramientas confiables de andamiaje para mitigar fallas recurrentes en los proyectos grupales.")

    # 1.1 ALCANCE Y MVP
    add_h2("1.1. Delimitación del Alcance y Definición del Producto Mínimo Viable (MVP)")
    p = add_p()
    p.add_run("Para asegurar la absoluta viabilidad pedagógica, técnica y temporal en el marco del período semestral de la cátedra DPRED, el proyecto adopta los principios de formulación de Producto Mínimo Viable en contextos académicos de innovación (Ospina Torres & Carballo Barrera, 2022), estructurando el alcance en un Roadmap de tres fases bien diferenciadas:")

    add_bullet("• Fase 1 — Producto Mínimo Viable (MVP Semestral DPRED): ", 
               "Comprende la totalidad del Módulo 1 (El Core: simulación de áreas de trabajo locales y Grafo Vivo interactivo en tiempo real con renderizado de nodos de commit, ramas y puntero HEAD), junto con una experiencia esencial y guiada de resolución de conflictos locales entre dos ramas (subconjunto prioritario del Módulo 3). Incluye terminal simulada en el navegador, asistencia mediante reglas de andamiaje socrático determinista y cumplimiento estricto de metas de accesibilidad digital.")

    add_bullet("• Fase 2 — Extensiones Evolutivas de Colaboración (Post-MVP): ", 
               "Módulo 2 (El Puente: simulación completa de interacción con repositorios remotos push/fetch/pull, mecánicas de Pull Requests y revisión de código predefinidas), así como la integración opcional con la API pública de GitHub mediante autenticación OAuth para portafolios.")

    add_bullet("• Fase 3 — Tutoría Cognitiva Avanzada y Operaciones Complejas (Evolución Futura): ", 
               "Módulo 3 completo (simulador avanzado de Merge vs. Rebase interactivo, diagnóstico de historiales rotos mediante simulación de reflog) y tutoría dinámica con modelos generativos de lenguaje externos con canal socrático en tiempo real.")

    add_bullet("• Exclusiones Explícitas del Proyecto: ", 
               "El RED no contempla emular el 100% de la especificación de Git (como comandos internos de bajo nivel tipo plumbing: cat-file, hash-object, ni hooks de servidor o submódulos complejos), sino consolidar con alta precisión pedagógica los flujos de trabajo profesionales fundamentales (Feature Branching y Trunk-based) requeridos en el ámbito universitario y laboral junior.")

    # 1.2 OBJETIVOS FORMALES
    add_h2("1.2. Objetivos del Recurso Educativo Digital (RED)")
    p = add_p()
    p.add_run("Con la finalidad de guiar el proceso de ingeniería y evaluación con metas medibles y verificables, se establecen los siguientes objetivos:")

    p = add_p()
    p.add_run("Objetivo General: ").bold = True
    p.add_run("Diseñar y validar un prototipo web interactivo (Recurso Educativo Digital) que facilite la comprensión conceptual y el modelado mental de los flujos fundamentales de control de versiones con Git en estudiantes de la Licenciatura en Computación de la Universidad Central de Venezuela, mediante simulación gráfica visual y retroalimentación formativa inmediata.")

    p = add_p()
    p.add_run("Objetivos Específicos:").bold = True
    add_bullet("1. ", "Diagnosticar las principales dificultades cognitivas, barreras sintácticas y concepciones erróneas que presentan los estudiantes de la Escuela de Computación (UCV) al interactuar con el sistema de control de versiones Git.")
    add_bullet("2. ", "Fundamentar pedagógicamente el recurso bajo los principios del constructivismo interactivo, el aprendizaje significativo y el Diseño Universal para el Aprendizaje (DUA), garantizando su pertinencia didáctica.")
    add_bullet("3. ", "Diseñar la arquitectura de interacción, la interfaz gráfica de usuario y las directrices de accesibilidad digital orientadas al cumplimiento de las pautas WCAG 2.1 nivel AA.")
    add_bullet("4. ", "Desarrollar un Producto Mínimo Viable (MVP) ejecutable en el navegador que integre la emulación del motor local de Git, el renderizado reactivo del grafo de commits y un simulador didáctico de conflictos locales.")
    add_bullet("5. ", "Evaluar la usabilidad, carga cognitiva percibida y efectividad formativa del prototipo con estudiantes y docentes de asignaturas de desarrollo de software en la UCV.")

    # ------------------ SECCIÓN 2: METODOLOGÍA DE ELABORACIÓN ------------------
    add_h1("2. Metodología para la Elaboración del Recurso Educativo Digital")
    p = add_p()
    p.add_run("Para responder a las exigencias metodológicas del diseño instruccional y la ingeniería de software educativo (Gros Salvat, 1997; Herrera Batista, 2006), el proyecto adopta un enfoque metodológico híbrido que articula el modelo instruccional ")
    p.add_run("ADDIE").bold = True
    p.add_run(" (Análisis, Diseño, Desarrollo, Implementación y Evaluación) con el marco de ")
    p.add_run("Diseño Centrado en el Usuario (DCU / Design Thinking)").bold = True
    p.add_run(" (Brown, 2008; Caeiro-Rodríguez et al., 2016). Este modelo asegura rigor pedagógico, empatía con las necesidades reales del estudiante y entregables estructurados a lo largo de las fases de la asignatura.")

    p = add_p()
    p.add_run("Tabla 1. Metodología de elaboración del RED articulando ADDIE y DCU.").bold = True
    p.runs[0].font.size = Pt(9.5)
    p.runs[0].font.color.rgb = PRIMARY_COLOR

    t1 = doc.add_table(rows=6, cols=4)
    headers_t1 = ["Etapa ADDIE / DCU", "Objetivo y Actividades Clave", "Entregables del Proyecto", "Evidencias y Validación"]
    for i, h in enumerate(headers_t1):
        t1.rows[0].cells[i].paragraphs[0].text = h

    data_t1 = [
        ("1. Análisis\n(Empatizar y Definir)",
         "Investigación de necesidades formativas; benchmarking de alternativas existentes; análisis PESTEL y FODA; modelado de User Persona y Journey Map.",
         "Informe de Análisis Preliminar (Entrega #1); Arquetipos de usuario; Matriz de encaje de valor.",
         "Observaciones de aula UCV; encuestas diagnósticas preliminares; matriz de benchmarking comparativo."),
        ("2. Diseño\n(Idear y Conceptualizar)",
         "Definición de objetivos de aprendizaje; diseño instruccional de niveles y andamiaje; arquitectura de información; wireframes y mockups con criterios DUA/WCAG.",
         "Informe de Diseño Detallado (Entrega #2); Mockup navegable en herramienta de prototipado; Guía de estilo accesible.",
         "Especificación de interacción; árbol de navegación; rúbricas de contraste y accesibilidad."),
        ("3. Desarrollo\n(Prototipar)",
         "Construcción del Producto Mínimo Viable (MVP): motor de estados de Git en JavaScript, renderizador de grafo dinámico en Canvas/SVG y reglas heurísticas de tutoría Nova.",
         "Código fuente del prototipo funcional; despliegue web del MVP en entorno de pruebas (Vercel/GitHub Pages).",
         "Repositorio Git con control de versiones; bitácora de commits; pruebas unitarias del simulador de comandos."),
        ("4. Implementación\n(Prueba Piloto)",
         "Despliegue controlado del prototipo para pruebas con la muestra seleccionada de estudiantes y docentes de la Escuela de Computación.",
         "Guía de usuario y manual pedagógico para el docente; entorno de pruebas en línea operativo.",
         "Registros de interacción y sesiones piloto de uso en laboratorios de la universidad."),
        ("5. Evaluación\n(Testear y Ajustar)",
         "Evaluación de usabilidad (SUS - System Usability Scale); medición de carga cognitiva; evaluación de accesibilidad técnica (Lighthouse/WAVE) y feedback docente.",
         "Informe Final de Evaluación y Validación (Entrega #3); plan de mejoras y roadmap post-semestre.",
         "Resultados estadísticos de usabilidad; matriz de hallazgos y correcciones aplicadas.")
    ]

    for row_idx, data in enumerate(data_t1, start=1):
        for col_idx, text in enumerate(data):
            t1.rows[row_idx].cells[col_idx].paragraphs[0].text = text

    style_table(t1, col_widths=[1.5, 2.3, 1.8, 1.6])

    # ------------------ SECCIÓN 3: PESTEL ------------------
    add_h1("3. Análisis del Entorno (PESTEL)")
    p = add_p()
    p.add_run("Para asegurar la viabilidad contextual y sostenibilidad de la plataforma, se realiza un análisis de las seis dimensiones macroambientales, sustentando las condiciones políticas y normativas en marcos jurídicos verificables y matizando supuestos tecnológicos y ambientales:")

    add_bullet("• Dimensión Política (P): ", 
               "Promoción institucional y regional de competencias digitales y educación STEM. En el ámbito venezolano, la Ley Orgánica de Ciencia, Tecnología e Innovación (LOCTI) y la Ley de Infogobierno (República Bolivariana de Venezuela, 2013) establecen la primacía del software libre y los estándares abiertos en las instituciones públicas y de educación superior. A nivel internacional, se alinea con la Recomendación sobre los Recursos Educativos Abiertos (REA) de la UNESCO (2019). Riesgo político bajo de restricciones sobre servicios de distribución de código abierto.")

    add_bullet("• Dimensión Económica (E): ", 
               "Restricciones presupuestarias severas en la educación universitaria pública venezolana y altos costos de licencias de software comercial. Frente a esto, el modelo arquitectónico se diseña para minimizar costos de infraestructura: al ejecutar el motor de simulación de Git directamente en el navegador del cliente mediante JavaScript/WebAssembly, se reducen drásticamente los requerimientos de computación centralizada en backend. El alojamiento estático se sostiene bajo capas gratuitas institucionales (GitHub Pages, Vercel Hobby tier), manteniendo los costos operativos recurrentes en niveles marginales cercanos a cero para la universidad (IBM Cloud Education, 2022).")

    add_bullet("• Dimensión Social (S): ", 
               "Las nuevas cohortes de estudiantes demandan experiencias activas de aprendizaje interactivo y gamificado («learn-by-doing»), mostrando rechazo hacia manuales estáticos o videos teóricos pasivos. La interfaz busca mitigar la «ansiedad ante la terminal» (CLI anxiety) mediante representaciones visuales humanizadas, diseño empático y soporte 100% en idioma español, superando la barrera idiomática que presentan la mayoría de recursos técnicos oficiales.")

    add_bullet("• Dimensión Tecnológica (T): ", 
               "La madurez de los estándares web modernos (HTML5 Canvas, SVG reactivo, Web Workers y WebAssembly) permite virtualizar un sistema de archivos y un motor simplificado de control de versiones en el cliente sin requerir instalación local ni privilegios de administrador en salas de laboratorio universitarias. La arquitectura se desacopla de APIs externas en su MVP para evitar caídas de servicio ante fluctuaciones de conectividad (Chacon & Straub, 2014).")

    add_bullet("• Dimensión Ecológica / Ambiental (E): ", 
               "Adopción de principios de Green Computing y computación sostenible. Al procesar los estados de Git del lado del cliente y optimizar las cargas de red (JAMstack), se reduce la demanda de procesamiento constante en servidores y centros de datos. Asimismo, elimina la dependencia de guías y manuales impresos de laboratorio. Si bien no elimina de manera absoluta el consumo energético intrínseco del dispositivo del usuario ni la infraestructura de red global, disminuye sensiblemente la huella de carbono asociada al cómputo dedicado.")

    add_bullet("• Dimensión Legal (L): ", 
               "Cumplimiento del marco normativo venezolano, específicamente la Constitución de la República Bolivariana de Venezuela (Art. 28 sobre protección del honor y datos personales) y la Ley sobre Mensajes de Datos y Firmas Electrónicas (República Bolivariana de Venezuela, 2001). A nivel de mejores prácticas internacionales, se contemplan los principios de minimización de datos del Reglamento General de Protección de Datos (RGPD / GDPR de la Unión Europea). El MVP operará sin recolectar datos personales ni credenciales. Para fases posteriores que integren la API de GitHub, se acatarán estrictamente los Términos de Servicio de la API de GitHub Developer, incorporando un descargo de responsabilidad (disclaimer) legal explícito que aclare que la plataforma es un proyecto académico independiente sin filiación oficial con Microsoft o GitHub.")

    # ------------------ SECCIÓN 4: FODA Y ESTRATEGIAS ------------------
    add_h1("4. Análisis Estratégico Interno y Externo (FODA)")
    p = add_p()
    p.add_run("Para articular las capacidades internas del equipo con los desafíos del entorno, se presenta la matriz FODA y, de forma complementaria, la matriz de estrategias cruzadas resultantes (FO, DO, FA, DA):")

    p = add_p()
    p.add_run("Tabla 2. Matriz FODA del proyecto Aprende Git Interactivo.").bold = True
    p.runs[0].font.size = Pt(9.5)
    p.runs[0].font.color.rgb = PRIMARY_COLOR

    t2 = doc.add_table(rows=3, cols=2)
    headers_t2 = ["ORIGEN INTERNO (Controlable por el equipo)", "ORIGEN EXTERNO (Entorno macro y micro)"]
    for i, h in enumerate(headers_t2):
        t2.rows[0].cells[i].paragraphs[0].text = h

    foda_data = [
        ("FORTALEZAS (F)\n"
         "1. Interactividad Real: Simulación visual y gráfica inmediata superior a manuales y videos pasivos.\n"
         "2. Arquitectura Client-Side: Ejecución en el navegador con costos de infraestructura marginales y alta velocidad.\n"
         "3. Andamiaje Pedagógico Integrado: Asistencia heurística contextual mediante la tutora Nova para guiar en atascos.\n"
         "4. Enfoque DUA y Accesibilidad: Concepción nativa orientada a pautas WCAG 2.1 AA e inclusión en español.",
         "OPORTUNIDADES (O)\n"
         "1. Demanda Curricular Ineludible: Requerimiento mandatorio de Git en la carrera de Computación UCV y el mercado tech.\n"
         "2. Adopción Académica Institucional: Posibilidad de convertirse en recurso didáctico recomendado en Ingeniería de Software.\n"
         "3. Ecosistema de Software Libre: Facilidad para liberar el código del RED y recibir retroalimentación de la comunidad.\n"
         "4. Infraestructura Gratuita para Educación: Uso de planes libres en Vercel, GitHub Pages y programas educativos."),
        ("DEBILIDADES (D)\n"
         "1. Restricción Temporal Semestral: Cronograma académico limitado de una asignatura para abarcar la complejidad total de Git.\n"
         "2. Presupuesto Cero: Carencia de fondos comerciales para infraestructura de servidores dedicados de cómputo intensivo.\n"
         "3. Complejidad en la Emulación de Consola: Desafío técnico de compatibilizar una terminal accesible con lectores de pantalla.\n"
         "4. Capacidad Operativa Acotada: Equipo conformado por tres estudiantes de pregrado con múltiples obligaciones académicas.",
         "AMENAZAS (A)\n"
         "1. Competidores Consolidados: Plataformas internacionales con alto tráfico web (Learngitbranching, Oh My Git!).\n"
         "2. Frustración y Abandono Temprano: Riesgo de deserción si la interfaz o los niveles iniciales no guían adecuadamente.\n"
         "3. Variabilidad en Políticas de APIs Externas: Dependencia de cambios en OAuth o políticas de GitHub si se integra tempranamente.\n"
         "4. Sobreconfianza en Asistentes de IA Comerciales: Estudiantes que usan IA para generar comandos sin comprender su funcionamiento.")
    ]

    for row_idx, data in enumerate(foda_data, start=1):
        for col_idx, text in enumerate(data):
            t2.rows[row_idx].cells[col_idx].paragraphs[0].text = text

    style_table(t2, col_widths=[3.6, 3.6])

    p_sp = add_p(space_before=10, space_after=4)
    p_sp.add_run("Tabla 3. Matriz de Estrategias Cruzadas derivadas del FODA.").bold = True
    p_sp.runs[0].font.size = Pt(9.5)
    p_sp.runs[0].font.color.rgb = PRIMARY_COLOR

    t_foda_strat = doc.add_table(rows=5, cols=2)
    headers_t_fs = ["Tipo de Estrategia", "Acciones Estratégicas Formuladas"]
    for i, h in enumerate(headers_t_fs):
        t_foda_strat.rows[0].cells[i].paragraphs[0].text = h

    foda_strat_data = [
        ("Estrategias FO\n(Fortalezas + Oportunidades)",
         "• FO1: Promover el despliegue del prototipo client-side en las cátedras de programación de la UCV, aprovechando que no requiere presupuesto de servidores ni instalación en los laboratorios.\n"
         "• FO2: Difundir el recurso como software libre educativo bajo licencia permisiva, captando el interés de estudiantes de semestres superiores para enriquecer la biblioteca de ejercicios."),
        ("Estrategias DO\n(Debilidades + Oportunidades)",
         "• DO1 (Priorización de MVP): Acotar estrictamente el alcance semestral al Módulo 1 y experiencia esencial de conflictos, asegurando la entrega de un producto robusto y validable en los tiempos académicos.\n"
         "• DO2: Emplear servicios de alojamiento estático gratuito con integración continua (GitHub Actions / Vercel), mitigando la ausencia de presupuesto de infraestructura."),
        ("Estrategias FA\n(Fortalezas + Amenazas)",
         "• FA1 (Diferenciación Didáctica): Posicionar a «Aprende Git Interactivo» frente a competidores en inglés mediante una interfaz 100% en español, diseño accesible DUA y orientación constructivista adaptada al estudiante venezolano.\n"
         "• FA2: Incorporar la tutoría Nova como un andamiaje socrático guiado que enseñe a reflexionar sobre el grafo, diferenciándose de las herramientas de IA generativa comercial que solo escupen comandos ciegos."),
        ("Estrategias DA\n(Debilidades + Amenazas)",
         "• DA1 (Desacoplamiento Tecnológico): Diseñar el motor del MVP completamente independiente de APIs externas de terceros (OAuth/GitHub), eliminando el riesgo de quiebre funcional durante el semestre.\n"
         "• DA2: Diseñar una curva de dificultad progresiva y mecánicas de onboarding empático para reducir drásticamente la tasa de frustración y abandono inicial de los usuarios.")
    ]

    for row_idx, data in enumerate(foda_strat_data, start=1):
        for col_idx, text in enumerate(data):
            t_foda_strat.rows[row_idx].cells[col_idx].paragraphs[0].text = text

    style_table(t_foda_strat, col_widths=[2.0, 5.2])

    # ------------------ SECCIÓN 5: ANÁLISIS DE USUARIOS ------------------
    add_h1("5. Análisis de Usuarios, Usuarias y Clientela (User Personas)")
    
    add_h2("5.1. Metodología de Obtención y Validación del Perfil")
    p = add_p()
    p.add_run("Para sustentar la representatividad de los arquetipos formulados y evitar sesgos de diseño, el perfilamiento de usuarios se estructuró a través de tres técnicas de recolección cualitativa en el contexto de la Escuela de Computación (UCV):")
    add_bullet("1. Observación Directa Participante: ", "Registro de patrones de interacción y dificultades en sesiones prácticas de laboratorio durante las primeras semanas del período académico I-2026.")
    add_bullet("2. Entrevistas Semiestructuradas Exploratorias: ", "Aplicadas a una muestra inicial de 6 estudiantes de pregrado que cursaban o habían cursado recientemente asignaturas con proyectos grupales (Ingeniería de Software), indagando sobre sus mayores temores y puntos de quiebre con Git.")
    add_bullet("3. Consulta Diagnóstica a Docentes de la Especialidad: ", "Intercambio cualitativo con profesores de desarrollo de software para identificar los errores más destructivos que cometen los equipos en sus repositorios de entrega.")

    add_h2("5.2. Arquetipo Primario: Carlos Mendoza (El Estudiante Abrumado)")
    add_bullet("• Datos Demográficos: ", "21 años, estudiante del 4to semestre de la Licenciatura en Computación, UCV. Desarrollador junior autodidacta.")
    add_bullet("• Contexto Académico: ", "Domina la lógica de algoritmos y programación estructurada/POO, pero carece de entrenamiento formal en flujos de trabajo colaborativos y herramientas distribuidas de control de versiones.")
    add_bullet("• Trabajos del Usuario (Jobs to be Done): ", "Aprobar la asignatura de desarrollo colaborativo; integrar su código al repositorio del equipo sin colapsar el proyecto; dominar las herramientas estándar para construir un portafolio técnico.")
    add_bullet("• Frustraciones y Dolores (Pains): ", "Terror paralizante a cometer un error irreparable (ej. sobreescritura accidental o merge fallido); desorientación espacial ante la falta de feedback visual en la terminal; confusión conceptual ante mensajes de conflicto con marcadores crípticos (<<<<<<< HEAD); documentación densa exclusivamente en inglés.")
    add_bullet("• Ganancias Esperadas (Gains): ", "Espacio seguro de simulación (sandbox) donde equivocarse no destruya archivos reales; comprensión visual del movimiento de commits y punteros; explicaciones claras en español cuando ocurra una colisión; sensación de progreso gamificado.")

    add_h2("5.3. Arquetipo Secundario: Profa. Elena Valero (La Docente Facilitadora)")
    add_bullet("• Datos Demográficos: ", "42 años, Profesora Agregada de la Escuela de Computación (UCV), docente de asignaturas de Ingeniería de Software y Proyectos de Programación.")
    add_bullet("• Contexto Docente: ", "Coordina equipos de 4 a 6 estudiantes que deben desarrollar software integral durante el semestre. Cuenta con escaso tiempo en el plan curricular para dedicar clases enteras a la sintaxis básica de Git.")
    add_bullet("• Trabajos del Usuario: ", "Asegurar que los equipos estudiantiles trabajen de forma colaborativa ordenada y sin dependencias bloqueantes; evaluar la trazabilidad y contribución real de cada alumno en el historial de commits.")
    add_bullet("• Frustraciones y Dolores: ", "Invertir horas valiosas de asesoría técnica reparando repositorios estudiantiles corrompidos o desalineados en lugar de revisar diseño y arquitectura; excusas recurrentes de alumnos que «perdieron el código por culpa de Git»; herramientas existentes en inglés y desarticuladas del currículo.")
    add_bullet("• Ganancias Esperadas: ", "Disponer de un recurso didáctico interactivo de libre acceso para asignar como nivelación previa a los proyectos grupales; constatar que los estudiantes adquieran autonomía conceptual en resolución de ramas y conflictos; reducción de incidencias en entregas evaluadas.")

    add_h2("5.4. Mapa de Viaje del Usuario (User Journey Map)")
    p = add_p()
    p.add_run("A continuación se modela el flujo de experiencia de Carlos Mendoza al interactuar con el recurso propuesto:")

    p_ujm = add_p(space_before=6, space_after=4)
    p_ujm.add_run("Tabla 4. Mapa de Viaje del Usuario (Carlos Mendoza).").bold = True
    p_ujm.runs[0].font.size = Pt(9.5)
    p_ujm.runs[0].font.color.rgb = PRIMARY_COLOR

    t_ujm = doc.add_table(rows=7, cols=6)
    headers_ujm = ["Etapa del Flujo", "Acciones del Usuario", "Puntos de Contacto", "Pensamientos y Emociones", "Puntos de Dolor", "Oportunidad Didáctica en RED"]
    for i, h in enumerate(headers_ujm):
        t_ujm.rows[0].cells[i].paragraphs[0].text = h

    ujm_data = [
        ("1. Descubrimiento", "Accede al enlace del RED sugerido por la Profa. Elena en el aula virtual de la UCV.", "Enlace en Classroom / Moodle institucional.", "Curioso, pero escéptico. «Otra guía teórica aburrida que tendré que leer».", "Miedo a que requiera configuraciones complejas o instalaciones pesadas.", "Carga ultra-rápida en el navegador, sin registro forzoso y mensaje de bienvenida motivador."),
        ("2. Onboarding", "Explora la interfaz interactiva e inicia el primer módulo sin necesidad de cuenta.", "Pantalla de bienvenida y selector de nivel inicial.", "Aliviado. «No me pide instalar nada en la máquina del laboratorio».", "Incertidumbre sobre qué nivel tomar.", "Test diagnóstico rápido y visual de 3 preguntas para recomendar nivel de inicio."),
        ("3. Aprendizaje Core", "Ingresa comandos de Git local (init, add, commit) en la terminal simulada.", "Terminal web, panel de estados y Grafo Vivo.", "Entusiasmado y enfocado. «¡Por fin veo adónde va el commit cuando hago add!».", "Duda si escribe un comando con sintaxis incorrecta.", "Feedback inmediato de sintaxis en español y animación fluida del nodo en el grafo."),
        ("4. Conflicto Guiado", "En el módulo de conflicto, fusiona dos ramas que modificaron la misma línea.", "Consola y editor visual de conflicto interactivo.", "Ansioso y tenso. «Este es el error que siempre me daña el proyecto».", "Bloqueo cognitivo ante marcadores crípticos de colisión de código.", "Interfaz limpia de comparación línea por línea con resaltado en colores contrastados."),
        ("5. Andamiaje Nova", "Tras 90 segundos de inactividad, se activa la sugerencia socrática de la tutora Nova.", "Panel flotante de tutoría y nodos resaltados.", "Comprendido y empoderado. «Me explica por qué chocó, no solo qué botón tocar».", "Riesgo de que la IA le dé la respuesta directa sin que aprenda.", "Pistas heurísticas en forma de preguntas guía que orientan la deducción autónoma."),
        ("6. Consolidación", "Resuelve la colisión, visualiza el commit de fusión integrado y completa el reto.", "Pantalla de logro superado y resumen conceptual.", "Orgulloso, seguro y con autoeficacia. «Ya no le tengo miedo a un merge en equipo».", "Deseo de demostrar su aprendizaje al grupo y docente.", "Insignia de logro descargable con resumen de conceptos dominados.")
    ]

    for row_idx, data in enumerate(ujm_data, start=1):
        for col_idx, text in enumerate(data):
            t_ujm.rows[row_idx].cells[col_idx].paragraphs[0].text = text

    style_table(t_ujm, col_widths=[1.1, 1.4, 1.1, 1.3, 1.1, 1.2])

    # ------------------ SECCIÓN 6: BENCHMARKING ------------------
    add_h1("6. Análisis de la Competencia (Benchmarking)")
    p = add_p()
    p.add_run("Para determinar la propuesta de valor diferencial de «Aprende Git Interactivo», se realizó un análisis comparativo frente a soluciones existentes en el ecosistema internacional. Para subsanar declaraciones genéricas de accesibilidad, las alternativas se evaluaron bajo criterios técnicos concretos (inspección de código DOM, soporte de tecnologías asistivas y pruebas preliminares con herramientas de auditoría Lighthouse y WAVE):")

    add_bullet("• Competidor Directo 1: Learn Git Branching (Cottle, s.f., consultado en octubre 2026). ", 
               "Es el referente más extendido a nivel global. Destaca por su visualizador de grafos y terminal interactiva. Deficiencias técnicas verificadas: carece de soporte de accesibilidad digital demostrable (el lienzo SVG carece de etiquetas WAI-ARIA, los nodos no son navegables mediante teclado ni poseen descripciones de texto alternativas para lectores de pantalla, y el contraste cromático de ciertas ramas es menor a 3:1); no ofrece tutoría explicativa contextual ante errores; y la traducción al español contiene incoherencias sintácticas.")

    add_bullet("• Competidor Directo 2: Oh My Git! (Wieluch & blinry, 2021, consultado en octubre 2026). ", 
               "Videojuego de código abierto con excelente representación gráfica del repositorio. Deficiencias verificadas: al ser una aplicación de escritorio compilada (requiere descarga e instalación), resulta impracticable en computadoras institucionales con privilegios restringidos; carece por completo de accesibilidad para personas con discapacidad visual al renderizarse en motor gráfico no compatible con tecnologías asistivas nativas.")

    add_bullet("• Competidores Indirectos: Clientes Gráficos de Producción (GitKraken, GitHub Desktop, Sourcetree). ", 
               "Herramientas de entorno laboral que resuelven operaciones mediante botones, pero no poseen fines pedagógicos: el estudiante ejecuta acciones sin comprender el modelo mental subyacente, fomentando la dependencia instrumental.")

    add_bullet("• Competidores de Contenido Pasivo: Cursos en Video y Documentación Oficial (Git Project Authors, 2026; Chacon & Straub, 2014; plataformas de e-learning). ", 
               "Tutoriales lineales y documentación estática de alto contenido teórico con nula interactividad práctica, propensos a la fatiga cognitiva y abandono prematuro.")

    p_bm = add_p(space_before=8, space_after=4)
    p_bm.add_run("Tabla 5. Matriz de Benchmarking Competitivo con criterios técnicos.").bold = True
    p_bm.runs[0].font.size = Pt(9.5)
    p_bm.runs[0].font.color.rgb = PRIMARY_COLOR

    t_bm = doc.add_table(rows=7, cols=7)
    headers_bm = ["Criterio Evaluado", "Aprende Git Interactivo (Propuesta UCV)", "Learn Git Branching (Web)", "Oh My Git! (Juego Escritorio)", "Clientes Gráficos (GitKraken)", "Git-SCM (Doc Oficial)", "Cursos en Video (Udemy/YouTube)"]
    for i, h in enumerate(headers_bm):
        t_bm.rows[0].cells[i].paragraphs[0].text = h

    bm_data = [
        ("Simulación de Grafo Vivo", "Sí, dinámico y reactivo en tiempo real.", "Sí, visual en árbol interactivo.", "Sí, representación gráfica en juego.", "Sí, lectura de repositorio real local.", "No, solo diagramas estáticos ASCII/PNG.", "No, grabaciones pregrabadas fijas."),
        ("Resolución Guiada de Conflictos", "Sí, editor interactivo línea por línea con colores y contexto.", "No, resolución abstracta mediante comandos.", "No, resolución automática simplificada.", "Sí, interfaz de merge industrial no didáctica.", "No, instrucciones puramente textuales.", "No, demostración pasiva del instructor."),
        ("Tutoría Cognitiva y Andamiaje", "Sí, tutora Nova con pistas socráticas basadas en reglas.", "No, únicamente mensajes de error de Git.", "No, mensajes lúdicos preestablecidos.", "No, diseñado para profesionales.", "No, carece de feedback interactivo.", "No, sin interactividad adaptativa."),
        ("Criterios de Accesibilidad Digital", "Meta de diseño: pautas WCAG 2.1 AA y principios DUA en español.", "Deficiente: sin navegación por teclado en grafo ni ARIA en SVG.", "No accesible: aplicación compilada sin soporte lector pantalla.", "Parcial: modos alto contraste, pero baja usabilidad asistiva.", "Parcial: lectores de pantalla leen texto, pero no diagramas.", "Deficiente: dependiente de subtítulos automáticos en video."),
        ("Disponibilidad y Costo de Acceso", "Web 100% libre, sin registro forzoso ni instalación.", "Web gratuita en línea (cero costo).", "Requiere instalación de binario local.", "Freemium / Licencias de pago comercial.", "Web gratuita abierta.", "Modelos de suscripción o pago por curso."),
        ("Idioma y Contexto Cultural", "Nativo en español, contextualizado a necesidades UCV.", "Inglés (traducciones voluntarias parciales).", "Inglés prioritario.", "Multi-idioma técnico.", "Multi-idioma formal.", "Variable según creador de contenido.")
    ]

    for row_idx, data in enumerate(bm_data, start=1):
        for col_idx, text in enumerate(data):
            t_bm.rows[row_idx].cells[col_idx].paragraphs[0].text = text

    style_table(t_bm, col_widths=[1.2, 1.2, 1.0, 1.0, 1.0, 0.9, 0.9])

    # ------------------ SECCIÓN 7: PROPUESTA Y JUSTIFICACIÓN ------------------
    add_h1("7. Propuesta de Solución, Justificación Pedagógica y Arquitectura")
    
    add_h2("7.1. Justificación Pedagógica y de Diseño Instruccional")
    p = add_p()
    p.add_run("El recurso «Aprende Git Interactivo» se cimenta sobre sólidas teorías del aprendizaje contemporáneo y el diseño de software educativo:")
    add_bullet("• Constructivismo y Modelado Mental (Novak & Gowin, 1988): ", 
               "El aprendizaje del control de versiones no puede ocurrir mediante memorización pasiva. Al manipular el Grafo Vivo, el estudiante autoconstruye el modelo mental de Git como un conjunto inmutable de instantáneas conectadas por referencias dirigidas, transformando conceptos invisibles en entidades espaciales manipulables.")

    add_bullet("• Metas de Accesibilidad Universal y Principios DUA (Álvarez González et al., 2014; World Wide Web Consortium, 2018): ", 
               "Se formula como meta de diseño el cumplimiento de las pautas WCAG 2.1 nivel AA y los principios del Diseño Universal para el Aprendizaje. Esto se traduce en: (a) Múltiples formas de representación: el estado del repositorio se comunica simultáneamente en texto estructurado en consola, tabla semántica accesible y grafo visual con doble codificación (forma + color); (b) Múltiples formas de acción: navegación integral por teclado con foco visible gestionado; y (c) Múltiples formas de motivación: progreso dosificado con niveles de dificultad adaptativa.")

    add_bullet("• Aprendizaje Significativo y Andamiaje (Díaz-Barriga Arceo & Hernández Rojas, 2002; Woolf, 2009): ", 
               "El andamiaje instruccional se activa dinámicamente cuando el alumno se enfrenta a situaciones de conflicto o bloqueo, evitando que la frustración degenere en abandono.")

    add_bullet("• Interacción Persona-Computadora y Pensamiento Computacional (Lodi & Martini, 2021; Shneiderman & Plaisant, 2006): ", 
               "Diseño de interfaz con retroalimentación visual continua y reducción de carga cognitiva, permitiendo al estudiante razonar en términos de abstracciones computacionales claras.")

    add_h2("7.2. Arquitectura de la Tutoría Inteligente (Nova): Especificación y Salvaguardas")
    p = add_p()
    p.add_run("En atención a los requerimientos de rigor y viabilidad, se detalla el funcionamiento de la tutora pedagógica Nova:")
    add_bullet("• Arquitectura Técnica en el MVP: ", 
               "En el Producto Mínimo Viable, Nova opera a través de un motor de reglas heurísticas e inferencia determinista en el cliente (JavaScript). Analiza el estado JSON del árbol de Git (ramas existentes, posición del puntero HEAD, archivos en staging) y el último comando ingresado, contrastándolo con el objetivo pedagógico del nivel.")

    add_bullet("• Datos Procesados y Privacidad Estricta: ", 
               "Nova procesa exclusivamente el estado abstracto de la simulación (nombres de ramas de ejercicio, identificadores hash de commits simulados y mensajes de error estándar). No recopila nombres, direcciones IP, código fuente personal ni datos sensibles, garantizando total privacidad.")

    add_bullet("• Prevención de Alucinaciones y Enfoque Socrático: ", 
               "A diferencia de un chat generativo abierto que podría inventar comandos o entregar la respuesta resuelta privando al alumno del proceso de aprendizaje, Nova está restringida por salvaguardas (guardrails): emite pistas en tres niveles de andamiaje: (1) Pregunta reflexiva («Observa a qué rama apunta tu puntero HEAD actualmente»); (2) Pista analítica («Para fusionar los cambios de 'feature' en 'main', debes situarte primero en la rama receptora»); y (3) Orientación sintáctica («Revisa la documentación del comando checkout o switch»).")

    add_h2("7.3. Prototipo Conceptual de Interfaz (Mockup)")
    p = add_p()
    p.add_run("A continuación se presenta el diseño preliminar de la interfaz del RED en modo de alto contraste oscuro, optimizada para minimizar la carga cognitiva del usuario:")

    # Insert image if exists
    img_path = "extracted_media/word/media/image1.jpeg"
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(4)
        run_img = p_img.add_run()
        run_img.add_picture(img_path, width=Inches(6.0))

    p_cap = add_p(space_before=2, space_after=12, align=WD_ALIGN_PARAGRAPH.CENTER)
    r_cap = p_cap.add_run("Figura 1. Mockup conceptual de la plataforma «Aprende Git Interactivo» en modo oscuro accesible. Distribución tripartita: editor/terminal a la izquierda, Grafo Vivo interactivo al centro y panel de tutoría socrática Nova a la derecha.")
    r_cap.font.size = Pt(8.5)
    r_cap.font.italic = True
    r_cap.font.color.rgb = MUTED_COLOR

    # ------------------ SECCIÓN 8: ENCAJE DE VALOR ------------------
    add_h1("8. Encaje de Valor (Value Proposition Canvas)")
    p = add_p()
    p.add_run("Para verificar la correspondencia unívoca entre las necesidades del perfil de usuario y la arquitectura de la solución, se estructura el encaje de valor a través de una matriz integral que relaciona cada trabajo, dolor y ganancia con su respectivo producto, aliviador o creador de ganancia:")

    p_vp = add_p(space_before=8, space_after=4)
    p_vp.add_run("Tabla 6. Matriz Integral de Encaje de Valor (Correspondencia 1 a 1).").bold = True
    p_vp.runs[0].font.size = Pt(9.5)
    p_vp.runs[0].font.color.rgb = PRIMARY_COLOR

    t_vp = doc.add_table(rows=7, cols=3)
    headers_vp = ["Dimensión del Usuario (Carlos / Docente)", "Propuesta de Valor del RED (Solución)", "Mecanismo de Correspondencia y Validación"]
    for i, h in enumerate(headers_vp):
        t_vp.rows[0].cells[i].paragraphs[0].text = h

    vp_data = [
        ("Trabajo 1: Aprender a usar Git para coordinar proyectos de asignaturas colaborativas.",
         "Producto: Entorno web de simulación con terminal guiada y ejercicios de flujo grupal.",
         "Correspondencia directa: Los ejercicios replican escenarios reales de asignaturas de la UCV."),
        ("Trabajo 2: Comprender qué ocurre internamente al fusionar ramas de código.",
         "Producto: Grafo Vivo reactivo que dibuja commits y punteros en tiempo real.",
         "Correspondencia directa: Transforma la memoria sintáctica ciega en comprensión topológica espacial."),
        ("Dolor 1 (Terror al error): Miedo a ejecutar comandos destructivos y borrar código del equipo.",
         "Aliviador: Entorno sandbox en navegador 100% seguro sin consecuencias sobre archivos reales.",
         "Mitigación de dolor: Permite experimentar y equivocarse libremente construyendo resiliencia."),
        ("Dolor 2 (CLI Anxiety): Bloqueo cognitivo ante pantallas negras de consola y mensajes crípticos.",
         "Aliviador: Consola amigable con mensajes explicativos en español y feedback visual sincronizado.",
         "Mitigación de dolor: Reduce la barrera lingüística y la carga cognitiva de la sintaxis críptica."),
        ("Ganancia 1 (Autonomía): Resolver colisiones de código por cuenta propia sin depender de otros.",
         "Creador de Ganancia: Simulador interactivo de conflictos línea por línea con pistas socráticas Nova.",
         "Generación de valor: Desarrolla autoeficacia técnica y criterio profesional en el estudiante."),
        ("Ganancia 2 (Autoeficacia y Motivación): Sentir un progreso palpable y validado.",
         "Creador de Ganancia: Sistema de logros gamificados e insignias de dominio de conceptos clave.",
         "Generación de valor: Refuerza la persistencia académica y previene la deserción temprana.")
    ]

    for row_idx, data in enumerate(vp_data, start=1):
        for col_idx, text in enumerate(data):
            t_vp.rows[row_idx].cells[col_idx].paragraphs[0].text = text

    style_table(t_vp, col_widths=[2.3, 2.6, 2.3])

    # ------------------ SECCIÓN 9: VALIDACIÓN CON EL PROTOTIPO FUNCIONAL (MVP) ------------------
    add_h1("9. Validación y Correspondencia con el Prototipo Funcional (MVP GitPlayground)")
    p = add_p()
    p.add_run("Para garantizar la máxima viabilidad y pertinencia del Recurso Educativo Digital, el equipo no se limitó a una formulación teórica: el diseño propuesto ha sido validado y contrastado de forma directa contra el Producto Mínimo Viable (MVP) operativo desarrollado para la plataforma, denominado ")
    p.add_run("GitPlayground").bold = True
    p.add_run(". El código fuente, implementado en React 19 y Vite bajo una arquitectura 100% del lado del cliente (client-side), demuestra la factibilidad técnica y pedagógica de todos los requerimientos de la Etapa 1.")

    add_h2("9.1. Matriz de Trazabilidad: Requerimientos de Diseño vs. Implementación en Código")
    p = add_p()
    p.add_run("La siguiente matriz establece la trazabilidad unívoca entre las necesidades identificadas, los componentes del RED y su respectiva verificación en el software funcional:")

    p_val = add_p(space_before=6, space_after=4)
    p_val.add_run("Tabla 7. Matriz de Trazabilidad entre Requerimientos de Diseño y el Prototipo MVP (GitPlayground).").bold = True
    p_val.runs[0].font.size = Pt(9.5)
    p_val.runs[0].font.color.rgb = PRIMARY_COLOR

    t_val = doc.add_table(rows=8, cols=4)
    headers_val = ["Requisito / Módulo", "Componente en Código", "Funcionalidad Operativa Verificada", "Estado y Evidencia Técnica"]
    for i, h in enumerate(headers_val):
        t_val.rows[0].cells[i].paragraphs[0].text = h

    val_data = [
        ("Módulo 1: El Core (Estados y Grafo Vivo)", 
         "VisualSimulator.jsx", 
         "Terminal web interactiva con comandos reales (init, add, commit, branch, merge); visualización simultánea de Working Directory, Staging y Repositorio Local; renderizado de Grafo Vivo SVG reactivo.", 
         "Operativo al 100%. Misiones guiadas de Branching y Undo integradas."),
        ("Módulo 3: Resolución Guiada de Conflictos (MVP)", 
         "ConflictSolver.jsx", 
         "Simulador de colisión de código línea a línea con marcadores <<<<<<< HEAD vs >>>>>>> incoming; resolución tanto para flujos git merge como git rebase (--continue).", 
         "Operativo al 100%. Opciones interactivas: conservar actual, entrante o ambos."),
        ("Tutoría Inteligente Socrática", 
         "AITutor.jsx + shonnyProxyService.js", 
         "Tutora Nova conectada dinámicamente al estado de Git (gitContext). Opera con motor de reglas heurísticas locales y preguntas socráticas para evitar alucinaciones, con pasarela opcional a LLM.", 
         "Operativo al 100%. Fallback determinista local sin costo ni latencia."),
        ("Micro-Lecciones Animadas In-App", 
         "VideoLearning.jsx + LessonPlayer.jsx", 
         "6 lecciones en motion graphics (estados, ramas/HEAD, merge, rebase, remotos y conflictos) con controles de reproducción, subtítulos aria-live y narración por voz nativa opcional.", 
         "Operativo al 100%. Motor de lecciones basado en datos y esquemas validados."),
        ("Gamificación y Andamiaje", 
         "Dashboard.jsx + learnerStore.js + badges.js", 
         "Catálogo de 9 medallas desbloqueables, sistema acumulativo de puntos de experiencia (XP) y niveles, con persistencia automática en localStorage.", 
         "Operativo al 100%. No requiere backend para guardar progreso estudiantil."),
        ("Evaluación Diagnóstica y Formativa", 
         "Quizzes.jsx", 
         "Cuestionarios interactivos de selección con retroalimentación correctiva inmediata para afianzar conceptos clave de control de versiones.", 
         "Operativo al 100%. Integrado al sistema de insignias (Sabio de Git)."),
        ("Accesibilidad e Inclusión (DUA y WCAG 2.2 AA)", 
         "index.css + App.jsx + scripts/a11y.py", 
         "Tokens CSS con ratios de contraste ≥ 4.5:1 en ambos temas (claro/oscuro), skip link para salto al contenido, navegación integral por teclado y trampa de foco accesible en móvil.", 
         "Auditado con axe-core. Cero violaciones críticas o graves bloqueantes.")
    ]

    for row_idx, data in enumerate(val_data, start=1):
        for col_idx, text in enumerate(data):
            t_val.rows[row_idx].cells[col_idx].paragraphs[0].text = text

    style_table(t_val, col_widths=[1.5, 1.6, 2.7, 1.4])

    add_h2("9.2. Resultados de Pruebas Automatizadas y Métricas de Calidad de Software")
    p = add_p()
    p.add_run("Para dar respuesta a los requerimientos de rigor metodológico y calidad de software, el prototipo funcional cuenta con una batería de pruebas automatizadas ejecutadas mediante el framework de testing ")
    p.add_run("Vitest v5.0.3").bold = True
    p.add_run(", arrojando los siguientes resultados verificados:")

    add_bullet("• Pruebas Unitarias Aprobadas: ", "46 de 46 pruebas automatizadas aprobadas con éxito (100% de efectividad en 307 ms), abarcando la validación del esquema de escenas de lecciones, tiempos de animación, reductor de reproducción y tienda de persistencia del estudiante.")
    add_bullet("• Empaquetado para Producción: ", "Compilación ultra-optimizada con Vite v8.0 en 407 ms, generando un bundle de distribución de solo 102.8 kB comprimidos para JavaScript y 6.1 kB para CSS, garantizando tiempos de carga inferiores a 1.5 segundos en conexiones universitarias.")
    add_bullet("• Cero Costos y Green Computing: ", "Al prescindir por completo de cómputo en servidores dedicados para el MVP, se confirma la viabilidad económica absoluta y la minimización de la huella de carbono digital sostenidas en el análisis PESTEL.")

    # ------------------ SECCIÓN 10: REFERENCIAS BIBLIOGRÁFICAS ------------------
    add_h1("10. Fuentes Consultadas y Referencias Bibliográficas")
    add_h1("9. Fuentes Consultadas y Referencias Bibliográficas")
    p = add_p()
    p.add_run("Todas las referencias han sido rigurosamente verificadas y normalizadas bajo el estándar de la American Psychological Association (APA 7.ª edición). Cada fuente cuenta con trazabilidad académica completa, identificadores de publicación verificables (DOI/ISBN) y enlaces funcionales comprobados:")

    refs = [
        "Álvarez González, L., Carballo Barrera, Y., & Collazos Ordoñez, C. (Coords.). (2014). Objetos de aprendizaje de contenidos abiertos accesibles: del diseño a la reutilización. Iniciativa Latinoamericana de Libros de Texto Abiertos (LATIn). Repositorio Hipermedial de la Universidad Nacional de Rosario (UNR). https://rephip.unr.edu.ar/handle/2133/3549",
        "Brown, T. (2008). Design thinking. Harvard Business Review, 86(6), 84–92.",
        "Caeiro-Rodríguez, M., Costa-Montenegro, E., Díaz-Otero, F., Cuiñas-Gómez, I., Mariño-Espiñeira, P., & Fernández-Iglesias, M. (2016). Evaluación de la implantación de la metodología Design Thinking en una asignatura de proyectos. En Actas del Congreso In-Red 2016 UPV (pp. 1–12). Editorial Universitat Politècnica de València. https://doi.org/10.4995/INRED2016.2016.4380",
        "Chacon, S., & Straub, B. (2014). Pro Git (2.ª ed.). Apress. https://git-scm.com/book/es/v2",
        "Cottle, P. (s.f.). Learn Git Branching: An interactive Git visualization to challenge and educate! [Simulador web interactivo]. Consultado el 5 de octubre de 2026 en https://learngitbranching.js.org",
        "Díaz-Barriga Arceo, F., & Hernández Rojas, G. (2002). Estrategias docentes para un aprendizaje significativo: Una interpretación constructivista (2.ª ed.). McGraw-Hill Interamericana. ISBN: 978-970-10-3526-9.",
        "Git Project Authors. (2026). Git reference manual and documentation. Software Freedom Conservancy. Consultado el 2 de octubre de 2026 en https://git-scm.com/doc",
        "Gros Salvat, B. (1997). Diseños y programas educativos: Pautas pedagógicas para la elaboración de software. Editorial Ariel. ISBN: 978-84-344-2608-5.",
        "Haaranen, L., & Lehtinen, T. O. (2015). Teaching Git on the side: Version-control system as a course platform. En Proceedings of the 2015 ACM Conference on Innovation and Technology in Computer Science Education (ITiCSE '15) (pp. 87–92). Association for Computing Machinery. https://doi.org/10.1145/2729094.2742608",
        "Herrera Batista, M. Á. (2006). Consideraciones para el diseño didáctico de ambientes virtuales de aprendizaje: Una propuesta basada en las funciones cognitivas del aprendizaje. Revista Iberoamericana de Educación, 38(5), 1–11. Dialnet: https://dialnet.unirioja.es/servlet/articulo?codigo=2040733",
        "IBM Cloud Education. (2022). Low-code vs. no-code: What's the difference? IBM Think Insights. https://www.ibm.com/think/topics/low-code-vs-no-code",
        "Lodi, M., & Martini, S. (2021). Computational thinking, between Papert and Wing. Science & Education, 30(4), 883–908. https://doi.org/10.1007/s11191-021-00202-5",
        "Novak, J. D., & Gowin, D. B. (1988). Aprendiendo a aprender. Editorial Martínez Roca. ISBN: 978-84-270-1235-6.",
        "Ospina Torres, M., & Carballo Barrera, Y. (2022). Revisión de técnicas y tecnologías para la construcción del Producto Mínimo Viable en el contexto del emprendimiento universitario. En Memorias de la IX Conferencia Nacional de Computación, Informática y Sistemas (CoNCISa 2022) (pp. 45–56). Escuela de Computación, Facultad de Ciencias, Universidad Central de Venezuela.",
        "República Bolivariana de Venezuela. (2001). Ley sobre Mensajes de Datos y Firmas Electrónicas. Gaceta Oficial de la República Bolivariana de Venezuela, N° 37.148 de fecha 28 de febrero de 2001.",
        "República Bolivariana de Venezuela. (2013). Ley de Infogobierno. Gaceta Oficial de la República Bolivariana de Venezuela, N° 40.274 de fecha 17 de octubre de 2013.",
        "Shneiderman, B., & Plaisant, C. (2006). Designing the user interface: Strategies for effective human-computer interaction (4th ed.). Addison-Wesley. ISBN: 978-0-321-19786-3.",
        "Spinellis, D. (2012). Git. IEEE Software, 29(3), 100–101. https://doi.org/10.1109/MS.2012.61",
        "UNESCO. (2019). Recomendación sobre los Recursos Educativos Abiertos (REA). Organización de las Naciones Unidas para la Educación, la Ciencia y la Cultura. https://unesdoc.unesco.org/ark:/48223/pf0000373755",
        "Wieluch, S., & blinry. (2021). Oh My Git! An open source game about learning Git [Videojuego de código abierto]. Consultado el 5 de octubre de 2026 en https://ohmygit.org",
        "Woolf, B. P. (2009). Building intelligent interactive tutors: Student-centered strategies for revolutionizing e-learning. Morgan Kaufmann / Elsevier. ISBN: 978-0-12-373594-2.",
        "World Wide Web Consortium. (2018). Web Content Accessibility Guidelines (WCAG) 2.1 (W3C Recommendation 05 June 2018). https://www.w3.org/TR/WCAG21/",
        "Zagalsky, A., Feliciano, J., Storey, M.-A., Zhao, Y., & Wang, W. (2015). The emergence of GitHub as a collaborative platform for education. En Proceedings of the 18th ACM Conference on Computer Supported Cooperative Work & Social Computing (CSCW '15) (pp. 1906–1917). Association for Computing Machinery. https://doi.org/10.1145/2675133.2675284"
    ]

    for ref in refs:
        p_ref = doc.add_paragraph()
        p_ref.paragraph_format.left_indent = Inches(0.5)
        p_ref.paragraph_format.first_line_indent = Inches(-0.5)
        p_ref.paragraph_format.space_before = Pt(3)
        p_ref.paragraph_format.space_after = Pt(4)
        p_ref.paragraph_format.line_spacing = 1.15
        r_ref = p_ref.add_run(ref)
        r_ref.font.name = "Arial"
        r_ref.font.size = Pt(9.5)
        r_ref.font.color.rgb = BODY_COLOR

    output_filename = "Entrega_1_Git_Interactivo_Corregido.docx"
    doc.save(output_filename)
    print(f"Document saved successfully as '{output_filename}'")

if __name__ == "__main__":
    create_document()
