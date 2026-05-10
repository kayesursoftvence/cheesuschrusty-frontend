import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioVolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
}

export const AudioVolumeControl: React.FC<AudioVolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute
}) => {
  const volumePercent = (isMuted ? 0 : volume) * 100;

  return (
    <div className="flex-1 min-w-[150px] mx-4">
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Volume</div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMute}
          className="text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        
        <div className="relative flex-1 h-4 flex items-center">
          <div className="absolute left-0 right-0 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div 
            className="absolute left-0 h-1.5 rounded-full bg-black dark:bg-white"
            style={{ width: `${volumePercent}%` }}
          ></div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={onVolumeChange}
            className="absolute left-0 right-0 w-full h-4 opacity-0 cursor-pointer z-10"
          />
          <div 
            className="absolute h-3 w-3 rounded-full bg-black dark:bg-white shadow"
            style={{ left: `calc(${volumePercent}% - 6px)` }}
          ></div>
        </div>
        
        <span className="text-xs text-gray-600 dark:text-gray-300 min-w-[40px] text-right">
          {Math.round(volumePercent)}%
        </span>
      </div>
    </div>
  );
};
