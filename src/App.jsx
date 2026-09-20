import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VisualSimulator from './components/VisualSimulator';
import GitHubHub from './components/GitHubHub';
import ConflictSolver from './components/ConflictSolver';
import Quizzes from './components/Quizzes';
import AITutor from './components/AITutor';
import VideoLearning from './components/VideoLearning';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  
  // Progress tracking for modules
  const [progress, setProgress] = useState({
    simulator: false,
    github: false,
    conflicts: false,
    quizzes: false,
    videolearning: false
  });

  // Git state context shared with AI Tutor
  const [gitContext, setGitContext] = useState({
    currentBranch: 'main',
    branches: ['main'],
    commits: [],
    workingDirectory: [],
    stagingArea: [],
    lastCommands: []
  });

  // Badges system for gamification
  const [badges, setBadges] = useState([
    { id: 'init', name: 'Repositorio Iniciado', desc: 'Inicializaste tu primer repositorio con git init.', icon: 'Terminal', unlocked: false },
    { id: 'commit', name: 'Creador de Historias', desc: 'Creaste tu primer commit local.', icon: 'GitCommit', unlocked: false },
    { id: 'branch', name: 'Explorador de Ramas', desc: 'Creaste una rama feature/login.', icon: 'GitBranch', unlocked: false },
    { id: 'merge', name: 'Maestro del Merge', desc: 'Fusionaste ramas con git merge exitosamente.', icon: 'GitMerge', unlocked: false },
    { id: 'restore', name: 'Viajero del Tiempo', desc: 'Descartaste cambios con git restore o reset.', icon: 'RotateCcw', unlocked: false },
    { id: 'remote', name: 'Enlazador de Nube', desc: 'Conectaste un repositorio remoto origin.', icon: 'CloudLightning', unlocked: false },
    { id: 'conflict', name: 'Domador de Conflictos', desc: 'Resolviste una colisión de código en merge/rebase.', icon: 'AlertTriangle', unlocked: false },
    { id: 'video_master', name: 'Autodidacta Visual', desc: 'Completaste lecciones magistrales en video.', icon: 'Video', unlocked: false },
    { id: 'quiz', name: 'Sabio de Git', desc: 'Respondiste correctamente todos los desafíos.', icon: 'Award', unlocked: false },
  ]);

  // AI Tutor message log state
  const [tutorMessages, setTutorMessages] = useState([
    { 
      text: '¡Hola! Bienvenido a GitPlayground, la plataforma educativa libre y abierta para dominar Git. Soy Nova, tu tutora impulsada por ShonnyProxy. Te guiaré con explicaciones socráticas y pistas mientras exploras el simulador y las clases en video.', 
      sender: 'bot' 
    }
  ]);

  const addTutorMessage = (text, sender = 'bot') => {
    setTutorMessages(prev => [...prev, { text, sender }]);
  };

  const unlockBadge = (id) => {
    setBadges(prev => {
      let isNewUnlock = false;
      const nextBadges = prev.map(badge => {
        if (badge.id === id && !badge.unlocked) {
          isNewUnlock = true;
          return { ...badge, unlocked: true };
        }
        return badge;
      });

      if (isNewUnlock) {
        const found = prev.find(b => b.id === id);
        // Show tutor message / badge notification
        setTimeout(() => {
          addTutorMessage(`🏆 ¡LOGRO DESBLOQUEADO!: "${found.name}". ${found.desc}`, 'bot');
        }, 600);
      }
      return nextBadges;
    });
  };

  // XP and Level Calculation
  const completedModulesCount = Object.values(progress).filter(Boolean).length;
  const unlockedBadgesCount = badges.filter(b => b.unlocked).length;
  const xp = (completedModulesCount * 50) + (unlockedBadgesCount * 100);

  const getLevel = () => {
    if (xp < 250) return 'Novato en Git 👶';
    if (xp < 500) return 'Desarrollador Local 💻';
    if (xp < 750) return 'Colaborador de Ramas 🌿';
    if (xp < 1000) return 'Guardián de Integración 🛡️';
    return 'Maestro Git de la UCV 🎓';
  };

  const level = getLevel();

  // Render view based on active tab
  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <Dashboard 
            setCurrentTab={setCurrentTab} 
            progress={progress} 
            xp={xp}
            level={level}
            badges={badges}
            unlockBadge={unlockBadge}
          />
        );
      case 'videolearning':
        return (
          <VideoLearning 
            setCurrentTab={setCurrentTab} 
            unlockBadge={unlockBadge} 
          />
        );
      case 'simulator':
        return (
          <VisualSimulator 
            progress={progress} 
            setProgress={setProgress} 
            addTutorMessage={addTutorMessage} 
            unlockBadge={unlockBadge}
            setGitContext={setGitContext}
          />
        );
      case 'github':
        return (
          <GitHubHub 
            progress={progress} 
            setProgress={setProgress} 
            addTutorMessage={addTutorMessage} 
            unlockBadge={unlockBadge}
          />
        );
      case 'conflicts':
        return (
          <ConflictSolver 
            progress={progress} 
            setProgress={setProgress} 
            addTutorMessage={addTutorMessage} 
            unlockBadge={unlockBadge}
          />
        );
      case 'quizzes':
        return (
          <Quizzes 
            progress={progress} 
            setProgress={setProgress} 
            addTutorMessage={addTutorMessage} 
            unlockBadge={unlockBadge}
          />
        );
      default:
        return (
          <Dashboard 
            setCurrentTab={setCurrentTab} 
            progress={progress} 
            xp={xp}
            level={level}
            badges={badges}
            unlockBadge={unlockBadge}
          />
        );
    }
  };

  return (
    <div className="app-container" id="app-root-container">
      {/* Decorative Glow Elements */}
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>

      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        progress={progress} 
        theme={theme} 
        setTheme={setTheme} 
        xp={xp}
        level={level}
        badges={badges}
      />

      {/* Main Core Workstation */}
      <main className="main-content" id="main-content-panel">
        {renderContent()}
      </main>

      {/* Intelligent AI Tutor Powered by ShonnyProxy */}
      <AITutor 
        tutorMessages={tutorMessages} 
        addTutorMessage={addTutorMessage} 
        xp={xp} 
        level={level} 
        gitContext={gitContext}
      />
    </div>
  );
}

export default App;
