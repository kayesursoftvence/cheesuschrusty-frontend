/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  useCreateLessonMutation,
  useDeleteLessonMutation,
  useGetAllLessonsQuery,
  useGetLessonByIdQuery
} from '@/redux/features/lesson/lessonContent/lessonContentApi';
import {
  useUpsertLessonQuestionSetMutation,
  useLazyGetLessonQuestionSetQuery
} from '@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi';

import LessonsListView from './LessonsListView';
import LessonCreationWizard from './LessonCreationWizard';
import { LessonType, AIProvider, DeleteConfirmationState, Lesson, getSkillName } from './Type';
import toast from 'react-hot-toast';

const AI_API_BASE = import.meta.env.VITE_AI_API_ENDPOINT || "https://cheesuschrusty-ai.onrender.com";

const LessonsContainer: React.FC = () => {

  // State management
  const [isCreatingLesson, setIsCreatingLesson] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedLessonType, setSelectedLessonType] = useState<LessonType | ''>('');
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [selectedAIModel, setSelectedAIModel] = useState<AIProvider>(AIProvider.OPEN_AI);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [createdLessonId, setCreatedLessonId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [generationSuccess, setGenerationSuccess] = useState<boolean>(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmationState>({
    isOpen: false,
    lessonId: null,
    lessonTitle: ''
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<LessonType | ''>('');
  const [previewQuestionSets, setPreviewQuestionSets] = useState<any[]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);
  const [domain, setDomain] = useState<string>('');
  const [taskId, setTaskId] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [targetLanguage, setTargetLanguage] = useState<string>('');

  // API hooks
  const [createLesson, { isLoading: isCreatingLessonApi }] = useCreateLessonMutation();
  const [upsertLessonQuestionSet, { isLoading: isSavingQuestionSet }] = useUpsertLessonQuestionSetMutation();
  const [deleteLesson, { isLoading: isDeleting }] = useDeleteLessonMutation();
  const { data: lessonsData, refetch: refetchLessons } = useGetAllLessonsQuery({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined,
    type: selectedTypeFilter || undefined,
  });
  const { data: lessonDetails, isLoading: isLoadingDetails } = useGetLessonByIdQuery(
    selectedLesson?.id || '',
    { skip: !selectedLesson?.id }
  );

  const getProviderMapping = (provider: AIProvider): string => {
    return provider === AIProvider.OPEN_AI ? 'openai' : 'grok';
  };

  const formatGeneratedContent = (content: any): string => {
    if (!content) return '';

    let parsedContent: any;

    // Handle string content - try to parse as JSON
    if (typeof content === 'string') {
      try {
        parsedContent = JSON.parse(content);
      } catch {
        const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (jsonMatch) {
          try {
            parsedContent = JSON.parse(jsonMatch[0]);
          } catch {
            return content;
          }
        } else {
          return content;
        }
      }
    } else {
      parsedContent = content;
    }

    // const formatText = (text: string): string => {
    //   if (!text) return '';
    //   return text?.split(/(?<=\.)\s+/)?.filter((s: string) => s.trim())?.map((s: string) => s.trim()).join('\n');
    // };


    const formatText = (text: string): string => {
      if (!text || typeof text !== 'string') return '';

      const sentences = text.split(/(?<=\.)\s+/);
      return sentences
        .filter((s: string) => s.trim())
        .map((s: string) => s.trim())
        .join('\n');
    };




    const extractPassages = (data: any): { italian?: string; english?: string } => {
      const result: { italian?: string; english?: string } = {};

      const scriptContent = data?.teacher_pack?.script?.content || data?.teacher_pack?.content?.text;
      const handoutText = data?.student_handout?.text;

      if (scriptContent) result.italian = scriptContent;
      if (handoutText && !result.italian) result.italian = handoutText;

      if (data?.student_handout?.instructions) {
        result.english = data.student_handout.instructions;
      }

      if (!result.italian && data?.content?.italian_passage) {
        result.italian = data.content.italian_passage;
      }

      return result;
    };

    const extractQuestionsFromObject = (data: any): any[] => {
      const questions: any[] = [];
      const studentQuestions = data?.student_handout?.questions;

      if (studentQuestions && !Array.isArray(studentQuestions) && typeof studentQuestions === 'object') {
        Object.keys(studentQuestions).forEach(key => {
          const q = studentQuestions[key];
          questions.push({
            text: q.text || q.question,
            options: q.options ? Object.entries(q.options).map(([k, v]) => `${k}. ${v}`) : [],
            answer: data?.teacher_pack?.answer_key?.[key]?.correct_answer || data?.teacher_pack?.key?.answers?.[key]
          });
        });
      }

      return questions;
    };

    const extractQuestions = (data: any): any[] => {
      let questions: any[] = [];

      const handoutQs = data?.student_handout?.questions;
      if (Array.isArray(handoutQs)) {
        handoutQs.forEach(q => {
          let answer = q.answer;
          if (!answer && data?.teacher_pack?.key?.answers) {
            answer = data.teacher_pack.key.answers[q.id || q.question];
          }
          questions.push({
            text: q.question || q.text,
            options: q.options ? (Array.isArray(q.options) ? q.options : Object.entries(q.options).map(([k, v]) => `${k}. ${v}`)) : [],
            answer: answer
          });
        });
      }

      if (data?.content?.questions && Array.isArray(data.content.questions)) {
        questions = [...questions, ...data.content.questions];
      }
      if (data?.questions && Array.isArray(data.questions)) {
        questions = [...questions, ...data.questions];
      }
      return questions;
    };

    const passages = extractPassages(parsedContent);
    const newQuestions = extractQuestionsFromObject(parsedContent);
    const oldQuestions = extractQuestions(parsedContent);
    const questions = [...newQuestions, ...oldQuestions];

    let formatted = '';

    if (passages.italian) {
      formatted += '────────────────────────\n';
      formatted += 'ITALIAN CONTENT / SCRIPT\n';
      formatted += '────────────────────────\n';
      formatted += formatText(passages.italian) + '\n\n';
    }

    if (passages.english) {
      formatted += '────────────────────────\n';
      formatted += 'ENGLISH INSTRUCTIONS\n';
      formatted += '────────────────────────\n';
      formatted += formatText(passages.english) + '\n\n';
    }

    if (questions.length > 0) {
      formatted += '────────────────────────\n';
      formatted += 'QUESTIONS AND ANSWERS\n';
      formatted += '────────────────────────\n\n';

      questions.forEach((question: any, index: number) => {
        formatted += `Question ${index + 1}.\n`;
        formatted += (question.text || question.question || question.italian_question || '') + '\n\n';

        if (question.options && Array.isArray(question.options)) {
          formatted += 'Options\n';
          question.options.forEach((option: any) => {
            formatted += `${typeof option === 'string' ? option : option.text || ''}\n`;
          });
          formatted += '\n';
        }

        if (question.answer !== undefined) {
          formatted += `Correct Answer: ${question.answer}\n`;
        }

        formatted += '\n────────────────────────\n\n';
      });
    }

    return formatted.trim() || JSON.stringify(parsedContent, null, 2);
  };

  // Event Handlers
  const handleCreateLesson = () => {
    setIsCreatingLesson(true);
    setCurrentStep(1);
    setSelectedLessonType('');
    setLessonTitle('');
    setSelectedAIModel(AIProvider.OPEN_AI);
    setPrompt('');
    setGeneratedContent(null);
    setCreatedLessonId(null);
    setApiError(null);
    setGenerationSuccess(false);
    setDomain('');
    setTaskId('');
    setLevel('');
    setTargetLanguage('');
  };

  const handleCancelCreate = () => {
    setIsCreatingLesson(false);
    setCurrentStep(1);
    setSelectedLessonType('');
    setLessonTitle('');
    setSelectedAIModel(AIProvider.OPEN_AI);
    setPrompt('');
    setGeneratedContent(null);
    setCreatedLessonId(null);
    setApiError(null);
    setGenerationSuccess(false);
    setDomain('');
    setTaskId('');
    setLevel('');
    setTargetLanguage('');
  };

  const handleTitleNext = async () => {
    if (!selectedLessonType || !selectedAIModel || !domain || !taskId || !level || !targetLanguage) {
      toast.error('Please fill in all required fields')
      return;
    }

    setIsGenerating(true);
    setApiError(null);
    setGenerationSuccess(false);

    try {
      // Step 1: Call the generate API directly (Call this first as requested)
      const API_ENDPOINTS = {
        [LessonType.READING]: {
          endpoint: '/ai/admin/generate/reading-comprehension/',
          fieldName: 'content'
        },
        [LessonType.LISTENING]: {
          endpoint: '/ai/admin/generate/listening-comprehension/',
          fieldName: 'content'
        },
        [LessonType.WRITING]: {
          endpoint: '/ai/admin/generate/writing-practice/',
          fieldName: 'content'
        },
        [LessonType.SPEAKING]: {
          endpoint: '/ai/admin/generate/speaking-practice/',
          fieldName: 'content'
        },
        [LessonType.GRAMMAR]: {
          endpoint: '/ai/admin/generate/grammar-practice/',
          fieldName: 'content'
        }
      };

      const apiConfig = API_ENDPOINTS[selectedLessonType as LessonType];
      if (!apiConfig) {
        throw new Error(`No API configuration found for lesson type: ${selectedLessonType}`);
      }

      const requestBody: any = {
        provider: getProviderMapping(selectedAIModel),
        skill: getSkillName(selectedLessonType as LessonType),
        task_id: taskId,
        domain: domain,
        level: level,
        target_language: targetLanguage
      };

      // For SPEAKING - default difficulty
      if (selectedLessonType === LessonType.SPEAKING) {
        requestBody.difficulty = 'beginner';
      }

      // Call the generate API
      const generateResponse = await fetch(
        `${AI_API_BASE}${apiConfig.endpoint}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData?.detail || `API Error: ${generateResponse.status}`);
      }

      let generatedResult = await generateResponse.json();

      // Parse response if it's a string
      if (typeof generatedResult === 'string') {
        try {
          const cleanString = generatedResult
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/^"|"$/g, '');
          generatedResult = JSON.parse(cleanString);
        } catch {
          generatedResult = {
            text: generatedResult,
            generatedAt: new Date().toISOString()
          };
        }
      }

      setGeneratedContent(generatedResult);
      setGenerationSuccess(true);

      // AUTOMATIC SAVE LOGIC (As requested: direct call to /questionset)
      try {
        const lessonData = {
          task_id: taskId,
          skill: selectedLessonType,
          provider: selectedAIModel,
          level: level.toLowerCase(),
          domain: domain,
          target_language: targetLanguage
        };

        const lessonResponse = await createLesson(lessonData).unwrap();
        const finalLessonId = lessonResponse.data?.id;
        setCreatedLessonId(finalLessonId);

        const payload = {
          lessonId: Number(finalLessonId),
          prompt: prompt || `Auto-generated ${selectedLessonType} content`,
          content: generatedResult // The AI response is saved directly in content
        };

        await upsertLessonQuestionSet(payload as any).unwrap();
        toast.success('Lesson created and content saved automatically!');
      } catch (saveError) {
        console.error('Auto-save failed:', saveError);
        toast.error('Content generated but auto-save failed. You can still save manually in Step 2.');
      }

      // Step 2: Move to Step 2 (Review)
      setCurrentStep(2);
      toast.success('Generation complete! Please review below.');

    } catch (error: any) {
      console.error('Error in lesson creation/generation:', error);
      setApiError(error.message);
      toast.error(`Failed: ${error?.data?.message || error.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateQuestion = async () => {
    if (!prompt.trim() || !selectedLessonType) return;

    setIsGenerating(true);
    setApiError(null);
    setGenerationSuccess(false);

    try {
      const API_ENDPOINTS = {
        [LessonType.READING]: {
          endpoint: '/ai/admin/generate/reading-comprehension/',
          fieldName: 'content'
        },
        [LessonType.LISTENING]: {
          endpoint: '/ai/admin/generate/listening-comprehension/',
          fieldName: 'content'
        },
        [LessonType.WRITING]: {
          endpoint: '/ai/admin/generate/writing-practice/',
          fieldName: 'content'
        },
        [LessonType.SPEAKING]: {
          endpoint: '/ai/admin/generate/speaking-practice/',
          fieldName: 'content'
        },
        [LessonType.GRAMMAR]: {
          endpoint: '/ai/admin/generate/grammar-practice/',
          fieldName: 'content'
        }
      };

      const apiConfig = API_ENDPOINTS[selectedLessonType as LessonType];
      if (!apiConfig) {
        throw new Error(`No API configuration found for lesson type: ${selectedLessonType}`);
      }


      const requestBody: any = {
        provider: getProviderMapping(selectedAIModel),
        skill: getSkillName(selectedLessonType as LessonType),
        task_id: taskId,
        domain: domain,
        level: level,
        target_language: targetLanguage,
        prompt: prompt.trim()
      };

      if (selectedLessonType === LessonType.SPEAKING) {
        requestBody.difficulty = 'beginner';
      }

      const response = await fetch(
        `${AI_API_BASE}${apiConfig.endpoint}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.detail || `API Error: ${response.status}`);
      }

      let result = await response.json();

      if (typeof result === 'string') {
        try {
          const cleanString = result
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/^"|"$/g, '');

          result = JSON.parse(cleanString);
        } catch {
          result = {
            text: result,
            generatedAt: new Date().toISOString()
          };
        }
      }

      setGeneratedContent(result);
      setGenerationSuccess(true);

    } catch (error: any) {
      console.error('Error generating content:', error);
      setApiError(error.message);
      toast.error(`Failed to generate content: ${error.message}`)
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextSubCategory = () => {
    handleCancelCreate();
    refetchLessons();
  };

  const handleReGenerate = () => {
    setGeneratedContent(null);
    setApiError(null);
    setGenerationSuccess(false);
    handleGenerateQuestion();
  };

  const [getLessonQuestionSet] = useLazyGetLessonQuestionSetQuery();

  const handleViewDetails = async (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
    setIsLoadingPreview(true);
    setPreviewQuestionSets([]);

    try {
      const result = await getLessonQuestionSet({
        lessonId: lesson.id
      }).unwrap();

      if (result && result.success && result.data) {
        const questionSetData = result.data;
        setPreviewQuestionSets([questionSetData]);
      }
    } catch (error: any) {
      if (error?.status !== 404 && error?.data?.statusCode !== 404) {
        console.warn(`Error fetching question set:`, error);
      }
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleUpdateQuestionSet = async (lessonId: string, content: any, prompt?: string) => {
    try {
      const lesson = selectedLesson;
      if (!lesson) {
        toast.error('Lesson not found');
        return;
      }

      const payload = {
        lessonId: Number(lessonId),
        prompt: prompt || `Updated content`,
        content: content
      };

      await upsertLessonQuestionSet(payload as any).unwrap();
      toast.success('Content updated successfully!');

      if (selectedLesson) {
        await handleViewDetails(selectedLesson);
      }
    } catch (error: any) {
      console.error('Update failed:', error);
      if (error?.data?.message) {
        const errorMsg = Array.isArray(error.data.message)
          ? error.data.message.join(', ')
          : error.data.message;
        toast.error(`Update failed: ${errorMsg}`);
      } else {
        toast.error(`Update failed: ${error?.message || 'Unknown error'}`);
      }
    }
  };

  const handleDeleteLesson = (lessonId: string, lessonTitle: string) => {
    setDeleteConfirmation({
      isOpen: true,
      lessonId,
      lessonTitle
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.lessonId) return;

    try {
      await deleteLesson(deleteConfirmation.lessonId).unwrap();
      refetchLessons();
      setDeleteConfirmation({ isOpen: false, lessonId: null, lessonTitle: '' });
    } catch (error: any) {
      console.error('Error deleting lesson:', error);
      toast.error(`Failed to delete lesson: ${error?.data?.message || error.message || 'Unknown error'}`)
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, lessonId: null, lessonTitle: '' });
  };

  // Reset taskId when lesson type changes
  useEffect(() => {
    setTaskId('');
  }, [selectedLessonType]);

  if (!isCreatingLesson) {
    return (
      <LessonsListView
        lessons={lessonsData?.data?.data || []}
        paginationMeta={lessonsData?.data?.meta}
        currentPage={currentPage}
        searchTerm={searchTerm}
        selectedTypeFilter={selectedTypeFilter}
        isLoadingLessons={false}
        isDeleting={isDeleting}
        deleteConfirmation={deleteConfirmation}
        selectedLesson={selectedLesson}
        isModalOpen={isModalOpen}
        lessonDetails={lessonDetails}
        isLoadingDetails={isLoadingDetails}
        onCreateLesson={handleCreateLesson}
        onViewDetails={handleViewDetails}
        onDeleteLesson={handleDeleteLesson}
        onCloseModal={() => setIsModalOpen(false)}
        onConfirmDelete={confirmDelete}
        onCancelDelete={cancelDelete}
        onPageChange={setCurrentPage}
        onSearchChange={setSearchTerm}
        onTypeFilterChange={setSelectedTypeFilter}
        previewQuestionSets={previewQuestionSets}
        isLoadingPreview={isLoadingPreview}
        formatGeneratedContent={formatGeneratedContent}
        onUpdateQuestionSet={(lId, content, prompt) => handleUpdateQuestionSet(lId, content, prompt)}
        isSavingQuestionSet={isSavingQuestionSet}
      />
    );
  }

  return (
    <LessonCreationWizard
      currentStep={currentStep}
      selectedLessonType={selectedLessonType}
      lessonTitle={lessonTitle}
      selectedAIModel={selectedAIModel}
      prompt={prompt}
      generatedContent={generatedContent}
      isGenerating={isGenerating}
      isCreatingLessonApi={isCreatingLessonApi}
      isSavingQuestionSet={isSavingQuestionSet}
      apiError={apiError}
      generationSuccess={generationSuccess}
      createdLessonId={createdLessonId}
      domain={domain}
      taskId={taskId}
      level={level}
      targetLanguage={targetLanguage}
      getExamplePrompt={() => ''}
      formatGeneratedContent={formatGeneratedContent}
      onCancel={handleCancelCreate}
      onBackToStep1={() => setCurrentStep(1)}
      onSetLessonType={setSelectedLessonType}
      onSetLessonTitle={setLessonTitle}
      onSetAIModel={setSelectedAIModel}
      onSetPrompt={setPrompt}
      onSetDomain={setDomain}
      onSetTaskId={setTaskId}
      onSetLevel={setLevel}
      onSetTargetLanguage={setTargetLanguage}
      onTitleNext={handleTitleNext}
      onGenerateQuestion={handleGenerateQuestion}
      onNextSubCategory={handleNextSubCategory}
      onReGenerate={handleReGenerate}
    />
  );
};

export default LessonsContainer;