/**
 * Estado de reproducción de una lección, puro. `durations` son las duraciones base (velocidad 1)
 * de cada paso; la velocidad escala el tiempo transcurrido, no las duraciones.
 */
export const SPEEDS = [0.75, 1, 1.25, 1.5];

export function initialPlayback(durations) {
  return { durations, index: 0, elapsedMs: 0, playing: false, ended: false, speed: 1 };
}

const clampIndex = (state, i) => Math.min(Math.max(i, 0), state.durations.length - 1);
const goTo = (state, i) => ({ ...state, index: clampIndex(state, i), elapsedMs: 0, ended: false });

export function playbackReducer(state, action) {
  switch (action.type) {
    case 'play':
      return state.ended ? { ...goTo(state, 0), playing: true } : { ...state, playing: true };
    case 'pause':
      return { ...state, playing: false };
    case 'toggle':
      return playbackReducer(state, { type: state.playing ? 'pause' : 'play' });
    case 'next':
      if (state.index === state.durations.length - 1) {
        return { ...state, elapsedMs: state.durations[state.index], playing: false, ended: true };
      }
      return goTo(state, state.index + 1);
    case 'prev':
      return goTo(state, state.index - 1);
    case 'seek':
      return goTo(state, action.index);
    case 'restart':
      return { ...goTo(state, 0), playing: true };
    case 'setSpeed':
      return SPEEDS.includes(action.speed) ? { ...state, speed: action.speed } : state;
    case 'tick': {
      // `waiting`: la narración por voz aún no termina; el paso no avanza aunque se cumpla el tiempo.
      if (!state.playing) return state;
      const duration = state.durations[state.index];
      const elapsedMs = Math.min(state.elapsedMs + action.ms * state.speed, duration);
      if (elapsedMs < duration || action.waiting) return { ...state, elapsedMs };
      return playbackReducer({ ...state, elapsedMs }, { type: 'next' });
    }
    default:
      return state;
  }
}
