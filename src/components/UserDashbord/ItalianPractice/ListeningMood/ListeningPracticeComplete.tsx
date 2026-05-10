/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { CheckCircle, RefreshCw, Star, TrendingUp, Award, Target, Brain, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCompleteLessonMutation } from '@/redux/features/lesson/lessonPractice/lessonPracticeApi';
import { toast } from 'react-hot-toast';

 

interface ExercisePerformance {
  name: string;
  score: number;
  total: number;
  percentage: number;
}

interface ListeningPracticeCompleteProps {
  exercises: ExercisePerformance[];
  evaluationResult?: any;
  lessonId?: number|string|null;
  onRetry: () => void;
  onContinue: () => void;
 }

const ListeningPracticeComplete: React.FC<ListeningPracticeCompleteProps> = ({ 
  exercises, 
  evaluationResult,
  lessonId,
   

  
 }) => {
  console.log(evaluationResult);
  const navigate = useNavigate();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [completeLesson] = useCompleteLessonMutation();

  // Color scheme for listening
  const colors = {
    primary: 'from-purple-400 to-pink-500',
    secondary: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/10'
  };

  // Helper to get data from either nested or root level
  const getApiData = () => {
    if (!evaluationResult) return null;
    // Check if data is at root level (direct API response)
    if (evaluationResult.score_summary || evaluationResult.exercise_performance) {
      return evaluationResult;
    }
    // Otherwise check nested in data
    return evaluationResult.data || null;
  };

  const apiData = getApiData();

  // Get score from API response score_summary or fallback
  const getScoreFromAPI = () => {
    const scoreSummary = apiData?.score_summary || evaluationResult?.data?.score_summary;
    
    if (scoreSummary?.accuracy_rate) {
      // Extract number from "22%" format
      const accuracyStr = scoreSummary.accuracy_rate.replace('%', '');
      return parseInt(accuracyStr, 10);
    }
    
    if (evaluationResult?.score_percentage !== undefined) return evaluationResult.score_percentage;
    if (evaluationResult?.data?.score_percentage !== undefined) return evaluationResult.data.score_percentage;
    if (evaluationResult?.overall_stats?.accuracy !== undefined) return evaluationResult.overall_stats.accuracy;

    // Fallback to exercises calculation
    const totalScoreCalc = exercises.reduce((sum, ex) => sum + ex.score, 0);
    const totalPossibleCalc = exercises.reduce((sum, ex) => sum + ex.total, 0);
    return totalPossibleCalc > 0 ? Math.round((totalScoreCalc / totalPossibleCalc) * 100) : 0;
  };

  const actualScore = getScoreFromAPI();

  const getScoreInfo = () => {
    const currentScore = actualScore;
    const scoreSummary = apiData?.score_summary || evaluationResult?.data?.score_summary;
    const overallMessage = scoreSummary?.overall_message;

    if (overallMessage) {
      let badge = 'Beginner';
      let icon = <CheckCircle className="w-8 h-8" />;
      let color = 'text-gray-500 dark:text-gray-400';
      
      if (currentScore >= 90) {
        badge = 'Master';
        icon = <Award className="w-8 h-8" />;
        color = 'text-yellow-500 dark:text-yellow-400';
      } else if (currentScore >= 80) {
        badge = 'Expert';
        icon = <Star className="w-8 h-8" />;
        color = 'text-green-500 dark:text-green-400';
      } else if (currentScore >= 70) {
        badge = 'Advanced';
        icon = <TrendingUp className="w-8 h-8" />;
        color = 'text-blue-500 dark:text-blue-400';
      } else if (currentScore >= 60) {
        badge = 'Intermediate';
        icon = <Target className="w-8 h-8" />;
        color = 'text-orange-500 dark:text-orange-400';
      }

      return {
        message: overallMessage,
        icon: icon,
        subMessage: 'Keep practicing to improve!',
        color: color,
        badge: badge
      };
    }

    if (currentScore >= 90) {
      return {
        message: 'Outstanding! Your listening skills are exceptional! 🏆',
        icon: <Award className="w-8 h-8" />,
        subMessage: 'You\'ve mastered this level!',
        color: 'text-yellow-500 dark:text-yellow-400',
        badge: 'Master'
      };
    } else if (currentScore >= 80) {
      return {
        message: 'Excellent! Your listening comprehension is amazing! ✨',
        icon: <Star className="w-8 h-8" />,
        subMessage: 'Keep up the great work!',
        color: 'text-green-500 dark:text-green-400',
        badge: 'Expert'
      };
    } else if (currentScore >= 70) {
      return {
        message: 'Great job! You\'re making good progress! 📈',
        icon: <TrendingUp className="w-8 h-8" />,
        subMessage: 'You\'re on the right track!',
        color: 'text-blue-500 dark:text-blue-400',
        badge: 'Advanced'
      };
    } else if (currentScore >= 60) {
      return {
        message: 'Good effort! Keep practicing to improve. 💪',
        icon: <Target className="w-8 h-8" />,
        subMessage: 'You\'re getting there!',
        color: 'text-orange-500 dark:text-orange-400',
        badge: 'Intermediate'
      };
    } else {
      return {
        message: 'Keep practicing! You\'ll get better with time. 🌱',
        icon: <CheckCircle className="w-8 h-8" />,
        subMessage: 'Every practice session counts!',
        color: 'text-gray-500 dark:text-gray-400',
        badge: 'Beginner'
      };
    }
  };

  const scoreInfo = getScoreInfo();

  // Get data from API response or fallback
  const fbCard = evaluationResult?.feedback || evaluationResult?.feedback_card || apiData?.feedback_card || evaluationResult?.data?.feedback_card;

  const getCorrectCount = () => {
    const scoreSummary = apiData?.score_summary || evaluationResult?.data?.score_summary;
    if (scoreSummary?.correct_count !== undefined) return scoreSummary.correct_count;
    if (evaluationResult?.correct !== undefined) return evaluationResult.correct;
    return exercises.reduce((sum, ex) => sum + ex.score, 0);
  };

  const getTotalQuestions = () => {
    const scoreSummary = apiData?.score_summary || evaluationResult?.data?.score_summary;
    if (scoreSummary?.total_questions !== undefined) return scoreSummary.total_questions;
    if (evaluationResult?.total_questions !== undefined) return evaluationResult.total_questions;
    if (evaluationResult?.overall_stats?.total_questions !== undefined) return evaluationResult.overall_stats.total_questions;
    return exercises.reduce((sum, ex) => sum + ex.total, 0);
  };

  const correctCount = getCorrectCount();
  const totalQuestions = getTotalQuestions();

  // Calculate XP earned
  const getXPEarned = () => {
    const scoreSummary = apiData?.score_summary || evaluationResult?.data?.score_summary;
    if (scoreSummary?.xp_earned) {
      return scoreSummary.xp_earned;
    }
    if (evaluationResult?.xp_point || evaluationResult?.data?.xp_point) {
      return (evaluationResult.xp_point || evaluationResult.data.xp_point).toString();
    }
    return Math.max(20, correctCount * 10).toString();
  };

  const xpEarned = getXPEarned();

  // Get merged exercise performance data
  const getMergedExercisePerformance = () => {
    const exerciseNameMap: Record<string, string> = {
      'AUDIO_COMPREHENSION': 'Audio Comprehension',
      'DICTATION_EXERCISE': 'Dictation Exercise',
      'DIALOGUE_SEQUENCING': 'Dialogue Sequencing'
    };
    
    // Start with API data if available
    const apiExercises = apiData?.exercise_performance || [];
    const exerciseMap = new Map<string, any>();
    
    // Add API exercises to map
    apiExercises.forEach((exercise: any) => {
      exerciseMap.set(exercise.category, exercise);
    });
    
    // Add missing exercises from props
    exercises.forEach(ex => {
      const displayName = exerciseNameMap[ex.name] || ex.name;
      if (!exerciseMap.has(displayName)) {
        exerciseMap.set(displayName, {
          category: displayName,
          score: `${ex.percentage}%`
        });
      }
    });
    
    return Array.from(exerciseMap.values());
  };

  const mergedExercisePerformance = getMergedExercisePerformance();

  // Get answer review data from API if available
  const answerReviewData = evaluationResult?.detailed && evaluationResult.detailed.length > 0
    ? evaluationResult.detailed.map((item: any) => ({
        question: item.question,
        userAnswer: item.user_answer,
        correctAnswer: item.correct_answer,
        isCorrect: item.is_correct,
        explanation: item.explain
      }))
    : (evaluationResult?.lesson?.[0]?.user_answers ? evaluationResult.lesson[0].user_answers.map((ans: string, i: number) => ({
        question: evaluationResult.lesson[0].questions[i],
        userAnswer: ans,
        correctAnswer: evaluationResult.lesson[0].correct_answers[i],
        isCorrect: ans === evaluationResult.lesson[0].correct_answers[i]
      })) : []);

  // Helper function to ensure positive numbers
  const ensurePositiveNumber = (value: any, fallback: number = 1): number => {
    let num = 0;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^0-9.]/g, '');
      num = parseFloat(cleaned);
    } else {
      num = Number(value);
    }
    return isNaN(num) || num <= 0 ? fallback : Math.max(1, Math.floor(num));
  };

  // Calculate total time
  const calculateTotalTime = () => {
    if (evaluationResult?.duration_seconds || evaluationResult?.data?.duration_seconds) {
      return Math.floor((evaluationResult.duration_seconds || evaluationResult.data.duration_seconds) / 60);
    }
    return 5; // Default 5 minutes
  };

  const totalMinutes = calculateTotalTime();

  // Get improvement tips from AI evaluation or fallback
  const getImprovementTips = (): string[] => {
    const apiAreas = apiData?.areas_for_improvement || evaluationResult?.areas_for_improvement || evaluationResult?.data?.areas_for_improvement;
    if (apiAreas && apiAreas.length > 0) {
      return apiAreas.map((area: any) => typeof area === 'string' ? area : area.issue || area.category);
    }

    return [
      'Watch Italian movies with subtitles',
      'Listen to Italian podcasts daily',
      'Practice transcribing short audio clips',
      'Focus on understanding main ideas first',
      'Practice predicting content before listening',
      'Use transcripts to improve comprehension'
    ];
  };

  const tips = getImprovementTips();

  const handleSave = async () => {
    if (!lessonId) {
      toast.error('Lesson ID is required');
      return;
    }

    if (isSaved) {
      navigate("/user/practice");
      return;
    }

    try {
      setIsSaving(true);
      const scoreSummary = apiData?.score_summary || evaluationResult?.data?.score_summary;
      
      const durationSeconds = ensurePositiveNumber(
        evaluationResult?.duration_seconds || evaluationResult?.data?.duration_seconds || 0,
        1
      );
      
      const accuracyValue = scoreSummary?.accuracy_rate 
        ? ensurePositiveNumber(scoreSummary.accuracy_rate, 1) 
        : ensurePositiveNumber(actualScore, 1);
      
      const xpEarnedValue = ensurePositiveNumber(xpEarned, 1);

      const payload = {
        id: typeof lessonId === 'string' ? parseInt(lessonId) : lessonId,
        durationSeconds: durationSeconds,
        accuracy: accuracyValue,
        xpEarned: xpEarnedValue
      };

      await completeLesson(payload as any).unwrap();
      setIsSaved(true);
      toast.success('Results saved successfully! 🎉');
      
      setTimeout(() => {
        navigate("/user/practice");
      }, 1500);
      
    } catch (error: any) {
      console.error('Failed to save results:', error);
      let errorMessage = 'Failed to save results. Please try again.';
      if (error?.data?.message) {
        errorMessage = Array.isArray(error.data.message) ? error.data.message.join(', ') : error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  console.log(apiData) 

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div className={`bg-gradient-to-r ${colors.primary} py-6 px-8 text-center`}>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                    <div className={`${scoreInfo.color} transform scale-125`}>
                      {scoreInfo.icon}
                    </div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎉</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Listening Practice Complete!
            </h1>
            <p className="text-white/90 text-lg">
              {scoreInfo.message}
            </p>
          </div>

          <div className="p-6 md:p-8">
            {/* AI Evaluation Badge */}
            {evaluationResult && (
              <div className="flex justify-center mb-6">
                <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                  evaluationResult.success 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                }`}>
                  <Brain className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {evaluationResult.success ? 'AI Evaluation Complete' : 'Using Calculated Scores'}
                  </span>
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center gap-3 mb-4">
                <div className={`px-4 py-2 ${colors.secondary} rounded-full`}>
                  <span className={`text-sm font-semibold ${colors.text}`}>
                    {scoreInfo.badge} Level
                  </span>
                </div>
                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {totalQuestions} Exercises Completed
                  </span>
                </div>
              </div>
                
              <div className="mb-6">
                <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                  {apiData?.score_summary?.accuracy_rate || `${actualScore}%`}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-lg">
                  Final Score
                </div>
              </div>

              <div className="max-w-2xl mx-auto mb-8">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${colors.primary} transition-all duration-2000 ease-out`}
                    style={{ width: `${actualScore}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {scoreInfo.subMessage}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 text-center border border-green-100 dark:border-green-800">
                <div className="text-3xl font-bold text-gray-900 dark:text-green-100 mb-1">
                  {apiData?.score_summary?.xp_earned || xpEarned}
                </div>
                <div className="text-sm text-gray-600 dark:text-green-200">XP Earned</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 text-center border border-blue-100 dark:border-blue-800">
                <div className="text-3xl font-bold text-gray-900 dark:text-blue-100 mb-1">{totalMinutes}</div>
                <div className="text-sm text-gray-600 dark:text-blue-200">Time Spent</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 text-center border border-purple-100 dark:border-purple-800">
                <div className="text-3xl font-bold text-gray-900 dark:text-purple-100 mb-1">
                  {apiData?.score_summary?.correct_count !== undefined 
                    ? `${apiData.score_summary.correct_count}/${apiData.score_summary.total_questions}`
                    : `${correctCount}/${totalQuestions}`
                  }
                </div>
                <div className="text-sm text-gray-600 dark:text-purple-200">
                  {apiData?.score_summary?.correct_count !== undefined 
                    ? 'Correct Answers'
                    : 'Exercises Completed'
                  }
                </div>
              </div>
            </div>

            {/* AI Evaluation Feedback */}
            {evaluationResult && (
              <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 md:p-8 border border-blue-100 dark:border-gray-700 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                    <Brain className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      AI Deep Analysis
                    </h3>
                    <p className="text-sm opacity-60">Personalized feedback from our Italian Expert AI</p>
                  </div>
                </div>
                
                {fbCard ? (
                  <div className="space-y-8">
                    {/* Title & Score Card */}
                    {(fbCard.submission_score || fbCard.score) && (
                       <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-blue-100 dark:border-gray-700 shadow-sm">
                          <div className="flex-1">
                            <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-1">{fbCard.title}</h4>
                            <p className="text-sm text-gray-500">{fbCard.submission_score?.heading || fbCard.score?.heading}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="text-4xl font-black text-blue-600 block leading-none">
                                {fbCard.submission_score?.score || fbCard.score?.value}
                              </span>
                              <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mt-1">
                                {fbCard.submission_score?.status || fbCard.score?.status}
                              </p>
                            </div>
                            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
                            {(fbCard.cefr_profile?.scores?.overall || fbCard.cefr_profile?.metrics?.overall) && (
                              <div className="text-center">
                                <span className="text-2xl font-bold text-purple-600 block">
                                  {String(fbCard.cefr_profile?.scores?.overall || fbCard.cefr_profile?.metrics?.overall).replace(/[[\]]/g, '')}
                                </span>
                                <p className="text-[10px] font-black uppercase text-purple-400 tracking-tighter">CEFR</p>
                              </div>
                            )}
                          </div>
                       </div>
                    )}

                    {/* CEFR Detailed Metrics */}
                    {(fbCard.cefr_profile?.scores || fbCard.cefr_profile?.metrics) && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                         {Object.entries(fbCard.cefr_profile?.scores || fbCard.cefr_profile?.metrics || {}).map(([key, val]: [string, any]) => {
                           if (key.toLowerCase() === 'overall') return null;
                           return (
                            <div key={key} className="p-4 bg-white dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700 text-center shadow-sm">
                              <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">{key}</p>
                              <p className="text-xl font-bold text-purple-600">{val}</p>
                            </div>
                           );
                         })}
                      </div>
                    )}

                    {/* Strengths & Success Points */}
                    {fbCard.strengths && fbCard.strengths.points && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <TrendingUp className="w-5 h-5" />
                          <h4 className="font-bold uppercase tracking-widest text-xs">{fbCard.strengths.heading}</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {fbCard.strengths.points.map((p: any, i: number) => (
                            <div key={i} className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm relative overflow-hidden group">
                               <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                               <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-2">{p.point}</p>
                               <p className="text-xs text-emerald-700/70 dark:text-emerald-400/60 leading-relaxed"><span className="font-black uppercase text-[9px] opacity-40 mr-2">Evidence</span> {p.evidence}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Targeted Improvements */}
                    {fbCard.improvements && fbCard.improvements.points && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                          <RefreshCw className="w-5 h-5" />
                          <h4 className="font-bold uppercase tracking-widest text-xs">{fbCard.improvements.heading}</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {fbCard.improvements.points.map((p: any, i: number) => (
                            <div key={i} className="bg-indigo-50/50 dark:bg-indigo-900/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex flex-col group">
                               <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4 flex-1">{p.point}</p>
                               <div className="p-3 bg-white dark:bg-gray-800 rounded-xl text-[11px] border border-indigo-100 dark:border-indigo-700/50 shadow-inner italic leading-relaxed text-indigo-700 dark:text-indigo-300">
                                 <span className="font-black uppercase text-[9px] opacity-40 block mb-1 not-italic tracking-widest">Growth Example</span> 
                                 {p.example}
                               </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 5-Minute Power Tip */}
                    {fbCard.power_tip && (
                      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-lg">
                              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                            </div>
                            <h4 className="font-black uppercase tracking-widest text-sm">{fbCard.power_tip.heading}</h4>
                          </div>
                          <p className="text-lg font-medium mb-6 leading-relaxed block">{fbCard.power_tip.explanation}</p>
                          <div className="p-4 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10">
                             <p className="text-xs uppercase font-black tracking-widest opacity-40 mb-2">Try this now</p>
                             <p className="text-sm italic opacity-90 leading-relaxed font-serif">"{fbCard.power_tip.example}"</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Success Motivation */}
                    {fbCard.motivational_close && fbCard.motivational_close.message && (
                       <div className="text-center py-6 border-t border-gray-100 dark:border-gray-700 mt-8">
                          <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500 mb-2">
                            {fbCard.motivational_close.flag} {fbCard.motivational_close.message.includes(' / ') ? fbCard.motivational_close.message.split(' / ')[0] : fbCard.motivational_close.message}
                          </p>
                          {fbCard.motivational_close.message.includes(' / ') && (
                            <p className="text-xs font-bold opacity-30 uppercase tracking-widest">{fbCard.motivational_close.message.split(' / ')[1]}</p>
                          )}
                       </div>
                    )}
                  </div>
                ) : (
                  /* Original fallback logic */
                  <div className="space-y-4">
                    {(evaluationResult.data?.feedback || evaluationResult.message || evaluationResult.feedback) && (
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <p className="text-gray-700 dark:text-gray-300">
                          {evaluationResult.data?.feedback || evaluationResult.message || evaluationResult.feedback}
                        </p>
                      </div>
                    )}
                    
                    {(evaluationResult.data?.areas_for_improvement || evaluationResult.areas_for_improvement) && (evaluationResult.data?.areas_for_improvement || evaluationResult.areas_for_improvement).length > 0 && (
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                           <Target className="w-5 h-5 text-orange-500" />
                           Path to Mastery:
                        </h4>
                        <ul className="space-y-3">
                          {(evaluationResult.data?.areas_for_improvement || evaluationResult.areas_for_improvement).map((area: string, index: number) => (
                            <li key={index} className="flex items-start gap-3">
                               <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-orange-600 dark:text-orange-400 text-xs font-bold">{index + 1}</span>
                               </div>
                               <span className="text-sm text-gray-700 dark:text-gray-300">{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Exercise Performance */}
            {mergedExercisePerformance.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Exercise Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mergedExercisePerformance.map((exercise, index) => {
                    const scoreValue = typeof exercise.score === 'string' 
                      ? parseInt(exercise.score.replace('%', ''), 10) || 0
                      : exercise.score;
                    return (
                      <div key={index} className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-gray-100">{exercise.category || exercise.name}</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {typeof exercise.score === 'string' && exercise.score.includes('%') ? exercise.score : `${exercise.score}%`}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${scoreValue}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Performance Review (Answer Review) */}
            {answerReviewData.length > 0 && (
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6 px-1">
                   <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                    Detailed Performance Review
                  </h3>
                </div>
                <div className="space-y-5">
                  {answerReviewData.map((answer: any, index: number) => (
                    <div 
                      key={index}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        answer.isCorrect
                          ? 'border-emerald-100 bg-emerald-50/20 dark:bg-emerald-900/5 dark:border-emerald-900/30'
                          : 'border-rose-100 bg-rose-50/20 dark:bg-rose-900/5 dark:border-rose-900/30'
                      }`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black ${
                           answer.isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                            {answer.question}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-14">
                        <div className={`p-4 rounded-xl border-2 ${answer.isCorrect ? 'bg-white/50 border-emerald-100' : 'bg-white/50 border-rose-100'} dark:bg-gray-800/50`}>
                           <span className="text-[9px] font-black uppercase tracking-widest opacity-40 block mb-2">My Answer</span>
                           <p className={`font-bold ${answer.isCorrect ? 'text-emerald-700' : 'text-rose-700'} dark:text-white`}>
                             {answer.userAnswer || 'No answer'}
                           </p>
                        </div>
                        {!answer.isCorrect && (
                          <div className="p-4 rounded-xl border-2 bg-white/50 border-emerald-100 dark:bg-gray-800/50">
                             <span className="text-[9px] font-black uppercase tracking-widest opacity-40 block mb-2">Correct Match</span>
                             <p className="font-bold text-emerald-700 dark:text-emerald-400">
                               {answer.correctAnswer}
                             </p>
                          </div>
                        )}
                      </div>

                      {answer.explanation && (
                        <div className="mt-4 ml-14 p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                             <span className="not-italic font-black text-[10px] uppercase tracking-tighter mr-2 opacity-30">AI Insight:</span>
                             "{answer.explanation}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Tips for Improvement
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tips.map((tip: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 dark:text-blue-400 text-sm">✓</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Try New Lesson Button - At the Bottom */}
            <div className="flex justify-center mt-8 mb-8">
              <button
                onClick={handleSave}
                disabled={isSaving || !lessonId}
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg shadow-xl shadow-blue-500/20 active:scale-95"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving Progress...
                  </>
                ) : (
                  <>
                    Save & Finish Practice
                    <RefreshCw className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            What's Next?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="font-medium text-blue-800 dark:text-blue-300 mb-2">Review Mistakes</div>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Go back and review the exercises you found challenging
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
              <div className="font-medium text-green-800 dark:text-green-300 mb-2">Try Another Skill</div>
              <p className="text-sm text-green-700 dark:text-green-400">
                Practice speaking, reading, or writing to improve all-around
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
              <div className="font-medium text-purple-800 dark:text-purple-300 mb-2">Set Daily Goal</div>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                Aim for 20 minutes of practice daily to see consistent improvement
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeningPracticeComplete;











// import React from 'react';
// import { ChevronLeft, Check, TrendingUp,    } from 'lucide-react';
// import { IoCheckmarkDoneSharp } from "react-icons/io5";

// import { useNavigate } from 'react-router-dom';
// import think from "../../../../assets/Dashbord/think.svg"
// import exericse from "../../../../assets/Dashbord/exercise.svg"
// import { ProgressBar } from '@/components/ProgressBar/ProgressBar';
// interface ExercisePerformance {
//   name: string;
//   score: number;
//   maxScore: number;
//   percentage: number;
// }

// interface RecommendedPractice {
//   text: string;
// }

// interface AreaForImprovement {
//   title: string;
//   description: string;
//   practices: RecommendedPractice[];
// }

// interface StudyPlanItem {
//   id: number;
//   text: string;
// }

// const ListeningPracticeComplete: React.FC = () => {
//   const navigate = useNavigate();

//   const exercisePerformance: ExercisePerformance[] = [
//     { name: 'Audio Comprehension', score: 8, maxScore: 10, percentage: 80 },
//     { name: 'Dictation Exercise', score: 6, maxScore: 10, percentage: 60 },
//     { name: 'Dialogue Sequencing', score: 8, maxScore: 10, percentage: 80 }
//   ];

//   const areasForImprovement: AreaForImprovement[] = [
//     {
//       title: 'Audio Comprehension',
//       description: 'Difficulty understanding quick details',
//       practices: [
//         { text: 'Practice predicting content before listening' },
//         { text: 'Practice predicting content before listening' },
//         { text: 'Practice predicting content before listening' },
//         { text: 'Practice predicting content before listening' }
//       ]
//     },
//     {
//       title: 'Dictation Exercise',
//       description: 'Difficulty understanding quick details',
//       practices: [
//         { text: 'Practice predicting content before listening' },
//         { text: 'Practice predicting content before listening' },
//         { text: 'Practice predicting content before listening' },
//         { text: 'Practice predicting content before listening' }
//       ]
//     },
//     {
//       title: 'Dialogue Sequencing',
//       description: 'Difficulty understanding quick details',
//       practices: [
//         { text: 'Practice predicting content before listening' },
//         { text: 'Practice predicting content before listening' },
//         { text: 'Practice predicting content before listening' },
//         { text: 'Practice predicting content before listening' }
//       ]
//     }
//   ];

//   const studyPlan: StudyPlanItem[] = [
//     { id: 1, text: 'Begin with very basic Italian audio content' },
//     { id: 2, text: 'Begin with very basic Italian audio content' },
//     { id: 3, text: 'Begin with very basic Italian audio content' },
//     { id: 4, text: 'Begin with very basic Italian audio content' }
//   ];

//   return (
//     <div className="min-h-screen   p-6">
//       <div className="  mx-auto">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate("/user/practice")}
//           className="flex border p-3 cursor-pointer rounded-2xl items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
//         >
//           <ChevronLeft className="w-6 h-6" />
//           <span className="text-base font-semibold">Back To Practice</span>
//         </button>

//         {/* Success Icon and Title */}
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-6 mt-6">
//             <div className="w-30 h-30 bg-[#4BAE4F] rounded-full flex items-center justify-center">
//               <Check className="w-20 h-20 text-white" strokeWidth={3} />

//               {/* <img src={serchimg} alt="" /> */}
//             </div>
//           </div>
//           <h1 className="text-4xl font-bold  text-[#3C424E] mb-2">Listening Practice Complete!</h1>
//           <p className="text-base text-[#999CA2]">You earned 10 points and 15 seconds streak!</p>
//         </div>

//         {/* Stats Cards */}
//         <div className='max-w-7xl mx-auto'>
//           <div className="grid  grid-cols-3 gap-4 mb-8">
//             <div className="bg-[#4BAE4F1A] border border-[#EBEBEB] rounded-lg p-6 text-center">
//               <div className="text-3xl font-bold text-gray-900 mb-1">10</div>
//               <div className="text-sm text-gray-600">Earned Points</div>
//             </div>
//             <div className="bg-[#F7F9FF] border border-[#EBEBEB] rounded-lg p-6 text-center">
//               <div className="text-3xl font-bold text-gray-900 mb-1">75%</div>
//               <div className="text-sm text-gray-600">Accuracy Rate</div>
//             </div>
//             <div className="bg-[#E7EFFF] border border-[#EBEBEB]  rounded-lg p-6 text-center">
//               <div className="text-3xl font-bold text-gray-900 mb-1">30+</div>
//               <div className="text-sm text-gray-600">XP Earned</div>
//             </div>
//           </div>
//         </div>

//         {/* Performance Analysis */}
//         <div className="bg-yellow-50 mt-12 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
//           <div className="flex items-center gap-2">
//             <TrendingUp className="w-5 h-5 text-yellow-700" />
//             <span className="font-semibold text-yellow-900">Performance Analysis - <span className='text-[#667EEA]'> Needs Improvement</span></span>
//           </div>
//         </div>

//         <p className="text-sm mt-10 bg-[#EBEBEB] py-6 px-4 rounded-2xl text-gray-700 mb-6">
//           Don't worry! Listening is often the most challenging skill. With targeted practice, you'll see rapid improvement.
//         </p>

//         {/* Exercise Performance */}
//         <div className="mb-8">
//           <div className="flex items-center gap-2 mb-4">
//             {/* <Target className="w-5 h-5 text-gray-700" /> */}
//             <img className='w-6 h-6' src={exericse} alt="" />
//             <h2 className="text-lg font-bold text-gray-900">Exercise Performance</h2>
//           </div>
 
//           <div className="grid grid-cols-3 gap-4">
//             {exercisePerformance.map((exercise, index) => (
//               <div key={index} className="  rounded-lg p-4 border border-gray-200">
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="text-base font-medium text-[#585858]">{exercise.name}</span>
//                   <span className="text-sm font-semibold text-[#696D77]">{exercise.percentage}%</span>
//                 </div>

//                 {/* Use your ProgressBar component here */}
//                 <ProgressBar
//                   progress={exercise.percentage}          // Or use current/maxScore instead
//                   height="h-3"
//                   color="bg-gray-900"
//                   rounded="rounded-full"
//                   showPercentage={false}                 // Already showing % on top
//                   className="w-full"
//                 />
//               </div>
//             ))}
//           </div>

//         </div>

//         {/* Areas for Improvement */}
//         <div className="mb-8 mt-10">
//           <div className='flex items-center gap-2'>
//             <img className='w-6 h-6' src={think} alt="" />
//             <h2 className="text-2xl font-bold text-[#333]  ">Areas for Improvement</h2>
//           </div>

//           <div className="grid grid-cols-3 mt-5 gap-4">
//             {areasForImprovement.map((area, index) => (
//               <div key={index} className="bg-white text-[#585858] rounded-lg p-4 border border-gray-200">
//                 <h3 className="font-semibold text-xl  mb-1">{area.title}</h3>
//                 <p className="text-sm  text-[#7E7E7E] mb-3">{area.description}</p> 
//                 <div className="border-t border-gray-200 pt-3">
//                   <h4 className="text-base font-semibold   text-[#585858] mb-2">Recommended Practice:</h4>
//                   <ul className="space-y-1.5">
//                     {area.practices.map((practice, idx) => (
//                       <li key={idx} className="flex items-start gap-2 text-sm  ">
//                         <IoCheckmarkDoneSharp className="w-4 h-4  text-[#0E9F6E] flex-shrink-0 mt-0.5" />
//                         <span>{practice.text}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Personalized Study Plan */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">📚 Personalized Study Plan</h2>
//           <p className="text-base text-[#7E7E7E] mb-4">
//             Based on your performance, here's what we recommend for your next study sessions:
//           </p>

//           <div className="grid grid-cols-2 gap-4">
//             {studyPlan.map((item) => (
//               <div key={item.id} className="bg-[#0E9F6E1A] rounded-lg p-4 flex items-start gap-3 ">
//                 <div className="w-8 h-8 bg-[#0E9F6E] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"> 
//                   {item.id}
//                 </div>
//                 <p className="text-sm text-gray-800 pt-1">{item.text}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-center gap-4">
//           <button className="px-6 cursor-pointer py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
//             <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M12 2v20M2 12h20" />
//             </svg>
//             Practice Again
//           </button>
//           <button className="px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
//             <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
//               <path d="M8 5v14l11-7z" />
//             </svg>
//             Next Listening Practice
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ListeningPracticeComplete;