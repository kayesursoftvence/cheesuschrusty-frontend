// src/components/test/LayoutRenderer.tsx

import React from 'react';
import type { JSX } from 'react';
import type { LayoutType, TestState, TaskTypeConfig } from './test.types';
import MCQLayout from './QuestionPatterns/MCQLayout';
import MatchingLayout from './QuestionPatterns/MatchingLayout';
import TrueFalseLayout from './QuestionPatterns/TrueFalseLayout';
import GapFillLayout from './QuestionPatterns/GapFillLayout';
import TransformationLayout from './QuestionPatterns/TransformationLayout';
import ErrorRecognitionLayout from './ErrorRecognitionLayout';
import WritingLayout from './QuestionPatterns/WritingLayout';
import SpeakingLayout from './QuestionPatterns/SpeakingLayout';

// import {
//   MCQLayout,
//   MatchingLayout,
//   TrueFalseLayout,
//   GapFillLayout,
//   TransformationLayout,
//   ErrorRecognitionLayout,
//   WritingLayout,
//   SpeakingLayout,
// } from './layouts';

interface LayoutRendererProps {
  layout: LayoutType;
  state: TestState;
  config: TaskTypeConfig;
  questionData?: any;
  // Writing-specific
  writingText?: string;
  onWritingChange?: (text: string) => void;
  // Answer lifting
  answers?: any;
  onAnswerChange?: (answers: any) => void;
}

const LAYOUT_MAP: Record<LayoutType, React.ComponentType<any>> = {
  MCQ: MCQLayout,
  MATCHING: MatchingLayout,
  TRUEFALSE: TrueFalseLayout,
  GAP_FILL: GapFillLayout,
  TRANSFORMATION: TransformationLayout,
  ERROR_RECOGNITION: ErrorRecognitionLayout,
  WRITING: WritingLayout,
  SPEAKING: SpeakingLayout,
  SPEAKING_90S: SpeakingLayout,
  MCQ_SENTENCE_COMPLETION: MCQLayout,
  MCQ_MULTIPLE_CHOICE: MCQLayout,
  READING_COMPREHENSION_MCQ: MCQLayout,
};

export default function LayoutRenderer({
  layout,
  state,
  config,
  questionData,
  writingText = '',
  onWritingChange,
  answers,
  onAnswerChange,
}: LayoutRendererProps): JSX.Element {
  const Component = LAYOUT_MAP[layout];
  console.log("LayoutRenderer - layout:", layout);
  console.log("LayoutRenderer - questionData:", questionData);

  if (!Component) {
    return (
      <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-10 text-center">
        <i className="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
        <h3 className="text-xl font-bold text-red-300">Unknown Layout: "{layout}"</h3>
        <p className="text-slate-400 mt-2">
          This task type is not yet implemented. Check the task registry.
        </p>
      </div>
    );
  }

  // Writing needs extra props
  if (layout === 'WRITING') {
    return (
      <WritingLayout
        state={state}
        config={config}
        questionData={questionData}
        writingText={writingText}
        onWritingChange={onWritingChange || (() => { })}
      />
    );
  }

  return (
    <Component
      state={state}
      config={config}
      layout={layout}
      questionData={questionData}
      answers={answers}
      onAnswerChange={onAnswerChange}
    />
  );
}