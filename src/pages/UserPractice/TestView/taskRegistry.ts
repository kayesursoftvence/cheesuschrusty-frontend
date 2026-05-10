// src/components/test/types/taskRegistry.ts

import type { TaskType } from './test.types';

/**
 * TASK REGISTRY — Single source of truth for all task configurations.
 * Maps task IDs to their layout, config, and metadata.
 *
 * B1 STANDARD TRACK:
 *   L-01: MCQ | 6q | 3 opts     L-02: MCQ | 5q | 4 opts     L-03: MATCHING | 5 items
 *   R-01: MCQ | 6q | 4 opts     R-02: MATCHING | 5 headings  R-03: TRUE_FALSE | 5 stmts
 *   G-01: MCQ | 8q | 4 opts     G-02: GAP_FILL | 8 items     G-03: TRANSFORMATION | 6 items
 *   G-04: ERROR_RECOGNITION | 8  W-01: WRITING | 120–150      W-02: WRITING | 100–120
 *   S-01: SPEAKING | 90s         S-02: SPEAKING | 90s + image
 *
 * B1c CITIZENSHIP TRACK:
 *   L-01: MCQ | 6q | 3 opts     L-02: MCQ | 5q | 3 opts
 *   R-01: MCQ | 6q | 3 opts     R-02: MATCHING | 5 items
 *   W-01: WRITING | 100–120     S-01: SPEAKING | 90s
 */

