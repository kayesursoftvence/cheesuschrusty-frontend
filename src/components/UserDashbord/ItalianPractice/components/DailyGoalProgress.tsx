import React from "react";
import tatgeticon from "../../../../assets/Dashbord/tergeticon.svg";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { DailyGoalProgressProps } from "../types";

export const DailyGoalProgress: React.FC<DailyGoalProgressProps> = ({ currentMinutes, totalMinutes, timeLeft }) => {
  const percentage = Math.round((currentMinutes / totalMinutes) * 100);
  return (
    <div className="bg-[#0E9F6E1A] p-4 sm:p-5 lg:p-6 rounded-xl border border-[#0E9F6E33] shadow-sm mb-4 sm:mb-6 lg:mb-8 dark:bg-[#0E9F6E1A] dark:border-[#0E9F6E33]">
      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-3 xs:gap-4 mb-3 sm:mb-4">
        <div className="flex gap-3 items-center flex-1 min-w-0">
          <img className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8" src={tatgeticon} alt="Target" />
          <div className="min-w-0 flex-1">
            <p className="text-sm sm:text-base lg:text-lg font-semibold text-[#111827] dark:text-gray-200 truncate ">
              Daily Goal Progress
            </p>
            <p className="text-xs sm:text-sm text-[#585858] dark:text-gray-50 truncate">
              {currentMinutes} of {totalMinutes} minutes completed
            </p>
          </div>
        </div>
        <div className="text-left xs:text-right">
          <p className="text-base sm:text-lg lg:text-xl font-bold from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent leading-none">
            {percentage}%
          </p>
          <p className="text-xs sm:text-sm text-[#585858] dark:text-gray-300">{timeLeft}</p>
        </div>
      </div>
      <ProgressBar progress={percentage} color="bg-black" showPercentage={false} className="mt-3 sm:mt-4" />
    </div>
  );
};
