import { useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Captions, ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { formatClock, lessonDuration, stepDuration } from '../engine/index.js';
import { initialPlayback, playbackReducer, SPEEDS } from '../engine/playback.js';
import { layoutScene } from './sceneLayout.js';
import SceneView from './SceneView.jsx';
import './player.css';

const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

function useWidth(ref) {
  const [width, setWidth] = useState(640);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setWidth(Math.max(300, Math.floor(el.clientWidth)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

/** Reproduce una lección como un video controlable. `onComplete` se llama al llegar al final. */
export default function LessonPlayer({ lesson, onComplete }) {
  const durations = useMemo(() => lesson.steps.map(s => stepDuration(s)), [lesson]);
  const [state, rawDispatch] = useReducer(playbackReducer, durations, initialPlayback);
  // Póster: hasta la primera interacción se muestra el título y un botón grande, como en un video.
  const [started, setStarted] = useState(false);
  const dispatch = (action) => {
    if (action.type !== 'tick') setStarted(true);
    rawDispatch(action);
  };
  const [captionsOn, setCaptionsOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const stageRef = useRef(null);
  const width = useWidth(stageRef);

  const step = lesson.steps[state.index];
  // Altura fija = la del paso más alto, para que el reproductor no salte entre pasos.
  const layouts = useMemo(() => lesson.steps.map(s => layoutScene(s.scene, width, lesson.files)), [lesson, width]);
  const stageHeight = Math.max(...layouts.map(l => l.height));

  // Reloj: avanza mientras se reproduce.
  useEffect(() => {
    if (!state.playing) return undefined;
    let last = performance.now();
    let frame = requestAnimationFrame(function loop(now) {
      rawDispatch({ type: 'tick', ms: now - last, waiting: speaking });
      last = now;
      frame = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(frame);
  }, [state.playing, speaking]);

  // Narración: lee el subtítulo de cada paso mientras se reproduce.
  useEffect(() => {
    if (!canSpeak) return undefined;
    window.speechSynthesis.cancel();
    if (!voiceOn || !state.playing) return undefined;
    const u = new SpeechSynthesisUtterance(step.caption);
    u.lang = 'es-ES';
    u.rate = state.speed;
    const voice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('es'));
    if (voice) u.voice = voice;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
    return () => {
      u.onend = null;
      window.speechSynthesis.cancel();
      setSpeaking(false);
    };
  }, [voiceOn, state.playing, state.index, state.speed, step.caption]);

  const completedRef = useRef(false);
  useEffect(() => {
    if (state.ended && !completedRef.current) {
      completedRef.current = true;
      onComplete?.(lesson.id);
    }
    if (!state.ended) completedRef.current = false;
  }, [state.ended, onComplete, lesson.id]);

  const onKeyDown = (e) => {
    const onControl = e.target.closest('button, select');
    if ((e.key === ' ' || e.key === 'k' || e.key === 'K') && !onControl) {
      e.preventDefault();
      dispatch({ type: 'toggle' });
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      dispatch({ type: 'next' });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      dispatch({ type: 'prev' });
    } else if (e.key === 'Home') {
      e.preventDefault();
      dispatch({ type: 'restart' });
    }
  };

  const progress = (i) => {
    if (i < state.index || (state.ended && i === state.index)) return 1;
    if (i > state.index) return 0;
    return state.elapsedMs / durations[i];
  };

  return (
    <div className="lesson-player" tabIndex={0} onKeyDown={onKeyDown}
      aria-label={`Lección animada: ${lesson.title}. Espacio reproduce o pausa; flechas cambian de paso.`}>
      <div className="lesson-stage" ref={stageRef} style={{ minHeight: stageHeight }}>
        <SceneView layout={layouts[state.index]} focus={step.focus} />
        {!started && (
          <div className="lesson-poster">
            <span className="lesson-poster-level">{lesson.level} · {lesson.steps.length} pasos</span>
            <h3 className="lesson-poster-title">{lesson.title}</h3>
            <button className="lesson-poster-play" onClick={() => dispatch({ type: 'play' })}>
              <Play size={22} aria-hidden="true" />
              Ver lección ({formatClock(lessonDuration(lesson))})
            </button>
          </div>
        )}
      </div>

      <div className="lesson-terminal" aria-hidden={!step.command}>
        <span className="lesson-terminal-prompt">$</span>
        {step.command && (
          <code key={step.id} className="lesson-terminal-cmd" style={{ '--chars': step.command.length }}>{step.command}</code>
        )}
      </div>

      <p className={`lesson-caption ${captionsOn ? '' : 'is-hidden'}`} aria-live="polite">
        <span className="lesson-caption-step">Paso {state.index + 1} de {lesson.steps.length}</span>
        {step.caption}
      </p>

      <div className="lesson-progress" role="group" aria-label="Pasos de la lección">
        {lesson.steps.map((s, i) => (
          <button key={s.id} className={`lesson-segment ${i === state.index ? 'is-current' : ''}`}
            onClick={() => dispatch({ type: 'seek', index: i })}
            aria-label={`Ir al paso ${i + 1}: ${s.caption}`} aria-current={i === state.index ? 'step' : undefined}>
            <span style={{ transform: `scaleX(${progress(i)})` }} />
          </button>
        ))}
      </div>

      <div className="lesson-controls">
        <button className="lesson-btn" onClick={() => dispatch({ type: 'prev' })} aria-label="Paso anterior" disabled={state.index === 0}>
          <ChevronLeft size={20} />
        </button>
        <button className="lesson-btn lesson-btn-main" onClick={() => dispatch({ type: 'toggle' })}
          aria-label={state.playing ? 'Pausar' : state.ended ? 'Volver a ver' : 'Reproducir'}>
          {state.playing ? <Pause size={22} /> : state.ended ? <RotateCcw size={20} /> : <Play size={22} />}
        </button>
        <button className="lesson-btn" onClick={() => dispatch({ type: 'next' })} aria-label="Paso siguiente" disabled={state.ended}>
          <ChevronRight size={20} />
        </button>

        <div className="lesson-controls-right">
          <label className="lesson-speed">
            <span className="sr-only">Velocidad</span>
            <select value={state.speed} onChange={e => dispatch({ type: 'setSpeed', speed: Number(e.target.value) })}>
              {SPEEDS.map(s => <option key={s} value={s}>{s}×</option>)}
            </select>
          </label>
          <button className={`lesson-btn ${captionsOn ? 'is-on' : ''}`} onClick={() => setCaptionsOn(v => !v)}
            aria-pressed={captionsOn} aria-label="Subtítulos">
            <Captions size={18} />
          </button>
          {canSpeak && (
            <button className={`lesson-btn ${voiceOn ? 'is-on' : ''}`} onClick={() => setVoiceOn(v => !v)}
              aria-pressed={voiceOn} aria-label="Narración por voz">
              {voiceOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
