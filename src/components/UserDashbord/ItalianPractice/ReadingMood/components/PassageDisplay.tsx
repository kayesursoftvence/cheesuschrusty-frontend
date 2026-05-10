 
// import React from 'react';
// import { MdOutlineTranslate } from "react-icons/md";
import readingicon from "../../../../../assets/Dashbord/darkreading.svg";
import { useSearchParams, useLocation } from 'react-router-dom';
// import { useGetNextLessonQuery } from '@/redux/features/lesson/lessonPractice/lessonPracticeApi';


import type { JSX } from "react"


// import { useLazyGetNextLessonQuery } from "@/redux/features/lesson/lessonPractice/lessonPracticeApi";
// import { useLazyGetLessonQuestionSetQuery } from "@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi";
import { useGetNextLessonQuery } from '@/redux/features/lesson/lessonPractice/lessonPracticeApi';
import { useGetLessonQuestionSetQuery } from '@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi';
import detectExerciseType from '../UserReadingPractice/detectExerciseType';


// interface Props {
//   readingData: any;
//   showTranslation: boolean;
//   setShowTranslation: (show: boolean) => void;
//   italianPassage: string;
//   englishPassage: string;
// }

type LessonType = 'READING' | 'WRITING' | 'LISTENING' | 'SPEAKING';
type LessonLevel = 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2';
type ReadingTextItem = { title: string;
                          body: string;
                        };

