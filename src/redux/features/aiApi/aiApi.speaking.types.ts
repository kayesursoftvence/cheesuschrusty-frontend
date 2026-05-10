// ─────────────────────────────────────────────────────────────
// aiApi.speaking.types.ts
// ─────────────────────────────────────────────────────────────

// ─── Shared Primitives ───────────────────────────────────────

export type TestMode = 'ON' | 'OFF';
export type IsTimed = 'Yes' | 'No';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | string;
export type Provider = 'grok' | 'openai' | 'anthropic' | string;
export type SpeakingTaskID = 'S-01' | 'S-02' | 'S-1' | 'S-2' | string;

// ─────────────────────────────────────────────────────────────
// REQUEST
// ─────────────────────────────────────────────────────────────

export interface GenerateSpeakingRequest {
  provider: Provider;
  LEVEL_ID: string;           // e.g. "B1", "B1C"
  TARGET_LANGUAGE: string;    // e.g. "English"
  SKILL: string;              // e.g. "Speaking"
  TASK_ID: SpeakingTaskID;    // e.g. "S-01", "S-02", "S-1", "S-2"
  DOMAIN: string;             // e.g. "Health"
  DIFFICULTY: DifficultyLevel;
  SECTION_TOTAL: number;
  TASK_TIME: number;          // in seconds
  NATIVE_LANGUAGE: string;    // e.g. "Bengali"
  TEST_MODE: TestMode;
  LESSON_TITLE: string;
}

// ─────────────────────────────────────────────────────────────
// RESPONSE — building blocks
// ─────────────────────────────────────────────────────────────

// ─── Header ──────────────────────────────────────────────────

/**
 * Header variations:
 *
 *   S-01 tasks (grok B1, grok B1C, openai B1, openai B1C S-1):
 *     Standard header fields only
 *
 *   S-02 tasks (grok B1 S-02, grok B1C S-02,
 *               openai B1 S-2, openai B1C S-2):
 *     Extra fields: image_description, image_url?
 *     image_url is a base64 data URI string
 *     image_url absent in some samples even when image_description present
 */
export interface SpeakingHeader {
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
  /**
   * Image prompt description for picture-based speaking tasks (S-02)
   * Absent in S-01 tasks
   */
  image_description?: string;
  /**
   * Base64-encoded image data URI — e.g. "data:image/png;base64,..."
   * Present in some S-02 responses, absent in others
   */
  image_url?: string;
}

// ─── Teacher Pack — Content ───────────────────────────────────

/**
 * cefr_grading_keys variants:
 *
 *   grok B1  S-01 → object map:
 *     { key_1: "Relevance", key_2: "Accuracy", key_3: "Vocabulary" }
 *
 *   grok B1C S-01 → string array:
 *     ["Relevance", "Accuracy", "Vocabulary"]
 *
 *   openai all / grok S-02 → absent (not included)
 */
export interface SpeakingCefrGradingKeysObject {
  key_1: string;
  key_2: string;
  key_3: string;
  /** Allow additional grading keys beyond key_1–key_3 */
  [key: string]: string;
}

export type SpeakingCefrGradingKeys =
  | SpeakingCefrGradingKeysObject  // grok B1  → object map
  | string[];                       // grok B1C → string array

/**
 * teacher_pack.content variations:
 *
 *   grok  B1  S-01 → { prompt, word_count, it_phrase_hints[], cefr_grading_keys{} }
 *   grok  B1  S-02 → incomplete in sample (truncated) — treat as object
 *   grok  B1C S-01 → { prompt, it_phrase_hints[], cefr_grading_keys[], word_count }
 *   grok  B1C S-02 → incomplete in sample (truncated) — treat as object
 *   openai B1  S-1 → { prompt }
 *   openai B1  S-2 → { prompt }
 *   openai B1C S-1 → plain string   ← ONLY case where content is a string!
 *   openai B1C S-2 → { prompt }
 *
 * "content" can be a plain string OR a structured object.
 */
