 
import readingicon from "../../../../../../../assets/Dashbord/darkreading.svg";
import { useSearchParams, useLocation } from 'react-router-dom';
import type { JSX } from "react"
import { useGetNextLessonQuery } from '@/redux/features/lesson/lessonPractice/lessonPracticeApi';
import { useGetLessonQuestionSetQuery } from '@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi';
// import detectExerciseType from "../../detectExerciseType";
import Loading from "./loading";
import Error from "./Error";

type LessonType = 'READING' | 'WRITING' | 'LISTENING' | 'SPEAKING';
type LessonLevel = 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2';
interface ReadingSection {
                              title: string;
                              body?: string;
                           content?: string;
                         }

export default function PassageDisplay(): JSX.Element {

  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  
  const lastPath = pathname.split('/').pop() || ''; 
  const urlLevel = searchParams.get('level') || '';
  


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

  // const level = lessonQuestionSetData?.data?.content.header.level;
  // const provider = lessonQuestionSetData?.data?.content?.header.provider;
  const topic = lessonQuestionSetData?.data?.content?.header.topic;
  // const instructions = lessonQuestionSetData?.data?.content?.student_handout?.instructions ?? '';
  // const exerciseType = detectExerciseType(instructions)

  // =================== NEW DATA-PATTERN-BASED LOGIC ===================
  // Get the raw content from teacher_pack
  const teacherPackContent = lessonQuestionSetData?.data?.content?.teacher_pack?.content;

  // Detect pattern based on data structure
  const isPlainString = typeof teacherPackContent === 'string';
  const isObjectWithText = typeof teacherPackContent === 'object' && teacherPackContent !== null && 'text' in teacherPackContent;
  const isObjectWithSections = typeof teacherPackContent === 'object' && teacherPackContent !== null && !('text' in teacherPackContent);

  // Derive readingTexts based on pattern
  let readingTexts: string | Record<string, ReadingSection> | null = null;
  if (isPlainString) {
    readingTexts = teacherPackContent;
  } else if (isObjectWithText) {
    readingTexts = teacherPackContent.text;
  } else if (isObjectWithSections) {
    readingTexts = teacherPackContent as Record<string, ReadingSection>;
  }
  // =================== END NEW DATA-PATTERN-BASED LOGIC ===================

  /* =================== OLD LEVEL-BASED LOGIC (BACKUP) ===================
  const level = lessonQuestionSetData?.data?.content.header.level;
  const readingTexts = (level === 'A1' || level === 'a1' || level === 'B2' || level === 'b2' || level === 'C1' || level === 'c1')
                          ? lessonQuestionSetData?.data?.content?.teacher_pack.content
                          : (level === 'A2' || level === 'a2' || level === 'B1' || level === 'b1' || level === 'C2' || level === 'c2')
                            ? lessonQuestionSetData?.data?.content?.teacher_pack.content.text
                            : ''
  =================== END OLD LEVEL-BASED LOGIC (BACKUP) =================== */
  // console.log(typeof readingTexts)
  // console.log(exerciseType)
  // console.log(nextLessionsData)
  // console.log(lessonQuestionSetData)
  // console.log(level)
  // console.log(readingTexts)


  function capitalizeFirstLetter(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }



  if(isLessonQuestionSetLoading || isNextLessionsLoading)  return <Loading/>
  if(isNextLessionsError || lessonQuestionSetError) return <Error onRetry={refetch}/>

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
      </div>

      <div className="space-y-6">
        {/* =================== NEW DATA-PATTERN-BASED RENDERING =================== */}
        {readingTexts && typeof readingTexts === 'string' && (
          <div className="dark:bg-blue-50/5 dark:border-gray-700 p-5 rounded-xl border-2 transition-all bg-gray-50 border-gray-100">
            <p className="leading-relaxed opacity-90 whitespace-pre-line dark:text-white text-base">
              {readingTexts}
            </p>
          </div>
        )}
        {readingTexts && typeof readingTexts === 'object' && (
          Object.entries(readingTexts as Record<string, ReadingSection>).map(([keys, val], idx) => {
            const [k1, k2 = ''] = keys.split('_');
            // Detect whether to use 'body' or 'content' based on what's available
            const textContent = val?.body ?? val?.content ?? '';
            return (
              <div
                key={idx}
                className="dark:bg-blue-50/5 dark:border-gray-700 p-5 rounded-xl border-2 transition-all bg-gray-50 border-gray-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-bold text-lg">
                    {capitalizeFirstLetter(k1)} {capitalizeFirstLetter(k2)}{val?.title ? `: ${val.title}` : ''}
                  </h3>
                </div>
                <p className="leading-relaxed opacity-90 whitespace-pre-line dark:text-white text-base">
                  {textContent}
                </p>
              </div>
            );
          })
        )}
        {/* =================== END NEW DATA-PATTERN-BASED RENDERING =================== */}


        {/* =================== OLD LEVEL-BASED RENDERING (BACKUP) =================== */}
        {/* {
          readingTexts &&  (level === 'A1' || level === 'a1' || level === 'B2' || level === 'b2') 
            && (Object.entries(readingTexts as Record<string, ReadingSection>))
                .map(([keys, val], idx) => {
                  const [k1, k2 = ''] = keys.split('_');
                  return (
                    <div
                      key={idx} className="dark:bg-blue-50/5 dark:border-gray-700 p-5 rounded-xl border-2 transition-all bg-gray-50 border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-bold text-lg">
                          {capitalizeFirstLetter(k1)} {capitalizeFirstLetter(k2)}: {val.title}
                        </h3>
                      </div>
                      <p className="leading-relaxed opacity-90 whitespace-pre-line dark:text-white text-base">
                        {val?.body}
                      </p>
                    </div>
                  );
                })
        }
        {readingTexts &&
            (level === "C1" || level === "c1") &&
            Object.entries(readingTexts as Record<string, ReadingSection>).map(([keys, val] , idx) => {
              const [k1, k2 = ""] = keys.split("_");

              return (
                <div
                  key={idx}
                  className="dark:bg-blue-50/5 dark:border-gray-700 p-5 rounded-xl border-2 transition-all bg-gray-50 border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-lg">
                      {capitalizeFirstLetter(k1)}{" "}
                      {capitalizeFirstLetter(k2)}: {val.title}
                    </h3>
                  </div>

                  <p className="leading-relaxed opacity-90 whitespace-pre-line dark:text-white text-base">
                    {val.content}
                  </p>
                </div>
              );
            })}
        {
          readingTexts &&   (level === 'A2' || level === 'a2' || level === 'B1' || level === 'b1' || level === 'C2' || level === 'c2' )
              && <div className="dark:bg-blue-50/5 dark:border-gray-700 p-5 rounded-xl border-2 transition-all bg-gray-50 border-gray-100">
                    <p className="leading-relaxed opacity-90 whitespace-pre-line dark:text-white text-base">
                        {readingTexts as string}
                    </p>
                </div>
        } */}
        {/* =================== END OLD LEVEL-BASED RENDERING (BACKUP) =================== */}
      </div>
    </div>
  );
}
