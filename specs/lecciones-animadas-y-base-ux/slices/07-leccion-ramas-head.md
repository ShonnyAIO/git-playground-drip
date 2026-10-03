# 07 — Lección 2: ramas y HEAD (`ramas-head`)

Sigue el [contrato común](_plantilla-leccion.md). Panel: `graph`. Referencia: Pro Git 3.1.
Práctica: `simulator`.

**Objetivos**: entender que una rama es un puntero móvil a un commit y que HEAD indica
dónde estás.

**Guion**
1. Historia lineal `c1←c2←c3`, etiqueta `main` en `c3`, HEAD → `main`.
2. `git branch login` → aparece la etiqueta `login` en el **mismo** `c3`. "Crear una rama no copia archivos."
3. `git switch login` → HEAD se mueve a `login` (foco en HEAD).
4. `git commit` → nace `c4`; solo `login` avanza; `main` se queda.
5. `git switch main` → HEAD vuelve a `main`.
6. `git commit` → nace `c5` desde `c3`: la historia diverge (dos carriles).
7. `git switch --detach c2` → HEAD apunta directo a `c2` (detached). "Commits aquí quedan huérfanos si no creas una rama."
8. `git switch main` → vuelve. Resumen: rama = puntero, HEAD = "estás aquí".
