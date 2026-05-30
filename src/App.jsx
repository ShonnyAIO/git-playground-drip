import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VisualSimulator from './components/VisualSimulator';
import GitHubHub from './components/GitHubHub';
import ConflictSolver from './components/ConflictSolver';
import Quizzes from './components/Quizzes';
import AITutor from './components/AITutor';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  
  // Progress tracking for modules
  const [progress, setProgress] = useState({
    simulator: false,
    github: false,
    conflicts: false,
    quizzes: false
  });

  // AI Tutor message log state
  const [tutorMessages, setTutorMessages] = useState([
    { 
      text: '¡Hola! Bienvenido a GitPlayground, tu plataforma interactiva para dominar Git y GitHub. Soy tu tutor virtual. Te daré pistas y explicaciones útiles en español mientras navegas por los módulos.', 
      sender: 'bot' 
    }
  ]);

  const addTutorMessage = (text, sender = 'bot') => {
    setTutorMessages(prev => [...prev, { text, sender }]);
  };

  // Render view based on active tab
  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard setCurrentTab={setCurrentTab} progress={progress} />;
      case 'simulator':
        return (
          <VisualSimulator 
            progress={progress} 
            setProgress={setProgress} 
            addTutorMessage={addTutorMessage} 
          />
        );
      case 'github':
        return (
          <GitHubHub 
            progress={progress} 
            setProgress={setProgress} 
            addTutorMessage={addTutorMessage} 
          />
        );
      case 'conflicts':
        return (
          <ConflictSolver 
            progress={progress} 
            setProgress={setProgress} 
            addTutorMessage={addTutorMessage} 
          />
        );
      case 'quizzes':
        return (
          <Quizzes 
            progress={progress} 
            setProgress={setProgress} 
            addTutorMessage={addTutorMessage} 
          />
        );
      default:
        return <Dashboard setCurrentTab={setCurrentTab} progress={progress} />;
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
      />

      {/* Main Core Workstation */}
      <main className="main-content" id="main-content-panel">
        {renderContent()}
      </main>

      {/* Simulated AI Tutor Chatbot bubble */}
      <AITutor 
        tutorMessages={tutorMessages} 
        addTutorMessage={addTutorMessage} 
      />
    </div>
  );
}

export default App;
