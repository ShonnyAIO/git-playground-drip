import { commit, graph, proGit } from './helpers.js';

const base = [commit('c1'), commit('c2', ['c1']), commit('c3', ['c2'])];
const c4 = commit('c4', ['c3'], 'Formulario de login');
const c5 = commit('c5', ['c3'], 'Arreglo en main');

export default {
  id: 'ramas-head',
  title: 'Ramas y HEAD',
  level: 'Básico',
  objectives: [
    'Entender que una rama es un puntero móvil a un commit.',
    'Saber qué indica HEAD y qué pasa al cambiar de rama.',
  ],
  practice: { tab: 'simulator', label: 'Crear ramas en el Simulador' },
  furtherReading: [
    proGit('Pro Git 3.1 — ¿Qué es una rama?', 'Ramificaciones-en-Git-%C2%BFQu%C3%A9-es-una-rama%3F'),
    { title: 'Aprende GIT ahora! curso completo GRATIS desde cero', author: 'HolaMundo (YouTube)', url: 'https://www.youtube.com/watch?v=VdGzPZ31ts8' },
    { title: 'Git Branches Tutorial', author: 'freeCodeCamp.org (YouTube, en inglés)', url: 'https://www.youtube.com/watch?v=e2IbNHi4uCI' },
  ],
  steps: [
    {
      id: 'lineal',
      caption: 'Tu historia tiene tres commits. La rama main es solo una etiqueta que apunta al último.',
      scene: { graph: graph(base, { main: 'c3' }) },
      focus: ['branch:main'],
    },
    {
      id: 'branch',
      command: 'git branch login',
      caption: 'git branch login crea otra etiqueta en el mismo commit. No copia ningún archivo.',
      scene: { graph: graph(base, { main: 'c3', login: 'c3' }) },
      focus: ['branch:login'],
    },
    {
      id: 'head',
      caption: 'HEAD marca dónde estás. Sigue en main: crear una rama no te cambia de rama.',
      scene: { graph: graph(base, { main: 'c3', login: 'c3' }) },
      focus: ['head'],
    },
    {
      id: 'switch',
      command: 'git switch login',
      caption: 'git switch login mueve HEAD a la nueva rama.',
      scene: { graph: graph(base, { main: 'c3', login: 'c3' }, 'login') },
      focus: ['head'],
    },
    {
      id: 'commit-login',
      command: 'git commit -m "Formulario de login"',
      caption: 'Al hacer commit nace c4, y solo avanza la rama donde está HEAD.',
      scene: { graph: graph([...base, c4], { main: 'c3', login: 'c4' }, 'login') },
      focus: ['commit:c4', 'branch:login'],
    },
    {
      id: 'volver',
      command: 'git switch main',
      caption: 'git switch main te devuelve: tus archivos vuelven a como estaban en c3.',
      scene: { graph: graph([...base, c4], { main: 'c3', login: 'c4' }) },
      focus: ['head'],
    },
    {
      id: 'diverge',
      command: 'git commit -m "Arreglo en main"',
      caption: 'Un commit en main crea c5. La historia se bifurca en dos líneas de trabajo paralelas.',
      scene: { graph: graph([...base, c4, c5], { main: 'c5', login: 'c4' }) },
      focus: ['commit:c5'],
    },
    {
      id: 'detached',
      command: 'git switch --detach c2',
      caption: 'Puedes visitar un commit viejo. HEAD queda suelto (detached): ya no apunta a ninguna rama.',
      scene: { graph: graph([...base, c4, c5], { main: 'c5', login: 'c4' }, { detached: 'c2' }) },
      focus: ['head', 'commit:c2'],
    },
    {
      id: 'resumen',
      command: 'git switch main',
      caption: 'Resumen: una rama es un puntero que avanza con cada commit; HEAD indica en qué rama estás.',
      scene: { graph: graph([...base, c4, c5], { main: 'c5', login: 'c4' }) },
      focus: ['branch:main', 'branch:login', 'head'],
    },
  ],
};
