import { useRef, useCallback, useEffect, useState } from "react";
import { getDialoguesText } from "./audioUtils";
import useListeningPracticeData from "./useListeningPracticeData";
import { useSpeechToTextPostMutation } from "@/redux/features/audio/audioApi";

export interface UseAudioPlayerReturn {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioSource: string;
  audioLoading: boolean;
  audioError: string | null;

  isPlaying: boolean;
  currentTime: number;
  duration: number;
  speed: number;
  volume: number;

  play: () => Promise<void>;
  pause: () => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  changeSpeed: (increase: boolean) => void;
  changeVolume: (volume: number) => void;

  regenerateAudio: () => Promise<void>;
  resetAudio: () => void;

  handleEnded: () => void;
  handleTimeUpdate: () => void;
  handleLoadedMetadata: () => void;
  handleAudioError: () => void;
}

interface SpeechToTextResponseWithBase64 {
  success: boolean;
  audioUrl: string;
  audioBase64?: string;
}

export default function useAudioPlayer(): UseAudioPlayerReturn {
  /* ---------------- State ---------------- */
  const [audioSource, setAudioSource] = useState("");
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);

  const audioRef = useRef<HTMLAudioElement>(null);
  const isMounted = useRef(true);
  const generationId = useRef(0);
  const objectUrlRef = useRef<string | null>(null);

  const { data } = useListeningPracticeData();
  const dialogues = data?.dialogues;

  const [speechToTextPost, { isLoading: isSpeechToTextPostLoading}] = useSpeechToTextPostMutation();

  /* ---------------- Audio Controls ---------------- */
  const play = useCallback(async () => {
    if (!audioRef.current || !audioRef.current.src) return;

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Play failed:", err);
      setIsPlaying(false);
    }
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !audioRef.current.src) return;
    if (audioRef.current.paused ) play() 
    else pause();
  }, [play, pause]);

  const seek = useCallback(
    (time: number) => {
      if (!audioRef.current) return;
      const validTime = Math.max(0, Math.min(time, duration || Infinity));
      audioRef.current.currentTime = validTime;
      setCurrentTime(validTime);
    },
    [duration]
  );

  const changeSpeed = useCallback((increase: boolean) => {
    setSpeed(prev => {
      const next = Math.min(Math.max(prev + (increase ? 0.25 : -0.25), 0.5), 3);
      if (audioRef.current) audioRef.current.playbackRate = next;
      return next;
    });
  }, []);

  const changeVolume = useCallback((v: number) => {
    const clamped = Math.min(Math.max(v, 0), 1);
    setVolume(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  }, []);
  


  const cleanupObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  /* ---------------- Audio Generation ---------------- */
  const regenerateAudio = useCallback(async () => {
    if (!dialogues?.length) {
      setAudioError("No dialogues available");
      return;
    }

    const currentGenId = ++generationId.current;

    try {
      setAudioLoading(true);
      setAudioError(null);
      
      // Clean up previous object URL
      cleanupObjectUrl();

      const text = getDialoguesText(dialogues);
      if (!text) throw new Error("Empty dialogue text");

      const result = await speechToTextPost(text).unwrap() as SpeechToTextResponseWithBase64;

      if (!isMounted.current || currentGenId !== generationId.current) return;

      let url = result.audioUrl;
      
      // Handle base64 audio data
      if (!url && result.audioBase64) {
        // Convert base64 to blob and create object URL
        try {
          const byteCharacters = atob(result.audioBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'audio/mp3' });
          url = URL.createObjectURL(blob);
          objectUrlRef.current = url;
        } catch (err) {
          console.log(err)
          throw new Error("Failed to process audio data");
        }
      }

      if (!url) throw new Error("No audio returned");

      setAudioSource(url);
    } catch (err) {
      if (!isMounted.current || currentGenId !== generationId.current) return;
      const message = err instanceof Error ? err.message : "Audio generation failed";
      setAudioError(message);
    } finally {
      if (isMounted.current && currentGenId === generationId.current) {
        setAudioLoading(false);
      }
    }
  }, [dialogues, speechToTextPost, cleanupObjectUrl]);

  /* ---------------- Audio Event Handlers ---------------- */
  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
    setAudioError(null); // clear stale errors
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleAudioError = useCallback(() => {
    if (!audioRef.current) return;
    setAudioError(audioRef.current.error?.message || "Audio playback error");
    setIsPlaying(false);
  }, []);

  /* ---------------- Effects ---------------- */
  useEffect(() => {
    if (!audioRef.current || !audioSource) return;

    const audio = audioRef.current;
    audio.src = audioSource;
    audio.playbackRate = speed;
    audio.volume = volume;

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleAudioError);

    audio.load();

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(err => {
        if (err.name !== "NotAllowedError") {
          console.error("Playback failed:", err);
          setAudioError(err.message || "Playback failed");
        }
        setIsPlaying(false);
      });

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleAudioError);
    };
  }, [
    audioSource,
    speed,
    volume,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleAudioError,
  ]);

  // Auto-generate once dialogues are ready
  useEffect(() => {
    if (
      dialogues?.length &&
      !audioSource &&
      !audioLoading &&
      !audioError
    ) {
      regenerateAudio();
    }
  }, [dialogues, audioSource, audioLoading, audioError, regenerateAudio]);

  // Cleanup on unmount
  useEffect(() => {
    isMounted.current = true;
    const currentAudio = audioRef.current;

    return () => {
      isMounted.current = false;
      generationId.current++;

      if (currentAudio) {
        currentAudio.pause();
        currentAudio.removeAttribute("src");
      }
    };
  }, []);

  /* ---------------- Reset ---------------- */
  const resetAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
    }

    setAudioSource("");
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioError(null);
    setAudioLoading(false);
  }, []);

  return {
    audioRef,
    audioSource,
    audioLoading: audioLoading || isSpeechToTextPostLoading,
    audioError,
    isPlaying,
    currentTime,
    duration,
    speed,
    volume,
    play,
    pause,
    togglePlayPause,
    seek,
    changeSpeed,
    changeVolume,
    regenerateAudio,
    resetAudio,
    handleEnded,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleAudioError,
  };
}


