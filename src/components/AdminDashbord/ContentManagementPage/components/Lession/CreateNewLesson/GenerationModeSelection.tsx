// GenerationModeSelection.tsx
import React, { useState } from 'react';
import { GenerationMode } from './types';
import { MODE_OPTIONS } from './constants';
import Card from './Card';
import StepNavigation from './StepNavigation';

interface GenerationModeSelectionProps {
  generationMode: GenerationMode;
  lessonTitle: string;
  batchCount: number;
  avoidDuplicates: boolean;
  onModeChange: (mode: GenerationMode) => void;
  onTitleChange: (title: string) => void;
  onBatchCountChange: (count: number) => void;
  onAvoidDuplicatesChange: (avoid: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep?: number;
  totalSteps?: number;
}

const GenerationModeSelection: React.FC<GenerationModeSelectionProps> = ({
  generationMode,
  lessonTitle,
  batchCount,
  avoidDuplicates,
  onModeChange,
  onTitleChange,
  onBatchCountChange,
  onAvoidDuplicatesChange,
  onNext,
  onBack,
  currentStep = 5,
  totalSteps = 7,
}) => {
  const [showValidation, setShowValidation] = useState(false);

  const canProceed =
    generationMode === 'batch' || (generationMode === 'single' && lessonTitle.trim().length > 0);

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
        title="Generation Mode"
        description="Create a single lesson or generate multiple variants"
        status={canProceed ? 'completed' : 'required'}
      >
        {/* Mode Selector */}
        <div className="grid gap-3">
          {MODE_OPTIONS.map((mode) => {
            const isActive = generationMode === mode.value;
            return (
              <button
                key={mode.value}
                onClick={() => {
                  onModeChange(mode.value);
                  setShowValidation(false);
                }}
                className={[
                  'border-2 rounded-xl p-5 text-left transition-all duration-200 w-full',
                  isActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:translate-x-1',
                ].join(' ')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={[
                      'w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0',
                      isActive ? 'bg-blue-500' : 'bg-gray-100 dark:bg-gray-700',
                    ].join(' ')}
                  >
                    {mode.icon}
                  </div>
                  <div className="text-base font-bold text-gray-900 dark:text-gray-100">
                    {mode.name}
                  </div>
                </div>
                <div className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  {mode.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* Single Mode Fields */}
        {generationMode === 'single' && (
          <div className="mt-6">
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Lesson Title <span className="text-red-500">*</span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1 font-normal">
                  This will be displayed to students and instructors
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g., B1c Listening: Healthcare Appointment Scheduling"
                value={lessonTitle}
                onChange={(e) => {
                  onTitleChange(e.target.value);
                  setShowValidation(false);
                }}
                className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-sans transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10"
              />
            </div>
          </div>
        )}

        {/* Batch Mode Fields */}
        {generationMode === 'batch' && (
          <div className="mt-6">
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Number of Variants <span className="text-red-500">*</span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1 font-normal">
                  How many unique versions should be generated?
                </span>
              </label>
              <input
                type="number"
                placeholder="e.g., 10"
                value={batchCount}
                onChange={(e) => onBatchCountChange(Number(e.target.value))}
                min={1}
                max={50}
                className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-sans transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10"
              />
            </div>

            <div className="mt-4 p-5 bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-sky-800/20 border border-sky-200 dark:border-sky-700 rounded-xl">
              <div className="flex items-center gap-2 text-[15px] mb-3 text-gray-900 dark:text-gray-100">
                <span>🎲</span>
                <strong>Auto-Generated Titles</strong>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Each variant will automatically receive a unique title based on:{' '}
                <strong className="text-gray-900 dark:text-gray-100">
                  Domain + Task ID + UUID
                </strong>
                <br />
                <br />
                Example:{' '}
                <code className="bg-blue-500/10 dark:bg-blue-400/15 px-2 py-0.5 rounded font-mono text-[13px] text-blue-500 dark:text-blue-400">
                  Health-L01-a7b3c9d2
                </code>
                <br />
                <br />
                Students will receive a random variant from the pool to ensure practice diversity.
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-sm text-gray-900 dark:text-gray-100 cursor-pointer mt-4">
              <input
                type="checkbox"
                checked={avoidDuplicates}
                onChange={(e) => onAvoidDuplicatesChange(e.target.checked)}
                className="w-[18px] h-[18px] cursor-pointer accent-blue-500"
              />
              <span>Prevent users from receiving duplicate variants</span>
            </label>
          </div>
        )}

        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          canGoNext={true}
          onBack={onBack}
          onNext={handleNext}
          showValidation={showValidation && !canProceed}
          validationMessage={
            generationMode === 'single'
              ? 'Please enter a lesson title to continue'
              : undefined
          }
        />
      </Card>
    </div>
  );
};

export default GenerationModeSelection;