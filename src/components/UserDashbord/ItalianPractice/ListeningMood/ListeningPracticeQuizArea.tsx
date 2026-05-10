 
 
import type { JSX } from "react" 
import { useState } from "react";
import { ProgressBar } from '@/components/ProgressBar/ProgressBar';
import { Link } from "react-router-dom";

interface QuestionOption {
  key: string;       // e.g. "A", "B", "C"
  text: string;      // option text
}
interface ListeningQuestion {
  id: number;                    // unique question id
  text: string;                  // question text
  options?: QuestionOption[];
  questionType: string;
    // array of options
}
interface Props {
  instructions: string;            // instructions text
  questions: ListeningQuestion[];  // array of questions
  lessonId: string | number;
}

type StudentAnswers = { [questionId: string]: string; };


export default function ListeningPracticeQuizArea({ instructions, questions, lessonId }: Props): JSX.Element {

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    // const [answers, setAnswers] = useState<Record<number, string>>({});

      const [studentAnswers, setStudentAnswers] = useState<StudentAnswers>({ "1": "", "2": "", "3": "", "4": "", "5": "", });
    

    // Event handlers
    // const handleAnswerSelect = (questionId: number, answer: string) => {
      
    // };

    function handleAnswerSelect(questionId: number, answer: string) {
      setStudentAnswers((prev: StudentAnswers) => ({ ...prev, [`${questionId}`]: answer }));
    }


    // Navigation between questions
    const handleQuestionNavigation = (direction: 'next' | 'prev') => {
      if (direction === 'next' && currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else if (direction === 'prev' && currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
      }
    };


  return (
    <>
              {/* Progress Bar */}
        <div className="mb-6 ">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-500">Listening Comprehension</span>
          </div>
          <ProgressBar 
            current={currentQuestionIndex + 1} 
            total={questions.length} 
            color="bg-blue-600" 
            height="h-3" 
            rounded="rounded-full" 
          />
        </div>

        {/* Question Area Placeholder */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl mb-8">
          <h3 className="text-lg font-semibold mb-4">{instructions}</h3>
          {questions[currentQuestionIndex] && (
            <div className="space-y-6">
              <p className="text-xl">{questions[currentQuestionIndex].text}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQuestionIndex].options?.map((option) => (
                  <button
                    key={option.key}
                    onClick={() =>
                      handleAnswerSelect(questions[currentQuestionIndex].id, option.key)
                    }
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      studentAnswers[questions[currentQuestionIndex].id] === option.key
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-transparent bg-white dark:bg-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <span className="font-bold mr-2">{option.key}.</span>
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Question Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => handleQuestionNavigation('prev')}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-lg ${currentQuestionIndex === 0 
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'} text-white transition-colors`}
          >
            Previous
          </button>

          {
            !(currentQuestionIndex === (questions.length - 1))
              ? <button onClick={() => handleQuestionNavigation('next')}
                        disabled={currentQuestionIndex === questions.length - 1}
                        className={`px-4 py-2 rounded-lg ${currentQuestionIndex === questions.length - 1 
                          ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'} text-white transition-colors`} >
                  Next
                </button>
              :  <Link to={`/user/practice/performance/${lessonId ?? ""}?type=listening&ans=${encodeURIComponent(Object.entries(studentAnswers).map(([seq, ans])=>`${seq}:${ans}`).join(","))}`} 
                    className={`px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 cursor-pointer text-white transition-colors`} >
                    Finish
                  </Link>
          }
          
        </div>
    </>
  )
}