// import { useRef, useCallback, useEffect, useState } from "react";
// import { getDialoguesText } from "./audioUtils";
// import useListeningPracticeData from "./useListeningPracticeData";
// import { useSpeechToTextPostMutation } from "@/redux/features/audio/audioApi";



// export interface UseAudioPlayerReturn {
//   audioRef: React.RefObject<HTMLAudioElement | null>;
//   audioSource: string;
//   audioLoading: boolean;
//   audioError: string | null;

//   isPlaying: boolean;
//   currentTime: number;
//   duration: number;
//   speed: number;
//   volume: number;

//   play: () => Promise<void>;
//   pause: () => void;
//   togglePlayPause: () => void;
//   seek: (time: number) => void;
//   changeSpeed: (increase: boolean) => void;
//   changeVolume: (volume: number) => void;

//   regenerateAudio: () => Promise<void>;
//   resetAudio: () => void;
//   handleEnded: () => void;
//   handleTimeUpdate: () => void;
//   handleLoadedMetadata: () => void;
//   handleAudioError: () => void;
// }

// // handleTimeUpdate
// // handleLoadedMetadata
// // handleAudioError

// export default function useAudioPlayer(): UseAudioPlayerReturn {
//   /* ---------------- State ---------------- */
//   const [audioSource, setAudioSource] = useState("");
//   const [audioLoading, setAudioLoading] = useState(false);
//   const [audioError, setAudioError] = useState<string | null>(null);

//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [speed, setSpeed] = useState(1);
//   const [volume, setVolume] = useState(1);

//   const audioRef = useRef<HTMLAudioElement>(null);
//   const isMounted = useRef(true);
//   const generationId = useRef(0);

//   const { data } = useListeningPracticeData();
//   const dialogues = data?.dialogues;


//   // const text = getDialoguesText(dialogues);





//   const [speechToTextPost, { data: speechToTextPostData, isLoading: isSpeechToTextPostLoading, error: speechToTextPostError }] = useSpeechToTextPostMutation();
//   /* ---------------- Audio Controls ---------------- */
//   const play = useCallback(async () => {
//     if (!audioRef.current || !audioRef.current.src) return;

//     try {
//       await audioRef.current.play();
//       setIsPlaying(true);
//     } catch (err: any) {
//       console.error("Play failed:", err);
//       setIsPlaying(false);
//     }
//   }, []);

//   const pause = useCallback(() => {
//     if (!audioRef.current) return;
//     audioRef.current.pause();
//     setIsPlaying(false);
//   }, []);

//   const togglePlayPause = useCallback(() => {
//     if (!audioRef.current || !audioRef.current.src) return;
//     if (audioRef.current.paused)  play(); 
//     else pause();
    
//   }, [play, pause]);

//   const seek = useCallback((time: number) => {
//     if (!audioRef.current) return;
//     const validTime = Math.max(0, Math.min(time, duration || Infinity));
//     audioRef.current.currentTime = validTime;
//     setCurrentTime(validTime);
//   }, [duration]);

//   const changeSpeed = useCallback((increase: boolean) => {
//     setSpeed(prev => {
//       const next = Math.min(Math.max(prev + (increase ? 0.25 : -0.25), 0.5), 3);
//       if (audioRef.current) audioRef.current.playbackRate = next;
//       return next;
//     });
//   }, []);

//   const changeVolume = useCallback((v: number) => {
//     const clamped = Math.min(Math.max(v, 0), 1);
//     setVolume(clamped);
//     if (audioRef.current) audioRef.current.volume = clamped;
//   }, []);

//   /* ---------------- Audio Generation ---------------- */
//   const regenerateAudio = useCallback(async (): Promise<void> => {
//     if (!Array.isArray(dialogues) || dialogues.length === 0) {
//       setAudioError("No dialogues available");
//       return;
//     }

//     // Prevent multiple concurrent generations
//     const currentGenId = ++generationId.current;
    
