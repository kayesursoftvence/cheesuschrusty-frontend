import React from "react";
import { Volume2, Clock } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { Phase, PHASES } from "../types";
import { ExerciseTimer } from "./ExerciseTimer";
import { NormalizedQuestion } from "../utils/normalizeResponse";

interface QuestionDisplayProps {
  showQuestionList: boolean;
  setShowQuestionList: (s: boolean) => void;
  questions: NormalizedQuestion[];
  currentQuestion: number;
  setCurrentQuestion: (idx: number) => void;
  answeredQuestions: Set<number>;
  handleAnswerSelect: (questionId: number, answer: string) => void;
  callEvaluationAPI: () => Promise<void>;
  phase: Phase;
  instructions: string;
  selectedAnswer: string | null;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  showQuestionList,
  setShowQuestionList,
  questions,
  currentQuestion,
  setCurrentQuestion,
  answeredQuestions,
  handleAnswerSelect,
  callEvaluationAPI,
  phase,
  instructions,
  selectedAnswer
}) => {
  const onOptionSelect = (optionText: string) => {
    handleAnswerSelect(questions[currentQuestion].id, optionText);
  };

  const onNextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      await callEvaluationAPI();
    }
  };

  const onPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      setShowQuestionList(true);
    }
  };

  if (showQuestionList) {
    return (
      <div className="rounded-xl mt-8 mb-6">
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">📋 Questions to Answer:</h4>
          <p className="text-blue-700 dark:text-blue-400">{instructions || 'Listen to the dialogues and answer the following questions:'}</p>
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowQuestionList(false)}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2 mx-auto"
          >
            <Volume2 className="w-5 h-5" /> Start Listening & Answer Questions
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  
  if (!currentQ && !showQuestionList) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 mt-8 mb-6">
        <p className="text-gray-500">Loading question...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-6 rounded-2xl shadow-sm p-8 dark:bg-gray-800 bg-white border dark:border-gray-700 border-gray-100 mt-8 mb-6">
      <div className="flex justify-between items-center mb-6 gap-5">
        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <span className="text-sm">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-sm text-gray-500">{answeredQuestions.size} answered • {questions.length - answeredQuestions.size} remaining</span>
          </div>
          <ProgressBar progress={Math.round(((currentQuestion + 1) / questions.length) * 100)} color="bg-blue-600" height="h-2" />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border rounded-lg">
          <Clock className="w-5 h-5" />
          <span className="font-mono font-bold"><ExerciseTimer isRunning={([PHASES.QUESTIONS, PHASES.DICTATION, PHASES.SENTENCE] as Phase[]).includes(phase)} /></span>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg py-4 px-4 font-semibold bg-gray-100 dark:bg-gray-700 rounded-xl">
          {currentQ?.text}
        </h3>

        <div className="space-y-4">
          {currentQ?.options && currentQ.options.length > 0 ? (
            currentQ.options.map((option, idx) => {
              const optionText = option.text;
              const isSelected = selectedAnswer === optionText;
              return (
                <button
                  key={idx}
                  onClick={() => onOptionSelect(optionText)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${isSelected ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 transform scale-[1.02]' : 'border-gray-200 dark:border-gray-700 hover:border-blue-500'}`}
                >
                  <span className="font-bold mr-3">{option.key}.</span> {optionText}
                </button>
              );
            })
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Answer</label>
              <textarea
                value={selectedAnswer || ''}
                onChange={(e) => onOptionSelect(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm resize-none h-28"
              />
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button onClick={onPreviousQuestion} className={`px-6 py-2 rounded-lg border ${currentQuestion === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            {currentQuestion === 0 ? 'Back to List' : 'Previous'}
          </button>
          <button onClick={onNextQuestion} disabled={!selectedAnswer} className={`px-6 py-2 rounded-lg font-medium ${selectedAnswer ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"}`}>
            {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};
