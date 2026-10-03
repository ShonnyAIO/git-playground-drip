import { useState } from 'react';
import { LESSONS } from '../lessons/content/index.js';
import { layoutGraph, lessonDuration, validateLesson } from '../lessons/engine/index.js';
import LessonPlayer from '../lessons/render/LessonPlayer.jsx';
import SceneView from '../lessons/render/SceneView.jsx';
import { layoutScene } from '../lessons/render/sceneLayout.js';
import './lab.css';

// Laboratorio solo de desarrollo (npm run dev → /lab.html): valida cada lección y muestra sus escenas.
const ALL = LESSONS;

function LayoutTable({ graph }) {
  const l = layoutGraph(graph);
  return (
    <code className="lab-mono">
      {l.nodes.map(n => `${n.id}@(${n.x},${n.y})${n.ghost ? '·ghost' : ''}`).join('  ')}
      {'  |  '}
      {l.labels.map(b => `${b.branch}→${b.commitId}${b.isHead ? '*' : ''}`).join('  ')}
    </code>
  );
}

export default function Lab() {
  const [selectedId, setSelectedId] = useState(ALL[0].id);
  const lesson = ALL.find(l => l.id === selectedId);
  const errors = validateLesson(lesson);

  return (
    <div className="lab" data-theme-root>
      <header className="lab-header">
        <h1>Laboratorio de lecciones</h1>
        <select value={selectedId} onChange={e => setSelectedId(e.target.value)} aria-label="Lección">
          {ALL.map(l => (
            <option key={l.id} value={l.id}>
              {l.title} {validateLesson(l).length ? '❌' : '✅'}
            </option>
          ))}
        </select>
        <button onClick={() => document.documentElement.setAttribute('data-theme', document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark')}>
          Tema
        </button>
      </header>

      <section>
        <h2>
          Validación {errors.length ? `(${errors.length} errores)` : '✅'} · {lesson.steps.length} pasos ·{' '}
          {Math.round(lessonDuration(lesson) / 1000)} s
        </h2>
        {errors.map(e => <p key={e} className="lab-error">{e}</p>)}
      </section>

      <section>
        <h2>Reproductor</h2>
        <LessonPlayer key={lesson.id} lesson={lesson} onComplete={id => console.log('completada', id)} />
      </section>

      <section>
        <h2>Hoja de contactos</h2>
        <div className="lab-sheet">
          {lesson.steps.map((step, i) => (
            <figure key={step.id} className="lab-frame">
              <SceneView layout={layoutScene(step.scene, 560, lesson.files)} focus={step.focus} />
              <figcaption><strong>{i + 1}.</strong> {step.command && <code className="lab-mono">$ {step.command} </code>}{step.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section>
        <h2>Pasos</h2>
        <ol className="lab-steps">
          {lesson.steps.map(step => (
            <li key={step.id}>
              <strong>{step.id}</strong> {step.command && <code className="lab-mono">$ {step.command}</code>}
              <p>{step.caption}</p>
              {step.scene.graph && <LayoutTable graph={step.scene.graph} />}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
