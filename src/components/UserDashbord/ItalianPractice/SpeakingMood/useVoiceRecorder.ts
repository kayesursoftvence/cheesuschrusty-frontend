/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import * as wavEncoder from 'wav-encoder';
 
interface UseVoiceRecorderReturn {
  isRecording: boolean;
  recordingTime: number;
  audioBlob: Blob | null;
  audioFile: File | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  resetRecording: () => void;
  formatTime: (seconds: number) => string;
}

export const useVoiceRecorder = (): UseVoiceRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        try {
          const webmBlob = new Blob(chunksRef.current, { type: "audio/webm" });
          const arrayBuffer = await webmBlob.arrayBuffer();
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          const audioData = {
            sampleRate: audioBuffer.sampleRate,
            channelData: Array.from(
              { length: audioBuffer.numberOfChannels },
              (_, i) => audioBuffer.getChannelData(i)
            ),
          };

          const wavArrayBuffer = await wavEncoder.encode(audioData);
          const wavBlob = new Blob([wavArrayBuffer], { type: "audio/wav" });
          
          // Create a File object with proper naming
          const file = new File([wavBlob], `recording-${Date.now()}.wav`, {
            type: "audio/wav"
          });
          
          setAudioBlob(wavBlob);
          setAudioFile(file);
          
          // Stop all tracks
          streamRef.current?.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        } catch (error) {
          console.error("Error converting WebM to WAV:", error);
          toast.error("Failed to process audio recording");
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to access microphone. Please check permissions.");
      throw error;
    }
  };

  const stopRecording = async (): Promise<void> => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setIsRecording(false);
    }
  };

  const resetRecording = (): void => {
    setAudioBlob(null);
    setAudioFile(null);
    setRecordingTime(0);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  return {
    isRecording,
    recordingTime,
    audioBlob,
    audioFile,
    startRecording,
    stopRecording,
    resetRecording,
    formatTime
  };
};