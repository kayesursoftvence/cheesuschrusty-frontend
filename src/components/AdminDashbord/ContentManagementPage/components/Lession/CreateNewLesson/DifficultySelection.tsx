// DifficultySelection.tsx
import { useState } from 'react';
// import { DifficultyLevel } from './types';
// import { DIFFICULTY_OPTIONS } from './constants';
import Card from './Card';
import StepNavigation from './StepNavigation';
import type { JSX } from 'react';

type DifficultyLevel = 'easy' | 'medium' | 'hard';

export const DIFFICULTY_OPTIONS = [
  {
    value: 'easy' as const,
    name: 'Easy',
    icon: '🌱',
    description: 'Simplified vocabulary and shorter sentences. Ideal for building confidence.',
    badge: 'Beginner Friendly',
    color: 'green',
  },
  {
    value: 'medium' as const,
    name: 'Medium',
    icon: '🌿',
    description: 'Balanced complexity with natural language patterns. Standard difficulty.',
    badge: 'Recommended',
    color: 'amber',
  },
  {
    value: 'hard' as const,
    name: 'Hard',
    icon: '🌳',
    description: 'Complex structures, idiomatic expressions, and faster pace. For advanced practice.',
    badge: 'Challenging',
    color: 'red',
  },
];

interface Props {
  selectedDifficulty: DifficultyLevel | null;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export default function DifficultySelection({
  selectedDifficulty,
  onDifficultyChange,
  onNext,
  onBack,
  currentStep = 3,
  totalSteps = 6,
}: Props): JSX.Element {
  const [showValidation, setShowValidation] = useState(false);
  const canProceed = selectedDifficulty !== null;

  const handleNext = () => {
    if (!canProceed) {
      setShowValidation(true);
      return;
    }
    onNext();
  };

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    onDifficultyChange(difficulty);
    setShowValidation(false);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      green: {
        active: 'border-green-500 bg-green-50 dark:bg-green-900/30 shadow-[0_0_0_3px_rgba(34,197,94,0.1)]',
        badge: 'bg-green-500',
        icon: 'bg-green-100 dark:bg-green-900/50',
      },
      amber: {
        active: 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 shadow-[0_0_0_3px_rgba(245,158,11,0.1)]',
        badge: 'bg-amber-500',
        icon: 'bg-amber-100 dark:bg-amber-900/50',
      },
      red: {
        active: 'border-red-500 bg-red-50 dark:bg-red-900/30 shadow-[0_0_0_3px_rgba(239,68,68,0.1)]',
        badge: 'bg-red-500',
        icon: 'bg-red-100 dark:bg-red-900/50',
      },
    };
    return colors[color as keyof typeof colors] || colors.amber;
  };

  return (
    <div>
      <Card
        title="Difficulty Level"
        description="Choose the difficulty level for your lesson content"
        status={selectedDifficulty ? 'completed' : 'required'}
      >
        <div className="mb-6">
          <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span>⚡</span>
            <span>Select Difficulty</span>
          </h3>

          <div className="grid gap-4">
            {DIFFICULTY_OPTIONS.map((option) => {
              const isActive = option.value === selectedDifficulty;
              const colorClasses = getColorClasses(option.color);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleDifficultySelect(option.value)}
                  className={[
                    'border-2 rounded-xl p-5 text-left transition-all duration-200 w-full',
                    isActive
                      ? colorClasses.active
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 hover:-translate-y-0.5 cursor-pointer',
                  ].join(' ')}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={[
                        'w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0',
                        isActive
                          ? colorClasses.icon
                          : 'bg-gray-100 dark:bg-gray-700',
                      ].join(' ')}
                    >
                      {option.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[16px] font-bold text-gray-900 dark:text-gray-100">
                          {option.name}
                        </span>
                        <span
                          className={[
                            'text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide text-white',
                            colorClasses.badge,
                          ].join(' ')}
                        >
                          {option.badge}
                        </span>
                      </div>

                      <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        {option.description}
                      </p>
                    </div>

                    {/* Selection indicator */}
                    <div
                      className={[
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                        isActive
                          ? `border-${option.color}-500 bg-${option.color}-500`
                          : 'border-gray-300 dark:border-gray-500',
                      ].join(' ')}
                      style={
                        isActive
                          ? {
                              borderColor:
                                option.color === 'green'
                                  ? '#22c55e'
                                  : option.color === 'amber'
                                    ? '#f59e0b'
                                    : '#ef4444',
                              backgroundColor:
                                option.color === 'green'
                                  ? '#22c55e'
                                  : option.color === 'amber'
                                    ? '#f59e0b'
                                    : '#ef4444',
                            }
                          : {}
                      }
                    >
                      {isActive && (
                        <svg
                          className="w-3.5 h-3.5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty comparison hint */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-blue-500 text-lg">💡</span>
            <div className="text-[13px] text-blue-700 dark:text-blue-300">
              <strong>Tip:</strong> If you're unsure, start with{' '}
              <strong>Medium</strong> difficulty. You can always adjust in
              future lessons based on your performance.
            </div>
          </div>
        </div>

        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          canGoNext={true}
          onBack={onBack}
          onNext={handleNext}
          showValidation={showValidation && !canProceed}
          validationMessage="Please select a difficulty level to continue"
        />
      </Card>
    </div>
  );
}