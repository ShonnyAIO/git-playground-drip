import { describe, expect, it } from 'vitest';
import {
  STORAGE_KEY, deriveLevel, deriveXp, initialLearnerState, learnerReducer, loadLearnerState, saveLearnerState,
} from './learnerStore.js';

const memoryStorage = (initial = {}) => {
  const data = { ...initial };
  return { getItem: k => data[k] ?? null, setItem: (k, v) => { data[k] = v; }, data };
};

describe('persistencia', () => {
  it('ida y vuelta conserva el estado', () => {
    const storage = memoryStorage();
    let s = initialLearnerState();
    s = learnerReducer(s, { type: 'setTab', tab: 'simulator' });
    s = learnerReducer(s, { type: 'completeModule', module: 'github' });
    s = learnerReducer(s, { type: 'unlockBadge', id: 'init' });
    s = learnerReducer(s, { type: 'setLessonCompleted', id: 'estados', completed: true });
    saveLearnerState(storage, s);
    expect(loadLearnerState(storage)).toEqual(s);
  });

  it('JSON corrupto, versión distinta o storage que lanza devuelven el estado inicial', () => {
    expect(loadLearnerState(memoryStorage({ [STORAGE_KEY]: '{no-json' }))).toEqual(initialLearnerState());
    expect(loadLearnerState(memoryStorage({ [STORAGE_KEY]: '{"version":99}' }))).toEqual(initialLearnerState());
    const throwing = { getItem: () => { throw new Error('bloqueado'); }, setItem: () => { throw new Error('bloqueado'); } };
    expect(loadLearnerState(throwing)).toEqual(initialLearnerState());
    expect(() => saveLearnerState(throwing, initialLearnerState())).not.toThrow();
  });

  it('descarta medallas, pestañas y campos desconocidos', () => {
    const raw = { version: 1, currentTab: 'hackeo', unlockedBadges: ['init', 'falsa', 'init'], extra: 1 };
    const s = loadLearnerState(memoryStorage({ [STORAGE_KEY]: JSON.stringify(raw) }));
    expect(s.currentTab).toBe('dashboard');
    expect(s.unlockedBadges).toEqual(['init']);
    expect(s).not.toHaveProperty('extra');
  });
});

describe('reducer', () => {
  it('desbloquear una medalla es idempotente (devuelve el mismo objeto)', () => {
    const once = learnerReducer(initialLearnerState(), { type: 'unlockBadge', id: 'merge' });
    expect(learnerReducer(once, { type: 'unlockBadge', id: 'merge' })).toBe(once);
  });

  it('reset conserva el tema', () => {
    let s = learnerReducer(initialLearnerState(), { type: 'setTheme', theme: 'light' });
    s = learnerReducer(s, { type: 'unlockBadge', id: 'init' });
    expect(learnerReducer(s, { type: 'reset' })).toEqual({ ...initialLearnerState(), theme: 'light' });
  });
});

describe('nivel', () => {
  it.each([[249, 'Novato'], [250, 'Desarrollador'], [999, 'Guardián'], [1000, 'Maestro']])('%i XP → %s', (xp, name) => {
    expect(deriveLevel(xp)).toContain(name);
  });

  it('XP = 50 por módulo + 100 por medalla', () => {
    let s = learnerReducer(initialLearnerState(), { type: 'completeModule', module: 'quizzes' });
    s = learnerReducer(s, { type: 'unlockBadge', id: 'quiz' });
    expect(deriveXp(s)).toBe(150);
  });
});
