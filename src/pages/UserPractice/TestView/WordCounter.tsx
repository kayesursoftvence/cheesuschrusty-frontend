// src/components/test/shared/WordCounter.tsx

import { useMemo } from 'react';
import type { JSX } from 'react';

interface WordCounterProps {
  text: string;
  min: number;
  max: number;
}

export default function WordCounter({ text, min, max }: WordCounterProps): JSX.Element {
  const wordCount = useMemo(() => {
    return text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
  }, [text]);

  const status = useMemo(() => {
    if (wordCount < min)
      return {
        text: `Too Short (<${min})`,
        class: 'bg-red-900/50 text-red-400',
      };
    if (wordCount > max)
      return {
        text: `Too Long (>${max})`,
        class: 'bg-yellow-900/50 text-yellow-400',
      };
    return {
      text: `Perfect (${min}-${max})`,
      class: 'bg-green-900/50 text-green-400',
    };
  }, [wordCount, min, max]);

  return (
    <div className="flex justify-between items-center px-2">
      <div className="text-sm font-bold text-slate-400 uppercase tracking-tighter">
        Word Count:{' '}
        <span className="text-blue-400 text-2xl font-mono ml-2">{wordCount}</span>
      </div>
      <div
        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${status.class}`}
      >
        {status.text}
      </div>
    </div>
  );
}