import { useSearchParams, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { useGetNextLessonQuery } from '@/redux/features/lesson/lessonPractice/lessonPracticeApi';
import { useGetLessonQuestionSetQuery } from '@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi';
import normalizeListeningTask from '../utils/normalizeResponse';
import type { ListeningTaskUIModel } from '../utils/normalizeResponse';

type LessonType = 'READING' | 'WRITING' | 'LISTENING' | 'SPEAKING';
type LessonLevel = 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2';

export interface UseListeningPracticeDataReturn {
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  nextLessonId: number | undefined;
  data?: ListeningTaskUIModel;
  // rawData?: any;
  // teacherPack?: any;
  // script?: any;
}

export default function useListeningPracticeData(): UseListeningPracticeDataReturn {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  const lastPath = pathname.split('/').pop() || '';
  const urlLevel = searchParams.get('level') || '';

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
    isError: isLessonQuestionSetError,
  } = useGetLessonQuestionSetQuery(
    { lessonId: Number(nextLessonId) },
    { skip: !nextLessonId }
  );
  console.log(lessonQuestionSetData)

  const normalizedData = useMemo(() => {
    return lessonQuestionSetData ? normalizeListeningTask(lessonQuestionSetData) : undefined;
  }, [lessonQuestionSetData]);

  // const rawData = lessonQuestionSetData?.data;
  // const rawContent = rawData?.content;
  
  // const teacherPack = useMemo(() => {
  //   if (!rawContent) return undefined;
  //   return rawContent.teacher_pack || 
  //          rawContent.PART_1_TEACHER_PACK || 
  //          rawContent['PART 1: TEACHER_PACK (SECURE)'];
  // }, [rawContent]);

  // const script = useMemo(() => {
  //   if (!teacherPack) return undefined;
  //   return (teacherPack as any).content?.dialogues || 
  //          (teacherPack as any).content || 
  //          (teacherPack as any).SCRIPT || 
  //          (teacherPack as any)['CONTENT/SCRIPT'];
  // }, [teacherPack]);

  return {
    isLoading: isNextLessonsLoading || isLessonQuestionSetLoading,
    isError: isNextLessonsError || isLessonQuestionSetError,
    refetch,
    nextLessonId,
    data: normalizedData,
    // rawData,
    // teacherPack,
    // script,
  };
}

