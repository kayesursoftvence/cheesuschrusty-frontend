// constants.ts
import {
  LevelOption,
  TaskOption,
  DomainOption,
  ModeOption,
  ProviderOption,
} from './types';

export const LEVEL_OPTIONS: LevelOption[] = [
  { name: 'A1', badge: 'Coming Soon', disabled: true },
  { name: 'A2', badge: 'Coming Soon', disabled: true },
  { name: 'B1c', badge: 'Citizenship', disabled: false, value: 'B1c' },
  { name: 'B1', badge: 'Standard', disabled: false, value: 'B1' },
  { name: 'B2', badge: 'Coming Soon', disabled: true },
  { name: 'C1', badge: 'Coming Soon', disabled: true },
  { name: 'C2', badge: 'Coming Soon', disabled: true },
];

export const TASK_OPTIONS: TaskOption[] = [
  {
    value: 'listening',
    icon: '🎧',
    name: 'Listening',
    id: 'L-01 / L-02',
    description: 'Audio comprehension exercises with multiple choice questions',
  },
  {
    value: 'reading',
    icon: '📖',
    name: 'Reading',
    id: 'R-01 / R-02',
    description: 'Text comprehension and information matching activities',
  },
  {
    value: 'writing',
    icon: '✍️',
    name: 'Writing',
    id: 'W-01',
    description: 'Functional email or narrative writing (80-120 words)',
  },
  {
    value: 'speaking',
    icon: '💬',
    name: 'Speaking',
    id: 'S-01 / S-02',
    description: 'Dialogue transactions and monologue presentations',
  },
  {
    value: 'grammar',
    icon: '🧩',
    name: 'Grammar',
    id: 'G-01 / G-02 / G-03 / G-04',
    description: 'Structural exercises focusing on verb tenses and syntax',
  },
];

export const DOMAIN_OPTIONS: DomainOption[] = [
  { value: 'health', icon: '🏥', name: 'Health', description: 'SSN, Hospital, Medical Services' },
  { value: 'education', icon: '🎓', name: 'Education', description: 'School, Training, Courses' },
  { value: 'work', icon: '💼', name: 'Work', description: 'Contracts, Safety, Employment' },
  { value: 'housing', icon: '🏠', name: 'Housing', description: 'Rent, Condominium, Property' },
  { value: 'bureaucracy', icon: '🏛️', name: 'Bureaucracy', description: 'City Hall, Post Office, Admin' },
  { value: 'commerce', icon: '🛒', name: 'Daily Commerce', description: 'Supermarket, Services, Shopping' },
  { value: 'random', icon: '🎲', name: 'Random Selection', description: 'Auto-select from all domains' },
];

export const MODE_OPTIONS: ModeOption[] = [
  {
    value: 'single',
    icon: '📝',
    name: 'Single Lesson',
    description: 'Create one customized lesson with a specific title',
  },
  {
    value: 'batch',
    icon: '📦',
    name: 'Batch Generation',
    description: 'Generate multiple variants for randomized practice',
  },
];

export const PROVIDER_OPTIONS: ProviderOption[] = [
  {
    value: 'openai',
    icon: '🤖',
    name: 'OpenAI (GPT-4)',
    description:
      'Advanced language model ideal for generating rich dialogues and realistic scenarios.',
  },
  {
    value: 'grok',
    icon: '⚡',
    name: 'Grok (xAI)',
    description:
      'Specialized in civic-themed content, perfect for citizenship preparation.',
  },
];

export const STEP_LABELS = [
  'Level & Task',
  'Domain',
  'Generation Mode',
  'AI Provider',
  'Summary',
];