#!/usr/bin/env python3
"""Convierte cada <figure id> de diagramas.html en un PNG (2x) dentro de ../figuras/.
Uso: uv run --with playwright==1.57.0 python render.py"""
import pathlib
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE.parent / "figuras"
OUT.mkdir(exist_ok=True)

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": 1500, "height": 900}, device_scale_factor=2)
    page.goto((HERE / "diagramas.html").as_uri())
    page.wait_for_timeout(300)
    for fid in page.eval_on_selector_all("figure", "els => els.map(e => e.id)"):
        page.locator(f"#{fid}").screenshot(path=str(OUT / f"{fid}.png"))
        print("ok", fid)
    b.close()
