// useWizardNavigation.ts
import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LessonFormState } from './types';

const PARAM_KEY = 'step';

export const STEP_NAMES = [
  'level-task',
  'domain',
  'difficulty',
  'time-config',
  'generation-mode',
  'ai-provider',
  'summary',
] as const;

export type StepName = (typeof STEP_NAMES)[number];

const TOTAL_STEPS = STEP_NAMES.length;

interface StepValidation {
  name: StepName;
  index: number;
  isValid: boolean;
  message: string;
}

interface UseWizardNavigationReturn {
  currentStep: number;
  currentStepName: StepName;
  goToNext: () => void;
  goToBack: () => void;
  goToStep: (step: number) => void;
  getStepStatus: (step: number) => 'completed' | 'active' | 'pending';
  totalSteps: number;
}

function stepNameToIndex(name: string): number {
  const index = STEP_NAMES.indexOf(name as StepName);
  return index === -1 ? 0 : index;
}

function indexToStepName(index: number): StepName {
  return STEP_NAMES[index] ?? STEP_NAMES[0];
}

function isValidStepName(name: string | null): name is StepName {
  return name !== null && STEP_NAMES.includes(name as StepName);
}

export function useWizardNavigation(formState: LessonFormState): UseWizardNavigationReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawStepName = searchParams.get(PARAM_KEY);

  // If param is missing or invalid, default to first step
  const resolvedName: StepName = isValidStepName(rawStepName) ? rawStepName : STEP_NAMES[0];
  const currentIndex = stepNameToIndex(resolvedName);
  const currentStep = currentIndex + 1;
  const currentStepName = resolvedName;

  const stepValidations: StepValidation[] = useMemo(() => {
    const { selectedTask, generationMode, lessonTitle,
      //  selectedDifficulty, sectionTotal, taskTime 
      } = formState;

    return [
      {
        name: 'level-task',
        index: 0,
        isValid: selectedTask !== null,
        message: 'Please select a task type',
      },
      {
        name: 'domain',
        index: 1,
        isValid: true,
        message: '',
      },
      {
        name: 'difficulty',
        index: 2,
        //  isValid: sectionTotal > 0 && taskTime > 0,
        isValid: true, // isValid: true,
        message: 'Please select a difficulty level',
      },
      {
        name: 'time-config',
        index: 3,
        //  isValid: sectionTotal > 0 && taskTime > 0,
        isValid: true, // isValid: true,
        message: 'Please set total questions and time limit',
      },
      {
        name: 'generation-mode',
        index: 4,
        isValid:
          generationMode === 'batch' ||
          (generationMode === 'single' && lessonTitle.trim().length > 0),
        message:
          generationMode === 'single'
            ? 'Please enter a lesson title'
            : '',
      },
      {
        name: 'ai-provider',
        index: 5,
        isValid: true,
        message: '',
      },
      {
        name: 'summary',
        index: 6,
        isValid: true,
        message: '',
      },
    ];
  }, [formState]);

  const findFirstIncompleteStep = useCallback(
    (targetIndex: number): number => {
      for (let i = 0; i < targetIndex; i++) {
        if (!stepValidations[i].isValid) {
          return i;
        }
      }
      return targetIndex;
    },
    [stepValidations]
  );

  const setStepByIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, TOTAL_STEPS - 1));
      const name = indexToStepName(clamped);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set(PARAM_KEY, name);
        return next;
      }, { replace: true });
    },
    [setSearchParams]
  );

  // On mount or URL change:
  // 1. If no step param or invalid → set to first step
  // 2. If step param exists but prior steps incomplete → redirect to first incomplete
  useEffect(() => {
    if (!isValidStepName(rawStepName)) {
      setStepByIndex(0);
      return;
    }

    const allowedIndex = findFirstIncompleteStep(currentIndex);
    if (allowedIndex !== currentIndex) {
      setStepByIndex(allowedIndex);
    }
  }, [rawStepName, currentIndex, findFirstIncompleteStep, setStepByIndex]);

  const goToNext = useCallback(() => {
    const currentValidation = stepValidations[currentIndex];
    if (!currentValidation?.isValid) return;

    let nextIndex = currentIndex + 1;
    // Skip difficulty and time-config
    while (nextIndex < TOTAL_STEPS && (STEP_NAMES[nextIndex] === 'difficulty' || STEP_NAMES[nextIndex] === 'time-config')) {
      nextIndex++;
    }

    if (nextIndex < TOTAL_STEPS) {
      setStepByIndex(nextIndex);
    }
  }, [currentIndex, stepValidations, setStepByIndex]);

  const goToBack = useCallback(() => {
    let prevIndex = currentIndex - 1;
    // Skip difficulty and time-config
    while (prevIndex >= 0 && (STEP_NAMES[prevIndex] === 'difficulty' || STEP_NAMES[prevIndex] === 'time-config')) {
      prevIndex--;
    }

    if (prevIndex >= 0) {
      setStepByIndex(prevIndex);
    }
  }, [currentIndex, setStepByIndex]);

  const goToStep = useCallback(
    (step: number) => {
      const targetIndex = step - 1;
      const allowedIndex = findFirstIncompleteStep(targetIndex);
      setStepByIndex(allowedIndex);
    },
    [findFirstIncompleteStep, setStepByIndex]
  );

  const getStepStatus = useCallback(
    (step: number): 'completed' | 'active' | 'pending' => {
      const stepIndex = step - 1;
      if (stepIndex < currentIndex) return 'completed';
      if (stepIndex === currentIndex) return 'active';
      return 'pending';
    },
    [currentIndex]
  );

  return {
    currentStep,
    currentStepName,
    goToNext,
    goToBack,
    goToStep,
    getStepStatus,
    totalSteps: TOTAL_STEPS,
  };
}