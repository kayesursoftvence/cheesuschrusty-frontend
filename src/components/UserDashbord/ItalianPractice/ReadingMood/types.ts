/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ReadingQuestion {
  id: number;
  question: string;
  answers?: Array<{
    text: string;
    letter: string;
  }>;
  correctAnswer: string;
  options?: any | [];
}

export interface ReadingContent {
  id: number;
  lessonId: number;
  prompt: string;
  content: any;
  success: boolean;
}

export interface ReadingPerformanceData {
  type: "reading-comprehension" | "reading-matching";
  passage: string;
  questions: string[];
  user_answers: string[];
  correct_answers: string[];
  score?: number;
  accuracy_rate?: number;
  feedback?: string;
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

export interface EvaluationResponse {
  success: boolean;
  data?: {
    feedback: string;
    score: number;
    areas_for_improvement: string[];
    detailed_feedback?: Record<string, any>;
  };
  message?: string;
}

export interface ReadingSessionState {
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  answers: Record<number, string>;
  isComplete: boolean;
  evaluationResult: EvaluationResponse | null;
  showTranslation: boolean;
  italianPassage: string;
  englishPassage: string;
  questions: ReadingQuestion[];
  readingData: any;
  lessonId: number | null;
  error: string | null;
  loading: boolean;
}
