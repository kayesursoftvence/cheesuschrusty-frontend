import React from "react";
import { Loader2, Volume2, Clock } from "lucide-react";
import { AudioPlayer } from "../AudioPlayer";
import { ExerciseTimer } from "./ExerciseTimer";
import { Phase, PHASES } from "../types";
import useAudioPlayer from "../hooks/useAudioPlayer";

interface AudioControllerProps {
  phase: Phase;
  showTips: boolean;
}

export const AudioController: React.FC<AudioControllerProps> = ({
  phase,
  showTips,
}) => {
  const {
    audioRef,
    audioLoading,
    audioError,
    audioSource,
    isPlaying,
    togglePlayPause,
    currentTime,
    duration,
    seek: handleSeek,
    play: handlePlay,
    pause: handlePause,
    handleEnded,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleAudioError,
    resetAudio,
  } = useAudioPlayer();

  // Reset audio state on mount and unmount to ensure fresh start
  React.useEffect(() => {
    resetAudio();
    return () => {
      resetAudio();
    };
  }, [resetAudio]);
  return (
    <div className="mb-8">
      <audio 
        ref={audioRef} 
        className="hidden" 
        preload="auto" 
        crossOrigin="anonymous"
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleAudioError}
      />
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 ">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Clock className="w-4 h-4" />
              <ExerciseTimer isRunning={([PHASES.QUESTIONS, PHASES.DICTATION, PHASES.SENTENCE] as Phase[]).includes(phase)} />
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg"><Volume2 className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div>
            <div>
              <h3 className="font-semibold text-lg">Audio Player</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {audioLoading ? "Generating audio..." : audioSource ? "Ready to play" : "Initializing session..."}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {audioLoading && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <p className="text-blue-600 text-sm">Generating audio automatically... pls wait</p>
              </div>
            </div>
          )}
          {audioError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 text-sm">
                {typeof audioError === 'boolean' ? "Audio Error" : audioError}
              </p>
            </div>
          )}
          {audioSource && !audioError && !audioLoading && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-green-400'}`} />
                <p className="text-green-600 text-sm">{isPlaying ? 'Playing...' : 'Audio ready to play'}</p>
              </div>
            </div>
          )}
        </div>

        {audioSource && (
          <div className="mt-4">
            <AudioControllerWrapped 
              src={audioSource} isPlaying={isPlaying} onPlayClick={togglePlayPause}
              currentTime={currentTime} duration={duration} onSeek={handleSeek}
              isLoading={audioLoading} error={typeof audioError === 'string' ? audioError : null} audioRef={audioRef}
            />
          </div>
        )}
      </div>

      <div className={`${showTips ? 'max-h-125 opacity-80': 'max-h-0 opacity-0'} mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg overflow-hidden transition-all duration-300 ease-in-out`}>
        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">💡 Audio Tips:</p>
        <ul className="text-sm text-yellow-700 dark:text-yellow-400 list-disc pl-5 space-y-1">
          <li>Audio generates automatically for each exercise</li>
          <li>Click Play to start listening</li>
          <li>Use headphones for better clarity</li>
          <li>You can replay multiple times</li>
          <li>Toggle translation to hear different versions</li>
        </ul>
      </div>
      
    </div>
  );
};

// Renamed to avoid collision or used as the imported AudioPlayer
const AudioControllerWrapped = AudioPlayer;
