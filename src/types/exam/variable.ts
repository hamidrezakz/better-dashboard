/**
 * A scoring dimension embedded in Exam.variables.
 *
 * Every exam must define at least one variable.
 * - EXAM (graded): define one variable with key = "score".
 * - QUESTIONNAIRE / personality tests: define N variables (e.g. "E", "A", "N").
 *
 * The max achievable score per key is cached in Exam.cachedScores.
 * The participant's earned score per key is stored in ExamSession.scores.
 */
export interface ExamVariable {
  key: string;
  label: string;
  description?: string;
}

/**
 * Maps a variable key to a numeric score.
 * Used in Exam.cachedScores, ExamSession.scores, ExamSession.maxScores, Answer.scores.
 *
 * Example (EXAM):          { "score": 85 }
 * Example (personality):   { "E": 23, "A": 18, "N": 11 }
 */
export type Scores = Record<string, number>;
