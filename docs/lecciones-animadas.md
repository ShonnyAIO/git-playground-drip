# Lecciones animadas

Las lecciones de la pestaña "Lecciones animadas" son **datos**, no componentes. Un motor
puro las valida y las coloca, y un único reproductor las dibuja y anima. Para enseñar un
concepto nuevo se escribe un archivo de datos; el motor y el reproductor no se tocan.

## Principios

- **Cada paso es una escena completa**, no un cambio respecto al anterior. Así se puede
  saltar a cualquier paso y el reproductor anima solo lo que cambió: los elementos con el
  mismo id (un archivo, un commit, una rama, HEAD) **viajan** de su posición vieja a la
  nueva; los nuevos aparecen.
- **El subtítulo es la narración.** Es lo que se lee, lo que anuncia el lector de
  pantalla y lo que dice la voz. Corto (22 palabras o menos), en segunda persona.
- **La escena debe explicar sin leer.** Si un paso necesita el subtítulo para entenderse,
  falta un cambio visible (un archivo que se mueve, una rama que avanza, un foco).
- **Nada de colores ni dibujo en la lección.** Los colores salen de los tokens de estado
  Git (`--color-working`, `--color-staging`, `--color-local`, `--color-remote`).
- **Las afirmaciones se verifican** contra Pro Git en español y los enlaces de "Para
  profundizar" se comprueban antes de publicarlos.

## Dónde vive cada cosa

- `src/lessons/engine/schema.js` — el esquema de lección y escena (fuente de verdad).
- `src/lessons/engine/` — validación, layout del grafo, tiempos y reproducción (puros,
  con tests en `*.test.js`).
- `src/lessons/render/` — el reproductor y el dibujo SVG.
- `src/lessons/content/` — una lección por archivo y el registro `index.js` con el orden
  del temario.

## Paneles de una escena

| Panel | Para qué |
|---|---|
| `zones` | Working Directory, Staging Area y Repositorio, con archivos que se mueven entre ellos |
| `graph` | La historia local: commits, ramas y HEAD (incluye ramas `origin/*`) |
| `remote` | El mismo grafo en GitHub, al lado del local |
| `code` | Un archivo con líneas marcadas (nuestra versión, la entrante, marcadores, resuelta) |

Los commits marcados `ghost` se dibujan punteados: es historia reescrita (rebase).
`focus` ilumina lo que el subtítulo nombra.

## Agregar una lección

1. Crea `src/lessons/content/<id>.js` siguiendo una lección existente; `helpers.js`
   ofrece `commit()`, `graph()` y `proGit()`.
2. Regístrala en `src/lessons/content/index.js`.
3. `npm test`: el test oráculo rechaza padres o ramas inexistentes, focos que no están en
   la escena, archivos no declarados y enlaces sin https.
4. `npm run dev` y abre `/lab.html`: muestra la validación, el reproductor y una hoja de
   contactos con todos los pasos. `scripts/contact_sheets.py` la captura en ambos temas.

Si una idea necesita un panel nuevo (por ejemplo, el árbol de objetos de `.git`), se
agrega al esquema y al renderer para todas las lecciones, nunca como caso especial.
