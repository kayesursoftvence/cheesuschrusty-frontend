// src/components/test/layouts/MatchingLayout.tsx
import { useState, useEffect, useMemo } from 'react';
import type { JSX } from 'react';
// import type { LayoutProps } from '../types/test.types';
import { LayoutProps } from '../test.types';

import { normalizeQuestionSet } from './MatchingLayout.utils';

export default function MatchingLayout({ 
                                // state, config, 
                                questionData,
                                onAnswerChange }: LayoutProps): JSX.Element {
  // Use normalized data if available, otherwise fallback to empty structure
  console.log("Matching layout")
  console.log(questionData)
  const questionSet = useMemo(() => questionData ? normalizeQuestionSet(questionData) : null, [questionData]);

  console.log(questionSet)

  // Derive items and options from questionSet if available
  const items = useMemo(() => questionSet?.questions.map((q, idx) => ({
    id: idx,
    apiId: q.id,
    text: q.text,
  })) || [], [questionSet]);

  // Assuming matching options are the 'options' from the questions
  // For matching, usually all questions share the same pool of options
  const matchOptions = useMemo(() => questionSet?.questions[0]?.options.map(opt => opt.id) || [], [questionSet]);

  const [matches, setMatches] = useState<Record<number, string>>({});

  useEffect(() => {
    if (onAnswerChange) {
      const formatted = Object.entries(matches)
        .filter(([, val]) => val !== '')
        .map(([idx, val]) => `${parseInt(idx) + 1}:${val}`)
        .join(', ');
      onAnswerChange(formatted);
    }
  }, [matches, onAnswerChange]);

  function handleMatch(itemIndex: number, value: string) {
    setMatches((prev) => ({ ...prev, [itemIndex]: value }));
  }

  // If no items found even after normalization attempt
  if (!items.length) {
    return (
      <div className="bg-slate-800/50 border border-white/5 rounded-xl p-10 text-center text-slate-400">
        <p>No matching questions found in the provided data.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-xl p-10 space-y-8 text-slate-200">
      {questionSet?.instructions && (
        <div className="bg-blue-600/20 text-blue-300 border border-blue-500/30 p-4 rounded-lg flex gap-3 text-base leading-normal">
          <i className="fas fa-info-circle mt-1"></i>
          <span className="font-bold">
            {questionSet.instructions}
          </span>
        </div>
      )}

      {/* Options Reference */}
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg">
        <div className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-bold">
          Available Options
        </div>
        <div className="flex flex-wrap gap-3">
          {matchOptions.map((optId) => {
            const isUsed = Object.values(matches).includes(optId);
            const optText = questionSet?.questions[0]?.options.find(o => o.id === optId)?.text || optId;
            return (
              <span
                key={optId}
                className={`px-4 py-2 rounded-lg font-mono font-bold text-sm transition ${isUsed
                  ? 'bg-blue-900/40 text-blue-400 border border-blue-500/30'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
              >
                {optId}. {optText}
              </span>
            );
          })}
        </div>
      </div>

      {/* Matching Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-colors p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex-1">
              <span className="text-blue-400 font-mono font-bold mr-3">{item.id + 1}.</span>
              <span className="text-slate-300">{item.text}</span>
            </div>
            <select
              value={matches[item.id] || ''}
              onChange={(e) => handleMatch(item.id, e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 px-4 py-2 rounded-lg outline-none focus:border-blue-500 min-w-[120px] cursor-pointer"
            >
              <option value="">Select...</option>
              {matchOptions.map((optId) => (
                <option key={optId} value={optId}>
                  {optId}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}