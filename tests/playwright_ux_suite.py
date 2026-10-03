#!/usr/bin/env python3
"""
Playwright Automated UX & E2E Test Suite for GitPlayground (DRIP - UCV)
Follows software-project-standards (Arrange - Act - Assert / TUC)
"""

import os
import subprocess
import sys
import time
from playwright.sync_api import sync_playwright, expect

HERE = os.path.dirname(os.path.abspath(__file__))
SCREENSHOTS_DIR = os.path.join(HERE, "screenshots")
BASE_URL = os.environ.get("BASE_URL", "http://127.0.0.1:4173")
TABS = ["dashboard", "videolearning", "simulator", "github", "conflicts", "quizzes"]

os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

def log_step(name, status="OK"):
    icons = {"OK": "✅", "WARN": "⚠️", "FAIL": "❌", "INFO": "ℹ️"}
    print(f"{icons.get(status, '•')} [{status}] {name}", flush=True)

def run_test_suite():
    results = {
        "passed": 0,
        "failed": 0,
        "tests": []
    }

    print("\n" + "="*70)
    print("🚀 INICIANDO SUITE DE PRUEBAS PLAYWRIGHT UX & E2E — GITPLAYGROUND")
    print("="*70 + "\n")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()
        # Un build puede pasar y aun así dejar la app en blanco por un error en tiempo de ejecución.
        page_errors = []

        def watch(pg):
            pg.on("pageerror", lambda err: page_errors.append(str(err)))
            return pg

        watch(page)

        # -------------------------------------------------------------------
        # TUC-UX-01: Carga Inicial & Dashboard Navigation
        # -------------------------------------------------------------------
        test_name = "TUC-UX-01: Landing, Dashboard & Perfil Gamificado"
        try:
            start_time = time.time()
            page.goto(BASE_URL, wait_until="networkidle")
            
            # Assert Page Title
            expect(page).to_have_title("GitPlayground - Aprende Git y GitHub de Forma Visual e Interactiva")
            
            # Assert HUD Elements in Sidebar
            expect(page.locator("#sidebar-container")).to_be_visible()
            expect(page.locator("#sidebar-container").get_by_text("Novato").first).to_be_visible()
            
            # Screenshot evidence
            screenshot_path = os.path.join(SCREENSHOTS_DIR, "01_dashboard_landing.png")
            page.screenshot(path=screenshot_path)
            
            duration = round((time.time() - start_time) * 1000, 1)
            log_step(f"{test_name} ({duration}ms)")
            results["passed"] += 1
            results["tests"].append({"name": test_name, "status": "PASSED", "duration_ms": duration, "evidence": screenshot_path})
        except Exception as e:
            log_step(f"{test_name} — Error: {str(e)}", "FAIL")
            results["failed"] += 1
            results["tests"].append({"name": test_name, "status": "FAILED", "error": str(e)})

        # -------------------------------------------------------------------
        # TUC-UX-02: Videoteca Interactiva & Puente de Práctica Dual
        # -------------------------------------------------------------------
        test_name = "TUC-UX-02: Lecciones Animadas, Temario & Salto al Simulador"
        try:
            start_time = time.time()
            page.click("#nav-btn-videolearning")
            page.wait_for_selector("text=Temario (6 lecciones)", timeout=5000)
            
            # Lección 1 seleccionada, con su póster y sus comandos
            expect(page.locator("#lesson-title")).to_have_text("Los tres estados de Git")
            expect(page.locator(".lesson-poster")).to_be_visible()
            expect(page.locator(".library-commands code", has_text="git init")).to_be_visible()
            
            # Seleccionar la lección 2 desde el temario
            page.click("#playlist-item-ramas-head")
            expect(page.locator("#lesson-title")).to_have_text("Ramas y HEAD")
            
            # Screenshot evidence
            screenshot_path = os.path.join(SCREENSHOTS_DIR, "02_videolearning_and_bridge.png")
            page.screenshot(path=screenshot_path)
            
            # Ejecutar salto a la práctica
            practice_btn = page.locator("#btn-practice-current-lesson")
            expect(practice_btn).to_be_visible()
            practice_btn.click()
            
            # Verificar transición exitosa al simulador
            expect(page.locator("#visual-simulator-root")).to_be_visible()
            
            duration = round((time.time() - start_time) * 1000, 1)
            log_step(f"{test_name} ({duration}ms)")
            results["passed"] += 1
            results["tests"].append({"name": test_name, "status": "PASSED", "duration_ms": duration, "evidence": screenshot_path})
        except Exception as e:
            log_step(f"{test_name} — Error: {str(e)}", "FAIL")
            results["failed"] += 1
            results["tests"].append({"name": test_name, "status": "FAILED", "error": str(e)})

        # -------------------------------------------------------------------
        # TUC-UX-03: Simulador Core, SVG A11y, Ramas Apiladas & Historial
        # -------------------------------------------------------------------
        test_name = "TUC-UX-03: Terminal, Historial con Flechas, SVG A11y & Ramas Apiladas"
        try:
            start_time = time.time()
            input_el = page.locator("#terminal-user-input")
            
            # 1. Ejecutar git init
            input_el.fill("git init")
            input_el.press("Enter")
            page.wait_for_selector("text=Initialized empty Git repository", timeout=5000)
            
            # 2. Modificar README para generar cambios en Working Directory
            page.click("#btn-modify-readme")
            time.sleep(0.3)
            
            # 3. git add .
            input_el.fill("git add .")
            input_el.press("Enter")
            time.sleep(0.3)
            
            # 4. git commit -m "Commit 1"
            input_el.fill('git commit -m "Mi primer commit"')
            input_el.press("Enter")
            time.sleep(0.3)
            
            # 5. Probar Historial de Comandos con Flecha Arriba
            input_el.click()
            input_el.press("ArrowUp")
            val = input_el.input_value()
            assert 'git commit -m "Mi primer commit"' in val, f"Historial ArrowUp falló, valor recibido: '{val}'"
            
            # 6. Crear rama feature/login para probar apilado vertical en SVG
            input_el.fill("git branch feature/login")
            input_el.press("Enter")
            time.sleep(0.4)
            
            # Verificar que ambas ramas existen en el SVG
            expect(page.locator("text=* main").first).to_be_visible()
            expect(page.locator("text=feature/login").first).to_be_visible()
            
            # Verificar accesibilidad en nodos SVG (tabIndex y role="button")
            commit_node = page.locator("g.graph-node").first
            expect(commit_node).to_have_attribute("role", "button")
            expect(commit_node).to_have_attribute("tabindex", "0")
            
            screenshot_path = os.path.join(SCREENSHOTS_DIR, "03_simulator_branches_and_history.png")
            page.screenshot(path=screenshot_path)
            
            duration = round((time.time() - start_time) * 1000, 1)
            log_step(f"{test_name} ({duration}ms)")
            results["passed"] += 1
            results["tests"].append({"name": test_name, "status": "PASSED", "duration_ms": duration, "evidence": screenshot_path})
        except Exception as e:
            log_step(f"{test_name} — Error: {str(e)}", "FAIL")
            results["failed"] += 1
            results["tests"].append({"name": test_name, "status": "FAILED", "error": str(e)})

        # -------------------------------------------------------------------
        # TUC-UX-04: Tutor Nova, Modal ShonnyProxy & Pregunta Pedagógica
        # -------------------------------------------------------------------
        test_name = "TUC-UX-04: Nova AI Tutor, Modal ShonnyProxy & Feedback Socrático"
        try:
            start_time = time.time()
            
            # Si el chat no está abierto, abrirlo mediante el toggle
            if not page.locator("text=Nova AI Tutor").is_visible():
                page.click("#btn-tutor-toggle")
            
            expect(page.locator("text=Nova AI Tutor").first).to_be_visible()
            
            # Abrir modal de configuración de ShonnyProxy
            settings_btn = page.locator("button[title='Configuración de ShonnyProxy LLM']")
            expect(settings_btn).to_be_visible()
            settings_btn.click()
            expect(page.locator("text=Configuración de ShonnyProxy").first).to_be_visible()
            expect(page.locator("#proxy-endpoint-input")).to_be_visible()
            expect(page.locator("#proxy-model-input")).to_be_visible()
            
            # Cerrar modal de configuración
            settings_btn.click()
            
            # Enviar mensaje interactivo a Nova
            tutor_input = page.locator("#tutor-chat-input")
            tutor_input.fill("¿Qué es el área de staging?")
            page.click("#btn-tutor-send")
            
            # Esperar respuesta pedagógica del tutor
            page.wait_for_selector(".tutor-msg.bot", timeout=6000)
            
            screenshot_path = os.path.join(SCREENSHOTS_DIR, "04_ai_tutor_interaction.png")
            page.screenshot(path=screenshot_path)
            
            # Cerrar ventana de tutor para no interceptar clicks en el resto de la UI
            page.click("#btn-tutor-toggle")
            time.sleep(0.3)
            
            duration = round((time.time() - start_time) * 1000, 1)
            log_step(f"{test_name} ({duration}ms)")
            results["passed"] += 1
            results["tests"].append({"name": test_name, "status": "PASSED", "duration_ms": duration, "evidence": screenshot_path})
        except Exception as e:
            log_step(f"{test_name} — Error: {str(e)}", "FAIL")
            results["failed"] += 1
            results["tests"].append({"name": test_name, "status": "FAILED", "error": str(e)})

        # -------------------------------------------------------------------
        # TUC-UX-05: Conflict Solver 3-Way, Banner Persistente & Reversibilidad
        # -------------------------------------------------------------------
        test_name = "TUC-UX-05: Conflict Solver, Banner Persistente & Botón de Reversibilidad"
        try:
            start_time = time.time()
            page.click("#nav-btn-conflicts")
            
            # Iniciar simulador de conflicto
            page.click("#start-conflict-btn")
            
            # 1. Verificar Banner Persistente de Choque y descartarlo con el nuevo botón
            expect(page.locator("text=¡CHOQUE DE COMMITS DETECTADO!").first).to_be_visible()
            dismiss_btn = page.locator("#btn-dismiss-crash-alert")
            expect(dismiss_btn).to_be_visible()
            dismiss_btn.click()
            expect(page.locator("#btn-dismiss-crash-alert")).not_to_be_visible()
            
            # 2. Seleccionar Cambio Entrante
            page.click("#diff-pane-incoming")
            
            # 3. Marcar como Resuelto
            page.click("#btn-conflict-resolve")
            
            # 4. Verificar Botón de Reversibilidad (Quick Win P1)
            undo_btn = page.locator("#btn-conflict-undo-selection")
            expect(undo_btn).to_be_visible()
            
            # Hacer clic en Reabrir Selección y cambiar a Cambio Actual
            undo_btn.click()
            expect(undo_btn).not_to_be_visible()
            page.click("#diff-pane-current")
            page.click("#btn-conflict-resolve")
            
            # 5. Crear Commit de Resolución
            page.click("#btn-conflict-commit")
            expect(page.locator("text=Merge commit de resolución guardado localmente").first).to_be_visible()
            
            screenshot_path = os.path.join(SCREENSHOTS_DIR, "05_conflict_solver_resolved.png")
            page.screenshot(path=screenshot_path)
            
            duration = round((time.time() - start_time) * 1000, 1)
            log_step(f"{test_name} ({duration}ms)")
            results["passed"] += 1
            results["tests"].append({"name": test_name, "status": "PASSED", "duration_ms": duration, "evidence": screenshot_path})
        except Exception as e:
            log_step(f"{test_name} — Error: {str(e)}", "FAIL")
            results["failed"] += 1
            results["tests"].append({"name": test_name, "status": "FAILED", "error": str(e)})

        # -------------------------------------------------------------------
        # TUC-UX-06: GitHub Hub & Remote Sync
        # -------------------------------------------------------------------
        test_name = "TUC-UX-06: GitHub Hub, Simulación de Push, PR, Review y Pull"
        try:
            start_time = time.time()
            page.click("#nav-btn-github")
            expect(page.locator("#github-hub-root")).to_be_visible()
            expect(page.locator("text=Conexión con GitHub").first).to_be_visible()
            
            # 1. Conectar al servidor remoto
            page.click("#btn-remote-add")
            expect(page.locator("text=Remoto Vinculado")).to_be_visible()
            
            # 2. Hacer git push
            page.click("#btn-git-push")
            
            # 3. Crear Pull Request
            page.click("#btn-create-pr")
            expect(page.locator("text=PR #1: Integrar feature/oauth")).to_be_visible()
            
            # 4. Resolver comentario de Code Review (Javier Darder)
            page.click("#btn-resolve-review")
            expect(page.locator("text=scheduleSessionCleanup")).to_be_visible()
            
            # 5. Fusionar PR (Merge)
            page.click("#btn-merge-pr")
            
            # 6. Sincronizar cambios localmente con git pull
            page.click("#btn-git-pull")
            expect(page.locator("text=Merge pull request #1 from feature/oauth").first).to_be_visible()
            
            screenshot_path = os.path.join(SCREENSHOTS_DIR, "06_github_hub.png")
            page.screenshot(path=screenshot_path)
            
            duration = round((time.time() - start_time) * 1000, 1)
            log_step(f"{test_name} ({duration}ms)")
            results["passed"] += 1
            results["tests"].append({"name": test_name, "status": "PASSED", "duration_ms": duration, "evidence": screenshot_path})
        except Exception as e:
            log_step(f"{test_name} — Error: {str(e)}", "FAIL")
            results["failed"] += 1
            results["tests"].append({"name": test_name, "status": "FAILED", "error": str(e)})

        # -------------------------------------------------------------------
        # TUC-UX-07: Toggle de Tema (Dark / Light) & Contraste
        # -------------------------------------------------------------------
        test_name = "TUC-UX-07: Cambio de Tema Claro/Oscuro y Adaptabilidad Visual"
        try:
            start_time = time.time()
            theme_btn = page.locator("button:has-text('Modo Claro'), button:has-text('Modo Oscuro')").first
            if theme_btn.is_visible():
                theme_btn.click()
                time.sleep(0.3)
            
            screenshot_path = os.path.join(SCREENSHOTS_DIR, "07_theme_toggle.png")
            page.screenshot(path=screenshot_path)
            
            # Restaurar a Dark Mode
            if theme_btn.is_visible():
                theme_btn.click()
                time.sleep(0.3)
            
            duration = round((time.time() - start_time) * 1000, 1)
            log_step(f"{test_name} ({duration}ms)")
            results["passed"] += 1
            results["tests"].append({"name": test_name, "status": "PASSED", "duration_ms": duration, "evidence": screenshot_path})
        except Exception as e:
            log_step(f"{test_name} — Error: {str(e)}", "FAIL")
            results["failed"] += 1
            results["tests"].append({"name": test_name, "status": "FAILED", "error": str(e)})

        # -------------------------------------------------------------------
        # TUC-UX-08: Progreso persistente tras recargar
        # -------------------------------------------------------------------
        test_name = "TUC-UX-08: Progreso, Medallas y Pestaña Persisten al Recargar"
        try:
            start_time = time.time()
            p2 = watch(browser.new_page(viewport={"width": 1440, "height": 900}))
            p2.goto(BASE_URL, wait_until="networkidle")
            p2.click("#nav-btn-simulator")
            p2.fill("#terminal-user-input", "git init")
            p2.press("#terminal-user-input", "Enter")
            expect(p2.locator("#sidebar-container")).to_contain_text("100 / 1000 XP")
            p2.reload(wait_until="networkidle")
            expect(p2.locator("#sidebar-container")).to_contain_text("100 / 1000 XP")
            expect(p2.locator("#nav-btn-simulator")).to_have_attribute("aria-current", "page")
            p2.once("dialog", lambda d: d.accept())
            p2.click("#reset-progress-btn")
            expect(p2.locator("#sidebar-container")).to_contain_text("0 / 1000 XP")
            p2.close()
            duration = round((time.time() - start_time) * 1000, 1)
            log_step(f"{test_name} ({duration}ms)")
            results["passed"] += 1
            results["tests"].append({"name": test_name, "status": "PASSED", "duration_ms": duration})
        except Exception as e:
            log_step(f"{test_name} — Error: {str(e)}", "FAIL")
            results["failed"] += 1
            results["tests"].append({"name": test_name, "status": "FAILED", "error": str(e)})

        # -------------------------------------------------------------------
        # TUC-UX-09: Móvil 375 px — drawer y sin scroll horizontal
        # -------------------------------------------------------------------
        test_name = "TUC-UX-09: Móvil 375px, Drawer de Navegación y Sin Desbordes"
        try:
            start_time = time.time()
            m = watch(browser.new_page(viewport={"width": 375, "height": 812}))
            m.goto(BASE_URL, wait_until="networkidle")
            for tab in TABS:
                m.click("#mobile-menu-btn")
                m.click(f"#nav-btn-{tab}")
                expect(m.locator("#mobile-menu-btn")).to_have_attribute("aria-expanded", "false")
                overflow = m.evaluate("document.documentElement.scrollWidth - innerWidth")
                assert overflow <= 0, f"{tab}: desborde horizontal de {overflow}px"
            screenshot_path = os.path.join(SCREENSHOTS_DIR, "09_mobile_lessons.png")
            m.screenshot(path=screenshot_path)
            m.close()
            duration = round((time.time() - start_time) * 1000, 1)
            log_step(f"{test_name} ({duration}ms)")
            results["passed"] += 1
            results["tests"].append({"name": test_name, "status": "PASSED", "duration_ms": duration, "evidence": screenshot_path})
        except Exception as e:
            log_step(f"{test_name} — Error: {str(e)}", "FAIL")
            results["failed"] += 1
            results["tests"].append({"name": test_name, "status": "FAILED", "error": str(e)})

        # -------------------------------------------------------------------
        # TUC-UX-10: Reproductor — teclado y autocompletado al terminar
        # -------------------------------------------------------------------
        test_name = "TUC-UX-10: Reproductor de Lecciones, Teclado y Lección Completada"
        try:
            start_time = time.time()
            p3 = watch(browser.new_page(viewport={"width": 1440, "height": 900}))
            p3.goto(BASE_URL, wait_until="networkidle")
            p3.click("#nav-btn-videolearning")
            p3.click("#playlist-item-remotos")
            player = p3.locator(".lesson-player")
            # El póster arranca la lección y desaparece
            p3.locator(".lesson-poster-play").click()
            expect(p3.locator(".lesson-poster")).to_have_count(0)
            expect(p3.locator(".lesson-btn-main")).to_have_attribute("aria-label", "Pausar")
            # Teclado: Espacio pausa, flechas cambian de paso
            player.focus()
            p3.keyboard.press("Space")
            expect(p3.locator(".lesson-btn-main")).to_have_attribute("aria-label", "Reproducir")
            p3.keyboard.press("Home")
            p3.keyboard.press("Space")
            p3.keyboard.press("ArrowRight")
            expect(p3.locator(".lesson-caption")).to_contain_text("Paso 2 de 8")
            p3.keyboard.press("ArrowLeft")
            expect(p3.locator(".lesson-caption")).to_contain_text("Paso 1 de 8")
            # Reproducir hasta el final a 1,5×
            p3.select_option(".lesson-speed select", "1.5")
            p3.click(".lesson-btn-main")
            p3.wait_for_selector("button[aria-label='Volver a ver']", timeout=60000)
            expect(p3.locator(".library-done")).to_have_text("Completada")
            screenshot_path = os.path.join(SCREENSHOTS_DIR, "10_lesson_completed.png")
            p3.screenshot(path=screenshot_path)
            p3.close()
            duration = round((time.time() - start_time) * 1000, 1)
            log_step(f"{test_name} ({duration}ms)")
            results["passed"] += 1
            results["tests"].append({"name": test_name, "status": "PASSED", "duration_ms": duration, "evidence": screenshot_path})
        except Exception as e:
            log_step(f"{test_name} — Error: {str(e)}", "FAIL")
            results["failed"] += 1
            results["tests"].append({"name": test_name, "status": "FAILED", "error": str(e)})

        # -------------------------------------------------------------------
        # TUC-UX-11: Accesibilidad (axe-core + teclado), delegada a scripts/a11y.py
        # -------------------------------------------------------------------
        test_name = "TUC-UX-11: Accesibilidad WCAG AA (axe-core) y Navegación por Teclado"
        try:
            start_time = time.time()
            run = subprocess.run([sys.executable, os.path.join(HERE, "..", "scripts", "a11y.py"), BASE_URL], capture_output=True, text=True)
            assert run.returncode == 0, run.stdout[-1500:]
            duration = round((time.time() - start_time) * 1000, 1)
            log_step(f"{test_name} ({duration}ms)")
            results["passed"] += 1
            results["tests"].append({"name": test_name, "status": "PASSED", "duration_ms": duration})
        except Exception as e:
            log_step(f"{test_name} — Error: {str(e)}", "FAIL")
            results["failed"] += 1
            results["tests"].append({"name": test_name, "status": "FAILED", "error": str(e)})

        # -------------------------------------------------------------------
        # TUC-UX-12: Sin errores de JavaScript durante toda la suite
        # -------------------------------------------------------------------
        test_name = "TUC-UX-12: Sin Errores de Página en Tiempo de Ejecución"
        if page_errors:
            log_step(f"{test_name} — Errores: {page_errors[:3]}", "FAIL")
            results["failed"] += 1
            results["tests"].append({"name": test_name, "status": "FAILED", "error": "; ".join(page_errors[:3])})
        else:
            log_step(test_name)
            results["passed"] += 1
            results["tests"].append({"name": test_name, "status": "PASSED"})

        browser.close()

    print("\n" + "="*70)
    print(f"📊 RESUMEN FINAL: {results['passed']} PASSED | {results['failed']} FAILED de {len(results['tests'])} tests")
    print("="*70 + "\n")

    return results

if __name__ == "__main__":
    res = run_test_suite()
    if res["failed"] > 0:
        sys.exit(1)
    sys.exit(0)
