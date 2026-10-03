#!/usr/bin/env python3
"""Captura cada pestaña a varios anchos. Uso: capture.py <dir_salida> [url]"""
import sys, os
from playwright.sync_api import sync_playwright

OUT = sys.argv[1]
URL = sys.argv[2] if len(sys.argv) > 2 else "http://127.0.0.1:4173"
TABS = ["dashboard", "videolearning", "simulator", "github", "conflicts", "quizzes"]
WIDTHS = [int(w) for w in os.environ.get("WIDTHS", "375,768,1024,1440").split(",")]
os.makedirs(OUT, exist_ok=True)

with sync_playwright() as p:
    b = p.chromium.launch()
    for w in WIDTHS:
        page = b.new_page(viewport={"width": w, "height": 900})
        page.goto(URL, wait_until="networkidle")
        for tab in TABS:
            btn = page.locator(f"#nav-btn-{tab}")
            if not btn.is_visible():
                menu = page.locator("#mobile-menu-btn")
                if menu.count():
                    menu.click()
            btn.click()
            page.wait_for_timeout(400)
            overflow = page.evaluate("document.documentElement.scrollWidth - innerWidth")
            page.screenshot(path=f"{OUT}/{w}_{tab}.png")
            print(f"{w}px {tab}: overflow={overflow}")
        page.close()
    b.close()
