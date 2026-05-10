/* eslint-disable @typescript-eslint/no-explicit-any */
export enum LessonType {
  READING = 'READING',
  WRITING = 'WRITING',
  LISTENING = 'LISTENING',
  SPEAKING = 'SPEAKING',
  GRAMMAR = 'GRAMMAR',

}

export interface Lesson {
  id: string; // or number, consistent across app
  title: string;
  type: LessonType;
  provider: AIProvider;
  status?: string;
  createdAt?: string;
}


export enum AIProvider {
  OPEN_AI = 'OPENAI',
  GROK = 'GROK'
}

export interface DeleteConfirmationState {
  isOpen: boolean;
  lessonId: string | null;
  lessonTitle: string;
}

export interface ApiConfig {
  endpoint: string;
  fieldName: string;
}

export interface GeneratedContent {
  [key: string]: any;
}

// Helper functions for domains and task IDs
export const getDomains = (): string[] => {
  return [
    'Auto',
    'Health (SSN/Hospital)',
    'Education (School/Training)',
    'Work (Contracts/Safety)',
    'Housing (Rent/Condominium)',
    'Bureaucracy (City Hall/Post Office)',
    'Daily Commerce (Supermarket/Services)',

  ];
};

export const getTaskIds = (lessonType: LessonType): string[] => {
  switch (lessonType) {
    case LessonType.READING:
      return ['R-01', 'R-02'];
    case LessonType.LISTENING:
      return ['L-01', 'L-02'];
    case LessonType.WRITING:
      return ['W-01', 'W-02'];
    case LessonType.SPEAKING:
      return ['S-01', 'S-02'];
    default:
      return [];
  }
};

export const getSkillName = (lessonType: LessonType): string => {
  return lessonType.toLowerCase();
};