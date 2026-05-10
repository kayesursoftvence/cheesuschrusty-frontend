 
import React from 'react';
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import Timer from "../../ListeningMood/Timer";
import { ReadingQuestion } from '../types';
import { useSearchParams, useLocation } from 'react-router-dom';
// import { useGetNextLessonQuery } from '@/redux/features/lesson/lessonPractice/lessonPracticeApi';

// import type { JSX } from "react"

// import { useLazyGetNextLessonQuery } from "@/redux/features/lesson/lessonPractice/lessonPracticeApi";
// import { useLazyGetLessonQuestionSetQuery } from "@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi";
import { useGetNextLessonQuery } from '@/redux/features/lesson/lessonPractice/lessonPracticeApi';
import { useGetLessonQuestionSetQuery } from '@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi';
import detectExerciseType from '../UserReadingPractice/detectExerciseType';


interface QuestionDisplayProps {
  currentQuestion: ReadingQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  progressPercentage: number;
  selectedAnswer: string | null;
  handleAnswerSelect: (letter: string) => void;
  handleNext: () => void;
  handlePrevious: () => void;
}

type LessonType = 'READING' | 'WRITING' | 'LISTENING' | 'SPEAKING';
type LessonLevel = 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2';

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  progressPercentage,
  selectedAnswer,
  handleAnswerSelect,
  handleNext,
  handlePrevious
}) => {


  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  
  const lastPath = pathname.split('/').pop() || '';
  const urlLevel = searchParams.get('level') || '';
  


  const { data: nextLessionsData, 
          // error,   
          // isLoading,  
          // isFetching, 
          // isSuccess,   
          // isError: isNextLessionsError,  
          // refetch
                                } = useGetNextLessonQuery({  type: lastPath.toUpperCase() as LessonType,
                                                             level: urlLevel.toLowerCase() as LessonLevel });

  // const questionSetResult = await getQuestionSet({ lessonId: Number(activeLessonId) }).unwrap();

  const nextLessonId = nextLessionsData?.data?.id;

  const { data: lessonQuestionSetData, 
          // error,   
          // isLoading,  
          // isFetching, 
          // isSuccess,   
          // isError: lessonQuestionSetError,  
          // refetch
                          } = useGetLessonQuestionSetQuery({ lessonId: Number(nextLessonId) }, 
                                                            { skip:  !nextLessonId  });

  // const level = lessonQuestionSetData?.data?.content.header.level;
  // const provider = lessonQuestionSetData?.data?.content?.header.provider;
  // const topic = lessonQuestionSetData?.data?.content?.header.topic;
  const instructions = lessonQuestionSetData?.data?.content?.student_handout?.instructions ?? '';
  const exerciseType = detectExerciseType(instructions)

  const readingTexts = lessonQuestionSetData?.data?.content?.teacher_pack.content
  console.log(typeof readingTexts)

  console.log(exerciseType)

  console.log(nextLessionsData)

  console.log(lessonQuestionSetData)









  if (!currentQuestion) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 dark:bg-gray-800 border dark:border-gray-700 bg-white border-gray-100 rounded-2xl shadow-sm">
        <p className="text-gray-500">Loading question...</p>
      </div>
    );
  }


  console.log(currentQuestion)
  return (
    <div className=" flex-1 flex flex-col gap-6 rounded-2xl shadow-sm p-8 dark:bg-gray-800 border dark:border-gray-700 bg-white border-gray-100 ">
      <div className="flex justify-between items-center mb-6 gap-5">
        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <span className="text-sm">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          </div>
          <ProgressBar progress={progressPercentage} color="bg-blue-600" height="h-2" />
        </div>
        <div className="flex items-center justify-between gap-2 px-4 py-2 border rounded-lg w-26">
          <Timer />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg py-4 px-4 font-semibold bg-gray-100 dark:bg-gray-700 rounded-xl">
          {currentQuestion.question}
        </h3>
        <div className="space-y-4">
          {/* { console.log(currentQuestion)} */}
          {
            Array.isArray(currentQuestion.options) 
              ? currentQuestion.options?.map((ans, i) => {
                  console.log(ans)
                return ( <button
                  key={i}
                  // onClick={() => handleAnswerSelect(ans?.split('.')[0])}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all 
                    
                    

                  `}
                >
                  <span className="font-bold mr-3">{ans}.</span>
                </button>
              )
            }
            
            )
              : currentQuestion.answers?.map((ans, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswerSelect(ans.letter)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    selectedAnswer === ans.letter ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <span className="font-bold mr-3">{ans.letter}.</span>
                  {ans.text}
                </button>
              ))
            
            }


          {}

          
        </div>
        <div className="flex justify-between mt-8">
          <button 
            onClick={handlePrevious} 
            disabled={currentQuestionIndex === 0} 
            className="px-6 py-2 rounded-lg border dark:border-gray-600 dark:text-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <button 
            onClick={handleNext} 
            disabled={!selectedAnswer} 
            className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            {currentQuestionIndex === totalQuestions - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};


                  //   ${
                  //   selectedAnswer === ans?.split('.')[0] 
                  //                             ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"
                  // }
                  