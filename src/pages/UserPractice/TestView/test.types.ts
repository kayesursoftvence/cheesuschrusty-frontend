// ─── Layout types ────────────────────────────────────────
export type LayoutType =
  | 'MCQ'
  | 'MATCHING'
  | 'TRUEFALSE'
  | 'GAP_FILL'
  | 'TRANSFORMATION'
  | 'ERROR_RECOGNITION'
  | 'WRITING'
  | 'SPEAKING'
  | 'SPEAKING_90S';

export type TrustLevel = 'OFFICIAL' | 'VERIFIED' | 'COMMUNITY';

export type TaskMode = 'STANDARD' | 'CITIZENSHIP';

export interface TaskTypeConfig {
  questions?: number;
  options?: number;
  items?: number;
  wordRange?: [number, number];
  hasImage?: boolean;
  [key: string]: unknown;
}

export interface TaskType {
  id: string;
  name: string;
  it: string;
  configs: Record<string, TaskTypeConfig>;
  layouts: Record<string, string>;
  time: Record<string, number>;
  trust: TrustLevel;
}

export interface TestState {
  domain: string;
  domainIt: string;
  fullTaskId: string;
  level: string;
  mode: string;
  promptTab: string;
  simulatedFeedbackTier: string;
  skill: string;
  tier: string;
  type: TaskType;
  view: string;
  writingText: string;
}

// ─── Answer types ─────────────────────────────────────────
export interface GapFillAnswer {
  gapIndex: number;
  value: string;
}

export interface TransformationAnswer {
  itemIndex: number;
  value: string;
}

export interface ErrorRecognitionAnswer {
  itemIndex: number;
  identifiedError: string;
  correction: string;
}

// ─── Deprecated alias kept for backward compat ────────────
export type TaskType_ = TaskType;

export interface MCQPractice {
  header: {
    level: string
    skill: string
    topic: string
    domain: string
    taskId: string
    provider: string
  }
  stimulus: {
    title: string
    text: string
  }
  instructions: string
  questions: {
    id: string
    text: string
    type: string
    options: {
      id: string
      text: string
    }[]
  }[]
  answers: Record<string, string>
}

export interface MatchingPractice {
  header: {
    level: string
    skill: string
    topic: string
    domain: string
    taskId: string
    provider: string
    lessonTitle: string
    difficulty: string
    taskTime: number
  }
  stimulus: {
    title: string
    text: string
    wordCount: number
  }
  instructions: string
  questions: {
    id: string
    text: string
    type: string
    options: {
      id: string
      text: string
    }[]
  }[]
  answers: Record<string, string>
}

export interface SpeakingPractice {
  header: {
    level: string
    skill: string
    topic: string
    domain: string
    taskId: string
    provider: string
  }
  imageUrl: string | null
  instructions: string
  question: {
    id: string
    text: string
    type: string
  }
  metadata: {
    totalPossible: number
  }
}

export interface WritingPractice {
  header: {
    level: string
    skill: string
    topic: string
    domain: string
    taskId: string
    provider: string
    lessonTitle: string
    difficulty: string
    taskTime: number
  }
  stimulus: {
    title: string
    text: string
  }
  instructions: string
  question: {
    id: string
    text: string
    type: string
  }
  metadata: {
    isTimed: boolean
    taskTime: number
  }
}

export interface TrueFalseAnswer {
  statementIndex: number;
  value: boolean | null;
}

export interface MCQAnswer {
  questionIndex: number;
  selectedOption: number | null;
}

export interface LayoutProps {
  state: any;
  questionData: any;
  onAnswerChange?: (answer: string) => void;
  config?: any;
}

// Layout specific props
export interface MatchingLayoutProps extends LayoutProps {
  // Add specific props here if they differ from LayoutProps
  _matching?: boolean; 
}
export interface WritingLayoutProps extends LayoutProps {
  writingText: string;
  onWritingChange: (text: string) => void;
}
export interface SpeakingLayoutProps extends LayoutProps {
  _speaking?: boolean;
}
export interface MCQLayoutProps extends LayoutProps {
  _mcq?: boolean;
}