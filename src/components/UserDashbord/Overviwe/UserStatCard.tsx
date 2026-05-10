/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ProgressBar } from '@/components/ProgressBar/ProgressBar';

interface StatCardProps {
  title: string;
  value: number;
  total?: number; // optional — if not provided, no bar
  icon: React.FC<any>;
  iconColor: string;
  progressBarColor: string;
  unit?: string;
}

export const UserStatCard: React.FC<StatCardProps> = ({
  title,
  value,
  total,
  icon: Icon,
  iconColor,
  progressBarColor,
  unit = "m",
}) => {
  const isFraction = total !== undefined && total > 0;
  const displayValue = isFraction ? `${value}/${total}` : `${value}${unit}`;

  // Calculate percentage directly from value/total — no extra logic
  const percentage = isFraction ? (value / total) * 100 : 0;

  return (
    <div className="bg-white dark:bg-[linear-gradient(180deg,#34495E_0%,#2C3E50_100%)] rounded-xl p-5 border border-gray-200 dark:border-gray-500 shadow-sm">
      <div className="flex justify-between items-center mb-2 flex-wrap">
        <span className="text-[#A7A7A7] font-medium text-base w-full sm:w-auto mb-2 sm:mb-0">
          {title}
        </span>
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>

      <div className="text-2xl sm:text-4xl font-bold text-[#333] dark:text-gray-200 mb-3">
        {displayValue}
      </div>

      {/* Progress Bar — shows EXACTLY value/total ratio */}
      {isFraction && (
        <ProgressBar
          progress={percentage} // ← direct % from value/total
          color={progressBarColor}
          height="h-2.5"
          rounded="rounded-lg"
        />
      )}
    </div>
  );
};
