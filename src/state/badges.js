// Catálogo inmutable de medallas. El estado del estudiante guarda solo los IDs desbloqueados.
export const BADGES = [
  { id: 'init', name: 'Repositorio Iniciado', desc: 'Inicializaste tu primer repositorio con git init.', icon: 'Terminal' },
  { id: 'commit', name: 'Creador de Historias', desc: 'Creaste tu primer commit local.', icon: 'GitCommit' },
  { id: 'branch', name: 'Explorador de Ramas', desc: 'Creaste una rama feature/login.', icon: 'GitBranch' },
  { id: 'merge', name: 'Maestro del Merge', desc: 'Fusionaste ramas con git merge exitosamente.', icon: 'GitMerge' },
  { id: 'restore', name: 'Viajero del Tiempo', desc: 'Descartaste cambios con git restore o reset.', icon: 'RotateCcw' },
  { id: 'remote', name: 'Enlazador de Nube', desc: 'Conectaste un repositorio remoto origin.', icon: 'CloudLightning' },
  { id: 'conflict', name: 'Domador de Conflictos', desc: 'Resolviste una colisión de código en merge/rebase.', icon: 'AlertTriangle' },
  { id: 'video_master', name: 'Autodidacta Visual', desc: 'Completaste todas las lecciones animadas.', icon: 'Video' },
  { id: 'quiz', name: 'Sabio de Git', desc: 'Respondiste correctamente todos los desafíos.', icon: 'Award' },
];
