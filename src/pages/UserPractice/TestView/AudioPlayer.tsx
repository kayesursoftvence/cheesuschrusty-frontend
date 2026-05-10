import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import type { JSX } from 'react';
import { FaVolumeUp, FaSpinner, FaPause } from 'react-icons/fa';
import { usePlayForTestingQuery } from '@/redux/features/audio/audioApi';

interface AudioPlayerProps {
  maxPlays?: number;
  questionData?: any; // To be refined in Wave 3
  onStartTimer?: () => void;
}

interface ListeningAudioData {
  title: string;
  instructions: string;
  stimulusText: string;
}

function normalizeListeningData(res: any): ListeningAudioData {
  if (!res || !res.data) return { title: "", instructions: "", stimulusText: "" };
  
  const content = res.data.content;
  if (!content) return { title: "", instructions: "", stimulusText: "" };

  const handout = content.student_handout ?? {};
  const teacher = content.teacher_pack ?? {};

  const stimulus = handout.stimulus ?? teacher?.content?.stimulus ?? {};
  
  // Clean stimulus text if it's an object with body/content fields from another layout
  let stimulusText = stimulus.text || "";
  if (typeof teacher?.content === 'string') {
    stimulusText = teacher?.content;
  }

  return {
    title: stimulus.title || "",
    instructions: handout.instructions || content.instructions || "",
    stimulusText: stimulusText,
  };
}