export default function PassageDisplay(): JSX.Element {
  // const { readingData,
  //         showTranslation,
  //         setShowTranslation,
  //         italianPassage,
  //         englishPassage        } = props

  // fix paraeter 
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  
  const lastPath = pathname.split('/').pop() || '';
  const urlLevel = searchParams.get('level') || '';
  


  const { data: nextLessionsData, 
          // error,   
          // isLoading,  
          // isFetching, 
          // isSuccess,   
          isError: isNextLessionsError,  
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
  const topic = lessonQuestionSetData?.data?.content?.header.topic;
  const instructions = lessonQuestionSetData?.data?.content?.student_handout?.instructions ?? '';
  const exerciseType = detectExerciseType(instructions)

  const readingTexts = lessonQuestionSetData?.data?.content?.teacher_pack.content
  console.log(typeof readingTexts)

  console.log(exerciseType)

  console.log(nextLessionsData)

  console.log(lessonQuestionSetData)
  // // 🚫 Invalid → stop rendering & stop query
  if (isNextLessionsError) {
    return <></>; // or navigate('/404')
  }





  // const getPassageTitle = () => {
  //   return readingData?.content?.header?.topic || "Reading Practice";
  // };


  function capitalizeFirstLetter(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }




  // console.log(nextLessionData)




  // const handout = readingData?.content?.student_handout || readingData?.content?.PART_2_STUDENT_HANDOUT || readingData?.content['PART 2: STUDENT_HANDOUT (PRINTABLE)'];
  // const rawTexts = handout?.stimulus || handout?.texts || handout?.Texts || handout?.TEXTS || '';
  // const isMatchingExercise = !!rawTexts && typeof rawTexts === 'object';

  return (
    <div className=" flex-[1.2] flex flex-col gap-6 rounded-2xl shadow-sm p-8 dark:bg-gray-800 border dark:border-gray-700 bg-white border-gray-100">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
            <img className="w-8 h-8" src={readingicon} alt="icon" />
          </div>
          <div>
            <h2 className="text-2xl font-bold dark:text-white">{topic}</h2>
            <p className="text-sm opacity-60 dark:text-white">Read the following carefully</p>
          </div>
        </div>
        {/* Temporary shut 0ff */}
        {/* <button 
          onClick={() => setShowTranslation(!showTranslation)} 
          className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-colors ${showTranslation ? 'bg-blue-50 border-blue-200 text-blue-600' : 'hover:bg-gray-50 dark:hover:text-neutral-600'}`}
        >
          <MdOutlineTranslate />
          <span className="text-sm font-bold">{showTranslation ? "Original" : "Translate Instructions"}</span>
        </button> */}
      </div>
      {/* <div>
        <h2 className='text-lg dark:text-white'>Instructions:</h2>
        <p className='text-base dark:text-white'>
          {instructions}
        </p>
      </div> */}
      

      <div className="space-y-6">
        {
          readingTexts &&
          (Object.entries(readingTexts) as [string, ReadingTextItem][])
              .map(([keys, val], idx) => {
                const [k1, k2 = ''] = keys.split('_');

                return (
                  <div
                    key={idx}
                    className="dark:bg-blue-50/5 dark:border-gray-700 p-5 rounded-xl border-2 transition-all bg-gray-50 border-gray-100"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-bold text-lg">
                        {capitalizeFirstLetter(k1)} {capitalizeFirstLetter(k2)}: {val.title}
                      </h3>
                    </div>

                    <p className="leading-relaxed opacity-90 whitespace-pre-line dark:text-white text-base">
                      {val.body}
                    </p>
                  </div>
                );
              })
        }
      </div>
    </div>
  );
}



// export const PassageDisplay: React.FC<Props> = ({
//   readingData,
//   showTranslation,
//   setShowTranslation,
//   italianPassage,
//   englishPassage
// }) => {

  

//   const getPassageTitle = () => {
//     return readingData?.content?.header?.topic || "Reading Practice";
//   };

//   const handout = readingData?.content?.student_handout || readingData?.content?.PART_2_STUDENT_HANDOUT || readingData?.content['PART 2: STUDENT_HANDOUT (PRINTABLE)'];
//   const rawTexts = handout?.stimulus || handout?.texts || handout?.Texts || handout?.TEXTS || '';
//   const isMatchingExercise = !!rawTexts && typeof rawTexts === 'object';

//   return (
//     <div className=" flex-[1.2] flex flex-col gap-6 rounded-2xl shadow-sm p-8 dark:bg-gray-800 border dark:border-gray-700 bg-white border-gray-100">
//       <div className="flex items-start justify-between mb-2">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
//             <img className="w-8 h-8" src={readingicon} alt="icon" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold dark:text-white">{getPassageTitle()}</h2>
//             <p className="text-sm opacity-60 dark:text-white">Read the following carefully</p>
//           </div>
//         </div>
//         <button 
//           onClick={() => setShowTranslation(!showTranslation)} 
//           className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-colors ${showTranslation ? 'bg-blue-50 border-blue-200 text-blue-600' : 'hover:bg-gray-50 dark:hover:text-neutral-600'}`}
//         >
//           <MdOutlineTranslate />
//           <span className="text-sm font-bold">{showTranslation ? "Original" : "Translate Instructions"}</span>
//         </button>
//       </div>

//       <div className="space-y-6">
//         {isMatchingExercise ? (
//           <div className="grid grid-cols-1 gap-4">
//             {(Array.isArray(rawTexts) ? rawTexts : Object.entries(rawTexts)).map((item: any, idx: number) => {
//               const data = Array.isArray(rawTexts) ? item : item[1];
//               const key = Array.isArray(rawTexts) ? (data.letter || String.fromCharCode(65 + idx)) : item[0].replace('text_', '').toUpperCase();
//               const letter = key.length === 1 ? key : String.fromCharCode(65 + idx);
              
//               return (
//                 <div key={idx} className="dark:bg-blue-50/5 dark:border-gray-700 p-5 rounded-xl border-2 transition-all bg-gray-50 border-gray-100">
//                   <div className="flex items-center gap-3 mb-3">
//                     <h3 className="font-bold text-lg">Text</h3>
//                     <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white font-bold rounded-lg">{letter}</span>
//                   </div>
//                   <p className="leading-relaxed opacity-90 whitespace-pre-line dark:text-white text-base">
//                     {data.Title || data.title ? <strong className="block mb-1">{data.Title || data.title}</strong> : null}
//                     {data.content || data.Text || data.text || (typeof data === 'string' ? data : "")}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="space-y-4 text-lg leading-relaxed whitespace-pre-line">
//             {(showTranslation ? englishPassage : italianPassage).split('\n').map((p, i) => p.trim() && <p className="dark:text-white" key={i}>{p}</p>)}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };





// previous structure 




        {/* {isMatchingExercise ? (
          <div className="grid grid-cols-1 gap-4 marker-class">
            {(Array.isArray(rawTexts) ? rawTexts : Object.entries(rawTexts)).map((item: any, idx: number) => {
              const data = Array.isArray(rawTexts) ? item : item[1];
              const key = Array.isArray(rawTexts) ? (data.letter || String.fromCharCode(65 + idx)) : item[0].replace('text_', '').toUpperCase();
              const letter = key.length === 1 ? key : String.fromCharCode(65 + idx);
              
              return (
                <div key={idx} className="dark:bg-blue-50/5 dark:border-gray-700 p-5 rounded-xl border-2 transition-all bg-gray-50 border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-lg">Text</h3>
                    <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white font-bold rounded-lg">{letter}</span>
                  </div>
                  <p className="leading-relaxed opacity-90 whitespace-pre-line dark:text-white text-base">
                    {data.Title || data.title ? <strong className="block mb-1">{data.Title || data.title}</strong> : null}
                    {data.content || data.Text || data.text || (typeof data === 'string' ? data : "")}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4 text-lg leading-relaxed whitespace-pre-line">
            {(showTranslation ? englishPassage : italianPassage).split('\n').map((p, i) => p.trim() && <p className="dark:text-white" key={i}>{p}</p>)}
          </div>
        )} */}
