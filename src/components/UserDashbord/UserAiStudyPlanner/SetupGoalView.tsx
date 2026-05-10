import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { GoalData } from './AIStudyPlanner';
import { IoSparklesSharp } from "react-icons/io5";

type SetupGoalProps = {
  goalData: GoalData;
  setGoalData: React.Dispatch<React.SetStateAction<GoalData>>;
  onGenerate: () => void;
  isLoading: boolean;
  hasSavedPlan: boolean;
};

// Checkbox Component with Dark Mode
const Checkbox: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void }> = ({
  label,
  checked,
  onChange,
}) => (
  <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
    <input
      type="checkbox"
      className="form-checkbox h-5 w-5 text-indigo-600 dark:text-indigo-400 rounded border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className="text-gray-700 dark:text-gray-300">{label}</span>
  </label>
);

// Time Option Component with Dark Mode
const TimeOption: React.FC<{ time: string; hint: string; isSelected: boolean; onClick: () => void }> = ({
  time,
  hint,
  isSelected,
  onClick,
}) => (
  <div
    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
      isSelected
        ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-200 dark:ring-indigo-800'
        : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
    }`}
    onClick={onClick}
  >
    <div className="flex justify-between items-center">
      <p className="font-medium text-gray-800 dark:text-gray-200">{time}</p>
      {isSelected && <Check className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
  </div>
);

export const SetupGoalView: React.FC<SetupGoalProps> = ({ 
  goalData, 
  setGoalData, 
  onGenerate,
  isLoading 
   
}) => {
  const focusAreas = ['Vocabulary', 'Listening', 'Speaking', 'Grammar', 'Writing', 'All Areas'];
  const dailyTimes = ['20 minutes', '45 minutes', '1 hour', '2 hours'];

  // Handle days per week change
  const handleDaysPerWeekChange = (day: number) => {
    setGoalData({ ...goalData, daysPerWeek: day });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
      {/* Left Column - Learning Goals */}
      <div className="space-y-6 p-6 border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 rounded-xl shadow-sm transition-colors duration-200">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Set Your Learning Goals</h2>

        {/* Focus Areas */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">Select Your Focus Areas</h3>
          <div className="grid grid-cols-2 gap-2">
            {focusAreas.map((area) => (
              <Checkbox
                key={area}
                label={area}
                checked={goalData.focusAreas.includes(area)}
                onChange={(checked) =>
                  setGoalData({
                    ...goalData,
                    focusAreas: checked
                      ? [...goalData.focusAreas, area]
                      : goalData.focusAreas.filter((f) => f !== area),
                  })
                }
              />
            ))}
          </div>
        </div>

        {/* Target Selection */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">Choose Your Target</h3>
          <select
            value={goalData.target}
            onChange={(e) => setGoalData({ ...goalData, target: e.target.value })}
            className="w-full cursor-pointer p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-200"
          >
            <option value="Learn 50 New Words">Learn 50 New Words</option>
            <option value="Master 10 Grammar Rules">Master 10 Grammar Rules</option>
            <option value="Improve Conversation Skills">Improve Conversation Skills</option>
            <option value="Prepare for Italian Exam">Prepare for Italian Exam</option>
            <option value="Travel Italian Basics">Travel Italian Basics</option>
          </select>
        </div>

        {/* Selection Summary */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Your Selection:</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {goalData.focusAreas.length > 0 
              ? `Focusing on: ${goalData.focusAreas.join(', ')}`
              : 'No focus areas selected'
            }
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Target: {goalData.target}
          </p>
        </div>
      </div>

      {/* Right Column - Availability */}
      <div className="space-y-6 p-6 border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 rounded-xl shadow-sm transition-colors duration-200">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Set Your Availability</h2>

        {/* Daily Study Time */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">Daily Study Time</h3>
          <div className="space-y-3">
            {dailyTimes.map((time) => (
              <TimeOption
                key={time}
                time={time}
                hint={time === '20 minutes' ? 'Perfect for beginners' : 
                      time === '45 minutes' ? 'Good for consistent progress' :
                      time === '1 hour' ? 'Ideal for serious learners' :
                      'Best for intensive learning'}
                isSelected={goalData.dailyTime === time}
                onClick={() => setGoalData({ ...goalData, dailyTime: time })}
              />
            ))}
          </div>
        </div>

      


 <div className="space-y-4">
  <h3 className="font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between">
    <span>Study Days Per Week</span>
    <span className="text-sm font-normal bg-[#FF6E51]/10 dark:bg-orange-500/10 text-[#FF6E51] dark:text-orange-400 px-3 py-1 rounded-full">
      {goalData.daysPerWeek} {goalData.daysPerWeek === 1 ? 'day' : 'days'} selected
    </span>
  </h3>

  {/* Visual progress indicator */}
  <div className="relative">
    {/* Progress line */}
    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
    
    {/* Selected progress line */}
    <div 
      className="absolute -z-10 top-5 left-0 h-1 bg-gradient-to-r from-[#FF6E51] to-orange-400 dark:from-orange-500 dark:to-orange-400 rounded-full transition-all duration-300"
      style={{ width: `${((goalData.daysPerWeek - 1) / 6) * 100}%` }}
    ></div>

    {/* Day selection circles */}
    <div className="relative   flex justify-between items-center mt-4">
      {[1, 2, 3, 4, 5, 6, 7].map((day) => {
        const isSelected = day <= goalData.daysPerWeek;
        const isActive = day === goalData.daysPerWeek;
        
        return (
          <button
            key={day}
            type="button"
            onClick={() => handleDaysPerWeekChange(day)}
            className="relative cursor-pointer flex flex-col items-center group focus:outline-none"
          >
            {/* Selection indicator line */}
            {day > 1 && (
              <div 
                className={`absolute   top-5 -left-1/2 w-full h-1 ${
                  isSelected 
                    ? 'bg-[#FF6E51] dark:bg-orange-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              ></div>
            )}

            {/* Day circle */}
            <div
              className={`
                relative   w-10 h-10 rounded-full flex items-center justify-center 
                transition-all duration-200 transform group-hover:scale-110
                ${isSelected
                  ? isActive
                    ? 'bg-[#FF6E51] dark:bg-orange-500 text-white shadow-lg shadow-[#FF6E51]/30 dark:shadow-orange-500/30'
                    : 'bg-[#FF6E51]/20 dark:bg-orange-500/20 text-[#FF6E51] dark:text-orange-400 border-2 border-[#FF6E51] dark:border-orange-500'
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-600 group-hover:border-[#FF6E51] group-hover:dark:border-orange-400'
                }
              `}
            >
              <span className="font-semibold">{day}</span>
              
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -bottom-1 w-2 h-2 bg-[#FF6E51] dark:bg-orange-500 rounded-full"></div>
              )}
            </div>

            {/* Day label */}
            <span
              className={`mt-2 text-xs font-medium transition-colors duration-200 ${
                isActive
                  ? 'text-[#FF6E51] dark:text-orange-500 font-bold'
                  : isSelected
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-gray-500 dark:text-gray-500'
              }`}
            >
              {day === 1 ? 'Day' : 'Days'}
            </span>

            {/* Tooltip on hover */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-xs py-1 px-2 rounded whitespace-nowrap">
                Click for {day} day{day > 1 ? 's' : ''}
              </div>
              <div className="w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
            </div>
          </button>
        );
      })}
    </div>
  </div>

  
</div>



         <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Your Study Plan:</h4>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            {goalData.dailyTime} per day, {goalData.daysPerWeek} days per week
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Total weekly study time: {parseInt(goalData.dailyTime) * goalData.daysPerWeek} minutes
          </p>
        </div>

        {/* Generate Button */}
        <button
          className={`w-full cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-700 dark:from-indigo-600 dark:to-purple-800 flex cursor-pointer items-center justify-center space-x-2 text-white py-4 rounded-xl hover:shadow-xl transition-all duration-300 shadow-lg mt-2 group ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          onClick={onGenerate}
          disabled={isLoading || goalData.focusAreas.length === 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="font-semibold text-lg">Generating...</span>
            </>
          ) : (
            <>
              <IoSparklesSharp className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold text-lg">Generate AI Study Plan</span>
            </>
          )}
        </button>

        {/* Validation Message */}
        {goalData.focusAreas.length === 0 && (
          <p className="text-sm text-red-500 dark:text-red-400 text-center mt-2">
            Please select at least one focus area
          </p>
        )}

        {/* Help Text */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          Our AI will create a personalized study plan based on your goals and availability
        </p>
      </div>
    </div>
  );
};