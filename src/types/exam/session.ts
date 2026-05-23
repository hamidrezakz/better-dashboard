export interface SessionProgress {
  currentSectionId?: string;
  /** ISO datetime when the current section started. */
  sectionStartedAt?: string;
  /** Total seconds spent across all sections so far. */
  timeSpentSec?: number;
}
