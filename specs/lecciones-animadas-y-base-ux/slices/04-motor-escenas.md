# 04 — Motor de escenas (puro)

## Contrato que desbloquea

Una lección es **datos**: una lista de pasos, cada uno con una escena declarativa
completa. El motor valida la lección y calcula el layout del grafo. Todas las lecciones
(06–11) y el reproductor (05) dependen de esta costura; por eso va primero.

## Esquema

```js
// src/lessons/engine/schema.js (JSDoc)
Lesson = {
  id: 'estados',                 // slug estable, se usa en completedLessons
  title: 'Los tres estados de Git',
  level: 'Básico' | 'Intermedio' | 'Avanzado',
  objectives: string[],          // 2–3 frases "Al terminar podrás…"
  practice: { tab: 'simulator' | 'github' | 'conflicts', label: string },
  furtherReading: [{ title, author, url }],  // externos reales, verificados
  files?: { [fileId]: { name } },
  steps: Step[],
}

Step = {
  id: string,                    // único dentro de la lección
  caption: string,               // subtítulo = narración (fuente de verdad)
  command?: string,              // comando que "se ejecuta" en este paso
  durationMs?: number,           // opcional; si falta, se deriva del caption
  focus?: string[],              // ids a resaltar: 'file:x', 'commit:c2', 'branch:main', 'line:l3'
  scene: {                       // escena COMPLETA, no un diff
    zones?:  { working: Entry[], staging: Entry[], repo: string[] },  // Entry = { file, status: 'nuevo'|'modificado' }; repo = ids de commit
    graph?:  Graph,
    remote?: Graph,              // origin; se dibuja a la derecha de graph
    code?:   { file: string, lines: [{ id, text, kind: 'normal'|'ours'|'theirs'|'marker'|'added' }] },
  },
}

Graph = {
  commits: [{ id, parents: string[], msg, ghost?: boolean }],   // ghost = historia reescrita
  branches: { [name]: commitId },
  head: { branch: string } | { detached: commitId },
}
```

Cada paso es una escena completa (no incremental) para que el reproductor pueda saltar a
cualquier paso sin reproducir los anteriores, y para que el renderer anime por `key`.

## API

- `validateLesson(lesson) → string[]` (vacío = válida). Reglas: ids de paso únicos;
  caption no vacío; padres y destinos de rama existen; `head.branch` existe; el
  `detached` apunta a un commit existente; las entradas de `zones` usan `files`
  declarados; los commits de `zones.repo` existen en `graph` si hay grafo; `focus`
  referencia ids presentes en la escena; `furtherReading.url` es `https://`.
- `layoutGraph(graph) → { nodes: [{ id, x, y, lane, ghost }], edges: [{ from, to }], labels: [{ branch, commitId, x, y, isHead, remoteTracking }], head: { x, y } }`.
  Determinista: `x` = generación (máx. generación de los padres + 1); carril = primera
  rama (en orden de declaración, `main` primero) desde cuya punta el commit es alcanzable
  siguiendo el primer padre (las ramas `origin/*` no asignan carril); los commits `ghost` conservan su carril pero en una fila
  desplazada para que la versión reescrita quede visible al lado. Unidades abstractas
  (columna/fila); el renderer escala.
- Ramas cuyo nombre empieza por `origin/` son ramas de seguimiento remoto:
  `remoteTracking: true` en su etiqueta (el renderer las atenúa) y no pueden ser `head.branch`.
- `stepDuration(step, speed = 1) → ms`: `durationMs` o `max(3500, palabras × 380)`, ÷ speed.

## Qué puede ver el humano

`lab.html` (entrada solo de desarrollo, servida por `npm run dev` en `/lab.html` y no
incluida en el build): lista cada lección registrada con su resultado de
`validateLesson` y una tabla de layout por paso. En el slice 05 se le suma el renderer.

## Verificación

`src/lessons/engine/*.test.js`:
- `validateLesson` detecta cada regla con un fixture roto por regla.
- `layoutGraph`: historia lineal (un carril); rama divergente (dos carriles); merge de
  3 vías (nodo con dos padres en el carril de `main`); rebase con commits `ghost`;
  HEAD detached. Las salidas se comparan contra valores esperados escritos a mano.
- Un test recorre `src/lessons/content/index.js` y exige `validateLesson(l) == []` para
  cada lección registrada (oráculo que protege los slices 06–11).

## Decisiones delegadas

Organización de archivos dentro de `engine/`, nombres internos, formato de la tabla en
`lab.html`.

## Feedback que cambiaría el slice

Si una lección necesita un panel nuevo (p. ej. un árbol de objetos `.git`), se agrega aquí
como clave de `scene` con su validación; nunca como componente especial de una lección.
