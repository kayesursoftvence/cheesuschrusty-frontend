/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { CheckCircle, Type } from 'lucide-react';
import { GrammarPracticeApiResponse } from './types';

interface GrammarPracticeProps {
  exercise: GrammarPracticeApiResponse;
  prompt?: string;
  onSubmit: (answers: any, score: number) => void;
  showTranslation?: boolean;
}

const GrammarPractice: React.FC<GrammarPracticeProps> = ({ 
  exercise, 
  prompt, 
  onSubmit,
  showTranslation = false 
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleSelectAnswer = (questionIndex: number, answer: string) => {
    if (!isSubmitted) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: answer
      }));
    }
  };

  const calculateScore = () => {
    const totalQuestions = exercise.questions.length;
    let correctAnswers = 0;

    exercise.questions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index];
      if (userAnswer === question.answer) {
        correctAnswers++;
      }
    });

    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  const handleSubmit = () => {
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setIsSubmitted(true);
    
    setTimeout(() => {
      onSubmit(selectedAnswers, calculatedScore);
    }, 2000);
  };

  const isAllAnswered = Object.keys(selectedAnswers).length === exercise.questions.length;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Type className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Grammar Practice
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {prompt || 'Choose the correct grammatical form for each sentence'}
        </p>
        
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Currently viewing: <span className="font-medium">
            {showTranslation ? "English" : "Italian"}
          </span>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-6">
          {exercise.questions.map((question, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Question {index + 1}: {showTranslation ? question.english_sentence : question.italian_sentence}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {question.options.map((option, optionIndex) => {
                  const optionLetter = String.fromCharCode(65 + optionIndex);
                  const isSelected = selectedAnswers[index] === optionLetter;
                  const isCorrect = optionLetter === question.answer;
                  const optionText = showTranslation ? option.english : option.italian;
                  
                  return (
                    <button
                      key={optionIndex}
                      onClick={() => handleSelectAnswer(index, optionLetter)}
                      disabled={isSubmitted}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        isSubmitted
                          ? isCorrect
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : isSelected && !isCorrect
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-200 dark:border-gray-600'
                          : isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                          isSubmitted && isCorrect
                            ? 'bg-green-500 text-white'
                            : isSubmitted && isSelected && !isCorrect
                            ? 'bg-red-500 text-white'
                            : isSelected
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}>
                          {optionLetter}
                        </div>
                        <span className="text-gray-800 dark:text-gray-200">{optionText}</span>
                      </div>
                      
                      {isSubmitted && isCorrect && (
                        <div className="mt-2 flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Correct answer
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Answered: {Object.keys(selectedAnswers).length}/{exercise.questions.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round((Object.keys(selectedAnswers).length / exercise.questions.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(Object.keys(selectedAnswers).length / exercise.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {score !== null && (
          <div className="text-center animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                Score: {score}%
              </span>
            </div>
            
            <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-green-500 transition-all duration-1000"
                style={{ width: `${score}%` }}
              ></div>
            </div>
            
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {score >= 90 ? 'Excellent grammar skills! 🎉' :
               score >= 75 ? 'Good job! Your grammar is improving.' :
               score >= 60 ? 'Not bad. Review the grammar rules.' :
               'Keep practicing. Focus on grammar rules.'}
            </p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!isAllAnswered || isSubmitted}
            className={`px-8 py-3 cursor-pointer rounded-lg font-medium text-lg transition-colors ${
              !isAllAnswered || isSubmitted
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSubmitted ? 'Continue to Next Exercise' : 'Submit Answers'}
          </button>
          
          {!isAllAnswered && (
            <p className="mt-2 text-sm text-red-500 dark:text-red-400">
              Please answer all questions before submitting
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrammarPractice;











// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from 'react';
// import { CheckCircle, Type } from 'lucide-react';
// import { GrammarPracticeApiResponse } from './types';

// interface GrammarPracticeProps {
//   exercise: GrammarPracticeApiResponse;
//   prompt?: string;
//   onSubmit: (answers: any, score: number) => void;
// }

// const GrammarPractice: React.FC<GrammarPracticeProps> = ({ exercise, prompt, onSubmit }) => {
//   const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [score, setScore] = useState<number | null>(null);

//   const handleSelectAnswer = (questionIndex: number, answer: string) => {
//     if (!isSubmitted) {
//       setSelectedAnswers(prev => ({
//         ...prev,
//         [questionIndex]: answer
//       }));
//     }
//   };

//   const calculateScore = () => {
//     const totalQuestions = exercise.questions.length;
//     let correctAnswers = 0;

//     exercise.questions.forEach((question, index) => {
//       const userAnswer = selectedAnswers[index];
//       if (userAnswer === question.answer) {
//         correctAnswers++;
//       }
//     });

//     return Math.round((correctAnswers / totalQuestions) * 100);
//   };

//   const handleSubmit = () => {
//     const calculatedScore = calculateScore();
//     setScore(calculatedScore);
//     setIsSubmitted(true);
    
//     // Submit after 2 seconds to show score
//     setTimeout(() => {
//       onSubmit(selectedAnswers, calculatedScore);
//     }, 2000);
//   };

//   const isAllAnswered = Object.keys(selectedAnswers).length === exercise.questions.length;

//   return (
//     <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
//       <div className="text-center mb-8">
//         <div className="flex items-center justify-center gap-2 mb-2">
//           <Type className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//             Grammar Practice
//           </h2>
//         </div>
//         <p className="text-gray-600 dark:text-gray-400">
//           {prompt || 'Choose the correct grammatical form for each sentence'}
//         </p>
//       </div>

//       <div className="space-y-8">
//         {/* Questions */}
//         <div className="space-y-6">
//           {exercise.questions.map((question, index) => (
//             <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                 Question {index + 1}: {question.sentence}
//               </h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 {question.options.map((option, optionIndex) => {
//                   const optionLetter = String.fromCharCode(65 + optionIndex);
//                   const isSelected = selectedAnswers[index] === optionLetter;
//                   const isCorrect = optionLetter === question.answer;
                  
//                   return (
//                     <button
//                       key={optionIndex}
//                       onClick={() => handleSelectAnswer(index, optionLetter)}
//                       disabled={isSubmitted}
//                       className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
//                         isSubmitted
//                           ? isCorrect
//                             ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
//                             : isSelected && !isCorrect
//                             ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
//                             : 'border-gray-200 dark:border-gray-600'
//                           : isSelected
//                           ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
//                           : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
//                       }`}
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
//                           isSubmitted && isCorrect
//                             ? 'bg-green-500 text-white'
//                             : isSubmitted && isSelected && !isCorrect
//                             ? 'bg-red-500 text-white'
//                             : isSelected
//                             ? 'bg-blue-500 text-white'
//                             : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
//                         }`}>
//                           {optionLetter}
//                         </div>
//                         <span className="text-gray-800 dark:text-gray-200">{option}</span>
//                       </div>
                      
//                       {isSubmitted && isCorrect && (
//                         <div className="mt-2 flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
//                           <CheckCircle className="w-4 h-4" />
//                           Correct answer
//                         </div>
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>
              
//               {isSubmitted && (
//                 <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                   <p className="text-sm text-blue-700 dark:text-blue-300">
//                     <strong>Correct Answer:</strong> {question.answer}
//                   </p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Progress */}
//         <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-sm text-gray-600 dark:text-gray-400">
//               Answered: {Object.keys(selectedAnswers).length}/{exercise.questions.length}
//             </span>
//             <span className="text-sm text-gray-600 dark:text-gray-400">
//               {Math.round((Object.keys(selectedAnswers).length / exercise.questions.length) * 100)}% Complete
//             </span>
//           </div>
//           <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//             <div 
//               className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${(Object.keys(selectedAnswers).length / exercise.questions.length) * 100}%` }}
//             ></div>
//           </div>
//         </div>

//         {/* Score Display */}
//         {score !== null && (
//           <div className="text-center animate-fade-in">
//             <div className="flex items-center justify-center gap-2 mb-3">
//               <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
//               <span className="text-xl font-semibold text-gray-900 dark:text-white">
//                 Score: {score}%
//               </span>
//             </div>
            
//             <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-3">
//               <div 
//                 className="h-full rounded-full bg-gradient-to-r from-blue-400 to-green-500 transition-all duration-1000"
//                 style={{ width: `${score}%` }}
//               ></div>
//             </div>
            
//             <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
//               {score >= 90 ? 'Excellent grammar skills! 🎉' :
//                score >= 75 ? 'Good job! Your grammar is improving.' :
//                score >= 60 ? 'Not bad. Review the grammar rules.' :
//                'Keep practicing. Focus on grammar rules.'}
//             </p>
//           </div>
//         )}

//         {/* Submit Button */}
//         <div className="text-center">
//           <button
//             onClick={handleSubmit}
//             disabled={!isAllAnswered || isSubmitted}
//             className={`px-8 py-3 rounded-lg font-medium text-lg transition-colors ${
//               !isAllAnswered || isSubmitted
//                 ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
//                 : 'bg-blue-600 text-white hover:bg-blue-700'
//             }`}
//           >
//             {isSubmitted ? 'Continue to Next Exercise' : 'Submit Answers'}
//           </button>
          
//           {!isAllAnswered && (
//             <p className="mt-2 text-sm text-red-500 dark:text-red-400">
//               Please answer all questions before submitting
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GrammarPractice;








 