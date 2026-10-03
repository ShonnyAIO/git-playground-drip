#!/usr/bin/env python3
"""Hoja de contactos de cada lección desde /lab.html (requiere `npm run dev` en :5173).
Uso: contact_sheets.py <dir_assets> [ids...]. Guarda <dir>/<id>/hoja_<tema>.png."""
import sys
from playwright.sync_api import sync_playwright

OUT = sys.argv[1]
IDS = sys.argv[2:] or ["estados", "ramas-head", "merge", "rebase", "remotos", "conflictos"]
with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": 1240, "height": 900})
    page.on("pageerror", lambda e: print("PAGEERROR", e))
    page.goto("http://127.0.0.1:5173/lab.html", wait_until="networkidle")
    for theme in ["dark", "light"]:
        page.evaluate(f"document.documentElement.setAttribute('data-theme', '{theme}')")
        for lid in IDS:
            page.select_option("select[aria-label='Lección']", lid)
            page.wait_for_timeout(900)
            errors = page.locator(".lab-error").count()
            page.locator(".lab-sheet").screenshot(path=f"{OUT}/{lid}/hoja_{theme}.png")
            print(theme, lid, "errores:", errors)
    b.close()
