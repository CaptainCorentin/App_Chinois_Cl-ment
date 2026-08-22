export type SrsState = {
  repetitions: number;
  easeFactor: number;
  intervalDays: number;
};

/**
 * Variante binaire (correct/incorrect) de l'algorithme SM-2 (utilisé par Anki).
 * On mappe la réponse binaire sur l'échelle de qualité 0-5 de SM-2 :
 * correct -> 4 ("bien"), incorrect -> 1 ("raté").
 */
export function nextSrsState(state: SrsState, correct: boolean): SrsState {
  const quality = correct ? 4 : 1;
  let { repetitions, intervalDays } = state;
  let { easeFactor } = state;

  if (!correct) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * easeFactor);
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  return { repetitions, easeFactor, intervalDays };
}
