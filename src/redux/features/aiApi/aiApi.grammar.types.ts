// ─────────────────────────────────────────────────────────────
// aiApi.grammar.types.ts
// ─────────────────────────────────────────────────────────────

// ─── Shared Primitives ───────────────────────────────────────

export type TestMode = 'ON' | 'OFF';
export type IsTimed = 'Yes' | 'No';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | string;
export type Provider = 'grok' | 'openai' | 'anthropic' | string;
export type GrammarTaskID = 'G-01' | 'G-02' | 'G-03' | 'G-04' | string;

// ─────────────────────────────────────────────────────────────
// REQUEST
// ─────────────────────────────────────────────────────────────

export interface GenerateGrammarRequest {
  provider: Provider;
  LEVEL_ID: string;           // e.g. "B1", "B1C"
  TARGET_LANGUAGE: string;    // e.g. "English"
  SKILL: string;              // e.g. "Grammar"
  TASK_ID: GrammarTaskID;     // e.g. "G-01", "G-02"
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

export interface GrammarHeader {
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

// ─── Teacher Pack — Content — Question variants ───────────────

/**
 * Question embedded inside teacher_pack.content
 * Used by: openai B1C G-01 only
 *
 * Has extra "correct_answer" field not present in
 * student_handout questions
 *
 * { question: string,
 *   options: { "A": "...", "B": "..." },
 *   correct_answer: string }
 */
export interface GrammarContentQuestion {
  question: string;
  options: Record<string, string>; // { "A": "Apple", "B": "Milk" }
  correct_answer: string;          // "B"
}

/**
 * teacher_pack.content variations across all samples:
 *
 *   grok  B1  G-01 → { stimulus: string, word_count }
 *                     (gap-fill cloze passage with numbered blanks)
 *
 *   grok  B1  G-02 → { stimulus: string }
 *                     (gap-fill with verb hints in parentheses)
 *
 *   grok  B1C G-01 → { stimulus: string, word_count }
 *                     (MCQ cloze passage)
 *
 *   grok  B1C G-02 → { stimulus: string }
 *                     (open gap-fill with verb hints)
 *
 *   openai B1  G-01 → { stimulus: string }
 *                      (reading comprehension passage)
 *
 *   openai B1  G-02 → { stimulus_text: string,        ← different key!
 *                        gap_fill_sentences: string[] } ← sentence list
 *
 *   openai B1C G-01 → { stimulus: string,
 *                        questions: GrammarContentQuestion[] } ← embedded Qs
 *
 *   openai B1C G-02 → { stimulus: string,
 *                        gap_fill_text: string }        ← separate cloze text
 */
export interface GrammarContent {
  /**
   * Main passage/prompt text
   * Used by: grok all, openai B1 G-01, openai B1C G-01/G-02
   */
  stimulus?: string;

  /**
   * Alternative key for stimulus text
   * Used by: openai B1 G-02 only
   */
  stimulus_text?: string;

  /**
   * Separate cloze/gap-fill text block (distinct from the stimulus)
   * Used by: openai B1C G-02
   */
  gap_fill_text?: string;

  /**
   * List of individual gap-fill sentences
   * Used by: openai B1 G-02
   */
  gap_fill_sentences?: string[];

  /**
   * Questions embedded inside content (teacher copy includes correct_answer)
   * Used by: openai B1C G-01
   */
  questions?: GrammarContentQuestion[];

  /**
   * Word count of stimulus text
   * Used by: grok B1 G-01, grok B1C G-01
   */
  word_count?: number;

