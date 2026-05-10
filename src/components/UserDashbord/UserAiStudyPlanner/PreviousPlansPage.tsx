/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Target, BookOpen, ChevronLeft,  } from 'lucide-react';
import { useGetStudyPlanQuery } from '@/redux/features/userManagement/usermanagementApi';
 
const PreviousPlansPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: studyPlanResponse, isLoading, error, refetch } = useGetStudyPlanQuery();
  
   
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Count total activities
  const countTotalActivities = (activities: any) => {
    if (!activities) return 0;
    let count = 0;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach(day => {
      if (activities[day] && Array.isArray(activities[day])) {
        count += activities[day].length;
      }
    });
    return count;
  };

  // Get day name from key
  const getDayName = (key: string) => {
    const dayMap: { [key: string]: string } = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday'
    };
    return dayMap[key] || key;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Loading your study plans...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-6"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Target className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">
              Unable to Load Study Plans
            </h3>
            <p className="text-red-700 dark:text-red-400 mb-4">
              There was an error loading your study plans. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 cursor-pointer py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const studyPlan = studyPlanResponse?.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
              Your Study Plans
            </h1>
            
            <button
              onClick={() => navigate('/user/planner')}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
            >
             Genareate New plan
            </button>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto">
            View and manage all your AI-generated study plans. Track your progress and continue where you left off.
          </p>
        </div>

        {!studyPlan ? (
          /* No Plans State */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              No Study Plans Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              You haven't created any study plans yet. Generate your first AI-powered study plan to get started on your learning journey!
            </p>
            <button
              onClick={() => navigate('/ai-study-planner')}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Create Your First Study Plan
            </button>
          </div>
        ) : (
          /* Plan Details */
          <div className="space-y-6">
            {/* Plan Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Plan Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">
                        Active Plan
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Generated: {formatDate(studyPlan.generatedAt)}
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                      {studyPlan.activities.weeklyGoal || 'My Study Plan'}
                    </h2>
                  </div>
                  
                 
                </div>
              </div>

              {/* Plan Stats */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {countTotalActivities(studyPlan.activities)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Activities</p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <Calendar className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">7</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Days</p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <Target className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {studyPlan.activities.weeklyGoal ? 1 : 0}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Goals</p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                    <BookOpen className="h-6 w-6 text-orange-600 dark:text-orange-400 mb-2" />
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">Ongoing</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  </div>
                </div>
              </div>

              {/* Weekly Schedule */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Weekly Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(studyPlan.activities).map(([day, activities]) => {
                    if (day === 'weeklyGoal' || !Array.isArray(activities)) return null;
                    
                    return (
                      <div 
                        key={day} 
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-800 dark:text-white">
                            {getDayName(day)}
                          </h4>
                          <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded text-xs">
                            {activities.length} tasks
                          </span>
                        </div>
                        
                        <ul className="space-y-2">
                          {activities.map((activity: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
                              <span className="text-gray-700 dark:text-gray-300 text-sm">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                {/* Weekly Goal */}
                {studyPlan.activities.weeklyGoal && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                    <div className="flex items-start space-x-3">
                      <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-1">Weekly Goal</h4>
                        <p className="text-indigo-700 dark:text-indigo-400">{studyPlan.activities.weeklyGoal}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Plan ID: {studyPlan.id.substring(0, 8)}...
                  </div>
                  
                  <div className="flex space-x-3">
                    
                    <button onClick={() => navigate('/user/practice')} className="px-4 py-2 cursor-pointer bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                      Start Learning
                    </button>
                     
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State for Additional Plans (if needed) */}
           
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviousPlansPage;