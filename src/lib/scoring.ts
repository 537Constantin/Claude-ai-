import { POINTS } from "./constants";
import type { Outcome } from "./types";

/** Derive the outcome (HOME/DRAW/AWAY) from a final score. */
export function outcomeFromScore(home: number, away: number): Outcome {
  if (home > away) return "HOME";
  if (home < away) return "AWAY";
  return "DRAW";
}

export interface ScoreInput {
  predicted: { outcome: Outcome; homeScore: number; awayScore: number };
  actual: { homeScore: number; awayScore: number };
}

/**
 * Single source of truth for the points system. Mirrored 1:1 by the
 * `score_prediction` SQL function so client previews match the backend.
 *
 *   • Exact final score        → 5 points
 *   • Correct winner / draw    → 3 points
 *   • Otherwise                → 0 points
 */
export function scorePrediction({ predicted, actual }: ScoreInput): number {
  const exact =
    predicted.homeScore === actual.homeScore &&
    predicted.awayScore === actual.awayScore;
  if (exact) return POINTS.EXACT_SCORE;

  const actualOutcome = outcomeFromScore(actual.homeScore, actual.awayScore);
  if (predicted.outcome === actualOutcome) return POINTS.CORRECT_OUTCOME;

  return POINTS.WRONG;
}

/** Human-readable label for a result tier (used for badges/toasts). */
export function scoreLabel(points: number): string {
  if (points === POINTS.EXACT_SCORE) return "Perfect score!";
  if (points === POINTS.CORRECT_OUTCOME) return "Right result";
  return "Missed";
}
