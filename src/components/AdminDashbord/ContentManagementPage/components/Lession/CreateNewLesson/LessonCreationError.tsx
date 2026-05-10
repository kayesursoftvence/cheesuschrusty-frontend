import React from 'react';

interface LessonCreationErrorProps {
  error: string;
  onRetry: () => void;
  onBack: () => void;
}

const LessonCreationError: React.FC<LessonCreationErrorProps> = ({ error, onRetry, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[400px] animate-[fadeIn_0.5s_ease]">
      <div className="w-24 h-24 mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Oops! Something went wrong
      </h2>
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 max-w-md w-full text-center">
        <p className="text-red-700 dark:text-red-400 text-sm font-mono break-words">
          {error || 'An unexpected error occurred during lesson generation.'}
        </p>
      </div>
      <div className="flex gap-4">
         <button 
           onClick={onBack}
           className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-xl font-semibold transition-colors cursor-pointer"
         >
           ← Back to Details
         </button>
         <button 
           onClick={onRetry}
           className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
         >
           Try Again
         </button>
      </div>
    </div>
  );
};

export default LessonCreationError;
