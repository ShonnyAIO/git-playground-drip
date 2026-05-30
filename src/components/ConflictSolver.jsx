import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  GitMerge, 
  GitCommit, 
  Code, 
  Check, 
  HelpCircle,
  Maximize2
} from 'lucide-react';

export default function ConflictSolver({ progress, setProgress, addTutorMessage }) {
  const [conflictActive, setConflictActive] = useState(false);
  const [selectedChange, setSelectedChange] = useState(null); // 'current', 'incoming', 'both'
  const [resolved, setResolved] = useState(false);
  const [commitCreated, setCommitCreated] = useState(false);
  const [currentTab, setCurrentTab] = useState('theory'); // 'theory', 'simulator'

  const currentCode = `const LoginButton = () => {\n  return <button className="btn-primary">Entrar al Sistema</button>;\n};`;
  const incomingCode = `const LoginButton = () => {\n  return <button style={{ background: 'purple' }}>Ingresar</button>;\n};`;
  const bothCode = `const LoginButton = () => {\n  // Ambos cambios conservados\n  return <button className="btn-primary" style={{ background: 'purple' }}>Entrar al Sistema</button>;\n};`;

  useEffect(() => {
    if (commitCreated && !progress.conflicts) {
      setProgress(prev => ({ ...prev, conflicts: true }));
      addTutorMessage(
        '¡Soberbio! Has completado el Módulo 3: Resolución de Conflictos. Enfrentarse a los conflictos es una de las tareas más comunes e intimidantes de la vida real. Aprendiste a identificar las etiquetas de conflicto (<<<<<<<, =======, >>>>>>>), a contrastar los cambios de tu rama (HEAD) con los de la rama externa, a seleccionar la mejor resolución y a sellarlo con un commit final de resolución. ¡Dominas la supervivencia en Git!'
      );
    }
  }, [commitCreated, progress.conflicts]);

  const handleStartMerge = () => {
    setConflictActive(true);
    setCurrentTab('simulator');
    addTutorMessage(
      'Has iniciado la fusión de la rama "feature/custom-login". Git ha encontrado que ambos modificaron la función "LoginButton" en la línea 4. Se ha detenido la fusión y se han inyectado marcas de conflicto. ¡Debes solucionarlo eligiendo qué versión conservar!'
    );
  };

  const handleSelect = (choice) => {
    setSelectedChange(choice);
  };

  const handleResolve = () => {
    if (!selectedChange) {
      alert('Debes seleccionar qué cambios conservar primero.');
      return;
    }
    setResolved(true);
    addTutorMessage(
      '¡Conflicto marcado como resuelto en el editor! Has limpiado las marcas de conflicto (<<<<<<<, =======, >>>>>>>). Ahora debes ejecutar "git commit" para guardar la solución final.'
    );
  };

  const handleCommit = () => {
    setCommitCreated(true);
    addTutorMessage(
      '¡Merge commit de resolución creado con éxito! Tu historial de Git vuelve a estar sano y los cambios de ambas ramas se han unificado de forma segura. ¡Buen trabajo!'
    );
  };

  const getPreviewCode = () => {
    if (selectedChange === 'current') return currentCode;
    if (selectedChange === 'incoming') return incomingCode;
    if (selectedChange === 'both') return bothCode;
    return `<<<<<<< HEAD (Cambio Actual - Tu Rama)
const LoginButton = () => {
  return <button className="btn-primary">Entrar al Sistema</button>;
};
=======
const LoginButton = () => {
  return <button style={{ background: 'purple' }}>Ingresar</button>;
};
>>>>>>> feature/custom-login (Cambio Entrante - Rama Externa)`;
  };

  return (
    <div className="conflicts-container" id="conflict-solver-root">
      <header className="top-bar">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>El Modo Supervivencia: Resolución de Conflictos</h2>
          <p style={{ marginTop: '0.2rem' }}>Aprende por qué ocurren los conflictos y cómo resolverlos paso a paso como un profesional.</p>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button 
          id="btn-conflict-tab-theory"
          className={`btn ${currentTab === 'theory' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setCurrentTab('theory')}
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          Teoría: Merge vs Rebase
        </button>
        <button 
          id="btn-conflict-tab-sim"
          className={`btn ${currentTab === 'simulator' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setCurrentTab('simulator')}
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          Simulador de Conflictos
        </button>
      </div>

      {currentTab === 'theory' ? (
        <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>¿Cómo unificar ramas en Git?</h3>
            <p style={{ fontSize: '0.95rem' }}>Cuando trabajas con ramas paralelas, tarde o temprano querrás unificar tu código. Hay dos caminos:</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', backgroundColor: 'var(--bg-secondary)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                <GitMerge size={20} />
                <span>Método 1: Git Merge</span>
              </h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                Crea un nuevo commit especial llamado <strong>Merge Commit</strong> que une los dos historiales.
                Conserva la historia real exacta en la que ocurrieron los eventos.
              </p>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-local)', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--color-local-bg)' }}>
                ✔ Ideal para ramas compartidas
              </span>
            </div>

            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', backgroundColor: 'var(--bg-secondary)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-remote)', marginBottom: '0.5rem' }}>
                <GitCommit size={20} />
                <span>Método 2: Git Rebase</span>
              </h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                Toma tus commits locales, los levanta y los coloca en la punta de la otra rama (reescribe la historia).
                Deja un historial limpio y lineal sin commits de fusión adicionales.
              </p>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-working)', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--color-working-bg)' }}>
                ⚠ Peligroso en ramas públicas compartidas
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'center' }}>
            <button 
              id="start-conflict-btn"
              className="btn btn-primary"
              onClick={handleStartMerge}
            >
              <span>Ir al Simulador de Conflictos</span>
              <AlertTriangle size={16} />
            </button>
          </div>
        </section>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Level guidelines */}
          <section className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Conflicto detectado en App.jsx</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {!conflictActive 
                  ? 'Haz click en "Iniciar Fusión" para simular un choque de commits.' 
                  : resolved 
                    ? 'Conflicto resuelto. Crea el commit final.' 
                    : 'Selecciona una versión del botón, haz click en "Marcar Resuelto" y haz commit.'}
              </p>
            </div>
            {!conflictActive && (
              <button 
                id="btn-conflict-start-merge"
                className="btn btn-primary" 
                onClick={handleStartMerge}
              >
                <GitMerge size={16} />
                <span>Iniciar Fusión</span>
              </button>
            )}
          </section>

          {conflictActive && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '1.5rem' }}>
              
              {/* Diff Code Selection Area */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Editor del Archivo App.jsx</h4>
                
                {/* Diff Viewer Card */}
                <div className="diff-container">
                  {/* Left: Current HEAD */}
                  <div className="diff-pane">
                    <div className="diff-pane-header current">
                      <span>Cambio Actual (Tu HEAD)</span>
                      <span style={{ fontSize: '0.7rem' }}>main</span>
                    </div>
                    <div 
                      id="diff-pane-current"
                      className={`diff-pane-body ${selectedChange === 'current' ? 'selected' : ''}`}
                      onClick={() => handleSelect('current')}
                      disabled={resolved}
                      aria-label="Seleccionar cambio actual"
                    >
                      <pre><code>{currentCode}</code></pre>
                    </div>
                  </div>

                  {/* Right: Incoming change */}
                  <div className="diff-pane">
                    <div className="diff-pane-header incoming">
                      <span>Cambio Entrante</span>
                      <span style={{ fontSize: '0.7rem' }}>feature/custom-login</span>
                    </div>
                    <div 
                      id="diff-pane-incoming"
                      className={`diff-pane-body ${selectedChange === 'incoming' ? 'selected' : ''}`}
                      onClick={() => handleSelect('incoming')}
                      disabled={resolved}
                      aria-label="Seleccionar cambio entrante"
                    >
                      <pre><code>{incomingCode}</code></pre>
                    </div>
                  </div>
                </div>

                {/* Keep both button option */}
                <button 
                  id="btn-keep-both"
                  className={`btn btn-secondary ${selectedChange === 'both' ? 'active' : ''}`}
                  onClick={() => handleSelect('both')}
                  style={{ alignSelf: 'center', borderColor: selectedChange === 'both' ? 'var(--primary)' : 'var(--border-color)' }}
                  disabled={resolved}
                >
                  <Code size={16} />
                  <span>Conservar Ambos Cambios</span>
                </button>
              </div>

              {/* Status and Action Panel */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Resolución y Guardado</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Vista Previa Resolutiva:</p>
                  <div style={{ 
                    backgroundColor: 'hsl(222, 24%, 6%)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: 'var(--radius-sm)', 
                    padding: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: 'white',
                    minHeight: '120px',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {getPreviewCode()}
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button 
                    id="btn-conflict-resolve"
                    className={`btn ${resolved ? 'btn-secondary' : 'btn-primary'}`} 
                    onClick={handleResolve}
                    disabled={!selectedChange || resolved}
                    style={{ justifyContent: 'center' }}
                  >
                    <Check size={16} />
                    <span>Marcar como Resuelto</span>
                  </button>

                  <button 
                    id="btn-conflict-commit"
                    className="btn btn-outline" 
                    onClick={handleCommit}
                    disabled={!resolved || commitCreated}
                    style={{ justifyContent: 'center', borderColor: resolved && !commitCreated ? 'var(--color-local)' : 'var(--border-color)', color: resolved && !commitCreated ? 'var(--color-local)' : 'var(--text-tertiary)' }}
                  >
                    <GitCommit size={16} />
                    <span>git commit -m "Fix conflict"</span>
                  </button>
                </div>

                {commitCreated && (
                  <div style={{ backgroundColor: 'var(--color-local-bg)', border: '1px solid var(--color-local)', color: 'var(--color-local)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center' }}>
                    ✔ Conflicto guardado en el historial local.
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
