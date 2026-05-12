// ─────────────────────────────────────────────────────────────
// aiApi.reading.types.ts
// ─────────────────────────────────────────────────────────────

// ─── Shared / Primitives ─────────────────────────────────────

export type TestMode = 'ON' | 'OFF';
export type IsTimed = 'Yes' | 'No';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | string;
export type Provider = 'grok' | 'openai' | 'anthropic' | string;
export type TaskID = 'R-01' | 'R-02' | 'R-03' | 'R-04' | string;

// ─────────────────────────────────────────────────────────────
// REQUEST
// ─────────────────────────────────────────────────────────────

export interface GenerateReadingRequest {
  provider: Provider;
  LEVEL_ID: string;               // e.g. "B1", "B1C", "A2"
  TARGET_LANGUAGE: string;        // e.g. "English"
  SKILL: string;                  // e.g. "Reading"
  TASK_ID: TaskID;                // e.g. "R-01", "R-02"
  DOMAIN: string;                 // e.g. "auto" or specific domain
  DIFFICULTY: DifficultyLevel;
  SECTION_TOTAL: number;
  TASK_TIME: number;              // in seconds
  NATIVE_LANGUAGE: string;        // e.g. "Bengali"
  TEST_MODE: TestMode;
  GENERATION_SEED: string;
  LESSON_TITLE: string;
}

// ─────────────────────────────────────────────────────────────
// RESPONSE — building blocks
// ─────────────────────────────────────────────────────────────

// ─── Header ──────────────────────────────────────────────────

