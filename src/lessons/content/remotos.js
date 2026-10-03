import { commit, graph, proGit } from './helpers.js';

const c1 = commit('c1');
const c2 = commit('c2', ['c1']);
const c3 = commit('c3', ['c2'], 'Commit del compañero');
const c4 = commit('c4', ['c3'], 'Tu commit');

export default {
  id: 'remotos',
  title: 'Remotos: push, fetch y pull',
  level: 'Intermedio',
  objectives: [
    'Entender que el remoto es otra copia del grafo.',
    'Distinguir fetch de pull (pull = fetch + merge).',
  ],
  practice: { tab: 'github', label: 'Practicar en GitHub Hub' },
  furtherReading: [
    proGit('Pro Git 3.5 — Ramas remotas', 'Ramificaciones-en-Git-Ramas-Remotas'),
    { title: 'Git and GitHub for Beginners - Crash Course', author: 'freeCodeCamp.org (YouTube, en inglés)', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
  ],
  steps: [
    {
      id: 'local',
      caption: 'Tu repositorio vive en tu computadora: c1 y c2 en la rama main.',
      scene: { graph: graph([c1, c2], { main: 'c2' }) },
      focus: ['branch:main'],
    },
    {
      id: 'remote-add',
      command: 'git remote add origin https://github.com/ucv/proyecto.git',
      caption: 'git remote add guarda la dirección del repositorio en GitHub con el nombre origin. Todavía no envía nada.',
      scene: { graph: graph([c1, c2], { main: 'c2' }) },
      focus: ['head'],
    },
    {
      id: 'push',
      command: 'git push -u origin main',
      caption: 'git push envía tus commits a GitHub. origin/main recuerda dónde está main en el remoto.',
      scene: {
        graph: graph([c1, c2], { main: 'c2', 'origin/main': 'c2' }),
        remote: graph([c1, c2], { main: 'c2' }),
      },
      focus: ['branch:origin/main'],
    },
    {
      id: 'companero',
      caption: 'Un compañero empuja c3 a GitHub. Tu repositorio todavía no se entera.',
      scene: {
        graph: graph([c1, c2], { main: 'c2', 'origin/main': 'c2' }),
        remote: graph([c1, c2, c3], { main: 'c3' }),
      },
      focus: ['commit:c3'],
    },
    {
      id: 'fetch',
      command: 'git fetch',
      caption: 'git fetch descarga c3 y mueve origin/main. Tu rama main no se mueve.',
      scene: {
        graph: graph([c1, c2, c3], { main: 'c2', 'origin/main': 'c3' }),
        remote: graph([c1, c2, c3], { main: 'c3' }),
      },
      focus: ['branch:origin/main'],
    },
    {
      id: 'merge',
      command: 'git merge origin/main',
      caption: 'git merge origin/main adelanta main. Eso es exactamente git pull: fetch más merge.',
      scene: {
        graph: graph([c1, c2, c3], { main: 'c3', 'origin/main': 'c3' }),
        remote: graph([c1, c2, c3], { main: 'c3' }),
      },
      focus: ['branch:main'],
    },
    {
      id: 'adelante',
      command: 'git commit -m "Tu commit"',
      caption: 'Haces el commit c4. Tu main va un commit por delante de origin/main.',
      scene: {
        graph: graph([c1, c2, c3, c4], { main: 'c4', 'origin/main': 'c3' }),
        remote: graph([c1, c2, c3], { main: 'c3' }),
      },
      focus: ['commit:c4'],
    },
    {
      id: 'push-2',
      command: 'git push',
      caption: 'git push publica c4. Tu repositorio y GitHub vuelven a coincidir.',
      scene: {
        graph: graph([c1, c2, c3, c4], { main: 'c4', 'origin/main': 'c4' }),
        remote: graph([c1, c2, c3, c4], { main: 'c4' }),
      },
      focus: ['branch:origin/main'],
    },
  ],
};
