import { commit, graph, proGit } from './helpers.js';

const c1 = commit('c1');
const c2 = commit('c2', ['c1']);
const c3 = commit('c3', ['c2'], 'Arreglo urgente');
const c4 = commit('c4', ['c3'], 'Nueva portada');
const c5 = commit('c5', ['c3'], 'Login');
const m1 = commit('m1', ['c4', 'c5'], 'Merge login');

export default {
  id: 'merge',
  title: 'Merge: fast-forward y de 3 vías',
  level: 'Intermedio',
  objectives: [
    'Predecir si un merge será fast-forward o creará un commit de fusión.',
    'Reconocer el ancestro común de dos ramas.',
  ],
  practice: { tab: 'simulator', label: 'Fusionar ramas en el Simulador' },
  furtherReading: [
    proGit('Pro Git 3.2 — Procedimientos básicos para ramificar y fusionar', 'Ramificaciones-en-Git-Procedimientos-B%C3%A1sicos-para-Ramificar-y-Fusionar'),
    { title: 'Git Branches Tutorial', author: 'freeCodeCamp.org (YouTube, en inglés)', url: 'https://www.youtube.com/watch?v=e2IbNHi4uCI' },
  ],
  steps: [
    {
      id: 'escenario',
      caption: 'main está en c2 y la rama hotfix tiene un arreglo en c3.',
      scene: { graph: graph([c1, c2, c3], { main: 'c2', hotfix: 'c3' }) },
      focus: ['branch:hotfix'],
    },
    {
      id: 'ancestro',
      caption: 'c3 desciende directamente de c2: main no tiene trabajo propio que combinar.',
      scene: { graph: graph([c1, c2, c3], { main: 'c2', hotfix: 'c3' }) },
      focus: ['commit:c2'],
    },
    {
      id: 'ff',
      command: 'git merge hotfix',
      caption: 'git merge hotfix solo desliza main hasta c3. Es un fast-forward: no crea ningún commit nuevo.',
      scene: { graph: graph([c1, c2, c3], { main: 'c3', hotfix: 'c3' }) },
      focus: ['branch:main'],
    },
    {
      id: 'borrar',
      command: 'git branch -d hotfix',
      caption: 'Ya integrada, borras la rama. El commit c3 queda en la historia de main.',
      scene: { graph: graph([c1, c2, c3], { main: 'c3' }) },
      focus: ['commit:c3'],
    },
    {
      id: 'divergen',
      caption: 'Ahora main avanzó a c4 mientras tu compañero trabajó en login (c5). Las ramas divergieron.',
      scene: { graph: graph([c1, c2, c3, c4, c5], { main: 'c4', login: 'c5' }) },
      focus: ['commit:c4', 'commit:c5'],
    },
    {
      id: 'base',
      caption: 'Git compara tres versiones: el ancestro común c3, la punta de main y la punta de login.',
      scene: { graph: graph([c1, c2, c3, c4, c5], { main: 'c4', login: 'c5' }) },
      focus: ['commit:c3', 'commit:c4', 'commit:c5'],
    },
    {
      id: 'merge3',
      command: 'git merge login',
      caption: 'git merge login crea m1, un commit de fusión con dos padres. main avanza hasta él.',
      scene: { graph: graph([c1, c2, c3, c4, c5, m1], { main: 'm1', login: 'c5' }) },
      focus: ['commit:m1'],
    },
    {
      id: 'resumen',
      caption: 'Si una rama contiene a la otra: fast-forward. Si divergen: commit de fusión. Con --no-ff siempre se crea uno.',
      scene: { graph: graph([c1, c2, c3, c4, c5, m1], { main: 'm1', login: 'c5' }) },
      focus: ['branch:main'],
    },
  ],
};
