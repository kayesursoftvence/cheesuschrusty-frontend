// src/components/test/shared/QuestionWrapper.tsx
import type { JSX, ReactNode } from 'react';

interface QuestionWrapperProps {
  index: number;
  question: string;
  children: ReactNode;
}

export default function QuestionWrapper({ index, question, children }: QuestionWrapperProps): JSX.Element {
  return (
    <div className="bg-slate-900/50 border border-white/5 transition-colors duration-200 hover:border-blue-500/30 p-6 rounded-xl space-y-4">
      <p className="font-bold text-slate-200">
        {index + 1}. {question}
      </p>
      {children}
    </div>
  );
}