export const TASK_REGISTRY: Record<string, TaskType> = {
  // ═══════════════════════════════════════════
  // LISTENING
  // ═══════════════════════════════════════════
  'L-01': {
    id: 'L-01',
    name: 'Listening Comprehension - MCQ (3 options)',
    it: 'Comprensione Orale - Scelta Multipla',
    configs: {
      STANDARD: { questions: 6, options: 3 },
      CITIZENSHIP: { questions: 6, options: 3 },
    },
    layouts: { STANDARD: 'MCQ', CITIZENSHIP: 'MCQ' },
    time: { STANDARD: 5, CITIZENSHIP: 5 },
    trust: 'OFFICIAL',
  },
  'L-02': {
    id: 'L-02',
    name: 'Listening Comprehension - MCQ (4 options)',
    it: 'Comprensione Orale - Scelta Multipla',
    configs: {
      STANDARD: { questions: 5, options: 4 },
      CITIZENSHIP: { questions: 5, options: 3 },
    },
    layouts: { STANDARD: 'MCQ', CITIZENSHIP: 'MCQ' },
    time: { STANDARD: 5, CITIZENSHIP: 5 },
    trust: 'OFFICIAL',
  },
  'L-03': {
    id: 'L-03',
    name: 'Listening - Matching',
    it: 'Comprensione Orale - Abbinamento',
    configs: {
      STANDARD: { items: 5 },
    },
    layouts: { STANDARD: 'MATCHING' },
    time: { STANDARD: 5 },
    trust: 'OFFICIAL',
  },

  // ═══════════════════════════════════════════
  // READING
  // ═══════════════════════════════════════════
  'R-01': {
    id: 'R-01',
    name: 'Reading Comprehension - MCQ',
    it: 'Comprensione Scritta - Scelta Multipla',
    configs: {
      STANDARD: { questions: 6, options: 4 },
      CITIZENSHIP: { questions: 6, options: 3 },
    },
    layouts: { STANDARD: 'MCQ', CITIZENSHIP: 'MCQ' },
    time: { STANDARD: 8, CITIZENSHIP: 8 },
    trust: 'OFFICIAL',
  },
  'R-02': {
    id: 'R-02',
    name: 'Reading - Heading Matching',
    it: 'Comprensione Scritta - Abbinamento Titoli',
    configs: {
      STANDARD: { items: 5 },
      CITIZENSHIP: { items: 5 },
    },
    layouts: { STANDARD: 'MATCHING', CITIZENSHIP: 'MATCHING' },
    time: { STANDARD: 8, CITIZENSHIP: 8 },
    trust: 'OFFICIAL',
  },
  'R-03': {
    id: 'R-03',
    name: 'Reading - True/False',
    it: 'Comprensione Scritta - Vero/Falso',
    configs: {
      STANDARD: { items: 5 },
    },
    layouts: { STANDARD: 'TRUEFALSE' },
    time: { STANDARD: 8 },
    trust: 'OFFICIAL',
  },

  // ═══════════════════════════════════════════
  // GRAMMAR / USE OF LANGUAGE
  // ═══════════════════════════════════════════
  'G-01': {
    id: 'G-01',
    name: 'Grammar - MCQ',
    it: 'Grammatica - Scelta Multipla',
    configs: {
      STANDARD: { questions: 8, options: 4 },
    },
    layouts: { STANDARD: 'MCQ' },
    time: { STANDARD: 10 },
    trust: 'OFFICIAL',
  },
  'G-02': {
    id: 'G-02',
    name: 'Grammar - Gap Fill',
    it: 'Grammatica - Completamento',
    configs: {
      STANDARD: { items: 8 },
    },
    layouts: { STANDARD: 'GAP_FILL' },
    time: { STANDARD: 10 },
    trust: 'OFFICIAL',
  },
  'G-03': {
    id: 'G-03',
    name: 'Grammar - Sentence Transformation',
    it: 'Grammatica - Trasformazione',
    configs: {
      STANDARD: { items: 6 },
    },
    layouts: { STANDARD: 'TRANSFORMATION' },
    time: { STANDARD: 10 },
    trust: 'OFFICIAL',
  },
  'G-04': {
    id: 'G-04',
    name: 'Grammar - Error Recognition',
    it: 'Grammatica - Riconoscimento Errori',
    configs: {
      STANDARD: { items: 8 },
    },
    layouts: { STANDARD: 'ERROR_RECOGNITION' },
    time: { STANDARD: 10 },
    trust: 'OFFICIAL',
  },

  // ═══════════════════════════════════════════
  // WRITING
  // ═══════════════════════════════════════════
  'W-01': {
    id: 'W-01',
    name: 'Written Production - Essay',
    it: 'Produzione Scritta - Testo',
    configs: {
      STANDARD: { wordRange: [120, 150] },
      CITIZENSHIP: { wordRange: [100, 120] },
    },
    layouts: { STANDARD: 'WRITING', CITIZENSHIP: 'WRITING' },
    time: { STANDARD: 20, CITIZENSHIP: 20 },
    trust: 'OFFICIAL',
  },
  'W-02': {
    id: 'W-02',
    name: 'Written Production - Short Essay',
    it: 'Produzione Scritta - Testo Breve',
    configs: {
      STANDARD: { wordRange: [100, 120] },
    },
    layouts: { STANDARD: 'WRITING' },
    time: { STANDARD: 15 },
    trust: 'OFFICIAL',
  },

  // ═══════════════════════════════════════════
  // SPEAKING
  // ═══════════════════════════════════════════
  'S-01': {
    id: 'S-01',
    name: 'Speaking - Oral Production',
    it: 'Produzione Orale - Monologo',
    configs: {
      STANDARD: { hasImage: false },
      CITIZENSHIP: { hasImage: false },
    },
    layouts: { STANDARD: 'SPEAKING', CITIZENSHIP: 'SPEAKING' },
    time: { STANDARD: 2, CITIZENSHIP: 2 },
    trust: 'OFFICIAL',
  },
  'S-02': {
    id: 'S-02',
    name: 'Speaking - Image Description',
    it: 'Produzione Orale - Immagine',
    configs: {
      STANDARD: { hasImage: true },
    },
    layouts: { STANDARD: 'SPEAKING' },
    time: { STANDARD: 2 },
    trust: 'OFFICIAL',
  },
};

export function getTaskType(taskId: string): TaskType | undefined {
  return TASK_REGISTRY[taskId];
}

export function getLayoutForTask(taskId: string, mode: string = 'STANDARD'): string {
  const task = TASK_REGISTRY[taskId];
  if (!task) return 'MCQ';
  return task.layouts[mode] || task.layouts['STANDARD'] || 'MCQ';
}