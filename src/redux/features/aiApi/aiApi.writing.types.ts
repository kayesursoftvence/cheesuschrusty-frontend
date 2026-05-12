// ─────────────────────────────────────────────────────────────
// aiApi.writing.types.ts
// ─────────────────────────────────────────────────────────────

// ─── Shared Primitives ───────────────────────────────────────

export type TestMode = 'ON' | 'OFF';
export type IsTimed = 'Yes' | 'No';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | string;
export type Provider = 'grok' | 'openai' | 'anthropic' | string;
export type WritingTaskID = 'W-01' | 'W-02' | 'W-03' | 'W-04' | string;

// ─────────────────────────────────────────────────────────────
// REQUEST
// ─────────────────────────────────────────────────────────────

export interface GenerateWritingRequest {
  provider: Provider;
  LEVEL_ID: string;           // e.g. "B1", "B1C"
  TARGET_LANGUAGE: string;    // e.g. "English"
  SKILL: string;              // e.g. "Writing"
  TASK_ID: WritingTaskID;     // e.g. "W-01", "W-02"
  DOMAIN: string;             // e.g. "Daily life"
  DIFFICULTY: DifficultyLevel;
  SECTION_TOTAL: number;
  TASK_TIME: number;          // in seconds
  NATIVE_LANGUAGE: string;    // e.g. "Bengali"
  TEST_MODE: TestMode;
  GENERATION_SEED: string;
  LESSON_TITLE: string;
}

// ─────────────────────────────────────────────────────────────
// RESPONSE — building blocks
// ─────────────────────────────────────────────────────────────

// ─── Header ──────────────────────────────────────────────────

export interface WritingHeader {
  level: string;
  skill: string;
  task_id: string;
  domain: string;
  topic: string;
  lesson_title: string;
  provider: Provider;
  target_language: string;
  difficulty: DifficultyLevel;
  section_total: number;
  task_time: number;
  native_language: string;
  test_mode: TestMode;
}

// ─── Teacher Pack — Content ───────────────────────────────────

/**
 * Stimulus as an object with text
 * Used by: grok B1C W-02
 * { text: string }
 */
export interface WritingStimulusObject {
  text: string;
}

/**
 * teacher_pack.content.stimulus variants:
 *   1. plain string   → grok B1 W-01, grok B1 W-02,
 *                        grok B1C W-01
 *   2. { text }       → grok B1C W-02
 */
export type WritingTeacherStimulus =
  | string
  | WritingStimulusObject;

/**
 * teacher_pack.content variations:
 *
 *   grok  B1  W-01  → { stimulus: string }
 *   grok  B1  W-02  → { stimulus: string }
 *   grok  B1C W-01  → { stimulus: string }
 *   grok  B1C W-02  → { stimulus: { text }, word_count }
 *   openai B1  W-01 → { prompt: string }      ← no "stimulus" key
 *   openai B1  W-02 → { prompt: string }
 *   openai B1C W-01 → { prompt: string }
 *   openai B1C W-02 → { prompt: string }
 *
 * "stimulus" and "prompt" are mutually exclusive per provider.
 * Both are optional so either can be present without TypeScript error.
 */
export interface WritingContent {
  /** Used by grok responses */
  stimulus?: WritingTeacherStimulus;
  /** Used by openai responses */
  prompt?: string;
  /** Only present in grok B1C W-02 */
  word_count?: number;
}

// ─── Teacher Pack — Answer Key ───────────────────────────────

/**
 * answer_key variants observed:
 *
 *   grok  B1  W-01  → { note: string }
 *   grok  B1  W-02  → { note: string }
 *   grok  B1C W-01  → { guidelines: string }   ← different key!
 *   grok  B1C W-02  → { note: string }
 *   openai all      → {}                        ← empty object
 *
 * All fields optional to accommodate all shapes.
 */
