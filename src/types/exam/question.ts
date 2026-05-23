import type { Scores } from "./variable";

export interface Media {
  storageObjectId: string;
  alt?: string;
}

/**
 * One selectable option on a choice-type question.
 *
 * isCorrect  — EXAM auto-grading: marks this option as correct.
 * scores     — QUESTIONNAIRE/SURVEY/ASSESSMENT: how much each variable
 *              gains when this option is selected. Key = ExamVariable.key.
 *
 * An option can have both fields set (rare, but valid).
 */
export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  scores?: Scores;
  media?: Media;
}

/**
 * Correct answer for SHORT_TEXT and NUMERIC questions (EXAM type only).
 * Choice types use QuestionOption.isCorrect instead.
 * LONG_TEXT and RATING questions are manually graded → set to null.
 */
export type CorrectAnswer =
  | string                          // SHORT_TEXT exact match
  | { pattern: string; flags?: string } // SHORT_TEXT regex
  | number                          // NUMERIC exact value
  | { min: number; max: number }    // NUMERIC accepted range
  | null;

export interface QuestionMetadata {
  // RATING
  scale?: {
    min: number;
    max: number;
    step?: number;
    labels?: { min?: string; max?: string };
  };
  // NUMERIC
  range?: { min?: number; max?: number };
  unit?: string;
  // SHORT_TEXT / LONG_TEXT
  maxLength?: number;
  placeholder?: string;
}
