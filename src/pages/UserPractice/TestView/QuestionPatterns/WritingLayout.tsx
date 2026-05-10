import { useMemo } from 'react';
import type { JSX } from 'react';
import { WritingLayoutProps } from '../test.types';
import WordCounter from '../WordCounter';
import { normalizeWritingPractice } from './WritingLayout.utils';



export default function WritingLayout({
  state,
  config,
  questionData,
  writingText,
  onWritingChange,
}: WritingLayoutProps): JSX.Element {
  
  const practiceData = useMemo(() => questionData ? normalizeWritingPractice(questionData) : null, [questionData]);
  
  // Try to extract word range from question metadata or prompt if available
  // Fall back to config values, then to [100, 150]
  const [min, max] = config.wordRange || [100, 150];

  if (!practiceData) {
    return (
      <div className="bg-slate-800/50 border border-white/5 rounded-xl p-10 text-center text-slate-400">
        <p>No writing instructions found in the provided data.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-xl p-8 space-y-6">
      
      {/* General Instructions */}
      {practiceData.instructions && (
        <div className="bg-blue-600/20 text-blue-300 border border-blue-500/30 p-4 rounded-lg flex gap-3 text-base leading-normal mb-4">
          <i className="fas fa-info-circle mt-1"></i>
          <span className="font-bold">
            {practiceData.instructions}
          </span>
        </div>
      )}

      {/* Specific Prompt / Question */}
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 italic text-slate-300 text-lg whitespace-pre-line">
        "{practiceData.question.text || `Scrivi un testo su: ${state.domainIt}`}"
        <div className="mt-4 text-sm text-blue-400 font-bold not-italic">
          Target: {min} to {max} words.
        </div>
      </div>

      {/* Text Area */}
      <textarea
        value={writingText}
        onChange={(e) => onWritingChange(e.target.value)}
        className="w-full h-96 bg-[#0b0f1a] p-6 border-2 border-slate-800 rounded-xl focus:border-blue-500 outline-none text-xl leading-relaxed text-slate-200"
        placeholder="Scrivi qui..."
      />

      {/* Word Counter */}
      <WordCounter text={writingText} min={min} max={max} />
    </div>
  );
}