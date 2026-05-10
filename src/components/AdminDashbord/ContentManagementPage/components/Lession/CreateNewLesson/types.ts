// types.ts

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B1c' | 'B2' | 'C1' | 'C2';

export type TaskIdType =
  // Listening
  | 'L-01' | 'L-02' | 'L-03'
  // Reading
  | 'R-01' | 'R-02' | 'R-03'
  // Grammar
  | 'G-01' | 'G-02' | 'G-03' | 'G-04'
  // Writing
  | 'W-01' | 'W-02'
  // Speaking
  | 'S-01' | 'S-02'
  | null;

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type TaskType = 'listening' | 'reading' | 'writing' | 'speaking' | 'grammar' | null;
export type Domain = 'health' | 'education' | 'work' | 'housing' | 'bureaucracy' | 'commerce' | 'random';
export type GenerationMode = 'single' | 'batch';
export type AIProvider = 'openai' | 'grok';

// ── Level Options ───────────────────────────────────────────
export interface LevelOption {
  name: string;
  badge: string;
  disabled: boolean;
  value?: CEFRLevel;
}

// ── Subtask (individual task variant) ───────────────────────
export interface SubtaskOption {
  id: TaskIdType;
  label: string;
  format: string;
}

// ── Task Options (updated structure with subtasks) ──────────
export interface TaskOption {
  value: TaskType;
  icon: string;
  name: string;
  id: string;
  description: string;
  subtasks?: SubtaskOption[];
}

// ── Domain Options ──────────────────────────────────────────
export interface DomainOption {
  value: Domain;
  icon: string;
  name: string;
  description: string;
}

// ── Mode Options ────────────────────────────────────────────
export interface ModeOption {
  value: GenerationMode;
  icon: string;
  name: string;
  description: string;
}

// ── Provider Options ────────────────────────────────────────
export interface ProviderOption {
  value: AIProvider;
  icon: string;
  name: string;
  description: string;
}

// ── Lesson Form State ───────────────────────────────────────
export interface LessonFormState {
  selectedLevel: CEFRLevel;
  selectedTask: TaskType;
  selectedTaskId: TaskIdType;
  selectedDomain: Domain;
  selectedDifficulty: DifficultyLevel | null;
  generationMode: GenerationMode;
  selectedProvider: AIProvider;
  lessonTitle: string;
  batchCount: number;
  avoidDuplicates: boolean;
  sectionTotal: number;
  taskTime: number;
  // level_title?: string;
  // topic?: string;
  // is_pro?: boolean;
  // schema?: any;
}

// ── Task Metadata (for format details lookup) ───────────────
export interface TaskMetadata {
  id: TaskIdType;
  type: 'MCQ' | 'Matching' | 'TrueFalse' | 'GapFill' | 'Transformation' | 'ErrorRecognition' | 'Writing' | 'Speaking';
  questionCount?: number;
  optionCount?: number;
  wordCount?: { min: number; max: number };
  duration?: string;
  isImageBased?: boolean;
}

// ── Track Configuration ─────────────────────────────────────
export type TrackType = 'standard' | 'citizenship';

export interface TrackConfig {
  level: CEFRLevel;
  type: TrackType;
  availableTasks: TaskType[];
}

export interface LessonRequestPayload {
  provider: string;
  LEVEL_ID: string;
  TARGET_LANGUAGE: string;
  SKILL: string;
  TASK_ID: string;
  DOMAIN: string;
  DIFFICULTY: string;
  SECTION_TOTAL: number;
  TASK_TIME: number;
  NATIVE_LANGUAGE: string;
  TEST_MODE: 'ON' | 'OFF';
  LESSON_TITLE: string;
  // level_title?: string;
  // topic?: string;
  // is_pro?: boolean;
  // schema?: any;
}

export interface LessonBatchRequestPayload extends Omit<LessonRequestPayload, 'LESSON_TITLE'> {
  variant_count: number;
}