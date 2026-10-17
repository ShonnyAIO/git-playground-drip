#!/usr/bin/env python3
"""
Flujo de cuenta de extremo a extremo contra Supabase LOCAL (TUC-ACC-01 a 05).
Requiere: `npx supabase start` y `npx vite --port 5173` con .env.local apuntando a la instancia local.
Uso: uv run --with playwright==1.57.0 python tests/account_flow.py
"""
import json
import os
import re
import sys
import time
import urllib.request

from playwright.sync_api import expect, sync_playwright

BASE_URL = os.environ.get("BASE_URL", "http://127.0.0.1:5173")
MAILPIT = os.environ.get("MAILPIT_URL", "http://127.0.0.1:54324")
HERE = os.path.dirname(os.path.abspath(__file__))
SHOTS = os.path.join(HERE, "screenshots")
EMAIL = f"estudiante{int(time.time())}@example.test"
PASSWORD = "git-playground-2026"
failures = []


def step(name, fn):
    try:
        fn()
        print(f"✅ {name}", flush=True)
    except Exception as e:  # noqa: BLE001 — se reporta y se sigue con los demás casos
        failures.append(name)
        print(f"❌ {name}: {str(e)[:300]}", flush=True)


def confirmation_link(email, kind="signup"):
    """Busca en Mailpit el último correo a `email` con un enlace de tipo `kind` y devuelve el enlace."""
    for _ in range(30):
        with urllib.request.urlopen(f"{MAILPIT}/api/v1/search?query=to:{email}") as r:
            messages = json.load(r).get("messages", [])
        for msg in messages:  # el más reciente primero
            with urllib.request.urlopen(f"{MAILPIT}/api/v1/message/{msg['ID']}") as r:
                body = json.load(r)
            match = re.search(r'https?://[^\s"<>]+verify[^\s"<>]+type=' + kind + r'[^\s"<>]*', body.get("HTML", "") + body.get("Text", ""))
            if match:
                return match.group(0).replace("&amp;", "&")
        time.sleep(1)
    raise AssertionError(f"no llegó el correo de tipo {kind}")


