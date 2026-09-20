import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Terminal, 
  ExternalLink, 
  Sparkles, 
  Award,
  Video,
  Layers,
  GitBranch,
  GitMerge,
  Share2,
  AlertTriangle,
  RotateCcw,
  ChevronRight
} from 'lucide-react';

const LESSONS = [
  {
    id: 1,
    title: '1. La Trinidad de Git: Working Directory, Staging y Repositorio',
    category: 'Básico',
    duration: '07:15',
    icon: Layers,
    embedUrl: 'https://www.youtube-nocookie.com/embed/HiXLkL42tMU?start=30',
    summary: 'Comprende el ciclo de vida de un archivo en Git. Deja atrás las carpetas "proyecto_final_v2_este_si" y domina cómo funciona el Staging Area antes de sellar un commit.',
    timestamps: [
      { time: '00:30', label: 'El problema de versionar a mano' },
      { time: '02:15', label: 'Working Directory vs Staging Area' },
      { time: '04:45', label: 'Creación del primer commit inmutable' },
      { time: '06:10', label: 'Lectura del comando git status' }
    ],
    commands: ['git init', 'git status', 'git add <archivo>', 'git commit -m "mensaje"'],
    targetTab: 'simulator',
    targetActionLabel: 'Practicar en Simulador Core'
  },
  {
    id: 2,
    title: '2. Ramas y Punteros: Navegando en el Grafo sin Miedo a HEAD',
    category: 'Básico',
    duration: '08:40',
    icon: GitBranch,
    embedUrl: 'https://www.youtube-nocookie.com/embed/VdGzPZ31ts8?start=60',
    summary: 'Una rama en Git no es una copia de archivos, es un puntero liviano de 41 bytes. Aprende a moverte entre ramas y descubre qué significa el puntero HEAD.',
    timestamps: [
      { time: '01:00', label: '¿Qué es realmente una rama en disco?' },
      { time: '03:20', label: 'El rol del puntero HEAD' },
      { time: '05:40', label: 'Crear y saltar con git switch / checkout' },
      { time: '07:15', label: 'Estado Detached HEAD y cómo evitarlo' }
    ],
    commands: ['git branch <nombre>', 'git switch -c <nombre>', 'git checkout <rama>', 'git log --oneline --graph'],
    targetTab: 'simulator',
    targetActionLabel: 'Crear Ramas en el Grafo Vivo'
  },
  {
    id: 3,
    title: '3. Integración de Código: Fast-Forward vs 3-Way Merge',
    category: 'Intermedio',
    duration: '06:50',
    icon: GitMerge,
    embedUrl: 'https://www.youtube-nocookie.com/embed/ANF1X42_ae4?start=45',
    summary: 'Aprende cuándo Git une ramas simplemente deslizando el puntero hacia adelante (Fast-Forward) y cuándo debe sintetizar un commit especial de fusión.',
    timestamps: [
      { time: '00:45', label: 'Condiciones para Fast-Forward' },
      { time: '02:50', label: 'El commit de fusión de tres vías (3-Way Merge)' },
      { time: '04:40', label: 'Flags útiles: --no-ff y --squash' },
      { time: '05:55', label: 'Limpieza de ramas locales fusionadas' }
    ],
    commands: ['git merge <rama>', 'git merge --no-ff <rama>', 'git branch -d <rama>'],
    targetTab: 'simulator',
    targetActionLabel: 'Simular Fusiones en la Consola'
  },
  {
    id: 4,
    title: '4. GitHub y Remotos: Push, Pull y Pull Requests Profesionales',
    category: 'Intermedio',
    duration: '09:20',
    icon: Share2,
    embedUrl: 'https://www.youtube-nocookie.com/embed/RGOj5yH7evk?start=90',
    summary: 'El repositorio remoto es otro clon del grafo en la nube. Conecta tu repositorio local con GitHub, haz push de tus ramas y simula el flujo de Code Review.',
    timestamps: [
      { time: '01:30', label: 'Configurando el remoto origin' },
      { time: '03:50', label: 'Diferencia vital entre fetch y pull' },
      { time: '06:10', label: 'Creación de un Pull Request limpio' },
      { time: '08:00', label: 'Revisión de código y aprobación' }
    ],
    commands: ['git remote add origin <url>', 'git push -u origin <rama>', 'git fetch', 'git pull'],
    targetTab: 'github',
    targetActionLabel: 'Abrir Simulador de GitHubHub'
  },
  {
    id: 5,
    title: '5. Anatomía de Conflictos: Resolución Línea por Línea',
    category: 'Avanzado',
    duration: '10:15',
    icon: AlertTriangle,
    embedUrl: 'https://www.youtube-nocookie.com/embed/il5k5E_8Z-Y?start=120',
    summary: 'Pierde el miedo al conflicto. Descubre por qué ocurren los choques de edición, cómo leer las marcas de delimitación y cómo decidir qué líneas conservar.',
    timestamps: [
      { time: '02:00', label: '¿Por qué ocurre una colisión?' },
      { time: '04:15', label: 'Lectura de marcas <<<<<<< HEAD y >>>>>>>' },
      { time: '06:50', label: 'Estrategias de resolución en equipo' },
      { time: '08:45', label: 'Merge vs Rebase: ¿cuándo usar cuál?' }
    ],
    commands: ['git merge', 'git diff', 'git add <resuelto>', 'git commit'],
    targetTab: 'conflicts',
    targetActionLabel: 'Entrar al Conflict Solver 3-Way'
  },
  {
    id: 6,
    title: '6. El Botiquín de Emergencias: Stash, Restore y Reflog',
    category: 'Avanzado',
    duration: '08:10',
    icon: RotateCcw,
    embedUrl: 'https://www.youtube-nocookie.com/embed/e2IbNHi4uCI?start=30',
    summary: 'Herramientas de rescate del desarrollador senior. Guarda cambios provisionales en el cajón con stash y rescata commits aparentemente eliminados con el reflog.',
    timestamps: [
      { time: '01:10', label: 'git stash para emergencias de cambio de rama' },
      { time: '03:40', label: 'Descartar cambios con git restore' },
      { time: '05:30', label: 'git reset --soft vs --hard explicados' },
      { time: '07:00', label: 'git reflog: el diario de salvación' }
    ],
    commands: ['git stash', 'git stash pop', 'git restore <archivo>', 'git reflog'],
    targetTab: 'simulator',
    targetActionLabel: 'Probar Comandos en el Simulador'
  }
];

