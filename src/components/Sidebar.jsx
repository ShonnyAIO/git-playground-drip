import React, { useEffect } from 'react';
import { 
  Terminal, 
  Share2, 
  AlertTriangle, 
  HelpCircle, 
  Award, 
  BookOpen,
  Sun,
  Moon,
  Home
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, progress, theme, setTheme }) {
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
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
          <Terminal size={24} />
        </div>
        <div className="brand-name">
          <h1>GitPlayground</h1>
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
