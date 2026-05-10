/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Calendar, Target, Clock, BookOpen, CheckCircle,  RefreshCw, AlertCircle } from 'lucide-react';
import { GoalData } from './AIStudyPlanner';
import { GiBookmarklet } from "react-icons/gi";
import { IoSparklesSharp } from 'react-icons/io5';
import { AiStudyPlannerResponse } from '@/redux/features/studyPlan/aiStudyPlanner/aiStudyPlannerApi';   
// Define interface for language data
interface LanguageData {
  name: string;
  data: {
    daily_activities?: number;
    duration_weeks?: number;
    weekly_objectives?: number;
    total_hours?: string;
    piano_settimanale_suggerito?: string[];
    suggested_weekly_plan?: string[];
  };
}


type YourPlanProps = { 
  goalData: GoalData;
  aiPlanData: AiStudyPlannerResponse | any;
  error: string;
  onRegenerate: () => void;
  onSavePlan: () => Promise<void>;
  onStartLearning: () => Promise<void>;
  isSaving?: boolean;
  saveSuccess?: boolean;
  hasSavedPlan?: boolean;
  isLoadingSavedPlan?: boolean;
  savedPlanResponse?: any;
};


// Stat Card
const StatCard: React.FC<{ 
  icon: React.ReactNode; 
  value: string | number; 
  label: string; 
  color: string;
  bgColor: string;
}> = ({ 
  icon, 
  value, 
  label, 
  color,
  bgColor
}) => (
  <div className={`flex flex-col items-center justify-center p-4 ${bgColor} rounded-xl flex-1 min-w-[150px] text-center`}>
    <div className={`${color} mb-2`}>{icon}</div>
    <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-300">{label}</p>
  </div>
);

// Daily Task Item
const DailyTaskItem: React.FC<{ task: string; index: number }> = ({ task, index }) => (
  <div className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
    <div className="flex-shrink-0">
      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
        <span className="text-indigo-600 dark:text-indigo-400 font-bold">{index + 1}</span>
      </div>
    </div>
    <div className="flex-1">
      <p className="font-medium text-gray-800 dark:text-white">{task}</p>
    </div>
     
  </div>
);

 

