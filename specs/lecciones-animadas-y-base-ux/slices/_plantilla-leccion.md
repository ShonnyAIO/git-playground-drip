# Contrato común de los slices de lección (06–11)

Cada lección es un archivo de datos `src/lessons/content/<id>.js` registrado en
`src/lessons/content/index.js`. No trae JSX ni colores propios.

**Verificación común**
- El test oráculo del slice 04 pasa (`validateLesson` vacío).
- Guion revisado contra Pro Git (capítulo indicado): ningún caption afirma algo que el
  libro contradiga. Los comandos mostrados son reales y su salida, plausible.
- Captions cortos (≤ 22 palabras), en castellano neutro, segunda persona ("tú").
- Hoja de contactos de la lección en `lab.html` capturada a 1440 px en ambos temas y
  guardada en `assets/<id>/`.
- Último chequeo: la skill `screenshot-critique` sobre la hoja de contactos. Variable del
  slice: **claridad del mecanismo** (¿se entiende el concepto mirando las escenas sin
  leer?). Fuera de alcance: estética del reproductor (slice 05).
- `furtherReading`: solo enlaces verificados (oEmbed o HTTP 200) con título y autor reales.

**Delegado al implementador**: redacción final de captions dentro del guion, duración de
cada paso, ids internos.

**Revisión humana (no bloqueante)**: al cerrar la lección, mostrar la hoja de contactos a
Shonny; si no responde en ~5 min, decidir con la evidencia, anotar la decisión en el
README y seguir.
