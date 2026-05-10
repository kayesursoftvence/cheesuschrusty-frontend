// TimeSelection.tsx
import { useState } from 'react';
import Card from './Card';
import StepNavigation from './StepNavigation';

interface TimeSelectionProps {
  sectionTotal: number;
  taskTime: number;
  onSectionTotalChange: (time: number) => void;
  onTaskTimeChange: (time: number) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

const SECTION_TOTAL_OPTIONS = [
  { value: 15, label: '15 Minutes', description: 'Quick section practice' },
  { value: 30, label: '30 Minutes', description: 'Standard section time' },
  { value: 45, label: '45 Minutes', description: 'Extended full section' },
];

const TASK_TIME_OPTIONS = [
  { value: 5, label: '5 Minutes', description: 'Quick sprint' },
  { value: 10, label: '10 Minutes', description: 'Standard duration' },
  { value: 15, label: '15 Minutes', description: 'Extended practice' },
];

export default function TimeSelection({
  sectionTotal,
  taskTime,
  onSectionTotalChange,
  onTaskTimeChange,
  onNext,
  onBack,
  currentStep,
  totalSteps,
}: TimeSelectionProps) {
  const [showValidation, setShowValidation] = useState(false);
  const [isCustomSectionTotal, setIsCustomSectionTotal] = useState(false);
  const [isCustomTaskTime, setIsCustomTaskTime] = useState(false);

  const canProceed = sectionTotal > 0 && taskTime > 0;

  const handleNext = () => {
    if (!canProceed) {
      setShowValidation(true);
      return;
    }
    onNext();
  };

  return (
    <div>
      <Card
        title="Time & Length Configuration"
        description="Set the number of questions and time limit for the task"
        status={canProceed ? 'completed' : 'required'}
      >
        {/* Section Total Configuration */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>⌛</span>
              <span>Overall Section Time (Section Total)</span>
            </h3>
            <button
              onClick={() => setIsCustomSectionTotal(!isCustomSectionTotal)}
              className="text-[13px] text-blue-500 hover:text-blue-600 font-medium transition-colors"
            >
              {isCustomSectionTotal ? 'Use Presets' : 'Custom Amount'}
            </button>
          </div>

          {!isCustomSectionTotal ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SECTION_TOTAL_OPTIONS.map((option) => {
                const isActive = option.value === sectionTotal;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSectionTotalChange(option.value);
                      setShowValidation(false);
                    }}
                    className={[
                      'border-2 rounded-xl p-4 text-left transition-all duration-200',
                      isActive
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-500 hover:-translate-y-0.5',
                    ].join(' ')}
                  >
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {option.label}
                    </div>
                    <div className="text-[12px] text-gray-500 dark:text-gray-400">
                      {option.description}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Custom Quantity
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={sectionTotal}
                  onChange={(e) => {
                    onSectionTotalChange(Number(e.target.value));
                    setShowValidation(false);
                  }}
                  className="w-32 px-3.5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">minutes</span>
              </div>
            </div>
          )}
        </div>

        {/* Task Time Configuration */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>⏱️</span>
              <span>Time Limit (Task Time)</span>
            </h3>
            <button
              onClick={() => setIsCustomTaskTime(!isCustomTaskTime)}
              className="text-[13px] text-blue-500 hover:text-blue-600 font-medium transition-colors"
            >
              {isCustomTaskTime ? 'Use Presets' : 'Custom Time'}
            </button>
          </div>

          {!isCustomTaskTime ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TASK_TIME_OPTIONS.map((option) => {
                const isActive = option.value === taskTime;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      onTaskTimeChange(option.value);
                      setShowValidation(false);
                    }}
                    className={[
                      'border-2 rounded-xl p-4 text-left transition-all duration-200',
                      isActive
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-500 hover:-translate-y-0.5',
                    ].join(' ')}
                  >
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {option.label}
                    </div>
                    <div className="text-[12px] text-gray-500 dark:text-gray-400">
                      {option.description}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Custom Duration
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={taskTime}
                  onChange={(e) => {
                    onTaskTimeChange(Number(e.target.value));
                    setShowValidation(false);
                  }}
                  className="w-32 px-3.5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">minutes</span>
              </div>
            </div>
          )}
        </div>

        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          canGoNext={true}
          onBack={onBack}
          onNext={handleNext}
          showValidation={showValidation && !canProceed}
          validationMessage="Please set both quantities and time limits above 0."
        />
      </Card>
    </div>
  );
}
