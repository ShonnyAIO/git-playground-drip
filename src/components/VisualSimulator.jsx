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

export default function VisualSimulator({ progress, setProgress, addTutorMessage }) {
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
  const [terminalLogs, setTerminalLogs] = useState([
    'Bienvenido al simulador interactivo de Git.',
    'Escribe un comando o usa los botones de asistencia rápida para comenzar.',
    'Consejo: Empieza inicializando tu repositorio con "git init".'
  ]);

  const terminalEndRef = useRef(null);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Guidelines check for completion
  // Goal: User must init, add a file, commit on main, branch feature/login, checkout, commit there, and merge back to main.
  useEffect(() => {
    const hasBranch = Object.keys(branches).includes('feature/login') || Object.keys(branches).includes('feature-login');
    const hasMultipleCommits = commits.length > 2;
    const hasMerge = commits.some(c => c.message.toLowerCase().includes('merge'));

    if (gitInit && hasBranch && hasMultipleCommits && hasMerge && !progress.simulator) {
      setProgress(prev => ({ ...prev, simulator: true }));
      logTerminal('🎉 ¡FELICITACIONES! Has completado el Módulo 1: El Core. Entendiste el ciclo de vida local y el grafo de ramas.');
      addTutorMessage(
        '¡Increíble trabajo! Has completado el simulador local. Lograste inicializar un repositorio, staged/commit de archivos, creaste una rama paralela (feature/login) para desarrollar código seguro, e hiciste una fusión (merge). ¡Ya estás listo para conectar esto a GitHub en el siguiente módulo!'
      );
    }
  }, [commits, branches, gitInit, progress.simulator]);

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
      return;
    }

    // git checkout
    if (sub === 'checkout') {
      if (tokens.length < 3) {
        logTerminal('fatal: branch name required');
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
          logTerminal(`Date:   Sat May 30 00:30:11 2026`);
          logTerminal(`\n    ${c.message}\n`);
        });
      }
      return;
    }

    logTerminal(`git: '${sub}' is not a git command. See 'git --help'.`);
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    executeCommand(inputVal);
  };

  return (
    <div className="simulator-container" id="visual-simulator-root">
      <header className="top-bar">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>El Core: Simulador Local y Grafo Vivo</h2>
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

      {/* Goal instructions banner */}
      <section className="card" style={{ 
        borderLeft: progress.simulator ? '4px solid var(--color-local)' : '4px solid var(--primary)',
        backgroundColor: 'var(--bg-card)',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Misión 1: Tu primer flujo de ramas</span>
            {progress.simulator && <CheckCircle size={16} style={{ color: 'var(--color-local)' }} />}
          </h3>
          <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', maxWidth: '85%' }}>
            Para desbloquear este módulo debes: 
            1. Inicializar (<code style={{fontSize:'0.75rem'}}>git init</code>). 
            2. Crear/agregar y commitear un archivo en <code style={{fontSize:'0.75rem'}}>main</code>. 
            3. Crear la rama <code style={{fontSize:'0.75rem'}}>feature/login</code> e ir a ella. 
            4. Modificar un archivo y commitearlo. 
            5. Regresar a <code style={{fontSize:'0.75rem'}}>main</code> y hacer merge de la rama.
          </p>
        </div>
        <span style={{ 
          fontSize: '0.75rem', 
          fontWeight: 700, 
          padding: '0.25rem 0.6rem', 
          borderRadius: '4px',
          backgroundColor: progress.simulator ? 'var(--color-local-bg)' : 'var(--primary-light)',
          color: progress.simulator ? 'var(--color-local)' : 'var(--primary)'
        }}>
          {progress.simulator ? 'Completado' : 'Pendiente'}
        </span>
      </section>

      {/* 3 Git Area Columns */}
      <section className="states-container" aria-label="Visualizador de estados de Git">
        {/* Working Directory */}
        <div className="state-column working">
          <div className="state-header working">
            <span>Working Directory</span>
            <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: 'rgba(244, 63, 94, 0.1)' }}>Uncommitted</span>
          </div>
          
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Archivos locales modificados o no rastreados.
          </p>

          {Object.keys(files).map((filename) => {
            const st = files[filename];
            if (st === 'untracked' || st === 'modified') {
              return (
                <div key={filename} className="file-box" style={{ borderLeft: '3px solid var(--color-working)' }}>
                  <span>📄 {filename}</span>
                  <div className="file-actions">
                    <button 
                      className="btn-file-action" 
                      onClick={() => executeCommand(`git add ${filename}`)}
                      title="Agregar al Staging Area"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            }
            return null;
          })}

          <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
            <button id="btn-create-file" className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', width: '100%' }} onClick={handleCreateNewFile}>
              <Plus size={14} />
              <span>Nuevo Archivo</span>
            </button>
            <button id="btn-modify-readme" className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', width: '100%' }} onClick={() => modifyOrCreateFile('README.md')}>
              <RefreshCw size={14} />
              <span>Editar README</span>
            </button>
          </div>
        </div>

        {/* Staging Area */}
        <div className="state-column staging">
          <div className="state-header staging">
            <span>Staging Area (Index)</span>
            <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>Staged</span>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Archivos preparados para el siguiente commit.
          </p>

          {Object.keys(files).map((filename) => {
            const st = files[filename];
            if (st === 'staged') {
              return (
                <div key={filename} className="file-box" style={{ borderLeft: '3px solid var(--color-staging)' }}>
                  <span>📄 {filename}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-staging)', fontWeight: 600 }}>preparado</span>
                </div>
              );
            }
            return null;
          })}

          {!Object.values(files).includes('staged') && (
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: '0.8rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
              Área vacía. Haz "git add"
            </div>
          )}
        </div>

        {/* Local Repository */}
        <div className="state-column local">
          <div className="state-header local">
            <span>Local Repository (.git)</span>
            <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>Committed</span>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Fotos históricas del proyecto guardadas de forma segura.
          </p>

          {Object.keys(files).map((filename) => {
            const st = files[filename];
            if (st === 'committed') {
              return (
                <div key={filename} className="file-box" style={{ borderLeft: '3px solid var(--color-local)' }}>
                  <span>📄 {filename}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-local)', fontWeight: 600 }}>guardado</span>
                </div>
              );
            }
            return null;
          })}

          {!Object.values(files).includes('committed') && (
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: '0.8rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
              Ningún archivo en el historial aún.
            </div>
          )}
        </div>
      </section>

      {/* SVG Living Git Graph */}
      <section className="card graph-card" aria-label="Visualizador del grafo de commits">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.85rem' }}>Grafo Vivo de Ramas y Commits</h3>
        
        <div className="graph-canvas-container">
          <svg className="graph-svg">
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
                      markerEnd="url(#arrow)"
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
                    />
                  );
                }
              }
              return elements;
            })}

            {/* Draw Commit Nodes */}
            {commits.map((c) => {
              const isHead = branches[currentBranch] === c.id;
              return (
                <g key={c.id} className="graph-node">
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={isHead ? 8 : 6}
                    fill={c.branch === 'main' ? 'var(--primary)' : 'var(--color-remote)'}
                    stroke={isHead ? 'var(--text-primary)' : 'transparent'}
                    strokeWidth={isHead ? 3 : 0}
                    onClick={() => logTerminal(`Commit: ${c.hash} - "${c.message}" (Rama: ${c.branch})`)}
                  />
                  {/* Message and Hash Text */}
                  <text x={c.x - 10} y={c.y + 24} className="graph-label" fill="var(--text-primary)">
                    {c.hash}
                  </text>
                  <text x={c.x - 20} y={c.y + 38} className="graph-label" fill="var(--text-secondary)" style={{ fontSize: '0.65rem' }}>
                    {c.message.length > 12 ? c.message.substring(0, 10) + '..' : c.message}
                  </text>
                </g>
              );
            })}

            {/* Draw Branch Heads Labels */}
            {Object.keys(branches).map((b, idx) => {
              const headCommitId = branches[b];
              const node = commits.find(c => c.id === headCommitId);
              if (!node) return null;
              
              const isCurrent = b === currentBranch;
              
              return (
                <g key={`branch-tag-${b}`} transform={`translate(${node.x - 20}, ${node.y - 30})`}>
                  <rect
                    width="70"
                    height="18"
                    rx="4"
                    fill={isCurrent ? 'var(--primary-light)' : 'var(--bg-secondary)'}
                    stroke={isCurrent ? 'var(--primary)' : 'var(--border-color)'}
                    strokeWidth="1"
                  />
                  <text 
                    x="35" 
                    y="12" 
                    textAnchor="middle" 
                    className="graph-branch-tag"
                    fill={isCurrent ? 'var(--primary)' : 'var(--text-secondary)'}
                  >
                    {isCurrent ? `* ${b}` : b}
                  </text>
                </g>
              );
            })}
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
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Rama actual: {currentBranch}</span>
        </div>

        <div className="terminal-body">
          {terminalLogs.map((log, idx) => (
            <div key={idx} className="terminal-line">
              {log.startsWith('$') ? (
                <span>
                  <span className="terminal-prompt">dpred-user $</span> {log.substring(1)}
                </span>
              ) : (
                <span>{log}</span>
              )}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        <form onSubmit={handleTerminalSubmit} className="terminal-input-container">
          <span className="terminal-prompt" style={{ fontSize: '0.9rem' }}>dpred-user $</span>
          <input
            id="terminal-user-input"
            type="text"
            className="terminal-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="git init, git add ., git commit -m 'Commit msg'..."
            autoFocus
            autoComplete="off"
            aria-label="Entrada de comando Git"
          />
          <button id="btn-submit-command" type="submit" style={{ display: 'none' }}>
            <CornerDownLeft size={16} />
          </button>
        </form>
      </section>

      {/* Helper Panel (Multiple Means of Action) */}
      <section style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.25rem' }}>
        <button id="helper-btn-init" className="btn btn-outline" onClick={() => executeCommand('git init')}>
          Inicializar Repositorio (git init)
        </button>
        <button id="helper-btn-add" className="btn btn-outline" onClick={() => executeCommand('git add .')} disabled={!gitInit}>
          Preparar Todo (git add .)
        </button>
        <button id="helper-btn-commit" className="btn btn-outline" onClick={() => {
          const msg = prompt('Mensaje de commit:');
          if (msg) executeCommand(`git commit -m "${msg}"`);
        }} disabled={!gitInit}>
          Guardar Cambios (git commit -m)
        </button>
        <button id="helper-btn-branch" className="btn btn-outline" onClick={() => {
          const bName = prompt('Nombre de la rama (ej: feature/login):');
          if (bName) executeCommand(`git branch ${bName}`);
        }} disabled={!gitInit}>
          Crear Rama (git branch)
        </button>
        <button id="helper-btn-checkout" className="btn btn-outline" onClick={() => {
          const bName = prompt('Nombre de la rama a cambiar:');
          if (bName) executeCommand(`git checkout ${bName}`);
        }} disabled={!gitInit}>
          Cambiar Rama (git checkout)
        </button>
        <button id="helper-btn-merge" className="btn btn-outline" onClick={() => {
          const bName = prompt('Rama a integrar en ' + currentBranch + ':');
          if (bName) executeCommand(`git merge ${bName}`);
        }} disabled={!gitInit}>
          Fusionar Rama (git merge)
        </button>
      </section>
    </div>
  );
}
