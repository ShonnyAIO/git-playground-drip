import { commit, graph, proGit } from './helpers.js';

const c1 = commit('c1', [], 'saludo.js');
const c2 = commit('c2', ['c1'], 'Hola, UCV');
const c3 = commit('c3', ['c1'], 'Bienvenido');
const m1 = commit('m1', ['c2', 'c3'], 'Merge login');

const open = { id: 'l1', text: 'function saludar() {', kind: 'normal' };
const close = { id: 'l3', text: '}', kind: 'normal' };
const conflict = [
  open,
  { id: 'mHead', text: '<<<<<<< HEAD', kind: 'marker' },
  { id: 'ours', text: "  return 'Hola, UCV';", kind: 'ours' },
  { id: 'mSep', text: '=======', kind: 'marker' },
  { id: 'theirs', text: "  return 'Bienvenido';", kind: 'theirs' },
  { id: 'mEnd', text: '>>>>>>> login', kind: 'marker' },
  close,
];
const diverged = graph([c1, c2, c3], { main: 'c2', login: 'c3' });

export default {
  id: 'conflictos',
  title: 'Anatomía de un conflicto',
  level: 'Avanzado',
  objectives: [
    'Saber por qué ocurre un conflicto de merge.',
    'Leer los marcadores de conflicto y resolverlo.',
  ],
  practice: { tab: 'conflicts', label: 'Resolver un conflicto' },
  furtherReading: [
    proGit('Pro Git 3.2 — Principales conflictos que pueden surgir en las fusiones', 'Ramificaciones-en-Git-Procedimientos-B%C3%A1sicos-para-Ramificar-y-Fusionar'),
  ],
  steps: [
    {
      id: 'base',
      caption: 'saludo.js tiene tres líneas en c1. Las ramas main y login parten del mismo punto.',
      scene: {
        graph: graph([c1], { main: 'c1', login: 'c1' }),
        code: { file: 'saludo.js', lines: [open, { id: 'l2', text: "  return 'Hola';", kind: 'normal' }, close] },
      },
      focus: ['line:l2'],
    },
    {
      id: 'ours',
      command: 'git commit -am "Hola, UCV"',
      caption: 'En main cambias la línea 2 a «Hola, UCV» y haces commit: c2.',
      scene: {
        graph: graph([c1, c2], { main: 'c2', login: 'c1' }),
        code: { file: 'saludo.js (main)', lines: [open, { id: 'l2', text: "  return 'Hola, UCV';", kind: 'ours' }, close] },
      },
      focus: ['line:l2', 'commit:c2'],
    },
    {
      id: 'theirs',
      caption: 'En login, una compañera cambia la misma línea a «Bienvenido»: c3.',
      scene: {
        graph: diverged,
        code: { file: 'saludo.js (login)', lines: [open, { id: 'l2', text: "  return 'Bienvenido';", kind: 'theirs' }, close] },
      },
      focus: ['line:l2', 'commit:c3'],
    },
    {
      id: 'merge',
      command: 'git merge login',
      caption: 'git merge login se detiene: CONFLICT. Las dos ramas tocaron la misma línea y Git no elige por ti.',
      scene: { graph: diverged, code: { file: 'saludo.js (en conflicto)', lines: conflict } },
      focus: ['line:ours', 'line:theirs'],
    },
    {
      id: 'leer',
      caption: 'Entre <<<<<<< y ======= está tu versión (HEAD); entre ======= y >>>>>>> la que llega de login.',
      scene: { graph: diverged, code: { file: 'saludo.js (en conflicto)', lines: conflict } },
      focus: ['line:mHead', 'line:mSep', 'line:mEnd'],
    },
    {
      id: 'resolver',
      caption: 'Tú decides: borras los marcadores y escribes la versión final. Aquí combinas ambas ideas.',
      scene: {
        graph: diverged,
        code: { file: 'saludo.js (resuelto)', lines: [open, { id: 'final', text: "  return 'Hola, UCV. ¡Bienvenido!';", kind: 'added' }, close] },
      },
      focus: ['line:final'],
    },
    {
      id: 'commit',
      command: 'git add saludo.js && git commit',
      caption: 'git add marca el conflicto como resuelto y git commit crea la fusión m1, con dos padres.',
      scene: {
        graph: graph([c1, c2, c3, m1], { main: 'm1', login: 'c3' }),
        code: { file: 'saludo.js', lines: [open, { id: 'final', text: "  return 'Hola, UCV. ¡Bienvenido!';", kind: 'normal' }, close] },
      },
      focus: ['commit:m1'],
    },
    {
      id: 'resumen',
      caption: 'Conflicto = dos ramas cambian la misma zona del mismo archivo. Se resuelve editando, no adivinando.',
      scene: {
        graph: graph([c1, c2, c3, m1], { main: 'm1', login: 'c3' }),
        code: { file: 'saludo.js', lines: [open, { id: 'final', text: "  return 'Hola, UCV. ¡Bienvenido!';", kind: 'normal' }, close] },
      },
      focus: ['commit:m1'],
    },
  ],
};
