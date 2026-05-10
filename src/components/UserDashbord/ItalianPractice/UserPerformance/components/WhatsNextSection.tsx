import type { JSX } from "react";

export default function WhatsNextSection(): JSX.Element {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        What's Next?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="font-medium text-blue-800 dark:text-blue-300 mb-2">Review Mistakes</div>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Go back and review the questions you found challenging
          </p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
          <div className="font-medium text-green-800 dark:text-green-300 mb-2">Try Another Skill</div>
          <p className="text-sm text-green-700 dark:text-green-400">
            Practice speaking, writing, or listening to improve all-around
          </p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
          <div className="font-medium text-purple-800 dark:text-purple-300 mb-2">Set Daily Goal</div>
          <p className="text-sm text-purple-700 dark:text-purple-400">
            Aim for 20 minutes of practice daily to see consistent improvement
          </p>
        </div>
      </div>
    </div>
  );
}
