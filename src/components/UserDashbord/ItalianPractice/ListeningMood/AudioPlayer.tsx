import React, { useState, useEffect } from 'react';
import { Headphones, SkipBack, SkipForward, Play, Pause, VolumeX } from 'lucide-react';
import { AudioProgressBar } from './components/AudioProgressBar';
import { AudioVolumeControl } from './components/AudioVolumeControl';
import { AudioSpeedControl } from './components/AudioSpeedControl';

interface AudioPlayerProps {
  src: string;
  isPlaying: boolean;
  onPlayClick: () => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  isLoading?: boolean;
  error?: string | null;
  onVolumeChange?: (volume: number) => void;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  src, 
  isPlaying, 
  onPlayClick,
  currentTime = 0,
  duration = 0,
  onSeek,
  isLoading = false,
  error = null,
  onVolumeChange,
  audioRef
}) => {
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [title, setTitle] = useState("Audio Playback");

  useEffect(() => {
    if (src && src.includes('/')) {
      setTitle(src.split('/').pop()?.split('.')[0] || "Audio Playback");
    } else {
      setTitle("Audio Playback");
    }
  }, [src]);

  const handleSkip = (seconds: number) => {
    if (onSeek) {
      const newTime = Math.min(Math.max(0, currentTime + seconds), duration);
      onSeek(newTime);
    }
  };

  const internalOnSeek = (time: number) => {
    if (onSeek) onSeek(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (audioRef?.current) {
      audioRef.current.volume = newVolume;
      audioRef.current.muted = newVolume === 0;
    }
    
    if (onVolumeChange) onVolumeChange(newVolume);
    
    if (newVolume > 0 && isMuted) setIsMuted(false);
    if (newVolume === 0) setIsMuted(true);
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    
    if (audioRef?.current) {
      audioRef.current.muted = newMuteState;
      if (!newMuteState && volume === 0) {
        const newVolume = 0.5;
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
        if (onVolumeChange) onVolumeChange(newVolume);
      }
    } else {
      if (newMuteState) {
        setVolume(0);
        if (onVolumeChange) onVolumeChange(0);
      } else {
        const newVolume = 0.5;
        setVolume(newVolume);
        if (onVolumeChange) onVolumeChange(newVolume);
      }
    }
  };

  const handleSpeedChange = (increase: boolean) => {
    let newSpeed = speed + (increase ? 0.25 : -0.25);
    newSpeed = Math.round(newSpeed * 100) / 100;
    if (newSpeed < 0.5) newSpeed = 0.5;
    if (newSpeed > 3) newSpeed = 3;
    setSpeed(newSpeed);
    
    if (audioRef?.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === Infinity) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mx-auto">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Loading audio...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-xl p-6 mx-auto">
        <div className="text-center text-red-600 dark:text-red-400">
          <VolumeX className="w-8 h-8 mx-auto mb-2" />
          <p className="font-medium">Audio Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!src) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mx-auto">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <VolumeX className="w-8 h-8 mx-auto mb-2" />
          <p>No audio available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</span>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-400">{formatTime(duration)}</span>
      </div>

      <AudioProgressBar 
        currentTime={currentTime} 
        duration={duration} 
        onSeek={internalOnSeek} 
        formatTime={formatTime} 
      />

      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={() => handleSkip(-5)}
          className="w-10 h-10 flex items-center justify-center border rounded-full text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          title="Skip Backward 5 seconds"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button
          onClick={onPlayClick}
          className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-md active:scale-95"
          style={{ backgroundImage: "linear-gradient(180deg, #667EEA 0%, #764BA2 100%)" }}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-1" />
          )}
        </button>

        <button
          onClick={() => handleSkip(5)}
          className="w-10 h-10 flex items-center justify-center border rounded-full text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          title="Skip Forward 5 seconds"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <AudioSpeedControl speed={speed} onSpeedChange={handleSpeedChange} />
        <AudioVolumeControl 
          volume={volume} 
          isMuted={isMuted} 
          onVolumeChange={handleVolumeChange} 
          onToggleMute={toggleMute} 
        />
      </div>
    </div>
  );
};
