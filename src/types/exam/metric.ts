/**
 * One input into an OrgMetricDefinition.
 * Selects a single variable from a specific exam.
 */
export interface MetricSource {
  examId: string;
  /** Must match a key in that exam's `variables` array. */
  variableKey: string;
  /** Relative weight used by WEIGHTED_AVERAGE (default 1). */
  weight: number;
}

/**
 * Per-source detail stored inside OrgMetricValue.breakdown.
 * Enables the dashboard drill-through: metric → exam session → answers.
 */
export interface MetricBreakdownEntry {
  examId: string;
  variableKey: string;
  /** The ExamSession that contributed this score (null if no session found). */
  sessionId: string | null;
  /** Raw variable score from ExamSession.scores[variableKey]. */
  rawValue: number;
  weight: number;
  /** Weighted contribution before final aggregation (rawValue × weight). */
  contribution: number;
}