export const YourPlanView: React.FC<YourPlanProps> = ({ goalData, aiPlanData, error, onRegenerate,onStartLearning, isSaving,}) => {
  // Extract all language data from AI response
  const extractLanguageData = (): LanguageData[] => {
    const languages: LanguageData[] = [];
    
    if (!aiPlanData) return languages;
    
    // Check for all possible language keys in the response
    const possibleLanguages = ['english', 'italian', 'spanish', 'french', 'german', 'chinese', 'japanese'];
    
    for (const lang of possibleLanguages) {
      if (aiPlanData[lang as keyof AiStudyPlannerResponse]) {
        const languageData = aiPlanData[lang as keyof AiStudyPlannerResponse];
        if (typeof languageData === 'object' && languageData !== null) {
          languages.push({
            name: lang,
            data: languageData as any
          });
        }
      }
    }
    
    // If no specific language objects, check for direct properties
    if (languages.length === 0 && aiPlanData.suggested_weekly_plan) {
      languages.push({
        name: 'general',
        data: {
          daily_activities: aiPlanData.daily_activities || 0,
          duration_weeks: aiPlanData.duration_weeks || 0,
          weekly_objectives: aiPlanData.weekly_objectives || 0,
          total_hours: aiPlanData.total_hours || '0 Hours',
          suggested_weekly_plan: aiPlanData.suggested_weekly_plan
        }
      });
    }
    
    return languages;
  };

  const languages = extractLanguageData();
  const hasAiData = languages.length > 0;
  
  // Get the first language data for main display (or use first available)
  const primaryData = hasAiData ? languages[0].data : null;

  // Get weekly plan from data
  const getWeeklyPlan = (): string[] => {
    if (!hasAiData) return [];
    
    // Check for weekly plan in different possible properties
    if (primaryData?.piano_settimanale_suggerito) {
      return primaryData.piano_settimanale_suggerito;
    } else if (primaryData?.suggested_weekly_plan) {
      return primaryData.suggested_weekly_plan;
    } else if (aiPlanData?.suggested_weekly_plan) {
      return aiPlanData.suggested_weekly_plan;
    }
    
    return [];
  };

  const weeklyPlan = getWeeklyPlan();

  // Calculate total stats across all languages
  const calculateTotalStats = () => {
    if (!hasAiData) return { totalHours: '0 Hours', totalWeeks: 0, totalActivities: 0, totalObjectives: 0 };
    
    let totalHours = 0;
    let maxWeeks = 0;
    let totalActivities = 0;
    let totalObjectives = 0;
    
    languages.forEach(lang => {
      const data = lang.data;
      
      // Extract hours
      if (data.total_hours) {
        const hoursMatch = data.total_hours.match(/(\d+)/);
        if (hoursMatch) totalHours += parseInt(hoursMatch[1]);
      }
      
      // Get max weeks
      if (data.duration_weeks && data.duration_weeks > maxWeeks) {
        maxWeeks = data.duration_weeks;
      }
      
      // Sum activities and objectives
      totalActivities += data.daily_activities || 0;
      totalObjectives += data.weekly_objectives || 0;
    });
    
    return {
      totalHours: `${totalHours} Hours`,
      totalWeeks: maxWeeks,
      totalActivities,
      totalObjectives
    };
  };

  const totalStats = calculateTotalStats();
  
  return (
    <div className="space-y-10">
      {/* Header with Actions */}
      <div className="space-y-4 bg-white dark:bg-gray-800 py-9 px-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <IoSparklesSharp className="h-7 w-7 text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {hasAiData ? "AI-Generated" : "No Plan Generated"} Study Plan
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {hasAiData 
                  ? `Plan to help you "${goalData.target}"` 
                  : 'Click "Generate AI Study Plan" to create your personalized plan'
                }
              </p>
            </div>
          </div>
         
        </div>

        {/* Stats Grid - Show total stats across all languages */}
        {hasAiData && (
          <>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6">Overall Plan Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                icon={<Clock className="h-6 w-6" />}
                value={totalStats.totalHours}
                label="Total Hours"
                color="text-indigo-600 dark:text-indigo-400"
                bgColor="bg-indigo-50 dark:bg-indigo-900/20"
              />
              <StatCard 
                icon={<Calendar className="h-6 w-6" />}
                value={`${totalStats.totalWeeks} Weeks`}
                label="Duration"
                color="text-green-600 dark:text-green-400"
                bgColor="bg-green-50 dark:bg-green-900/20"
              />
              <StatCard 
                icon={<BookOpen className="h-6 w-6" />}
                value={`${totalStats.totalActivities} Total`}
                label="Activities"
                color="text-purple-600 dark:text-purple-400"
                bgColor="bg-purple-50 dark:bg-purple-900/20"
              />
              <StatCard 
                icon={<Target className="h-6 w-6" />}
                value={`${totalStats.totalObjectives} Total`}
                label="Objectives"
                color="text-orange-600 dark:text-orange-400"
                bgColor="bg-orange-50 dark:bg-orange-900/20"
              />
            </div>
          </>
        )}

        {/* Plan Summary */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2">
            <GiBookmarklet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-medium text-blue-800 dark:text-blue-300">Plan Summary:</h4>
          </div>
          {hasAiData ? (
            <div className="space-y-2 mt-2">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Study <span className="font-bold">{goalData.dailyTime}</span> per day, 
                <span className="font-bold"> {goalData.daysPerWeek}</span> days per week to achieve 
                "<span className="font-bold">{goalData.target}</span>".
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                AI has generated <span className="font-bold">{languages.length}</span> language plan{languages.length > 1 ? 's' : ''} 
                with a total of <span className="font-bold">{weeklyPlan.length}</span> weekly activities.
              </p>
              <p className="text-xs text-green-600 dark:text-green-500 mt-2 flex items-center space-x-1">
                <IoSparklesSharp className="h-3 w-3" />
                <span>All data is dynamically generated by AI based on your preferences</span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-2">
              No AI-generated plan available yet. Click "Generate AI Study Plan" to create a personalized plan based on your goals and availability.
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-600 dark:text-red-400 font-medium">AI Generation Error</p>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Weekly Plan Section - Only show if we have weekly plan data */}
      {hasAiData && weeklyPlan.length > 0 && (
        <>
          <hr className="border-gray-200 dark:border-gray-700" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Weekly Study Plan</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {goalData.focusAreas.join(', ')} focus areas | {totalStats.totalWeeks} weeks duration
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                  {weeklyPlan.length} activities
                </span>
                <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 rounded">
                  AI-Generated
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {weeklyPlan?.slice(0,3)?.map((task: string, index: number) => (
                <DailyTaskItem 
                  key={index}
                  task={task}
                  index={index}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Weekly Goals - Only show if we have objectives */}
      {hasAiData && totalStats.totalObjectives > 0 && (
        <>
          <hr className="border-gray-200 dark:border-gray-700" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Weekly Goals & Milestones</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Track your progress each week</p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {totalStats.totalObjectives} objectives
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {Array.from({ length: Math.min(totalStats.totalObjectives, 8) }).map((_, index) => {
                const weekNumber = (index % totalStats.totalWeeks) + 1 || index + 1;
                const goalText = `Complete week ${weekNumber} objectives and review progress`;
                
                return (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                        Week {weekNumber}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-400">{goalText}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <button 
          onClick={onRegenerate}
          className="flex-1 cursor-pointer flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-700 dark:from-indigo-600 dark:to-purple-800 text-white font-medium rounded-xl hover:shadow-xl transition-all duration-300"
        >
          <RefreshCw className="h-5 w-5" />
          <span>{hasAiData ? 'Generate New Plan' : 'Generate AI Study Plan'}</span>
        </button>
        {hasAiData && (
          <>
            
           

 <button 
  onClick={onStartLearning}
  className="flex-1 cursor-pointer flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
>
  <CheckCircle className="h-5 w-5" />
  <span>{isSaving ? 'Saving...' : 'Start Learning'}</span>
</button>


          </>
        )}
      </div>

      {/* No Data State */}
      {!hasAiData && !error && (
        <div className="text-center py-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <IoSparklesSharp className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            No Study Plan Generated Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Click the "Generate AI Study Plan" button to create a personalized study plan based on your learning goals, focus areas, and availability.
          </p>
          <button 
            onClick={onRegenerate}
            className="inline-flex cursor-pointer items-center space-x-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-700 dark:from-indigo-600 dark:to-purple-800 text-white font-medium rounded-xl hover:shadow-xl transition-all duration-300"
          >
            <IoSparklesSharp className="h-5 w-5" />
            <span>Generate Your First AI Study Plan</span>
          </button>
        </div>
      )}
    </div>
  );
};