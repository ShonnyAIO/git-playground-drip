import React, { useState, useEffect } from 'react';
import { 
  GitPullRequest, 
  GitBranch, 
  GitCommit, 
  CloudLightning, 
  Share2, 
  User, 
  MessageSquare,
  CheckCircle,
  FileCode,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';

export default function GitHubHub({ progress, setProgress, addTutorMessage, unlockBadge }) {
  // Remote state
  const [remoteAdded, setRemoteAdded] = useState(false);
  const [remoteCommits, setRemoteCommits] = useState([
    { hash: '3a5b2f1', message: 'Initial commit', branch: 'main' }
  ]);
  const [localCommits, setLocalCommits] = useState([
    { hash: '3a5b2f1', message: 'Initial commit', branch: 'main' },
    { hash: 'a1b2c3d', message: 'Crea estructura de login', branch: 'feature/oauth' },
    { hash: 'e5f6g7h', message: 'Agrega vistas de recuperación de contraseña', branch: 'feature/oauth' }
  ]);
  
  const [remoteBranches, setRemoteBranches] = useState({ main: '3a5b2f1' });
  const [localPushed, setLocalPushed] = useState(false);
  const [prCreated, setPrCreated] = useState(false);
  const [prMerged, setPrMerged] = useState(false);
  const [localSynced, setLocalSynced] = useState(false);

  // Interactive Review state
  const [reviewSolved, setReviewSolved] = useState(false);

  // Pull Request Details
  const reviews = [
    { 
      user: 'Javier Darder', 
      role: 'Reviewer', 
      text: 'El flujo de OAuth2 se ve limpio y seguro. ¿Probaste qué pasa si el token expira?', 
      status: reviewSolved ? 'approved' : 'pending' 
    },
    { 
      user: 'Ricardo Riera', 
      role: 'Reviewer', 
      text: 'Buen trabajo con el diseño responsivo en las vistas de recuperación de contraseña. Se ve excelente.', 
      status: 'approved' 
    }
  ];

  // Logic to track module completion
  useEffect(() => {
    if (remoteAdded && localPushed && prCreated && reviewSolved && prMerged && localSynced && !progress.github) {
      setProgress(prev => ({ ...prev, github: true }));
      addTutorMessage(
        '¡Impresionante! Has terminado el módulo de GitHub y Remotos. Lograste simular el flujo completo de colaboración profesional: 1) Conectarte al servidor remoto (git remote add). 2) Empujar tus ramas locales (git push). 3) Proponer cambios mediante un Pull Request. 4) Recibir y resolver Code Reviews del equipo. 5) Integrar el PR en el servidor y 6) Sincronizar de vuelta a tu máquina (git pull).'
      );
    }
  }, [remoteAdded, localPushed, prCreated, reviewSolved, prMerged, localSynced, progress.github]);

  const handleAddRemote = () => {
    setRemoteAdded(true);
    unlockBadge('remote');
    addTutorMessage(
      'Has configurado la conexión remota con: "git remote add origin https://github.com/dpred-ucv/proyecto-git.git". Esto enlaza tu repositorio local con el de la nube.'
    );
  };

  const handlePush = () => {
    if (!remoteAdded) {
      alert('Debes agregar el repositorio remoto primero.');
      return;
    }
    setLocalPushed(true);
    // Copy commits
    setRemoteCommits([...localCommits]);
    setRemoteBranches(prev => ({
      ...prev,
      main: '3a5b2f1',
      'feature/oauth': 'e5f6g7h'
    }));
    addTutorMessage(
      '¡Subida completada con "git push origin feature/oauth"! Ahora las ramas y commits están guardados en GitHub. Se ha detectado la nueva rama en el servidor remoto, permitiéndote abrir un Pull Request (PR).'
    );
  };

  const handleCreatePR = () => {
    setPrCreated(true);
    addTutorMessage(
      'Has abierto un Pull Request en GitHub: "Integrar feature/oauth en main". El equipo de ingeniería del proyecto ha sido notificado para revisar tus cambios y comentar en el Code Review.'
    );
  };

  const handleMergePR = () => {
    setPrMerged(true);
    // Remote main merges feature/oauth
    const mergedCommits = [
      ...localCommits,
      { hash: '9b8c7d6', message: "Merge pull request #1 from feature/oauth", branch: 'main' }
    ];
    setRemoteCommits(mergedCommits);
    setRemoteBranches({
      main: '9b8c7d6'
    });
    addTutorMessage(
      '¡Pull Request fusionado con éxito en el servidor! La rama "feature/oauth" ahora forma parte del historial oficial de la rama "main". Tu repositorio local ahora está desactualizado respecto al remoto por 1 commit de fusión.'
    );
  };

  const handlePull = () => {
    if (!prMerged) {
      alert('Primero debes fusionar el Pull Request en GitHub para actualizar el servidor remoto.');
      return;
    }
    setLocalSynced(true);
    setLocalCommits([
      ...localCommits,
      { hash: '9b8c7d6', message: "Merge pull request #1 from feature/oauth", branch: 'main' }
    ]);
    addTutorMessage(
      '¡Sincronizado! Ejecutaste "git pull origin main" localmente. Esto descargó (fetch) los nuevos commits de fusión remotos y los integró (merge) en tu rama local. ¡Tu proyecto está al día!'
    );
  };

  return (
    <div className="github-container fade-in-slide" id="github-hub-root">
      <header className="top-bar">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--text-primary), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            El Puente: Conexión con GitHub y Colaboración
          </h2>
          <p style={{ marginTop: '0.2rem' }}>Simula flujos de trabajo profesionales, Pull Requests y revisiones de código de tu equipo.</p>
        </div>
      </header>

      {/* Level requirements card */}
      <section className="card" style={{ 
        borderLeft: progress.github ? '4px solid var(--color-local)' : '4px solid var(--primary)',
        backgroundColor: 'var(--bg-card)',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Misión 2: Colaboración Profesional</span>
          {progress.github && <CheckCircle size={16} style={{ color: 'var(--color-local)' }} />}
        </h3>
        <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Instrucciones:
          1. Vincula el servidor remoto haciendo click en "Conectar Remoto".
          2. Sube la rama de características local haciendo click en "git push".
          3. Abre un "Pull Request (PR)" para proponer los cambios.
          4. Lee y analiza el Code Review del equipo, resuelve el comentario de revisión sugerido en la ventana de GitHub y haz "Fusionar PR" (Merge).
          5. Vuelve al repositorio local y haz "git pull" para sincronizar la historia oficial de main.
        </p>
      </section>

      {/* Simulation Layout: Local vs Remote */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Local Repository Simulator Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem' }}>
              <span style={{ color: 'var(--primary)' }}>💻 Repositorio Local</span>
            </h4>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              branch: main
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 600 }}>Historial de Commits Local:</p>
            <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {localCommits.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
                  <GitCommit size={16} style={{ color: c.branch === 'main' ? 'var(--primary)' : 'var(--color-remote)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{c.hash}</span>
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.message}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{c.branch}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                id="btn-remote-add"
                className={`btn ${remoteAdded ? 'btn-secondary' : 'btn-primary glow-active'}`} 
                onClick={handleAddRemote} 
                disabled={remoteAdded}
                style={{ flex: 1 }}
              >
                <CloudLightning size={16} />
                <span>{remoteAdded ? 'Remoto Vinculado' : 'Conectar Remoto'}</span>
              </button>
              
              <button 
                id="btn-git-push"
                className={`btn btn-secondary ${remoteAdded && !localPushed ? 'glow-active' : ''}`} 
                onClick={handlePush} 
                disabled={!remoteAdded || localPushed}
                style={{ flex: 1 }}
              >
                <ArrowUpRight size={16} />
                <span>git push origin</span>
              </button>
            </div>
            
            <button 
              id="btn-git-pull"
              className={`btn btn-outline ${prMerged && !localSynced ? 'glow-active' : ''}`} 
              onClick={handlePull} 
              disabled={!prMerged || localSynced}
              style={{ justifyContent: 'center' }}
            >
              <ArrowDownLeft size={16} />
              <span>git pull origin main</span>
            </button>
          </div>
        </div>

        {/* GitHub / Remote Simulator Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderColor: 'var(--color-remote)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem' }}>
              <span style={{ color: 'var(--color-remote)' }}>☁️ GitHub (Servidor Remoto)</span>
            </h4>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: remoteAdded ? 'var(--color-remote-bg)' : 'var(--bg-secondary)', color: remoteAdded ? 'var(--color-remote)' : 'var(--text-tertiary)' }}>
              {remoteAdded ? 'Conectado' : 'Desconectado'}
            </span>
          </div>

          {!remoteAdded ? (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', padding: '2rem', textAlign: 'center' }}>
              <CloudLightning size={48} style={{ marginBottom: '1rem', color: 'var(--text-tertiary)' }} />
              <p style={{ fontSize: '0.9rem' }}>El servidor GitHub está vacío y esperando conexión remota.</p>
            </div>
          ) : (
            <>
              {/* Commit history in Remote */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 600 }}>Historial en GitHub (origin/main):</p>
                <div style={{ maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {remoteCommits.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
                      <GitCommit size={16} style={{ color: 'var(--color-remote)' }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{c.hash}</span>
                      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.message}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{c.branch}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* GitHub Flow Actions */}
              <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {localPushed && !prCreated && (
                  <button 
                    id="btn-create-pr"
                    className="btn btn-primary glow-active" 
                    onClick={handleCreatePR}
                    style={{ justifyContent: 'center', backgroundColor: 'var(--color-remote)' }}
                  >
                    <GitPullRequest size={16} />
                    <span>Crear Pull Request (PR)</span>
                  </button>
                )}

                {prCreated && !prMerged && (
                  <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <GitPullRequest size={18} style={{ color: 'var(--color-remote)' }} />
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>PR #1: Integrar feature/oauth</span>
                    </div>
                    
                    {/* Simulated Code Review */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                      {reviews.map((r, idx) => (
                        <div key={idx} style={{ fontSize: '0.78rem', borderLeft: r.status === 'approved' ? '2px solid var(--color-local)' : '2px solid var(--color-working)', paddingLeft: '0.5rem', paddingBottom: '0.2rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                            <span>{r.user}</span>
                            <span style={{ color: r.status === 'approved' ? 'var(--color-local)' : 'var(--color-working)' }}>
                              {r.status === 'approved' ? 'Aprobado ✔' : 'Cambio Sugerido ⚠'}
                            </span>
                          </div>
                          <p style={{ color: 'var(--text-secondary)', marginTop: '0.1rem' }}>"{r.text}"</p>
                          
                          {/* If pending and Javier Darder, render Code Diff and solver action */}
                          {r.status === 'pending' && r.user === 'Javier Darder' && (
                            <div style={{ margin: '0.5rem 0', border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                              <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.25rem 0.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                                file: src/auth.js (líneas 10-14)
                              </div>
                              <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.08)', color: 'var(--color-working)', padding: '0.15rem 0.5rem' }}>
                                - const login = (token) =&gt; &#123;
                              </div>
                              <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.08)', color: 'var(--color-working)', padding: '0.15rem 0.5rem' }}>
                                -   saveSession(token);
                              </div>
                              <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.08)', color: 'var(--color-working)', padding: '0.15rem 0.5rem' }}>
                                - &#125;
                              </div>
                              <div style={{ padding: '0.4rem', backgroundColor: 'var(--bg-card)', display: 'flex', justifyContent: 'center' }}>
                                <button 
                                  id="btn-resolve-review"
                                  className="btn btn-primary glow-active" 
                                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                                  onClick={() => {
                                    setReviewSolved(true);
                                    addTutorMessage('¡Excelente! Has resuelto la revisión de código aplicando la expiración de sesión. El Pull Request ahora cuenta con la aprobación requerida para fusionarse.');
                                  }}
                                >
                                  Resolver Comentario (Aplicar código sugerido)
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Applied code preview once resolved */}
                    {reviewSolved && (
                      <div style={{ margin: '0.5rem 0 1rem 0', border: '1px solid var(--color-local)', borderRadius: '4px', overflow: 'hidden', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                        <div style={{ backgroundColor: 'var(--color-local-bg)', padding: '0.25rem 0.5rem', fontSize: '0.7rem', color: 'var(--color-local)', borderBottom: '1px solid var(--color-local)' }}>
                          file: src/auth.js (Líneas modificadas)
                        </div>
                        <div style={{ color: 'var(--color-local)', padding: '0.25rem 0.5rem' }}>
                          + const login = (token, expiration) =&gt; &#123;<br/>
                          +   saveSession(token);<br/>
                          +   scheduleSessionCleanup(expiration); // ¡Corrección aplicada!<br/>
                          + &#125;
                        </div>
                      </div>
                    )}

                    <button 
                      id="btn-merge-pr"
                      className={`btn btn-primary ${reviewSolved ? 'glow-active' : ''}`} 
                      onClick={handleMergePR}
                      disabled={!reviewSolved}
                      style={{ 
                        width: '100%', 
                        justifyContent: 'center', 
                        backgroundColor: reviewSolved ? 'var(--color-local)' : 'var(--bg-tertiary)', 
                        color: reviewSolved ? 'white' : 'var(--text-tertiary)',
                        cursor: reviewSolved ? 'pointer' : 'not-allowed'
                      }}
                    >
                      <CheckCircle size={16} />
                      <span>{reviewSolved ? 'Fusionar Pull Request (Merge)' : 'Fusión bloqueada por Review'}</span>
                    </button>
                  </div>
                )}

                {prMerged && (
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'var(--color-local-bg)', borderRadius: 'var(--radius-md)', color: 'var(--color-local)', fontWeight: 600, fontSize: '0.88rem' }}>
                    🎉 PR fusionado con éxito en el servidor.
                  </div>
                )}

                {!localPushed && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                    Sube cambios con "git push" para desbloquear flujos de Pull Request.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
