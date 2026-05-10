/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useSearchParams } from 'react-router-dom';
import { useMemo, useEffect } from 'react';
import { useEvaluateReadingPerformanceMutation } from '@/redux/features/lesson/readingAI/readingPerformanceApi';
import { useEvaluateListeningPerformanceMutation } from '@/redux/features/lesson/listeningAi/listeningAiApi';
import { useEvaluateWritingPerformanceMutation } from '@/redux/features/lesson/writingAi/writingPerformanceApi';
import { useSpeakingPerformanceMutation } from '@/redux/features/lesson/speakingAi/speakingAiApi';
import { useGetLessonQuestionSetQuery } from '@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi';
import { getPercentage } from '../utils/scoreUtils';
// import type { AnswerReviewItem, NormalizedFeedback } from '../types';
import { JSX } from 'react';
import { normalizePerformanceData } from '@/utils/performanceUtils';

export interface ScoreInfo {
  color: string;
  icon: JSX.Element;
  message: string;
  badge: string;
  subMessage: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  text: string;
}

export interface AnswerReviewItem {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface NormalizedScore {
  title: string;
  value: string;
  status: string;
}

export interface NormalizedSection {
  title: string;
  points: string[];
}

export interface NormalizedCEFRProfile {
  title: string;
  details: Record<string, string>;
}

export interface NormalizedReadiness {
  title: string;
  message: string;
  percentage: string;
}

export interface NormalizedPowerTip {
  title: string;
  explanation: string;
  example?: string;
}

export interface NormalizedMotivationalClose {
  title: string;
  message?: string | { target_language?: string };
  target_language?: string;
  translation?: string;
  primary_language?: string;
}

export interface NormalizedHeader {
  level?: string;
  target_language?: string;
  skill?: string;
}

export interface NormalizedFeedback {
  header: NormalizedHeader;
  score: NormalizedScore;
  cefr_profile: NormalizedCEFRProfile;
  strengths: NormalizedSection;
  improvements: NormalizedSection;
  readiness: NormalizedReadiness | null;
  power_tip: NormalizedPowerTip | null;
  motivational_close: NormalizedMotivationalClose | null;
}


export interface UsePerformanceDataReturn {
  // Loading & Error states
  isLoading: boolean;
  isError: boolean;
  errorData: any;
  
  // Raw data
  data: any;
  content: any;
  
  // Normalized data
  normalizedData: NormalizedFeedback | null;
  percentage: number;
  
  // Student data
  studentAnswers: Record<string, string>;
  totalQuestions: number;
  correctCount: number;
  