export default function VideoLearning({ setCurrentTab, unlockBadge }) {
  const [selectedLessonId, setSelectedLessonId] = useState(1);
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('gitplayground_completed_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeFilter, setActiveFilter] = useState('Todas');

  const selectedLesson = LESSONS.find(l => l.id === selectedLessonId) || LESSONS[0];

  const toggleLessonCompleted = (id) => {
    setCompletedLessons(prev => {
      const isAlreadyDone = prev.includes(id);
      const next = isAlreadyDone ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('gitplayground_completed_lessons', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      if (!isAlreadyDone && next.length >= 3 && unlockBadge) {
        unlockBadge('quiz');
      }
      return next;
    });
  };

  const filteredLessons = LESSONS.filter(l => {
    if (activeFilter === 'Todas') return true;
    return l.category === activeFilter;
  });

  return (
    <div className="module-container" id="video-learning-root">
      {/* Header */}
      <header className="module-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ 
                padding: '0.4rem', 
                borderRadius: 'var(--radius-sm)', 
                backgroundColor: 'rgba(59, 130, 246, 0.15)', 
                color: '#3b82f6' 
              }}>
                <Video size={24} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Videoteca & Clases Magistrales
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
              Aprende el modelo mental con explicaciones visuales antes de tipear comandos en la consola. 100% abierto y libre.
            </p>
          </div>

          {/* Progress stats badge */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            backgroundColor: 'var(--bg-secondary)', 
            padding: '0.5rem 1rem', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-color)' 
          }}>
            <Award size={18} style={{ color: 'var(--accent)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Clases Completadas</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {completedLessons.length} / {LESSONS.length} ({Math.round((completedLessons.length / LESSONS.length) * 100)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.2rem' }}>
          {['Todas', 'Básico', 'Intermedio', 'Avanzado'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className="btn"
              style={{
                padding: '0.35rem 0.85rem',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeFilter === cat ? 'var(--primary)' : 'var(--bg-secondary)',
                color: activeFilter === cat ? 'white' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main Grid: Video Player + Playlist */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '1.5rem' }}>
        
        {/* Left Column: Player and Lesson Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Responsive Video Container */}
          <div style={{ 
            position: 'relative', 
            paddingBottom: '56.25%', 
            height: 0, 
            overflow: 'hidden', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-color)',
            backgroundColor: '#000',
            boxShadow: 'var(--shadow-md)'
          }}>
            <iframe
              src={selectedLesson.embedUrl}
              title={selectedLesson.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Current Lesson Info Card */}
          <div style={{ 
            backgroundColor: 'var(--bg-secondary)', 
            borderRadius: 'var(--radius-md)', 
            padding: '1.25rem',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <span style={{ 
                  fontSize: '0.68rem', 
                  fontWeight: 700, 
                  color: 'var(--primary)', 
                  backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: 'var(--radius-sm)',
                  textTransform: 'uppercase'
                }}>
                  {selectedLesson.category} • Duración: {selectedLesson.duration}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--text-primary)' }}>
                  {selectedLesson.title}
                </h3>
              </div>

              {/* Mark Completed Button */}
              <button
                onClick={() => toggleLessonCompleted(selectedLesson.id)}
                className="btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: completedLessons.includes(selectedLesson.id) ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-primary)',
                  color: completedLessons.includes(selectedLesson.id) ? '#10b981' : 'var(--text-secondary)',
                  border: completedLessons.includes(selectedLesson.id) ? '1px solid #10b981' : '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
              >
                <CheckCircle size={15} />
                <span>{completedLessons.includes(selectedLesson.id) ? 'Clase Completada ✓' : 'Marcar como Completada'}</span>
              </button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              {selectedLesson.summary}
            </p>

            {/* Timestamps */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Capítulos & Puntos Clave
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}>
                {selectedLesson.timestamps.map((t, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      backgroundColor: 'var(--bg-primary)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <Clock size={12} style={{ color: 'var(--primary)' }} />
                    <strong style={{ color: 'var(--primary)' }}>{t.time}</strong>
                    <span>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Commands and Action Button */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '1rem', 
              paddingTop: '0.75rem', 
              borderTop: '1px solid var(--border-color)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Comandos:</span>
                {selectedLesson.commands.map((cmd, i) => (
                  <code 
                    key={i} 
                    style={{ 
                      fontSize: '0.72rem', 
                      backgroundColor: 'var(--bg-primary)', 
                      padding: '0.15rem 0.4rem', 
                      borderRadius: 'var(--radius-sm)',
                      color: '#60a5fa',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    {cmd}
                  </code>
                ))}
              </div>

              {/* Jump to interactive practice button */}
              <button
                onClick={() => setCurrentTab(selectedLesson.targetTab)}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  padding: '0.5rem 1rem'
                }}
              >
                <Terminal size={14} />
                <span>{selectedLesson.targetActionLabel}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Playlist / Lesson Selector */}
        <div style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1rem', 
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          height: 'fit-content'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
              Temario del Curso (6 Lecciones)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
            {filteredLessons.map((lesson) => {
              const isSelected = lesson.id === selectedLesson.id;
              const isDone = completedLessons.includes(lesson.id);
              const LessonIcon = lesson.icon;

              return (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSelected ? 'var(--bg-primary)' : 'transparent',
                    border: isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                    <div style={{ 
                      width: '30px', 
                      height: '30px', 
                      borderRadius: 'var(--radius-sm)', 
                      backgroundColor: isDone ? 'rgba(16, 185, 129, 0.2)' : isSelected ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-primary)',
                      color: isDone ? '#10b981' : isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {isDone ? <CheckCircle size={16} /> : <LessonIcon size={16} />}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        fontWeight: isSelected ? 800 : 600, 
                        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {lesson.title}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                        {lesson.duration} min • {lesson.category}
                      </span>
                    </div>
                  </div>

                  <Play size={12} style={{ color: isSelected ? 'var(--primary)' : 'var(--text-tertiary)', flexShrink: 0 }} />
                </div>
              );
            })}
          </div>

          {/* Quick tip box */}
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.75rem', 
            borderRadius: 'var(--radius-sm)', 
            backgroundColor: 'rgba(59, 130, 246, 0.08)', 
            border: '1px dashed rgba(59, 130, 246, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.75rem' }}>
              <Sparkles size={14} />
              <span>Metodología Activa</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              Mira 5 minutos de video para asimilar la estructura de datos, y salta de inmediato a la terminal para ejecutarlo en el grafo en vivo.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
