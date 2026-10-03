# 09 — Lección 4: rebase vs merge (`rebase`)

Sigue el [contrato común](_plantilla-leccion.md). Panel: `graph` (usa `ghost`).
Referencia: Pro Git 3.6 ("Los peligros de reorganizar"). Práctica: `conflicts`.

**Objetivos**: ver que rebase crea commits nuevos (otro hash) y saber cuándo no usarlo.

**Guion**
1. `main` en `c4`, `feature` en `c6` (`c5←c6` desde `c3`). HEAD → `feature`.
2. "Quieres tu trabajo encima de lo último de `main`."
3. `git rebase main` → `c5`, `c6` se vuelven `ghost`; aparecen `c5'`, `c6'` encima de `c4`.
4. Foco en los hashes: "Mismos cambios, commits **nuevos**. La historia se reescribió."
5. `feature` apunta a `c6'`; los ghost se desvanecen. Historia lineal.
6. `git switch main` + `git merge feature` → fast-forward limpio.
7. Peligro: escenario con `origin/feature` compartido → los ghost siguen existiendo en el
   remoto de un compañero. Regla de oro: "No hagas rebase de commits ya publicados."
8. Resumen: merge conserva la historia; rebase la reescribe para dejarla lineal.
