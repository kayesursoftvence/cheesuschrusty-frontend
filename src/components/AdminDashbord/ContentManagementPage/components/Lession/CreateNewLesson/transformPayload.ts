// utils/transformPayload.ts

import {
  LessonFormState,
  LessonRequestPayload,
  LessonBatchRequestPayload,
  TaskType,
  TaskIdType,
  DifficultyLevel,
  Domain,
  AIProvider,
} from './types';

// ══════════════════════════════════════════════════════════════
// MAPPING CONSTANTS
// ══════════════════════════════════════════════════════════════

/**
 * Map internal task types to API SKILL values
 */
const SKILL_MAP: Record<NonNullable<TaskType>, string> = {
  listening: 'LISTENING',
  reading: 'READING',
  writing: 'WRITING',
  speaking: 'SPEAKING',
  grammar: 'GRAMMAR',
};

/**
 * Map task IDs to estimated task times (in minutes)
 * Using Partial since not all task IDs may be defined
 */
const TASK_TIME_MAP: Partial<Record<NonNullable<TaskIdType>, number>> = {
  // Listening
  'L-01': 5,
  'L-02': 7,
  'L-03': 8,
  // Reading
  'R-01': 10,
  'R-02': 12,
  'R-03': 15,
  // Grammar
  'G-01': 8,
  'G-02': 10,
  'G-03': 10,
  'G-04': 12,
  // Writing
  'W-01': 15,
  'W-02': 20,
  // Speaking
  'S-01': 5,
  'S-02': 8,
};

/**
 * Map task IDs to section totals (number of questions/items)
 */
const SECTION_TOTAL_MAP: Partial<Record<NonNullable<TaskIdType>, number>> = {
  // Listening
  'L-01': 5,
  'L-02': 5,
  'L-03': 6,
  // Reading
  'R-01': 6,
  'R-02': 6,
  'R-03': 8,
  // Grammar
  'G-01': 10,
  'G-02': 10,
  'G-03': 8,
  'G-04': 8,
  // Writing
  'W-01': 1,
  'W-02': 1,
  // Speaking
  'S-01': 4,
  'S-02': 1,
};

/**
 * Map difficulty levels to API format
 */
const DIFFICULTY_MAP: Record<DifficultyLevel, string> = {
  easy: 'EASY',
  medium: 'MEDIUM',
  hard: 'HARD',
};

/**
 * Map domain values to API format
 */
const DOMAIN_MAP: Record<Domain, string> = {
  random: 'RANDOM',
  health: 'HEALTH',
  education: 'EDUCATION',
  work: 'WORK',
  housing: 'HOUSING',
  bureaucracy: 'BUREAUCRACY',
  commerce: 'COMMERCE',
};

/**
 * Map provider values to API format
 */
const PROVIDER_MAP: Record<AIProvider, string> = {
  openai: 'openai',
  grok: 'grok',
};

// ══════════════════════════════════════════════════════════════
// CONFIGURATION OPTIONS
// ══════════════════════════════════════════════════════════════

export interface TransformOptions {
  targetLanguage?: string;
  nativeLanguage?: string;
  defaultSectionTotal?: number;
  defaultTaskTime?: number;
}

const DEFAULT_OPTIONS: Required<TransformOptions> = {
  targetLanguage: 'Italian',
  nativeLanguage: 'English',
  defaultSectionTotal: 5,
  defaultTaskTime: 10,
};

// ══════════════════════════════════════════════════════════════
// VALIDATION
// ══════════════════════════════════════════════════════════════

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate form state before transformation
 */
