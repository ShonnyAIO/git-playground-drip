# 11 — Lección 6: anatomía de un conflicto (`conflictos`)

Sigue el [contrato común](_plantilla-leccion.md). Paneles: `graph` y `code`.
Referencia: Pro Git 3.2 ("Principales conflictos que pueden surgir en las fusiones").
Práctica: `conflicts`.

**Objetivos**: saber por qué ocurre un conflicto, leer los marcadores y resolverlo.

**Guion**
1. Archivo `saludo.js` con 3 líneas en `c1`; `main` y `login` divergen.
2. En `main` la línea 2 cambia a `"Hola, UCV"` (kind `ours`).
3. En `login` la **misma** línea cambia a `"Bienvenido"` (kind `theirs`).
4. `git merge login` → "CONFLICT (content)". El grafo muestra el merge pendiente.
5. Aparecen los marcadores `<<<<<<< HEAD`, `=======`, `>>>>>>> login` (kind `marker`),
   cada bloque con su color.
6. "Git no adivina: tú decides." Se eliminan marcadores y se deja la línea combinada (kind `added`).
7. `git add saludo.js` + `git commit` → nace el commit de fusión con dos padres.
8. Resumen: mismo archivo + misma zona + dos ramas = conflicto.

## Estado

✅ Implementada en `src/lessons/content/conflictos.js`. Hojas de contactos en `assets/conflictos/` (tema oscuro y claro).
