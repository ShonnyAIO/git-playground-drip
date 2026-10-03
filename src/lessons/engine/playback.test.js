import { describe, expect, it } from 'vitest';
import { initialPlayback, playbackReducer } from './playback.js';

const run = (state, ...actions) => actions.reduce(playbackReducer, state);
const base = () => initialPlayback([1000, 2000, 1000]);

describe('playbackReducer', () => {
  it('tick avanza el tiempo y pasa al siguiente paso al cumplir la duración', () => {
    let s = run(base(), { type: 'play' }, { type: 'tick', ms: 600 });
    expect([s.index, s.elapsedMs]).toEqual([0, 600]);
    s = run(s, { type: 'tick', ms: 600 });
    expect([s.index, s.elapsedMs]).toEqual([1, 0]);
  });

  it('al terminar el último paso queda ended y pausado; play reinicia desde el principio', () => {
    let s = run(base(), { type: 'seek', index: 2 }, { type: 'play' }, { type: 'tick', ms: 5000 });
    expect(s).toMatchObject({ index: 2, ended: true, playing: false });
    s = run(s, { type: 'play' });
    expect(s).toMatchObject({ index: 0, ended: false, playing: true, elapsedMs: 0 });
  });

  it('no avanza mientras la narración espera, ni cuando está en pausa', () => {
    let s = run(base(), { type: 'play' }, { type: 'tick', ms: 5000, waiting: true });
    expect([s.index, s.elapsedMs]).toEqual([0, 1000]);
    s = run(s, { type: 'pause' }, { type: 'tick', ms: 5000 });
    expect(s.index).toBe(0);
  });

  it('seek se acota al rango y prev en el paso 0 se queda en 0', () => {
    expect(run(base(), { type: 'seek', index: 99 }).index).toBe(2);
    expect(run(base(), { type: 'seek', index: -4 }).index).toBe(0);
    expect(run(base(), { type: 'prev' }).index).toBe(0);
  });

  it('la velocidad escala el tiempo transcurrido; velocidades no admitidas se ignoran', () => {
    let s = run(base(), { type: 'setSpeed', speed: 1.5 }, { type: 'play' }, { type: 'tick', ms: 400 });
    expect(s.elapsedMs).toBe(600);
    expect(run(s, { type: 'setSpeed', speed: 3 }).speed).toBe(1.5);
  });
});
