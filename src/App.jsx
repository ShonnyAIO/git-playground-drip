import { useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VisualSimulator from './components/VisualSimulator';
import GitHubHub from './components/GitHubHub';
import ConflictSolver from './components/ConflictSolver';
import Quizzes from './components/Quizzes';
import AITutor from './components/AITutor';
import VideoLearning from './components/VideoLearning';
import { BADGES } from './state/badges';
import { deriveLevel, deriveXp } from './state/learnerStore';
import { useLearner } from './state/useLearner';

function App() {
  const [learner, dispatch] = useLearner();
  const { currentTab, theme, progress } = learner;
  const setCurrentTab = (tab) => dispatch({ type: 'setTab', tab });
  const setTheme = (next) => dispatch({ type: 'setTheme', theme: typeof next === 'function' ? next(theme) : next });
  const completeModule = (module) => dispatch({ type: 'completeModule', module });

  // Git state context shared with AI Tutor
  const [gitContext, setGitContext] = useState({
    currentBranch: 'main',
    branches: ['main'],
    commits: [],
    workingDirectory: [],
    stagingArea: [],
    lastCommands: []
  });

  const badges = BADGES.map(b => ({ ...b, unlocked: learner.unlockedBadges.includes(b.id) }));

  // AI Tutor message log state
  const [tutorMessages, setTutorMessages] = useState([
    { 
      text: '¡Hola! Bienvenido a GitPlayground, la plataforma educativa libre y abierta para dominar Git. Soy Nova, tu tutora impulsada por ShonnyProxy. Te guiaré con explicaciones socráticas y pistas mientras exploras el simulador y las lecciones animadas.', 
      sender: 'bot' 
    }
  ]);

  const addTutorMessage = (text, sender = 'bot') => {
    setTutorMessages(prev => [...prev, { text, sender }]);
  };

  // Ref, no estado: varias llamadas en el mismo render no deben notificar dos veces.
  const unlockedRef = useRef(new Set(learner.unlockedBadges));
  useEffect(() => {
    unlockedRef.current = new Set(learner.unlockedBadges);
  }, [learner.unlockedBadges]);

  const unlockBadge = (id) => {
    const badge = BADGES.find(b => b.id === id);
    if (!badge || unlockedRef.current.has(id)) return;
    unlockedRef.current.add(id);
    dispatch({ type: 'unlockBadge', id });
    setTimeout(() => {
      addTutorMessage(`🏆 ¡LOGRO DESBLOQUEADO!: "${badge.name}". ${badge.desc}`, 'bot');
    }, 600);
  };

  const xp = deriveXp(learner);
  const level = deriveLevel(xp);

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
          />
        );
      case 'videolearning':
        return (
          <VideoLearning 
            setCurrentTab={setCurrentTab} 
            unlockBadge={unlockBadge} 
            completeModule={completeModule}
            completedLessons={learner.completedLessons}
            setLessonCompleted={(id, completed) => dispatch({ type: 'setLessonCompleted', id, completed })}
          />
        );
      case 'simulator':
        return (
          <VisualSimulator 
            progress={progress} 
            completeModule={completeModule} 
            addTutorMessage={addTutorMessage} 
            unlockBadge={unlockBadge}
            setGitContext={setGitContext}
          />
        );
      case 'github':
        return (
          <GitHubHub 
            progress={progress} 
            completeModule={completeModule} 
            addTutorMessage={addTutorMessage} 
            unlockBadge={unlockBadge}
          />
        );
      case 'conflicts':
        return (
          <ConflictSolver 
            progress={progress} 
            completeModule={completeModule} 
            addTutorMessage={addTutorMessage} 
            unlockBadge={unlockBadge}
          />
        );
      case 'quizzes':
        return (
          <Quizzes 
            progress={progress} 
            completeModule={completeModule} 
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
        onResetProgress={() => dispatch({ type: 'reset' })}
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
