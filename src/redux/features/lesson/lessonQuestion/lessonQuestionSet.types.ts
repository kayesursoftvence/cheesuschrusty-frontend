/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Question {
  id: number;
  text: string;
}

export interface QuestionSetContent {
  dialogue?: string;
  questions: Question[];
}

export interface LessonQuestionSetResponse {
  id: number;
  lessonId: number;
  prompt: string;
  content: QuestionSetContent;
  createdAt: string;
  updatedAt: string;
  success: boolean;
  message: string;
  data: any;
  student_handout: any;
}

export interface UpsertLessonQuestionSetRequest {
  lessonId: number;
  prompt: string;
  content: QuestionSetContent;
}

export interface GetLessonQuestionSetRequest {
  lessonId: number | any;
  timestamp?: number;
}
