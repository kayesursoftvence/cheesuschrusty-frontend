import type { JSX } from "react";

interface StatsGridProps {
  cefrOverall: string;
  correctCount: number;
  totalQuestions: number;
}

export default function StatsGrid({ cefrOverall, correctCount, totalQuestions }: StatsGridProps): JSX.Element {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 text-center border border-green-100 dark:border-green-800">
        <div className="text-3xl font-bold text-gray-900 dark:text-green-100 mb-1">{cefrOverall}</div>
        <div className="text-sm text-gray-600 dark:text-green-200">CEFR Level</div>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 text-center border border-blue-100 dark:border-blue-800">
        <div className="text-3xl font-bold text-gray-900 dark:text-blue-100 mb-1">{correctCount}</div>
        <div className="text-sm text-gray-600 dark:text-blue-200">Estimated Correct</div>
      </div>
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 text-center border border-purple-100 dark:border-purple-800">
        <div className="text-3xl font-bold text-gray-900 dark:text-purple-100 mb-1">{totalQuestions}</div>
        <div className="text-sm text-gray-600 dark:text-purple-200">Total Questions</div>
      </div>
    </div>
  );
}
