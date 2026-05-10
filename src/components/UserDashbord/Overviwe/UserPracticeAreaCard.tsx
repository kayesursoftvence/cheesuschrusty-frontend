/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface PracticeAreaCardProps {
  name: string;
  icon: React.FC<any> | string;
  iconColor: string;
  completed: number;
  total: number;
  progress: number; // Direct from backend (can be 800, 500, etc.)
}

export const UserPracticeAreaCard: React.FC<PracticeAreaCardProps> = ({
  name,
  icon: Icon,
  iconColor,
  completed,

  progress,
}) => {
  // Cap the visual bar at 100%, but show real progress % in text
  const barWidth = Math.min(100, progress);

  return (
    <div className="p-4 rounded-xl bg-[#F8F8F8] dark:bg-[#111827]">
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-xl ${iconColor} bg-opacity-10`}>
          {typeof Icon === "string" ? (
            <img
              className="w-12 bg-gray-300 rounded-xl" // fixed: rounded-4xl → rounded-xl for better look
              src={Icon}
              alt={name}
            />
          ) : (
            <Icon className="w-6 h-6" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-200">
            {name}
          </h3>
          <p className="text-xs text-gray-500">{completed} Lessons completed</p>
        </div>
      </div>

      {/* PROGRESS BAR - VISUALLY CAPPED AT 100% */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-500 bg-[#111827] dark:bg-[#AFC7FF]"
          style={{ width: `${barWidth}%` }} // ← capped for clean look
        />
      </div>

      {/* TEXT SHOWS EXACT BACKEND VALUE (800%, 500%, etc.) */}
      <div className="text-sm font-medium text-[#A7A7A7] mt-3">
        {
          progress<100?progress:100
        }
        % Completed
      </div>
    </div>
  );
};
