// CreateNewLesson.tsx

import React, { useState, useCallback } from 'react';
import ProgressSteps from './ProgressSteps';
import LevelTaskSelection from './LevelTaskSelection';
import DomainSelection from './DomainSelection';
// import DifficultySelection from './DifficultySelection';
import GenerationModeSelection from './GenerationModeSelection';
import AIProviderSelection from './AIProviderSelection';
import Summary from './Summary';
import LessonPreview from './LessonPreview';
import { useWizardNavigation } from './useWizardNavigation';
import {
  useGenerateWritingMutation,
  useGenerateReadingMutation,
  useGenerateListeningMutation,
  useGenerateSpeakingMutation,
  useGenerateGrammarMutation,

  useGenerateWritingBatchMutation,
  useGenerateReadingBatchMutation,
  useGenerateListeningBatchMutation,
  useGenerateSpeakingBatchMutation,
  useGenerateGrammarBatchMutation,

  useLazyGetWritingBatchStatusQuery,
  useLazyGetReadingBatchStatusQuery,
  useLazyGetListeningBatchStatusQuery,
  useLazyGetSpeakingBatchStatusQuery,
  useLazyGetGrammarBatchStatusQuery,
} from '@/redux/features/aiApi/aiApi';
import { useCreateLessonMutation } from '@/redux/features/lesson/lessonContent/lessonContentApi';
import { useUpsertLessonQuestionSetMutation } from '@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi';

import {
  transformFormToPayload,
  transformFormToBatchPayload,
} from './transformPayload';
import LessonCreationLoading from './LessonCreationLoading';
import LessonCreationSuccess from './LessonCreationSuccess';
import LessonCreationError from './LessonCreationError';

import {
  CEFRLevel,
  TaskType,
  TaskIdType,
  Domain,
  DifficultyLevel,
  GenerationMode,
  AIProvider,
  LessonFormState,
  LessonRequestPayload,
} from './types';

