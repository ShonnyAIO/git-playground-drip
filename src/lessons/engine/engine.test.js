import { describe, expect, it } from 'vitest';
import { layoutGraph, lessonDuration, stepDuration, validateLesson } from './index.js';
import { LESSONS } from '../content/index.js';

const c = (id, ...parents) => ({ id, parents, msg: id });
const lesson = (steps, extra = {}) => ({
  id: 'prueba', title: 'Prueba', level: 'Básico', objectives: ['x'],
  practice: { tab: 'simulator', label: 'Practicar' }, furtherReading: [],
  files: { a: { name: 'a.txt' } }, steps, ...extra,
});
const graph = { commits: [c('c1'), c('c2', 'c1')], branches: { main: 'c2' }, head: { branch: 'main' } };
const step = (scene, extra = {}) => ({ id: 's1', caption: 'Un paso', scene, ...extra });

describe('validateLesson', () => {
  it('acepta una lección válida', () => {
    expect(validateLesson(lesson([step({ graph, zones: { working: [{ file: 'a', status: 'nuevo' }], staging: [], repo: ['c2'] } }, { focus: ['file:a', 'commit:c1', 'branch:main', 'head'] })]))).toEqual([]);
  });

  it.each([
    ['ids de paso duplicados', lesson([step({ graph }), step({ graph })]), 'duplicado'],
    ['caption vacío', lesson([step({ graph }, { caption: '  ' })]), 'caption vacío'],
    ['escena vacía', lesson([step({})]), 'escena vacía'],
    ['padre inexistente', lesson([step({ graph: { ...graph, commits: [c('c1', 'x')], branches: { main: 'c1' } } })]), 'padre inexistente'],
    ['rama a commit inexistente', lesson([step({ graph: { ...graph, branches: { main: 'zz' } } })]), 'apunta a un commit inexistente'],
    ['HEAD a rama inexistente', lesson([step({ graph: { ...graph, head: { branch: 'dev' } } })]), 'rama inexistente'],
    ['HEAD a rama remota', lesson([step({ graph: { ...graph, branches: { main: 'c2', 'origin/main': 'c1' }, head: { branch: 'origin/main' } } })]), 'rama remota'],
    ['HEAD detached inexistente', lesson([step({ graph: { ...graph, head: { detached: 'zz' } } })]), 'detached'],
    ['archivo no declarado', lesson([step({ zones: { working: [{ file: 'b', status: 'nuevo' }], staging: [], repo: [] } })]), 'no declarado'],
    ['repo con commit fuera del grafo', lesson([step({ graph, zones: { working: [], staging: [], repo: ['c9'] } })]), 'no está en graph'],
    ['focus ausente', lesson([step({ graph }, { focus: ['commit:c9'] })]), 'focus'],
    ['tipo de línea inválido', lesson([step({ code: { file: 'a', lines: [{ id: 'l1', text: 'x', kind: 'raro' }] } })]), 'tipo de línea'],
    ['lectura sin https', lesson([step({ graph })], { furtherReading: [{ title: 't', author: 'a', url: 'http://x' }] }), 'https'],
    ['nivel inválido', lesson([step({ graph })], { level: 'Experto' }), 'nivel'],
  ])('detecta: %s', (_, l, fragment) => {
    const errors = validateLesson(l);
    expect(errors.some(e => e.includes(fragment)), errors.join('\n')).toBe(true);
  });
});

const xy = (layout) => Object.fromEntries(layout.nodes.map(n => [n.id, [n.x, n.y]]));

describe('layoutGraph', () => {
  it('historia lineal: un carril', () => {
    const l = layoutGraph({ commits: [c('c1'), c('c2', 'c1'), c('c3', 'c2')], branches: { main: 'c3' }, head: { branch: 'main' } });
    expect(xy(l)).toEqual({ c1: [0, 0], c2: [1, 0], c3: [2, 0] });
    expect(l.rows).toBe(1);
    expect(l.head).toEqual({ commitId: 'c3', branch: 'main', x: 2, y: 0 });
  });

  it('rama divergente: dos carriles; main primero aunque se declare después', () => {
    const l = layoutGraph({ commits: [c('c1'), c('c2', 'c1'), c('c3', 'c1')], branches: { login: 'c3', main: 'c2' }, head: { branch: 'login' } });
    expect(xy(l)).toEqual({ c1: [0, 0], c2: [1, 0], c3: [1, 1] });
  });

  it('merge de 3 vías: el commit de fusión queda en el carril de main', () => {
    const l = layoutGraph({ commits: [c('c1'), c('c2', 'c1'), c('c3', 'c1'), c('m', 'c2', 'c3')], branches: { main: 'm', login: 'c3' }, head: { branch: 'main' } });
    expect(xy(l)).toEqual({ c1: [0, 0], c2: [1, 0], c3: [1, 1], m: [2, 0] });
    expect(l.edges).toContainEqual({ from: 'c3', to: 'm' });
  });

  it('rebase: los ghost quedan en un carril propio debajo de la historia nueva', () => {
    const l = layoutGraph({
      commits: [c('c1'), c('c2', 'c1'), c('c3', 'c1'), c('c4', 'c3'), c("c3'", 'c2'), c("c4'", "c3'")].map(x => (x.id === 'c3' || x.id === 'c4' ? { ...x, ghost: true } : x)),
      branches: { main: 'c2', feature: "c4'" }, head: { branch: 'feature' },
    });
    expect(xy(l)).toEqual({ c1: [0, 0], c2: [1, 0], c3: [1, 2], c4: [2, 2], "c3'": [2, 1], "c4'": [3, 1] });
    expect(l.nodes.filter(n => n.ghost).map(n => n.id)).toEqual(['c3', 'c4']);
  });

  it('HEAD detached y ramas remotas', () => {
    const l = layoutGraph({ commits: [c('c1'), c('c2', 'c1')], branches: { main: 'c2', 'origin/main': 'c1' }, head: { detached: 'c1' } });
    expect(l.head).toEqual({ commitId: 'c1', branch: null, x: 0, y: 0 });
    expect(l.labels.find(x => x.branch === 'origin/main').remoteTracking).toBe(true);
    expect(l.rows).toBe(1);
  });

  it('apila etiquetas que apuntan al mismo commit', () => {
    const l = layoutGraph({ commits: [c('c1')], branches: { main: 'c1', login: 'c1' }, head: { branch: 'login' } });
    expect(l.labels.map(x => [x.branch, x.stack, x.isHead])).toEqual([['main', 0, false], ['login', 1, true]]);
  });
});

describe('timing', () => {
  it('deriva la duración del caption con un mínimo, y la velocidad la divide', () => {
    expect(stepDuration({ caption: 'corto' })).toBe(3500);
    expect(stepDuration({ caption: Array(20).fill('palabra').join(' ') })).toBe(7600);
    expect(stepDuration({ caption: 'x', durationMs: 2000 }, 2)).toBe(1000);
    expect(lessonDuration({ steps: [{ caption: 'a' }, { caption: 'b' }] })).toBe(7000);
  });
});

describe('contenido registrado', () => {
  it('los ids de lección son únicos', () => {
    const ids = LESSONS.map(l => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(LESSONS.map(l => [l.id, l]))('la lección "%s" es válida', (_, l) => {
    expect(validateLesson(l)).toEqual([]);
  });
});
