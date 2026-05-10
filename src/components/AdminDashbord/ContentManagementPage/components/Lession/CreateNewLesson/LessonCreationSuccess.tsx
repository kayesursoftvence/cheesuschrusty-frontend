import React from 'react';

interface LessonCreationSuccessProps {
  onReset: () => void;
}

const LessonCreationSuccess: React.FC<LessonCreationSuccessProps> = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[400px] animate-[fadeIn_0.5s_ease]">
      <div className="w-24 h-24 mb-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Success!
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
        Your lesson has been successfully generated and saved. You can now view it or create another one.
      </p>
      <div className="flex gap-4">
         <button 
           onClick={onReset}
           className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-xl font-semibold transition-colors cursor-pointer"
         >
           Create Another Lesson
         </button>
      </div>
    </div>
  );
};

export default LessonCreationSuccess;
