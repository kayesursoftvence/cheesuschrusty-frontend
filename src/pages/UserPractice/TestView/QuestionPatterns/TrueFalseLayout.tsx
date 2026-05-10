// src/components/test/layouts/TrueFalseLayout.tsx

import { useState, useEffect, useMemo } from 'react';
import type { JSX } from 'react';
import { LayoutProps, TrueFalseAnswer } from '../test.types';

export default function TrueFalseLayout({ state, questionData, onAnswerChange }: LayoutProps): JSX.Element {
  
  // Inline robust extraction of data
  const c = useMemo(() => {
    let data = questionData?.data?.content || questionData?.data || questionData;
    if (questionData?.data?.questionSets && questionData.data.questionSets[0]?.content) {
      data = questionData.data.questionSets[0].content;
    }
    return data;
  }, [questionData]);

  const studentHandout = useMemo(() => c?.student_handout || {}, [c]);
  const teacherPack = useMemo(() => c?.teacher_pack || {}, [c]);
  
  const instructions = useMemo(() => studentHandout.instructions || c?.instructions || "Instructions: Read the passage below, then decide if each statement is True or False.", [studentHandout, c]);
  const stimulusText = useMemo(() => teacherPack.content?.stimulus?.text || studentHandout.stimulus?.text || c?.stimulus?.text || "", [teacherPack, studentHandout, c]);
  const stimulusTitle = useMemo(() => teacherPack.content?.stimulus?.title || studentHandout.stimulus?.title || c?.stimulus?.title || "", [teacherPack, studentHandout, c]);
  const questionsList: any[] = useMemo(() => studentHandout.questions || c?.questions || [], [studentHandout, c]);

  const [answers, setAnswers] = useState<TrueFalseAnswer[]>([]);

  // Initialize answers state based on dynamic questions length
  useEffect(() => {
    if (questionsList.length > 0 && answers.length === 0) {
      setAnswers(
        Array.from({ length: questionsList.length }, (_, i) => ({
          statementIndex: i,
          value: null,
        }))
      );
    }
  }, [questionsList, answers.length]);

  useEffect(() => {
    if (onAnswerChange && answers.length > 0) {
      const formatted = answers
        .filter(a => a.value !== null)
        .map(a => `${a.statementIndex + 1}:${a.value ? 'Vero' : 'Falso'}`)
        .join(', ');
      onAnswerChange(formatted);
    }
  }, [answers, onAnswerChange]);

  function handleSelect(index: number, value: boolean) {
    setAnswers((prev) =>
      prev.map((a) => (a.statementIndex === index ? { ...a, value } : a))
    );
  }

  if (questionsList.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-white/5 rounded-xl p-10 text-center text-slate-400">
        <p>No True/False questions found in the provided response.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-xl p-10 space-y-8 text-slate-200">
      
      <div className="bg-blue-600/20 text-blue-300 border border-blue-500/30 p-4 rounded-lg flex gap-3 text-base leading-normal">
        <i className="fas fa-info-circle mt-1"></i>
        <span className="font-bold">
          {instructions}
        </span>
      </div>

      {/* Reading Passage Place (Stimulus) */}
      {(stimulusTitle || stimulusText) && (
        <div className="bg-slate-900 border border-slate-700 p-6 rounded-lg">
          {stimulusTitle && (
            <h3 className="font-bold text-xl mb-3 text-slate-200">{stimulusTitle}</h3>
          )}
          {stimulusText ? (
            <p className="text-slate-300 leading-relaxed italic whitespace-pre-line">
              {stimulusText}
            </p>
          ) : (
            <p className="text-slate-500 italic">
              [Reading passage about {state.domainIt} will appear here. The passage will contain information that the candidate must use to determine if the following statements are true or false.]
            </p>
          )}
        </div>
      )}

      {/* Statements */}
      <div className="space-y-4">
        {questionsList.map((q, i) => {
          const answerObj = answers.find(a => a.statementIndex === i);
          const val = answerObj ? answerObj.value : null;
          
          return (
            <div
              key={q.id || i}
              className="bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-colors p-5 rounded-xl"
            >
              <p className="font-bold text-slate-200 mb-4">
                <span className="text-blue-400 font-mono mr-2">{i + 1}.</span>
                {q.text || `Sample statement about ${state.domainIt} that may be true or false.`}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleSelect(i, true)}
                  className={`flex-1 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all duration-200 cursor-pointer ${
                    val === true
                      ? 'bg-emerald-600 text-white border-2 border-emerald-400 shadow-lg shadow-emerald-900/30'
                      : 'bg-slate-800 text-slate-400 border-2 border-slate-700 hover:border-emerald-500/50'
                  }`}
                >
                  <i className="fas fa-check mr-2"></i> Vero (True)
                </button>
                <button
                  onClick={() => handleSelect(i, false)}
                  className={`flex-1 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all duration-200 cursor-pointer ${
                    val === false
                      ? 'bg-red-600 text-white border-2 border-red-400 shadow-lg shadow-red-900/30'
                      : 'bg-slate-800 text-slate-400 border-2 border-slate-700 hover:border-red-500/50'
                  }`}
                >
                  <i className="fas fa-times mr-2"></i> Falso (False)
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}