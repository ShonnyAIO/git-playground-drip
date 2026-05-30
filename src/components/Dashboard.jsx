import React from 'react';
import { 
  Terminal, 
  Share2, 
  AlertTriangle, 
  Award, 
  BookOpen, 
  CheckCircle,
  Play,
  ExternalLink
} from 'lucide-react';

export default function Dashboard({ setCurrentTab, progress }) {
  
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

  return (
    <div className="dashboard-container fade-in-slide" id="dashboard-root">
      <header className="top-bar">
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--text-primary), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Hola de nuevo, Desarrollador 👋
          </h2>
          <p style={{ marginTop: '0.25rem' }}>Bienvenido a tu campo de entrenamiento de Git y GitHub visual.</p>
        </div>
      </header>

      {/* Welcome Banner */}
      <section className="card" style={{ 
        background: 'linear-gradient(135deg, var(--primary-light), rgba(162, 28, 255, 0.03))',
        border: '1px solid var(--primary)',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-neon-primary)'
      }}>
        <div style={{ maxWidth: '70%', position: 'relative', zIndex: 2 }}>
          <span style={{ 
            backgroundColor: 'var(--primary)', 
            color: 'white', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            padding: '0.25rem 0.75rem', 
            borderRadius: 'var(--radius-full)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            boxShadow: '0 2px 8px rgba(162, 28, 255, 0.2)'
          }}>
            Proyecto de Innovación Educativa (DPRED - UCV)
          </span>
          <h3 style={{ fontSize: '1.75rem', marginTop: '0.75rem', marginBottom: '0.75rem', fontWeight: 800 }}>
            Domina Git visualmente, no de memoria.
          </h3>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
            El 80% de estudiantes llega a su primer trabajo sin entender realmente Git.
            Esta plataforma interactiva te enseña qué pasa "bajo el capó" en tu directorio <code style={{ fontSize: '0.85rem' }}>.git</code>
            mediante simulaciones gráficas y resolución de problemas prácticos en tiempo real.
          </p>
          <button 
            id="start-training-btn"
            className="btn btn-primary shadow-neon-primary"
            onClick={() => setCurrentTab('simulator')}
          >
            <Play size={16} fill="white" />
            <span>Iniciar Entrenamiento</span>
          </button>
        </div>
        
        {/* Decorative elements */}
        <div style={{ 
          position: 'absolute', 
          right: '5%', 
          bottom: '-10%', 
          opacity: 0.15,
          pointerEvents: 'none'
        }}>
          <Terminal size={240} style={{ color: 'var(--primary)' }} />
        </div>
      </section>

      {/* Stats Cards Row */}
      <section className="dashboard-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ 
            backgroundColor: 'var(--primary-light)', 
            color: 'var(--primary)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)' 
          }}>
            <BookOpen size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalCompletados} / 4</h4>
            <p style={{ fontSize: '0.85rem' }}>Módulos Completados</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ 
            backgroundColor: 'hsl(142, 70%, 95%)', 
            color: 'var(--color-local)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)' 
          }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {totalCompletados === 4 ? 'Listo para el Trabajo' : 'En Progreso'}
            </h4>
            <p style={{ fontSize: '0.85rem' }}>Estado de Preparación</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ 
            backgroundColor: 'hsl(199, 85%, 95%)', 
            color: 'var(--color-remote)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)' 
          }}>
            <ExternalLink size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Material UCV DPRED</h4>
            <p style={{ fontSize: '0.85rem' }}>Escuela de Computación</p>
          </div>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>Tu Ruta de Aprendizaje</h3>
        <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Completa los módulos secuencialmente para ganar confianza en Git y GitHub.</p>
        
        <div className="mission-map">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.id} className="mission-row">
                <div 
                  className={`mission-indicator ${m.completed ? 'completed' : m.num === 1 || progress[modules[m.num - 2].id] ? 'active' : ''}`}
                >
                  {m.completed ? (
                    <CheckCircle size={24} />
                  ) : (
                    <Icon size={24} />
                  )}
                </div>
                
                <div className="card mission-content-card">
                  <div className="mission-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="mission-title">{m.title}</span>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 700, 
                        padding: '0.15rem 0.5rem', 
                        borderRadius: '4px',
                        backgroundColor: m.difficulty === 'Fácil' ? 'hsl(142, 70%, 95%)' : m.difficulty === 'Medio' ? 'hsl(199, 85%, 95%)' : m.difficulty === 'Avanzado' ? 'hsl(350, 85%, 95%)' : 'var(--bg-secondary)',
                        color: m.difficulty === 'Fácil' ? 'var(--color-local)' : m.difficulty === 'Medio' ? 'var(--color-remote)' : m.difficulty === 'Avanzado' ? 'var(--color-working)' : 'var(--text-secondary)'
                      }}>
                        {m.difficulty}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>🕒 {m.time}</span>
                    </div>
                    <p className="mission-desc" style={{ marginTop: '0.25rem', maxWidth: '85%' }}>{m.desc}</p>
                  </div>
                  
                  <button 
                    id={`enter-module-btn-${m.id}`}
                    className={`btn ${m.completed ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => setCurrentTab(m.id)}
                  >
                    <span>{m.completed ? 'Repasar' : 'Ingresar'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
