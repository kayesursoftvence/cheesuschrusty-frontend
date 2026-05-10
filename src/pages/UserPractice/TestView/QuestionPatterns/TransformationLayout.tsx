// src/components/test/layouts/TransformationLayout.tsx

import  { useState, useEffect } from 'react';
import type { JSX } from 'react';
import type { LayoutProps, TransformationAnswer } from '../test.types';

export default function TransformationLayout({ config, onAnswerChange }: LayoutProps): JSX.Element {
  const itemCount = config.items || 6;

  const [answers, setAnswers] = useState<TransformationAnswer[]>(
    Array.from({ length: itemCount }, (_, i) => ({
      itemIndex: i,
      value: '',
    }))
  );

  useEffect(() => {
    if (onAnswerChange) {
      const formatted = answers
        .filter(a => a.value.trim() !== '')
        .map(a => `${a.itemIndex + 1}:${a.value.trim()}`)
        .join(', ');
      onAnswerChange(formatted);
    }
  }, [answers, onAnswerChange]);

  function handleChange(index: number, value: string) {
    setAnswers((prev) =>
      prev.map((a) => (a.itemIndex === index ? { ...a, value } : a))
    );
  }

  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-xl p-10 space-y-8 text-slate-200">
      <div className="bg-blue-600/20 text-blue-300 border border-blue-500/30 p-4 rounded-lg flex gap-3 text-base leading-normal">
        <i className="fas fa-info-circle mt-1"></i>
        <span className="font-bold">
          Instructions: Rewrite each sentence using the word given in bold, keeping the meaning the same.
          Do NOT change the given word.
        </span>
      </div>

      <div className="space-y-6">
        {Array.from({ length: itemCount }, (_, i) => (
          <div
            key={i}
            className="bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-colors p-6 rounded-xl space-y-4"
          >
            <div className="flex items-start gap-3">
              <span className="text-blue-400 font-mono font-bold mt-0.5 shrink-0">{i + 1}.</span>
              <div className="flex-1 space-y-3">
                {/* Original sentence */}
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                    Original:
                  </span>
                  <p className="text-slate-300 text-lg mt-1">
                    "Non ho potuto venire alla festa perché ero malato."
                  </p>
                </div>

                {/* Key word */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                    Key Word:
                  </span>
                  <span className="bg-yellow-900/40 text-yellow-400 px-3 py-1 rounded font-bold font-mono border border-yellow-500/30">
                    PERCHÉ
                  </span>
                </div>

                {/* Rewrite input */}
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2 block">
                    Your Rewrite:
                  </span>
                  <textarea
                    value={answers[i].value}
                    onChange={(e) => handleChange(i, e.target.value)}
                    className="w-full bg-[#0b0f1a] border-2 border-slate-700 focus:border-blue-500 rounded-lg p-4 text-slate-200 outline-none resize-none h-20"
                    placeholder="Rewrite the sentence here..."
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}