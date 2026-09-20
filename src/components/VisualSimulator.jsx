import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Terminal as TermIcon, 
  CornerDownLeft, 
  FileText, 
  Plus, 
  RefreshCw, 
  ArrowRight,
  GitCommit,
  GitBranch,
  GitMerge,
  Info,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function VisualSimulator({ progress, setProgress, addTutorMessage, unlockBadge, setGitContext }) {
  // Git State
  const [gitInit, setGitInit] = useState(false);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [branches, setBranches] = useState({ main: 'c0' });
  const [files, setFiles] = useState({
    'README.md': 'untracked',
    'index.html': 'untracked',
    'app.js': 'untracked'
  });
  
  // Starting commit: c0 is the initial commit
  const [commits, setCommits] = useState([
    { id: 'c0', hash: '3a5b2f1', message: 'Initial commit', parent: null, branch: 'main', x: 80, y: 125 }
  ]);

  // Terminal state
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [terminalLogs, setTerminalLogs] = useState([
    'Bienvenido al simulador interactivo de Git.',
    'Escribe un comando o usa los botones de asistencia rápida para comenzar.',
    'Consejo: Empieza inicializando tu repositorio con "git init".'
  ]);
  const terminalEndRef = useRef(null);

  // Mission Selection State
  const [activeMission, setActiveMission] = useState('branching'); // 'branching' or 'undo'
  
  // Mission 1 Steps Progress Check
  const m1Steps = {
    init: gitInit,
    commitMain: commits.some(c => c.branch === 'main' && c.id !== 'c0'),
    createBranch: Object.keys(branches).includes('feature/login') || Object.keys(branches).includes('feature-login'),
    commitBranch: commits.some(c => c.branch === 'feature/login' || c.branch === 'feature-login'),
    merge: commits.some(c => c.message.toLowerCase().includes('merge'))
  };

  // Mission 2 Steps Progress Check
  const [m2Step, setM2Step] = useState(1); // 1: Modify file, 2: Restore/Discard, 3: Add & Commit, 4: Reset/Revert
  const [m2Modified, setM2Modified] = useState(false);
  const [m2Restored, setM2Restored] = useState(false);
  const [m2Committed, setM2Committed] = useState(false);
  const [m2ResetDone, setM2ResetDone] = useState(false);
  const [m2Completed, setM2Completed] = useState(false);

  // Sync state to parent gitContext for ShonnyProxy AI Tutor
  useEffect(() => {
    if (setGitContext) {
      setGitContext({
        currentBranch,
        branches: Object.keys(branches),
        commits: commits.map(c => ({ id: c.id, message: c.message })),
        workingDirectory: Object.keys(files).filter(f => files[f] === 'modified' || files[f] === 'untracked'),
        stagingArea: Object.keys(files).filter(f => files[f] === 'staged'),
        lastCommands: terminalLogs.filter(l => typeof l === 'string' && l.startsWith('$')).map(l => l.replace('$', '').trim())
      });
    }
  }, [currentBranch, branches, files, commits, terminalLogs, setGitContext]);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Mission 1 completion detection
  useEffect(() => {
    const m1Done = m1Steps.init && m1Steps.commitMain && m1Steps.createBranch && m1Steps.commitBranch && m1Steps.merge;

    if (m1Done && !progress.simulator) {
      setProgress(prev => ({ ...prev, simulator: true }));
      logTerminal('🎉 ¡FELICITACIONES! Has completado la Misión 1: Tu primer flujo de ramas.');
      addTutorMessage(
        '¡Increíble trabajo! Has completado el simulador local para la fusión de ramas. Lograste inicializar un repositorio, staged/commit de archivos, creaste una rama paralela (feature/login) para desarrollar código seguro, e hiciste una fusión (merge). ¡Intenta ahora completar la Misión 2 para dominar la recuperación ante errores!'
      );
    }
  }, [commits, branches, gitInit, progress.simulator]);

  // Mission 2 completion detection
  useEffect(() => {
    if (m2ResetDone && !m2Completed) {
      setM2Completed(true);
      logTerminal('🎉 ¡SOBERBIO! Has completado la Misión 2: Recuperación ante Desastres.');
      addTutorMessage(
        '¡Formidable! Completaste la Misión 2 de Git Core. Aprendiste a descartar modificaciones con "git restore" y a deshacer commits erróneos moviendo la historia con "git reset --hard". Estas son las destrezas de control de daños más valiosas en el trabajo real.'
      );
    }
  }, [m2ResetDone]);

  // Helper to log terminal messages
  const logTerminal = (msg) => {
    setTerminalLogs(prev => [...prev, msg]);
  };

  // Create or modify files in the working directory
  const modifyOrCreateFile = (filename, isNew = false) => {
    if (!gitInit) {
      logTerminal('error: No se ha inicializado un repositorio Git. Ejecuta "git init" primero.');
      return;
    }
    setFiles(prev => {
      const currentStatus = prev[filename];
      let newStatus = 'untracked';
      
      if (isNew) {
        newStatus = 'untracked';
      } else if (currentStatus === 'committed' || currentStatus === 'local') {
        newStatus = 'modified';
      } else if (currentStatus === 'untracked') {
        newStatus = 'untracked';
      } else {
        newStatus = 'modified';
      }

      logTerminal(`Working Directory: Se ha ${isNew ? 'creado' : 'modificado'} el archivo ${filename}`);
      
      if (activeMission === 'undo' && !isNew) {
        setM2Modified(true);
        if (m2Step === 1) {
          setM2Step(2);
          addTutorMessage(
            '¡Excelente! Modificaste un archivo. Ahora está en color rojo (Working Directory). Para descartar esta modificación y volver al estado limpio anterior, ejecuta: "git restore ' + filename + '" o "git checkout -- ' + filename + '".'
          );
        }
      }
      
      return { ...prev, [filename]: newStatus };
    });
  };

  const handleCreateNewFile = () => {
    const name = prompt('Nombre del nuevo archivo (ej: style.css):');
    if (name) {
      if (files[name]) {
        alert('El archivo ya existe.');
        return;
      }
      modifyOrCreateFile(name, true);
    }
  };

  // Parser of custom simulator commands
  const executeCommand = (cmdText) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    logTerminal(`$ ${trimmed}`);
    setInputVal('');

    const tokens = trimmed.split(/\s+/);
    const cmd = tokens[0];

    if (cmd !== 'git') {
      logTerminal(`bash: command not found: ${cmd}`);
      // Simple terminal shake trigger in UX: add CSS class to input parent
      const termInput = document.getElementById('terminal-user-input');
      if (termInput) {
        termInput.parentElement.classList.add('shake-error');
        setTimeout(() => termInput.parentElement.classList.remove('shake-error'), 400);
      }
      return;
    }

    if (tokens.length === 1) {
      logTerminal('git: subcomando requerido. Escribe "git init", "git status", etc.');
      return;
    }

    const sub = tokens[1];

    // git init
    if (sub === 'init') {
      if (gitInit) {
        logTerminal('Reinitialized existing Git repository in /home/workspace/project/.git/');
      } else {
        setGitInit(true);
        setFiles(prev => {
          const updated = {};
          Object.keys(prev).forEach(k => { updated[k] = 'untracked'; });
          return updated;
        });
        logTerminal('Initialized empty Git repository in /home/workspace/project/.git/');
        unlockBadge('init');
        addTutorMessage(
          '¡Excelente! Has inicializado el repositorio con "git init". Esto crea un directorio oculto ".git". Ahora puedes modificar archivos en tu "Working Directory" (en rojo) y prepararlos.'
        );
      }
      return;
    }

    // Commands below require git initialization
    if (!gitInit) {
      logTerminal('fatal: not a git repository (or any of the parent directories): .git');
      return;
    }

    // git status
    if (sub === 'status') {
      const untracked = Object.keys(files).filter(f => files[f] === 'untracked');
      const modified = Object.keys(files).filter(f => files[f] === 'modified');
      const staged = Object.keys(files).filter(f => files[f] === 'staged');

      logTerminal(`On branch ${currentBranch}`);
      
      if (staged.length > 0) {
        logTerminal('Changes to be committed:');
        staged.forEach(f => logTerminal(`  (use "git restore --staged <file>..." to unstage)`));
        staged.forEach(f => logTerminal(`\tstaged:    ${f}`));
      }
      
      if (modified.length > 0) {
        logTerminal('Changes not staged for commit:');
        logTerminal('  (use "git add <file>..." to update what will be committed)');
        modified.forEach(f => logTerminal(`\tmodified:  ${f}`));
      }

      if (untracked.length > 0) {
        logTerminal('Untracked files:');
        logTerminal('  (use "git add <file>..." to include in what will be committed)');
        untracked.forEach(f => logTerminal(`\tuntracked: ${f}`));
      }

      if (untracked.length === 0 && modified.length === 0 && staged.length === 0) {
        logTerminal('nothing to commit, working tree clean');
      }
      return;
    }

    // git add
    if (sub === 'add') {
      if (tokens.length < 3) {
        logTerminal('Nothing specified, nothing added. Maybe you wanted to say "git add ."?');
        return;
      }
      const fileTarget = tokens[2];
      
      if (fileTarget === '.') {
        setFiles(prev => {
          const next = { ...prev };
          let addedCount = 0;
          Object.keys(next).forEach(f => {
            if (next[f] === 'untracked' || next[f] === 'modified') {
              next[f] = 'staged';
              addedCount++;
            }
          });
          logTerminal(`Staged ${addedCount} archivos en el Staging Area.`);
          return next;
        });
      } else {
        if (!files[fileTarget]) {
          logTerminal(`fatal: pathspec '${fileTarget}' did not match any files`);
          return;
        }
        setFiles(prev => {
          logTerminal(`Añadido ${fileTarget} al Staging Area.`);
          return { ...prev, [fileTarget]: 'staged' };
        });
      }
      return;
    }

    // git restore (rollback unstaged changes)
    if (sub === 'restore') {
      if (tokens.length < 3) {
        logTerminal('error: debes especificar un archivo para restaurar.');
        return;
      }
      const fileTarget = tokens[2];
      if (!files[fileTarget]) {
        logTerminal(`fatal: pathspec '${fileTarget}' did not match any files`);
        return;
      }

      setFiles(prev => {
        const next = { ...prev };
        if (next[fileTarget] === 'modified') {
          next[fileTarget] = 'committed';
          logTerminal(`Restaurado ${fileTarget} al último estado guardado.`);
          unlockBadge('restore');
          
          if (activeMission === 'undo' && m2Step === 2) {
            setM2Restored(true);
            setM2Step(3);
            addTutorMessage(
              '¡Sensacional! Descartaste la modificación local. Ahora, para aprender a deshacer un commit ya grabado en la historia, modifica un archivo de nuevo (ej. click en "Editar README"), prepáralo con "git add ." y crea un commit con "git commit -m \'mensaje\'".'
            );
          }
        } else if (next[fileTarget] === 'staged') {
          next[fileTarget] = 'modified';
          logTerminal(`Sacado ${fileTarget} del Staging Area.`);
        } else {
          logTerminal(`El archivo ${fileTarget} ya está limpio.`);
        }
        return next;
      });
      return;
    }

    // git commit
    if (sub === 'commit') {
      const isStagedEmpty = !Object.values(files).includes('staged');
      if (isStagedEmpty) {
        logTerminal('On branch ' + currentBranch);
        logTerminal('nothing to commit, working tree clean');
        return;
      }

      let msgIndex = trimmed.indexOf('-m');
      let msg = '';
      if (msgIndex !== -1) {
        const remaining = trimmed.substring(msgIndex + 2).trim();
        msg = remaining.replace(/^['"]|['"]$/g, ''); // strip quotes
      }

      if (!msg) {
        logTerminal('error: commit message is required. Use -m "message".');
        return;
      }

      // Add a commit node
      const parentId = branches[currentBranch];
      const parentNode = commits.find(c => c.id === parentId);
      
      const newId = 'c' + commits.length;
      const hash = Math.random().toString(16).substring(2, 9);
      
      // Calculate coordinates dynamically
      const nextX = (parentNode ? parentNode.x : 80) + 110;
      let nextY = 125;
      if (currentBranch !== 'main') {
        nextY = 65; // Draw branch feature on top line
      }

      const newCommit = {
        id: newId,
        hash,
        message: msg,
        parent: parentId,
        branch: currentBranch,
        x: nextX,
        y: nextY
      };

      setCommits(prev => [...prev, newCommit]);
      setBranches(prev => ({ ...prev, [currentBranch]: newId }));
      unlockBadge('commit');
      
      // Mark files as committed
      setFiles(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(f => {
          if (next[f] === 'staged') {
            next[f] = 'committed';
          }
        });
        return next;
      });

      logTerminal(`[${currentBranch} ${hash}] ${msg}`);
      logTerminal(' 3 files changed, 25 insertions(+)');
      
      if (activeMission === 'undo' && m2Step === 3) {
        setM2Committed(true);
        setM2Step(4);
        addTutorMessage(
          '¡Perfecto! Has creado el commit. Ahora que este commit erróneo está en tu historial, retrocede en el tiempo y bórralo usando: "git reset --hard HEAD~1" o "git revert HEAD". Verás cómo reacciona el grafo visual.'
        );
      }
      return;
    }

    // git branch
    if (sub === 'branch') {
      if (tokens.length < 3) {
        // List branches
        logTerminal('Branches:');
        Object.keys(branches).forEach(b => {
          logTerminal(`${b === currentBranch ? '* ' : '  '} ${b}`);
        });
        return;
      }
      
      const bName = tokens[2];
      if (branches[bName]) {
        logTerminal(`fatal: A branch named '${bName}' already exists.`);
        return;
      }

      // Create branch pointing to current head
      const currentHeadCommitId = branches[currentBranch];
      setBranches(prev => ({ ...prev, [bName]: currentHeadCommitId }));
      logTerminal(`Created branch '${bName}' starting at ${currentHeadCommitId}`);
      if (bName.includes('feature')) {
        unlockBadge('branch');
      }
      return;
    }

    // git checkout
    if (sub === 'checkout') {
      if (tokens.length < 3) {
        logTerminal('fatal: branch name required');
        return;
      }

      // Check if checkout -- <file>
      if (tokens[2] === '--') {
        if (tokens.length < 4) {
          logTerminal('error: debes especificar un archivo.');
          return;
        }
        const fileTarget = tokens[3];
        if (!files[fileTarget]) {
          logTerminal(`fatal: pathspec '${fileTarget}' did not match any files`);
          return;
        }

        setFiles(prev => {
          const next = { ...prev };
          if (next[fileTarget] === 'modified') {
            next[fileTarget] = 'committed';
            logTerminal(`Restaurado ${fileTarget} al último estado guardado.`);
            unlockBadge('restore');
            
            if (activeMission === 'undo' && m2Step === 2) {
              setM2Restored(true);
              setM2Step(3);
              addTutorMessage(
                '¡Excelente! Restauraste el archivo. Ahora, para aprender a deshacer commits ya guardados, haz un cambio rápido (ej: click en "Editar README"), agrégalo con "git add ." y haz commit con "git commit -m \'mensaje\'".'
              );
            }
          } else {
            logTerminal(`El archivo ${fileTarget} ya está limpio.`);
          }
          return next;
        });
        return;
      }

      // Check if checkout -b
      if (tokens[2] === '-b') {
        if (tokens.length < 4) {
          logTerminal('fatal: branch name required for -b option');
          return;
        }
        const bName = tokens[3];
        if (branches[bName]) {
          logTerminal(`fatal: A branch named '${bName}' already exists.`);
          return;
        }
        const currentHeadCommitId = branches[currentBranch];
        setBranches(prev => ({ ...prev, [bName]: currentHeadCommitId }));
        setCurrentBranch(bName);
        logTerminal(`Switched to a new branch '${bName}'`);
        if (bName.includes('feature')) {
          unlockBadge('branch');
        }
        return;
      }

      const bName = tokens[2];
      if (!branches[bName]) {
        logTerminal(`error: pathspec '${bName}' did not match any file(s) known to git`);
        return;
      }

      setCurrentBranch(bName);
      logTerminal(`Switched to branch '${bName}'`);
      return;
    }

    // git reset (rollback commits)
    if (sub === 'reset') {
      const isHard = tokens.includes('--hard');
      let target = 'HEAD~1';
      if (tokens.length > 2 && tokens[2] !== '--hard') {
        target = tokens[2];
      } else if (tokens.length > 3) {
        target = tokens[3];
      }

      if (target === 'HEAD~1' || target === 'HEAD^' || target === 'HEAD~') {
        const headCommitId = branches[currentBranch];
        const headCommit = commits.find(c => c.id === headCommitId);

        if (!headCommit || !headCommit.parent) {
          logTerminal('fatal: no hay commits anteriores a los que retroceder.');
          return;
        }

        const parentCommitId = headCommit.parent;
        setBranches(prev => ({ ...prev, [currentBranch]: parentCommitId }));

        // Animación de deshacer commit: quitamos de la lista para que desaparezca del grafo visual
        setCommits(prev => prev.filter(c => c.id !== headCommitId));

        if (isHard) {
          setFiles(prev => {
            const next = { ...prev };
            // Limpia el Staging y Working Directory volviendo al estado limpio
            Object.keys(next).forEach(f => {
              if (next[f] === 'staged' || next[f] === 'modified') {
                next[f] = 'committed';
              }
            });
            return next;
          });
          logTerminal(`HEAD está ahora en ${parentCommitId}`);
          logTerminal(`Working directory y Staging Area limpiados.`);
        } else {
          logTerminal(`HEAD está ahora en ${parentCommitId}`);
        }

        unlockBadge('restore');

        if (activeMission === 'undo' && m2Step === 4) {
          setM2ResetDone(true);
          setM2Step(5);
        }
        return;
      } else {
        logTerminal(`reset: solo se soporta "git reset --hard HEAD~1" en esta simulación.`);
        return;
      }
    }

    // git revert
    if (sub === 'revert') {
      if (tokens.length < 3) {
        logTerminal('error: debes especificar qué commit revertir (ej: git revert HEAD).');
        return;
      }
      const target = tokens[2];
      if (target === 'HEAD') {
        const headCommitId = branches[currentBranch];
        const headCommit = commits.find(c => c.id === headCommitId);
        if (!headCommit) return;

        const newId = 'c' + commits.length;
        const hash = Math.random().toString(16).substring(2, 9);
        const parentNode = commits.find(c => c.id === headCommitId);
        
        const nextX = (parentNode ? parentNode.x : 80) + 110;
        const nextY = parentNode ? parentNode.y : 125;

        const revertCommit = {
          id: newId,
          hash,
          message: `Revert "${headCommit.message}"`,
          parent: headCommitId,
          branch: currentBranch,
          x: nextX,
          y: nextY
        };

        setCommits(prev => [...prev, revertCommit]);
        setBranches(prev => ({ ...prev, [currentBranch]: newId }));
        
        // Reset modified files to committed
        setFiles(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(f => {
            if (next[f] === 'modified' || next[f] === 'staged') {
              next[f] = 'committed';
            }
          });
          return next;
        });

        logTerminal(`[${currentBranch} ${hash}] Revert "${headCommit.message}"`);
        logTerminal(' Revertido con éxito.');
        
        if (activeMission === 'undo' && m2Step === 4) {
          setM2ResetDone(true);
          setM2Step(5);
        }
        return;
      } else {
        logTerminal('revert: solo se soporta "git revert HEAD" en esta simulación.');
        return;
      }
    }

    // git merge
    if (sub === 'merge') {
      if (tokens.length < 3) {
        logTerminal('fatal: branch to merge required');
        return;
      }
      const sourceBranch = tokens[2];
      if (!branches[sourceBranch]) {
        logTerminal(`merge: ${sourceBranch} - not something we can merge`);
        return;
      }

      if (sourceBranch === currentBranch) {
        logTerminal('Already up to date.');
        return;
      }

      // Perform a simulated merge
      const targetCommitId = branches[currentBranch];
      const sourceCommitId = branches[sourceBranch];
      
      const targetNode = commits.find(c => c.id === targetCommitId);
      const sourceNode = commits.find(c => c.id === sourceCommitId);
      
      const newId = 'c' + commits.length;
      const hash = Math.random().toString(16).substring(2, 9);
      
      // Calculate coordinates dynamically
      const nextX = Math.max(targetNode.x, sourceNode.x) + 110;
      const nextY = 125; // Merging goes back to main (y=125)

      const mergeCommit = {
        id: newId,
        hash,
        message: `Merge branch '${sourceBranch}' into ${currentBranch}`,
        parent: targetCommitId,
        parent2: sourceCommitId,
        branch: currentBranch,
        x: nextX,
        y: nextY
      };

      setCommits(prev => [...prev, mergeCommit]);
      setBranches(prev => ({ ...prev, [currentBranch]: newId }));
      logTerminal(`Updating ${targetCommitId.substring(0,7)}..${sourceCommitId.substring(0,7)}`);
      logTerminal('Fast-forward (simulated merge successful)');
      logTerminal(`Merge branch '${sourceBranch}' successfully integrated.`);
      unlockBadge('merge');
      return;
    }

    // git log
    if (sub === 'log') {
      logTerminal('Commit history (newest first):');
      // Travel backwards starting from HEAD
      let curr = branches[currentBranch];
      const history = [];
      while (curr) {
        const node = commits.find(c => c.id === curr);
        if (node) {
          history.push(node);
          curr = node.parent; // Simplistic backtrace
        } else {
          break;
        }
      }
      if (history.length === 0) {
        logTerminal('(no commits on this branch)');
      } else {
        history.forEach(c => {
          logTerminal(`commit ${c.hash} (${c.id === branches[currentBranch] ? 'HEAD -> ' : ''}${c.branch})`);
          logTerminal(`Author: Estudiante DPRED <dpred@ucv.edu.ve>`);
          logTerminal(`Date:   Sat May 30 09:05:11 2026`);
          logTerminal(`\n    ${c.message}\n`);
        });
      }
      return;
    }

    logTerminal(`git: '${sub}' is not a git command. See 'git --help'.`);
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (cmd) {
      setCommandHistory(prev => [...prev, cmd]);
      setHistoryIndex(-1);
    }
    executeCommand(inputVal);
  };

  const handleTerminalKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0 || historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      }
    }
  };

  return (
    <div className="simulator-container fade-in-slide" id="visual-simulator-root">
      <header className="top-bar">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--text-primary), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            El Core: Simulador Local y Grafo Vivo
          </h2>
          <p style={{ marginTop: '0.2rem' }}>Interactúa con los estados locales de tu repositorio Git y visualiza el historial.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button id="btn-quick-status" className="btn btn-secondary" onClick={() => executeCommand('git status')} disabled={!gitInit}>
            <Info size={16} />
            <span>git status</span>
          </button>
          <button id="btn-quick-log" className="btn btn-secondary" onClick={() => executeCommand('git log')} disabled={!gitInit}>
            <GitCommit size={16} />
            <span>git log</span>
          </button>
        </div>
      </header>

      {/* Mission Switcher Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <button 
          id="tab-m1-branching"
          className={`btn ${activeMission === 'branching' ? 'btn-primary shadow-neon-primary' : 'btn-secondary'}`}
          onClick={() => setActiveMission('branching')}
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          Misión 1: Flujo de Ramas y Fusión
        </button>
        <button 
          id="tab-m2-undo"
          className={`btn ${activeMission === 'undo' ? 'btn-primary shadow-neon-primary' : 'btn-secondary'}`}
          onClick={() => {
            setActiveMission('undo');
            if (gitInit && m2Step === 1) {
              addTutorMessage('Iniciando Misión 2: Deshacer Cambios. Edita o modifica un archivo en el Working Directory para empezar.');
            }
          }}
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          Misión 2: Deshacer Cambios (Reset/Restore)
        </button>
      </div>

      {/* Interactive Mission Card with Stepper */}
      <section className="card" style={{ 
        borderLeft: '4px solid var(--primary)',
        backgroundColor: 'var(--bg-card)',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: '1.5rem',
        alignItems: 'center'
      }}>
        <div>
          {activeMission === 'branching' ? (
            <>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Misión 1: Fusión de Ramas Paralelas</span>
                {progress.simulator && <CheckCircle size={16} style={{ color: 'var(--color-local)' }} />}
              </h3>
              <p style={{ fontSize: '0.85rem', marginTop: '0.4rem', color: 'var(--text-secondary)' }}>
                En equipos de desarrollo, nunca escribes código directamente en la rama principal.
                Practica crear una rama experimental (`feature/login`), desarrollar un commit aislado allí, y luego unificarlo mediante un `git merge`.
              </p>
            </>
          ) : (
            <>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Misión 2: Recuperación ante Desastres (Reset & Restore)</span>
                {m2Completed && <CheckCircle size={16} style={{ color: 'var(--color-local)' }} />}
              </h3>
              <p style={{ fontSize: '0.85rem', marginTop: '0.4rem', color: 'var(--text-secondary)' }}>
                ¡Equivocarse es de humanos! Git brilla por su capacidad de viajar al pasado.
                Aprende a descartar archivos modificados localmente (`git restore`) y a hacer retroceder la historia de tus commits (`git reset --hard HEAD~1`).
              </p>
            </>
          )}
        </div>

        {/* Stepper Checklist */}
        <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Pasos Requeridos:</span>
          {activeMission === 'branching' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ color: m1Steps.init ? 'var(--color-local)' : 'var(--primary)' }}>{m1Steps.init ? '✔' : '○'}</span>
                <span style={{ color: m1Steps.init ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: !m1Steps.init ? 'bold' : 'normal' }}>1. Inicializar repositorio (git init)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ color: m1Steps.commitMain ? 'var(--color-local)' : (m1Steps.init ? 'var(--primary)' : 'var(--text-tertiary)') }}>{m1Steps.commitMain ? '✔' : '○'}</span>
                <span style={{ color: m1Steps.commitMain ? 'var(--text-secondary)' : (m1Steps.init ? 'var(--text-primary)' : 'var(--text-tertiary)'), fontWeight: (m1Steps.init && !m1Steps.commitMain) ? 'bold' : 'normal' }}>2. Commit inicial en main (git commit)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ color: m1Steps.createBranch ? 'var(--color-local)' : (m1Steps.commitMain ? 'var(--primary)' : 'var(--text-tertiary)') }}>{m1Steps.createBranch ? '✔' : '○'}</span>
                <span style={{ color: m1Steps.createBranch ? 'var(--text-secondary)' : (m1Steps.commitMain ? 'var(--text-primary)' : 'var(--text-tertiary)'), fontWeight: (m1Steps.commitMain && !m1Steps.createBranch) ? 'bold' : 'normal' }}>3. Crear rama feature/login (git branch)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ color: m1Steps.commitBranch ? 'var(--color-local)' : (m1Steps.createBranch ? 'var(--primary)' : 'var(--text-tertiary)') }}>{m1Steps.commitBranch ? '✔' : '○'}</span>
                <span style={{ color: m1Steps.commitBranch ? 'var(--text-secondary)' : (m1Steps.createBranch ? 'var(--text-primary)' : 'var(--text-tertiary)'), fontWeight: (m1Steps.createBranch && !m1Steps.commitBranch) ? 'bold' : 'normal' }}>4. Checkout & commit en rama</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ color: m1Steps.merge ? 'var(--color-local)' : (m1Steps.commitBranch ? 'var(--primary)' : 'var(--text-tertiary)') }}>{m1Steps.merge ? '✔' : '○'}</span>
                <span style={{ color: m1Steps.merge ? 'var(--text-secondary)' : (m1Steps.commitBranch ? 'var(--text-primary)' : 'var(--text-tertiary)'), fontWeight: (m1Steps.commitBranch && !m1Steps.merge) ? 'bold' : 'normal' }}>5. Fusionar rama a main (git merge)</span>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ color: m2Modified ? 'var(--color-local)' : 'var(--primary)' }}>{m2Modified ? '✔' : '○'}</span>
                <span style={{ color: m2Modified ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: m2Step === 1 ? 'bold' : 'normal' }}>1. Modificar un archivo local (Editar README)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ color: m2Restored ? 'var(--color-local)' : (m2Modified ? 'var(--primary)' : 'var(--text-tertiary)') }}>{m2Restored ? '✔' : '○'}</span>
                <span style={{ color: m2Restored ? 'var(--text-secondary)' : (m2Modified ? 'var(--text-primary)' : 'var(--text-tertiary)'), fontWeight: m2Step === 2 ? 'bold' : 'normal' }}>2. Descartar cambios locales (git restore)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ color: m2Committed ? 'var(--color-local)' : (m2Restored ? 'var(--primary)' : 'var(--text-tertiary)') }}>{m2Committed ? '✔' : '○'}</span>
                <span style={{ color: m2Committed ? 'var(--text-secondary)' : (m2Restored ? 'var(--text-primary)' : 'var(--text-tertiary)'), fontWeight: m2Step === 3 ? 'bold' : 'normal' }}>3. Modificar de nuevo y hacer git commit</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ color: m2ResetDone ? 'var(--color-local)' : (m2Committed ? 'var(--primary)' : 'var(--text-tertiary)') }}>{m2ResetDone ? '✔' : '○'}</span>
                <span style={{ color: m2ResetDone ? 'var(--text-secondary)' : (m2Committed ? 'var(--text-primary)' : 'var(--text-tertiary)'), fontWeight: m2Step === 4 ? 'bold' : 'normal' }}>4. Deshacer el commit (git reset --hard HEAD~1)</span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 3 Git Area Columns */}
      <section className="states-container" aria-label="Visualizador de estados de Git">
        {/* Working Directory */}
        <div className="state-column working" style={{ borderTop: '4px solid var(--color-working)' }}>
          <div className="state-header working">
            <span>Working Directory</span>
            <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: 'rgba(244, 63, 94, 0.1)' }}>Modificaciones locales</span>
          </div>
          
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Archivos locales modificados o no rastreados.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: '100px' }}>
            {Object.keys(files).map((filename) => {
              const st = files[filename];
              if (st === 'untracked' || st === 'modified') {
                return (
                  <div key={filename} className="file-box pop-in-file" style={{ borderLeft: '3px solid var(--color-working)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FileText size={14} style={{ color: 'var(--color-working)' }} />
                      {filename}
                    </span>
                    <div className="file-actions">
                      <button 
                        className="btn-file-action" 
                        onClick={() => executeCommand(`git add ${filename}`)}
                        title="Preparar archivo (git add)"
                      >
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
            <button id="btn-create-file" className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', width: '100%' }} onClick={handleCreateNewFile}>
              <Plus size={14} />
              <span>Nuevo Archivo</span>
            </button>
            <button 
              id="btn-modify-readme" 
              className={`btn btn-secondary ${activeMission === 'undo' && m2Step === 1 ? 'glow-active' : ''}`} 
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', width: '100%' }} 
              onClick={() => modifyOrCreateFile('README.md')}
            >
              <RefreshCw size={14} />
              <span>Editar README</span>
            </button>
          </div>
        </div>

        {/* Staging Area */}
        <div className="state-column staging" style={{ borderTop: '4px solid var(--color-staging)' }}>
          <div className="state-header staging">
            <span>Staging Area (Index)</span>
            <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>Indexado</span>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Archivos preparados para el siguiente commit.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: '100px' }}>
            {Object.keys(files).map((filename) => {
              const st = files[filename];
              if (st === 'staged') {
                return (
                  <div key={filename} className="file-box pop-in-file" style={{ borderLeft: '3px solid var(--color-staging)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FileText size={14} style={{ color: 'var(--color-staging)' }} />
                      {filename}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-staging)', fontWeight: 600 }}>preparado</span>
                  </div>
                );
              }
              return null;
            })}
          </div>

          {!Object.values(files).includes('staged') && (
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: '0.8rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1rem', minHeight: '80px' }}>
              Área vacía. Ejecuta "git add"
            </div>
          )}
        </div>

        {/* Local Repository */}
        <div className="state-column local" style={{ borderTop: '4px solid var(--color-local)' }}>
          <div className="state-header local">
            <span>Local Repository (.git)</span>
            <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>Grabado</span>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Fotos históricas del proyecto guardadas de forma segura.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: '100px' }}>
            {Object.keys(files).map((filename) => {
              const st = files[filename];
              if (st === 'committed') {
                return (
                  <div key={filename} className="file-box pop-in-file" style={{ borderLeft: '3px solid var(--color-local)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FileText size={14} style={{ color: 'var(--color-local)' }} />
                      {filename}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-local)', fontWeight: 600 }}>guardado</span>
                  </div>
                );
              }
              return null;
            })}
          </div>

          {!Object.values(files).includes('committed') && (
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: '0.8rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1rem', minHeight: '80px' }}>
              Ningún archivo en el historial aún.
            </div>
          )}
        </div>
      </section>

      {/* SVG Living Git Graph */}
      <section className="card graph-card" aria-label="Visualizador del grafo de commits" style={{ transition: 'all 0.3s ease' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Grafo Vivo de Ramas y Commits</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 500, padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>Interactiva (Click en nodos)</span>
        </h3>
        
        <div className="graph-canvas-container">
          <svg className="graph-svg" style={{ backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--text-tertiary)" />
              </marker>
            </defs>

            {/* Draw Links between Commits */}
            {commits.map((c) => {
              const elements = [];
              if (c.parent) {
                const parentNode = commits.find(p => p.id === c.parent);
                if (parentNode) {
                  elements.push(
                    <line
                      key={`${c.id}-link-1`}
                      x1={parentNode.x}
                      y1={parentNode.y}
                      x2={c.x}
                      y2={c.y}
                      stroke="var(--text-tertiary)"
                      strokeWidth="2.5"
                      strokeDasharray="0"
                      markerEnd="url(#arrow)"
                      style={{ animation: 'draw-line 0.8s ease-out' }}
                    />
                  );
                }
              }
              if (c.parent2) {
                const parentNode = commits.find(p => p.id === c.parent2);
                if (parentNode) {
                  elements.push(
                    <line
                      key={`${c.id}-link-2`}
                      x1={parentNode.x}
                      y1={parentNode.y}
                      x2={c.x}
                      y2={c.y}
                      stroke="var(--color-remote)"
                      strokeWidth="2"
                      strokeDasharray="4"
                      markerEnd="url(#arrow)"
                      style={{ animation: 'draw-line 0.8s ease-out' }}
                    />
                  );
                }
              }
              return elements;
            })}

            {/* Draw Commit Nodes with Keyboard Accessibility & ARIA */}
            {commits.map((c) => {
              const isHead = branches[currentBranch] === c.id;
              return (
                <g 
                  key={c.id} 
                  className="graph-node"
                  tabIndex="0"
                  role="button"
                  aria-label={`Commit ${c.hash}: ${c.message}${isHead ? ' (HEAD actual)' : ''}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      executeCommand('git log');
                    }
                  }}
                  style={{ cursor: 'pointer', outline: 'none' }}
                >
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={isHead ? 9 : 7}
                    fill={c.branch === 'main' ? 'var(--primary)' : 'var(--color-remote)'}
                    stroke={isHead ? 'var(--text-primary)' : 'transparent'}
                    strokeWidth={isHead ? 3 : 0}
                    onClick={() => executeCommand(`git log`)}
                    style={{ transition: 'all 0.2s ease', filter: isHead ? 'drop-shadow(0 0 4px var(--primary))' : 'none' }}
                  />
                  {/* Message and Hash Text */}
                  <text x={c.x - 12} y={c.y + 24} className="graph-label" fill="var(--text-primary)" style={{ fontSize: '0.72rem', fontWeight: 'bold' }}>
                    {c.hash}
                  </text>
                  <text x={c.x - 20} y={c.y + 36} className="graph-label" fill="var(--text-secondary)" style={{ fontSize: '0.62rem' }}>
                    {c.message.length > 12 ? c.message.substring(0, 10) + '..' : c.message}
                  </text>
                </g>
              );
            })}

            {/* Draw Branch Heads Labels with Dynamic Vertical Stacking */}
            {(() => {
              const branchCommitCounts = {};
              const branchOffsets = {};
              Object.keys(branches).forEach(b => {
                const cId = branches[b];
                const count = branchCommitCounts[cId] || 0;
                branchOffsets[b] = count;
                branchCommitCounts[cId] = count + 1;
              });

              return Object.keys(branches).map((b) => {
                const headCommitId = branches[b];
                const node = commits.find(c => c.id === headCommitId);
                if (!node) return null;
                
                const isCurrent = b === currentBranch;
                const stackIndex = branchOffsets[b] || 0;
                const offsetY = node.y - 32 - (stackIndex * 24);
                
                return (
                  <g 
                    key={`branch-tag-${b}`} 
                    transform={`translate(${node.x - 30}, ${offsetY})`}
                    role="note"
                    aria-label={`Rama ${b}${isCurrent ? ' (activa)' : ''}`}
                  >
                    <rect
                      width="80"
                      height="20"
                      rx="6"
                      fill={isCurrent ? 'var(--primary-light)' : 'var(--bg-secondary)'}
                      stroke={isCurrent ? 'var(--primary)' : 'var(--border-color)'}
                      strokeWidth="1.5"
                      style={{ filter: isCurrent ? 'drop-shadow(0 2px 4px rgba(162, 28, 255, 0.15))' : 'none' }}
                    />
                    <text 
                      x="40" 
                      y="13" 
                      textAnchor="middle" 
                      className="graph-branch-tag"
                      fill={isCurrent ? 'var(--primary)' : 'var(--text-secondary)'}
                      style={{ fontSize: '0.65rem', fontWeight: 700 }}
                    >
                      {isCurrent ? `* ${b}` : b}
                    </text>
                  </g>
                );
              });
            })()}
          </svg>
        </div>
      </section>

      {/* Terminal Simulator and Assistant */}
      <section className="terminal-window" aria-label="Terminal simulada">
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
          </div>
          <span className="terminal-title">bash - git@ucv-dpred: ~/workspace/project</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>Rama actual: {currentBranch}</span>
        </div>

        <div className="terminal-body" style={{ minHeight: '220px' }}>
          {terminalLogs.map((log, idx) => (
            <div key={idx} className="terminal-line">
              {log.startsWith('$') ? (
                <span>
                  <span className="terminal-prompt">dpred-user $</span> {log.substring(1)}
                </span>
              ) : (
                <span style={{ color: log.startsWith('error') || log.startsWith('fatal') ? 'var(--color-working)' : 'inherit' }}>{log}</span>
              )}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        <form onSubmit={handleTerminalSubmit} className="terminal-input-container" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'stretch', padding: 0 }}>
          {(() => {
            const allSuggestions = [
              'git init',
              'git add .',
              'git commit -m "',
              'git checkout ',
              'git branch ',
              'git merge ',
              'git status',
              'git log',
              'git reset --hard HEAD~1',
              'git restore README.md'
            ];
            const filteredSuggestions = inputVal.trim() 
              ? allSuggestions.filter(s => s.toLowerCase().startsWith(inputVal.toLowerCase()) && s.toLowerCase() !== inputVal.toLowerCase())
              : [];
            if (filteredSuggestions.length === 0) return null;
            return (
              <div style={{ display: 'flex', gap: '0.4rem', padding: '0.4rem 1rem', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap', zIndex: 10, width: '100%' }}>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', marginRight: '0.2rem' }}>Autocompletar:</span>
                {filteredSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputVal(s);
                      setTimeout(() => {
                        const inputEl = document.getElementById('terminal-user-input');
                        if (inputEl) {
                          inputEl.focus();
                          // Put cursor at the end or inside quotes for commit message
                          if (s.endsWith('"')) {
                            inputEl.setSelectionRange(s.length - 1, s.length - 1);
                          } else {
                            inputEl.setSelectionRange(s.length, s.length);
                          }
                        }
                      }, 50);
                    }}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--primary)',
                      borderRadius: '4px',
                      padding: '0.15rem 0.45rem',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            );
          })()}
          <div style={{ display: 'flex', alignItems: 'center', padding: '0.85rem 1.25rem', width: '100%' }}>
            <span className="terminal-prompt" style={{ fontSize: '0.9rem' }}>dpred-user $</span>
            <input
              id="terminal-user-input"
              type="text"
              className="terminal-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleTerminalKeyDown}
              placeholder={activeMission === 'branching' ? "git init, git add ., git commit -m 'Commit'... (↑/↓ historial)" : "git restore README.md, git reset --hard HEAD~1... (↑/↓ historial)"}
              autoFocus
              autoComplete="off"
              aria-label="Entrada de comando Git con historial de flechas arriba y abajo"
            />
            <button id="btn-submit-command" type="submit" style={{ display: 'none' }}>
              <CornerDownLeft size={16} />
            </button>
          </div>
        </form>
      </section>

      {/* Helper Panel (Multiple Means of Action) */}
      <div style={{ marginTop: '1.5rem' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>Asistente Rápido de Comandos</h4>
        <section style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button 
            id="helper-btn-init" 
            className={`btn btn-outline ${(!gitInit && activeMission === 'branching') ? 'glow-active' : ''}`} 
            onClick={() => executeCommand('git init')}
          >
            Inicializar Repositorio (git init)
          </button>
          <button 
            id="helper-btn-add" 
            className="btn btn-outline" 
            onClick={() => executeCommand('git add .')} 
            disabled={!gitInit}
          >
            Preparar Todo (git add .)
          </button>
          <button 
            id="helper-btn-commit" 
            className={`btn btn-outline ${(gitInit && !m1Steps.commitMain && activeMission === 'branching') || (activeMission === 'undo' && m2Step === 3) ? 'glow-active' : ''}`} 
            onClick={() => {
              const msg = prompt('Mensaje de commit:');
              if (msg) executeCommand(`git commit -m "${msg}"`);
            }} 
            disabled={!gitInit}
          >
            Guardar Cambios (git commit -m)
          </button>

          {activeMission === 'branching' ? (
            <>
              <button 
                id="helper-btn-branch" 
                className={`btn btn-outline ${(m1Steps.commitMain && !m1Steps.createBranch) ? 'glow-active' : ''}`} 
                onClick={() => {
                  const bName = prompt('Nombre de la rama (ej: feature/login):');
                  if (bName) executeCommand(`git branch ${bName}`);
                }} 
                disabled={!gitInit}
              >
                Crear Rama (git branch)
              </button>
              <button 
                id="helper-btn-checkout" 
                className={`btn btn-outline ${(m1Steps.createBranch && !m1Steps.commitBranch) ? 'glow-active' : ''}`} 
                onClick={() => {
                  const bName = prompt('Nombre de la rama a cambiar:');
                  if (bName) executeCommand(`git checkout ${bName}`);
                }} 
                disabled={!gitInit}
              >
                Cambiar Rama (git checkout)
              </button>
              <button 
                id="helper-btn-merge" 
                className={`btn btn-outline ${(m1Steps.commitBranch && !m1Steps.merge) ? 'glow-active' : ''}`} 
                onClick={() => {
                  const bName = prompt('Rama a integrar en ' + currentBranch + ':');
                  if (bName) executeCommand(`git merge ${bName}`);
                }} 
                disabled={!gitInit}
              >
                Fusionar Rama (git merge)
              </button>
            </>
          ) : (
            <>
              <button 
                id="helper-btn-restore" 
                className={`btn btn-outline ${(m2Modified && !m2Restored) ? 'glow-active' : ''}`} 
                onClick={() => executeCommand('git restore README.md')} 
                disabled={!gitInit || !m2Modified}
              >
                Descartar Cambios (git restore)
              </button>
              <button 
                id="helper-btn-reset" 
                className={`btn btn-outline ${(m2Committed && !m2ResetDone) ? 'glow-active' : ''}`} 
                onClick={() => executeCommand('git reset --hard HEAD~1')} 
                disabled={!gitInit || !m2Committed}
              >
                Deshacer Commit (git reset --hard)
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
