/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { SetupGoalView } from './SetupGoalView';
import { YourPlanView } from './YourPlanView';
 import { useNavigate } from 'react-router-dom';
import { AiStudyPlannerResponse, useGenerateAiStudyPlannerMutation } from '@/redux/features/studyPlan/aiStudyPlanner/aiStudyPlannerApi';
import { useCreateOrUpdateStudyPlanMutation, useGetStudyPlanQuery } from '@/redux/features/userManagement/usermanagementApi';
  

type Tab = 'Setup Goal' | 'Your Plan';

export type GoalData = {
  focusAreas: string[];
  target: string;
  dailyTime: string;
  daysPerWeek: number;
};

const TabButton: React.FC<{
  label: Tab;
  isActive: boolean;
  onClick: (label: Tab) => void;
}> = ({ label, isActive, onClick }) => (
  <button
    className={`px-6 py-2 cursor-pointer rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-700 dark:from-indigo-600 dark:to-purple-800'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
    }`}
    onClick={() => onClick(label)}
  >
    {label}
  </button>
);

export const AIStudyPlanner: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('Setup Goal');
  const [aiPlanData, setAiPlanData] = useState<AiStudyPlannerResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [savingPlan, setSavingPlan] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  
  // Initialize the mutation hooks
  const [generatePlan] = useGenerateAiStudyPlannerMutation();
  const [createOrUpdateStudyPlan] = useCreateOrUpdateStudyPlanMutation();
  const { data: savedPlanResponse, isLoading: isLoadingSavedPlan, refetch: refetchStudyPlan } = useGetStudyPlanQuery();

  const [goalData, setGoalData] = useState<GoalData>({
    focusAreas: ['Vocabulary', 'Speaking', 'Grammar'],
    target: 'Learn 50 New Words',
    dailyTime: '45 minutes',
    daysPerWeek: 5,
  });

  // Check URL hash to determine initial tab
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#your-plan' && savedPlanResponse?.data) {
      setActiveTab('Your Plan');
    }
  }, [savedPlanResponse]);

  // Convert saved plan to AI plan format (for display)
  const convertSavedPlanToAiFormat = (savedPlan: any): AiStudyPlannerResponse => {
    // Extract all activities from saved plan
    const allActivities: string[] = [];
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    days.forEach(day => {
      if (savedPlan.activities[day] && Array.isArray(savedPlan.activities[day])) {
        allActivities.push(...savedPlan.activities[day]);
      }
    });

    return {
      success: true,
      suggested_weekly_plan: allActivities,
      daily_activities: allActivities.length,
      duration_weeks: 4, // Default
      weekly_objectives: 1,
      total_hours: '10 Hours',
      italian: {
        daily_activities: allActivities.length,
        duration_weeks: 4,
        weekly_objectives: 1,
        total_hours: '10 Hours',
        piano_settimanale_suggerito: allActivities
      }
    };
  };

  // Handle tab switching with saved plan loading
  const handleTabSwitch = (tab: Tab) => {
    setActiveTab(tab);
    
    if (tab === 'Your Plan' && savedPlanResponse?.data && !aiPlanData) {
      // Convert saved plan to AI format for display
      const aiFormattedPlan = convertSavedPlanToAiFormat(savedPlanResponse.data);
      setAiPlanData(aiFormattedPlan);
      
      // Extract goal data from saved plan if available
      if (savedPlanResponse.data.activities.weeklyGoal) {
        setGoalData(prev => ({
  ...prev,
  target: savedPlanResponse.data.activities.weeklyGoal ?? prev.target
}));

      }
    }
  };

  // Convert daily time string to minutes
  const convertDailyTimeToMinutes = (timeString: string): number => {
    const timeStr = timeString.toLowerCase();
    const timeMatch = timeStr.match(/(\d+)/);
    if (timeMatch) {
      const value = parseInt(timeMatch[1]);
      if (timeStr.includes('hour')) {
        return value * 60;
      }
      return value;
    }
    return 45; // default
  };

  // Determine level based on daily study time
  const determineLevel = (dailyMinutes: number): string => {
    if (dailyMinutes <= 30) return "Beginner";
    if (dailyMinutes <= 60) return "Intermediate";
    return "Advanced";
  };

  // Convert AI plan to study activities format for saving
  const convertAiPlanToActivities = (aiPlan: AiStudyPlannerResponse): any => {
    const activities: any = {
      weeklyGoal: goalData.target
    };

    // Map AI plan data to days of the week
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    // If we have suggested weekly plan from AI, distribute across days
    if (aiPlan.suggested_weekly_plan && Array.isArray(aiPlan.suggested_weekly_plan)) {
      const dailyTaskCount = Math.ceil(aiPlan.suggested_weekly_plan.length / goalData.daysPerWeek);
      
      // Only fill days based on daysPerWeek
      for (let i = 0; i < Math.min(goalData.daysPerWeek, 7); i++) {
        const day = days[i];
        const startIndex = i * dailyTaskCount;
        const endIndex = Math.min(startIndex + dailyTaskCount, aiPlan.suggested_weekly_plan.length);
        activities[day] = aiPlan.suggested_weekly_plan.slice(startIndex, endIndex);
      }
    } else {
      // Fallback: Create simple activities based on focus areas
      const focusTasks = goalData.focusAreas.map(area => `Practice ${area}`);
      for (let i = 0; i < Math.min(goalData.daysPerWeek, 7); i++) {
        activities[days[i]] = [...focusTasks];
      }
    }

    return activities;
  };

  // Handle save plan to backend
  const handleSavePlan = async () => {
    if (!aiPlanData) return;

    try {
      setSavingPlan(true);
      setSaveSuccess(false);

      // Convert AI plan to activities format
      const activities = convertAiPlanToActivities(aiPlanData);

      // Save to backend
      const result = await createOrUpdateStudyPlan({ activities }).unwrap();
      
      if (result.success) {
        setSaveSuccess(true);
        
        // Refetch study plan data
        await refetchStudyPlan();
        
        // Show success message
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      }
    } catch (err: any) {
      console.error('Failed to save study plan:', err);
      setErrorMessage('Failed to save plan. Please try again.');
    } finally {
      setSavingPlan(false);
    }
  };

  // Handle start learning - navigates to practice page and saves plan
  const handleStartLearning = async () => {
    if (!aiPlanData) {
      // If no AI plan, check if we have saved plan
      if (savedPlanResponse?.data) {
        // Navigate directly to practice with saved plan
        navigate('/user/practice');
        return;
      } else {
        // If no saved plan either, generate one first
        await handleGeneratePlan();
        return;
      }
    }
    
    // Save the plan first (if we have new AI data)
    await handleSavePlan();
    
    // Navigate to practice page
    navigate('/user/practice');
  };

  // Handle generate button click
  const handleGeneratePlan = async () => {
    // Prevent multiple simultaneous API calls
    if (isGenerating) {
      return;
    }

    try {
      setErrorMessage('');
      setIsGenerating(true);
      setSaveSuccess(false);
      
      // Prepare request data
      const dailyMinutes = convertDailyTimeToMinutes(goalData.dailyTime);
      const level = determineLevel(dailyMinutes);
      
      const requestData = {
        provider: "grok" as const,
        focus_areas: goalData.focusAreas,
        target: goalData.target,
        daily_study_time: dailyMinutes,
        days_per_week: goalData.daysPerWeek,
        level: level
      };
      
      // Make API call and WAIT for response before proceeding
      const response = await generatePlan(requestData).unwrap();
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Store the AI-generated plan data
      setAiPlanData(response);
      
      // ONLY switch to "Your Plan" tab AFTER successful API response
      setActiveTab('Your Plan');
      
    } catch (err: any) {
      console.error('Failed to generate AI study plan:', err);
      
      // Extract error details
      let errorMsg = 'Failed to generate plan. Please try again.';
      
      if (err?.status === 404) {
        errorMsg = 'API endpoint not found (404). Please check if the AI service is running.';
      } else if (err?.status === 500) {
        errorMsg = 'AI service error (500). Please try again later.';
      } else if (err?.data?.message) {
        errorMsg = `AI Service Error: ${err.data.message}`;
      } else if (err?.error) {
        errorMsg = `Error: ${err.error}`;
      } else if (err?.message) {
        errorMsg = err.message;
      }
      
      setErrorMessage(errorMsg);
      
      // Don't switch tab on error - stay on Setup Goal tab so user can retry
      
    } finally {
      setIsGenerating(false);
    }
  };

  // Check if user has a saved plan
  const hasSavedPlan = Boolean(savedPlanResponse?.data);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="mx-auto p-6 lg:p-8 rounded-xl">
        {/* Header with Previous Plans Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-white mb-2">
              AI Study Planner
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base">
              {hasSavedPlan 
                ? "View and manage your personalized study plan" 
                : "Create your personalized study plan with AI!"
              }
            </p>
            {hasSavedPlan && !aiPlanData && (
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm">
                <span className="mr-2">✓</span>
                You have a saved study plan
              </div>
            )}
          </div>
          
         
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 p-2 rounded-xl bg-gray-200 dark:bg-gray-800 w-fit mb-8 lg:mb-10 transition-colors duration-200">
          <TabButton 
            label="Setup Goal" 
            isActive={activeTab === 'Setup Goal'} 
            onClick={() => handleTabSwitch('Setup Goal')} 
          />
          <TabButton 
            label="Your Plan" 
            isActive={activeTab === 'Your Plan'} 
            onClick={() => handleTabSwitch('Your Plan')} 
          />
        </div>

        {/* Save Success Message */}
        {saveSuccess && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-fadeIn">
            <div className="flex items-center space-x-2">
              <div className="text-green-500 dark:text-green-400">✓</div>
              <div>
                <p className="text-green-600 dark:text-green-400 font-medium">Plan Saved Successfully!</p>
                <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                  Your study plan has been saved and is now ready for practice.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State for AI Generation */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center max-w-md">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Generating AI Study Plan
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI is creating a personalized study plan for you...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                This may take 10-20 seconds
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="text-red-500 dark:text-red-400">⚠️</div>
              <div>
                <p className="text-red-600 dark:text-red-400 font-medium">AI Service Error</p>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
          {activeTab === 'Setup Goal' && (
            <SetupGoalView
              goalData={goalData}
              setGoalData={setGoalData}
              onGenerate={handleGeneratePlan}
              isLoading={isGenerating}
              hasSavedPlan={hasSavedPlan}
            />
          )}
          {activeTab === 'Your Plan' && (
            <YourPlanView 
              goalData={goalData} 
              aiPlanData={aiPlanData}
              error={errorMessage}
              onRegenerate={() => {
                setAiPlanData(null);
                setErrorMessage('');
                setActiveTab('Setup Goal');
              }}
              onSavePlan={handleSavePlan}
              onStartLearning={handleStartLearning}
              isSaving={savingPlan}
              saveSuccess={saveSuccess}
              hasSavedPlan={hasSavedPlan}
              isLoadingSavedPlan={isLoadingSavedPlan}
              savedPlanResponse={savedPlanResponse}
            />
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className={`w-2 h-2 rounded-full ${
              activeTab === 'Setup Goal' 
                ? 'bg-indigo-500 dark:bg-indigo-400' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}></div>
            <div className={`w-2 h-2 rounded-full ${
              activeTab === 'Your Plan' 
                ? 'bg-indigo-500 dark:bg-indigo-400' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}></div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            Step {activeTab === 'Setup Goal' ? '1' : '2'} of 2
          </span>
        </div>
      </div>
    </div>
  );
};


 