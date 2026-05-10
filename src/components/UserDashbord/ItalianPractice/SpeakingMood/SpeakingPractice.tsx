/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from 'react';
import { Loader2, ChevronLeft, Mic, Square } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGetLessonQuestionSetQuery } from '@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi';
import { useSpeakingPerformanceMutation } from '@/redux/features/lesson/speakingAi/speakingAiApi';
import { useSpeechToTextMutation } from '@/redux/features/audio/audioApi';
import Header from '@/components/Header/Header';
import CompletionPage from './CompletionPage';
import toast from 'react-hot-toast';

// Type definitions for better type safety
interface SpeakingContent {
  instructions: string;
  targetText: string;
  studentCard?: string;
  header?: string;
  topic?: string;
}

const SpeakingPractice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lessonId = location.state?.lessonId;
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [finalTime, setFinalTime] = useState<number>(0);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioFileData, setAudioFileData] = useState<File | null>(null)
  const [voiceText, setVoiceText ] = useState('');
  const sessionTimestamp = React.useMemo(() => location.state?.timestamp || Date.now(), [location.state?.timestamp, lessonId]);

  const { data: questionSetData, isLoading: isLoadingQS } = useGetLessonQuestionSetQuery(
    { lessonId: Number(lessonId!), timestamp: sessionTimestamp } as any,
    { skip: !lessonId }
  );

  const [evaluateSpeaking] = useSpeakingPerformanceMutation();
  const [speechToText, { isLoading: isSttLoading }] = useSpeechToTextMutation();

  const normalizedContent = useMemo((): SpeakingContent | null => {
    if (!questionSetData?.data?.content) return null;

    const content = questionSetData.data.content;
    const isFirstType = content.hasOwnProperty('PART_2_STUDENT_HANDOUT') || content.hasOwnProperty('PART_1_TEACHER_PACK');
    const isSecondType = content.hasOwnProperty('student_handout') || content.hasOwnProperty('teacher_pack');

    // First type (lessonId: 75)
    if (isFirstType) {
      const studentHandout = content.student_handout || content.PART_2_STUDENT_HANDOUT || content['PART 2: STUDENT_HANDOUT (PRINTABLE)'];
      const instructions = studentHandout?.Instructions || content.instructions || "";
      const studentCard = studentHandout?.Student_Card || studentHandout?.student_card || "";
      const targetText = studentHandout?.text || content.prompt || questionSetData.data.prompt || "Read the text aloud.";
      const header = content.HEADER || content.header || "";

      return {
        instructions,
        targetText,
        studentCard,
        header
      };
    }

    // Second type (lessonId: 83)
    if (isSecondType) {
      const studentHandout = content.student_handout;
      const teacherPack = content.teacher_pack;
      
      // Get instructions from multiple possible shapes:
      // - student_handout.instructions (string or { content })
      // - teacher_pack.content.examiner_script (prompts array / introduction)
      let instructions = "";
      if (typeof studentHandout?.instructions === 'string') {
        instructions = studentHandout.instructions;
      } else if (studentHandout?.instructions?.content) {
        instructions = studentHandout.instructions.content;
      } else if (teacherPack?.content?.examiner_script) {
        const es = teacherPack.content.examiner_script;
        if (Array.isArray(es.prompts)) {
          const sentences = es.prompts.slice(0, 2).join('. ');
          instructions = sentences ? sentences + '.' : '';
        } else if (typeof es.introduction === 'string') {
          instructions = es.introduction;
        } else if (typeof es.content === 'string') {
          const sentences = es.content.split(/[.!?]+/);
          instructions = sentences.slice(0,2).join('. ') + '.';
        }
      } else if (teacherPack?.examiner_script?.content) {
        // Legacy support: Take first few sentences from examiner script as instructions
        const script = teacherPack.examiner_script.content;
        const sentences = script.split(/[.!?]+/);
        instructions = sentences.slice(0, 2).join('. ') + '.';
      }

      // Get target text (stimulus.situation/content or examiner_script prompts/introduction)
      let targetText = "";
      if (studentHandout?.stimulus?.situation) {
        targetText = studentHandout.stimulus.situation;
      } else if (studentHandout?.stimulus?.content) {
        targetText = studentHandout.stimulus.content;
      } else if (teacherPack?.content?.examiner_script) {
        const es = teacherPack.content.examiner_script;
        if (Array.isArray(es.prompts)) targetText = es.prompts.join('\n');
        else if (typeof es.introduction === 'string') targetText = es.introduction;
        else if (typeof es.content === 'string') targetText = es.content;
      } else if (teacherPack?.examiner_script?.content) {
        targetText = teacherPack.examiner_script.content;
      } else {
        targetText = questionSetData.data.prompt || "Read the text aloud.";
      }

      // Get student card (stimulus content for reference)
      const studentCard = studentHandout?.stimulus?.content || studentHandout?.stimulus?.situation || "";

      // Get topic from header
      const topic = content.header?.topic || "";

      return {
        instructions,
        targetText,
        studentCard,
        topic
      };
    }

    // Fallback to basic data extraction
    return {
      instructions: content.instructions || "",
      targetText: content.prompt || questionSetData.data.prompt || "Read the text aloud.",
      studentCard: ""
    };
  }, [questionSetData]);

  // Support additional content formats (e.g., examiner_script may be string, object with script[], or instructions)
  const _contentRoot2 = questionSetData?.data?.content || {};
  const _tpLower = _contentRoot2.teacher_pack || _contentRoot2.teacher_pack?.content;
  const _tpUpper = _contentRoot2.TEACHER_PACK || _contentRoot2.TEACHER_PACK;

  const extractFromPack = (pack: any) => {
    if (!pack) return null;
    // possible locations for examiner script
    const candidate = pack.content?.examiner_script ?? pack.examiner_script ?? pack.Examiner_Script ?? pack.CONTENT ?? pack.KEY ?? null;
    if (!candidate) return null;
    if (typeof candidate === 'string') return candidate;
    if (Array.isArray(candidate)) return candidate.join('\n');
    if (typeof candidate === 'object' && candidate !== null) {
      // new format: examiner_script may have `prompts` array, `introduction`, and `follow_up`
      if (Array.isArray(candidate.prompts)) return candidate.prompts.join('\n');
      if (Array.isArray(candidate.script)) return candidate.script.join('\n');
      if (typeof candidate.introduction === 'string' && typeof candidate.follow_up === 'string') {
        return candidate.introduction + '\n\n' + candidate.prompts?.join('\n') + '\n\n' + candidate.follow_up;
      }
      if (typeof candidate.instructions === 'string') return candidate.instructions;
      if (typeof candidate.content === 'string') return candidate.content;
      try { return String(candidate); } catch { return null; }
    }
    return String(candidate);
  };

  const examinerScript =
    extractFromPack(_tpLower) ||
    extractFromPack(_tpUpper) ||
    normalizedContent?.instructions || '';

  // Uppercase-aware fallbacks (do not mutate normalizedContent)
  const _contentRoot = questionSetData?.data?.content || {};
  const uppercaseTeacher = _contentRoot.TEACHER_PACK || _contentRoot.TEACHER_PACK;
  const uppercaseStudent = _contentRoot.STUDENT_HANDOUT || _contentRoot.STUDENT_HANDOUT;
  const uppercaseInstructions =
    uppercaseStudent?.Instructions || uppercaseStudent?.instructions || uppercaseTeacher?.CONTENT || uppercaseTeacher?.KEY || '';
  const uppercaseStudentCard =
    uppercaseStudent?.Student_Card || uppercaseStudent?.Student_Card || uppercaseStudent?.Stimulus || uppercaseStudent?.Stimulus || '';
  const uppercaseHeader = _contentRoot.HEADER || _contentRoot.header || '';
  const uppercaseTopic = typeof uppercaseHeader === 'string' && uppercaseHeader.includes('|')
    ? uppercaseHeader.split('|')[3] || uppercaseHeader
    : uppercaseHeader;
