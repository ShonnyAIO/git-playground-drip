import { useState } from 'react';
import { Award, CheckCircle, ChevronRight, ExternalLink, Clapperboard, Terminal } from 'lucide-react';
import { LESSONS } from '../lessons/content/index.js';
import { formatClock, lessonDuration } from '../lessons/engine/index.js';
import LessonPlayer from '../lessons/render/LessonPlayer.jsx';
import './VideoLearning.css';

const LEVEL_FILTERS = ['Todas', 'Básico', 'Intermedio', 'Avanzado'];

// Comandos que la lección ejecuta, en orden y sin repetir (derivados de los pasos, no duplicados a mano).
const lessonCommands = (lesson) => [...new Set(lesson.steps.map(s => s.command).filter(Boolean))];

export default function VideoLearning({ setCurrentTab, unlockBadge, completeModule, completedLessons, setLessonCompleted }) {
  const [selectedId, setSelectedId] = useState(LESSONS[0].id);
  const [filter, setFilter] = useState('Todas');

  const lesson = LESSONS.find(l => l.id === selectedId) ?? LESSONS[0];
  const isDone = (id) => completedLessons.includes(id);
  const doneCount = LESSONS.filter(l => isDone(l.id)).length;
  const visible = LESSONS.filter(l => filter === 'Todas' || l.level === filter);

  const setDone = (id, done) => {
    setLessonCompleted(id, done);
    if (done && LESSONS.every(l => l.id === id || isDone(l.id))) {
      unlockBadge('video_master');
      completeModule('videolearning');
    }
  };

  return (
    <div className="module-container library" id="video-learning-root">
      <header className="library-header">
        <div>
          <h2 className="library-title">
            <Clapperboard size={26} aria-hidden="true" />
            Lecciones animadas
          </h2>
          <p className="library-subtitle">
            Mira cómo se mueve Git por dentro y luego practícalo en el simulador. Pausa, retrocede o avanza paso a paso.
          </p>
        </div>
        <div className="library-stat">
          <Award size={18} aria-hidden="true" />
          <div>
            <span className="library-stat-label">Completadas</span>
            <span className="library-stat-value">{doneCount} / {LESSONS.length}</span>
          </div>
        </div>
      </header>

      <div className="library-filters" role="group" aria-label="Filtrar por nivel">
        {LEVEL_FILTERS.map(level => (
          <button key={level} className={`library-chip ${filter === level ? 'is-active' : ''}`}
            aria-pressed={filter === level} onClick={() => setFilter(level)}>
            {level}
          </button>
        ))}
      </div>

      <div className="layout-split library-grid" style={{ '--cols': 'minmax(0, 1fr) 320px' }}>
        <div className="library-main">
          <LessonPlayer key={lesson.id} lesson={lesson} onComplete={(id) => setDone(id, true)} />

          <section className="library-card" aria-labelledby="lesson-title">
            <div className="library-card-head">
              <div>
                <span className="library-meta">{lesson.level} · {lesson.steps.length} pasos · {formatClock(lessonDuration(lesson))} min</span>
                <h3 id="lesson-title" className="library-lesson-title">{lesson.title}</h3>
              </div>
              <button className={`library-done ${isDone(lesson.id) ? 'is-done' : ''}`} aria-pressed={isDone(lesson.id)}
                onClick={() => setDone(lesson.id, !isDone(lesson.id))}>
                <CheckCircle size={16} aria-hidden="true" />
                {isDone(lesson.id) ? 'Completada' : 'Marcar como completada'}
              </button>
            </div>

            <div>
              <h4 className="library-label">Al terminar podrás</h4>
              <ul className="library-objectives">
                {lesson.objectives.map(o => <li key={o}>{o}</li>)}
              </ul>
            </div>

            <div>
              <h4 className="library-label">Comandos de la lección</h4>
              <div className="library-commands">
                {lessonCommands(lesson).map(cmd => <code key={cmd}>{cmd}</code>)}
              </div>
            </div>

            <div className="library-practice">
              <button id="btn-practice-current-lesson" className="btn btn-primary" onClick={() => setCurrentTab(lesson.practice.tab)}>
                <Terminal size={16} aria-hidden="true" />
                <span>{lesson.practice.label}</span>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>

            {lesson.furtherReading.length > 0 && (
              <div>
                <h4 className="library-label">Para profundizar</h4>
                <ul className="library-links">
                  {lesson.furtherReading.map(r => (
                    <li key={r.url}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer">
                        {r.title}
                        <ExternalLink size={13} aria-hidden="true" />
                        <span className="sr-only"> (abre en otra pestaña)</span>
                      </a>
                      <span className="library-author">{r.author}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        <nav className="library-playlist" aria-label="Temario de lecciones">
          <h3 className="library-label">Temario ({LESSONS.length} lecciones)</h3>
          <ol>
            {visible.map(l => {
              const n = LESSONS.indexOf(l) + 1;
              return (
                <li key={l.id}>
                  <button id={`playlist-item-${l.id}`} className={`library-item ${l.id === lesson.id ? 'is-current' : ''}`}
                    aria-current={l.id === lesson.id ? 'true' : undefined} onClick={() => setSelectedId(l.id)}>
                    <span className={`library-item-num ${isDone(l.id) ? 'is-done' : ''}`} aria-hidden="true">
                      {isDone(l.id) ? <CheckCircle size={16} /> : n}
                    </span>
                    <span className="library-item-text">
                      <span className="library-item-title">{l.title}</span>
                      <span className="library-item-meta">
                        {l.level} · {formatClock(lessonDuration(l))} min{isDone(l.id) ? ' · completada' : ''}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
