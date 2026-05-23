/**
 * The raw value submitted by a participant for a single question.
 *
 * SINGLE_CHOICE   → string   (selected option id)
 * MULTIPLE_CHOICE → string[] (selected option ids)
 * TRUE_FALSE      → boolean
 * NUMERIC         → number
 * RATING          → number
 * SHORT_TEXT      → string
 * LONG_TEXT       → string
 * (skipped)       → null
 */
export type AnswerValue = string | string[] | number | boolean | null;
