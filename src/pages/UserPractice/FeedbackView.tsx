import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RootState } from '@/store/store';
import { setSimulatedFeedbackTier } from '@/store/Slices/PracticeSlice/PracticeSlice';
import { Tier } from './types';
import { FaArrowRight, FaBookReader, FaBullseye, FaChartLine, FaCheck, FaInfo, FaLock,
  //  FaMapSigns,
    FaRandom, FaStar, FaTimes } from 'react-icons/fa';
import type { JSX } from 'react';
import { ListCheck, Loader2 } from 'lucide-react';

// Hooks & Utils
import { useGetLessonQuestionSetQuery } from '@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi';
import { useEvaluateReadingPerformanceMutation } from '@/redux/features/lesson/readingAI/readingPerformanceApi';
import { useEvaluateListeningPerformanceMutation } from '@/redux/features/lesson/listeningAi/listeningAiApi';
import { useEvaluateWritingPerformanceMutation } from '@/redux/features/lesson/writingAi/writingPerformanceApi';
import { useSpeakingPerformanceMutation } from '@/redux/features/lesson/speakingAi/speakingAiApi';
import { useEvaluateGrammarPerformanceMutation } from '@/redux/features/lesson/grammarAi/grammarPerformanceApi';
import { normalizePerformanceData } from '@/utils/performanceUtils';
import { useCompleteLessonMutation } from '@/redux/features/lesson/lessonPractice/lessonPracticeApi';
import { useGetMySubscriptionQuery } from '@/redux/features/subscriptions/subscriptionsApi';


// interface FeedbackQuestion {
//   id: string | number;
//   text?: string;
//   correct_answer?: string;
//   explanation?: string;
// }

// interface AnswerReviewItem {
//   id: number;
//   question: string;
//   userAnswer: string;
//   correctAnswer: string;
//   isCorrect: boolean;
//   explanation: string;
// }

// interface AnswerMapItem {
//   id: number;
//   type: 'correct' | 'incorrect' | 'missed';
//   icon: string;
// }

interface ImprovementPoint {
  critique?: string;
  fix?: string;
}

interface StrengthPoint {
  point: string;
}

export interface Props {
  title?: string;
  onClick?: () => void;
}

