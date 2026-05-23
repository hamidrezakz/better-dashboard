export interface ExamSettings {
  shuffle?: {
    /** Randomise question order per session. */
    questions?: boolean;
    /** Randomise option order per question. */
    options?: boolean;
  };
  results?: {
    /** Show scores to the participant immediately after submission. */
    showScoreImmediately?: boolean;
    /**
     * When correct answers become visible to the participant.
     * - "never"       → never shown
     * - "on_submit"   → shown right after the participant submits
     * - "after_close" → shown after the exam's endsAt passes
     */
    showAnswersAt?: "never" | "on_submit" | "after_close";
  };
  attempts?: {
    /** Maximum allowed attempts. null = unlimited. */
    max?: number;
    /** Hours to wait before re-attempting. */
    cooldownHours?: number;
  };
  /** Minimum percentage (0–100) required to pass. */
  passScore?: number;
}