with sync_playwright() as p:
    browser = p.chromium.launch()
    errors = []

    lab = browser.new_context(viewport={"width": 1440, "height": 900})
    page = lab.new_page()
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(BASE_URL, wait_until="networkidle")

    def guest_progress():
        expect(page.locator("#account-card")).to_contain_text("invitado")
        page.click("#nav-btn-simulator")
        page.fill("#terminal-user-input", "git init")
        page.press("#terminal-user-input", "Enter")
        expect(page.locator("#sidebar-container")).to_contain_text("100 / 1000 XP")
        expect(page.locator("#streak-value")).to_contain_text("1 día")

    step("TUC-ACC-01: invitado practica y empieza su racha", guest_progress)

    def signup():
        page.click("#open-account-btn")
        dlg = page.locator("#account-dialog")
        expect(dlg).to_be_visible()
        dlg.get_by_role("button", name="Crear una cuenta").click()
        dlg.get_by_label("Nombre visible", exact=True).fill("Carlos Mendoza")
        dlg.get_by_label("Correo", exact=True).fill(EMAIL)
        dlg.get_by_label("Contraseña", exact=True).fill(PASSWORD)
        dlg.get_by_role("button", name="Crear cuenta", exact=True).click()
        expect(dlg.get_by_role("alert")).to_contain_text("aceptar")  # sin consentimiento no se crea
        dlg.get_by_role("checkbox").check()
        dlg.get_by_role("button", name="Crear cuenta", exact=True).click()
        expect(dlg).to_contain_text("Te enviamos un enlace")
        page.screenshot(path=os.path.join(SHOTS, "acc_01_registro.png"))
        dlg.get_by_role("button", name="Ir a iniciar sesión").click()
        page.keyboard.press("Escape")
        expect(page.locator("#account-dialog")).to_have_count(0)

    step("TUC-ACC-02: registro exige consentimiento y pide confirmar el correo", signup)

    def confirm_and_merge():
        page.goto(confirmation_link(EMAIL), wait_until="networkidle")
        expect(page.locator("#account-card")).to_contain_text("Carlos Mendoza", timeout=15000)
        expect(page.locator("#account-card")).to_contain_text("guardado en tu cuenta", timeout=15000)
        # El progreso del invitado se fusionó con la cuenta nueva
        expect(page.locator("#sidebar-container")).to_contain_text("100 / 1000 XP")
        page.screenshot(path=os.path.join(SHOTS, "acc_02_sesion.png"))

    step("TUC-ACC-03: al confirmar, la sesión se abre y conserva el progreso del invitado", confirm_and_merge)

    def more_progress_and_logout():
        page.click("#nav-btn-simulator")
        # El repositorio del simulador no se persiste: tras recargar hay que inicializarlo otra vez.
        page.fill("#terminal-user-input", "git init")
        page.press("#terminal-user-input", "Enter")
        page.fill("#terminal-user-input", "git add .")
        page.press("#terminal-user-input", "Enter")
        page.fill("#terminal-user-input", 'git commit -m "primer commit"')
        page.press("#terminal-user-input", "Enter")
        expect(page.locator("#sidebar-container")).to_contain_text("200 / 1000 XP")
        expect(page.locator("#account-card")).to_contain_text("guardado en tu cuenta", timeout=10000)
        page.click("#sign-out-btn")
        expect(page.locator("#account-card")).to_contain_text("invitado")
        # Computadora compartida: el siguiente estudiante empieza de cero
        expect(page.locator("#sidebar-container")).to_contain_text("0 / 1000 XP")
        expect(page.locator("#streak-value")).to_contain_text("0 días")

    step("TUC-ACC-04: el avance se guarda y al salir no queda progreso en la computadora", more_progress_and_logout)

    def restore_elsewhere():
        other = browser.new_context(viewport={"width": 390, "height": 844})
        p2 = other.new_page()
        p2.on("pageerror", lambda e: errors.append(str(e)))
        p2.goto(BASE_URL, wait_until="networkidle")
        p2.click("#mobile-menu-btn")
        p2.click("#open-account-btn")
        dlg = p2.locator("#account-dialog")
        dlg.get_by_label("Correo", exact=True).fill(EMAIL)
        dlg.get_by_label("Contraseña", exact=True).fill("contraseña-equivocada")
        dlg.get_by_role("button", name="Entrar", exact=True).click()
        expect(dlg.get_by_role("alert")).to_contain_text("incorrectos")
        dlg.get_by_label("Contraseña", exact=True).fill(PASSWORD)
        dlg.get_by_role("button", name="Entrar", exact=True).click()
        expect(p2.locator("#account-dialog")).to_have_count(0)
        p2.click("#mobile-menu-btn")
        expect(p2.locator("#account-card")).to_contain_text("Carlos Mendoza", timeout=15000)
        expect(p2.locator("#sidebar-container")).to_contain_text("200 / 1000 XP")
        expect(p2.locator("#streak-value")).to_contain_text("1 día")
        p2.wait_for_timeout(500)  # fin de la animación del menú
        p2.screenshot(path=os.path.join(SHOTS, "acc_03_otro_dispositivo.png"))
        other.close()

    step("TUC-ACC-05: en otro dispositivo, tras un error de contraseña, el progreso se restaura", restore_elsewhere)

    def password_recovery():
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        p3 = ctx.new_page()
        p3.on("pageerror", lambda e: errors.append(str(e)))
        p3.goto(BASE_URL, wait_until="networkidle")
        p3.click("#open-account-btn")
        dlg = p3.locator("#account-dialog")
        dlg.get_by_role("button", name="¿Olvidaste tu contraseña?").click()
        dlg.get_by_label("Correo", exact=True).fill(EMAIL)
        dlg.get_by_role("button", name="Enviar enlace").click()
        expect(dlg).to_contain_text("te llegará un enlace")
        p3.keyboard.press("Escape")
        p3.goto(confirmation_link(EMAIL, kind="recovery"), wait_until="networkidle")
        dlg = p3.locator("#account-dialog")
        expect(dlg).to_contain_text("Elige una contraseña nueva", timeout=15000)
        dlg.get_by_label("Contraseña nueva", exact=True).fill(PASSWORD + "-nueva")
        dlg.get_by_role("button", name="Guardar contraseña").click()
        expect(p3.locator("#account-dialog")).to_have_count(0)
        expect(p3.locator("#account-card")).to_contain_text("Carlos Mendoza", timeout=15000)
        expect(p3.locator("#sidebar-container")).to_contain_text("200 / 1000 XP")
        ctx.close()

    step("TUC-ACC-07: recupera la contraseña desde el enlace del correo", password_recovery)

    step("TUC-ACC-06: sin errores de JavaScript", lambda: (_ for _ in ()).throw(AssertionError(errors[:3])) if errors else None)
    browser.close()

print(f"\n{'Todo en orden' if not failures else str(len(failures)) + ' fallas'}")
sys.exit(1 if failures else 0)
