/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { CheckCircle, RefreshCw, Star, TrendingUp, Award, Target, Brain, Loader2 } from 'lucide-react';
import { useCompleteLessonMutation } from '@/redux/features/lesson/lessonPractice/lessonPracticeApi';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
 
interface CompletionPageProps {
  score: number;
  evaluationResult?: any;
  lessonId?: string | null;
  onPracticeAgain: () => void;
  onBackToPractice: () => void;
  exerciseResults?: any;
  totalExercises?: number;
  durationSeconds?: number;
}


const CompletionPage: React.FC<CompletionPageProps> = ({
  score,
  evaluationResult,
  lessonId,
  durationSeconds = 0
  //  onBackToPractice
}) => {
  console.log(score)
  console.log(evaluationResult)
  console.log(lessonId)
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [completeLesson] = useCompleteLessonMutation();
  const navigate = useNavigate();

  // Color scheme for speaking
  const colors = {
    primary: 'from-blue-400 to-purple-500',
    secondary: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/10'
  };

  // Get data from API response or fallback to props
  const fbCard = evaluationResult?.feedback || evaluationResult?.feedback_card || evaluationResult?.data?.feedback_card;
const Finalscore = evaluationResult?.score_percentage || evaluationResult?.data?.score_percentage || fbCard?.submission_score?.score || fbCard?.score?.value || 0;
 const final_score = Finalscore.slice(0, 2) || 0;
  // Calculate XP earned
  const calculateXPEarned = () => {
    if (evaluationResult?.xp_point || evaluationResult?.data?.xp_point) {
      return evaluationResult.xp_point || evaluationResult.data.xp_point;
    }
    return Math.max(20, Math.floor(score * 0.3));
  };

  const xpEarned = calculateXPEarned();

  // Calculate total time
  const calculateTotalTime = () => {
    if (durationSeconds > 0) return durationSeconds;
    if (evaluationResult?.duration_seconds || evaluationResult?.data?.duration_seconds) {
      return evaluationResult.duration_seconds || evaluationResult.data.duration_seconds;
    }
    return 300;
  };

  const totalSeconds = calculateTotalTime();
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  const totalExercisesCount = evaluationResult?.data?.correct || evaluationResult?.correct || 3;

  // Get speaking-specific stats from AI evaluation
  const getSpeakingStats = () => {
    const stats = evaluationResult?.data?.overall_stats || evaluationResult?.overall_stats || {};
    // Also try to get from fbCard if present
    const cefrProfile = fbCard?.cefr_profile;
    const cefrMetrics = cefrProfile?.scores || cefrProfile?.metrics || {};
     const score = fbCard?.submission_score?.score || fbCard?.score?.value || 0;
     console.log(stats)
     console.log(cefrProfile)
     console.log(cefrMetrics)
     console.log(score)
    return {
      pronunciation: stats.pronunciation_score || cefrMetrics.Pronunciation || cefrMetrics.pronunciation || 0,
      fluency: stats.fluency_score || cefrMetrics.Fluency || cefrMetrics.fluency || 0,
      accuracy: stats.accuracy_score || cefrMetrics.Accuracy || cefrMetrics.accuracy || cefrMetrics.overall || 0,
      completeness: stats.completeness_score || cefrMetrics.Completeness || cefrMetrics.completeness || 0,
      total: stats.total_score || score
    };
  };
  
  const speakingStats = getSpeakingStats();
  console.log(speakingStats.total)

  const getScoreInfo = () => {
    if (score >= 90) {
      return {
        message: 'Outstanding! Your speaking skills are exceptional! 🏆',
        icon: <Award className="w-8 h-8" />,
        subMessage: 'You\'ve mastered this level!',
        color: 'text-yellow-500 dark:text-yellow-400',
        badge: 'Master'
      };
    } else if (score >= 80) {
      return {
        message: 'Excellent! Your pronunciation is amazing! ✨',
        icon: <Star className="w-8 h-8" />,
        subMessage: 'Keep up the great work!',
        color: 'text-green-500 dark:text-green-400',
        badge: 'Expert'
      };
    } else if (score >= 70) {
      return {
        message: 'Great job! You\'re making good progress! 📈',
        icon: <TrendingUp className="w-8 h-8" />,
        subMessage: 'You\'re on the right track!',
        color: 'text-blue-500 dark:text-blue-400',
        badge: 'Advanced'
      };
    } else if (score >= 60) {
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

  // Get improvement tips from AI evaluation or fallback
  const getImprovementTips = () => {
    if ((evaluationResult?.areas_for_improvement || evaluationResult?.data?.areas_for_improvement) && 
        (evaluationResult.areas_for_improvement || evaluationResult?.data?.areas_for_improvement).length > 0) {
      return evaluationResult.areas_for_improvement || evaluationResult.data.areas_for_improvement;
    }

    return [
      'Record yourself speaking and listen back',
      'Practice with native Italian speakers',
      'Focus on difficult sounds and intonation',
      'Shadow Italian audio with a slight delay',
      'Practice daily for 15-20 minutes',
      'Work on your pronunciation accuracy'
    ];
  };

  const tips = getImprovementTips();

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

  const handleSave = async () => {
    if (!lessonId) {
      toast.error('Lesson ID is required');
      return;
    }

    if (isSaved) {
      // If already saved, just navigate
      navigate("/user/practice");
      return;
    }

    try {
      setIsSaving(true);

      // Extract data from evaluation result or use defaults
      const durationSecondsValue = ensurePositiveNumber(
        durationSeconds ||
        evaluationResult?.duration_seconds || 
        evaluationResult?.data?.duration_seconds || 
        300,
        1
      );
      
      const accuracy = ensurePositiveNumber(
        evaluationResult?.score_percentage ||
        evaluationResult?.data?.score_percentage ||
        score,
        1
      );
      
      const xpEarnedValue = ensurePositiveNumber(
        evaluationResult?.xp_point ||
        evaluationResult?.data?.xp_point ||
        xpEarned,
        1
      );

      // Prepare the payload according to API
      const payload = {
        id: lessonId,
        durationSeconds: Math.floor(durationSecondsValue),
        accuracy: Math.floor(accuracy),
        xpEarned: Math.floor(xpEarnedValue)
      };

      // Make the API call
      await completeLesson(payload as any).unwrap();
      
      setIsSaved(true);
      
      // Show success toast
      toast.success('Results saved successfully! 🎉');
      
      // Navigate to practice page after showing toast (1.5 second delay)
      setTimeout(() => {
        navigate("/user/practice");
      }, 1500);
      
    } catch (error: any) {
      console.error('Failed to save results:', error);
      
      let errorMessage = 'Failed to save results. Please try again.';
      
      if (error?.status === 400) {
        if (error?.data?.message) {
          if (Array.isArray(error.data.message)) {
            errorMessage = error.data.message.join(', ');
          } else {
            errorMessage = error.data.message;
          }
        }
      } else if (error?.status === 401) {
        errorMessage = 'Please login to save your progress';
      } else if (error?.status === 404) {
        errorMessage = 'Lesson not found';
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Show error toast (don't navigate on error)
      toast.error(errorMessage);
      
    } finally {
      setIsSaving(false);
    }
  };
console.log(colors)
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
              Speaking Practice Complete!
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
                    {totalExercisesCount} Exercises Completed
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                  {final_score}%
                  {/* {evaluationResult?.feedback_card?.score.value.slice(0, 2) || 0}% */}
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
                    style={{ width: `${final_score}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {scoreInfo.subMessage}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 text-center border border-green-100 dark:border-green-800">
                <div className="text-3xl font-bold text-gray-900 dark:text-green-100 mb-1">{xpEarned}</div>
                <div className="text-sm text-gray-600 dark:text-green-200">XP Earned</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 text-center border border-blue-100 dark:border-blue-800">
                <div className="text-3xl font-bold text-gray-900 dark:text-blue-100 mb-1">{formatTime(totalSeconds)}</div>
                <div className="text-sm text-gray-600 dark:text-blue-200">Time Spent</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 text-center border border-purple-100 dark:border-purple-800">
                <div className="text-3xl font-bold text-gray-900 dark:text-purple-100 mb-1">{totalExercisesCount}</div>
                <div className="text-sm text-gray-600 dark:text-purple-200">Exercises Completed</div>
              </div>
            </div>

            {/* AI Evaluation Feedback - PREMIUM CARD */}
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

                      {/* Readiness Stats Breakdown */}
                      {fbCard.readiness && (
                         <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-2xl border border-green-100 dark:border-green-900/30">
                            <div className="flex items-center justify-between mb-2">
                               <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                 <Award className="w-5 h-5 text-yellow-500" />
                                 {fbCard.readiness.heading}
                               </h4>
                               <span className="text-2xl font-black text-green-600">{fbCard.readiness.percentage}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{fbCard.readiness.message}</p>
                         </div>
                      )}

                      {/* Speaking-Specific Stats Breakdown (Fallback) */}
                      {!fbCard.readiness && (speakingStats.pronunciation > 0 || speakingStats.fluency > 0 || speakingStats.accuracy > 0) && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {speakingStats.pronunciation > 0 && (
                             <div className="p-4 bg-white dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700 text-center shadow-sm">
                               <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">PRONUNCIATION</p>
                               <p className="text-xl font-bold text-blue-600">{speakingStats.pronunciation}%</p>
                             </div>
                          )}
                          {speakingStats.fluency > 0 && (
                             <div className="p-4 bg-white dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700 text-center shadow-sm">
                               <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">FLUENCY</p>
                               <p className="text-xl font-bold text-green-600">{speakingStats.fluency}%</p>
                             </div>
                          )}
                          {speakingStats.accuracy > 0 && (
                             <div className="p-4 bg-white dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700 text-center shadow-sm">
                               <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">ACCURACY</p>
                               <p className="text-xl font-bold text-purple-600">{speakingStats.accuracy}%</p>
                             </div>
                          )}
                          {speakingStats.completeness > 0 && (
                             <div className="p-4 bg-white dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700 text-center shadow-sm">
                               <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">COMPLETION</p>
                               <p className="text-xl font-bold text-orange-600">{speakingStats.completeness}%</p>
                             </div>
                          )}
                        </div>
                      )}

                      {/* Strengths & Improvements */}
                      {fbCard.strengths && fbCard.strengths.points && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="w-5 h-5" />
                            <h4 className="font-bold uppercase tracking-widest text-xs">{fbCard.strengths.heading}</h4>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            {fbCard.strengths.points.map((p: any, i: number) => (
                              <div key={i} className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm relative overflow-hidden">
                                 <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                                 <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-2">{p.explanation || p.point}</p>
                                 <p className="text-xs text-emerald-700/70 dark:text-emerald-400/60 leading-relaxed"><span className="font-black uppercase text-[9px] opacity-40 mr-2">Evidence</span> {p.evidence}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {fbCard.improvements && fbCard.improvements.points && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                             <RefreshCw className="w-5 h-5" />
                            <h4 className="font-bold uppercase tracking-widest text-xs">{fbCard.improvements.heading}</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fbCard.improvements.points.map((p: any, i: number) => (
                              <div key={i} className="bg-indigo-50/50 dark:bg-indigo-900/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex flex-col group">
                                 <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4 flex-1">{p.explanation || p.point}</p>
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
                      {fbCard.motivational_close && (
                         <div className="text-center py-6 border-t border-gray-100 dark:border-gray-700 mt-8">
                            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500 mb-2">
                              {fbCard?.motivational_close?.flag} {fbCard?.motivational_close?.message?.split(' / ')[0]}
                            </p>
                            {fbCard?.motivational_close?.translation ? (
                              <p className="text-xs font-bold opacity-30 uppercase tracking-widest">{fbCard.motivational_close.translation}</p>
                            ) : (
                              <p className="text-xs font-bold opacity-30 uppercase tracking-widest">{fbCard?.motivational_close?.message?.split(' / ')[1]}</p>
                            )}
                         </div>
                      )}
                    </div>
                 ) : (
                   /* Original fallback logic */
                   <div className="space-y-4">
                     {(evaluationResult?.data?.feedback || evaluationResult?.message) && (
                       <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                         <p className="text-gray-700 dark:text-gray-300">
                           {evaluationResult?.data?.feedback || evaluationResult?.message}
                         </p>
                       </div>
                     )}
                     
                     {evaluationResult?.data?.areas_for_improvement && evaluationResult?.data?.areas_for_improvement?.length > 0 && (
                       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                         <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-orange-500" />
                            Path to Mastery:
                         </h4>
                         <ul className="space-y-3">
                           {evaluationResult?.data?.areas_for_improvement?.map((area: string, index: number) => (
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
                Practice writing, reading, or listening to improve all-around
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

export default CompletionPage;