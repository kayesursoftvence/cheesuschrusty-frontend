import { CheckCircle } from "lucide-react";
import type { JSX } from "react";
import type { AnswerReviewItem } from "../types";
import { getAnswerText, getOptionLetter } from "../utils/answerUtils";

interface AnswerReviewSectionProps {
  answerReviewData: AnswerReviewItem[];
}

export default function AnswerReviewSection({ answerReviewData }: AnswerReviewSectionProps): JSX.Element {
  if (answerReviewData.length === 0) return <></>;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2 px-1">
        <CheckCircle className="w-6 h-6 text-green-500" />
        Performance Review
      </h3>
      <div className="space-y-4">
        {answerReviewData.map((answer, index) => {
          const userAnswerText = getAnswerText(answer.userAnswer || "");
          const correctAnswerText = getAnswerText(answer.correctAnswer);
          const userOptionLetter = getOptionLetter(userAnswerText);
          const correctOptionLetter = getOptionLetter(correctAnswerText);
          
          return (
            <div
              key={index}
              className={`p-6 rounded-2xl border-2 transition-all ${
                answer.isCorrect
                  ? 'border-green-100 bg-green-50/30 dark:bg-green-900/5 dark:border-green-900/30'
                  : 'border-red-100 bg-red-50/30 dark:bg-red-900/5 dark:border-red-900/30'
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  answer.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  <span className="font-black">{index + 1}</span>
                </div>
                <p className="text-base font-bold text-gray-900 dark:text-white flex-1 pt-1 leading-relaxed">
                  {answer.question}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-14">
                <div className={`p-4 rounded-xl border-2 ${answer.isCorrect ? 'bg-white/50 border-green-200 dark:bg-gray-800' : 'bg-white/50 border-red-200 dark:bg-gray-800'}`}>
                  <p className="text-[9px] uppercase font-black tracking-widest opacity-40 mb-2">Your Answer</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${answer.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {userOptionLetter || '?'}
                    </span>
                    <span className={`text-sm font-medium ${answer.isCorrect ? 'text-gray-700 dark:text-gray-300' : 'text-red-600 dark:text-red-400'}`}>
                      {userAnswerText.replace(/^[A-D]\.\s*/, '')}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border-2 bg-white/50 border-emerald-200 dark:bg-gray-800">
                  <p className="text-[9px] uppercase font-black tracking-widest opacity-40 mb-2">Correct Match</p>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold bg-emerald-500 text-white">
                      {correctOptionLetter}
                    </span>
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      {correctAnswerText.replace(/^[A-D]\.\s*/, '')}
                    </span>
                  </div>
                </div>
              </div>

              {answer.explanation && (
                <div className="mt-4 ml-14 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-xs text-gray-500 italic font-medium leading-relaxed">
                    <span className="font-black tracking-widest uppercase text-[8px] mr-2 not-italic opacity-40">Explanation</span> 
                    "{answer.explanation}"
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
