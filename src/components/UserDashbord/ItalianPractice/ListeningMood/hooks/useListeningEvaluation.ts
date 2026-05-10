/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo } from 'react';
import { useEvaluateListeningPerformanceMutation } from '@/redux/features/lesson/listeningAi/listeningAiApi';
import { EvaluationResponse, EvaluationPayload, Question, PHASES, Phase } from '../types';
import { isAnswerCorrect } from '../utils';

interface UseListeningEvaluationParams {
  questions: Question[];
  answers: Record<number, string>;
  script: any;
  teacherPack: any;
  onPhaseChange: (p: Phase) => void;
}

export function useListeningEvaluation({
  questions,
  answers,
  script,
  teacherPack,
  onPhaseChange
}: UseListeningEvaluationParams) {
  const [evaluatePerformance] = useEvaluateListeningPerformanceMutation();
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResponse | null>(null);

  const calculateScore = useMemo(() => {
    const correctCount = questions.filter(q => {
      const answersArr = (teacherPack as any)?.key?.answers || (teacherPack as any)?.KEY || (teacherPack as any)?.answer_key?.KEY || [];
      const teacherAnswer = Array.isArray(answersArr) 
        ? answersArr.find((item: any) => item.question_id === q.id || item.Question === q.english_question)
        : null;
      const teacherAnswerText = teacherAnswer?.correct || teacherAnswer?.Answer || "";
      return isAnswerCorrect(q, teacherAnswerText);
    }).length;

    const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    return { correctCount, total: questions.length, accuracy };
  }, [questions, teacherPack]);

  const callEvaluationAPI = useCallback(async () => {
    onPhaseChange(PHASES.EVALUATING);
    
    const { correctCount, accuracy } = calculateScore;
    const scriptStr = Array.isArray(script) 
      ? script.map((s: any) => s.script || s).join('\n') 
      : (script || "");

    const payload: EvaluationPayload = {
      lesson: [{
        type: "reading-comprehension",
        passage: scriptStr,
        questions: questions.map(q => q.english_question),
        user_answers: questions.map(q => answers[q.id] || "Not answered"),
        correct_answers: questions.map(q => {
          const answersArr = (teacherPack as any)?.key?.answers || (teacherPack as any)?.KEY || (teacherPack as any)?.answer_key?.KEY || [];
          const k = Array.isArray(answersArr) 
            ? answersArr.find((item: any) => item.question_id === q.id || item.Question === q.english_question)
            : null;
          return k?.correct || k?.Answer || "Unknown";
        }),
        score: correctCount,
        accuracy_rate: accuracy,
        feedback: `You scored ${accuracy}% on this exercise.`,
        detailed_feedback: { strengths: [], improvements: [], specific_errors: [] }
      }],
      overall_stats: { total_score: correctCount, accuracy },
      performance_status: accuracy >= 70 ? "pass" : "fail",
      feedback_message: `You scored ${accuracy}% on this listening exercise.`,
      exercise_breakdown: {}
    };

    try {
      const result = await evaluatePerformance(payload as any).unwrap();
      setEvaluationResult(result as any);
      onPhaseChange(PHASES.COMPLETE);
    } catch (err) {
      console.error("[useListeningEvaluation] Evaluation failed:", err);
      setEvaluationResult({
        success: false,
        data: { feedback: "Evaluation failed. Fallback score used.", score: accuracy, areas_for_improvement: [], score_percentage: accuracy, correct: correctCount }
      } as any);
      onPhaseChange(PHASES.COMPLETE);
    }
  }, [calculateScore, questions, answers, script, teacherPack, evaluatePerformance, onPhaseChange]);

  return {
    evaluationResult,
    calculateScore,
    callEvaluationAPI,
    setEvaluationResult,
  };
}
