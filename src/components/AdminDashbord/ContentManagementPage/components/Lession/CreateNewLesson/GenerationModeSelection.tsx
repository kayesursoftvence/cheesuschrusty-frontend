// GenerationModeSelection.tsx
import React, { useState } from 'react';
import { GenerationMode } from './types';
import { MODE_OPTIONS } from './constants';
import Card from './Card';
import StepNavigation from './StepNavigation';

interface GenerationModeSelectionProps {
  generationMode: GenerationMode;
  lessonTitle: string;
  targetLanguage: string;
  nativeLanguage: string;
  generationSeed: string;
  batchCount: number;
  avoidDuplicates: boolean;
  onModeChange: (mode: GenerationMode) => void;
  onTitleChange: (title: string) => void;
  onTargetLanguageChange: (lang: string) => void;
  onNativeLanguageChange: (lang: string) => void;
  onGenerationSeedChange: (seed: string) => void;
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
  targetLanguage,
  nativeLanguage,
  generationSeed,
  batchCount,
  avoidDuplicates,
  onModeChange,
  onTitleChange,
  onTargetLanguageChange,
  onNativeLanguageChange,
  onGenerationSeedChange,
  onBatchCountChange,
  onAvoidDuplicatesChange,
  onNext,
  onBack,
  currentStep = 5,
  totalSteps = 7,
}) => {
  const [showValidation, setShowValidation] = useState(false);

  const canProceed =
    (generationMode === 'batch' || (generationMode === 'single' && lessonTitle.trim().length > 0)) &&
    targetLanguage.trim().length > 0 &&
    nativeLanguage.trim().length > 0;

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
        title="Generation Mode & Configuration"
        description="Configure lesson details, languages, and generation settings"
        status={canProceed ? 'completed' : 'required'}
      >
        {/* Mode Selector */}
        <div className="grid gap-3 mb-8">
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

        {/* Configuration Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Languages and Seed */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Target Language <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., English, Italian"
                value={targetLanguage}
                onChange={(e) => onTargetLanguageChange(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Native Language <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Bengali, English"
                value={nativeLanguage}
                onChange={(e) => onNativeLanguageChange(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Generation Seed
                <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1 font-normal">
                  Consistent seed for reproducible generations
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g., 42"
                value={generationSeed}
                onChange={(e) => onGenerationSeedChange(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* Right Column: Mode-specific fields */}
          <div className="space-y-5">
            {generationMode === 'single' ? (
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Lesson Title <span className="text-red-500">*</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1 font-normal">
                    Display title for students
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., A Trip to London"
                  value={lessonTitle}
                  onChange={(e) => onTitleChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Number of Variants <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={batchCount}
                    onChange={(e) => onBatchCountChange(Number(e.target.value))}
                    min={1}
                    max={50}
                    className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
                <label className="flex items-center gap-2.5 text-sm text-gray-900 dark:text-gray-100 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={avoidDuplicates}
                    onChange={(e) => onAvoidDuplicatesChange(e.target.checked)}
                    className="w-[18px] h-[18px] cursor-pointer accent-blue-500"
                  />
                  <span>Prevent duplicate variants</span>
                </label>
              </>
            )}
          </div>
        </div>

        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          canGoNext={true}
          onBack={onBack}
          onNext={handleNext}
          showValidation={showValidation && !canProceed}
          validationMessage="Please complete all required fields (*) to continue"
        />
      </Card>
    </div>
  );
};

export default GenerationModeSelection;