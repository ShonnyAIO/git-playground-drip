import { useEffect, useReducer } from 'react';
import { learnerReducer, loadLearnerState, saveLearnerState } from './learnerStore.js';

const storage = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export function useLearner() {
  const [state, dispatch] = useReducer(learnerReducer, undefined, () => loadLearnerState(storage()));
  useEffect(() => {
    saveLearnerState(storage(), state);
  }, [state]);
  return [state, dispatch];
}
