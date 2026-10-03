/**
 * Estado del estudiante: único dueño del progreso, medallas, lecciones completadas,
 * pestaña y tema, y de su persistencia en localStorage. Puro y sin React.
 */
import { BADGES } from './badges.js';

export const STORAGE_KEY = 'gitplayground_learner_v1';
const VERSION = 1;
const MODULES = ['simulator', 'github', 'conflicts', 'quizzes', 'videolearning'];
const TABS = ['dashboard', 'videolearning', 'simulator', 'github', 'conflicts', 'quizzes'];
const BADGE_IDS = new Set(BADGES.map(b => b.id));

export function initialLearnerState() {
  return {
    version: VERSION,
    currentTab: 'dashboard',
    theme: 'dark',
    progress: Object.fromEntries(MODULES.map(m => [m, false])),
    unlockedBadges: [],
    completedLessons: [],
  };
}

const unique = (list) => [...new Set(list)];

export function learnerReducer(state, action) {
  switch (action.type) {
    case 'setTab':
      return TABS.includes(action.tab) ? { ...state, currentTab: action.tab } : state;
    case 'setTheme':
      return action.theme === 'light' || action.theme === 'dark' ? { ...state, theme: action.theme } : state;
    case 'completeModule':
      if (!MODULES.includes(action.module) || state.progress[action.module]) return state;
      return { ...state, progress: { ...state.progress, [action.module]: true } };
    case 'unlockBadge':
      if (!BADGE_IDS.has(action.id) || state.unlockedBadges.includes(action.id)) return state;
      return { ...state, unlockedBadges: [...state.unlockedBadges, action.id] };
    case 'setLessonCompleted': {
      const done = state.completedLessons.includes(action.id);
      if (done === action.completed) return state;
      const completedLessons = action.completed
        ? [...state.completedLessons, action.id]
        : state.completedLessons.filter(id => id !== action.id);
      return { ...state, completedLessons };
    }
    case 'reset':
      return { ...initialLearnerState(), theme: state.theme };
    default:
      return state;
  }
}

/** Reconstruye un estado válido a partir de datos guardados; descarta lo desconocido. */
function sanitize(raw) {
  const base = initialLearnerState();
  if (!raw || typeof raw !== 'object' || raw.version !== VERSION) return base;
  const strings = (v) => (Array.isArray(v) ? v.filter(x => typeof x === 'string') : []);
  return {
    ...base,
    currentTab: TABS.includes(raw.currentTab) ? raw.currentTab : base.currentTab,
    theme: raw.theme === 'light' ? 'light' : 'dark',
    progress: Object.fromEntries(MODULES.map(m => [m, raw.progress?.[m] === true])),
    unlockedBadges: unique(strings(raw.unlockedBadges).filter(id => BADGE_IDS.has(id))),
    completedLessons: unique(strings(raw.completedLessons)),
  };
}

export function loadLearnerState(storage) {
  try {
    const text = storage?.getItem(STORAGE_KEY);
    return text ? sanitize(JSON.parse(text)) : initialLearnerState();
  } catch {
    return initialLearnerState();
  }
}

export function saveLearnerState(storage, state) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage bloqueado (modo privado, cuota): el progreso vive solo en memoria.
  }
}

export function deriveXp(state) {
  const modules = Object.values(state.progress).filter(Boolean).length;
  return modules * 50 + state.unlockedBadges.length * 100;
}

export function deriveLevel(xp) {
  if (xp < 250) return 'Novato en Git 👶';
  if (xp < 500) return 'Desarrollador Local 💻';
  if (xp < 750) return 'Colaborador de Ramas 🌿';
  if (xp < 1000) return 'Guardián de Integración 🛡️';
  return 'Maestro Git de la UCV 🎓';
}
