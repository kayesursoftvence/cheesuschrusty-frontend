/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { CheckCircle, RefreshCw, Star, TrendingUp, Award, Target,  Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
 import { toast } from 'react-hot-toast';
import { useCompleteLessonMutation } from '@/redux/features/lesson/lessonPractice/lessonPracticeApi';


interface FeedbackCard {
  title?: string;
  score?: {
    value: string;
    heading: string;
    status: string;
  };
  cefr_profile?: {
    heading?: string;
    overall?: string;
    comprehension?: string;
    accuracy?: string;
    range?: string;
    metrics?: { // Legacy support
      overall?: string;
      grammar?: string;
      vocabulary?: string;
      coherence?: string;
      [key: string]: any;
    };
  };
  strengths?: {
    heading: string;
    content?: Array<{
      point: string;
      evidence: string;
    }>;
    points?: Array<{ // Legacy support
      point: string;
      evidence: string;
    }>;
  };
  improvements?: {
    heading: string;
    content?: Array<{
      point: string;
      example: string;
    }>;
    points?: Array<{ // Legacy support
      point: string;
      example: string;
    }>;
  };
  readiness?: {
    heading: string;
    value: string;
    message: string;
  };
  power_tip?: {
    heading: string;
    explanation: string;
    example: string;
  };
  motivational_close?: {
    heading?: string;
    message: string;
    translation?: string;
    flag: string;
  };
  [key: string]: any;
}


interface ExerciseResult {
  exerciseType: string;
  score: number;
  completed: boolean;
}

interface AnswerReview {
  question: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  explanation: string;
}

interface ExercisePerformance {
  category: string;
  score: string;
}

interface AreaForImprovement {
  category: string;
  issue: string;
  recommendations: string[];
}

interface PerformanceAnalysis {
  level: string;
  message: string;
}

interface PersonalizedStudyPlan {
  step_number: number;
  recommendation: string;
}

interface EvaluationResult {
  success?: boolean;
  data?: {
    feedback?: any;
    score?: number;
    areas_for_improvement?: string[] | AreaForImprovement[];
    detailed_feedback?: Record<string, any>;
    duration_seconds?: number;
    xp_point?: number;
    score_percentage?: number;
    correct?: number;
    score_summary?: {
      correct_count: number;
      total_questions: number;
      accuracy_rate: string;
      xp_earned: string;
      overall_message: string;
    };
    answer_review?: AnswerReview[];
    exercise_performance?: ExercisePerformance[];
    performance_analysis?: PerformanceAnalysis;
    personalized_study_plan?: PersonalizedStudyPlan[];
    feedback_card?: FeedbackCard;
  };
  message?: string;
  feedback?: any;
  score_summary?: {
    correct_count: number;
    total_questions: number;
    accuracy_rate: string;
    xp_earned: string;
    overall_message: string;
  };
  answer_review?: AnswerReview[];
  exercise_performance?: ExercisePerformance[];
  performance_analysis?: PerformanceAnalysis;
  areas_for_improvement?: AreaForImprovement[];
  personalized_study_plan?: PersonalizedStudyPlan[];
  feedback_card?: any;
}

// Also update the CompletionPageProps interface
interface CompletionPageProps {
  score: number;
  onPracticeAgain?: () => void;
  onBackToPractice: () => void;
  practiceType?: 'speaking' | 'writing' | 'reading' | 'listening';
  exerciseResults?: ExerciseResult[];
  totalExercises?: number;
  evaluationResult?: EvaluationResult | null;
  lessonId?: string | null;
  feedback_card?: any; // Update this type
  durationSeconds?: number; // Duration in seconds to display
}

 

const CompletionPage: React.FC<CompletionPageProps> = ({
  score,
  practiceType = 'writing',
  exerciseResults = [],
  totalExercises = 3,
  evaluationResult = null,
  lessonId = null,
  durationSeconds = 0
}) => {
  
  // Define formatTime function internally
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  console.log(evaluationResult);
  console.log(score);
  console.log(practiceType);
  console.log(exerciseResults);
  console.log(totalExercises);
  console.log(lessonId);
  const navigate = useNavigate();
  const [completeLesson] = useCompleteLessonMutation();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const getColorScheme = () => {
    switch (practiceType) {
      case 'speaking':
        return {
          primary: 'from-blue-400 to-purple-500',
          secondary: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-50 dark:bg-blue-900/10'
        };
      case 'writing':
        return {
          primary: 'from-green-400 to-emerald-500',
          secondary: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-600 dark:text-green-400',
          bg: 'bg-green-50 dark:bg-green-900/10'
        };
      case 'reading':
        return {
          primary: 'from-orange-400 to-red-500',
          secondary: 'bg-orange-100 dark:bg-orange-900/30',
          text: 'text-orange-600 dark:text-orange-400',
          bg: 'bg-orange-50 dark:bg-orange-900/10'
        };
      case 'listening':
        return {
          primary: 'from-purple-400 to-pink-500',
          secondary: 'bg-purple-100 dark:bg-purple-900/30',
          text: 'text-purple-600 dark:text-purple-400',
          bg: 'bg-purple-50 dark:bg-purple-900/10'
        };
      default:
        return {
          primary: 'from-blue-400 to-green-500',
          secondary: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-50 dark:bg-blue-900/10'
        };
    }
  };

  // Helper to get data from either nested or root level
  const getApiData = () => {
    if (!evaluationResult) return null;
    // Check if data is at root level (direct API response)
    if (evaluationResult.score_summary || evaluationResult.exercise_performance || evaluationResult.feedback) {
      return evaluationResult;
    }
    // Otherwise check nested in data
    return evaluationResult.data || null;
  };

  const apiData = getApiData();
console.log(apiData)
   // Calculate average from exerciseResults
  const calculateAverageFromExercises = () => {
    if (!exerciseResults || exerciseResults.length === 0) return null;
    const completed = exerciseResults.filter(r => r.completed);
    if (completed.length === 0) return null;
    const total = completed.reduce((sum, r) => sum + r.score, 0);
    return Math.round(total / completed.length);
  };

  // Get score from API response score_summary or fallback to calculated average
  const getScoreFromAPI = () => {
    const scoreSummary = apiData?.score_summary || evaluationResult?.data?.score_summary;
    const calculatedAverage = calculateAverageFromExercises();
    
    if (scoreSummary?.accuracy_rate) {
      // Extract number from "22%" format
      const accuracyStr = scoreSummary.accuracy_rate.replace('%', '');
      const apiScore = parseInt(accuracyStr, 10);
      
      // If API score is 0% but we have exercises with scores > 0%, use calculated average
      if (apiScore === 0 && calculatedAverage !== null && calculatedAverage > 0) {
        return calculatedAverage;
      }
      
      // Otherwise use API score
      return apiScore;
    }
    
    // Fallback to calculated average or prop score
    return calculatedAverage !== null ? calculatedAverage : score;
  };

  const actualScore = getScoreFromAPI();

  const colors = getColorScheme();

  // Get data from API response or fallback to props
  const fbCard = evaluationResult?.feedback || apiData?.feedback || evaluationResult?.feedback_card || (evaluationResult as any)?.data?.feedback_card;
  console.log(fbCard)
  const fbCardScore = fbCard?.score?.value.slice(0, 2) || 0;

  // const apiMetrics = fbCard?.cefr_profile?.metrics || {};

  // Get merged exercise performance data (combine API data with exerciseResults)
  const getMergedExercisePerformance = (): ExercisePerformance[] => {
    const exerciseNameMap: Record<string, string> = {
      'GRAMMAR_PRACTICE': 'Grammar Practice',
      'COMPLETE_THE_SENTENCES': 'Sentence Completion',
      'SHORT_ESSAY': 'Short Essay'
    };
    
    // Start with API data if available
    const apiExercises = apiData?.exercise_performance || [];
    const exerciseMap = new Map<string, ExercisePerformance>();
    
    // Add API exercises to map
    apiExercises.forEach(exercise => {
      exerciseMap.set(exercise.category, exercise);
    });
    
    // Add missing exercises from exerciseResults
    exerciseResults.forEach(result => {
      const displayName = exerciseNameMap[result.exerciseType] || result.exerciseType;
      if (!exerciseMap.has(displayName)) {
        exerciseMap.set(displayName, {
          category: displayName,
          score: `${result.score}%`
        });
      } else {
        // Update score from exerciseResults if it's more accurate
        const existing = exerciseMap.get(displayName)!;
        if (!existing.score || existing.score === '0%') {
          exerciseMap.set(displayName, {
            category: displayName,
            score: `${result.score}%`
          });
        }
      }
    });
    
    const orderedExercises: ExercisePerformance[] = [];
    const order = ['Grammar Practice', 'Sentence Completion', 'Short Essay'];
    
    order.forEach(name => {
      const exercise = exerciseMap.get(name);
      if (exercise) orderedExercises.push(exercise);
    });
    
    exerciseMap.forEach((exercise, name) => {
      if (!order.includes(name)) orderedExercises.push(exercise);
    });
    
    return orderedExercises;
  };

  const mergedExercisePerformance = getMergedExercisePerformance();

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
        message: `Outstanding! Your ${practiceType} skills are exceptional! 🏆`,
        icon: <Award className="w-8 h-8" />,
        subMessage: 'You\'ve mastered this level!',
        color: 'text-yellow-500 dark:text-yellow-400',
        badge: 'Master'
      };
    } else if (currentScore >= 80) {
      return {
        message: `Excellent! Your ${practiceType} is amazing! ✨`,
        icon: <Star className="w-8 h-8" />,
        subMessage: 'Keep up the great work!',
        color: 'text-green-500 dark:text-green-400',
        badge: 'Expert'
      };
    } else if (currentScore >= 70) {
      return {
        message: `Great job! You're making good progress! 📈`,
        icon: <TrendingUp className="w-8 h-8" />,
        subMessage: 'You\'re on the right track!',
        color: 'text-blue-500 dark:text-blue-400',
        badge: 'Advanced'
      };
    } else if (currentScore >= 60) {
      return {
        message: `Good effort! Keep practicing to improve. 💪`,
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

  const getPracticeTypeName = () => {
    switch (practiceType) {
      case 'speaking': return 'Speaking';
      case 'writing': return 'Writing';
      case 'reading': return 'Reading';
      case 'listening': return 'Listening';
      default: return 'Practice';
    }
  };

  // Get XP earned from API response score_summary
  const getXPEarned = () => {
    const scoreSummary = apiData?.score_summary || evaluationResult?.data?.score_summary;
    if (scoreSummary?.xp_earned) {
      // Return as is (e.g., "20" or "20 XP")
      return scoreSummary.xp_earned;
    }
    // Fallback to xp_point if available
    if (evaluationResult?.data?.xp_point) {
      return evaluationResult.data.xp_point.toString();
    }
    // Fallback based on score
    const currentScore = actualScore;
    if (currentScore >= 90) return '100';
    if (currentScore >= 80) return '80';
    if (currentScore >= 70) return '60';
    if (currentScore >= 60) return '40';
    return '20';
  };

  const xpEarned = getXPEarned();

  // Use provided durationSeconds or fallback to calculation
  const totalSeconds = durationSeconds > 0 ? durationSeconds : (evaluationResult?.data?.duration_seconds || Math.floor(((totalExercises * 5 * 60) + (score * 10))));

  // Ensure positive numbers for API
  const ensurePositiveNumber = (value: any, defaultValue: number = 1): number => {
    let num: number;
    if (typeof value === 'string') {
      // Remove all non-numeric characters except decimals
      const cleaned = value.replace(/[^0-9.]/g, '');
      num = parseFloat(cleaned);
    } else {
      num = Number(value);
    }
    return isNaN(num) || num <= 0 ? defaultValue : Math.max(1, Math.floor(num));
  };

  // Handle save button click
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

      // Get data from API response
      const scoreSummary = apiData?.score_summary || evaluationResult?.data?.score_summary;
      
      // Ensure we're sending positive numbers
      const finalDurationSeconds = ensurePositiveNumber(
        evaluationResult?.data?.duration_seconds || totalSeconds,
        1
      );
      
      // Get accuracy from score_summary or fallback
      let accuracyValue = 0;
      if (scoreSummary?.accuracy_rate) {
        const accuracyStr = scoreSummary.accuracy_rate.replace('%', '');
        accuracyValue = ensurePositiveNumber(parseInt(accuracyStr, 10), 1);
      } else if (evaluationResult?.data?.score_percentage) {
        accuracyValue = ensurePositiveNumber(evaluationResult.data.score_percentage, 1);
      } else {
        accuracyValue = ensurePositiveNumber(actualScore, 1);
      }
      
      // Get XP from score_summary or fallback
      const xpEarnedValue = ensurePositiveNumber(xpEarned, 1);

      // Prepare the payload
      const payload = {
        id: parseInt(lessonId),
        durationSeconds: finalDurationSeconds,
        accuracy: accuracyValue,
        xpEarned: xpEarnedValue
      };

      // Make the API call
      await completeLesson(payload).unwrap();
      
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

  // Get improvement tips from AI evaluation or fallback
  const getImprovementTips = (): string[] => {
    if (evaluationResult?.data?.areas_for_improvement && evaluationResult.data.areas_for_improvement.length > 0) {
      // Handle both string[] and AreaForImprovement[] types
      const areas = evaluationResult.data.areas_for_improvement;
      if (typeof areas[0] === 'string') {
        return areas as string[];
      } else {
        // Extract issue strings from AreaForImprovement objects
        return (areas as AreaForImprovement[]).map(area => area.issue || area.category);
      }
    }

    const tips = {
      speaking: [
        'Record yourself speaking and listen back',
        'Practice with native Italian speakers',
        'Focus on difficult sounds and intonation',
        'Shadow Italian audio with a slight delay'
      ],
      writing: [
        'Write daily journal entries in Italian',
        'Review and correct your previous writing',
        'Study Italian sentence structure',
        'Read Italian literature and articles',
        'Use writing prompts for regular practice',
        'Focus on grammar and vocabulary expansion'
      ],
      reading: [
        'Read Italian news articles daily',
        'Highlight and review new vocabulary',
        'Practice reading aloud to improve fluency',
        'Use context clues for unfamiliar words'
      ],
      listening: [
        'Watch Italian movies with subtitles',
        'Listen to Italian podcasts daily',
        'Practice transcribing short audio clips',
        'Focus on understanding main ideas first'
      ]
    };

    return tips[practiceType] || [
      'Practice daily for 15-20 minutes',
      'Review your mistakes and learn from them',
      'Set specific, achievable goals',
      'Mix different types of practice activities'
    ];
  };

  const tips = getImprovementTips();

  

  return (
    <div className=" min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
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
              {getPracticeTypeName()} Complete!
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
                    {apiData?.score_summary 
                      ? `${apiData.score_summary.correct_count}/${apiData.score_summary.total_questions} Correct`
                      : `${totalExercises} Exercises Completed`
                    }
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                  {fbCardScore}%
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
                    style={{ width: `${fbCardScore}%` }}
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
                <div className="text-3xl font-bold text-gray-900 dark:text-blue-100 mb-1">{formatTime(totalSeconds)}</div>
                <div className="text-sm text-gray-600 dark:text-blue-200">Time Spent</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 text-center border border-purple-100 dark:border-purple-800">
                <div className="text-3xl font-bold text-gray-900 dark:text-purple-100 mb-1">
                  {apiData?.score_summary?.correct_count !== undefined 
                    ? `${apiData.score_summary.correct_count}/${apiData.score_summary.total_questions}`
                    : totalExercises
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

            {/* Exercise Performance */}
            {mergedExercisePerformance.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Exercise Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mergedExercisePerformance.map((exercise, index) => {
                    // Extract percentage number from score string (e.g., "100%" -> 100)
                    const scoreValue = parseInt(exercise.score.replace('%', ''), 10) || 0;
                    return (
                      <div key={index} className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-gray-100">{exercise.category}</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{exercise.score}</span>
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
                             {(fbCard.cefr_profile?.scores?.overall || fbCard.cefr_profile?.metrics?.overall || fbCard.cefr_profile?.overall) && (
                               <div className="text-center">
                                 <span className="text-2xl font-bold text-purple-600 block">
                                   {String(fbCard.cefr_profile?.scores?.overall || fbCard.cefr_profile?.metrics?.overall || fbCard.cefr_profile?.overall).replace(/[[\]]/g, '')}
                                 </span>
                                 <p className="text-[10px] font-black uppercase text-purple-400 tracking-tighter">CEFR</p>
                               </div>
                             )}
                           </div>
                        </div>
                     )}

                     {/* Readiness Section */}
                     {fbCard.readiness && (
                        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
                          <div>
                            <h4 className="text-[10px] uppercase font-black tracking-widest text-blue-500 mb-1">{fbCard.readiness.heading}</h4>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{fbCard.readiness.message}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{fbCard.readiness.value}</span>
                          </div>
                        </div>
                     )}

                     {/* CEFR Detailed Metrics */}
                     {(fbCard.cefr_profile && (fbCard.cefr_profile.scores || fbCard.cefr_profile.metrics || fbCard.cefr_profile.overall)) && (
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {fbCard.cefr_profile.scores || fbCard.cefr_profile.metrics ? (
                            Object.entries(fbCard.cefr_profile.scores || fbCard.cefr_profile.metrics).map(([key, val]: [string, any]) => {
                              if (key.toLowerCase() === 'overall') return null;
                              return (
                                <div key={key} className="p-4 bg-white dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700 text-center shadow-sm">
                                  <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">{key}</p>
                                  <p className="text-xl font-bold text-purple-600">{val}</p>
                                </div>
                              );
                            })
                          ) : (
                            ['comprehension', 'accuracy', 'range'].map(key => fbCard.cefr_profile[key] && (
                              <div key={key} className="p-4 bg-white dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700 text-center shadow-sm">
                                <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">{key}</p>
                                <p className="text-xl font-bold text-purple-600">{fbCard.cefr_profile[key]}</p>
                              </div>
                            ))
                          )}
                       </div>
                     )}

                     {/* Strengths & Success Points */}
                     {fbCard.strengths && (fbCard.strengths.content || fbCard.strengths.points) && (
                       <div className="space-y-4">
                         <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                           <TrendingUp className="w-5 h-5" />
                           <h4 className="font-bold uppercase tracking-widest text-xs">{fbCard.strengths.heading}</h4>
                         </div>
                         <div className="grid grid-cols-1 gap-3">
                           {(fbCard.strengths.content || fbCard.strengths.points).map((p: any, i: number) => (
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
                     {fbCard.improvements && (fbCard.improvements.content || fbCard.improvements.points) && (
                       <div className="space-y-4">
                         <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                           <RefreshCw className="w-5 h-5" />
                           <h4 className="font-bold uppercase tracking-widest text-xs">{fbCard.improvements.heading}</h4>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {(fbCard.improvements.content || fbCard.improvements.points).map((p: any, i: number) => (
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
                      {fbCard.motivational_close && (
                         <div className="text-center py-6 border-t border-gray-100 dark:border-gray-700 mt-8">
                            <h4 className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2">{fbCard.motivational_close.heading || 'Progress Update'}</h4>
                            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500 mb-2">
                              {fbCard.motivational_close.flag} {typeof fbCard.motivational_close.message === 'string' && fbCard.motivational_close.message.includes(' / ') ? fbCard.motivational_close.message.split(' / ')[0] : (fbCard.motivational_close.message || '')}
                            </p>
                            {((typeof fbCard.motivational_close.message === 'string' && fbCard.motivational_close.message.includes(' / ')) || fbCard.motivational_close.translation) && (
                              <p className="text-xs font-bold opacity-30 uppercase tracking-widest">
                                {fbCard.motivational_close.translation || (typeof fbCard.motivational_close.message === 'string' ? fbCard.motivational_close.message.split(' / ')[1] : '')}
                              </p>
                            )}
                         </div>
                      )}
                   </div>
                 ) : (
                   /* Original fallback logic */
                   <div className="space-y-4">
                     {(apiData?.performance_analysis || evaluationResult?.message) && (
                       <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                         <p className="text-gray-700 dark:text-gray-300">
                           {apiData?.performance_analysis?.message || evaluationResult?.message}
                         </p>
                       </div>
                     )}
                     
                     {apiData?.areas_for_improvement && apiData.areas_for_improvement.length > 0 && (
                       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                         <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-orange-500" />
                            Path to Mastery:
                         </h4>
                         <ul className="space-y-3">
                           {apiData.areas_for_improvement.map((area: any, index: number) => (
                             <li key={index} className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                   <span className="text-orange-600 dark:text-orange-400 text-xs font-bold">{index + 1}</span>
                                </div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{typeof area === 'string' ? area : area.issue || area.category}</span>
                             </li>
                           ))}
                         </ul>
                       </div>
                     )}
                   </div>
                 )}
               </div>
            )}

            {/* Legacy AI Evaluation Feedback (fallback) */}
            {evaluationResult && !apiData && (
              <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 border border-blue-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    AI Evaluation Feedback
                  </h3>
                </div>
                
                {evaluationResult.success ? (
                  <div className="space-y-4">
                    {evaluationResult.data?.feedback && (
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-700 dark:text-gray-300">
                          {evaluationResult.data.feedback}
                        </p>
                      </div>
                    )}
                    
                    {evaluationResult.data?.areas_for_improvement && Array.isArray(evaluationResult.data.areas_for_improvement) && evaluationResult.data.areas_for_improvement.length > 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Areas for Improvement:</h4>
                        <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                          {evaluationResult.data.areas_for_improvement.map((area, index) => (
                            <li key={index}>{typeof area === 'string' ? area : area.issue || area.category}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-yellow-700 dark:text-yellow-300">
                      {evaluationResult.message || 'AI evaluation service was unavailable.'}
                    </p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                      Your score has been calculated based on your answers.
                    </p>
                  </div>
                )}
              </div>
            )}

            {exerciseResults.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Exercise Breakdown
                </h3>
                <div className="space-y-3">
                  {exerciseResults.map((result, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border ${
                        result.completed
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            result.completed
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {result.exerciseType.replace(/_/g, ' ')}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {result.completed ? 'Completed' : 'Not completed'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {result.completed ? `${result.score}%` : '--'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Score
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Review (Answer Review) from API */}
            {(apiData?.answer_review && apiData.answer_review.length > 0) && (
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6 px-1">
                   <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                    Detailed Performance Review
                  </h3>
                </div>
                <div className="space-y-5">
                  {apiData.answer_review.map((answer: any, index: number) => (
                    <div 
                      key={index}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        answer.is_correct
                          ? 'border-emerald-100 bg-emerald-50/20 dark:bg-emerald-900/5 dark:border-emerald-900/30'
                          : 'border-rose-100 bg-rose-50/20 dark:bg-rose-900/5 dark:border-rose-900/30'
                      }`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black ${
                           answer.is_correct ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
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
                        <div className={`p-4 rounded-xl border-2 ${answer.is_correct ? 'bg-white/50 border-emerald-100' : 'bg-white/50 border-rose-100'} dark:bg-gray-800/50`}>
                           <span className="text-[9px] font-black uppercase tracking-widest opacity-40 block mb-2">My Answer</span>
                           <p className={`font-bold ${answer.is_correct ? 'text-emerald-700' : 'text-rose-700'} dark:text-white`}>
                             {answer.user_answer || 'No answer'}
                           </p>
                        </div>
                        {!answer.is_correct && (
                          <div className="p-4 rounded-xl border-2 bg-white/50 border-emerald-100 dark:bg-gray-800/50">
                             <span className="text-[9px] font-black uppercase tracking-widest opacity-40 block mb-2">Correct Match</span>
                             <p className="font-bold text-emerald-700 dark:text-emerald-400">
                               {answer.correct_answer}
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
                {tips.map((tip, index) => (
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
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Try New Lesson
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
                Practice speaking, reading, or listening to improve all-around
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





 