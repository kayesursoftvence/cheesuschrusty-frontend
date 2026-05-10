import React from 'react';
import { GenerationMode } from './types';

interface LessonCreationLoadingProps {
  generationMode: GenerationMode;
  batchProgress?: { current: number; total: number };
}

const LessonCreationLoading: React.FC<LessonCreationLoadingProps> = ({
  generationMode,
  batchProgress,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[400px]">
      <div className="relative w-24 h-24 mb-6">
        <svg className="animate-spin w-full h-full text-emerald-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 animate-pulse">
        Creating Lesson...
      </h2>
      
      {generationMode === 'batch' && batchProgress && batchProgress.total > 0 ? (
        <div className="w-full max-w-md mt-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Generating variants</span>
            <span>{batchProgress.current} of {batchProgress.total}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.round((batchProgress.current / batchProgress.total) * 100)}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
          Please wait while our AI generates your customized lesson content. This may take a few moments.
        </p>
      )}
    </div>
  );
};

export default LessonCreationLoading;