//     try {
//       setAudioLoading(true);
//       setAudioError(null);

//       const text = getDialoguesText(dialogues);
//       if (!text) throw new Error("Empty dialogue text");

//       const result = await speechToTextPost(text).unwrap();
//       console.log(result)
      
//       // Check if we're still mounted and this is still the latest generation
//       if (!isMounted.current || currentGenId !== generationId.current) {
//         return;
//       }

//       const url = result.audioUrl ||
//         (result.audioBase64
//           ? `data:audio/mp3;base64,${result.audioBase64}`
//           : "");

//       if (!url) throw new Error("No audio returned");

//       setAudioSource(url);
//     } catch (err: any) {
//       if (!isMounted.current || currentGenId !== generationId.current) return;
//       setAudioError(err.message || "Audio generation failed");
//     } finally {
//       if (isMounted.current && currentGenId === generationId.current) {
//         setAudioLoading(false);
//       }
//     }
//   }, [dialogues]);
//   const handleTimeUpdate = useCallback(() => {
//     if (!audioRef.current) return;
//     setCurrentTime(audioRef.current.currentTime);
//   }, []);
  
//   const handleLoadedMetadata = useCallback(() => {
//     if (!audioRef.current) return;
//     setDuration(audioRef.current.duration);
//   }, []);
  
//   const handleEnded = useCallback(() => {
//     setIsPlaying(false);
//     setCurrentTime(0);
//   }, []);
  
//   const handleAudioError = useCallback(() => {
//     if (!audioRef.current) return;
//     setAudioError(audioRef.current.error?.message || "Audio playback error");
//     setIsPlaying(false);
//   }, []);

//   /* ---------------- Effects ---------------- */

//   // Setup audio element when source changes
//   useEffect(() => {
//     if (!audioRef.current || !audioSource) return;

//     const audio = audioRef.current;
//     audio.src = audioSource;
//     audio.playbackRate = speed;
//     audio.volume = volume;
    
//     // Set up event listeners
//     // Use the stable callback functions defined outside
//     audio.addEventListener('timeupdate', handleTimeUpdate);
//     audio.addEventListener('loadedmetadata', handleLoadedMetadata);
//     audio.addEventListener('ended', handleEnded);
//     audio.addEventListener('error', handleAudioError);

//     // Load and attempt to play (autoplay may be blocked by browser)
//     audio.load();
    
//     // Attempt autoplay
//     const playPromise = audio.play();
    
//     if (playPromise !== undefined) {
//       playPromise
//         .then(() => {
//           setIsPlaying(true);
//         })
//         .catch((error) => {
//           // Autoplay was prevented. This is expected.
//           // Don't log as error to avoid scary console messages.
//           if (error.name !== "NotAllowedError") {
//              console.error("Playback failed (not autoplay related):", error);
//              setAudioError(error.message || "Playback failed");
//           }
//           setIsPlaying(false);
//         });
//     }

//     return () => {
//       audio.removeEventListener('timeupdate', handleTimeUpdate);
//       audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
//       audio.removeEventListener('ended', handleEnded);
//       audio.removeEventListener('error', handleAudioError);
//     };
//   }, [audioSource, handleTimeUpdate, handleLoadedMetadata, handleEnded, handleAudioError, speed, volume]);

//   // Update playback rate when speed changes
//   // useEffect(() => {
//   //   if (audioRef.current) {
//   //     audioRef.current.playbackRate = speed;
//   //   }
//   // }, [speed]);

//   // Update volume when volume changes
//   // useEffect(() => {
//   //   if (audioRef.current) {
//   //     audioRef.current.volume = volume;
//   //   }
//   // }, [volume]);

//   // Auto-generate once data is ready
//   useEffect(() => {
//     if (dialogues && dialogues.length > 0 && !audioSource && !audioLoading && !audioError) {
//       regenerateAudio();
//     }
//   }, [dialogues, speechToTextPost]); // Only regenerate when dialogues change

//   // Cleanup
//   useEffect(() => {
//     isMounted.current = true;
    
//     return () => {
//       isMounted.current = false;
//       generationId.current++;
      
//       if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current.removeAttribute('src');
//       }
//     };
//   }, []);

//   /* ---------------- Reset Function ---------------- */
//   const resetAudio = useCallback(() => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.removeAttribute('src'); 
//     }

//     setAudioSource("");
//     setIsPlaying(false);
//     setCurrentTime(0);
//     setDuration(0);
//     setAudioError(null);
//     setAudioLoading(false);
//   }, []);

//   return {
//     audioRef,
//     audioSource,
//     audioLoading,
//     audioError,
//     isPlaying,
//     currentTime,
//     duration,
//     speed,
//     volume,
//     play,
//     pause,
//     togglePlayPause,
//     seek,
//     changeSpeed,
//     changeVolume,
//     regenerateAudio,
//     resetAudio,

//     handleEnded,
//     handleTimeUpdate,
//     handleLoadedMetadata,
//     handleAudioError
//   };
// }