export function validateFormState(formState: LessonFormState): ValidationResult {
  const errors: string[] = [];

  if (!formState.selectedTask) {
    errors.push('Task type is required');
  }

  if (!formState.selectedTaskId) {
    errors.push('Task ID is required');
  }

  if (!formState.selectedDifficulty) {
    errors.push('Difficulty level is required');
  }

  if (!formState.selectedLevel) {
    errors.push('CEFR level is required');
  }

  if (!formState.selectedDomain) {
    errors.push('Domain is required');
  }

  if (!formState.selectedProvider) {
    errors.push('AI provider is required');
  }

  if (formState.generationMode === 'batch' && formState.batchCount < 1) {
    errors.push('Batch count must be at least 1');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ══════════════════════════════════════════════════════════════
// MAIN TRANSFORM FUNCTION
// ══════════════════════════════════════════════════════════════

/**
 * Transform form state to API request payload
 * @throws Error if required fields are missing
 */
export function transformFormToPayload(
  formState: LessonFormState,
  options?: TransformOptions
): LessonRequestPayload {
  // Merge options with defaults
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Validate
  const validation = validateFormState(formState);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  // Destructure (safe after validation)
  const {
    selectedLevel,
    selectedTask,
    selectedTaskId,
    selectedDomain,
    selectedDifficulty,
    sectionTotal,
    taskTime,
    selectedProvider,
    lessonTitle,
  } = formState;

  // Type guards (TypeScript now knows these are non-null)
  if (!selectedTask || !selectedTaskId || !selectedDifficulty) {
    throw new Error('Required fields are missing');
  }

  // Build payload
  const payload: LessonRequestPayload = {
    provider: PROVIDER_MAP[selectedProvider],
    LEVEL_ID: selectedLevel,
    TARGET_LANGUAGE: formState.targetLanguage || opts.targetLanguage,
    SKILL: SKILL_MAP[selectedTask],
    TASK_ID: selectedTaskId,
    DOMAIN: DOMAIN_MAP[selectedDomain],
    DIFFICULTY: DIFFICULTY_MAP[selectedDifficulty],
    SECTION_TOTAL: sectionTotal,
    TASK_TIME: taskTime,
    NATIVE_LANGUAGE: formState.nativeLanguage || opts.nativeLanguage,
    TEST_MODE: 'OFF',
    GENERATION_SEED: formState.generationSeed || '42',
    LESSON_TITLE: lessonTitle.trim() || 'Auto',
  };

  return payload;
}

// ══════════════════════════════════════════════════════════════
// BATCH TRANSFORM FUNCTION
// ══════════════════════════════════════════════════════════════

/**
 * Transform form state to batch generation request
 */
export function transformFormToBatchPayload(
  formState: LessonFormState,
  options?: TransformOptions
): LessonBatchRequestPayload {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { LESSON_TITLE, ...basePayload } = transformFormToPayload(formState, options);

  return {
    ...basePayload,
    variant_count: formState.batchCount,
  };
}

/**
 * Transform form state to multiple API payloads for manual batch generation
 * @deprecated Use transformFormToBatchPayload for specialized batch mutations
 */
export function transformFormToPayloadBatch(
  formState: LessonFormState,
  options?: TransformOptions
): LessonRequestPayload[] {
  const basePayload = transformFormToPayload(formState, options);

  if (formState.generationMode !== 'batch') {
    return [basePayload];
  }

  const { batchCount, lessonTitle } = formState;

  return Array.from({ length: batchCount }, (_, index) => ({
    ...basePayload,
    LESSON_TITLE: lessonTitle.trim()
      ? `${lessonTitle.trim()} - ${index + 1}`
      : 'Auto',
  }));
}

// ══════════════════════════════════════════════════════════════
// SAFE TRANSFORM (NO THROW)
// ══════════════════════════════════════════════════════════════

export interface TransformResult {
  success: boolean;
  payload?: LessonRequestPayload;
  payloads?: LessonRequestPayload[];
  error?: string;
  validationErrors?: string[];
}

/**
 * Safe version that returns result object instead of throwing
 */
export function safeTransformFormToPayload(
  formState: LessonFormState,
  options?: TransformOptions
): TransformResult {
  const validation = validateFormState(formState);

  if (!validation.isValid) {
    return {
      success: false,
      error: 'Validation failed',
      validationErrors: validation.errors,
    };
  }

  try {
    const payload = transformFormToPayload(formState, options);
    return {
      success: true,
      payload,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Safe batch version
 */
export function safeTransformFormToPayloadBatch(
  formState: LessonFormState,
  options?: TransformOptions
): TransformResult {
  const validation = validateFormState(formState);

  if (!validation.isValid) {
    return {
      success: false,
      error: 'Validation failed',
      validationErrors: validation.errors,
    };
  }

  try {
    const payloads = transformFormToPayloadBatch(formState, options);
    return {
      success: true,
      payloads,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Get task time for a specific task ID
 */
export function getTaskTime(taskId: TaskIdType): number {
  if (!taskId) return DEFAULT_OPTIONS.defaultTaskTime;
  return TASK_TIME_MAP[taskId] ?? DEFAULT_OPTIONS.defaultTaskTime;
}

/**
 * Get section total for a specific task ID
 */
export function getSectionTotal(taskId: TaskIdType): number {
  if (!taskId) return DEFAULT_OPTIONS.defaultSectionTotal;
  return SECTION_TOTAL_MAP[taskId] ?? DEFAULT_OPTIONS.defaultSectionTotal;
}

/**
 * Get skill name from task type
 */
export function getSkillName(taskType: TaskType): string | null {
  if (!taskType) return null;
  return SKILL_MAP[taskType];
}

/**
 * Debug: Log payload in formatted way
 */
export function logPayload(payload: LessonRequestPayload): void {
  console.group('📦 Lesson Request Payload');
  console.table(payload);
  console.groupEnd();
}

/**
 * Create a payload preview object for UI display
 */
export function createPayloadPreview(formState: LessonFormState): Record<string, string> {
  const validation = validateFormState(formState);

  if (!validation.isValid) {
    return {
      status: '❌ Incomplete',
      missing: validation.errors.join(', '),
    };
  }

  try {
    const payload = transformFormToPayload(formState);
    return {
      Provider: payload.provider,
      Level: payload.LEVEL_ID,
      Skill: payload.SKILL,
      'Task ID': payload.TASK_ID,
      Domain: payload.DOMAIN,
      Difficulty: payload.DIFFICULTY,
      'Section Total': `${payload.SECTION_TOTAL} sec`,
      'Task Time': `${payload.TASK_TIME} sec`,
      Mode: payload.TEST_MODE,
      Title: payload.LESSON_TITLE,
    };
  } catch {
    return {
      status: '❌ Error',
      message: 'Failed to generate preview',
    };
  }
}