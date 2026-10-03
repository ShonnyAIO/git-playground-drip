# 08 — Lección 3: merge fast-forward vs 3 vías (`merge`)

Sigue el [contrato común](_plantilla-leccion.md). Panel: `graph`. Referencia: Pro Git 3.2.
Práctica: `simulator`.

**Objetivos**: predecir si un merge será fast-forward o creará un commit de fusión.

**Guion**
1. `main` en `c2`; `hotfix` en `c3` (hijo de `c2`). HEAD → `main`.
2. "`main` es ancestro directo de `hotfix`."
3. `git merge hotfix` → la etiqueta `main` **se desliza** a `c3`. "Fast-forward: no hay nada que combinar."
4. `git branch -d hotfix` → la etiqueta desaparece.
5. Nuevo escenario: `main` en `c4`, `login` en `c5`, ambos desde `c3` (divergen).
6. Foco en el ancestro común `c3` y las dos puntas. "Tres versiones: base, tuya, suya."
7. `git merge login` → nace `m1` con **dos padres**; `main` avanza a `m1`.
8. Resumen lado a lado: FF (sin commit nuevo) vs 3 vías (commit de fusión). Mención de `--no-ff`.

## Estado

✅ Implementada en `src/lessons/content/merge.js`. Hojas de contactos en `assets/merge/` (tema oscuro y claro).
