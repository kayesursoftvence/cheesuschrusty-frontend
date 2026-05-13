 
import { useState } from 'react';
import Timer from "../../ListeningMood/Timer";
import type { JSX, ChangeEvent } from "react"
import { useSearchParams, useLocation } from 'react-router-dom';
import { useGetNextLessonQuery } from '@/redux/features/lesson/lessonPractice/lessonPracticeApi';
import { useGetLessonQuestionSetQuery } from '@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi';
import { useEvaluateReadingPerformanceMutation } from "@/redux/features/lesson/readingAI/readingPerformanceApi";
import detectExerciseType from '../UserReadingPractice/detectExerciseType';

type LessonType = 'READING' | 'WRITING' | 'LISTENING' | 'SPEAKING';
type LessonLevel = 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2';
type StudentAnswers = { [questionId: string]: string; };



export default function QuestionDisplay(): JSX.Element {

    const [studentAnswers, setStudentAnswers] = useState<StudentAnswers>({ "1": "", "2": "", "3": "", "4": "", "5": "", });

    const [searchParams] = useSearchParams();
    const { pathname } = useLocation();
    
    const lastPath = pathname.split('/').pop() || '';
    const urlLevel = searchParams.get('level') || '';
    

    function handleAnswerChange(e: ChangeEvent<HTMLInputElement>) {
      const questionId = e.target.name; // get input name
      const value = e.target.value.toUpperCase(); // convert to uppercase
      setStudentAnswers(function (prev: StudentAnswers ) {
        return { ...prev, [questionId]: value };
      });
    }
    
  
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
  

    const [evaluateReadingPerformance, 
                      // { isLoading, isError, data, error }
                    ] = useEvaluateReadingPerformanceMutation();
    // const level = lessonQuestionSetData?.data?.content.header.level;
    // const provider = lessonQuestionSetData?.data?.content?.header.provider;
    // const topic = lessonQuestionSetData?.data?.content?.header.topic;
    const instructions = lessonQuestionSetData?.data?.content?.student_handout?.instructions ?? '';
    const exerciseType = detectExerciseType(instructions)

    const content = lessonQuestionSetData?.data?.content
  
    const questions =  content?.student_handout?.questions
  
    return (
      <div className=" flex-1 flex flex-col gap-6 rounded-2xl shadow-sm p-8 dark:bg-gray-800 border dark:border-gray-700 bg-white border-gray-100 ">
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
            { 
              exerciseType === 'MATCHING'  &&
              Array.isArray(questions) 
                && questions?.map((item, idx) => {
                                    console.log(item)
                                    return ( <div key={idx} className={`w-full p-4 text-left rounded-xl border-2 transition-all`} >
                                                  <span className="font-bold mr-3">{item}.</span>
                                                  <br/>
                                                  <input name={`${idx+1}`} value={studentAnswers[idx+1]} onChange={handleAnswerChange} className= 'px-6 rounded-xs  border-b :border-gray-100 dark:border-gray-600 py-2 ml-auto' placeholder=' ex...  A, B, C, or D '/>
                                              </div> 
                                          )
                                })              
              }
            
          </div>
          <div className="flex justify-between mt-8">
           
  
            <button 
              // onClick={handleNext} 
              // disabled={!selectedAnswer} 
              onClick={() => evaluateReadingPerformance({
                metadata: content.metadata,
                student_handout: content.student_handout,
                teacher_pack: content.teacher_pack,
                student_response: {
                  answers: Object.keys(studentAnswers)
                    .sort((a, b) => Number(a) - Number(b))
                    .map(key => studentAnswers[key])
                }
              })}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
}




                  //   ${
                  //   selectedAnswer === ans?.split('.')[0] 
                  //                             ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"
                  // }
                  