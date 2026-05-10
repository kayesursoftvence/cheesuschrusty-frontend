/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearchParams, useLocation } from 'react-router-dom';
import { useGetNextLessonQuery } from '@/redux/features/lesson/lessonPractice/lessonPracticeApi';
import { useGetLessonQuestionSetQuery } from '@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi';

type LessonType = 'READING' | 'WRITING' | 'LISTENING' | 'SPEAKING';
type LessonLevel = 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2';

export interface UseReadingPracticeDataReturn {
  // Loading and Error states
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;

  // Lesson IDs
  nextLessonId: number | undefined;

  // Content data
  content: any;
  topic: string | undefined;
  instructions: string;
  questions: any[] | undefined;
  teacherPackContent: any;
}

/**
 * Custom hook to fetch and manage reading practice data.
 * Encapsulates common logic for:
 * - URL parameter parsing (level, lesson type from path)
 * - Fetching next lesson
 * - Fetching lesson question set
 * - Extracting common content fields
 */
export function useReadingPracticeData(): UseReadingPracticeDataReturn {
  // =================== URL PARSING ===================
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  const lastPath = pathname.split('/').pop() || '';
  const urlLevel = searchParams.get('level') || '';

  // =================== DATA FETCHING ===================
  const {
    data: nextLessonsData,
    isLoading: isNextLessonsLoading,
    isError: isNextLessonsError,
    refetch,
  } = useGetNextLessonQuery({
    type: lastPath.toUpperCase() as LessonType,
    level: urlLevel.toLowerCase() as LessonLevel,
  });

  const nextLessonId = nextLessonsData?.data?.id;

  const {
    data: lessonQuestionSetData,
    isLoading: isLessonQuestionSetLoading,
    isError: lessonQuestionSetError,
  } = useGetLessonQuestionSetQuery(
    { lessonId: Number(nextLessonId) },
    { skip: !nextLessonId }
  );

  // =================== DERIVED STATE ===================
  const content = lessonQuestionSetData?.data?.content;
  const topic = content?.header?.topic;
  const instructions = content?.student_handout?.instructions ?? '';
  const questions = content?.student_handout?.questions;
  const teacherPackContent = content?.teacher_pack?.content;

  // =================== COMBINED STATES ===================
  const isLoading = isNextLessonsLoading || isLessonQuestionSetLoading;
  const isError = isNextLessonsError || lessonQuestionSetError;

  return {
    isLoading,
    isError,
    refetch,
    nextLessonId,
    content,
    topic,
    instructions,
    questions,
    teacherPackContent,
  };
}
