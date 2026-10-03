const MIN_STEP_MS = 3500;
const MS_PER_WORD = 380;

/** Duración de un paso en ms a la velocidad dada. Sin `durationMs`, se deriva del caption. */
export function stepDuration(step, speed = 1) {
  const words = step.caption.trim().split(/\s+/).length;
  const base = step.durationMs ?? Math.max(MIN_STEP_MS, words * MS_PER_WORD);
  return base / speed;
}

export const lessonDuration = (lesson, speed = 1) => lesson.steps.reduce((ms, s) => ms + stepDuration(s, speed), 0);
