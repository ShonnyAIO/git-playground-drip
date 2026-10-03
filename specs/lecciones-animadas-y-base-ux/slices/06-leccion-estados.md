# 06 — Lección 1: los tres estados (`estados`)

Sigue el [contrato común](_plantilla-leccion.md). Paneles: `zones` (+ `graph` desde el commit).
Referencia: Pro Git 1.3 y 2.2. Práctica: `simulator`.

**Objetivos**: distinguir Working Directory, Staging Area y Repositorio; saber qué mueve
`git add` y qué mueve `git commit`.

**Guion**
1. Tres zonas vacías con su nombre y color (rojo, amarillo, verde). "Git vigila tu
   carpeta en tres lugares."
2. `git init` → aparece el repositorio vacío.
3. Se crean `index.html` y `estilos.css` en Working (estado *nuevo*).
4. `git add index.html` → solo `index.html` viaja a Staging. "Elegiste qué entra en la foto."
5. `git commit -m "Página inicial"` → Staging se vacía, nace el commit `c1` en el repo y en el grafo.
6. `estilos.css` sigue en Working: "Lo que no preparaste no entra."
7. Se edita `index.html` → reaparece en Working como *modificado*.
8. `git add .` → ambos a Staging; `git commit` → `c2` con su padre `c1`.
9. Cierre: las tres zonas con flechas `add` y `commit` (resumen).

## Estado

✅ Implementada en `src/lessons/content/estados.js`. Hojas de contactos en `assets/estados/` (tema oscuro y claro).
