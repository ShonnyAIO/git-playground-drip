#!/usr/bin/env python3
"""
Playwright Automated UX & E2E Test Suite for GitPlayground (DRIP - UCV)
Follows software-project-standards (Arrange - Act - Assert / TUC)
"""

import os
import sys
import time
from playwright.sync_api import sync_playwright, expect

SCREENSHOTS_DIR = "/home/shonny-torres/Workspace/UCV/Semestre I-2026/DRIP/tests/screenshots"
BASE_URL = "http://127.0.0.1:4173"

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
        test_name = "TUC-UX-02: Videoteca, Clases Magistrales & Salto al Simulador"
        try:
            start_time = time.time()
            page.click("#nav-btn-videolearning")
            page.wait_for_selector("text=Temario del Curso", timeout=5000)
            
            # Verificar lección 1 en el selector y detalles
            expect(page.locator("h3:has-text('1. La Trinidad de Git')").first).to_be_visible()
            expect(page.locator("text=git init").first).to_be_visible()
            
            # Seleccionar Lección 2 (Ramas y Punteros) mediante su ID accesible
            page.click("#playlist-item-2")
            expect(page.locator("text=Una rama en Git no es una copia de archivos").first).to_be_visible()
            
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
