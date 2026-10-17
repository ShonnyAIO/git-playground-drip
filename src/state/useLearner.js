import { useCallback, useEffect, useReducer } from 'react';
import { learnerReducer, loadLearnerState, localDay, saveLearnerState } from './learnerStore.js';

const storage = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export function useLearner() {
  const [state, rawDispatch] = useReducer(learnerReducer, undefined, () => loadLearnerState(storage()));
  useEffect(() => {
    saveLearnerState(storage(), state);
  }, [state]);
  // El reducer es puro: la fecha de hoy (para la racha) se inyecta aquí.
  const dispatch = useCallback((action) => rawDispatch({ ...action, today: localDay() }), []);
  return [state, dispatch];
}