export interface SpeakingContentObject {
  /** The speaking prompt shown to teacher and student */
  prompt?: string;
  /** Word count of the prompt */
  word_count?: number;
  /**
   * Key vocabulary hints for the teacher
   * Used by grok responses only
   */
  it_phrase_hints?: string[];
  /**
   * CEFR grading criteria
   * Shape varies: object map (grok B1) vs string array (grok B1C)
   */
  cefr_grading_keys?: SpeakingCefrGradingKeys;
}

/**
 * teacher_pack.content union:
 *   1. SpeakingContentObject  → most responses
 *   2. string                 → openai B1C S-1 only
 */
export type SpeakingContent =
  | SpeakingContentObject
  | string;

// ─── Teacher Pack — Key ───────────────────────────────────────

/**
 * answer_key is always {} (empty) for speaking tasks.
 * Speaking responses are evaluated via the separate
 * /evaluate/speaking-performance endpoint.
 */
export type SpeakingAnswerKey = Record<string, never> | Record<string, unknown>;

export interface SpeakingTimeMetadata {
  task_time: number;
  is_timed: IsTimed;
}

export interface SpeakingKey {
  answer_key: SpeakingAnswerKey;
  time_metadata: SpeakingTimeMetadata;
  /**
   * Always 0 for speaking tasks — scored separately
   * via the evaluate endpoint
   */
  calibration_score: number;
}

export interface SpeakingTeacherPack {
  content: SpeakingContent;
  key: SpeakingKey;
}

// ─── Student Handout — Stimulus variants ─────────────────────

/**
 * student_handout.stimulus shapes observed:
 *
 *   { prompt }    → grok B1 S-01, grok B1C S-01,
 *                    openai B1 S-1, openai B1C S-2
 *   { content }   → openai B1 S-2 (image description as content)
 *   {}            → openai B1C S-1 (empty object)
 *
 * Note: S-02 truncated grok samples are missing student_handout
 *       in the provided data — modelled as optional.
 *
 * All fields optional to handle empty object case.
 */
export interface SpeakingHandoutStimulus {
  /**
   * The speaking prompt for the student
   * Used by: grok S-01, openai S-1, openai B1C S-2
   */
  prompt?: string;
  /**
   * Image/scene description shown to student for picture tasks
   * Used by: openai B1 S-2
   */
  content?: string;
  /** Safety net for any future undocumented fields */
  [key: string]: unknown;
}

// ─── Student Handout ─────────────────────────────────────────

export interface SpeakingStudentHandout {
  title: string;
  instructions: string;
  /**
   * Stimulus is optional because some truncated S-02
   * grok samples are missing student_handout entirely
   */
  stimulus: SpeakingHandoutStimulus;
  /**
   * Always an empty array [] for speaking tasks.
   * Speaking prompts have no discrete questions.
   */
  questions: never[] | [];
}

// ─── Calibration Metrics ─────────────────────────────────────

/**
 * Always {} (empty object) across all observed speaking samples.
 * Index signature added for forward compatibility.
 */
export interface SpeakingCalibrationMetrics {
  [key: string]: unknown;
}

// ─────────────────────────────────────────────────────────────
// RESPONSE — root
// ─────────────────────────────────────────────────────────────

export interface GenerateSpeakingResponse {
  header: SpeakingHeader;
  teacher_pack: SpeakingTeacherPack;
  student_handout: SpeakingStudentHandout;
  calibration_metrics: SpeakingCalibrationMetrics;
}


// ─────────────────────────────────────────────────────────────
// BATCH REQUEST & RESPONSE
// ─────────────────────────────────────────────────────────────

export interface GenerateSpeakingBatchRequest extends Omit<GenerateSpeakingRequest, 'LESSON_TITLE'> {
  variant_count: number;
}

export interface GenerateSpeakingBatchResponse {
  job_id: string;
  message: string;
}