console.log(uppercaseTopic)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      // setHasRecordingInitiated(true)

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {

        console.log("On Stop Initiate")
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        // handleProcessSpeech(audioFile);
        setAudioFileData(audioFile)
        const sttRes = await speechToText(audioFile).unwrap();

        console.log(sttRes)
        setVoiceText(sttRes.transcription)

      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      toast.error("Microphone access denied");
    }
  };

  useEffect(() => {
    if (isComplete) return;
    const timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const stopRecording = () => {
    
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      // setIsProcessing(true);
    }
  };

  const handleProcessSpeech = async (file: File, payload?: any) => {
    try {
      // Note: You've already done speech-to-text in the stopRecording handler
      // So we can skip that step here and use the existing voiceText
      
      // If you want to reconfirm STT, you can uncomment this:
      // const sttRes = await speechToText(file).unwrap();
      // const text = sttRes.text || sttRes.transcription || "";
      // setTranscription(text);
      // setVoiceText(text);
  
      // Use the payload passed or create a new one; include measured duration
      const durationSeconds = elapsedTime || undefined;
      const evaluationPayload = payload || {
        expected_text: normalizedContent?.targetText || "",
        audio: file,
        user_response: voiceText,
        duration_seconds: durationSeconds
      };
  
      const evalRes = await evaluateSpeaking(evaluationPayload as any).unwrap();
      // attach our measured duration if API didn't return it
      if (durationSeconds && !(evalRes?.duration_seconds || evalRes?.data?.duration_seconds)) {
        try { evalRes.duration_seconds = durationSeconds; } catch { /* ignore */ }
        try { if (evalRes.data) evalRes.data.duration_seconds = durationSeconds; } catch { /* ignore */ }
      }
      setEvaluationResult(evalRes);
      setFinalTime(elapsedTime);
      setIsComplete(true);
    } catch (err) {
      console.error("Error processing speech:", err);
      toast.error("Failed to process speech");
      setFinalTime(elapsedTime);
      setIsComplete(true);
    } finally {
      setIsProcessing(false);
    }
  };

  function submitVoice() {
    if (!audioFileData) {
      toast.error("No recording found. Please record your voice first.");
      return;
    }
  
    setIsProcessing(true);
    
    // Pass the expected target text, not the transcribed text
    const payload = {
      expected_text: normalizedContent?.targetText || "", // Use the target text as expected
      audio: audioFileData,
      user_response: voiceText // Include the transcribed text as user response
    };
  
    handleProcessSpeech(audioFileData, payload);
  }

  // Helper function to render text with line breaks as separate divs
  const renderTextWithLineBreaks = (text: string| any, lineClassName?: string, containerClassName?: string) => {
    if (!text && text !== 0) return null;

    // Normalize non-string inputs (arrays/objects) to a displayable string
    let normalizedText: string;
    if (typeof text === 'string') {
      normalizedText = text;
    } else if (Array.isArray(text)) {
      normalizedText = text.join('\n');
    } else if (typeof text === 'object' && text !== null) {
      if ('content' in text && typeof (text as any).content === 'string') {
        normalizedText = (text as any).content;
      } else if ('Stimulus' in text && typeof (text as any).Stimulus === 'string') {
        normalizedText = (text as any).Stimulus;
      } else if ('Student_Card' in text && typeof (text as any).Student_Card === 'string') {
        normalizedText = (text as any).Student_Card;
      } else {
        try {
          normalizedText = String(text);
        } catch {
          return null;
        }
      }
    } else {
      normalizedText = String(text);
    }

    const lines = normalizedText.split('\n');
    
    return (
      <div className={containerClassName}>
        {lines.map((line, index) => (
          <div key={index} className={lineClassName}>
            {line}
          </div>
        ))}
      </div>
    );
  };

  if (isLoadingQS || isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 dark:text-gray-300">Processing your speech...</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const fbScore = evaluationResult?.feedback_card?.score?.value || evaluationResult?.data?.feedback_card?.score?.value;
    const numericScore = fbScore ? parseInt(String(fbScore).replace('%','')) : (evaluationResult?.data?.score || evaluationResult?.score || 0);

    return (
      <CompletionPage
        score={numericScore}
        evaluationResult={evaluationResult}
        lessonId={lessonId ? String(lessonId) : null}
        onBackToPractice={() => navigate('/user/practice')}
        onPracticeAgain={() => { setIsComplete(false); }}
        exerciseResults={[]}
        totalExercises={1}
        durationSeconds={finalTime}
      />
    );
  }

  // If no data is available
  if (!normalizedContent) {
    return (
      <div className="min-h-screen dark:bg-gray-900 dark:text-white p-6">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate('/user/practice')} 
            className="flex items-center gap-2 mb-6 opacity-70 hover:opacity-100 dark:text-white text-gray-800"
          >
            <ChevronLeft /> Back to Practice
          </button>
          <Header title="Speaking Practice" subtitle="Improve your Italian pronunciation" />
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <p className="text-red-500">No speaking content available for this lesson.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 dark:text-white p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/user/practice')} 
          className="flex items-center gap-2 mb-6 opacity-70 hover:opacity-100 dark:text-white text-gray-800"
        >
          <ChevronLeft /> Back to Practice
        </button>

        <Header 
          title="Speaking Practice" 
          subtitle={normalizedContent.topic || "Improve your pronunciation"} 
        />

        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg mt-4 mb-2 w-max">
          <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span className="font-mono font-bold">{formatTime(elapsedTime)}</span>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
           <div className="mb-12">
              
              {(normalizedContent.instructions || uppercaseInstructions) && (
                <div className="text-sm opacity-70 mb-6 ">
                  {normalizedContent.instructions || uppercaseInstructions}
                </div>
              )}
              
              {(normalizedContent.studentCard || uppercaseStudentCard) && (
                <div className="text-sm opacity-70 mx-auto my-8 max-w-2xl text-left bg-gray-50 dark:bg-gray-700 p-4 rounded-lg ">
                  {renderTextWithLineBreaks(
                    normalizedContent.studentCard || uppercaseStudentCard,
                    "mb-2 last:mb-0",
                    ""
                  )}
                </div>
              )}
           </div>

           {/* Show teacher instruction (from teacher_pack examiner_script) if available */}
           {examinerScript && (
             <div className="mb-6 text-sm opacity-80 text-left max-w-2xl mx-auto">
               <h4 className="font-semibold mb-2">Examiner Script :</h4>
               <p className="whitespace-pre-line text-black dark:text-gray-300">
                 {examinerScript}
               </p>
             </div>
           )}

           <div className="flex flex-col items-center gap-6">
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 scale-110' : 'bg-blue-600 hover:bg-blue-700 shadow-xl'}`}
                disabled={isProcessing}
              >
                {isRecording ? (
                  <Square size={48} className="text-white" />
                ) : (
                  <Mic size={48} className="text-white" />
                )}
              </button>
              <p className="text-md font-medium text-gray-400 mb-4">
                {isRecording
                  ? 'Recording... Click to stop'
                  : isSttLoading
                  ? 'Processing speech...'
                  : 'Start practice — Click the mic to start'}
              </p>
           </div>

          {
            voiceText && voiceText.length > 0 
              && 
              <>
                <h3 className='font-md mb-4'> Your voice text is</h3>
                <p className="text-md font-lg mb-4 text-neutral-100">{ voiceText }</p>
                <button onClick={submitVoice} className='border cursor-pointer rounded-lg px-8 py-3 text-base '> Submit your voice </button>
              </>
          }
        </div>
      </div>
    </div>
  );
};

export default SpeakingPractice;