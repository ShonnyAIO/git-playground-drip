# 10 — Lección 5: remotos, push, fetch y pull (`remotos`)

Sigue el [contrato común](_plantilla-leccion.md). Paneles: `graph` (local) y `remote`
(origin). Referencia: Pro Git 3.5. Práctica: `github`.

**Objetivos**: entender que el remoto es otra copia del grafo y que `pull = fetch + merge`.

**Guion**
1. Local `c1←c2`, `main`. Panel remoto vacío rotulado "origin (GitHub)".
2. `git remote add origin …` → aparece el enlace entre paneles.
3. `git push -u origin main` → `c1`, `c2` viajan al remoto; aparece `origin/main` en local.
4. Un compañero empuja `c3` al remoto (solo cambia el panel remoto).
5. `git fetch` → `c3` llega al local y mueve `origin/main`; **`main` no se mueve**.
6. `git merge origin/main` → fast-forward de `main`. "Eso hace `git pull`: fetch + merge."
7. Trabajo local `c4` sin publicar: `main` va adelante de `origin/main` ("1 commit por delante").
8. `git push` → `c4` viaja. Resumen de las tres flechas.

Nota: `origin/main` es una rama más del grafo local; el slice 04 la marca como
`remoteTracking` por el prefijo `origin/`.
