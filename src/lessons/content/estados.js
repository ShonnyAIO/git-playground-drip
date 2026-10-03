import { commit, graph, proGit } from './helpers.js';

const files = { index: { name: 'index.html' }, estilos: { name: 'estilos.css' } };
const empty = { working: [], staging: [], repo: [] };
const c1 = commit('c1', [], 'Página inicial');
const c2 = commit('c2', ['c1'], 'Estilos y portada');

export default {
  id: 'estados',
  title: 'Los tres estados de Git',
  level: 'Básico',
  objectives: [
    'Distinguir Working Directory, Staging Area y Repositorio.',
    'Saber qué mueve git add y qué mueve git commit.',
  ],
  practice: { tab: 'simulator', label: 'Practicar en el Simulador' },
  furtherReading: [
    proGit('Pro Git 1.3 — Fundamentos de Git', 'Inicio---Sobre-el-Control-de-Versiones-Fundamentos-de-Git'),
    proGit('Pro Git 2.2 — Guardando cambios en el repositorio', 'Fundamentos-de-Git-Guardando-cambios-en-el-Repositorio'),
    { title: 'Git y Github | Curso Práctico de Git y Github Desde Cero', author: 'Fazt (YouTube)', url: 'https://www.youtube.com/watch?v=HiXLkL42tMU' },
  ],
  files,
  steps: [
    {
      id: 'zonas',
      caption: 'Git vigila tu proyecto en tres lugares: tu carpeta de trabajo, el área de preparación y el repositorio.',
      scene: { zones: empty },
      focus: ['zone:working', 'zone:staging', 'zone:repo'],
    },
    {
      id: 'init',
      command: 'git init',
      caption: 'git init crea el repositorio: una carpeta oculta .git donde vivirá toda la historia.',
      scene: { zones: empty },
      focus: ['zone:repo'],
    },
    {
      id: 'crear',
      caption: 'Creas index.html y estilos.css. Git los ve, pero todavía no guarda nada de ellos.',
      scene: { zones: { ...empty, working: [{ file: 'index', status: 'nuevo' }, { file: 'estilos', status: 'nuevo' }] } },
      focus: ['zone:working'],
    },
    {
      id: 'add-index',
      command: 'git add index.html',
      caption: 'git add elige qué entra en la próxima foto. Solo index.html pasa a preparación.',
      scene: { zones: { ...empty, working: [{ file: 'estilos', status: 'nuevo' }], staging: [{ file: 'index', status: 'nuevo' }] } },
      focus: ['file:index'],
    },
    {
      id: 'commit-1',
      command: 'git commit -m "Página inicial"',
      caption: 'git commit toma la foto: nace el commit c1 con lo que estaba preparado.',
      scene: {
        zones: { ...empty, working: [{ file: 'estilos', status: 'nuevo' }], repo: ['c1'] },
        graph: graph([c1], { main: 'c1' }),
      },
      focus: ['commit:c1'],
    },
    {
      id: 'pendiente',
      caption: 'estilos.css sigue en tu carpeta: lo que no preparas no entra en el commit.',
      scene: {
        zones: { ...empty, working: [{ file: 'estilos', status: 'nuevo' }], repo: ['c1'] },
        graph: graph([c1], { main: 'c1' }),
      },
      focus: ['file:estilos'],
    },
    {
      id: 'editar',
      caption: 'Editas index.html. Git nota que cambió respecto al último commit y lo marca como modificado.',
      scene: {
        zones: { ...empty, working: [{ file: 'estilos', status: 'nuevo' }, { file: 'index', status: 'modificado' }], repo: ['c1'] },
        graph: graph([c1], { main: 'c1' }),
      },
      focus: ['file:index'],
    },
    {
      id: 'add-todo',
      command: 'git add .',
      caption: 'git add . prepara todos los cambios de la carpeta de una vez.',
      scene: {
        zones: { ...empty, staging: [{ file: 'estilos', status: 'nuevo' }, { file: 'index', status: 'modificado' }], repo: ['c1'] },
        graph: graph([c1], { main: 'c1' }),
      },
      focus: ['zone:staging'],
    },
    {
      id: 'commit-2',
      command: 'git commit -m "Estilos y portada"',
      caption: 'Nace c2, que apunta a su padre c1. Esa cadena de commits es la historia del proyecto.',
      scene: {
        zones: { ...empty, repo: ['c1', 'c2'] },
        graph: graph([c1, c2], { main: 'c2' }),
      },
      focus: ['commit:c2'],
    },
    {
      id: 'resumen',
      command: 'git status',
      caption: 'Resumen: editas en tu carpeta, git add prepara y git commit guarda. git status te dice dónde está cada archivo.',
      scene: {
        zones: { ...empty, repo: ['c1', 'c2'] },
        graph: graph([c1, c2], { main: 'c2' }),
      },
      focus: ['zone:working', 'zone:staging', 'zone:repo'],
    },
  ],
};