  // Derived data
  tips: string[];
  answerReviewData: AnswerReviewItem[];
  config: {
    title: string;
    subtitle: string;
    backLink: string;
  };
}

const PRACTICE_CONFIG: Record<string, { title: string; subtitle: string; backLink: string }> = {
  reading: {
    title: "Reading Practice",
    subtitle: "Improve your Italian reading comprehension",
    backLink: "/user/practice/reading"
  },
  listening: {
    title: "Listening Practice",
    subtitle: "Enhance your Italian listening skills",
    backLink: "/user/practice/listening"
  },
  writing: {
    title: "Writing Practice",
    subtitle: "Sharpen your Italian writing preparation",
    backLink: "/user/practice/writing"
  },
  speaking: {
    title: "Speaking Practice",
    subtitle: "Master your Italian pronunciation and fluency",
    backLink: "/user/practice/speaking"
  }
};

export default function usePerformanceData(): UsePerformanceDataReturn {
  // =================== URL PARAMS ===================
  const { lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const rawAnswers = searchParams.get("ans");

  const practiceType = (type || "reading").toLowerCase();
  const config = PRACTICE_CONFIG[practiceType] || PRACTICE_CONFIG.reading;


  // Memoize studentAnswers to prevent recreation on every render
  const studentAnswers = useMemo(() => {
    return rawAnswers
      ? Object.fromEntries(
          decodeURIComponent(rawAnswers)
            .split(",")
            .map(pair => {
              const [seq, value] = pair.split(":");
              return [seq, value || ""];
            })
        )
      : {};
  }, [rawAnswers]);

  // =================== API HOOKS ===================
  // 1. Reading
  const [evaluateReading, { isLoading: isReadingLoading, data: readingData }] = useEvaluateReadingPerformanceMutation();
  
  // 2. Listening
  const [evaluateListening, { isLoading: isListeningLoading, data: listeningData }] = useEvaluateListeningPerformanceMutation();

  // 3. Writing
  const [evaluateWriting, { isLoading: isWritingLoading, data: writingData }] = useEvaluateWritingPerformanceMutation();

  // 4. Speaking
  const [evaluateSpeaking, { isLoading: isSpeakingLoading, data: speakingData }] = useSpeakingPerformanceMutation();


  const { 
    data: lessonQuestionSetData,
    isLoading: isLessonLoading,
    isError: lessonError,
    error: lessonErrorData
  } = useGetLessonQuestionSetQuery({ lessonId: Number(lessonId) });

  const content = lessonQuestionSetData?.data?.content;

  // Trigger evaluation when content is ready
  useEffect(() => {
    let ignore = false;
    
    if (!ignore && content) {
      const payload = { 
        ...content, 
        student_answers: { ...studentAnswers } 
      };

      let promise: any = null;

      switch(practiceType) {
        case 'reading':
          if (!readingData && !isReadingLoading) promise = evaluateReading(payload);
          break;
        case 'listening': 
          if (!listeningData && !isListeningLoading) promise = evaluateListening(payload);
          break;
        case 'writing':
          if (!writingData && !isWritingLoading) promise = evaluateWriting(payload);
          break;
        case 'speaking':
           if (!speakingData && !isSpeakingLoading) promise = evaluateSpeaking(payload);
           break;
        default:
          console.warn("Unknown practice type:", practiceType);
      }

      if (promise && typeof promise.unwrap === 'function') {
        promise.unwrap()
          .then((result: any) => console.log(`${practiceType} Evaluation Result:`, result))
          .catch((error: any) => console.error(`${practiceType} Evaluation Failed:`, error));
      }
    }
    
    return () => { ignore = true; };
  }, [lessonQuestionSetData, practiceType, studentAnswers]); // eslint-disable-line react-hooks/exhaustive-deps

  // Helper to get correct data based on type
  const data = useMemo(() => {
     switch(practiceType) {
        case 'reading': return readingData;
        case 'listening': return listeningData;
        case 'writing': return writingData;
        case 'speaking': return speakingData;
        default: return readingData; 
     }
  }, [practiceType, readingData, listeningData, writingData, speakingData]);

  // =================== NORMALIZED DATA ===================
  const normalizedData = useMemo(() => normalizePerformanceData(data), [data]);

  const percentage = useMemo(() => {
    const val = normalizedData?.score?.value;
    if (!val) return 0;

    if (String(val).includes("/")) {
      return getPercentage(String(val));
    }
    
    if (String(val).includes("%")) {
      return parseInt(String(val).replace("%", ""), 10) || 0;
    }

    return Number(val) || 0;
  }, [normalizedData]);

  // =================== DERIVED VALUES ===================
  const totalQuestions = Object.keys(studentAnswers).length;
  const correctCount = Math.round((percentage / 100) * totalQuestions);

  const tips = useMemo(() => {
    if (normalizedData?.improvements?.points) {
      return normalizedData.improvements.points;
    }
    return [];
  }, [normalizedData]);

  const answerReviewData = useMemo((): AnswerReviewItem[] => {
    if (!content || !content.questions) return [];
    
    return content.questions.map((q: any, index: number) => {
      const userAnswerKey = studentAnswers[q.id] || studentAnswers[index + 1] || "";
      return {
        question: q.text || "Question " + (index + 1),
        userAnswer: userAnswerKey,
        correctAnswer: q.correct_answer || "N/A",
        isCorrect: false,
        explanation: q.explanation || ""
      };
    });
  }, [content, studentAnswers]);

  // =================== COMBINED STATES ===================
  const isLoading = isLessonLoading || isReadingLoading || isListeningLoading || isWritingLoading || isSpeakingLoading;
  const isError = lessonError;

  return {
    isLoading,
    isError,
    errorData: lessonErrorData,
    data,
    content,
    normalizedData,
    percentage,
    studentAnswers,
    totalQuestions,
    correctCount,
    tips,
    answerReviewData,
    config
  };
}