// import TimeSelection from './TimeSelection';
const CreateNewLesson: React.FC = () => {
  // ── Form state ──────────────────────────────────────────────
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('B1c');
  const [selectedTask, setSelectedTask] = useState<TaskType>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<TaskIdType>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain>('random');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>('medium');
  const [sectionTotal, setSectionTotal] = useState(5);
  const [taskTime, setTaskTime] = useState(10);
  const [generationMode, setGenerationMode] = useState<GenerationMode>('single');
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openai');
  const [lessonTitle, setLessonTitle] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [nativeLanguage, setNativeLanguage] = useState('Bengali');
  const [generationSeed, setGenerationSeed] = useState('42');
  const [batchCount, setBatchCount] = useState(5);
  const [avoidDuplicates, setAvoidDuplicates] = useState(true);
  const [generatedResult, setGeneratedResult] = useState<any>(null);

  // ── Submission state ────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

  console.log(isSubmitting)
  console.log(submitError)
  console.log(submitSuccess)
  console.log(batchProgress)

  // ── RTK Query Mutations ─────────────────────────────────────
  const [generateWriting] = useGenerateWritingMutation();
  const [generateReading] = useGenerateReadingMutation();
  const [generateListening] = useGenerateListeningMutation();
  const [generateSpeaking] = useGenerateSpeakingMutation();
  const [generateGrammar] = useGenerateGrammarMutation();

  const [generateWritingBatch] = useGenerateWritingBatchMutation();
  const [generateReadingBatch] = useGenerateReadingBatchMutation();
  const [generateListeningBatch] = useGenerateListeningBatchMutation();
  const [generateSpeakingBatch] = useGenerateSpeakingBatchMutation();
  const [generateGrammarBatch] = useGenerateGrammarBatchMutation();

  const [getWritingStatus] = useLazyGetWritingBatchStatusQuery();
  const [getReadingStatus] = useLazyGetReadingBatchStatusQuery();
  const [getListeningStatus] = useLazyGetListeningBatchStatusQuery();
  const [getSpeakingStatus] = useLazyGetSpeakingBatchStatusQuery();
  const [getGrammarStatus] = useLazyGetGrammarBatchStatusQuery();

  const [createLesson] = useCreateLessonMutation();
  const [upsertLessonQuestionSet] = useUpsertLessonQuestionSetMutation();

  // Combined loading state from all mutations
  // const isMutationLoading =
  //   isWritingLoading ||
  //   isReadingLoading ||
  //   isListeningLoading ||
  //   isSpeakingLoading ||
  //   isGrammarLoading;

  // ── Derived form snapshot ───────────────────────────────────
  const formState: LessonFormState = {
    selectedLevel,
    selectedTask,
    selectedTaskId,
    selectedDomain,
    selectedDifficulty,
    sectionTotal,
    taskTime,
    generationMode,
    selectedProvider,
    lessonTitle,
    batchCount,
    avoidDuplicates,
    targetLanguage,
    nativeLanguage,
    generationSeed,
  };

  // ── Navigation ──────────────────────────────────────────────
  const { currentStepName, goToNext, goToBack, goToStep, getStepStatus } = useWizardNavigation(formState);

  // ── Get mutation function based on task type ────────────────
  const getMutationByTaskType = useCallback(
    (taskType: TaskType) => {
      switch (taskType) {
        case 'writing':
          return generateWriting;
        case 'reading':
          return generateReading;
        case 'listening':
          return generateListening;
        case 'speaking':
          return generateSpeaking;
        case 'grammar':
          return generateGrammar;
        default:
          return null;
      }
    },
    [generateWriting, generateReading, generateListening, generateSpeaking, generateGrammar]
  );

  // ── Get batch mutation function based on task type ───────────
  const getBatchMutationByTaskType = useCallback(
    (taskType: TaskType) => {
      switch (taskType) {
        case 'writing':
          return generateWritingBatch;
        case 'reading':
          return generateReadingBatch;
        case 'listening':
          return generateListeningBatch;
        case 'speaking':
          return generateSpeakingBatch;
        case 'grammar':
          return generateGrammarBatch;
        default:
          return null;
      }
    },
    [
      generateWritingBatch,
      generateReadingBatch,
      generateListeningBatch,
      generateSpeakingBatch,
      generateGrammarBatch,
    ]
  );

  // ── Get batch status query based on task type ──────────────
  const getStatusQueryByTaskType = useCallback(
    (taskType: TaskType) => {
      switch (taskType) {
        case 'writing':
          return getWritingStatus;
        case 'reading':
          return getReadingStatus;
        case 'listening':
          return getListeningStatus;
        case 'speaking':
          return getSpeakingStatus;
        case 'grammar':
          return getGrammarStatus;
        default:
          return null;
      }
    },
    [
      getWritingStatus,
      getReadingStatus,
      getListeningStatus,
      getSpeakingStatus,
      getGrammarStatus,
    ]
  );

  // ── Execute single request ──────────────────────────────────
  const executeSingleRequest = async (payload: LessonRequestPayload): Promise<void> => {
    const mutation = getMutationByTaskType(selectedTask);

    if (!mutation) {
      throw new Error(`No mutation available for task type: ${selectedTask}`);
    }

    // LessonRequestPayload already uses uppercase keys — pass it directly to createLesson.
    // Both APIs share the same field names (LEVEL_ID, TARGET_LANGUAGE, SKILL, etc.)

    // Fire both requests concurrently
    const [result, createLessonResult] = await Promise.all([
      mutation(payload).unwrap(),
      createLesson({
        ...payload,
        "provider": payload.provider.toUpperCase(),
      }).unwrap(),
    ]);


    console.log('Single lesson generated (AI):', result);
    setGeneratedResult(result);
    console.log('Lesson record created:', createLessonResult);

    // Extract the lesson id from the createLesson response
    // Response shape: { statusCode, success, message, data: { id, ... } }
    const lessonId: number | undefined =
      (createLessonResult as { data?: { id?: number } })?.data?.id;

    if (!lessonId) {
      throw new Error('Failed to retrieve lesson ID from createLesson response');
    }

    // Build the upsert payload — content is the full AI generation response
    const upsertPayload = {
      lessonId,
      prompt: `Generate a ${payload.LEVEL_ID} level lesson on ${payload.TARGET_LANGUAGE} with comprehension questions.`,
      content: result,
    };

    const upsertResult = await upsertLessonQuestionSet(upsertPayload).unwrap();
    console.log('Lesson question set upserted:', upsertResult);
  };

  // ── Execute batch requests ──────────────────────────────────
  const executeBatchRequests = async (payload: any): Promise<void> => {
    const batchMutation = getBatchMutationByTaskType(selectedTask);
    const getStatus = getStatusQueryByTaskType(selectedTask);

    if (!batchMutation || !getStatus) throw new Error(`Batch generation/status not available for: ${selectedTask}`);


    setBatchProgress({ current: 0, total: payload.variant_count });

    // 1. Start batch generation
    const triggerResult = await batchMutation(payload).unwrap();
    const jobId = triggerResult.job_id;
    console.log('Batch lesson generation triggered. Job ID:', jobId);

    if (!jobId) {
      throw new Error('No job ID returned from batch generation');
    }

    // 2. Poll for status
    let completed = false;
    let pollAttempts = 0;
    const maxAttempts = 120; // 4 minutes with 2s interval

    while (!completed && pollAttempts < maxAttempts) {
      pollAttempts++;

      // Wait before polling (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        const { data: statusData } = await getStatus({ job_id: jobId });

        if (statusData) {
          console.log(`Poll ${pollAttempts} - Status: ${statusData.status}, Progress: ${statusData.progress}%`);

          setBatchProgress({
            current: statusData.completed_count || 0,
            total: statusData.total_count || payload.variant_count
          });

          if (statusData.status === 'completed' || (statusData.completed_count >= payload.variant_count)) {
            completed = true;
          } else if (statusData.status === 'failed') {
            throw new Error(statusData.error || 'Batch generation failed');
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
        // We continue polling on occasional network errors
        if (pollAttempts >= maxAttempts) throw error;
      }
    }

    if (!completed) {
      throw new Error('Batch generation timed out');
    }

    // 3. Persist results
    const finalStatus = await getStatus({ job_id: jobId }).unwrap();
    const results = finalStatus.results || [];

    console.log(`Persisting ${results.length} results...`);

    for (let i = 0; i < results.length; i++) {
      const resultItem = results[i];

      try {
        // Create lesson record
        const createLessonPayload = {
          ...payload,
          LESSON_TITLE: `${lessonTitle || selectedTask} - ${i + 1}`,
          provider: payload.provider.toUpperCase(),
        };
        delete (createLessonPayload as any).variant_count;

        const createResult = await createLesson(createLessonPayload).unwrap();
        const lessonId = (createResult as { data?: { id?: number } })?.data?.id;

        if (!lessonId) {
          console.error(`Failed to get lesson ID for result ${i + 1}`);
          continue;
        }

        // Upsert question set
        await upsertLessonQuestionSet({
          lessonId,
          prompt: `Batch generated lesson ${i + 1} for ${selectedTask}`,
          content: resultItem,
        }).unwrap();

        console.log(`Persisted result ${i + 1}/${results.length}`);
      } catch (err) {
        console.error(`Error persisting result ${i + 1}:`, err);
      }
    }

    console.log('Batch lesson generation completed successfully');
  };

  // ── Handle form submission ──────────────────────────────────
  async function handleSubmit() {
    console.log('Handle submit');
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    setBatchProgress({ current: 0, total: 0 });

    try {
      // Validate task type
      if (!selectedTask) {
        throw new Error('Please select a task type');
      }

      if (generationMode === 'batch') {
        // ── Batch mode ──────────────────────────────────────
        const batchPayload = transformFormToBatchPayload(formState);

        console.log('Batch payload:', batchPayload);
        await executeBatchRequests(batchPayload);
      } else {
        // ── Single mode ─────────────────────────────────────
        const payload: LessonRequestPayload = transformFormToPayload(formState);

        console.log('Submitting payload:', payload);
        await executeSingleRequest(payload);
      }

      setSubmitSuccess(true);
      console.log('Lesson(s) generated successfully!');

      // Optionally reset form or navigate away
      // resetForm();
      // navigate('/lessons');
    } catch (error) {
      console.error('Error generating lesson:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to generate lesson'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Reset form ──────────────────────────────────────────────
  const resetForm = () => {
    setSelectedTask(null);
    setSelectedTaskId(null);
    setSelectedDomain('random');
    // setSelectedDifficulty(null);
    // setSectionTotal(5);
    // setTaskTime(10);
    setGenerationMode('single');
    setLessonTitle('');
    setBatchCount(5);
    setAvoidDuplicates(true);
    setSubmitSuccess(false);
    setGeneratedResult(null);
    setSubmitError(null);
    goToStep(1);
  };

  // ── Task type click handler ─────────────────────────────────
  const onTaskTypeClick = (params: TaskType) => {
    if (!params) {
      setSelectedTask(null);
      setSelectedTaskId(null);
      return;
    }

    console.log(params);

    setSelectedTask(params);
    const leadingWord = (params as string).trim()[0].toUpperCase();
    console.log(selectedTaskId);

    if (typeof selectedTaskId === 'string') {
      const currentTaskIdLeadingWord = (selectedTaskId as string)
        .trim()[0]
        .toUpperCase();
      if (currentTaskIdLeadingWord === leadingWord) {
        return;
      }
    }

    const defaultTaskId = `${leadingWord}-01` as TaskIdType;
    setSelectedTaskId(defaultTaskId);
  };

  // ── Step renderer ───────────────────────────────────────────
  const renderCurrentStep = () => {
    switch (currentStepName) {
      case 'level-task':
        return (
          <LevelTaskSelection
            selectedLevel={selectedLevel}
            selectedTask={selectedTask}
            selectedTaskId={selectedTaskId}
            onLevelChange={setSelectedLevel}
            onTaskChange={onTaskTypeClick}
            onTaskIdSelect={setSelectedTaskId}
            onNext={goToNext}
          />
        );
      case 'domain':
        return (
          <DomainSelection
            selectedDomain={selectedDomain}
            onDomainChange={setSelectedDomain}
            onNext={goToNext}
            onBack={goToBack}
          />
        );
      case 'difficulty':
        return (
          <DifficultySelection
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
            onNext={goToNext}
            onBack={goToBack}
            currentStep={3}
            totalSteps={7}
          />
        );
      case 'time-config':
        return (
          <TimeSelection
            sectionTotal={sectionTotal}
            taskTime={taskTime}
            onSectionTotalChange={setSectionTotal}
            onTaskTimeChange={setTaskTime}
            onNext={goToNext}
            onBack={goToBack}
            currentStep={4}
            totalSteps={7}
          />
        );
      case 'generation-mode':
        return (
          <GenerationModeSelection
            generationMode={generationMode}
            lessonTitle={lessonTitle}
            targetLanguage={targetLanguage}
            nativeLanguage={nativeLanguage}
            generationSeed={generationSeed}
            batchCount={batchCount}
            avoidDuplicates={avoidDuplicates}
            onModeChange={setGenerationMode}
            onTitleChange={setLessonTitle}
            onTargetLanguageChange={setTargetLanguage}
            onNativeLanguageChange={setNativeLanguage}
            onGenerationSeedChange={setGenerationSeed}
            onBatchCountChange={setBatchCount}
            onAvoidDuplicatesChange={setAvoidDuplicates}
            onNext={goToNext}
            onBack={goToBack}
            currentStep={5}
            totalSteps={7}
          />
        );
      case 'ai-provider':
        return (
          <AIProviderSelection
            selectedProvider={selectedProvider}
            onProviderChange={setSelectedProvider}
            onNext={goToNext}
            onBack={goToBack}
            currentStep={6}
            totalSteps={7}
          />
        );
      case 'summary':
        return (
          <Summary
            formState={formState}
            onBack={goToBack}
            onSubmit={handleSubmit}
          // isSubmitting={isSubmitting || isMutationLoading}
          // submitError={submitError}
          // submitSuccess={submitSuccess}
          // batchProgress={generationMode === 'batch' ? batchProgress : undefined}
          // onReset={resetForm}
          />
        );
      default:
        return null;
    }
  };

  // ── Render ──────────────────────────────────────────────────
  if (isSubmitting) {
    return (
      <section className="block w-full">
        <div className=" mx-auto mt-12 w-full">
          <LessonCreationLoading generationMode={generationMode} batchProgress={batchProgress} />
        </div>
      </section>
    );
  }

  if (submitSuccess) {
    return (
      <section className="block w-full">
        <div className="w-full mx-auto mt-12 w-full">
          {generationMode === 'single' && generatedResult ? (
            <LessonPreview 
              result={generatedResult} 
              onReset={resetForm} 
            />
          ) : (
            <LessonCreationSuccess onReset={resetForm} />
          )}
        </div>
      </section>
    );
  }

  if (submitError) {
    return (
      <section className="block w-full">
        <div className="w-full mx-auto mt-12 w-full">
          <LessonCreationError
            error={submitError}
            onRetry={handleSubmit}
            onBack={() => setSubmitError(null)}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="block w-full">
      <div className="mb-8 flex justify-between items-start gap-6">
        <div>
          <h1 className="font-serif text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
            Create New Lesson
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-175">
            Design a comprehensive Italian language lesson for CEFR B1 Civic
            certification preparation.
          </p>
        </div>
      </div>

      <ProgressSteps getStepStatus={getStepStatus} onStepClick={goToStep} />

      <div className="w-full mx-auto">{renderCurrentStep()}</div>
    </section>
  );
};

export default CreateNewLesson;