export default function AudioPlayer({ maxPlays = 2, questionData, onStartTimer }: AudioPlayerProps): JSX.Element {

  // console.log(questionData)
  const [playsRemaining, setPlaysRemaining] = useState(maxPlays);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStage, setCurrentStage] = useState<'IDLE' | 'TITLE' | 'INSTRUCTIONS' | 'STIMULUS' | 'DONE'>('IDLE');
  const [countdown, setCountdown] = useState<number | null>(null);
  const autoplayStarted = useRef(false);
  
  const audioData = useMemo(() => normalizeListeningData(questionData), [questionData]);

  const { data: titleAudioUrl, isFetching: isFetchingTitle } = usePlayForTestingQuery(
    { text: audioData.title }, { skip: !audioData.title }
  );
  
  const { data: instructionsAudioUrl, isFetching: isFetchingInstructions } = usePlayForTestingQuery(
    { text: audioData.instructions }, { skip: !audioData.instructions }
  );

  const { data: stimulusAudioUrl, isFetching: isFetchingStimulus } = usePlayForTestingQuery(
    { text: audioData.stimulusText }, { skip: !audioData.stimulusText }
  );

  // Use refs to keep track of Audio instances so we can pause them if unmounted/paused
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isPreparing = isFetchingTitle || isFetchingInstructions || isFetchingStimulus;
  const noAudioAvailable = !titleAudioUrl && !instructionsAudioUrl && !stimulusAudioUrl;

  const playAudioInstance = useCallback((url: string, isStimulus = false): Promise<void> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.onloadedmetadata = () => {
        if (isStimulus) {
          setCountdown(Math.ceil(audio.duration));
          timerRef.current = setInterval(() => {
            const remaining = Math.max(0, Math.ceil(audio.duration - audio.currentTime));
            setCountdown(remaining);
          }, 500);
        }
      };

      audio.onended = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setCountdown(null);
        resolve();
      };

      audio.onerror = (e) => {
        if (timerRef.current) clearInterval(timerRef.current);
        setCountdown(null);
        reject(e);
      };
      
      audio.play().catch((err) => {
        // Handle autoplay block
        console.warn("Audio play blocked (likely by browser autoplay policy):", err);
        setIsPlaying(false);
        autoplayStarted.current = false; // Allow manual retry or later autoplay attempt
        reject(err);
      });
    });
  }, []);

  const playSequence = useCallback(async () => {
    if (isPlaying) return;

    setIsPlaying(true);
    setCurrentStage('IDLE');
    setCountdown(null);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    try {
      if (instructionsAudioUrl) {
        setCurrentStage('INSTRUCTIONS');
        await playAudioInstance(instructionsAudioUrl as string);
        
        await delay(3000);
      }

      if (titleAudioUrl) {
        setCurrentStage('TITLE');
        await playAudioInstance(titleAudioUrl as string);
        
        await delay(1000);
      }

      if (stimulusAudioUrl && playsRemaining > 0) {
        // Trigger the Task Header Timer ONLY when stimulus starts
        if (onStartTimer) {
          onStartTimer();
        }

        // Play limit decrement starts HERE when stimulus starts
        setPlaysRemaining((prev) => prev - 1);
        setCurrentStage('STIMULUS');
        await playAudioInstance(stimulusAudioUrl as string, true);
      }
    } catch (err) {
      console.error("Audio playback interrupted", err);
    } finally {
      setIsPlaying(false);
      setCurrentStage('DONE');
      setCountdown(null);
      audioRef.current = null;
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isPlaying, instructionsAudioUrl, titleAudioUrl, stimulusAudioUrl, playsRemaining, onStartTimer, playAudioInstance]);

  // Autoplay logic
  useEffect(() => {
    if (!isPreparing && !noAudioAvailable && !autoplayStarted.current && (titleAudioUrl || instructionsAudioUrl || stimulusAudioUrl)) {
      autoplayStarted.current = true;
      playSequence();
    }
  }, [isPreparing, noAudioAvailable, titleAudioUrl, instructionsAudioUrl, stimulusAudioUrl, playSequence]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  return (
    <div className="bg-slate-800 border-2 border-slate-700/50 p-6 rounded-2xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden group">
      {/* Visual background pulse during stimulus playback */}
      {isPlaying && currentStage === 'STIMULUS' && (
        <div className="absolute inset-0 bg-blue-500/5 animate-pulse pointer-events-none" />
      )}

      <div className="flex items-center gap-6 relative z-10">
        <div className="relative">
          {isPlaying ? (
            <button
              onClick={handlePause}
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl transition-all bg-yellow-600 hover:bg-yellow-500 shadow-[0_0_20px_rgba(202,138,4,0.3)] cursor-pointer"
            >
              <FaPause />
            </button>
          ) : (
            <button
              onClick={playSequence}
              disabled={isPreparing || (noAudioAvailable && !isPreparing)}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl transition-all transform hover:scale-105 ${
                noAudioAvailable && !isPreparing
                  ? 'bg-slate-700 cursor-not-allowed opacity-50'
                  : isPreparing
                    ? 'bg-blue-400 cursor-wait'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] cursor-pointer'
              }`}
            >
              {isPreparing ? <FaSpinner className="animate-spin" /> : <FaVolumeUp />}
            </button>
          )}

          {/* Countdown Ring (Visual aid during stimulus) */}
          {currentStage === 'STIMULUS' && countdown !== null && (
            <div className="absolute -inset-1 border-2 border-yellow-500/30 rounded-full animate-ping pointer-events-none" />
          )}
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white tracking-tight">
              {isPreparing 
                ? 'Preparing Audio...' 
                : isPlaying 
                  ? (
                    <span className="flex items-center gap-2">
                      <span className="text-blue-400">Playing:</span> {currentStage}
                    </span>
                  )
                  : noAudioAvailable
                    ? 'No Audio Content'
                    : 'Listening Stimulus'
              }
            </h3>
            {currentStage === 'STIMULUS' && countdown !== null && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-3 py-1 rounded-full text-lg font-mono font-bold animate-pulse">
                {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
              </div>
            )}
          </div>
          <p className={`text-sm mt-1 font-medium ${isPreparing || noAudioAvailable ? 'text-orange-400' : 'text-slate-400'}`}>
            {isPreparing
              ? 'Fetching audio files from server...'
              : noAudioAvailable 
                ? 'Stimulus audio could not be generated.' 
                : isPlaying && currentStage === 'STIMULUS'
                  ? 'Recording in progress. Limit in effect.'
                  : 'Audio starts automatically when ready.'
            }
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 relative z-10">
        <div className="text-right bg-slate-900/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-slate-700/50 shadow-inner group-hover:border-slate-600 transition-colors">
          <div className={`text-lg font-bold mb-0.5 ${playsRemaining > 0 ? 'text-yellow-500' : 'text-red-500'}`}>
            {playsRemaining} {playsRemaining === 1 ? 'Play' : 'Plays'} Left
          </div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            Stimulus Play Limit
          </div>
        </div>
      </div>
    </div>
  );
}