// import { Domain, TaskType, Skill } from './types';
import { Domain, TaskType, Skill } from './types'
import type { ExamConfig } from './types';

export const EXAM_CONFIG: ExamConfig = {
  CITIZENSHIP: { id: 'B1c_CIT', skills: ['Reading', 'Listening', 'Writing', 'Speaking'] as Skill[], color: 'blue' },
  STANDARD: { id: 'B1_STD', skills: ['Reading', 'Listening', 'Grammar', 'Writing', 'Speaking'] as Skill[], color: 'emerald' }
};

export type ExamTrack = keyof typeof EXAM_CONFIG;

export const DOMAINS: Domain[] = [
  { id: 'Salute', en: 'Health', it: 'Salute', icon: '🏥' },
  { id: 'Lavoro', en: 'Work', it: 'Lavoro', icon: '💼' },
  { id: 'Burocrazia', en: 'Public Services', it: 'Burocrazia', icon: '🏛️' },
  { id: 'Abitazione', en: 'Housing', it: 'Abitazione', icon: '🏠' },
  { id: 'Educazione', en: 'Education', it: 'Educazione', icon: '🎓' },
  { id: 'Commercio', en: 'Shopping', it: 'Commercio', icon: '🛒' },
  { id: 'Cultura', en: 'Culture & Arts', it: 'Cultura e Arte', icon: '🎨', mode: 'STANDARD_ONLY' },
  { id: 'Societa', en: 'Society', it: 'Società', icon: '👥', mode: 'STANDARD_ONLY' }
];

export const TASK_REGISTRY: Record<Skill, TaskType[]> = {
  'Reading': [
    {
      id: 'R-01', name: 'Information Search', it: 'Ricerca Informazioni', time: { CITIZENSHIP: 20, STANDARD: 17 },
      layouts: { CITIZENSHIP: 'MCQ', STANDARD: 'MCQ' },
      configs: { CITIZENSHIP: { questions: 6, options: 3 }, STANDARD: { questions: 6, options: 4 } },
      trust: 'OFFICIAL'
    },
    {
      id: 'R-02', name: 'Reading Comprehension', it: 'Comprensione Lettura', time: { CITIZENSHIP: 20, STANDARD: 17 },
      layouts: { CITIZENSHIP: 'MATCHING', STANDARD: 'MATCHING' },
      configs: { CITIZENSHIP: { items: 5 }, STANDARD: { items: 5 } },
      trust: 'OFFICIAL'
    },
    {
      id: 'R-03', name: 'Text Reconstruction', it: 'Ricostruzione Testo', time: { CITIZENSHIP: null, STANDARD: 16 },
      layouts: { STANDARD: 'TRUE_FALSE' },
      configs: { STANDARD: { questions: 5 } },
      trust: 'OFFICIAL', mode: 'STANDARD_ONLY'
    }
  ],
  'Listening': [
    {
      id: 'L-01', name: 'Short Dialogues', it: 'Dialoghi Brevi', time: { CITIZENSHIP: 15, STANDARD: 10 },
      layouts: { CITIZENSHIP: 'MCQ', STANDARD: 'MCQ' },
      configs: { CITIZENSHIP: { questions: 6, options: 3 }, STANDARD: { questions: 6, options: 3 } },
      trust: 'VERIFIED'
    },
    {
      id: 'L-02', name: 'Listen & Verify', it: 'Ascolto e Verifica', time: { CITIZENSHIP: 15, STANDARD: 10 },
      layouts: { CITIZENSHIP: 'MCQ', STANDARD: 'MCQ' },
      configs: { CITIZENSHIP: { questions: 5, options: 3 }, STANDARD: { questions: 5, options: 4 } },
      trust: 'VERIFIED'
    },
    {
      id: 'L-03', name: 'Select Info', it: 'Individuazione Info', time: { CITIZENSHIP: null, STANDARD: 10 },
      layouts: { STANDARD: 'MATCHING' },
      configs: { STANDARD: { items: 5 } },
      trust: 'VERIFIED', mode: 'STANDARD_ONLY'
    }
  ],
  'Grammar': [
    {
      id: 'G-01', name: 'Morphosyntax', it: 'Morfosintassi', time: { STANDARD: 15 },
      layouts: { STANDARD: 'MCQ' },
      configs: { STANDARD: { questions: 8, options: 4 } },
      trust: 'OFFICIAL', mode: 'STANDARD_ONLY'
    },
    {
      id: 'G-02', name: 'Verb Morphology', it: 'Verbi', time: { STANDARD: 15 },
      layouts: { STANDARD: 'GAP_FILL' },
      configs: { STANDARD: { gaps: 8 } },
      trust: 'OFFICIAL', mode: 'STANDARD_ONLY'
    },
    {
      id: 'G-03', name: 'Transformation', it: 'Trasformazione', time: { STANDARD: 15 },
      layouts: { STANDARD: 'TRANSFORMATION' },
      configs: { STANDARD: { items: 6 } },
      trust: 'OFFICIAL', mode: 'STANDARD_ONLY'
    },
    {
      id: 'G-04', name: 'Error Recognition', it: 'Riconoscimento Errori', time: { STANDARD: 15 },
      layouts: { STANDARD: 'ERROR_RECOGNITION' },
      configs: { STANDARD: { items: 8 } },
      trust: 'OFFICIAL', mode: 'STANDARD_ONLY'
    }
  ],
  'Writing': [
    {
      id: 'W-01', name: 'Theme or Email', it: 'Scrittura', time: { CITIZENSHIP: 40, STANDARD: 35 },
      layouts: { CITIZENSHIP: 'WRITING', STANDARD: 'WRITING' },
      configs: { CITIZENSHIP: { wordsCIT: [100, 120] }, STANDARD: { wordsSTD: [120, 150] } },
      trust: 'OFFICIAL'
    },
    {
      id: 'W-02', name: 'Short Message', it: 'Messaggio Breve', time: { CITIZENSHIP: null, STANDARD: 35 },
      layouts: { STANDARD: 'WRITING' },
      configs: { STANDARD: { wordsSTD: [100, 120] } },
      trust: 'OFFICIAL', mode: 'STANDARD_ONLY'
    }
  ],
  'Speaking': [
    {
      id: 'S-01', name: 'Interaction', it: 'Interazione', time: { CITIZENSHIP: 10, STANDARD: 5 },
      layouts: { CITIZENSHIP: 'SPEAKING', STANDARD: 'SPEAKING' },
      configs: { CITIZENSHIP: {}, STANDARD: {} },
      trust: 'VERIFIED'
    },
    {
      id: 'S-02', name: 'Monologue', it: 'Monologo', time: { CITIZENSHIP: null, STANDARD: 5 },
      layouts: { STANDARD: 'SPEAKING' },
      configs: { STANDARD: {} },
      trust: 'VERIFIED', mode: 'STANDARD_ONLY'
    }
  ]
};

export const SKILL_ICONS: Record<Skill, { icon: string; color: string }> = {
  'Reading': { icon: 'fa-book-open', color: 'blue' },
  'Listening': { icon: 'fa-headphones-alt', color: 'orange' },
  'Grammar': { icon: 'fa-puzzle-piece', color: 'pink' },
  'Writing': { icon: 'fa-pencil-alt', color: 'green' },
  'Speaking': { icon: 'fa-microphone-alt', color: 'purple' }
};
