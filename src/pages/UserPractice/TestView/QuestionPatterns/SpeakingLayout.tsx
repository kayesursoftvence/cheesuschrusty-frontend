// src/components/test/layouts/SpeakingLayout.tsx

import { useState, useRef, useEffect, useMemo } from 'react';
import type { JSX } from 'react';
import { SpeakingLayoutProps } from '../test.types';
import { useSpeechToTextMutation } from '@/redux/features/audio/audioApi';
import { Loader2, Mic, Square } from 'lucide-react';
import { FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { normalizeSpeakingPractice } from './SpeakingLayout.utils';

export default function SpeakingLayout({ state, config, questionData, onAnswerChange }: SpeakingLayoutProps): JSX.Element {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [voiceText, setVoiceText] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [speechToText, { isLoading: isSttLoading }] = useSpeechToTextMutation();
  
  const practiceData = useMemo(() => questionData ? normalizeSpeakingPractice(questionData) : null, [questionData]);
  const hasImage = useMemo(() => !!practiceData?.imageUrl || config?.hasImage || state.type.id === 'S-02', [practiceData, config, state.type.id]);

  // Timer effect
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        
        try {
          const res = await speechToText(file).unwrap();
          const transcript = res.text || res.transcription || "";
          setVoiceText(transcript);
          if (onAnswerChange) {
            onAnswerChange(transcript); // Send to TestView
          }
        } catch (err) {
          console.error("STT Error:", err);
          toast.error("Failed to transcribe speech");
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setElapsedTime(0);
      setVoiceText('');
    } catch (err) {
      console.error("Mic Error:", err);
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all tracks to release mic
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  function toggleRecording() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!practiceData) {
    return (
      <div className="bg-slate-800/50 border border-white/5 rounded-xl p-10 text-center text-slate-400">
        <p>No speaking instructions found in the provided data.</p>
      </div>
    );
  }

  // Determine speaking duration hint
  const taskId = practiceData.header.taskId || state.type.id;
  const speakingDuration = taskId === 'S-01' ? '2 to 3 minutes' : '1.5 minutes';

  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-xl p-10 relative overflow-hidden text-center">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>

      <h2 className="text-2xl font-bold mb-6 text-purple-400 uppercase tracking-widest">
        Speaking Task: {practiceData.header.domain || state.domainIt}
      </h2>

      {/* General Instructions */}
      {practiceData.instructions && (
        <div className="bg-blue-600/20 text-blue-300 border border-blue-500/30 p-4 rounded-lg flex gap-3 text-base leading-normal mb-8 text-left">
          <i className="fas fa-info-circle mt-1"></i>
          <span className="font-bold">
            {practiceData.instructions}
          </span>
        </div>
      )}

      {/* Image Rendering */}
      {hasImage && (
        <div className="mb-8 flex justify-center">
          {practiceData.imageUrl ? (
            <img 
              src={practiceData.imageUrl.startsWith('data:image') ? practiceData.imageUrl : `data:image/png;base64,${practiceData.imageUrl}`} 
              alt="Speaking Prompt" 
              className="max-w-full h-auto max-h-[400px] object-contain rounded-xl border border-slate-700 shadow-lg"
            />
          ) : (
            <div className="w-full max-w-lg h-64 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center text-slate-500">
              <span className="italic">Image missing</span>
            </div>
          )}
        </div>
      )}

      {/* Scenario prompt */}
      <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl text-left mb-8 shadow-inner whitespace-pre-line">
        <p className="text-slate-300 text-lg italic leading-relaxed">
          {practiceData.question.text || `"Immagina di essere in questa situazione: [Agent generates scenario for ${state.domain}]. Parla di questo argomento per ${speakingDuration}."`}
        </p>
      </div>

      {/* Record Button & Timer */}
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className={`flex items-center gap-3 px-6 py-2 rounded-full transition-colors ${isRecording ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-slate-900/50 text-slate-400 border border-slate-700'}`}>
          <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`}></div>
          <span className="font-mono text-xl font-bold">{formatTime(elapsedTime)}</span>
        </div>

        <button
          onClick={toggleRecording}
          disabled={isSttLoading}
          className={`w-28 h-28 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl ${
            isRecording
              ? 'bg-red-600'
              : 'bg-purple-600 hover:bg-purple-500 shadow-[0_0_30px_rgba(147,51,234,0.3)]'
          }`}
        >
          {isSttLoading ? (
            <Loader2 className="w-12 h-12 animate-spin" />
          ) : isRecording ? (
            <Square className="w-12 h-12 fill-current" />
          ) : (
            <Mic className="w-14 h-14" />
          )}
        </button>
        
        <div className="space-y-1">
          <p className="text-slate-200 font-bold uppercase tracking-widest text-sm">
            {isRecording ? 'Stop Recording' : isSttLoading ? 'Transcribing...' : 'Start Speaking'}
          </p>
          <p className="text-slate-500 text-xs italic">
            {isRecording ? 'Your audio is being captured' : isSttLoading ? 'Converting speech to text' : 'Click the microphone to begin'}
          </p>
        </div>

        {/* Transcription Preview */}
        {voiceText && (
          <div className="w-full max-w-2xl mt-8 p-6 bg-slate-900/80 rounded-2xl border border-slate-700 shadow-inner text-left">
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <i className="fas fa-quote-left"></i> Your Transcription
            </h4>
            <p className="text-slate-200 text-lg leading-relaxed italic">
              "{voiceText}"
            </p>
            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <FaCheck size={12}/> Ready for assessment
            </div>
          </div>
        )}
      </div>
    </div>
  );
}