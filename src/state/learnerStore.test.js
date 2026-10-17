import { describe, expect, it } from 'vitest';
import {
  STORAGE_KEY, computeStreak, deriveLevel, deriveXp, initialLearnerState, learnerReducer, loadLearnerState, localDay,
  mergeLearnerStates, sanitizeLearnerState, saveLearnerState,
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

describe('racha diaria', () => {
  const act = (state, action, today) => learnerReducer(state, { ...action, today });

  it('cuenta días seguidos que terminan hoy o ayer; un hueco la corta', () => {
    expect(computeStreak(['2026-10-15', '2026-10-16', '2026-10-17'], '2026-10-17')).toBe(3);
    expect(computeStreak(['2026-10-15', '2026-10-16'], '2026-10-17')).toBe(2);
    expect(computeStreak(['2026-10-14', '2026-10-15'], '2026-10-17')).toBe(0);
    expect(computeStreak(['2026-10-13', '2026-10-15', '2026-10-16'], '2026-10-16')).toBe(2);
  });

  it('cruza cambios de mes y de año', () => {
    expect(computeStreak(['2026-09-30', '2026-10-01'], '2026-10-01')).toBe(2);
    expect(computeStreak(['2026-12-31', '2027-01-01'], '2027-01-01')).toBe(2);
  });

  it('solo una acción de aprendizaje que cambia algo registra el día', () => {
    let s = act(initialLearnerState(), { type: 'setTab', tab: 'simulator' }, '2026-10-17');
    expect(s.activeDays).toEqual([]);
    s = act(s, { type: 'completeModule', module: 'quizzes' }, '2026-10-17');
    expect(s.activeDays).toEqual(['2026-10-17']);
    const again = act(s, { type: 'completeModule', module: 'quizzes' }, '2026-10-18');
    expect(again).toBe(s);
  });

  it('otorga las medallas de 3 y 7 días al alcanzar la racha', () => {
    let s = initialLearnerState();
    const lessons = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    lessons.forEach((id, i) => {
      s = act(s, { type: 'setLessonCompleted', id, completed: true }, `2026-10-${String(11 + i).padStart(2, '0')}`);
      if (i === 1) expect(s.unlockedBadges).not.toContain('streak_3');
      if (i === 2) expect(s.unlockedBadges).toContain('streak_3');
    });
    expect(s.unlockedBadges).toEqual(['streak_3', 'streak_7']);
  });

  it('localDay usa la fecha local en formato AAAA-MM-DD', () => {
    expect(localDay(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });
});

describe('fusión e hidratación', () => {
  it('fusionar no pierde progreso de ninguno de los dos lados', () => {
    const guest = { ...initialLearnerState(), currentTab: 'quizzes', progress: { ...initialLearnerState().progress, simulator: true },
      unlockedBadges: ['init'], completedLessons: ['estados'], activeDays: ['2026-10-17'] };
    const account = { ...initialLearnerState(), progress: { ...initialLearnerState().progress, github: true },
      unlockedBadges: ['remote', 'init'], completedLessons: ['merge'], activeDays: ['2026-10-16'] };
    const m = mergeLearnerStates(guest, account);
    expect(m.progress).toMatchObject({ simulator: true, github: true, quizzes: false });
    expect(m.unlockedBadges).toEqual(['remote', 'init']);
    expect(m.completedLessons.sort()).toEqual(['estados', 'merge']);
    expect(m.activeDays).toEqual(['2026-10-16', '2026-10-17']);
    expect(m.currentTab).toBe('quizzes');
  });

  it('fusionar con una cuenta vacía o datos corruptos conserva el progreso local', () => {
    const local = learnerReducer(initialLearnerState(), { type: 'unlockBadge', id: 'merge' });
    expect(mergeLearnerStates(local, null).unlockedBadges).toEqual(['merge']);
    expect(mergeLearnerStates(local, { version: 99 }).unlockedBadges).toEqual(['merge']);
  });

  it('hidratar reemplaza el progreso pero conserva pestaña y tema del dispositivo', () => {
    let s = learnerReducer(initialLearnerState(), { type: 'setTheme', theme: 'light' });
    s = learnerReducer(s, { type: 'setTab', tab: 'github' });
    const remote = { ...initialLearnerState(), unlockedBadges: ['quiz'], currentTab: 'dashboard', theme: 'dark' };
    const h = learnerReducer(s, { type: 'hydrate', state: remote });
    expect(h).toMatchObject({ theme: 'light', currentTab: 'github', unlockedBadges: ['quiz'] });
  });

  it('los datos viejos sin activeDays se cargan con racha vacía', () => {
    const old = { version: 1, unlockedBadges: ['init'] };
    expect(sanitizeLearnerState(old).activeDays).toEqual([]);
  });
});
