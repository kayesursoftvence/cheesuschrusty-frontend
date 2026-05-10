// src/components/test/layouts/MCQLayout.tsx

import { useState, useEffect, useMemo } from 'react';
import type { JSX } from 'react';
import { LayoutProps, MCQAnswer } from '../test.types';
import QuestionWrapper from '../QuestionWrapper';

import { normalizeMCQPractice } from './MCQLayout.utils';

export default function MCQLayout({ state, questionData, onAnswerChange }: LayoutProps): JSX.Element {
  
  const practiceData = useMemo(() => questionData ? normalizeMCQPractice(questionData) : null, [questionData]);
  const questionsList = useMemo(() => practiceData?.questions || [], [practiceData]);

  const [answers, setAnswers] = useState<MCQAnswer[]>([]);

  // Initialize answers state based on dynamic questions length
  useEffect(() => {
    if (questionsList.length > 0 && answers.length === 0) {
      setAnswers(
        Array.from({ length: questionsList.length }, (_, i) => ({
          questionIndex: i, // We use index to map it internally
          selectedOption: null, 
          // Note: In real scenarios, you might want to save the `id` of the selected option, 
          // not the index, but keeping it aligned with MCQAnswer type for now.
        }))
      );
    }
  }, [questionsList, answers.length]);

  useEffect(() => {
    if (onAnswerChange && answers.length > 0) {
      // Format answers as "Index:OptionID" e.g. "1:A"
      const formattedAnswers = answers
        .filter(a => a.selectedOption !== null)
        .map(a => {
          const q = questionsList[a.questionIndex];
          const opt = q.options[a.selectedOption!];
          const label = opt.id || String.fromCharCode(65 + a.selectedOption!);
          return `${a.questionIndex + 1}:${label}`;
        })
        .join(', ');
      onAnswerChange(formattedAnswers);
    }
  }, [answers, onAnswerChange, questionsList]);

  function handleSelect(questionIndex: number, optionIndex: number) {
    setAnswers((prev) =>
      prev.map((a) =>
        a.questionIndex === questionIndex ? { ...a, selectedOption: optionIndex } : a
      )
    );
  }

  if (!practiceData) {
    return (
      <div className="bg-slate-800/50 border border-white/5 rounded-xl p-10 text-center text-slate-400">
        <p>No MCQ data found in the provided response.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-xl p-10 space-y-8 text-lg leading-loose text-slate-200">
      
      {/* General Instructions */}
      {practiceData.instructions && (
        <div className="bg-blue-600/20 text-blue-300 border border-blue-500/30 p-4 rounded-lg flex gap-3 text-base leading-normal">
          <i className="fas fa-info-circle mt-1"></i>
          <span className="font-bold">
            {practiceData.instructions}
          </span>
        </div>
      )}

      {/* Stimulus Passage / Context */}
      {(practiceData.stimulus.title || practiceData.stimulus.text) && (
        <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl text-left mb-8 shadow-inner">
          {practiceData.stimulus.title && (
             <h3 className="font-bold text-xl mb-3 text-slate-200">{practiceData.stimulus.title}</h3>
          )}
          {practiceData.stimulus.text ? (
             <p className="text-slate-400 text-base italic leading-relaxed whitespace-pre-line">
              {practiceData.stimulus.text}
             </p>
          ) : (
             <p className="text-slate-500 italic">
               [Stimulus Content Placeholder — passage or audio transcript for {state.domainIt}]
             </p>
          )}
        </div>
      )}

      <div className="space-y-4">
        {questionsList.map((q, i) => (
          <QuestionWrapper
            key={q.id || i}
            index={i}
            question={q.text || `Sample question about ${state.domainIt}?`}
          >
            <div className="grid grid-cols-1 gap-3">
              {(q.options || []).map((opt, j) => {
                // Determine if this option is selected using the index mapping we setup
                const ansObj = answers.find(a => a.questionIndex === i);
                const isSelected = ansObj ? ansObj.selectedOption === j : false;
                
                return (
                  <label
                    key={opt.id || j}
                    className={`p-3 border rounded cursor-pointer flex items-start gap-3 transition-colors duration-150 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-900/30 text-blue-200'
                        : 'border-slate-700 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      <input
                        type="radio"
                        name={`mcq-q${i}`}
                        checked={isSelected}
                        onChange={() => handleSelect(i, j)}
                        className="accent-blue-500 w-4 h-4 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1 leading-tight flex items-start">
                      <span className="font-mono text-sm text-slate-500 mr-2 mt-0.5">
                        {opt.id || String.fromCharCode(65 + j)}.
                      </span>
                      <span className={isSelected ? 'font-medium' : ''}>
                        {opt.text || `Option ${String.fromCharCode(65 + j)}`}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </QuestionWrapper>
        ))}
        {questionsList.length === 0 && (
          <div className="text-slate-500 italic text-center py-4">
             No questions available in this dataset.
          </div>
        )}
      </div>
    </div>
  );
}