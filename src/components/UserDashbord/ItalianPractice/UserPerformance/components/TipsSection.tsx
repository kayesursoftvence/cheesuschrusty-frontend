import type { JSX } from "react";

interface TipsSectionProps {
  tips: string[];
}

export default function TipsSection({ tips }: TipsSectionProps): JSX.Element {
  if (tips.length === 0) return <></>;
  
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Tips for Improvement
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip: string, index: number) => (
          <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 dark:text-blue-400 text-sm">✓</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
