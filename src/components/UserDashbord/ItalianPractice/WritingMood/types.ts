/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GrammarQuestion {
  answer: string;
  options: GrammarOption[];
  sentence: string;
  italian_sentence: string;
  italian_answer: string;
  english_sentence: string;
  english_answer: string;
}

export interface GrammarOption {
  italian: string;
  english: string;
}

export interface GrammarPracticeApiResponse {
  type: string;
  prompt: string;
  provider: string;
  questions: GrammarQuestion[];
}

export interface CompleteSentenceQuestion {
  hint: string;
  answer: string;
  sentence: string;
  italian_sentence: string;
  italian_answer: string;
  english_sentence: string;
  english_answer: string;
}

export interface CompleteSentenceApiResponse {
  type: string;
  prompt: string;
  provider: string;
  questions: CompleteSentenceQuestion[];
}

export interface EssayTip {
  italian_tip: string;
  english_tip: string;
}

export interface ShortEssayApiResponse {
  type: string;
  prompt: string;
  provider: string;
  tips: EssayTip[];
  topic?: string;
  description?: string;
}

export type QuestionSetContent = any;

export interface QuestionSetData {
  id: string;
  lessonId: string;
  prompt: string;
  content: any;
  createdAt: string;
}