export default function Feedback(): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract Search Parameters
  const {
    answers: answersParam = '',
    lessonId = '',
    skill = '',
    domain = '',
    level = '',
    task = '',
    writing = '',
    timeSpent = ''
  } = Object.fromEntries(searchParams.entries());

  const practiceState = useSelector((state: RootState) => state.practice);
  const simulatedTier = practiceState.simulatedFeedbackTier;

  // AI Evaluation Hooks
  const [evaluateReading, { isLoading: isReadingEval, data: readingResult }] = useEvaluateReadingPerformanceMutation();
  const [evaluateListening, { isLoading: isListeningEval, data: listeningResult }] = useEvaluateListeningPerformanceMutation();
  const [evaluateWriting, { isLoading: isWritingEval, data: writingResult }] = useEvaluateWritingPerformanceMutation();
  const [evaluateSpeaking, { isLoading: isSpeakingEval, data: speakingResult }] = useSpeakingPerformanceMutation();
  const [evaluateGrammar, { isLoading: isGrammarEval, data: grammarResult }] = useEvaluateGrammarPerformanceMutation();
  const [completeLesson] = useCompleteLessonMutation();
  const [lessonMarkedComplete, setLessonMarkedComplete] = useState(false);

  const { data: subInfo } = useGetMySubscriptionQuery();
  const isActuallyPro = subInfo?.data?.isPro || subInfo?.data?.plan === 'PRO';

  const evaluationResult = readingResult || listeningResult || writingResult || speakingResult || grammarResult;

  const { data: questionSetData, isLoading: isQuestionSetLoading } = useGetLessonQuestionSetQuery(
    { lessonId: Number(lessonId) },
    { skip: !lessonId }
  );

  const isAnyEvalLoading = isReadingEval || isListeningEval || isWritingEval || isSpeakingEval || isGrammarEval;
  const isLoading = isQuestionSetLoading || isAnyEvalLoading;

  const onSetSimulatedTier = (t: Tier) => {
    if (t === 'Pro' && !isActuallyPro) return;
    dispatch(setSimulatedFeedbackTier(t));
  };

  function onExit() {
    navigate('/user/practice');
  }

  // Parse Student Answers
  const studentAnswers = useMemo(() => {
    if (!answersParam) return {};

    const obj: Record<string, string> = {};
    const pairs = answersParam.split(',');

    pairs.forEach(pair => {
      const splitIndex = pair.indexOf(':');
      if (splitIndex !== -1) {
        const seq = pair.substring(0, splitIndex).trim();
        const value = pair.substring(splitIndex + 1).trim();
        if (seq) obj[seq] = value;
      }
    });

    return obj;
  }, [answersParam]);

  // Trigger evaluation
  useEffect(() => {
    const content = questionSetData?.data?.content;
    if (content && !evaluationResult && !isAnyEvalLoading) {
      const practiceSkill = skill.toLowerCase();

      // Construct payload strictly based on skill
      const payload: Record<string, unknown> = {
        ...content,
        student_answers: { ...studentAnswers }
      };

      // Only add writing_text for writing tasks
      if (practiceSkill === 'writing' && writing) {
        payload.writing_text = writing;
      }

      if (practiceSkill === 'reading') evaluateReading(payload as unknown as Parameters<typeof evaluateReading>[0]);
      else if (practiceSkill === 'listening') evaluateListening(payload as unknown as Parameters<typeof evaluateListening>[0]);
      else if (practiceSkill === 'writing') evaluateWriting(payload as unknown as Parameters<typeof evaluateWriting>[0]);
      else if (practiceSkill === 'speaking') evaluateSpeaking(payload as unknown as Parameters<typeof evaluateSpeaking>[0]);
      else if (practiceSkill === 'grammar') evaluateGrammar(payload as unknown as Parameters<typeof evaluateGrammar>[0]);
    }
  }, [questionSetData, skill, studentAnswers, writing, evaluateReading, evaluateListening, evaluateWriting, evaluateSpeaking, evaluateGrammar, evaluationResult, isAnyEvalLoading]);

  // Auto-complete lesson when evaluation results are ready
  useEffect(() => {
    if (evaluationResult && !lessonMarkedComplete && lessonId) {
      const scoring = evaluationResult?.feedback?.scoring;
      const xp = evaluationResult?.feedback?.xp;
      const rawAccuracy = scoring?.final_score;
      const accuracy = Math.max(Number(rawAccuracy) || 0, 0.01);
      const xpEarned = Number(xp?.total_xp) > 0 ? Number(xp.total_xp) : 1;
      const durationSeconds = parseInt(timeSpent, 10) || 0;

      completeLesson({
        id: Number(lessonId),
        durationSeconds,
        accuracy,
        xpEarned
      });
      setLessonMarkedComplete(true);
    }
  }, [evaluationResult, lessonMarkedComplete, lessonId, completeLesson, timeSpent]);

  // Derived Results

  const normalizedData = useMemo(() => normalizePerformanceData(evaluationResult), [evaluationResult]);

  console.log('Evaluation Input:', { skill, studentAnswers, writing });
  console.log('Evaluation Result:', evaluationResult);
  console.log('Normalized Data:', normalizedData);

  console.log(evaluationResult)
  const finalScore = evaluationResult?.feedback?.scoring?.final_score

  const totalQuestions = useMemo(() => {
    const scoreVal = normalizedData?.score?.value || "";
    if (scoreVal.includes('/')) {
      return parseInt(scoreVal.split('/')[1], 10) || 0;
    }
    return Object.keys(studentAnswers).length || 10;
  }, [normalizedData, studentAnswers]);

  const formattedTimeSpent = useMemo(() => {
    if (!timeSpent) return "00:00";
    const totalSeconds = parseInt(timeSpent, 10);
    if (isNaN(totalSeconds)) return "00:00";
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, [timeSpent]);

  const isFree = isActuallyPro ? false : simulatedTier === 'Free';
  const total = totalQuestions || 10;

  // const answerReviewData = useMemo(() => {
  //   if (!questionSetData?.data?.content?.questions) return [];

  //   return questionSetData.data.content.questions.map((q: FeedbackQuestion, index: number) => {
  //     // Find user answer by ID or sequence
  //     const userAnswer = studentAnswers[String(q.id)] || studentAnswers[index + 1] || "";
  //     const correctAnswer = q.correct_answer || "";

  //     // Basic correctness check (can be improved for different layouts)
  //     const isCorrect = String(userAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();

  //     return {
  //       id: index + 1,
  //       question: q.text || "Question " + (index + 1),
  //       userAnswer,
  //       correctAnswer,
  //       isCorrect,
  //       explanation: q.explanation || ""
  //     };
  //   });
  // }, [questionSetData, studentAnswers]);

  // const answerMap = useMemo((): AnswerMapItem[] => {
  //   if (answerReviewData.length > 0) {
  //     return answerReviewData.map((item: AnswerReviewItem): AnswerMapItem => ({
  //       id: item.id,
  //       type: (item.isCorrect ? 'correct' : 'incorrect') as 'correct' | 'incorrect',
  //       icon: item.isCorrect ? '✅' : '❌'
  //     }));
  //   }

  //   const cells: AnswerMapItem[] = [];
  //   for (let i = 1; i <= total; i++) {
  //     cells.push({ id: i, type: 'correct', icon: '✅' });
  //   }
  //   return cells;
  // }, [answerReviewData, total]);

  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-[#0b0f1a] z-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">AI Coach is analyzing your performance...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="absolute inset-0 bg-[#0b0f1a] z-50 flex flex-col"
    >
      <div className="relative z-50 p-4 border-b border-slate-800 flex justify-between items-center shadow-lg bg-[#0b0f1a]">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="z-50 relative cursor-pointer p-2 rounded-lg transition-colors duration-200 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-red-900/50">
            {/* <i className="fas fa-times text-xl"></i> */}
            <FaTimes size={20} />
          </button>
          <div>
            <div className="text-xs text-green-400 font-bold uppercase tracking-widest">AI Agent Report</div>
            <h3 className="font-bold text-lg">Feedback Engine Output</h3>
          </div>
        </div>
        {!isActuallyPro && (
          <div className="flex items-center gap-3 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 px-2 font-bold uppercase tracking-widest">Simulate View:</span>
            <button onClick={() => onSetSimulatedTier('Free')} className={`px-4 py-1.5 rounded text-sm font-bold transition ${isFree ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Free</button>
            <button
              onClick={() => onSetSimulatedTier('Pro')}
              className={`px-4 py-1.5 rounded text-sm font-bold transition flex items-center gap-2 ${!isFree ? 'bg-yellow-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'} ${!isActuallyPro ? 'cursor-not-allowed opacity-75' : ''}`}
            >
              {!isActuallyPro && <FaLock size={10} />}
              Pro
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-bg-main [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full p-4 md:p-8 pb-20">
        <div className="max-w-4xl mx-auto w-full pb-10">
          <div className="mb-10 flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-slate-800 pb-6">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">{skill} Practice Report</h2>
              <p className="text-lg text-slate-400">AI Coach analysis for {domain}</p>
            </div>
            <div className="md:text-right bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <div className="text-sm font-bold text-emerald-400 mb-1 uppercase tracking-widest">
                {normalizedData?.readiness?.title || "Readiness for real exam"}
              </div>
              <div className="text-2xl text-white font-bold">{finalScore}% <span className="text-lg font-normal text-slate-300 ml-2">
                {normalizedData?.readiness?.message || "Building Foundation"}
              </span></div>
            </div>
          </div>

          <div className="bg-[#161d2f] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl mb-10">
            <div className="bg-linear-to-br from-blue-600 to-blue-900 p-6 text-center relative flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner shrink-0">
                <FaChartLine size={24} color='text-2xl text-white' />
              </div>
              <div className="sm:text-left text-center">
                <h3 className="text-2xl font-bold text-white mb-1">Review Complete</h3>
                <p className="text-sm text-white/90">Keep trying. Every attempt makes you better.</p>
              </div>
            </div>

            <div className="p-6 text-center">
              <div className="inline-block bg-slate-800 px-4 py-1.5 rounded-full text-xs font-bold text-slate-300 mb-6 uppercase tracking-wider shadow-inner">
                {level} {task}
              </div>
              <div className="text-6xl font-black text-white mb-2">{finalScore}%</div>
              <div className="text-slate-400 mb-6 font-medium text-sm">
                {normalizedData?.score?.title || "Final Score Estimation"}
              </div>
              <div className="bg-blue-900/20 text-blue-400 text-xs font-mono py-2 px-4 rounded-lg mb-8 border border-blue-900/50 max-w-lg flex items-center mx-auto">
                <div className='rounded-full bg-blue-200 w-fit h-fit p-0.5 self-start mt-0.5'><FaInfo size={7} className='w-fit h-fit' /></div>
                Note: This score is an AI-generated estimate designed for practice purposes. True exam performance may vary by a margin of plus or minus 5%.
              </div>

              <div className="relative w-full max-w-lg mx-auto h-2 bg-slate-800 rounded-full mb-3 shadow-inner">
                <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${finalScore}%` }}></div>
              </div>
              <div className="flex justify-between max-w-lg mx-auto text-xs text-slate-500 mb-8 font-medium px-2">
                <span>Developing</span>
                <span>Consistent practice builds proficiency.</span>
                <span>Target</span>
              </div>

              <div className="bg-bg-main/60 border border-white/10 rounded-xl p-6 text-center flex flex-col items-center justify-center py-4 mt-8">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3 w-full">Your CEFR Profile Today</div>
                <div className="flex flex-wrap items-center justify-center gap-6 text-slate-300 font-mono text-base w-full">
                  <span>Overall Level: <strong className="text-blue-400">{normalizedData?.cefr_profile?.details?.overall || "N/A"}</strong></span>
                  <span className="text-slate-600">|</span>
                  <span>Task Score: <strong className="text-white">{finalScore}/{total}</strong></span>
                  <span className="text-slate-600">|</span>
                  <span>Practice Time: <strong className="text-green-400">{formattedTimeSpent}</strong></span>
                </div>
              </div>

              {/* {skill.toLowerCase() !== 'writing' && skill.toLowerCase() !== 'speaking' && (
                <div className="mb-6 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-inner mt-8">
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                    <h4 className="font-bold text-white text-lg flex items-center">
                      <FaMapSigns className='text-blue-400 mr-2' /> Your Answer Map</h4>
                    <div className="flex gap-4 text-sm font-bold text-slate-300 bg-slate-800 py-2 px-4 rounded-lg">
                      <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-[4px] inline-block bg-green-500/20 border border-green-500/40"></div> Correct</span>
                      <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-[4px] inline-block bg-red-500/20 border border-red-500/40"></div> Incorrect</span>
                      <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-[4px] inline-block bg-yellow-500/20 border border-yellow-500/40"></div> Missed</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {answerMap.map((cell: AnswerMapItem) => (
                      <div key={cell.id} className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl font-bold font-mono relative ${cell.type === 'correct' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40' : cell.type === 'incorrect' ? 'bg-red-500/15 text-red-400 border border-red-500/40' : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/40'}`} title={`Question ${cell.id}`}>
                        <span className="text-[1.75rem] leading-none mb-0.5">{cell.id}</span>
                        <span className="text-[0.9rem]">{cell.icon}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}

              <button onClick={onExit} className="flex items-center mx-auto bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg text-base mt-8">Return to Practice
                <FaArrowRight className='ml-2' />
              </button>
            </div>
          </div>

          {isFree ? (
            <div className="relative rounded-2xl border border-gray-600/50 shadow-2xl mb-12 overflow-hidden bg-gray-900 p-12 text-center">
              <FaLock size={48} className='text-yellow-500 text-4xl mb-4 mx-auto' />
              <h3 className="text-2xl font-bold text-white mb-3">Unlock Your AI Coach Report</h3>
              <p className="text-sm text-gray-300 mb-6 max-w-xl mx-auto">Upgrade to Pro to discover exactly why you missed specific questions, review your error patterns, and get personalized exercises to improve immediately.</p>
              <button onClick={() => navigate('/#pricing')} className="bg-yellow-500 cursor-pointer hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-xl transition transform hover:scale-105">Upgrade to Pro Now</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
                <div className="bg-[#161d2f] p-8 rounded-xl border border-yellow-500/30 relative shadow-lg before:content-[''] before:absolute before:-inset-[2px] before:rounded-[14px] before:bg-linear-to-r before:from-yellow-400 before:via-yellow-500 before:to-yellow-600 before:-z-10 before:opacity-50">
                  <h4 className="font-bold text-xl text-blue-400 mb-6 flex gap-3 items-center">
                    <ListCheck />
                    {normalizedData?.improvements?.title || "Complete Item Analysis"}
                  </h4>
                  <ul className="space-y-4 text-base text-slate-300">
                    {evaluationResult?.feedback?.improvements?.map((point: ImprovementPoint, i: number) => (
                      <li key={i} className="grid gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                        {
                          point.critique && <div className='flex gap-4'>
                            <FaTimes className='text-red-500 min-w-4 min-h-4 mt-1' size={18} />
                            <div>{point.critique}</div>
                          </div>
                        }
                        {
                          point?.fix && <div className='flex gap-4'>
                            <FaCheck className='text-green-500 min-w-4 min-h-4 mt-1' size={18} />
                            <div>{point?.fix}</div>
                          </div>
                        }

                      </li>
                    ))}
                    {evaluationResult?.feedback?.improvements?.length === 0 && (
                      <li className="text-slate-500 italic">No specific improvements identified.</li>
                    )}
                  </ul>
                </div>
                <div className="space-y-8">
                  <div className="bg-[#161d2f] p-8 rounded-xl border border-slate-800 shadow-lg">
                    <h4 className="font-bold text-xl mb-6 text-green-400 flex items-center">
                      <FaStar className='mr-2' />
                      {evaluationResult?.feedback?.strengths?.title || "What you already do well"}
                    </h4>
                    <ul className="space-y-4 text-base text-slate-300">
                      {evaluationResult?.feedback?.strengths?.map((point: StrengthPoint, i: number) => (
                        <li key={i} className="flex gap-4">
                          <FaCheck className='text-green-500 mt-1 min-w-4 min-h-4' size={18} />
                          <span>{point.point}</span>
                        </li>
                      ))}
                      {evaluationResult?.feedback?.strengths?.length === 0 && (
                        <li className="text-slate-500 italic">Continue practicing to identify your strengths.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* <div className="bg-[#161d2f] p-8 rounded-xl border border-slate-800 shadow-lg mb-12">
                <h4 className="font-bold text-2xl text-white mb-8 border-b border-slate-700 pb-4 flex items-center gap-3">
                  <FaMapSigns className="text-blue-400" /> Detailed Answer Analysis
                </h4>
                <div className="space-y-8">
                  {answerReviewData.map((item: AnswerReviewItem) => (
                    <div key={item.id} className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${item.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {item.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[0.65rem] font-bold uppercase tracking-wider ${item.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {item.isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                      </div>
                      <p className="text-white text-lg font-medium mb-6">"{item.question}"</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/20 p-4 rounded-xl">
                        <div>
                          <div className="text-[0.65rem] text-slate-500 uppercase font-bold tracking-widest mb-1">Your Answer</div>
                          <div className={`text-base font-bold ${item.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>{item.userAnswer || "No Answer"}</div>
                        </div>
                        <div>
                          <div className="text-[0.65rem] text-slate-500 uppercase font-bold tracking-widest mb-1">Correct Answer</div>
                          <div className="text-base font-bold text-emerald-400">{item.correctAnswer}</div>
                        </div>
                      </div>
                      {item.explanation && (
                        <div className="mt-6 pt-6 border-t border-slate-700/50">
                          <div className="text-[0.65rem] text-yellow-500/70 uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
                            <FaCheck size={10} /> Analysis
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed italic">"{item.explanation}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div> */}
            </>
          )}

          <h3 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-4">What Is Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#161d2f] border border-blue-500/30 p-8 rounded-xl cursor-pointer hover:bg-slate-800 transition shadow-lg">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xl mb-4">
                {/* <i className="fas fa-book-reader"></i> */}
                <FaBookReader />
              </div>
              <h4 className="font-bold text-lg text-white mb-2">Review Material</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Go back and review the exact texts you found challenging.</p>
            </div>
            <div className="bg-[#161d2f] border border-green-500/30 p-8 rounded-xl cursor-pointer hover:bg-slate-800 transition shadow-lg">
              <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xl mb-4">
                {/* <i className="fas fa-random"></i> */}
                <FaRandom />
              </div>
              <h4 className="font-bold text-lg text-white mb-2">Try Another Skill</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Practice writing or listening to balance your overall profile.</p>
            </div>
            <div className="bg-[#161d2f] border border-purple-500/30 p-8 rounded-xl cursor-pointer hover:bg-slate-800 transition shadow-lg">
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-xl mb-4">
                {/* <i className="fas fa-bullseye"></i> */}
                <FaBullseye />
              </div>
              <h4 className="font-bold text-lg text-white mb-2">Set Daily Goal</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Aim for targeted practice daily to see consistent improvement.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
