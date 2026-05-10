// src/components/test/layouts/ErrorRecognitionLayout.tsx

import { useState, useEffect } from 'react';
import type { JSX } from 'react';
import type { LayoutProps, ErrorRecognitionAnswer } from './test.types';

export default function ErrorRecognitionLayout({ config, onAnswerChange }: LayoutProps): JSX.Element {
  const itemCount = config.items || 8;

  const [answers, setAnswers] = useState<ErrorRecognitionAnswer[]>(
    Array.from({ length: itemCount }, (_, i) => ({
      itemIndex: i,
      identifiedError: '',
      correction: '',
    }))
  );

  useEffect(() => {
    if (onAnswerChange) {
      const formatted = answers
        .filter(a => a.identifiedError.trim() !== '' || a.correction.trim() !== '')
        .map(a => `${a.itemIndex + 1}:${a.identifiedError.trim()}->${a.correction.trim()}`)
        .join(', ');
      onAnswerChange(formatted);
    }
  }, [answers, onAnswerChange]);

  function handleErrorChange(index: number, value: string) {
    setAnswers((prev) =>
      prev.map((a) => (a.itemIndex === index ? { ...a, identifiedError: value } : a))
    );
  }

  function handleCorrectionChange(index: number, value: string) {
    setAnswers((prev) =>
      prev.map((a) => (a.itemIndex === index ? { ...a, correction: value } : a))
    );
  }

  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-xl p-10 space-y-8 text-slate-200">
      <div className="bg-blue-600/20 text-blue-300 border border-blue-500/30 p-4 rounded-lg flex gap-3 text-base leading-normal">
        <i className="fas fa-info-circle mt-1"></i>
        <span className="font-bold">
          Instructions: Each sentence contains ONE error. Identify the incorrect word or phrase
          and write the correct form.
        </span>
      </div>

      <div className="space-y-5">
        {Array.from({ length: itemCount }, (_, i) => (
          <div
            key={i}
            className="bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-colors p-6 rounded-xl space-y-4"
          >
            <div className="flex items-start gap-3">
              <span className="text-blue-400 font-mono font-bold mt-0.5 shrink-0">{i + 1}.</span>
              <p className="text-slate-300 text-lg leading-relaxed flex-1">
                "Ieri io ho <span className="underline decoration-red-500 decoration-wavy">andato</span> al
                supermercato per comprare il latte."
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-8">
              <div>
                <label className="text-xs text-red-400 uppercase tracking-widest font-bold mb-1 block">
                  <i className="fas fa-exclamation-triangle mr-1"></i> Error:
                </label>
                <input
                  type="text"
                  value={answers[i].identifiedError}
                  onChange={(e) => handleErrorChange(i, e.target.value)}
                  className="w-full bg-[#0b0f1a] border-2 border-red-900/50 focus:border-red-500 rounded-lg p-3 text-red-300 outline-none font-mono"
                  placeholder="Type the error..."
                />
              </div>
              <div>
                <label className="text-xs text-emerald-400 uppercase tracking-widest font-bold mb-1 block">
                  <i className="fas fa-check-circle mr-1"></i> Correction:
                </label>
                <input
                  type="text"
                  value={answers[i].correction}
                  onChange={(e) => handleCorrectionChange(i, e.target.value)}
                  className="w-full bg-[#0b0f1a] border-2 border-emerald-900/50 focus:border-emerald-500 rounded-lg p-3 text-emerald-300 outline-none font-mono"
                  placeholder="Type the correction..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}