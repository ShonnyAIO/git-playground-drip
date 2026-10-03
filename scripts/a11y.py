#!/usr/bin/env python3
"""Auditoría axe-core de cada pestaña en ambos temas. Uso: a11y.py [url]. Sale con 1 si hay serious/critical."""
import sys, pathlib
from playwright.sync_api import sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:4173"
AXE = (pathlib.Path(__file__).resolve().parent.parent / "node_modules/axe-core/axe.min.js").read_text()
TABS = ["dashboard", "videolearning", "simulator", "github", "conflicts", "quizzes"]
blocking = 0

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": 1440, "height": 900})
    for theme in ["dark", "light"]:
        page.goto(URL, wait_until="networkidle")
        if theme == "light":
            page.click("#theme-toggle-btn")
        for tab in TABS:
            page.click(f"#nav-btn-{tab}")
            page.wait_for_timeout(500)
            page.add_script_tag(content=AXE)
            res = page.evaluate("axe.run(document, { resultTypes: ['violations'] })")
            for v in res["violations"]:
                if v["impact"] in ("serious", "critical"):
                    blocking += 1
                targets = [str(n["target"][0])[:60] for n in v["nodes"][:3]]
                print(f"{theme:5s} {tab:13s} {v['impact']:8s} {v['id']:28s} x{len(v['nodes'])} {targets}")
    # El tema queda guardado; vuelve a oscuro para no ensuciar otras corridas.
    page.click("#theme-toggle-btn")

    # Teclado (escritorio): el primer Tab llega al enlace de salto; elegir pestaña enfoca su título.
    def check(name, ok):
        global blocking
        print(("OK   " if ok else "FALLA") + " teclado: " + name)
        blocking += 0 if ok else 1
    active = lambda: page.evaluate("[document.activeElement.tagName, document.activeElement.textContent.trim().slice(0, 40)]")
    page.goto(URL, wait_until="networkidle")
    page.keyboard.press("Tab")
    check("Tab inicial enfoca 'Saltar al contenido'", active()[1] == "Saltar al contenido")
    page.focus("#nav-btn-conflicts")
    page.keyboard.press("Enter")
    page.wait_for_timeout(300)
    check("Enter en una pestaña enfoca el h2 del módulo", active()[0] == "H2")
    check("la pestaña activa tiene aria-current", page.get_attribute("#nav-btn-conflicts", "aria-current") == "page")

    # Teclado (móvil): el drawer atrapa el foco y lo devuelve al cerrarse.
    m = b.new_page(viewport={"width": 375, "height": 812})
    page = m
    m.goto(URL, wait_until="networkidle")
    m.focus("#mobile-menu-btn")
    m.keyboard.press("Enter")
    m.wait_for_timeout(300)
    inside = "document.querySelector('#sidebar-container').contains(document.activeElement)"
    check("abrir el drawer mueve el foco adentro", m.evaluate(inside))
    for _ in range(15):
        m.keyboard.press("Tab")
    check("Tab no se escapa del drawer", m.evaluate(inside))
    m.keyboard.press("Escape")
    m.wait_for_timeout(300)
    check("Esc cierra y devuelve el foco al botón de menú", m.evaluate("document.activeElement.id") == "mobile-menu-btn")
    b.close()

print(f"bloqueantes (serious/critical): {blocking}")
sys.exit(1 if blocking else 0)
