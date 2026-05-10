 
import { useState } from 'react';
import Timer from "../../../../ListeningMood/Timer";
import type { JSX, ChangeEvent } from "react"
import detectExerciseType from '../../detectExerciseType';
import Submit from './Submit';
import Loading from './Loading';
import Error from './Error';
import { useReadingPracticeData } from '../hooks/useReadingPracticeData';

type StudentAnswers = { [questionId: string]: string; };

export default function QuestionDisplay(): JSX.Element {
  // =================== LOCAL STATE ===================
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswers>({ "1": "", "2": "", "3": "", "4": "", "5": "", });

  // =================== USE SHARED HOOK ===================
  const {
    isLoading,
    isError,
    refetch,
    nextLessonId,
    instructions,
    questions, } = useReadingPracticeData();

  const exerciseType = detectExerciseType(instructions);
  console.log(exerciseType);

  // =================== EVENT HANDLERS ===================
  function handleAnswerChange(e: ChangeEvent<HTMLInputElement>) {
    const questionId = e.target.name;
    const value = e.target.value.toUpperCase();
    setStudentAnswers((prev: StudentAnswers) => ({ ...prev, [questionId]: value }));
  }

  function optionClickHandlar({ idx, value }: { idx: number; value: string; }) {
    setStudentAnswers((prev: StudentAnswers) => ({ ...prev, [idx]: value }));
  }

  // =================== LOADING / ERROR STATES ===================
  if (isLoading) return <Loading />;
  if (isError) return <Error onRetry={refetch} />;

  return (
    <div className="flex-1 flex flex-col gap-6 rounded-2xl shadow-sm p-8 dark:bg-gray-800 border dark:border-gray-700 bg-white border-gray-100 ">
      <div className="flex justify-between items-center mb-6 gap-5">
        <div className=''>
          <h2 className='text-lg dark:text-white border-b py-1 mb-2'>Instructions:</h2>
          <p className='text-base dark:text-white pl-4'>
            {instructions}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 px-4 py-2 border rounded-lg w-30">
          <Timer />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          {/* =================== DATA-PATTERN-BASED RENDERING =================== */}
          {Array.isArray(questions) && questions.map((item, idx) => {
            // Detect pattern based on data structure
            const isSimpleString = typeof item === 'string';
            const hasTextAndOptions = typeof item === 'object' && item !== null && 'text' in item && 'options' in item;
            const hasQuestionAndOptions = typeof item === 'object' && item !== null && 'question' in item && 'options' in item;
            const hasNumberAndStatement = typeof item === 'object' && item !== null && 'number' in item && 'statement' in item;

            // Pattern 1: Simple string - text input
            if (isSimpleString) {
              return (
                <div key={idx} className={`w-full p-4 text-left rounded-xl border-2 transition-all`}>
                  <span className="font-bold mr-3">{item}.</span>
                  <br/>
                  <input 
                    name={`${idx+1}`} 
                    value={studentAnswers[idx+1] || ""} 
                    onChange={handleAnswerChange} 
                    className='px-6 rounded-xs border-b :border-gray-100 dark:border-gray-600 py-2 ml-auto' 
                    placeholder=' ex...  A, B, C, or D '
                  />
                </div>
              );
            }

            // Pattern 2: Object with 'text' and 'options' - option buttons
            if (hasTextAndOptions) {
              return (
                <div key={item.id ?? idx} className={`w-full p-4 text-left rounded-xl border-2 transition-all`}>
                  <span className="font-bold mr-3">{item.text}</span>
                  <br/>
                  <div className='mt-4'>
                    {Object.entries(item.options).map(([key, val]) => (
                      <div key={key}>
                        <button 
                          className={`${(key === studentAnswers[idx+1]) ? 'border border-gray-800 dark:border-gray-50' : 'border-transparent'} rounded-lg px-6 py-2 w-full text-left`} 
                          onClick={() => optionClickHandlar({idx: idx+1, value: key })}
                        >
                          {key} : <span>{`${val}`}</span>
                        </button>
                        <br/>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // Pattern 3: Object with 'question' and 'options' - option buttons
            if (hasQuestionAndOptions) {
              return (
                <div key={item.id ?? idx} className={`w-full p-4 text-left rounded-xl border-2 transition-all`}>
                  <span className="font-bold mr-3">{item.question}</span>
                  <br/>
                  <div className='mt-4'>
                    {Object.entries(item.options).map(([key, val]) => (
                      <div key={key}>
                        <button 
                          className={`${(key === studentAnswers[idx+1]) ? 'border border-gray-800 dark:border-gray-50' : 'border-transparent'} rounded-lg px-6 py-2 w-full text-left`} 
                          onClick={() => optionClickHandlar({idx: idx+1, value: key })}
                        >
                          <span>{`${val}`}</span>
                        </button>
                        <br/>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // Pattern 4: Object with 'number' and 'statement' - text input
            if (hasNumberAndStatement) {
              return (
                <div key={idx} className="w-full p-4 text-left rounded-xl border-2 transition-all">
                  <span className="font-bold mr-3">{item.number}.</span>
                  {typeof item.statement === "string" 
                    ? item.statement 
                    : item.statement?.text ?? ""
                  }
                  <br/>
                  <input 
                    name={`${idx+1}`} 
                    value={studentAnswers[idx+1] || ""} 
                    onChange={handleAnswerChange} 
                    className='px-6 rounded-xs border-b :border-gray-100 dark:border-gray-600 py-2 ml-auto' 
                    placeholder=' ex...  A, B, C, or D '
                  />
                </div>
              );
            }

            // Fallback for unknown patterns
            return (
              <div key={idx} className="w-full p-4 text-left rounded-xl border-2 transition-all bg-yellow-50 dark:bg-yellow-900/20">
                <span className="text-yellow-700 dark:text-yellow-300">Unknown question format</span>
              </div>
            );
          })}
          {/* =================== END DATA-PATTERN-BASED RENDERING =================== */}
        </div>

        <div className="flex justify-between mt-8">
          <Submit studentAnswers={studentAnswers} lessonId={Number(nextLessonId)}/>
        </div>
      </div>
    </div>
  );
}
