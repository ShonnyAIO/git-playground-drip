/**
 * Esquema de las lecciones animadas. Una lección es DATOS: no trae JSX ni colores.
 * Cada paso describe su escena COMPLETA (no un diff) para poder saltar a cualquier paso
 * y para que el renderer anime por `key` estable entre pasos.
 *
 * @typedef {'Básico'|'Intermedio'|'Avanzado'} Level
 * @typedef {{ file: string, status: 'nuevo'|'modificado' }} ZoneEntry
 * @typedef {{ working: ZoneEntry[], staging: ZoneEntry[], repo: string[] }} Zones   repo = ids de commit
 * @typedef {{ id: string, parents: string[], msg: string, ghost?: boolean }} Commit  ghost = historia reescrita
 * @typedef {{ branch: string } | { detached: string }} Head
 * @typedef {{ commits: Commit[], branches: Record<string, string>, head: Head }} Graph
 *   Las ramas `origin/*` son de seguimiento remoto: no asignan carril ni pueden ser HEAD.
 * @typedef {{ id: string, text: string, kind: 'normal'|'ours'|'theirs'|'marker'|'added' }} CodeLine
 * @typedef {{ file: string, lines: CodeLine[] }} Code
 * @typedef {{ zones?: Zones, graph?: Graph, remote?: Graph, code?: Code }} Scene
 *
 * @typedef {object} Step
 * @property {string} id         único dentro de la lección
 * @property {string} caption    subtítulo = narración (fuente de verdad)
 * @property {string} [command]  comando que "se ejecuta" en este paso
 * @property {number} [durationMs] si falta, se deriva del caption (ver timing.js)
 * @property {string[]} [focus]  'file:x' | 'commit:id' | 'branch:nombre' | 'line:id' | 'zone:working|staging|repo' | 'head'
 * @property {Scene} scene
 *
 * @typedef {object} Lesson
 * @property {string} id         slug estable; se guarda en completedLessons
 * @property {string} title
 * @property {Level} level
 * @property {string[]} objectives
 * @property {{ tab: 'simulator'|'github'|'conflicts', label: string }} practice
 * @property {{ title: string, author: string, url: string }[]} furtherReading
 * @property {Record<string, { name: string }>} [files]
 * @property {Step[]} steps
 */

export const LEVELS = ['Básico', 'Intermedio', 'Avanzado'];
export const PRACTICE_TABS = ['simulator', 'github', 'conflicts'];
export const LINE_KINDS = ['normal', 'ours', 'theirs', 'marker', 'added'];
export const ZONE_NAMES = ['working', 'staging', 'repo'];

export const isRemoteTracking = (branch) => branch.startsWith('origin/');
