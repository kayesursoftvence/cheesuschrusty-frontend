// DomainSelection.tsx
import React from 'react';
import { Domain } from './types';
import { DOMAIN_OPTIONS } from './constants';
import Card from './Card';
import StepNavigation from './StepNavigation';

interface DomainSelectionProps {
  selectedDomain: Domain;
  onDomainChange: (domain: Domain) => void;
  onNext: () => void;
  onBack: () => void;
}

const DomainSelection: React.FC<DomainSelectionProps> = ({
  selectedDomain,
  onDomainChange,
  onNext,
  onBack,
}) => {
  return (
    <div>
      <Card
        title="Content Domain"
        description="Choose the thematic context for the lesson"
        status="completed"
      >
        <div className="grid gap-2.5">
          {DOMAIN_OPTIONS.map((domain) => {
            const isActive = selectedDomain === domain.value;
            return (
              <button
                key={domain.value}
                onClick={() => onDomainChange(domain.value)}
                className={[
                  'border-2 rounded-lg py-3.5 px-4 flex items-center gap-3 transition-all duration-200 w-full text-left relative',
                  isActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 z-[2]'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 z-[1]',
                ].join(' ')}
              >
                <div
                  className={[
                    'w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0',
                    isActive ? 'bg-blue-500' : 'bg-gray-100 dark:bg-gray-700',
                  ].join(' ')}
                >
                  {domain.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {domain.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {domain.description}
                  </div>
                </div>
                {isActive && (
                  <div className="shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <StepNavigation
          currentStep={2}
          totalSteps={5}
          canGoNext={true}
          onBack={onBack}
          onNext={onNext}
        />
      </Card>
    </div>
  );
};

export default DomainSelection;