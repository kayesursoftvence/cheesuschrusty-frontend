// StepNavigation.tsx
import React from 'react';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void | Promise<void>;
  nextLabel?: string;
  showValidation?: boolean;
  validationMessage?: string;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  canGoNext,
  onBack,
  onNext,
  nextLabel,
  showValidation = false,
  validationMessage,
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const label = nextLabel ?? (isLastStep ? 'Review Summary' : 'Next Step →');

  const handleNext = async () => {
    await onNext();
  };

  return (
    <div className="mt-6">
      {showValidation && validationMessage && (
        <div className="mb-4 px-4 py-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-400 dark:border-amber-500 rounded-lg text-[13px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <span>⚠️</span>
          <span>{validationMessage}</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          disabled={isFirstStep}
          className={[
            'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
            isFirstStep
              ? 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer',
          ].join(' ')}
        >
          ← Back
        </button>

        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
          Step {currentStep} of {totalSteps}
        </span>

        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className={[
            'px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
            canGoNext
              ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg cursor-pointer'
              : 'opacity-50 cursor-not-allowed bg-blue-300 dark:bg-blue-800 text-white',
          ].join(' ')}
        >
          {label}
        </button>
      </div>
    </div>
  );
};

export default StepNavigation;