  /** Safety net for future undocumented fields */
  [key: string]: unknown;
}

// ─── Teacher Pack — Answer Key ────────────────────────────────

/**
 * answer_key value types observed:
 *
 *   Letter answers  → grok B1 G-01, grok B1C G-01,
 *                      openai B1 G-01, openai B1C G-01
 *                      { "1": "A", "2": "C" }
 *
 *   Word/phrase answers → grok B1 G-02, grok B1C G-02
 *                          { "1": "had been shopping", "2": "had forgotten" }
 *
 *   Single word answers → openai B1 G-02
 *                          { "1": "lettuce", "2": "bread" }
 *
 * All use string values — union covers all cases naturally.
 */
export interface GrammarAnswerKey {
  [questionNumber: string]: string;
}

export interface GrammarTimeMetadata {
  task_time: number;
  is_timed: IsTimed;
}

export interface GrammarKey {
  answer_key: GrammarAnswerKey;
  time_metadata: GrammarTimeMetadata;
  /**
   * Total correct answers possible.
   * 0 for open-ended tasks (openai B1C G-02)
   */
  calibration_score: number;
}

export interface GrammarTeacherPack {
  content: GrammarContent;
  key: GrammarKey;
}

// ─── Student Handout — Question variants ─────────────────────

/**
 * Variant 1 — id-keyed question with labeled options array
 * Used by: grok B1 G-01, grok B1C G-02 (structured MCQ)
 *
 * { id: number, text: string, options: [{label, text}] }
 */
export interface GrammarQuestionOptionLabeled {
  label: string; // "A", "B", "C", "D"
  text: string;
}

export interface GrammarQuestionIdLabeled {
  id: number;
  text: string;
  options: GrammarQuestionOptionLabeled[];
}

/**
 * Variant 2 — id-keyed question with NO options
 * Used by: grok B1 G-02, grok B1C G-02
 *          (open gap-fill — student writes the answer)
 *
 * { id: number, text: string }
 */
export interface GrammarQuestionIdNoOptions {
  id: number;
  text: string;
  options?: never;
}

/**
 * Variant 3 — number-keyed question with options as object map
 * Used by: grok B1C G-01
 *
 * { number: number, text: string, options: { "A": "goes", "B": "go" } }
 */
export interface GrammarQuestionNumbered {
  number: number;
  text: string;
  options: Record<string, string>; // { "A": "goes", "B": "go" }
}

/**
 * Variant 4 — openai-style "question" key with options as object map
 * Used by: openai B1 G-01, openai B1C G-01
 *
 * { question: string, options: { "A": "...", "B": "..." } }
 * Note: NO correct_answer in student_handout (only in teacher content)
 */
export interface GrammarQuestionOpenAiObject {
  question: string;
  options: Record<string, string>;
}

/**
 * Master union of all structured question shapes.
 * Note: openai B1 G-02 and openai B1C G-02 use plain string[]
 *       for questions — handled separately on student_handout.
 */
export type GrammarQuestion =
  | GrammarQuestionIdLabeled
  | GrammarQuestionIdNoOptions
  | GrammarQuestionNumbered
  | GrammarQuestionOpenAiObject;

// ─── Student Handout — Stimulus variants ─────────────────────

/**
 * student_handout.stimulus shapes observed:
 *
 *   { text }     → grok B1 G-01/G-02, grok B1C G-01/G-02,
 *                   openai B1 G-01, openai B1C G-01/G-02
 *   { context }  → openai B1 G-02
 *   {}           → not observed but possible given other skills
 *
 * All fields optional to handle all variants.
 */
export interface GrammarHandoutStimulus {
  /** Primary passage/prompt text */
  text?: string;
  /** Contextual description — openai B1 G-02 */
  context?: string;
  /** Safety net for future undocumented fields */
  [key: string]: unknown;
}

// ─── Student Handout ─────────────────────────────────────────

/**
 * student_handout.questions variations:
 *
 *   Structured array → GrammarQuestion[]
 *     grok B1 G-01, grok B1 G-02, grok B1C G-01, grok B1C G-02,
 *     openai B1 G-01, openai B1C G-01
 *
 *   Plain string array → string[]
 *     openai B1 G-02  → ["1. I need to buy some _____ for the salad.", ...]
 *     openai B1C G-02 → ["Every morning, Sarah ___ the metro...", ...]
 *
 * Union: GrammarQuestion[] | string[]
 */
export interface GrammarStudentHandout {
  title: string;
  instructions: string;
  stimulus: GrammarHandoutStimulus;
  questions: GrammarQuestion[] | string[];
}

// ─── Calibration Metrics ─────────────────────────────────────

/**
 * Observed calibration_metrics shapes:
 *
 *   Shape A (grok B1 G-01/G-02):
 *     { source, points_per_correct, points_per_incorrect, total_possible }
 *
 *   Shape B (grok B1C G-01):
 *     { cefr_scale, level, source }
 *
 *   Shape C (grok B1C G-02):
 *     { total_possible, points_per_correct, points_per_incorrect, source }
 *     (same fields as Shape A, different ordering — same type)
 *
 *   Shape D (openai all):
 *     {}   (empty object)
 *
 * All fields optional + index signature.
 */
export interface GrammarCalibrationMetrics {
  /** CEFR reference — grok B1 G-01/G-02, grok B1C G-01/G-02 */
  source?: string;

  /** Points awarded per correct answer */
  points_per_correct?: number;

  /** Points deducted per incorrect answer */
  points_per_incorrect?: number;

  /** Maximum achievable score */
  total_possible?: number;

  /** CEFR scale label — grok B1C G-01 */
  cefr_scale?: string;

  /** CEFR level string — grok B1C G-01 */
  level?: string;

  /** Safety net for future undocumented fields */
  [key: string]: unknown;
}

// ─────────────────────────────────────────────────────────────
// RESPONSE — root
// ─────────────────────────────────────────────────────────────

export interface GenerateGrammarResponse {
  header: GrammarHeader;
  teacher_pack: GrammarTeacherPack;
  student_handout: GrammarStudentHandout;
  calibration_metrics: GrammarCalibrationMetrics;
}

// ─────────────────────────────────────────────────────────────
// BATCH REQUEST & RESPONSE
// ─────────────────────────────────────────────────────────────

export interface GenerateGrammarBatchRequest extends Omit<GenerateGrammarRequest, 'LESSON_TITLE'> {
  variant_count: number;
}

export interface GenerateGrammarBatchResponse {
  job_id: string;
  message: string;
}