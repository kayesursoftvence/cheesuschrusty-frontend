// src/components/test/layouts/GapFillLayout.tsx

import { useState, useEffect } from 'react';
import type { JSX } from 'react';
// import type { LayoutProps, GapFillAnswer } from '../types/test.types';
import { LayoutProps, GapFillAnswer } from '../test.types';

export default function GapFillLayout({  config, onAnswerChange }: LayoutProps): JSX.Element {
  const itemCount = config.items || 8;

  const [answers, setAnswers] = useState<GapFillAnswer[]>(
    Array.from({ length: itemCount }, (_, i) => ({
      gapIndex: i,
      value: '',
    }))
  );

  useEffect(() => {
    if (onAnswerChange) {
      const formatted = answers
        .filter(a => a.value.trim() !== '')
        .map(a => `${a.gapIndex + 1}:${a.value.trim()}`)
        .join(', ');
      onAnswerChange(formatted);
    }
  }, [answers, onAnswerChange]);

  function handleChange(index: number, value: string) {
    setAnswers((prev) =>
      prev.map((a) => (a.gapIndex === index ? { ...a, value } : a))
    );
  }

  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-xl p-10 space-y-8 text-slate-200">
      <div className="bg-blue-600/20 text-blue-300 border border-blue-500/30 p-4 rounded-lg flex gap-3 text-base leading-normal">
        <i className="fas fa-info-circle mt-1"></i>
        <span className="font-bold">
          Instructions: Complete each sentence by filling in the blank with the correct word or phrase.
        </span>
      </div>

      <div className="space-y-5">
        {Array.from({ length: itemCount }, (_, i) => (
          <div
            key={i}
            className="bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-colors p-5 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <span className="text-blue-400 font-mono font-bold mt-1 shrink-0">{i + 1}.</span>
              <div className="flex-1">
                <p className="text-slate-300 text-lg leading-relaxed">
                  La settimana scorsa sono{' '}
                  <span className="inline-flex items-center mx-1">
                    <input
                      type="text"
                      value={answers[i].value}
                      onChange={(e) => handleChange(i, e.target.value)}
                      className="bg-slate-900 border-b-2 border-blue-500/50 focus:border-blue-400 px-3 py-1 text-blue-300 font-mono outline-none min-w-[140px] text-center"
                      placeholder="________"
                    />
                  </span>{' '}
                  al cinema con i miei amici.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}