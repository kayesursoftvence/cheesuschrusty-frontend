 
import readingicon from "../../../../../../../assets/Dashbord/darkreading.svg";
import type { JSX } from "react"
import Loading from "./loading";
import Error from "./Error";
import { useReadingPracticeData } from "../hooks/useReadingPracticeData";

interface ReadingSection {
  title: string;
  body?: string;
  content?: string;
}

export default function PassageDisplay(): JSX.Element {
  // =================== USE SHARED HOOK ===================
  const { isLoading, isError, refetch, topic, teacherPackContent} = useReadingPracticeData();

  // =================== DATA-PATTERN-BASED LOGIC (Component-specific) ===================
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
  // =================== END DATA-PATTERN-BASED LOGIC ===================

  function capitalizeFirstLetter(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // =================== LOADING / ERROR STATES ===================
  if (isLoading) return <Loading />;
  if (isError) return <Error onRetry={refetch} />;

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
        {/* =================== DATA-PATTERN-BASED RENDERING =================== */}
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
        {/* =================== END DATA-PATTERN-BASED RENDERING =================== */}
      </div>
    </div>
  );
}
