import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  GitMerge, 
  GitCommit, 
  Code, 
  Check, 
  HelpCircle,
  Maximize2,
  CheckCircle,
  RotateCcw
} from 'lucide-react';

export default function ConflictSolver({ progress, setProgress, addTutorMessage, unlockBadge }) {
  const [conflictActive, setConflictActive] = useState(false);
  const [selectedChange, setSelectedChange] = useState(null); // 'current', 'incoming', 'both'
  const [resolved, setResolved] = useState(false);
  const [commitCreated, setCommitCreated] = useState(false);
  const [currentTab, setCurrentTab] = useState('theory'); // 'theory', 'simulator'
  
  // Interactive additions
  const [conflictType, setConflictType] = useState('merge'); // 'merge' or 'rebase'
  const [showCrashAlert, setShowCrashAlert] = useState(false);

  const currentCode = `const LoginButton = () => {\n  return <button className="btn-primary">Entrar al Sistema</button>;\n};`;
  const incomingCode = `const LoginButton = () => {\n  return <button style={{ background: 'purple' }}>Ingresar</button>;\n};`;
  const bothCode = `const LoginButton = () => {\n  // Ambos cambios conservados\n  return <button className="btn-primary" style={{ background: 'purple' }}>Entrar al Sistema</button>;\n};`;

  useEffect(() => {
    if (commitCreated && !progress.conflicts) {
      setProgress(prev => ({ ...prev, conflicts: true }));
      unlockBadge('conflict');
      addTutorMessage(
        `¡Soberbio! Has resuelto el conflicto usando el flujo de ${conflictType === 'merge' ? 'Merge (Fusión)' : 'Rebase (Reorganización)'}. Entender la diferencia entre ambos y saber cómo elegir cambios en el editor es lo que te mantendrá a salvo de perder código en tus proyectos de trabajo real.`
      );
    }
  }, [commitCreated, progress.conflicts]);

  const handleStartMerge = (type = 'merge') => {
    setConflictType(type);
    setSelectedChange(null);
    setResolved(false);
    setCommitCreated(false);
    
    setConflictActive(true);
    setCurrentTab('simulator');
    
    // Trigger persistent visual crash overlay until acknowledged
    setShowCrashAlert(true);

    if (type === 'merge') {
      addTutorMessage(
        'Has iniciado la fusión (git merge) de la rama "feature/custom-login". Git ha encontrado que ambos modificaron la función "LoginButton" en la línea 4. Se ha detenido la fusión y se han inyectado marcas de conflicto. ¡Debes solucionarlo eligiendo qué versión conservar!'
      );
    } else {
      addTutorMessage(
        'Has iniciado la reorganización (git rebase) sobre main. Git está intentando aplicar tus commits locales en la punta. Se ha encontrado una colisión en "LoginButton". Debes resolver el conflicto y luego ejecutar "git rebase --continue" para reanudar el rebase.'
      );
    }
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
    if (conflictType === 'merge') {
      addTutorMessage(
        '¡Conflicto marcado como resuelto en el editor! Has limpiado las marcas de conflicto (<<<<<<<, =======, >>>>>>>). Ahora debes ejecutar "git commit" para guardar el merge commit final.'
      );
    } else {
      addTutorMessage(
        '¡Conflicto marcado como resuelto en el editor! La versión unificada está lista. Para continuar aplicando tus commits, ejecuta: "git rebase --continue".'
      );
    }
  };

  const handleCommit = () => {
    setCommitCreated(true);
    if (conflictType === 'merge') {
      addTutorMessage(
        '¡Merge commit de resolución creado con éxito! Tu historial de Git vuelve a estar sano y los cambios de ambas ramas se han unificado de forma segura. ¡Buen trabajo!'
      );
    } else {
      addTutorMessage(
        '¡Rebase completado con éxito! Se reanudó la aplicación de commits de forma lineal. Tu historial está limpio, unificado y no se crearon commits de fusión adicionales. ¡Estilo profesional!'
      );
    }
  };

  const getPreviewCode = () => {
    if (selectedChange === 'current') return currentCode;
    if (selectedChange === 'incoming') return incomingCode;
    if (selectedChange === 'both') return bothCode;
    
    if (conflictType === 'merge') {
      return `<<<<<<< HEAD (Cambio Actual - Tu Rama main)
const LoginButton = () => {
  return <button className="btn-primary">Entrar al Sistema</button>;
};
=======
const LoginButton = () => {
  return <button style={{ background: 'purple' }}>Ingresar</button>;
};
>>>>>>> feature/custom-login (Cambio Entrante - Rama Externa)`;
    } else {
      return `<<<<<<< HEAD (main - Cambio en Destino)
const LoginButton = () => {
  return <button className="btn-primary">Entrar al Sistema</button>;
};
=======
const LoginButton = () => {
  return <button style={{ background: 'purple' }}>Ingresar</button>;
};
>>>>>>> feature/custom-login (Tu Commit en feature - Aplicándose en la punta)`;
    }
  };

  return (
    <div className="conflicts-container fade-in-slide" id="conflict-solver-root" style={{ position: 'relative' }}>
      <header className="top-bar">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--text-primary), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            El Modo Supervivencia: Resolución de Conflictos
          </h2>
          <p style={{ marginTop: '0.2rem' }}>Aprende por qué ocurren los conflictos y cómo resolverlos paso a paso como un profesional.</p>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button 
          id="btn-conflict-tab-theory"
          className={`btn ${currentTab === 'theory' ? 'btn-primary shadow-neon-primary' : 'btn-secondary'}`}
          onClick={() => setCurrentTab('theory')}
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          Teoría: Merge vs Rebase
        </button>
        <button 
          id="btn-conflict-tab-sim"
          className={`btn ${currentTab === 'simulator' ? 'btn-primary shadow-neon-primary' : 'btn-secondary'}`}
          onClick={() => {
            setCurrentTab('simulator');
            if (!conflictActive) {
              handleStartMerge('merge');
            }
          }}
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
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 800 }}>
                  <GitMerge size={20} />
                  <span>Método 1: Git Merge</span>
                </h4>
                <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  Crea un nuevo commit especial llamado <strong>Merge Commit</strong> que une los dos historiales.
                  Conserva la historia real exacta en la que ocurrieron los eventos.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-local)', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--color-local-bg)', width: 'fit-content' }}>
                  ✔ Ideal para ramas compartidas y auditoría
                </span>
                <button 
                  id="btn-theory-start-merge"
                  className="btn btn-secondary" 
                  style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem' }}
                  onClick={() => handleStartMerge('merge')}
                >
                  Simular Conflicto con Merge
                </button>
              </div>
            </div>

            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-remote)', marginBottom: '0.5rem', fontWeight: 800 }}>
                  <GitCommit size={20} />
                  <span>Método 2: Git Rebase</span>
                </h4>
                <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  Toma tus commits locales, los levanta y los coloca en la punta de la otra rama (reescribe la historia).
                  Deja un historial limpio y lineal sin commits de fusión adicionales.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-working)', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--color-working-bg)', width: 'fit-content' }}>
                  ⚠ Peligroso en ramas públicas compartidas
                </span>
                <button 
                  id="btn-theory-start-rebase"
                  className="btn btn-secondary" 
                  style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem' }}
                  onClick={() => handleStartMerge('rebase')}
                >
                  Simular Conflicto con Rebase
                </button>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'center' }}>
            <button 
              id="start-conflict-btn"
              className="btn btn-primary glow-active shadow-neon-primary"
              onClick={() => handleStartMerge('merge')}
            >
              <span>Ir al Simulador (Merge)</span>
              <AlertTriangle size={16} />
            </button>
          </div>
        </section>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
          
          {/* Visual Crash Overlay Animation */}
          {showCrashAlert && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(225, 29, 72, 0.95)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              zIndex: 10, borderRadius: 'var(--radius-md)', color: 'white',
              backdropFilter: 'blur(4px)',
              padding: '2rem',
              animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both'
            }}>
              <AlertTriangle size={68} style={{ animation: 'shake 0.4s infinite', color: 'white' }} />
              <h3 style={{ color: 'white', fontSize: '1.85rem', fontWeight: 900, marginTop: '1rem', letterSpacing: '-0.02em', textAlign: 'center' }}>
                ¡CHOQUE DE COMMITS DETECTADO!
              </h3>
              <p style={{ color: 'white', marginTop: '0.5rem', opacity: 0.95, fontSize: '0.95rem', maxWidth: '80%', textAlign: 'center' }}>
                Git no puede decidir automáticamente qué cambio conservar en <strong>App.jsx</strong>.<br />
                Resolución requerida en: <code>{conflictType === 'merge' ? 'git merge' : 'git rebase'}</code>.
              </p>
              <button 
                id="btn-dismiss-crash-alert"
                className="btn" 
                onClick={() => setShowCrashAlert(false)}
                style={{ 
                  marginTop: '1.5rem', 
                  backgroundColor: 'white', 
                  color: '#e11d48', 
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  padding: '0.65rem 1.6rem',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                  cursor: 'pointer'
                }}
              >
                Entendido, examinar conflicto →
              </button>
            </div>
          )}

          {/* Level guidelines */}
          <section className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Conflicto en App.jsx ({conflictType === 'merge' ? 'Merge' : 'Rebase'})</span>
                {commitCreated && <CheckCircle size={16} style={{ color: 'var(--color-local)' }} />}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {!conflictActive 
                  ? 'Haz click en "Iniciar Fusión" para simular un choque de commits.' 
                  : resolved 
                    ? 'Conflicto resuelto en el editor. Ejecuta el comando para continuar.' 
                    : 'Selecciona una versión del botón, haz click en "Marcar Resuelto" y finaliza la integración.'}
              </p>
            </div>
            {!conflictActive && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  id="btn-conflict-start-merge"
                  className="btn btn-primary" 
                  onClick={() => handleStartMerge('merge')}
                >
                  <GitMerge size={16} />
                  <span>Fusión (Merge)</span>
                </button>
                <button 
                  id="btn-conflict-start-rebase"
                  className="btn btn-primary" 
                  onClick={() => handleStartMerge('rebase')}
                >
                  <GitCommit size={16} />
                  <span>Reorganización (Rebase)</span>
                </button>
              </div>
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
                    <div className="diff-pane-header current" style={{ borderTop: '3px solid var(--color-working)' }}>
                      <span>{conflictType === 'merge' ? 'Cambio Actual (Tu HEAD)' : 'Cambio en Destino (HEAD / main)'}</span>
                      <span style={{ fontSize: '0.7rem' }}>main</span>
                    </div>
                    <div 
                      id="diff-pane-current"
                      className={`diff-pane-body ${selectedChange === 'current' ? 'selected' : ''}`}
                      onClick={() => handleSelect('current')}
                      disabled={resolved}
                      aria-label="Seleccionar cambio actual"
                      style={{ opacity: resolved && selectedChange !== 'current' ? 0.4 : 1 }}
                    >
                      <pre><code>{currentCode}</code></pre>
                    </div>
                  </div>

                  {/* Right: Incoming change */}
                  <div className="diff-pane">
                    <div className="diff-pane-header incoming" style={{ borderTop: '3px solid var(--color-remote)' }}>
                      <span>{conflictType === 'merge' ? 'Cambio Entrante' : 'Tu Commit (feature/custom-login)'}</span>
                      <span style={{ fontSize: '0.7rem' }}>feature/custom-login</span>
                    </div>
                    <div 
                      id="diff-pane-incoming"
                      className={`diff-pane-body ${selectedChange === 'incoming' ? 'selected' : ''}`}
                      onClick={() => handleSelect('incoming')}
                      disabled={resolved}
                      aria-label="Seleccionar cambio entrante"
                      style={{ opacity: resolved && selectedChange !== 'incoming' ? 0.4 : 1 }}
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
                  style={{ alignSelf: 'center', borderColor: selectedChange === 'both' ? 'var(--primary)' : 'var(--border-color)', opacity: resolved && selectedChange !== 'both' ? 0.4 : 1 }}
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
                    backgroundColor: 'hsl(222, 24%, 4%)', 
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
                    className={`btn ${resolved ? 'btn-secondary' : 'btn-primary glow-active'}`} 
                    onClick={handleResolve}
                    disabled={!selectedChange || resolved}
                    style={{ justifyContent: 'center' }}
                  >
                    <Check size={16} />
                    <span>Marcar como Resuelto</span>
                  </button>

                  {resolved && !commitCreated && (
                    <button 
                      id="btn-conflict-undo-selection"
                      type="button"
                      className="btn btn-secondary" 
                      onClick={() => setResolved(false)}
                      style={{ 
                        justifyContent: 'center', 
                        borderColor: 'var(--color-working)', 
                        color: 'var(--color-working)',
                        fontSize: '0.82rem',
                        padding: '0.45rem'
                      }}
                      aria-label="Reabrir opciones de selección de conflicto"
                    >
                      <RotateCcw size={14} />
                      <span>Cambiar / Reabrir Selección</span>
                    </button>
                  )}

                  <button 
                    id="btn-conflict-commit"
                    className={`btn btn-outline ${resolved && !commitCreated ? 'glow-active' : ''}`} 
                    onClick={handleCommit}
                    disabled={!resolved || commitCreated}
                    style={{ 
                      justifyContent: 'center', 
                      borderColor: resolved && !commitCreated ? 'var(--color-local)' : 'var(--border-color)', 
                      color: resolved && !commitCreated ? 'var(--color-local)' : 'var(--text-tertiary)',
                      fontWeight: 600
                    }}
                  >
                    {conflictType === 'merge' ? (
                      <>
                        <GitMerge size={16} />
                        <span>git commit -m "Fix conflict"</span>
                      </>
                    ) : (
                      <>
                        <GitCommit size={16} />
                        <span>git rebase --continue</span>
                      </>
                    )}
                  </button>
                </div>

                {commitCreated && (
                  <div className="pop-in-file" style={{ backgroundColor: 'var(--color-local-bg)', border: '1px solid var(--color-local)', color: 'var(--color-local)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center' }}>
                    {conflictType === 'merge' 
                      ? '✔ Merge commit de resolución guardado localmente.' 
                      : '✔ Rebase reanudado y completado con éxito.'}
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
