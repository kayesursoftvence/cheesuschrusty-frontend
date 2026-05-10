/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useLazyGetNextLessonQuery } from "@/redux/features/lesson/lessonPractice/lessonPracticeApi";
import { useLazyGetLessonQuestionSetQuery } from "@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi";
import { useEvaluateReadingPerformanceMutation } from '@/redux/features/lesson/readingAI/readingPerformanceApi';
import { processReadingData } from '../utils';
import { ReadingQuestion, EvaluationPayload, EvaluationResponse } from '../types';

export const useReadingSession = (stateLessonId: string | null) => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const lastPath = pathname.split('/').pop();
  const urlLevel = searchParams.get('level');

  // Consolidated State
  const [sessionState, setSessionState] = useState({
    lessonId: stateLessonId ? Number(stateLessonId) : null as number | null,
    loading: true,
    error: null as string | null,
    currentQuestionIndex: 0,
    selectedAnswer: null as string | null,
    answers: {} as Record<number, string>,
    isComplete: false,
    evaluationResult: null as EvaluationResponse | null,
    showTranslation: false,
    showHint: false,
    italianPassage: "",
    englishPassage: "",
    questions: [] as ReadingQuestion[],
    readingData: null as any,
  });

  // API Hooks
  const [getNextLesson] = useLazyGetNextLessonQuery();
  const [getQuestionSet] = useLazyGetLessonQuestionSetQuery();
  const [evaluatePerformance, { isLoading: isEvaluating, 
                              // error: evaluationError 
                            }] = useEvaluateReadingPerformanceMutation();

  // Initialization logic
  const initSession = useCallback(async () => {
    // If we don't have a lessonId from state or URL, we need to fetch the next lesson
    let activeLessonId = sessionState.lessonId;

    try {
      if (!activeLessonId) {
        if (!urlLevel || !lastPath) {
          throw new Error("Language level is required to start a lesson.");
        }

        const lessonResult = await getNextLesson({  type: lastPath.toUpperCase() as any,
                                                   level: urlLevel.toUpperCase() as any  }).unwrap();

        if (!lessonResult?.success || !lessonResult.data) {
          throw new Error("Failed to fetch reading lesson");
        }
        activeLessonId = lessonResult.data.id;
      }

      const questionSetResult = await getQuestionSet({ lessonId: Number(activeLessonId) }).unwrap();
      
      if (!questionSetResult?.success || !questionSetResult.data) {
        throw new Error("Failed to load questions");
      }

      console.log(questionSetResult)
      const processed = processReadingData(questionSetResult);
      if (!processed) {
        throw new Error("Failed to process question set");
      }
      console.log(questionSetResult)

      setSessionState(prev => ({
        ...prev,
        lessonId: activeLessonId,
        italianPassage: processed.italianPassage,
        englishPassage: processed.englishPassage,
        questions: questionSetResult?.data?.content?.student_handout.questions,
        readingData: processed.readingData,
        loading: false,
      }));

    } catch (err: any) {
      setSessionState(prev => ({
        ...prev,
        loading: false,
        error: err.message || "Failed to initialize lesson"
      }));
    }
  }, [sessionState.lessonId, urlLevel, lastPath, getNextLesson, getQuestionSet]);

  useEffect(() => {
    initSession();
  }, [initSession]);

  // Handlers
  const handleAnswerSelect = useCallback((answerLetter: string) => {
    setSessionState(prev => ({ ...prev, selectedAnswer: answerLetter }));
  }, []);

  const handleNext = useCallback(async () => {
    const { questions, currentQuestionIndex, selectedAnswer, answers, showTranslation, englishPassage, italianPassage } = sessionState;
    const currentQuestion = questions[currentQuestionIndex];
    if (!selectedAnswer || !currentQuestion) return;

    const updatedAnswers = { ...answers, [currentQuestion.id]: selectedAnswer };
    
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setSessionState(prev => ({
        ...prev,
        answers: updatedAnswers,
        currentQuestionIndex: nextIndex,
        selectedAnswer: updatedAnswers[questions[nextIndex].id] || null,
        showHint: false
      }));
    } else {
      // Final question - evaluate
      const totalQuestions = questions.length;
      const correctAnswersCount = questions.filter(q => updatedAnswers[q.id] === q.correctAnswer).length;
      const accuracyRate = Math.round((correctAnswersCount / totalQuestions) * 100);

      const performanceData: EvaluationPayload = {
        lesson: [
          {
            type: "reading-comprehension",
            passage: showTranslation ? englishPassage : italianPassage,
            questions: questions.map(q => q.question),
            user_answers: questions.map(q => updatedAnswers[q.id] || ""),
            correct_answers: questions.map(q => q.correctAnswer),
            score: accuracyRate,
            accuracy_rate: accuracyRate,
            feedback: `Scored ${accuracyRate}%`,
          }
        ],
        overall_stats: {
          total_score: accuracyRate,
          accuracy: accuracyRate,
        },
        performance_status: accuracyRate >= 70 ? "pass" : "fail",
        feedback_message: `Practice completed with ${accuracyRate}% accuracy.`,
        exercise_breakdown: {},
      };

      try {
        setSessionState(prev => ({ ...prev, loading: true }));
        const result = await evaluatePerformance(performanceData as any).unwrap();
        setSessionState(prev => ({
          ...prev,
          answers: updatedAnswers,
          evaluationResult: result as any,
          isComplete: true,
          loading: false
        }));
      } catch (err) {
        console.error("Evaluation failed:", err);
        setSessionState(prev => ({
          ...prev,
          answers: updatedAnswers,
          isComplete: true,
          loading: false
        }));
      }
    }
  }, [sessionState, evaluatePerformance]);

  const handlePrevious = useCallback(() => {
    const { currentQuestionIndex, answers, questions } = sessionState;
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setSessionState(prev => ({
        ...prev,
        currentQuestionIndex: prevIndex,
        selectedAnswer: answers[questions[prevIndex].id] || null,
        showHint: false
      }));
    }
  }, [sessionState]);

  const handleRetry = useCallback(async () => {
    setSessionState(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      answers: {},
      isComplete: false,
      evaluationResult: null,
      showTranslation: false,
      showHint: false,
      loading: true
    }));
    await initSession();
  }, [initSession]);

  const setShowTranslation = useCallback((val: boolean) => {
    setSessionState(prev => ({ ...prev, showTranslation: val }));
  }, []);

  const setShowHint = useCallback((val: boolean) => {
    setSessionState(prev => ({ ...prev, showHint: val }));
  }, []);

  return {
    state: {
      ...sessionState,
      loading: sessionState.loading || isEvaluating
    },
    actions: {
      setShowTranslation,
      setShowHint,
      handleAnswerSelect,
      handleNext,
      handlePrevious,
      handleRetry
    }
  };
};
