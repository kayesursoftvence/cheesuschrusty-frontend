import React from 'react';

interface AudioSpeedControlProps {
  speed: number;
  onSpeedChange: (increase: boolean) => void;
}

export const AudioSpeedControl: React.FC<AudioSpeedControlProps> = ({ speed, onSpeedChange }) => {
  return (
    <div className="flex flex-col items-start min-w-[120px]">
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Speed</div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onSpeedChange(false)}
          className="w-8 h-8 flex items-center justify-center border rounded text-sm text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:cursor-not-allowed"
          disabled={speed <= 0.5}
        >
          <span className="mb-0.5">-</span>
        </button>
        <div className="w-10 h-8 flex items-center justify-center border rounded font-medium text-sm text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
          {speed}x
        </div>
        <button
          onClick={() => onSpeedChange(true)}
          className="w-8 h-8 flex items-center justify-center border rounded text-sm text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:cursor-not-allowed"
          disabled={speed >= 3}
        >
          +
        </button>
      </div>
    </div>
  );
};
