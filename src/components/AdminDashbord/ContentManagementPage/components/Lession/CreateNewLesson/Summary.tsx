// Summary.tsx
import React, { useState, useMemo } from 'react';
import { LessonFormState } from './types';
import { TASK_OPTIONS, DOMAIN_OPTIONS, MODE_OPTIONS, PROVIDER_OPTIONS } from './constants';
import ConfigSummaryItem from './ConfigSummaryItem';

interface SummaryProps {
  formState: LessonFormState;
  onBack: () => void;
  onSubmit: () => void;
}

const Summary: React.FC<SummaryProps> = ({ formState, onBack, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { selectedLevel,
    selectedTask,
    selectedTaskId,
    selectedDomain,
    selectedDifficulty,
    sectionTotal,
    taskTime,
    generationMode,
    selectedProvider,
    lessonTitle,
    batchCount,
    avoidDuplicates } = formState;

  // Derive labels
  const taskLabel = useMemo(() => {
    if (!selectedTask) return 'Not selected';
    const found = TASK_OPTIONS.find((t) => t.value === selectedTask);
    const displayId = selectedTaskId ? selectedTaskId : found?.id;
    return found ? `${found.icon} ${found.name} (${displayId})` : 'Not selected';
  }, [selectedTask, selectedTaskId]);

  const domainLabel = useMemo(() => {
    const found = DOMAIN_OPTIONS.find((d) => d.value === selectedDomain);
    return found ? found.name : 'Random Selection';
  }, [selectedDomain]);

  const modeLabel = useMemo(() => {
    const found = MODE_OPTIONS.find((m) => m.value === generationMode);
    return found ? found.name : 'Single Lesson';
  }, [generationMode]);

  const providerLabel = useMemo(() => {
    const found = PROVIDER_OPTIONS.find((p) => p.value === selectedProvider);
    return found ? found.name : 'OpenAI (GPT-4)';
  }, [selectedProvider]);

  const completionPercentage = useMemo(() => {
    let count = 0;
    const total = 8;
    if (selectedLevel) count++;
    if (selectedTask) count++;
    if (selectedDomain) count++;
    if (selectedDifficulty) count++;
    if (sectionTotal > 0) count++;
    if (taskTime > 0) count++;
    if (generationMode) count++;
    if (selectedProvider) count++;
    return Math.round((count / total) * 100);
  }, [selectedLevel, selectedTask, selectedDomain, selectedDifficulty, sectionTotal, taskTime, generationMode, selectedProvider]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Configuration Summary Card — your exact design */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-6 text-white shadow-lg mb-6 animate-[slideInDown_0.5s_ease]">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/20">
          <div className="text-lg font-bold flex items-center gap-2">
            <span>📋</span>
            <span>Configuration Summary</span>
          </div>
          <div className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
            {completionPercentage}% Complete
          </div>
        </div>

        <ConfigSummaryItem
          icon="📚"
          label="CEFR Level"
          value={selectedLevel ?? ''}
          isComplete={!!selectedLevel}
        />
        <ConfigSummaryItem
          icon="📝"
          label="Task Type"
          value={taskLabel}
          isPlaceholder={!selectedTask}
          isComplete={!!selectedTask}
        />
        <ConfigSummaryItem
          icon="🎯"
          label="Domain"
          value={domainLabel}
          isComplete={!!selectedDomain}
        />
        {/* <ConfigSummaryItem
          icon="🎓"
          label="Difficulty Level"
          value={selectedDifficulty ? selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1) : 'Not selected'}
          isPlaceholder={!selectedDifficulty}
          isComplete={!!selectedDifficulty}
        /> */}
        {/* <ConfigSummaryItem
          icon="⏱️"
          label="Time & Length"
          value={sectionTotal && taskTime ? `${sectionTotal} min total / ${taskTime} min task` : 'Not complete'}
          isPlaceholder={!sectionTotal || !taskTime}
          isComplete={sectionTotal > 0 && taskTime > 0}
        /> */}
        <ConfigSummaryItem
          icon="⚙️"
          label="Generation Mode"
          value={modeLabel}
          isComplete={!!generationMode}
        />
        <ConfigSummaryItem
          icon="🤖"
          label="AI Provider"
          value={providerLabel}
          isComplete={!!selectedProvider}
        />

        {/* Extra details based on mode */}
        {generationMode === 'single' && lessonTitle && (
          <ConfigSummaryItem
            icon="✏️"
            label="Lesson Title"
            value={lessonTitle}
            isComplete={true}
          />
        )}
        {generationMode === 'batch' && (
          <>
            <ConfigSummaryItem
              icon="🔢"
              label="Batch Count"
              value={`${batchCount} variants`}
              isComplete={true}
            />
            <ConfigSummaryItem
              icon="🚫"
              label="Avoid Duplicates"
              value={avoidDuplicates ? 'Yes' : 'No'}
              isComplete={true}
            />
          </>
        )}
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl">
        <div className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
          <strong className="flex items-center gap-1.5 mb-2 text-[15px]">
            💡 What happens next?
          </strong>
          The AI will generate your lesson content based on these settings. You'll be able to
          review and edit the generated content before publishing it to students.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
        >
          ← Back to Edit
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={[
            'px-8 py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg',
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer',
          ].join(' ')}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Creating Lesson...
            </span>
          ) : ('🚀 Create Lesson')}
        </button>
      </div>
    </div>
  );
};

export default Summary;