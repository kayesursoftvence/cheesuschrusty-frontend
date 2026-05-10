/* eslint-disable @typescript-eslint/no-explicit-any */
export type LessonType = "READING" | "LISTENING" | "SPEAKING" | "WRITING";
// type Skill = "READING" | "LISTENING" | "SPEAKING" | "WRITING" | "GRAMMAR";
// type Level = "B1" | "B1c";
// type Provider = "GROK" | "OPENAPI"


export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  level: number;
  score?: number;
  data?: any;
  success?: boolean;
  message?: string;
  // add other fields returned by your backend
}

export interface GetNextLessonRequest {
  type: string;
  level: string;
  domain?: string;
  task_id?: string;
}

// export type GetNextLessonResponse = Lesson;

export interface ResponseData {
    id: number;
    task_id: string;
    skill: string
    provider: string;
    domain: string;
    level: string;
    difficulty: string;
    variant_count: number;
    section_total: number;
    task_time: number;
    native_language: string;
    test_mode: string;
    lesson_title: string;
    isPublished: boolean;
    createdAt: string;
    target_language: string;
  };


export interface GetNextLessonResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ResponseData
}


// export interface GetNextLessonResponse {
//   id: number;
//   title: string;
//   type: string;
//   content: string;
//   difficulty: string;
//   estimatedDuration: number;
// }

export interface CompleteLessonRequest {
  durationSeconds: number;
  accuracy: number;
  xpEarned: number;
}

export interface CompleteLessonResponse {
  success: boolean;
  message: string;
  xpTotal: number;
  lessonCompleted: boolean;
  nextLessonAvailable: boolean;
}