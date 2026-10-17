#!/usr/bin/env python3
"""Capturas reales del MVP usadas en el informe (tema claro, 1440x900).
Requiere `npm run build && npm run preview` en :4173.
Uso: uv run --with playwright==1.57.0 python capturas.py"""
import pathlib
from playwright.sync_api import sync_playwright

OUT = pathlib.Path(__file__).resolve().parent / "figuras"
URL = "http://127.0.0.1:4173"
TABS = {"dashboard": "01_dashboard", "videolearning": "02_lecciones", "simulator": "03_simulador"}

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1.5)
    page.goto(URL, wait_until="networkidle")
    page.click("#theme-toggle-btn")  # tema claro: se imprime mejor
    for tab, name in TABS.items():
        page.click(f"#nav-btn-{tab}")
        page.wait_for_timeout(600)
        page.screenshot(path=str(OUT / f"captura_{name}.png"))
    # Editor de conflictos: se cierra el aviso y la tutora, que se abre sola con el mensaje del conflicto.
    page.click("#nav-btn-conflicts")
    page.get_by_text("Simulador de Conflictos").first.click()
    page.get_by_text("Entendido, examinar conflicto").first.click()
    page.click("#btn-tutor-toggle")
    page.locator("#diff-pane-current").scroll_into_view_if_needed()
    page.evaluate("window.scrollBy(0, -160)")
    page.wait_for_timeout(400)
    page.screenshot(path=str(OUT / "captura_05b_conflicto_editor.png"))
    b.close()
