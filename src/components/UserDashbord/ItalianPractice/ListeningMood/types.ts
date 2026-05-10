/* eslint-disable @typescript-eslint/no-explicit-any */
export interface QuestionOption {
  english: string;
  italian: string;
}

export interface StudentQuestion {
  Question: string;
  Options: string[];
}

export interface StudentHandout {
  Instructions?: string;
  Questions?: StudentQuestion[];
  instructions?: string;
  questions?: any[];
}

export interface TeacherPack {
  'CONTENT/SCRIPT'?: string[] | string;
  SCRIPT?: string[] | string;
  content?: any;
  script?: any;
  KEY?: Array<{
    Question: string;
    Answer: string;
    Rationale: string;
  }>;
  key?: {
    answers: any[];
  } | any;
  answer_key?: any;
}

export interface ListeningContent {
  HEADER: string;
  student_handout?: StudentHandout;
  teacher_pack?: TeacherPack;

  // temporary / legacy
  PART_1_TEACHER_PACK?: TeacherPack;
  PART_2_STUDENT_HANDOUT?: StudentHandout;

  'PART 1: TEACHER_PACK (SECURE)'?: TeacherPack;
  'PART 2: STUDENT_HANDOUT (PRINTABLE)'?: StudentHandout;
}

export interface QuestionSetData {
  id: number;
  lessonId: number;
  subCategoryType: string;
  prompt: string;
  content: ListeningContent;
  createdAt: string;
}

export interface LessonApiResponse {
  success: boolean;
  data: {
    id: number;
    title: string;
    type: string;
    difficulty: string;
  };
}

export interface Question {
  id: number;
  english_question: string;
  italian_question: string;
  options: QuestionOption[];
  selectedAnswer: string | null;
  correctAnswer: string;
}

export interface EvaluationResponse {
  success: boolean;
  data?: {
    feedback: string;
    score: number;
    areas_for_improvement: string[];
    detailed_feedback?: Record<string, any>;
    duration_seconds?: number;
    xp_point?: number;
    score_percentage?: number;
    correct?: number;
  };
  message?: string;
}

export interface ReadingPerformanceData {
  type: string;
  passage?: string;
  questions?: string[];
  user_answers?: string[];
  correct_answers?: string[];
  score?: number;
  accuracy_rate?: number;
  feedback?: string;
  detailed_feedback?: {
    strengths?: string[];
    improvements?: string[];
    specific_errors?: string[];
  };
}

export interface EvaluationPayload {
  lesson: ReadingPerformanceData[];
  overall_stats: {
    total_score: number;
    accuracy: number;
  };
  performance_status: string;
  feedback_message: string;
  exercise_breakdown: any;
}

export const PHASES = {
  QUESTIONS: "questions",
  DICTATION: "dictation",
  SENTENCE: "sentence",
  EVALUATING: "evaluating",
  COMPLETE: "complete",
} as const;

export type Phase = typeof PHASES[keyof typeof PHASES];

export const EXERCISE_SEQUENCE = ['AUDIO_COMPRE_HENSION'] as const;
export type ExerciseType = "AUDIO_COMPREHENSION";
