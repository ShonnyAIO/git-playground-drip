import { commit, graph, proGit } from './helpers.js';

const base = [commit('c1'), commit('c2', ['c1']), commit('c3', ['c2']), commit('c4', ['c3'], 'Avance en main')];
const c5 = commit('c5', ['c3'], 'Feature parte 1');
const c6 = commit('c6', ['c5'], 'Feature parte 2');
const ghost = (c) => ({ ...c, ghost: true });
const c5b = commit("c5'", ['c4'], 'Feature parte 1');
const c6b = commit("c6'", ["c5'"], 'Feature parte 2');
const rewritten = [...base, ghost(c5), ghost(c6), c5b, c6b];
const linear = [...base, c5b, c6b];

export default {
  id: 'rebase',
  title: 'Rebase vs merge',
  level: 'Avanzado',
  objectives: [
    'Ver que rebase crea commits nuevos y reescribe la historia.',
    'Saber cuándo no usar rebase.',
  ],
  practice: { tab: 'conflicts', label: 'Comparar merge y rebase' },
  furtherReading: [
    proGit('Pro Git 3.6 — Reorganizar el trabajo realizado', 'Ramificaciones-en-Git-Reorganizar-el-Trabajo-Realizado'),
    { title: 'Learn Git Branching (niveles de rebase, en español)', author: 'Peter Cottle', url: 'https://learngitbranching.js.org/?locale=es_AR' },
  ],
  steps: [
    {
      id: 'escenario',
      caption: 'Tu rama feature (c5 y c6) salió de c3, pero main siguió avanzando hasta c4.',
      scene: { graph: graph([...base, c5, c6], { main: 'c4', feature: 'c6' }, 'feature') },
      focus: ['branch:feature', 'commit:c4'],
    },
    {
      id: 'objetivo',
      caption: 'Quieres tu trabajo encima de lo último de main, como si hubieras empezado hoy.',
      scene: { graph: graph([...base, c5, c6], { main: 'c4', feature: 'c6' }, 'feature') },
      focus: ['commit:c4'],
    },
    {
      id: 'rebase',
      command: 'git rebase main',
      caption: "git rebase main copia c5 y c6 encima de c4. Las copias se llaman c5' y c6'.",
      scene: { graph: graph(rewritten, { main: 'c4', feature: "c6'" }, 'feature') },
      focus: ["commit:c5'", "commit:c6'"],
    },
    {
      id: 'hash',
      caption: 'Mismos cambios, pero commits nuevos con otro hash. Los originales quedan huérfanos: la historia se reescribió.',
      scene: { graph: graph(rewritten, { main: 'c4', feature: "c6'" }, 'feature') },
      focus: ['commit:c5', 'commit:c6'],
    },
    {
      id: 'peligro',
      caption: 'Si ya habías publicado c5 y c6, tu equipo los tiene: origin/feature sigue en la historia vieja.',
      scene: { graph: graph(rewritten, { main: 'c4', feature: "c6'", 'origin/feature': 'c6' }, 'feature') },
      focus: ['branch:origin/feature'],
    },
    {
      id: 'lineal',
      caption: 'Si nadie más tenía c5 y c6, puedes olvidarlos: la historia queda en línea recta.',
      scene: { graph: graph(linear, { main: 'c4', feature: "c6'" }, 'feature') },
      focus: ['branch:feature'],
    },
    {
      id: 'ff',
      command: 'git switch main && git merge feature',
      caption: 'Ahora integrar feature en main es un fast-forward limpio, sin commit de fusión.',
      scene: { graph: graph(linear, { main: "c6'", feature: "c6'" }) },
      focus: ['branch:main'],
    },
    {
      id: 'resumen',
      caption: 'Regla de oro: no hagas rebase de commits ya publicados. Merge conserva la historia; rebase la deja lineal.',
      scene: { graph: graph(linear, { main: "c6'", feature: "c6'" }) },
      focus: ['branch:main'],
    },
  ],
};
