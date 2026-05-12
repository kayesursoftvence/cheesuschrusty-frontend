// ─────────────────────────────────────────────────────────────
// aiApi.listening.types.ts
// ─────────────────────────────────────────────────────────────

// ─── Shared Primitives ───────────────────────────────────────

export type TestMode = 'ON' | 'OFF';
export type IsTimed = 'Yes' | 'No';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | string;
export type Provider = 'grok' | 'openai' | 'anthropic' | string;
export type ListeningTaskID = 'L-01' | 'L-02' | 'L-03' | 'L-04' | string;

// ─────────────────────────────────────────────────────────────
// REQUEST
// ─────────────────────────────────────────────────────────────

export interface GenerateListeningRequest {
  provider: Provider;
  LEVEL_ID: string;           // e.g. "B1", "B1C"
  TARGET_LANGUAGE: string;    // e.g. "English"
  SKILL: string;              // e.g. "Listening"
  TASK_ID: ListeningTaskID;   // e.g. "L-01", "L-02"
  DOMAIN: string;             // e.g. "Health", "auto"
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

export interface ListeningHeader {
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

// ─── Stimulus variants (teacher_pack.content.stimulus) ───────

/**
 * Stimulus as an object with text only
 * Used by: grok B1C L-01
 */
export interface ListeningStimulusObject {
  text: string;
}

/**
 * Stimulus variants inside teacher_pack.content:
 *   1. plain string   → grok B1 L-01, grok B1 L-02, grok B1C L-02,
 *                        openai B1 L-01, openai B1 L-02,
 *                        openai B1C L-01, openai B1C L-02
 *   2. { text }       → grok B1C L-01
 */
export type ListeningTeacherStimulus =
  | string
  | ListeningStimulusObject;

// ─── Question option variants ─────────────────────────────────

/**
 * Option shape A — structured object with "label" key
 * Used by: grok B1 L-01, grok B1 L-02, grok B1C L-01, grok B1C L-02
 * { label: "A", text: "..." }
 */
export interface ListeningOptionLabeled {
  label: string;
  text: string;
}

/**
 * Option shape B — structured object with "id" key (never seen in
 * listening samples but kept for parity with reading types)
 */
export interface ListeningOptionId {
  id: string;
  text: string;
}

/**
 * All possible option shapes:
 *   1. { label, text }     → grok samples
 *   2. { id, text }        → reserved / future
 *   3. Record<string,string> → openai B1 L-01, openai B1C L-01, L-02
 *                              { "A": "Headache", "B": "..." }
 *   4. string[]            → openai B1 L-02  ["A. 9:00 AM", "B. 10:30 AM"]
 *
 * NOTE: shapes 3 & 4 appear at the QUESTION level, not item level,
 *       so they are modelled on the question interfaces below.
 */
export type ListeningQuestionOption =
  | ListeningOptionLabeled
  | ListeningOptionId;

// ─── Question variants ────────────────────────────────────────

/**
 * Variant 1 — numbered / id-keyed question with structured options array
 * Used by: grok B1 L-01, grok B1 L-02 → key "number"
 *           grok B1C L-01, grok B1C L-02 → key "id"
 *
 * { number?: number, id?: number, text: string,
 *   options: ListeningQuestionOption[] }
 */
export interface ListeningQuestionNumbered {
  /** grok B1 uses "number" */
  number?: number;
  /** grok B1C uses "id" */
  id?: number;
  text: string;
  options: ListeningQuestionOption[];
}

/**
 * Variant 2 — openai-style "question" key + options as OBJECT map
 * Used by: openai B1 L-01, openai B1C L-01, openai B1C L-02
 *
 * { question: string, options: { "A": "...", "B": "..." } }
 */
export interface ListeningQuestionOpenAiObject {
  question: string;
  options: Record<string, string>;
}

/**
 * Variant 3 — openai-style "question" key + options as STRING array
 * Used by: openai B1 L-02
 *
 * { question: string, options: ["A. ...", "B. ..."],
 *   correct_answer?: string }   ← extra field in teacher_pack only
 */
export interface ListeningQuestionOpenAiArray {
  question: string;
  options: string[];
  /** Only present inside teacher_pack.content.questions (openai B1 L-02) */
  correct_answer?: string;
}

/** Master union of all question shapes */
export type ListeningQuestion =
  | ListeningQuestionNumbered
  | ListeningQuestionOpenAiObject
  | ListeningQuestionOpenAiArray;

// ─── Teacher Pack ─────────────────────────────────────────────

/**
 * teacher_pack.content variations:
 *
 *   Most responses   → { stimulus: string | object, word_count? }
 *   openai B1 L-01   → { stimulus: string, questions: [...] }
 *                       questions use OpenAiObject options
 *   openai B1 L-02   → { stimulus: string, questions: [...] }
 *                       questions use string[] options + correct_answer
 *   openai B1C L-02  → { stimulus: string, questions: [...] }
 *                       questions use OpenAiObject options with id key
 */
export interface ListeningContent {
  stimulus: ListeningTeacherStimulus;
  word_count?: number;
  /**
   * Some openai responses embed questions directly inside content
   * rather than only in student_handout
   */
  questions?: ListeningQuestion[];
}

// ─── Teacher Pack Key ─────────────────────────────────────────

export interface ListeningAnswerKey {
  [questionNumber: string]: string; // "1" -> "B", "2" -> "A", ...
}

export interface ListeningTimeMetadata {
  task_time: number;
  is_timed: IsTimed;
}

/**
 * Scoring sub-object occasionally nested inside key
 * Used by: grok B1C L-01 → key "scoring" (not "scoring_rules")
 */
export interface ListeningScoringRules {
  task_type: string;
  points_per_correct: number;
  points_per_incorrect: number;
  total_possible: number;
}

export interface ListeningKey {
  answer_key: ListeningAnswerKey;
  time_metadata: ListeningTimeMetadata;
  calibration_score: number;
  /** grok B1C L-01 uses "scoring" (not "scoring_rules") */
  scoring?: ListeningScoringRules;
}

export interface ListeningTeacherPack {
  content: ListeningContent;
  key: ListeningKey;
}

// ─── Student Handout Stimulus variants ───────────────────────

/**
 * student_handout.stimulus shapes observed:
 *
 *   { text }      → most responses (grok all, openai B1 L-01, openai B1C all)
 *   { context }   → openai B1 L-02  (uses "context" key instead of "text")
 */
export interface ListeningHandoutStimulusText {
  text: string;
}

export interface ListeningHandoutStimulusContext {
  context: string;
}

export type ListeningHandoutStimulus =
  | ListeningHandoutStimulusText
  | ListeningHandoutStimulusContext;

// ─── Student Handout ──────────────────────────────────────────

export interface ListeningStudentHandout {
  title: string;
  instructions: string;
  stimulus: ListeningHandoutStimulus;
  questions: ListeningQuestion[];
}

// ─── Calibration Metrics variants ────────────────────────────

/**
 * Observed shapes across all samples:
 *
 * Shape A  (grok B1 L-01):
 *   { cefr_scale, level, source, task_type,
 *     points_per_correct, points_per_incorrect, total_possible }
 *
 * Shape B  (grok B1 L-02):
 *   { cefr_scale, level, source }
 *
 * Shape C  (grok B1C L-01):
 *   { source }
 *
 * Shape D  (grok B1C L-02):
 *   { source, task_type, points_per_correct,
 *     points_per_incorrect, total_possible }
 *
 * Shape E  (openai B1 L-01, openai B1 L-02):
 *   {}   (empty object)
 *
 * Shape F  (openai B1C L-01):
 *   { difficulty_adjustment, native_language_inference }
 *
 * Shape G  (openai B1C L-02):
 *   { difficulty_rating, expected_time,
 *     total_questions, total_score }
 *
 * Solution: single interface, all fields optional + index signature
 */
export interface ListeningCalibrationMetrics {
  // ── Shapes A, B ──
  cefr_scale?: string;
  level?: string;

  // ── Shapes A, B, C, D ──
  source?: string;

  // ── Shapes A, D ──
  task_type?: string;
  points_per_correct?: number;
  points_per_incorrect?: number;
  total_possible?: number;

  // ── Shape F ──
  difficulty_adjustment?: string;
  native_language_inference?: string;

  // ── Shape G ──
  difficulty_rating?: DifficultyLevel;
  expected_time?: number;
  total_questions?: number;
  total_score?: number;

  // Safety net for any future undocumented fields
  [key: string]: unknown;
}

// ─────────────────────────────────────────────────────────────
// RESPONSE — root
// ─────────────────────────────────────────────────────────────

export interface GenerateListeningResponse {
  header: ListeningHeader;
  teacher_pack: ListeningTeacherPack;
  student_handout: ListeningStudentHandout;
  calibration_metrics: ListeningCalibrationMetrics;
}

// ─────────────────────────────────────────────────────────────
// BATCH REQUEST & RESPONSE
// ─────────────────────────────────────────────────────────────

export interface GenerateListeningBatchRequest extends Omit<GenerateListeningRequest, 'LESSON_TITLE'> {
  variant_count: number;
}

export interface GenerateListeningBatchResponse {
  job_id: string;
  message: string;
}