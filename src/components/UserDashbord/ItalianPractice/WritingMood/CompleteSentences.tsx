/* eslint-disable @typescript-eslint/no-explicit-any */


import React, { useState } from 'react';
import { CheckCircle, Edit2 } from 'lucide-react';
import { CompleteSentenceApiResponse } from './types';

interface CompleteSentencesProps {
  exercise: CompleteSentenceApiResponse;
  prompt?: string;
  onSubmit: (answers: any, score: number) => void;
  showTranslation?: boolean;
}

const CompleteSentences: React.FC<CompleteSentencesProps> = ({ 
  exercise, 
  prompt, 
  onSubmit,
  showTranslation = false 
}) => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showHints, setShowHints] = useState<{ [key: number]: boolean }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleAnswerChange = (index: number, value: string) => {
    if (!isSubmitted) {
      setAnswers(prev => ({
        ...prev,
        [index]: value
      }));
    }
  };

  const toggleHint = (index: number) => {
    setShowHints(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const calculateScore = () => {
    const totalQuestions = exercise.questions.length;
    if (totalQuestions === 0) return 0;
    
    let correctAnswers = 0;
    let answeredCount = 0;

    exercise.questions.forEach((question, index) => {
      const userAnswer = answers[index]?.toLowerCase().trim();
      const correctAnswer = question.answer.toLowerCase().trim();
      
      if (userAnswer && userAnswer.length > 0) {
        answeredCount++;
        if (userAnswer === correctAnswer) {
          correctAnswers++;
        }
      }
    });

    // Only calculate if all questions are answered
    if (answeredCount !== totalQuestions) {
      console.warn('Not all questions answered. Answered:', answeredCount, 'Total:', totalQuestions);
      return 0;
    }

    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    return Math.max(0, Math.min(100, percentage));
  };

  const handleSubmit = () => {
    // Double-check all answers are present
    const allAnswered = exercise.questions.every((_, index) => {
      const answer = answers[index]?.trim();
      return answer && answer.length > 0;
    });

    if (!allAnswered) {
      console.error('Cannot submit: Not all questions answered');
      return;
    }

    const calculatedScore = calculateScore();
    
    if (calculatedScore === 0 && Object.keys(answers).length === exercise.questions.length) {
      // If score is 0 but all answered, log for debugging
    }
    
    setScore(calculatedScore);
    setIsSubmitted(true);
    
    setTimeout(() => {
      onSubmit(answers, calculatedScore);
    }, 2000);
  };

  const isAllAnswered = Object.keys(answers).length === exercise.questions.length;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Edit2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Complete the Sentences
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {prompt || 'Fill in the blanks with the correct Italian words'}
        </p>
        
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Currently viewing: <span className="font-medium">
            {showTranslation ? "English" : "Italian"}
          </span>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-6">
          {exercise.questions.map((question, index) => {
            const sentence = showTranslation ? question.english_sentence : question.italian_sentence;
            const sentenceParts = sentence.split('___');
            
            return (
              <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2 flex-wrap text-lg md:text-xl">
                    <span className="text-gray-800 dark:text-gray-200">{sentenceParts[0]}</span>
                    <input
                      type="text"
                      placeholder="..."
                      value={answers[index] || ''}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      disabled={isSubmitted}
                      className={`px-4 py-2 border-2 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 min-w-[120px] focus:outline-none transition-all duration-200 ${
                        isSubmitted
                          ? answers[index]?.toLowerCase().trim() === question.answer.toLowerCase().trim()
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
                      }`}
                    />
                    <span className="text-gray-800 dark:text-gray-200">{sentenceParts[1]}</span>
                  </div>
                  
                  <button
                    onClick={() => toggleHint(index)}
                    disabled={isSubmitted}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      isSubmitted
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : showHints[index]
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span>💡</span>
                    {showHints[index] ? question.hint : 'Show Hint'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Completed: {Object.keys(answers).length}/{exercise.questions.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round((Object.keys(answers).length / exercise.questions.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 dark:bg-green-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(Object.keys(answers).length / exercise.questions.length) * 100}%` }}
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
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000"
                style={{ width: `${score}%` }}
              ></div>
            </div>
            
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {score >= 90 ? 'Excellent sentence construction! 🎉' :
               score >= 75 ? 'Good job! Your sentences are well-formed.' :
               score >= 60 ? 'Not bad. Work on vocabulary and grammar.' :
               score >= 30 ? 'Keep practicing. Focus on sentence structure.' : 'Keep practicing. Focus on sentence structure.'
               }
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
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isSubmitted ? 'Continue to Next Exercise' : 'Submit Answers'}
          </button>
          
          {!isAllAnswered && (
            <p className="mt-2 text-sm text-red-500 dark:text-red-400">
              Please complete all sentences before submitting
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteSentences;







 