export interface WritingAnswerKey {
  /** Evaluation guidance — used by most grok responses */
  note?: string;
  /** Evaluation guidance — used by grok B1C W-01 */
  guidelines?: string;
  /** Safety net for any future undocumented fields */
  [key: string]: unknown;
}

export interface WritingTimeMetadata {
  task_time: number;
  is_timed: IsTimed;
}

export interface WritingKey {
  answer_key: WritingAnswerKey;
  time_metadata: WritingTimeMetadata;
  /**
   * Always 0 for writing tasks since answers are open-ended
   * and scored separately via evaluate endpoint
   */
  calibration_score: number;
}

export interface WritingTeacherPack {
  content: WritingContent;
  key: WritingKey;
}

// ─── Student Handout — Stimulus variants ─────────────────────

/**
 * student_handout.stimulus shapes observed:
 *
 *   { prompt }                    → grok B1 W-01, openai B1 W-01
 *   { text }                      → grok B1 W-02, grok B1C W-01,
 *                                    grok B1C W-02
 *   { scenario }                  → openai B1 W-02
 *   { context, task_description } → openai B1C W-01
 *   {}                            → openai B1C W-02 (empty object)
 *
 * All fields are optional to cover the empty object case and
 * all key name variants.
 */
export interface WritingHandoutStimulus {
  /** Primary prompt text — grok B1 W-01, openai B1 W-01 */
  prompt?: string;
  /** Primary prompt text — grok B1 W-02, grok B1C W-01/W-02 */
  text?: string;
  /** Scenario label — openai B1 W-02 */
  scenario?: string;
  /** Context label — openai B1C W-01 */
  context?: string;
  /** Task description — openai B1C W-01 */
  task_description?: string;
  /** Safety net for any future undocumented fields */
  [key: string]: unknown;
}

// ─── Student Handout ─────────────────────────────────────────

export interface WritingStudentHandout {
  title: string;
  instructions: string;
  stimulus: WritingHandoutStimulus;
  /**
   * Always an empty array [] for writing tasks.
   * Writing prompts have no discrete questions.
   */
  questions: never[] | [];
}

// ─── Calibration Metrics ─────────────────────────────────────

/**
 * Scoring sub-object inside calibration_metrics
 * Used by: grok B1C W-02 only
 */
export interface WritingCalibrationScoring {
  task_type: string;            // e.g. "Writing"
  points_per_correct: number;
  points_per_incorrect: number;
  total_possible: number;
}

/**
 * Observed calibration_metrics shapes:
 *
 *   Shape A (grok B1 W-01, grok B1C W-01,
 *            openai all):
 *     {}   (empty object)
 *
 *   Shape B (grok B1 W-02):
 *     { source }
 *
 *   Shape C (grok B1C W-02):
 *     { source, scoring: { task_type, points_per_correct,
 *                          points_per_incorrect, total_possible } }
 *
 * All fields optional + index signature for safety.
 */
export interface WritingCalibrationMetrics {
  /** CEFR reference string — grok B1 W-02, grok B1C W-02 */
  source?: string;
  /** Scoring breakdown — grok B1C W-02 only */
  scoring?: WritingCalibrationScoring;
  /** Safety net for any future undocumented fields */
  [key: string]: unknown;
}

// ─────────────────────────────────────────────────────────────
// RESPONSE — root
// ─────────────────────────────────────────────────────────────

export interface GenerateWritingResponse {
  header: WritingHeader;
  teacher_pack: WritingTeacherPack;
  student_handout: WritingStudentHandout;
  calibration_metrics: WritingCalibrationMetrics;
}



// ─────────────────────────────────────────────────────────────
// BATCH REQUEST & RESPONSE
// ─────────────────────────────────────────────────────────────

export interface GenerateWritingBatchRequest extends Omit<GenerateWritingRequest, 'LESSON_TITLE'> {
  variant_count: number;
}

export interface GenerateWritingBatchResponse {
  job_id: string;
  message: string;
}