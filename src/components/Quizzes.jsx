import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  HelpCircle, 
  Award, 
  ChevronRight,
  RotateCcw,
  BookOpen
} from 'lucide-react';

export default function Quizzes({ progress, setProgress, addTutorMessage, unlockBadge }) {
  const quizData = [
    {
      id: 1,
      question: '¿Qué caracteriza principalmente al flujo de trabajo Trunk-Based Development?',
      options: [
        { text: 'Los desarrolladores trabajan en ramas secundarias de larga duración y se integran cada 3 meses.', isCorrect: false },
        { text: 'Todos los desarrolladores fusionan sus cambios en una sola rama principal ("trunk" o "main") con alta frecuencia, evitando ramas largas.', isCorrect: true },
        { text: 'No se permite crear ramas locales, todo el código se edita y compila en un servidor en la nube directamente.', isCorrect: false }
      ],
      explanation: 'Trunk-Based Development promueve la integración continua unificando cambios pequeños y rápidos diariamente en la rama principal. Esto reduce drásticamente las colisiones de código y acelera los lanzamientos.'
    },
    {
      id: 2,
      question: 'Si buscas mantener un historial de commits totalmente lineal, limpio y libre de commits de fusión (merge commits) adicionales, ¿qué comando deberías preferir?',
      options: [
        { text: 'git merge', isCorrect: false },
        { text: 'git rebase', isCorrect: true },
        { text: 'git reset --hard', isCorrect: false }
      ],
      explanation: 'git rebase "reescribe la historia" levantando tus commits y aplicándolos directamente en la punta de la rama destino. Esto genera un flujo lineal sin commits de fusión adicionales, ideal para limpiar tu historial local antes de un push.'
    },
    {
      id: 3,
      question: 'En el flujo de trabajo Gitflow, ¿cuál es el propósito de la rama "develop"?',
      options: [
        { text: 'Alojar únicamente las versiones estables finales de producción etiquetadas con tags.', isCorrect: false },
        { text: 'Servir como rama de integración principal para las ramas de características (features) en desarrollo.', isCorrect: true },
        { text: 'Actuar como un repositorio personal exclusivo del líder técnico del proyecto.', isCorrect: false }
      ],
      explanation: 'En Gitflow, "develop" es el núcleo de integración. Las ramas "feature" nacen de ella y regresan a ella tras completar las revisiones. Solo se promueve a "main" cuando se prepara un release estable.'
    },
    {
      id: 4,
      question: 'Si ya subiste tus commits a una rama compartida en GitHub y necesitas deshacer los cambios de uno de ellos, ¿cuál es la mejor práctica?',
      options: [
        { text: 'Usar "git reset --hard HEAD~1" para borrar el commit de la historia local y remota.', isCorrect: false },
        { text: 'Usar "git revert <commit_hash>" para crear un nuevo commit que compensa y anula los cambios del commit previo de forma segura.', isCorrect: true },
        { text: 'Borrar la carpeta local ".git" y volver a clonar el proyecto entero.', isCorrect: false }
      ],
      explanation: 'git revert crea un nuevo commit seguro con los cambios invertidos sin alterar la historia existente. git reset reescribe la historia pública, lo cual crearía graves problemas de sincronización al resto del equipo.'
    },
    {
      id: 5,
      question: '¿Qué significa entrar en un estado de "Detached HEAD" (HEAD desasociado) en Git?',
      options: [
        { text: 'Tu editor de código ha perdido la conexión de internet con el servidor remoto GitHub.', isCorrect: false },
        { text: 'El puntero HEAD está apuntando directamente a un commit hash específico del historial en lugar de a una rama local.', isCorrect: true },
        { text: 'Has borrado accidentalmente la rama "main" en tu repositorio local.', isCorrect: false }
      ],
      explanation: 'Un Detached HEAD ocurre cuando haces checkout a un commit hash específico. Los commits nuevos que realices en este estado no pertenecerán a ninguna rama y podrían perderse si cambias de rama sin guardarlos en una nueva.'
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null); // index
  const [answered, setAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    if (quizFinished && correctAnswers === quizData.length && !progress.quizzes) {
      setProgress(prev => ({ ...prev, quizzes: true }));
      unlockBadge('quiz');
      addTutorMessage(
        '¡Formidable! Has aprobado todas las preguntas sobre flujos de Git. Comprender las arquitecturas de trabajo (Trunk-based y Gitflow) y saber cuándo aplicar merge vs rebase es lo que distingue a un estudiante júnior de un ingeniero que entra al campo profesional. ¡Has completado con éxito la ruta teórica!'
      );
    }
  }, [quizFinished, correctAnswers, progress.quizzes]);

  const handleSelectOption = (optIdx) => {
    if (answered) return;
    setSelectedOpt(optIdx);
    setAnswered(true);
    
    if (quizData[currentIdx].options[optIdx].isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setAnswered(false);
    
    if (currentIdx < quizData.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setAnswered(false);
    setCorrectAnswers(0);
    setQuizFinished(false);
  };

  return (
    <div className="quizzes-container fade-in-slide" id="quizzes-root">
      <header className="top-bar">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--text-primary), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Desafíos y Quizzes Interactivos
          </h2>
          <p style={{ marginTop: '0.2rem' }}>Prueba tus destrezas sobre flujos de trabajo profesionales y comandos avanzados.</p>
        </div>
      </header>

      {!quizFinished ? (
        <section className="card quiz-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Progress Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            <span>Pregunta {currentIdx + 1} de {quizData.length}</span>
            <span>Respuestas Correctas: {correctAnswers}</span>
          </div>

          {/* Question Text */}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.5rem', lineHeight: '1.45' }}>
            {quizData[currentIdx].question}
          </h3>

          {/* Options list */}
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {quizData[currentIdx].options.map((opt, idx) => {
              let optClass = 'quiz-option';
              let suffixIcon = null;

              if (answered) {
                if (opt.isCorrect) {
                  optClass += ' correct';
                  suffixIcon = <Check size={18} style={{ marginLeft: 'auto', color: 'var(--color-local)' }} />;
                } else if (selectedOpt === idx) {
                  optClass += ' incorrect';
                  suffixIcon = <X size={18} style={{ marginLeft: 'auto', color: 'var(--color-working)' }} />;
                }
              }

              return (
                <button
                  key={idx}
                  id={`quiz-option-btn-${idx}`}
                  className={optClass}
                  onClick={() => handleSelectOption(idx)}
                  disabled={answered}
                  style={{
                    borderWidth: selectedOpt === idx ? '2px' : '1px',
                    borderColor: answered && opt.isCorrect ? 'var(--color-local)' : answered && selectedOpt === idx ? 'var(--color-working)' : 'var(--border-color)'
                  }}
                >
                  <span style={{ 
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--bg-primary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span style={{ flex: 1 }}>{opt.text}</span>
                  {suffixIcon}
                </button>
              );
            })}
          </div>

          {/* Explanation Area */}
          {answered && (
            <div style={{ 
              marginTop: '1.25rem', 
              padding: '1.15rem 1.5rem', 
              backgroundColor: 'var(--bg-secondary)', 
              borderLeft: quizData[currentIdx].options[selectedOpt].isCorrect ? '4px solid var(--color-local)' : '4px solid var(--color-working)',
              borderRadius: 'var(--radius-sm)',
              animation: 'slideIn 0.25s ease-out'
            }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: quizData[currentIdx].options[selectedOpt].isCorrect ? 'var(--color-local)' : 'var(--color-working)', marginBottom: '0.4rem' }}>
                <BookOpen size={16} />
                <span>{quizData[currentIdx].options[selectedOpt].isCorrect ? '¡Respuesta Correcta!' : 'Respuesta Incorrecta'}</span>
              </h4>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                {quizData[currentIdx].explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {answered && (
            <button 
              id="btn-quiz-next"
              className="btn btn-primary"
              onClick={handleNext}
              style={{ alignSelf: 'flex-end', marginTop: '1rem' }}
            >
              <span>{currentIdx < quizData.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Quiz'}</span>
              <ChevronRight size={16} />
            </button>
          )}
        </section>
      ) : (
        <section className="card quiz-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem', padding: '3rem 2rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            backgroundColor: correctAnswers === quizData.length ? 'var(--color-local-bg)' : 'var(--primary-light)',
            color: correctAnswers === quizData.length ? 'var(--color-local)' : 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)'
          }}>
            <Award size={48} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {correctAnswers === quizData.length 
                ? '¡Felicidades, Puntuación Perfecta!' 
                : `Obtuviste ${correctAnswers} de ${quizData.length} puntos`}
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '85%', marginInline: 'auto' }}>
              {correctAnswers === quizData.length 
                ? 'Has dominado completamente el cuestionario de metodologías. Estás listo para guiar flujos eficientes en equipos de desarrollo.' 
                : 'Casi lo logras. Te sugerimos revisar las explicaciones y volver a intentarlo para conseguir el 100%.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              id="btn-quiz-restart"
              className="btn btn-secondary" 
              onClick={handleRestart}
            >
              <RotateCcw size={16} />
              <span>Reiniciar Quiz</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
