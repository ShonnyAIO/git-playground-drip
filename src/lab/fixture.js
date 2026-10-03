// Lección mínima para probar el motor y el reproductor sin contenido real.
export const FIXTURE = {
  id: 'fixture',
  title: 'Fixture del motor',
  level: 'Básico',
  objectives: ['Ver zonas, grafo y código moverse entre pasos.'],
  practice: { tab: 'simulator', label: 'Practicar' },
  furtherReading: [],
  files: { readme: { name: 'README.md' } },
  steps: [
    {
      id: 'nuevo',
      caption: 'Creas README.md: aparece en tu carpeta de trabajo.',
      scene: {
        zones: { working: [{ file: 'readme', status: 'nuevo' }], staging: [], repo: [] },
        graph: { commits: [{ id: 'c1', parents: [], msg: 'Inicio' }], branches: { main: 'c1' }, head: { branch: 'main' } },
      },
      focus: ['file:readme'],
    },
    {
      id: 'add',
      caption: 'Con git add lo preparas para la próxima foto.',
      command: 'git add README.md',
      scene: {
        zones: { working: [], staging: [{ file: 'readme', status: 'nuevo' }], repo: [] },
        graph: { commits: [{ id: 'c1', parents: [], msg: 'Inicio' }], branches: { main: 'c1' }, head: { branch: 'main' } },
      },
      focus: ['zone:staging'],
    },
    {
      id: 'commit',
      caption: 'Con git commit nace un commit nuevo y main avanza hasta él.',
      command: 'git commit -m "Agrega README"',
      scene: {
        zones: { working: [], staging: [], repo: ['c2'] },
        graph: {
          commits: [{ id: 'c1', parents: [], msg: 'Inicio' }, { id: 'c2', parents: ['c1'], msg: 'Agrega README' }],
          branches: { main: 'c2' },
          head: { branch: 'main' },
        },
        code: { file: 'README.md', lines: [{ id: 'l1', text: '# Mi proyecto', kind: 'added' }] },
      },
      focus: ['commit:c2', 'branch:main'],
    },
  ],
};
