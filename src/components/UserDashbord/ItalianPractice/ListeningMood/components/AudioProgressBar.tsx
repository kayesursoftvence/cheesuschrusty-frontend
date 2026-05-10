import React from 'react';

interface AudioProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  formatTime: (time: number) => string;
}

export const AudioProgressBar: React.FC<AudioProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  formatTime
}) => {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(parseFloat(e.target.value));
  };

  return (
    <div className="mb-6">
      <input
        type="range"
        min={0}
        max={duration || 100}
        value={currentTime}
        onChange={handleSeekChange}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer range-slider-thumb-hidden"
        style={{
          background: `linear-gradient(to right, black 0%, black ${progressPercent}%, #e5e7eb ${progressPercent}%, #e5e7eb 100%)`,
        }}
      />
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};
