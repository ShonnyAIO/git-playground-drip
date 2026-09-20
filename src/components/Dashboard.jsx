import React from 'react';
import { 
  Terminal, 
  Share2, 
  AlertTriangle, 
  Award, 
  BookOpen, 
  CheckCircle,
  Play,
  ExternalLink,
  GitCommit,
  GitBranch,
  GitMerge,
  RotateCcw,
  CloudLightning,
  Lock,
  Sparkles,
  User,
  Compass,
  Video
} from 'lucide-react';

const iconMap = {
  Terminal,
  GitCommit,
  GitBranch,
  GitMerge,
  RotateCcw,
  CloudLightning,
  AlertTriangle,
  Award
};

export default function Dashboard({ setCurrentTab, progress, xp, level, badges, unlockBadge }) {
  
  const modules = [
    {
      id: 'simulator',
      num: 1,
      title: 'Módulo 1: El Core - Estados de Git',
      desc: 'Comprende el Working Directory, Staging Area y Local Repository. Aprende a crear commits y moverte por el grafo visual de ramas.',
      difficulty: 'Fácil',
      time: '15 min',
      completed: progress.simulator,
      icon: Terminal,
      color: 'var(--primary)'
    },
    {
      id: 'github',
      num: 2,
      title: 'Módulo 2: El Puente - Conexión con GitHub',
      desc: 'Simula el flujo de push, fetch y pull. Experimenta con Pull Requests y simulaciones de Code Review para trabajo profesional.',
      difficulty: 'Medio',
      time: '20 min',
      completed: progress.github,
      icon: Share2,
      color: 'hsl(199, 85%, 55%)'
    },
    {
      id: 'conflicts',
      num: 3,
      title: 'Módulo 3: Supervivencia - Resolución de Conflictos',
      desc: '¡El mayor terror de los desarrolladores! Domina la diferencia entre Merge y Rebase, y soluciona un conflicto real de código línea por línea.',
      difficulty: 'Avanzado',
      time: '25 min',
      completed: progress.conflicts,
      icon: AlertTriangle,
      color: 'hsl(350, 85%, 60%)'
    },
    {
      id: 'quizzes',
      num: 4,
      title: 'Módulo 4: Quizzes de Flujos de Trabajo',
      desc: 'Pon a prueba tus conocimientos sobre Gitflow y Trunk-Based Development. Consolida las buenas prácticas de la industria.',
      difficulty: 'Teórico',
      time: '10 min',
      completed: progress.quizzes,
      icon: Award,
      color: 'hsl(38, 85%, 55%)'
    }
  ];

  const totalCompletados = Object.values(progress).filter(Boolean).length;
  const totalBadgesUnlocked = badges.filter(b => b.unlocked).length;

  return (
    <div className="dashboard-container fade-in-slide" id="dashboard-root">
      <header className="top-bar">
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--text-primary), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Hola, Desarrollador 👋
          </h2>
          <p style={{ marginTop: '0.25rem' }}>Bienvenido a tu estación de entrenamiento y simulación interactiva de Git.</p>
        </div>
      </header>

      {/* Narrative Section: Misión de Rescate de Código */}
      <section className="card" style={{ 
        background: 'linear-gradient(135deg, rgba(240, 80, 50, 0.08), rgba(66, 133, 244, 0.05))',
        border: '1px solid var(--border-color)',
        borderLeft: '5px solid var(--primary)',
        marginBottom: '2rem',
        padding: '1.75rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
          <div style={{
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-neon-primary)'
          }}>
            <Compass size={32} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'white', 
              fontSize: '0.7rem', 
              fontWeight: 800, 
              padding: '0.2rem 0.6rem', 
              borderRadius: 'var(--radius-sm)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Misión de Rescate de Código
            </span>
            <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>
              ¿Salvarás el proyecto de tu equipo en UCV-Systems?
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
              <strong>Tu Rol:</strong> Eres un Ingeniero de Software recién incorporado al equipo. 
              Tus compañeros <strong>Carlos, Ricardo y Javier</strong> han estado subiendo código a lo loco: ramas rotas, 
              commits sin sentido, conflictos bloqueantes en <code>main</code> y repositorios remotos totalmente desalineados. 
              Tu líder técnico te ha encargado la misión de ordenar el caos. Debes adentrarte en el core local, 
              sincronizar los cambios con la nube, resolver los choques en el editor y demostrar que dominas los flujos de trabajo profesionales.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button 
                id="start-training-btn"
                className="btn btn-primary shadow-neon-primary"
                onClick={() => setCurrentTab('simulator')}
                style={{ background: 'var(--primary)', color: 'white' }}
              >
                <Play size={16} fill="white" />
                <span>Ingresar al Workspace</span>
              </button>
              <button 
                id="open-videolearning-btn"
                className="btn btn-secondary"
                onClick={() => setCurrentTab('videolearning')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', backgroundColor: 'var(--bg-secondary)' }}
              >
                <Video size={16} style={{ color: '#3b82f6' }} />
                <span>Clases en Video (6 Lecciones)</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Subtle Decorative SVG / Icon in background */}
        <div style={{ 
          position: 'absolute', 
          right: '2%', 
          bottom: '-15%', 
          opacity: 0.05,
          pointerEvents: 'none'
        }}>
          <Terminal size={220} />
        </div>
      </section>

      {/* Gamification HUD Panel */}
      <section className="dashboard-grid" style={{ marginBottom: '2.5rem' }}>
        {/* XP Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(240, 80, 50, 0.1)', color: 'var(--primary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <Sparkles size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Rango Actual</span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{level}</h4>
            </div>
          </div>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              <span>Progreso de Nivel</span>
              <span>{xp} / 1000 XP</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <div style={{ width: `${(xp / 1000) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), hsl(217, 89%, 61%))', borderRadius: 'var(--radius-full)', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
            </div>
          </div>
        </div>

        {/* Modules Stats */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ 
            backgroundColor: 'rgba(52, 168, 83, 0.1)', 
            color: 'var(--color-local)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)' 
          }}>
            <BookOpen size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Entrenamiento</span>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalCompletados} / 4</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Módulos Completados</p>
          </div>
        </div>

        {/* Medals unlocked */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ 
            backgroundColor: 'rgba(251, 188, 5, 0.1)', 
            color: 'var(--color-staging)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)' 
          }}>
            <Award size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Colección</span>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalBadgesUnlocked} / {badges.length}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Logros Desbloqueados</p>
          </div>
        </div>
      </section>

      {/* Main Grid: Roadmap & Achievements */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Side: Learning Roadmap */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Tu Ruta de Aprendizaje</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Completa cada nivel interactivo para dominar los conceptos.</p>
            </div>
            {totalCompletados === 4 && (
              <span style={{ backgroundColor: 'var(--color-local-bg)', color: 'var(--color-local)', fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-local)' }}>
                🎉 ¡Certificación Completa!
              </span>
            )}
          </div>
          
          <div className="mission-map">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.id} className="mission-row">
                  <div 
                    className={`mission-indicator ${m.completed ? 'completed' : m.num === 1 || progress[modules[m.num - 2].id] ? 'active' : ''}`}
                    style={{
                      backgroundColor: m.completed ? 'var(--color-local)' : 'var(--bg-card)',
                      borderColor: m.completed ? 'var(--color-local)' : (m.num === 1 || progress[modules[m.num - 2].id] ? 'var(--primary)' : 'var(--border-color)')
                    }}
                  >
                    {m.completed ? (
                      <CheckCircle size={24} />
                    ) : (
                      <Icon size={24} />
                    )}
                  </div>
                  
                  <div className="card mission-content-card" style={{ transition: 'transform 0.2s', cursor: 'default' }}>
                    <div className="mission-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span className="mission-title" style={{ fontWeight: 700 }}>{m.title}</span>
                        <span style={{ 
                          fontSize: '0.65rem', 
                          fontWeight: 800, 
                          padding: '0.15rem 0.5rem', 
                          borderRadius: '4px',
                          backgroundColor: m.difficulty === 'Fácil' ? 'rgba(52, 168, 83, 0.12)' : m.difficulty === 'Medio' ? 'rgba(66, 133, 244, 0.12)' : m.difficulty === 'Avanzado' ? 'rgba(234, 67, 53, 0.12)' : 'var(--bg-secondary)',
                          color: m.difficulty === 'Fácil' ? 'var(--color-local)' : m.difficulty === 'Medio' ? 'hsl(217, 89%, 61%)' : m.difficulty === 'Avanzado' ? 'var(--color-working)' : 'var(--text-secondary)'
                        }}>
                          {m.difficulty}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          🕒 {m.time}
                        </span>
                      </div>
                      <p className="mission-desc" style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '90%' }}>{m.desc}</p>
                    </div>
                    
                    <button 
                      id={`enter-module-btn-${m.id}`}
                      className={`btn ${m.completed ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => setCurrentTab(m.id)}
                      style={{ 
                        padding: '0.6rem 1.1rem',
                        fontSize: '0.85rem',
                        backgroundColor: m.completed ? 'var(--bg-secondary)' : 'var(--primary)',
                        color: m.completed ? 'var(--text-primary)' : 'white'
                      }}
                    >
                      <span>{m.completed ? 'Repasar' : 'Ingresar'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Side: Badges Grid & Achievements Locker */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🏅 Logros Obtenidos</span>
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '1.25rem', textTransform: 'uppercase', fontWeight: 600 }}>Desbloquea medallas usando comandos</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {badges.map(b => {
                const IconComponent = iconMap[b.icon] || Award;
                return (
                  <div 
                    key={b.id} 
                    title={`${b.name}: ${b.desc} (${b.unlocked ? 'Desbloqueado' : 'Bloqueado'})`}
                    style={{
                      aspectRatio: '1',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: b.unlocked ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
                      border: b.unlocked ? '2px solid var(--primary)' : '1px dashed var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      color: b.unlocked ? 'var(--primary)' : 'var(--text-tertiary)',
                      boxShadow: b.unlocked ? 'var(--shadow-neon-primary)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {b.unlocked ? (
                      <IconComponent size={22} />
                    ) : (
                      <Lock size={16} style={{ opacity: 0.6 }} />
                    )}
                    
                    {/* Small dot notification for unlock */}
                    {b.unlocked && (
                      <span style={{
                        position: 'absolute',
                        top: '-3px',
                        right: '-3px',
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'var(--color-local)',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid white'
                      }}></span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* List details of last unlocked badge */}
            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              padding: '0.85rem', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: '0.8rem'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>Detalle de Logro</span>
              {totalBadgesUnlocked === 0 ? (
                <p style={{ marginTop: '0.25rem', color: 'var(--text-secondary)' }}>Aún no has desbloqueado medallas. ¡Inicializa tu primer repositorio en el Simulador para empezar!</p>
              ) : (
                <div style={{ marginTop: '0.25rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    {badges.filter(b => b.unlocked)[totalBadgesUnlocked - 1].name}
                  </strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.1rem' }}>
                    {badges.filter(b => b.unlocked)[totalBadgesUnlocked - 1].desc}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* DUA Accessibility / Project Info */}
          <div className="card" style={{ padding: '1.25rem', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>Acerca de este RED</span>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Este recurso ha sido estructurado bajo los principios del <strong>Diseño Universal para el Aprendizaje (DUA)</strong> 
              y las pautas de accesibilidad <strong>WCAG AA</strong>. 
              Usa contrastes accesibles y tutoría inteligente invisible en español para reducir la frustración técnica.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>Grupo UCV #4:</span>
              <strong style={{ color: 'var(--text-primary)' }}>Torres, Riera, Darder</strong>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
