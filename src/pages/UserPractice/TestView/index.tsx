// src/components/test/TestView.tsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { JSX } from 'react';
import type {
  TestState,
  LayoutType,
  TaskTypeConfig
} from './test.types';
import TestHeader from './TestHeader';
// import DevDataPanel from './DevDataPanel';
// import TaskHeader from './TaskHeader/TaskHeader';
import TrustBadge from './TrustBadge';
import LayoutRenderer from './LayoutRenderer';
// import AudioPlayer from './shared/AudioPlayer';
import AudioPlayer from './AudioPlayer';
import { useGetNextLessonQuery } from '@/redux/features/lesson/lessonPractice/lessonPracticeApi';
import { useGetLessonQuestionSetQuery } from '@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi';
import {
  SAMPLE_STATES,
  DEFAULT_TASK_ID
} from './__sampleData';

import { useParams, useSearchParams } from 'react-router-dom';
import CountdownTimer from './TaskHeader/CountdownTimer';


export default function TestView(): JSX.Element {
  const navigate = useNavigate();

  // ✅ Replace with Redux selector in production
  const [activeTaskId,
    // setActiveTaskId
  ] = useState(DEFAULT_TASK_ID);

  const { skill } = useParams();
  const [searchParams] = useSearchParams();

  const { domain, level, task } = Object.fromEntries(searchParams.entries());

  // skill - removed unused expression

  const hasRequiredParams = Boolean(skill && domain && level && task);

  const { data: nextLessonData, isLoading: isNextLessonLoading, isError: isNextLessonError } = useGetNextLessonQuery(
    { type: skill?.toUpperCase() ?? "", level: level ?? "", domain: domain ?? "", task_id: task ?? "" },
    { skip: !hasRequiredParams }
  );

  const lessonId = nextLessonData?.data?.id;

  const { data, isLoading: isQuestionSetLoading, isError: isQuestionSetError } = useGetLessonQuestionSetQuery(
    { lessonId: lessonId as any },
    { skip: !lessonId }
  );

  console.log("RTK Query Raw Data (data):", data);
  console.log("LessonId:", lessonId);

  // Derive layout logically from various possible fields
  const rawTaskType = 
    data?.data?.content?.calibration_metrics?.task_type || 
    data?.data?.content?.metadata?.task_type || 
    data?.data?.content?.teacher_pack?.scoring?.task_type || 
    "UNDEFINED";

  // Simple normalization to supported LayoutTypes
  let normalizedLayout: LayoutType = "MCQ";
  const upperTaskType = rawTaskType.toUpperCase();
  
  if (upperTaskType.includes("MCQ")) normalizedLayout = "MCQ";
  else if (upperTaskType.includes("MATCHING")) normalizedLayout = "MATCHING";
  else if (upperTaskType.includes("TRUE_FALSE") || upperTaskType.includes("TRUEFALSE")) normalizedLayout = "TRUEFALSE";
  else if (upperTaskType.includes("GAP_FILL") || upperTaskType.includes("GAPFILL")) normalizedLayout = "GAP_FILL";
  else if (upperTaskType.includes("TRANSFORMATION")) normalizedLayout = "TRANSFORMATION";
  else if (upperTaskType.includes("ERROR")) normalizedLayout = "ERROR_RECOGNITION";
  else if (upperTaskType.includes("WRITING")) normalizedLayout = "WRITING";
  else if (upperTaskType.includes("SPEAKING")) normalizedLayout = "SPEAKING";
  else normalizedLayout = upperTaskType as LayoutType;

  const layout = normalizedLayout;

  //   const state = SAMPLE_STATE;
  const state: TestState = SAMPLE_STATES[activeTaskId];
  const [writingText, setWritingText] = useState(state.writingText);

  // Timer Control State
  const [isTimerRunning, setIsTimerRunning] = useState(skill?.toLowerCase() !== 'listening');
  const [startTime] = useState(Date.now());
  const isRunning = isTimerRunning;
  
  // Extract time with multiple fallbacks
  const reaminingTime = 
    data?.data?.content?.metadata?.timer || 
    data?.data?.content?.metadata?.section_total || 
    data?.data?.content?.header?.section_total || 
    (state?.type?.time?.[state?.mode] || 0) * 60 || 
    30;

  const config: TaskTypeConfig =
    state.type.configs[state.mode] || state.type.configs['STANDARD'] || {};

  const isListening = skill?.toLocaleLowerCase() === 'listening';

  // Answer State
  const [userAnswers, setUserAnswers] = useState<string>('');

  // ─── Handlers ────────────────────────────────────────────────
  function onExit() {
    navigate('/user/practice');
  }

  function onSubmit() {
    console.log('Practice submitted. Answers:', userAnswers);

    // Construct search params to pass answers
    const params = new URLSearchParams();
    if (userAnswers) {
      params.append('answers', userAnswers);
    }

    // Also pass current context so feedback page knows what we were doing
    params.append('skill', skill || '');
    params.append('domain', domain || '');
    params.append('level', level || '');
    params.append('task', task || '');

    // Add Lesson ID for completion and feedback
    if (lessonId) {
      params.append('lessonId', String(lessonId));
    }

    if (writingText) {
      params.append('writing', writingText);
    }

    const duration = Math.floor((Date.now() - startTime) / 1000);
    params.append('timeSpent', String(duration));

    navigate({
      pathname: '/user/practice/test/feedback',
      search: `?${params.toString()}`
    });
  }

  function handleStartTimer() {
    setIsTimerRunning(true);
  }

  if (!hasRequiredParams) {
    return (
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#0b0f1a] z-50 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Invalid Request</h2>
          <p className="text-slate-500 dark:text-slate-400">Missing required parameters. Please ensure skill, domain, level, and task are provided.</p>
          <button
            onClick={() => navigate('/user/practice')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Return to Practice
          </button>
        </div>
      </div>
    );
  }

  const isLoading = isNextLessonLoading || isQuestionSetLoading;

  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#0b0f1a] z-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 dark:text-slate-400">Loading lesson data...</p>
      </div>
    );
  }

  if (isNextLessonError || isQuestionSetError || !nextLessonData?.data || !data?.data) {
    return (
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#0b0f1a] z-50 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">No Data Found</h2>
          <p className="text-slate-500 dark:text-slate-400">We couldn't find the lesson data you're looking for. It might have been removed or the parameters are incorrect.</p>
          <button
            onClick={() => navigate('/user/practice')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Return to Practice
          </button>
        </div>
      </div>
    );
  }


  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="absolute inset-0 bg-transparent dark:bg-[#0b0f1a] z-50 flex flex-col"
    >
      {/* ═══ Header ═══ */}
      <TestHeader data={data} onExit={onExit} onSubmit={onSubmit} />

      <div className="flex-1 flex flex-col overflow-hidden bg-transparent dark:bg-[#0b0f1a] relative z-0">
        {/* ═══ Dev Panel (remove in production) ═══ */}
        {/* <DevDataPanel data={data} state={state} /> */}

        {/* ═══ Task Header + Timer ═══ */}
        {/* <TaskHeader
          data={data}
          isRunning={isTimerRunning}
        /> */}
        <CountdownTimer
          seconds={reaminingTime}
          isRunning={isRunning}
          onFinish={() => console.log("finish 30 second timer")}
        />
        {/* ═══ Scrollable Content ═══ */}
        <div className="flex-1 p-8 overflow-y-auto [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-[#0b0f1a] [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full flex flex-col items-center">
          <div className="max-w-3xl w-full space-y-8">
            {/* ═══ Audio Player (Listening tasks only) ═══ */}

            {isListening && (
              <AudioPlayer
                maxPlays={2}
                questionData={data}
                onStartTimer={handleStartTimer}
              />
            )}

            {/* ═══ Task Layout (MCQ / Matching / Writing / etc.) ═══ */}
            <LayoutRenderer
              layout={layout}
              state={state}
              config={config}
              questionData={data}
              writingText={writingText}
              onWritingChange={setWritingText}
              onAnswerChange={setUserAnswers}
            />

            {/* ═══ Trust Badge ═══ */}
            <TrustBadge trust={state.type.trust} level={state.level} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}