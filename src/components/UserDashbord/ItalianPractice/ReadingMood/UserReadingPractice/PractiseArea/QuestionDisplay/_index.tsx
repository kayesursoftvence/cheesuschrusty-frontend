 
import { useState } from 'react';
import Timer from "../../../../ListeningMood/Timer";
import type { JSX, ChangeEvent } from "react"
import { useSearchParams, useLocation } from 'react-router-dom';
import { useGetNextLessonQuery } from '@/redux/features/lesson/lessonPractice/lessonPracticeApi';
import { useGetLessonQuestionSetQuery } from '@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi';
import detectExerciseType from '../../detectExerciseType';
import Submit from './Submit';
import Loading from './Loading';
import Error from './Error';

type LessonType = 'READING' | 'WRITING' | 'LISTENING' | 'SPEAKING';
type LessonLevel = 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2';


type StudentAnswers = { [questionId: string]: string; };
// type OptionItem = { title: string;
//                     body: string; };


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
            isLoading: isNextLessionsLoading,  
            // isFetching, 
            // isSuccess,   
            isError: isNextLessionsError, 
            refetch
                                  } = useGetNextLessonQuery({  type: lastPath.toUpperCase() as LessonType,
                                                               level: urlLevel.toLowerCase() as LessonLevel });
  
    // const questionSetResult = await getQuestionSet({ lessonId: Number(activeLessonId) }).unwrap();
  
    const nextLessonId = nextLessionsData?.data?.id;
  
    const { data: lessonQuestionSetData, 
            // error,   
            isLoading: isLessonQuestionSetLoading,  
            // isFetching, 
            // isSuccess,   
            isError: lessonQuestionSetError,  
            // refetch
                            } = useGetLessonQuestionSetQuery({ lessonId: Number(nextLessonId) }, 
                                                              { skip:  !nextLessonId  });
  

    // const [
    //     evaluateReadingPerformance, 
    //                   // { isLoading, isError, data, error }
    //                 ] = useEvaluateReadingPerformanceMutation();
                    
    // const level = lessonQuestionSetData?.data?.content.header.level;
    // const provider = lessonQuestionSetData?.data?.content?.header.provider;
    // const topic = lessonQuestionSetData?.data?.content?.header.topic;
    const instructions = lessonQuestionSetData?.data?.content?.student_handout?.instructions ?? '';
    const exerciseType = detectExerciseType(instructions)

    const content = lessonQuestionSetData?.data?.content
  
    const questions =  content?.student_handout?.questions
   
    const readingTexts = content?.teacher_pack.content
    
    console.log(questions)

    console.log(typeof readingTexts)
  
    console.log(exerciseType)
  
    console.log(nextLessionsData)
  
    console.log(lessonQuestionSetData)

    
      if(isLessonQuestionSetLoading || isNextLessionsLoading)  return <Loading/>
      if(isNextLessionsError || lessonQuestionSetError) return <Error onRetry={refetch}/>

      


      function optionClickHandlar({ idx, value, }: { idx: number; value: string; }) {
        setStudentAnswers((prev: StudentAnswers) => {
          return { ...prev, [idx]: value };
        });
      }


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
            {/* =================== NEW DATA-PATTERN-BASED RENDERING =================== */}
            {Array.isArray(questions) && questions.map((item, idx) => {
              // Detect pattern based on data structure
              const isSimpleString = typeof item === 'string';
              const hasTextAndOptions = typeof item === 'object' && item !== null && 'text' in item && 'options' in item;
              const hasQuestionAndOptions = typeof item === 'object' && item !== null && 'question' in item && 'options' in item;
              const hasNumberAndStatement = typeof item === 'object' && item !== null && 'number' in item && 'statement' in item;

              // Pattern 1: Simple string (e.g., A1, C1 levels) - text input
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

              // Pattern 2: Object with 'text' and 'options' (e.g., A2 level) - option buttons
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

              // Pattern 3: Object with 'question' and 'options' (e.g., B1, C2 levels) - option buttons
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

              // Pattern 4: Object with 'number' and 'statement' (e.g., B2 level) - text input
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
            {/* =================== END NEW DATA-PATTERN-BASED RENDERING =================== */}


            {/* =================== OLD LEVEL-BASED RENDERING (BACKUP) =================== */}
            {/* {
              (level == 'A1' || level == 'a1' || level == 'C1' || level == 'c1')
                && Array.isArray(questions) 
                    && questions?.map((item, idx) => <div key={idx} className={`w-full p-4 text-left rounded-xl border-2 transition-all`} >
                                                        <span className="font-bold mr-3">{item}.</span>
                                                        <br/>
                                                        <input name={`${idx+1}`} value={studentAnswers[idx+1]} onChange={handleAnswerChange} className= 'px-6 rounded-xs  border-b :border-gray-100 dark:border-gray-600 py-2 ml-auto' placeholder=' ex...  A, B, C, or D '/>
                                                    </div> )
            }
            
            {
              (level == 'A2' || level == 'a2')
                && Array.isArray(questions) 
                  && questions?.map((item, idx ) => <div key={item.id} className={`w-full p-4 text-left rounded-xl border-2 transition-all`} >
                                                      <span className="font-bold mr-3">{item.text}</span>
                                                      <br/>
                                                        <div className='mt-4'>
                                                        {
                                                          ( typeof item === "object" && item !== null &&  "options" in item )
                                                                && Object.entries(item.options).map(i =>  <><button className={`${(i[0] === studentAnswers[idx+1]) ? 'border border-gray-800 dark:border-gray-50' : 'border-transparent'}  rounded-lg px-6 py-2 w-full  text-left`} onClick={()=>optionClickHandlar({idx: idx+1, value: i[0] })}>{i[0]} : 
                                                                                                              <span>{`${i[1]}`}</span> 
                                                                                                            </button>
                                                                                                            <br/>
                                                                                                          </>)
                                                        }
                                                        </div>
                                                    </div> )
            }

            {  
              (level == 'B1' || level == 'b1' || level == 'C2' || level == 'c2')
                && Array.isArray(questions) 
                    && questions?.map((item, idx ) => <div key={item.id} className={`w-full p-4 text-left rounded-xl border-2 transition-all`} >
                                                        <span className="font-bold mr-3">{item.question}</span>
                                                        <br/>
                                                          <div className='mt-4'>
                                                          {
                                                            ( typeof item === "object" && item !== null &&  "options" in item )
                                                                  && Object.entries(item.options).map(i => <><button className={`${(i[0] === studentAnswers[idx+1]) ? 'border border-gray-800 dark:border-gray-50' :  'border-transparent'} rounded-lg px-6 py-2 w-full  text-left`} onClick={()=>optionClickHandlar({idx: idx+1, value: i[0] })}>
                                                                                                                <span>{`${i[1]}`}</span> 
                                                                                                              </button>
                                                                                                              <br/>
                                                                                                            </>)
                                                          }
                                                          </div>
                                                      </div> )
            }

            {
              (level == 'B2' || level == 'b2')
                  && Array.isArray(questions) 
                  && questions?.map((item, idx) => 
                    <div key={idx} className="w-full p-4 text-left rounded-xl border-2 transition-all">
                      <span className="font-bold mr-3">{item.number}.</span>
                      {typeof item.statement === "string" 
                        ? item.statement 
                        : item.statement.text // adjust according to your data
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
                  )  
            } */}
            {/* =================== END OLD LEVEL-BASED RENDERING (BACKUP) =================== */}

          </div>
          <div className="flex justify-between mt-8">
            {/* <button 
              onClick={()=>evaluateReadingPerformance({ ...content, "student_answers": { ...studentAnswers }})}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 transition-colors" >
              Submit
            </button> */}
            <Submit studentAnswers={studentAnswers} lessonId={Number(nextLessonId)}/>
          </div>
        </div>
      </div>
    );
}
