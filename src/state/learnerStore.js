/**
 * Estado del estudiante: único dueño del progreso, medallas, lecciones completadas,
 * días de actividad (racha), pestaña y tema, y de su persistencia en localStorage.
 * Puro y sin React: la fecha del día llega en las acciones (`action.today`).
 */
import { BADGES } from './badges.js';

export const STORAGE_KEY = 'gitplayground_learner_v1';
const VERSION = 1;
const MODULES = ['simulator', 'github', 'conflicts', 'quizzes', 'videolearning'];
const TABS = ['dashboard', 'videolearning', 'simulator', 'github', 'conflicts', 'quizzes'];
const BADGE_IDS = new Set(BADGES.map(b => b.id));
const MAX_ACTIVE_DAYS = 60;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
// Acciones que cuentan como práctica para la racha (solo si cambian el estado).
const LEARNING_ACTIONS = new Set(['completeModule', 'unlockBadge', 'setLessonCompleted']);
const STREAK_BADGES = [{ id: 'streak_3', days: 3 }, { id: 'streak_7', days: 7 }];

/** Fecha local del estudiante en formato AAAA-MM-DD. */
export function localDay(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const dayBefore = (day) => {
  const [y, m, d] = day.split('-').map(Number);
  return localDay(new Date(y, m - 1, d - 1));
};

const normalizeDays = (days) => [...new Set(days.filter(d => DAY_RE.test(d)))].sort().slice(-MAX_ACTIVE_DAYS);

/** Días seguidos con actividad que terminan hoy o ayer (si el último fue antes, la racha es 0). */
export function computeStreak(activeDays, today = localDay()) {
  const days = new Set(activeDays);
  let cursor = days.has(today) ? today : dayBefore(today);
  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor = dayBefore(cursor);
  }
  return streak;
}

export function initialLearnerState() {
  return {
    version: VERSION,
    currentTab: 'dashboard',
    theme: 'dark',
    progress: Object.fromEntries(MODULES.map(m => [m, false])),
    unlockedBadges: [],
    completedLessons: [],
    activeDays: [],
  };
}

const unique = (list) => [...new Set(list)];

export function learnerReducer(state, action) {
  const next = applyAction(state, action);
  if (next === state || !LEARNING_ACTIONS.has(action.type) || !action.today || next.activeDays.includes(action.today)) {
    return next;
  }
  const activeDays = normalizeDays([...next.activeDays, action.today]);
  const streak = computeStreak(activeDays, action.today);
  const earned = STREAK_BADGES.filter(b => streak >= b.days && !next.unlockedBadges.includes(b.id)).map(b => b.id);
  return { ...next, activeDays, unlockedBadges: [...next.unlockedBadges, ...earned] };
}

function applyAction(state, action) {
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
    case 'hydrate':
      // Reemplaza el progreso por uno traído de la cuenta; pestaña y tema son del dispositivo.
      return { ...sanitizeLearnerState(action.state), currentTab: state.currentTab, theme: state.theme };
    default:
      return state;
  }
}

/** Reconstruye un estado válido a partir de datos guardados; descarta lo desconocido. */
export function sanitizeLearnerState(raw) {
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
    activeDays: normalizeDays(strings(raw.activeDays)),
  };
}

/**
 * Fusiona dos progresos (p. ej. el del invitado y el de la cuenta) sin perder nada:
 * módulos completados en cualquiera, unión de medallas, lecciones y días de actividad.
 * Pestaña y tema se toman de `local` (son preferencias del dispositivo).
 */
export function mergeLearnerStates(local, remote) {
  const a = sanitizeLearnerState(local);
  const b = sanitizeLearnerState(remote);
  return {
    ...a,
    progress: Object.fromEntries(MODULES.map(m => [m, a.progress[m] || b.progress[m]])),
    unlockedBadges: unique([...b.unlockedBadges, ...a.unlockedBadges]),
    completedLessons: unique([...b.completedLessons, ...a.completedLessons]),
    activeDays: normalizeDays([...a.activeDays, ...b.activeDays]),
  };
}

export function loadLearnerState(storage) {
  try {
    const text = storage?.getItem(STORAGE_KEY);
    return text ? sanitizeLearnerState(JSON.parse(text)) : initialLearnerState();
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
