/* eslint-disable @typescript-eslint/no-explicit-any */
export type ExerciseType = 'speaking' | 'complete';

export interface QuestionSetData {
  id: number;
  lessonId: number;
  prompt: string;
  content: any;
  createdAt: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: QuestionSetData;
}