import React, { useEffect } from 'react';
import { 
  Terminal, 
  Share2, 
  AlertTriangle, 
  HelpCircle, 
  Award, 
  BookOpen, 
  Video,
  Sun, 
  Moon, 
  Home
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, progress, theme, setTheme, xp, level, badges }) {
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'videolearning', name: 'Clases & Videos', icon: Video },
    { id: 'simulator', name: 'Simulador Core', icon: Terminal },
    { id: 'github', name: 'GitHub & Remotos', icon: Share2 },
    { id: 'conflicts', name: 'Resolución de Conflictos', icon: AlertTriangle },
    { id: 'quizzes', name: 'Desafíos & Quizzes', icon: Award },
  ];

  // Calculate percentage of progress
  const totalSteps = Object.keys(progress).length;
  const completedSteps = Object.values(progress).filter(Boolean).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <aside className="sidebar" id="sidebar-container">
      <div className="brand-container">
        <div className="brand-icon">
          <Terminal size={20} />
        </div>
        <div>
          <h1 className="brand-name">GitPlayground</h1>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            DPRED • UCV
          </span>
        </div>
      </div>

      {/* User Rank & XP Profile HUD */}
      <div style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        padding: '0.9rem 1.1rem', 
        borderRadius: 'var(--radius-md)', 
        marginBottom: '1.5rem',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: 'var(--radius-full)', 
            backgroundColor: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.9rem',
            boxShadow: 'var(--shadow-primary)'
          }}>
            UCV
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Estudiante UCV</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>{level}</span>
          </div>
        </div>
        <div style={{ marginTop: '0.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Experiencia (XP)</span>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{xp} / 1000 XP</span>
          </div>
          <div style={{ width: '100%', height: '5px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ width: `${(xp / 1000) * 100}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.5s ease-out' }}></div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
          <span>Medallas Ganadas:</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>🏅 {badges.filter(b => b.unlocked).length} / {badges.length}</span>
        </div>
      </div>

      <nav aria-label="Navegación principal">
        <ul className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  id={`nav-btn-${item.id}`}
                  className={`nav-item-btn ${currentTab === item.id ? 'active' : ''}`}
                  onClick={() => setCurrentTab(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="progress-card">
          <div className="progress-header">
            <span>Progreso General</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {completedSteps} de {totalSteps} módulos listos
          </div>
        </div>

        <button 
          id="theme-toggle-btn"
          className="btn btn-secondary" 
          onClick={toggleTheme}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={18} />
              <span>Modo Claro</span>
            </>
          ) : (
            <>
              <Moon size={18} />
              <span>Modo Oscuro</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