export interface ReadingHeader {
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

// ─── Stimulus variants ───────────────────────────────────────

/**
 * Full stimulus object with title + text
 * e.g. grok R-01 / grok R-02 (B1)
 */
export interface ReadingStimulusWithTitle {
  title: string;
  text: string;
  /** Some matching tasks attach inline options to the stimulus */
  options?: ReadingStimulusOption[];
}

/**
 * Minimal stimulus object — text only, no title
 * e.g. openai R-01, openai R-02 (B1C / B1)
 */
export interface ReadingStimulusTextOnly {
  text: string;
  /** Some matching tasks attach inline options to the stimulus */
  options?: ReadingStimulusOption[];
}

/** Option inside the stimulus block (matching tasks) */
export interface ReadingStimulusOption {
  id: string;   // "A", "B", ...
  text: string;
}

/**
 * Union: stimulus in teacher_pack.content may be:
 *   1. { title, text }  object
 *   2. { text }         object
 *   3. plain string     (openai B1C R-01, openai B1 R-01)
 */
export type ReadingStimulus =
  | ReadingStimulusWithTitle
  | ReadingStimulusTextOnly
  | string;

// ─── Teacher Pack ────────────────────────────────────────────

export interface ReadingContent {
  /** Standard stimulus shapes */
  stimulus?: ReadingStimulus;
  /** Variant key used by openai B1 R-02 */
  stimulus_text?: string;
  word_count?: number;
}

export interface ReadingAnswerKey {
  [questionNumber: string]: string; // "1" -> "B", "2" -> "A", ...
}

export interface ReadingTimeMetadata {
  task_time: number;
  is_timed: IsTimed;
}

export interface ReadingScoringRules {
  task_type: string;            // "MCQ", "Matching", ...
  points_per_correct: number;
  points_per_incorrect: number;
  total_possible: number;
}

export interface ReadingKey {
  answer_key: ReadingAnswerKey;
  time_metadata: ReadingTimeMetadata;
  calibration_score: number;
  /** Present in first grok sample only */
  scoring_rules?: ReadingScoringRules;
  /** Present in first grok sample only */
  source?: string;
}

export interface ReadingTeacherPack {
  content: ReadingContent;
  key: ReadingKey;
}

// ─── Student Handout — Question variants ─────────────────────

/**
 * Option shape used in structured question arrays
 * label/id key varies across providers:
 *   grok R-01 (B1C)  -> { label: "A", text: "..." }
 *   grok R-01 (B1)   -> { id: "A",    text: "..." }
 *   openai R-02 (B1) -> option is a plain string  "A. Tire Maintenance"
 */
export interface ReadingQuestionOptionLabeled {
  label: string;
  text: string;
}

export interface ReadingQuestionOptionId {
  id: string;
  text: string;
}

/** Options can be structured objects OR plain strings */
export type ReadingQuestionOption =
  | ReadingQuestionOptionLabeled
  | ReadingQuestionOptionId
  | string;

/**
 * Variant 1 — numbered MCQ / matching with structured options array
 * Used by: grok R-01 (B1C), grok R-01 (B1), grok R-02 (B1)
 * Keys: { number | id, text, options? }
 */
export interface ReadingQuestionNumbered {
  /** grok R-01 B1C uses "number" */
  number?: number;
  /** grok R-01 B1 / grok R-02 B1 use "id" */
  id?: number;
  text: string;
  options?: ReadingQuestionOption[];
}

/**
 * Variant 2 — openai-style with "question" key + options as object map
 * Used by: openai R-01 (B1C), openai R-01 (B1)
 * { question: string, options: { A: "...", B: "...", ... } }
 */
export interface ReadingQuestionOpenAiObject {
  question: string;
  options: Record<string, string>; // { "A": "text", "B": "text" }
}

/**
 * Variant 3 — openai matching with "question" key + options as string array
 * Used by: openai R-02 (B1)
 * { question: "1", options: ["A. ...", "B. ..."] }
 */
export interface ReadingQuestionOpenAiArray {
  question: string;
  options: string[];
}

/**
 * Variant 4 — heading-based matching
 * Used by: openai R-02 (B1C)
 * { heading: string, options: string[] }
 */
export interface ReadingQuestionHeading {
  heading: string;
  options: string[];
}

/** Master union of all question shapes */
export type ReadingQuestion =
  | ReadingQuestionNumbered
  | ReadingQuestionOpenAiObject
  | ReadingQuestionOpenAiArray
  | ReadingQuestionHeading;

// ─── Student Handout — Stimulus variants ─────────────────────

/**
 * Stimulus inside student_handout:
 *   - Most responses: { title?, text, options? }
 *   - Plain string never appears here (only in teacher_pack.content.stimulus)
 */
export interface ReadingHandoutStimulus {
  title?: string;
  text: string;
  /** Inline matching options attached to stimulus (grok R-02 B1C) */
  options?: ReadingStimulusOption[];
}

// ─── Student Handout ─────────────────────────────────────────

export interface ReadingStudentHandout {
  title: string;
  instructions: string;
  stimulus: ReadingHandoutStimulus;
  questions: ReadingQuestion[];
}

// ─── Calibration Metrics variants ────────────────────────────

/**
 * Observed calibration_metrics shapes across all samples:
 *
 * Shape A (grok R-01 B1C):
 *   { cefr_scale, level_alignment, task_relevance, difficulty_balance }
 *
 * Shape B (grok R-02 B1C / grok R-01 B1):
 *   { source, task_type, points_per_correct, points_per_incorrect, total_possible }
 *
 * Shape C (grok R-02 B1):
 *   { cefr_source, task_type, points_per_correct, points_per_incorrect, total_possible }
 *
 * Shape D (openai R-01 B1C):
 *   { difficulty_level, estimated_completion_time, scoring_accuracy }
 *
 * Shape E (openai R-02 B1C / openai R-02 B1):
 *   {}  (empty object)
 *
 * Shape F (openai R-01 B1):
 *   { difficulty_estimation, expected_success_rate }
 *
 * Solution: all fields optional in one merged interface
 */
export interface ReadingCalibrationMetrics {
  // ── Shape A ──
  cefr_scale?: string;
  level_alignment?: string;
  task_relevance?: string;
  difficulty_balance?: string;

  // ── Shape B ──
  source?: string;
  task_type?: string;
  points_per_correct?: number;
  points_per_incorrect?: number;
  total_possible?: number;

  // ── Shape C ──
  cefr_source?: string;

  // ── Shape D ──
  difficulty_level?: DifficultyLevel;
  estimated_completion_time?: number;
  scoring_accuracy?: string;

  // ── Shape F ──
  difficulty_estimation?: DifficultyLevel;
  expected_success_rate?: number;

  // Safety net for any future undocumented fields
  [key: string]: unknown;
}

// ─────────────────────────────────────────────────────────────
// RESPONSE — root
// ─────────────────────────────────────────────────────────────

export interface GenerateReadingResponse {
  header: ReadingHeader;
  teacher_pack: ReadingTeacherPack;
  student_handout: ReadingStudentHandout;
  calibration_metrics: ReadingCalibrationMetrics;
}

// ─────────────────────────────────────────────────────────────
// BATCH REQUEST & RESPONSE
// ─────────────────────────────────────────────────────────────

export interface GenerateReadingBatchRequest extends Omit<GenerateReadingRequest, 'LESSON_TITLE'> {
  variant_count: number;
}

export interface GenerateReadingBatchResponse {
  job_id: string;
  message: string;
}