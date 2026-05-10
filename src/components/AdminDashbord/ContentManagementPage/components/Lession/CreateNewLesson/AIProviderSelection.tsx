// AIProviderSelection.tsx
import React from 'react';
import { AIProvider } from './types';
import { PROVIDER_OPTIONS } from './constants';
import Card from './Card';
import StepNavigation from './StepNavigation';

interface AIProviderSelectionProps {
  selectedProvider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep?: number;
  totalSteps?: number;
}

const AIProviderSelection: React.FC<AIProviderSelectionProps> = ({
  selectedProvider,
  onProviderChange,
  onNext,
  onBack,
  currentStep = 6,
  totalSteps = 7,
}) => {
  return (
    <div>
      <Card
        title="AI Provider"
        description="Select the language model for content generation"
        status="completed"
      >
        <div className="grid gap-3">
          {PROVIDER_OPTIONS.map((provider) => {
            const isActive = selectedProvider === provider.value;
            return (
              <button
                key={provider.value}
                onClick={() => onProviderChange(provider.value)}
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
                    {provider.icon}
                  </div>
                  <div className="text-base font-bold text-gray-900 dark:text-gray-100">
                    {provider.name}
                  </div>
                </div>
                <div className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  {provider.description}
                </div>
              </button>
            );
          })}
        </div>

        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          canGoNext={true}
          onBack={onBack}
          onNext={onNext}
          nextLabel="Review Summary →"
        />
      </Card>
    </div>
  );
};

export default AIProviderSelection;