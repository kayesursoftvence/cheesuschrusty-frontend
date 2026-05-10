/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, ChevronLeft, Clock1, Edit3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import CompletionPage from './CompletionPage';
import { useGetLessonQuestionSetQuery } from '@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi';
import { useEvaluateWritingPerformanceMutation } from '@/redux/features/lesson/writingAi/writingPerformanceApi';
import Header from '@/components/Header/Header';

const WritingPractice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lessonId = location.state?.lessonId;

  const [apiData, setApiData] = useState<any>(null);
  const [essayText, setEssayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [finalTime, setFinalTime] = useState(0);

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

  // Stabilize the timestamp to prevent re-fetching on every timer tick
  const sessionTimestamp = React.useMemo(() => location.state?.timestamp || Date.now(), [location.state?.timestamp, lessonId]);

  const { data: questionSetData, isLoading: isLoadingQS, error: qsError } = useGetLessonQuestionSetQuery(
    { lessonId: Number(lessonId!), timestamp: sessionTimestamp } as any,
    { skip: !lessonId }
  );

  console.log(questionSetData)

  const [evaluatePerformance, { isLoading: isEvaluating }] = useEvaluateWritingPerformanceMutation();

  useEffect(() => {
    if (questionSetData?.success && questionSetData.data) {
      setApiData(questionSetData.data);
    }
  }, [questionSetData]);

  const handleSubmit = async () => {
    if (!essayText.trim()) return;

    const payload = {
      lesson: [{
        type: "writing-practice",
        passage: essayText,
        score: 0, // AI will determine
        accuracy_rate: 0
      }],
      overall_stats: { total_score: 0, accuracy: 0 },
      performance_status: "pending",
      feedback_message: "Essay submitted",
      exercise_breakdown: {}
    };

    try {
      const res = await evaluatePerformance(payload as any).unwrap();
      setEvaluationResult(res);
      setFinalTime(elapsedTime);
      setIsComplete(true);
    } catch (err) {
      console.error(err);
      setFinalTime(elapsedTime);
      setIsComplete(true);
    }
  };

  if (isLoadingQS || isEvaluating) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 dark:text-gray-300">Loading Writing Practice...</p>
        </div>
      </div>
    );
  }

  if (qsError || (!lessonId && !isComplete)) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 overflow-hidden">
        <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold dark:text-white">Empty lesson data found</h2>
          <button onClick={() => navigate('/user/practice')} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg ">Back</button>
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

  // Normalize multiple possible API formats for teacher/student handouts (case-insensitive keys)
  const _contentRoot = apiData?.content || {};

  // Helper to extract teacher-pack-like content from various shapes
  const extractTeacherPackValue = (root: any) => {
    if (!root) return null;
    const packs = [
      root.teacher_pack,
      root.PART_1_TEACHER_PACK,
      root.TEACHER_PACK,
      root.PART_1_TEACHER_PACK?.CONTENT,
    ];
    for (const p of packs) {
      if (!p) continue;
      // candidate may be string, object with MODEL_ANSWER/CONTENT/content, or array
      if (typeof p === 'string') return p;
      if (Array.isArray(p)) return p.join('\n');
      if (typeof p === 'object' && p !== null) {
        // uppercase MODEL_ANSWER (existing)
        if (typeof p.MODEL_ANSWER === 'string') return p.MODEL_ANSWER;
        if (Array.isArray(p.MODEL_ANSWER)) return p.MODEL_ANSWER.join('\n');

        // lowercase model_answer with nested content/text
        if (typeof p.model_answer === 'string') return p.model_answer;
        if (p.model_answer && typeof p.model_answer === 'object') {
          if (typeof p.model_answer.CONTENT === 'string') return p.model_answer.CONTENT;
          if (Array.isArray(p.model_answer.CONTENT)) return p.model_answer.CONTENT.join('\n');
          if (typeof p.model_answer.content === 'string') return p.model_answer.content;
          if (Array.isArray(p.model_answer.content)) return p.model_answer.content.join('\n');
          if (p.model_answer.content && typeof p.model_answer.content === 'object') {
            if (typeof p.model_answer.content.text === 'string') return p.model_answer.content.text;
            if (Array.isArray(p.model_answer.content.text)) return p.model_answer.content.text.join('\n');
          }
        }

        // CONTENT / content checks (existing)
        if (typeof p.CONTENT === 'string') return p.CONTENT;
        if (Array.isArray(p.CONTENT)) return p.CONTENT.join('\n');
        if (typeof p.content === 'string') return p.content;
        if (Array.isArray(p.content)) return p.content.join('\n');

        // instructions may itself be an object with nested content
        if (typeof p.instructions === 'string') return p.instructions;
        if (p.instructions && typeof p.instructions === 'object') {
          if (typeof p.instructions.content === 'string') return p.instructions.content;
          if (Array.isArray(p.instructions.content)) return p.instructions.content.join('\n');
        }
        if (typeof p.Instructions === 'string') return p.Instructions;
        if (p.Instructions && typeof p.Instructions === 'object') {
          if (typeof p.Instructions.content === 'string') return p.Instructions.content;
          if (Array.isArray(p.Instructions.content)) return p.Instructions.content.join('\n');
        }

        if (typeof p.KEY === 'string') return p.KEY;
        // If examiner-style script object exists with script array
        if (Array.isArray(p.script)) return p.script.join('\n');
        // fallback to stringifying object
        try { return String(p); } catch { /* fallthrough */ }
      }
    }
    return null;
  };

  // Helper to extract student-handout like prompt/card
  const extractStudentHandoutValue = (root: any) => {
    if (!root) return null;
    const sh = root.student_handout || root.STUDENT_HANDOUT || root.PART_1_STUDENT_HANDOUT;
    if (!sh) return null;
    if (typeof sh === 'string') return sh;
    // Prompt may be an object or string
    if (typeof sh.Prompt === 'string') return sh.Prompt;
    if (sh.Prompt && typeof sh.Prompt === 'object') {
      if (typeof sh.Prompt.content === 'string') return sh.Prompt.content;
      if (Array.isArray(sh.Prompt.content)) return sh.Prompt.content.join('\n');
    }

    // stimulus / Stimulus nested content
    if (typeof sh.Stimulus === 'string') return sh.Stimulus;
    if (sh.Stimulus && typeof sh.Stimulus === 'object') {
      if (typeof sh.Stimulus.content === 'string') return sh.Stimulus.content;
      if (Array.isArray(sh.Stimulus.content)) return sh.Stimulus.content.join('\n');
    }
    if (typeof sh.stimulus === 'string') return sh.stimulus;
    if (sh.stimulus && typeof sh.stimulus === 'object') {
      if (typeof sh.stimulus.content === 'string') return sh.stimulus.content;
      if (Array.isArray(sh.stimulus.content)) return sh.stimulus.content.join('\n');
    }

    // instructions nested content
    if (typeof sh.Instructions === 'string') return sh.Instructions;
    if (sh.Instructions && typeof sh.Instructions === 'object') {
      if (typeof sh.Instructions.content === 'string') return sh.Instructions.content;
      if (Array.isArray(sh.Instructions.content)) return sh.Instructions.content.join('\n');
    }
    if (typeof sh.instructions === 'string') return sh.instructions;
    if (sh.instructions && typeof sh.instructions === 'object') {
      if (typeof sh.instructions.content === 'string') return sh.instructions.content;
      if (Array.isArray(sh.instructions.content)) return sh.instructions.content.join('\n');
    }

    // student card
    if (typeof sh.Student_Card === 'string') return sh.Student_Card;
    if (typeof sh.student_card === 'string') return sh.student_card;

    try { return String(sh); } catch { return null; }
  };

  const teacherPackValue = extractTeacherPackValue(_contentRoot);
  const studentHandoutValue = extractStudentHandoutValue(_contentRoot);

  const modelAnswer = teacherPackValue || _contentRoot.PART_1_TEACHER_PACK?.CONTENT || apiData?.prompt || '';
  const handoutPrompt = studentHandoutValue || _contentRoot.Prompt || '';
  console.log(handoutPrompt)

  // Render helper for line breaks (safe for objects/arrays)
  const renderTextWithLineBreaks = (text: any, lineClassName?: string, containerClassName?: string) => {
    if (text === null || text === undefined) return null;
    let normalized: string;
    if (typeof text === 'string') normalized = text;
    else if (Array.isArray(text)) normalized = text.join('\n');
    else if (typeof text === 'object') {
      if (typeof text.content === 'string') normalized = text.content;
      else if (Array.isArray(text.script)) normalized = text.script.join('\n');
      else normalized = JSON.stringify(text);
    } else normalized = String(text);

    return (
      <div className={containerClassName}>
        {normalized.split('\n').map((line: string, i: number) => (
          <div key={i} className={lineClassName}>{line}</div>
        ))}
      </div>
    );
  };

  // console.log(modelAnswer)

  return (
    <div className="min-h-screen dark:bg-gray-900 dark:text-white p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/user/practice')} className="flex items-center gap-2 mb-6 opacity-70 hover:opacity-100">
          <ChevronLeft /> Back to Practice
        </button>

        <Header title="Writing Practice" subtitle="Hone your Italian writing skills" />

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
           <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
                    <Edit3 size={24} />
                 </div>
                 <div className=''>
                    <h2 className="text-2xl font-bold dark:text-white ">Writing Task</h2>
                    <p className="text-sm opacity-60 dark:text-white">Complete the prompt below</p>
                 </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Clock1 size={18} />
                <span className="font-mono font-bold">{formatTime(elapsedTime)}</span>
              </div>
           </div>

          
           <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8 text-left">
              <h3 className="font-bold text-lg mb-2">Instructions:</h3>
              {renderTextWithLineBreaks(modelAnswer, 'leading-relaxed dark:text-white', '')}
              {handoutPrompt && (
                <div className="mt-4 text-sm opacity-80 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <strong className="block mb-1">Prompt:</strong>
                  {renderTextWithLineBreaks(handoutPrompt, 'text-sm', '')}
                </div>
              )}
              {/* {studentHandoutValue && (
                <div className="mt-4 text-sm opacity-80 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <strong className="block mb-1">Student Card:</strong>
                  {renderTextWithLineBreaks(studentHandoutValue, 'text-sm', '')}
                </div>
              )} */}
           </div>

           <textarea
              className="w-full h-64 p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-600 outline-none resize-none transition-all text-lg"
              placeholder="Inizia a scrivere qui..."
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
           />

           <div className="flex justify-between items-center mt-8">
              <p className="text-sm opacity-60">{essayText.trim().split(/\s+/).filter(Boolean).length} words</p>
              <button 
                onClick={handleSubmit}
                disabled={!essayText.trim()}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
               >
                Submit for AI Evaluation
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WritingPractice;