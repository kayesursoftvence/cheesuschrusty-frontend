import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import Step1Setup from './Step1Setup';
import Step2ContentGeneration from './Step2ContentGeneration';
import { LessonType, AIProvider } from './Type';

interface LessonCreationWizardProps {
  currentStep: number;
  selectedLessonType: LessonType | '';
  lessonTitle: string;
  selectedAIModel: AIProvider;
  prompt: string;
  generatedContent: any;
  isGenerating: boolean;
  isCreatingLessonApi: boolean;
  isSavingQuestionSet: boolean;
  apiError: string | null;
  generationSuccess: boolean;
  createdLessonId: string | null;
  domain: string;
  taskId: string;
  level: string;
  targetLanguage: string;
  getExamplePrompt: () => string;
  formatGeneratedContent: (content: any) => string;
  onCancel: () => void;
  onBackToStep1: () => void;
  onSetLessonType: (type: LessonType) => void;
  onSetLessonTitle: (title: string) => void;
  onSetAIModel: (model: AIProvider) => void;
  onSetPrompt: (prompt: string) => void;
  onSetDomain: (domain: string) => void;
  onSetTaskId: (taskId: string) => void;
  onSetLevel: (level: string) => void;
  onSetTargetLanguage: (targetLanguage: string) => void;
  onTitleNext: () => void;
  onGenerateQuestion: () => void;
  onNextSubCategory: () => void;
  onReGenerate: () => void;
}

const LessonCreationWizard: React.FC<LessonCreationWizardProps> = ({
  currentStep,
  selectedLessonType,
  lessonTitle,
  selectedAIModel,
  prompt,
  generatedContent,
  isGenerating,
  isCreatingLessonApi,
  isSavingQuestionSet,
  apiError,
  generationSuccess,
  createdLessonId,
  domain,
  taskId,
  level,
  targetLanguage,
  getExamplePrompt,
  formatGeneratedContent,
  onCancel,
  onBackToStep1,
  onSetLessonType,
  onSetLessonTitle,
  onSetAIModel,
  onSetPrompt,
  onSetDomain,
  onSetTaskId,
  onSetLevel,
  onSetTargetLanguage,
  onTitleNext,
  onGenerateQuestion,
  onNextSubCategory,
  onReGenerate
}) => {

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900/50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onCancel}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-6 cursor-pointer"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Lessons
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Lesson</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
                Step {currentStep} of 2
              </span>
              {createdLessonId && (
                <span className="text-sm text-green-600 dark:text-green-400 mr-4">
                  Lesson ID: {createdLessonId}
                </span>
              )}
              <button
                onClick={onCancel}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-8">
        {currentStep === 1 ? (
          <Step1Setup
            selectedLessonType={selectedLessonType}
            lessonTitle={lessonTitle}
            selectedAIModel={selectedAIModel}
            isCreatingLessonApi={isCreatingLessonApi}
            isGenerating={isGenerating}
            domain={domain}
            taskId={taskId}
            level={level}
            targetLanguage={targetLanguage}
            onSetLessonType={onSetLessonType}
            onSetLessonTitle={onSetLessonTitle}
            onSetAIModel={onSetAIModel}
            onSetDomain={onSetDomain}
            onSetTaskId={onSetTaskId}
            onSetLevel={onSetLevel}
            onSetTargetLanguage={onSetTargetLanguage}
            onNext={onTitleNext}
            onCancel={onCancel}
          />
        ) : (
          <Step2ContentGeneration
            lessonTitle={lessonTitle}
            selectedLessonType={selectedLessonType}
            selectedAIModel={selectedAIModel}
            prompt={prompt}
            generatedContent={generatedContent}
            apiError={apiError}
            generationSuccess={generationSuccess}
            isGenerating={isGenerating}
            isSavingQuestionSet={isSavingQuestionSet}
            getExamplePrompt={getExamplePrompt}
            formatGeneratedContent={formatGeneratedContent}
            onSetPrompt={onSetPrompt}
            onGenerate={onGenerateQuestion}
            onReGenerate={onReGenerate}
            onNextSubCategory={onNextSubCategory}
            onBack={onBackToStep1}
          />
        )}
      </div>
    </div>
  );
};

export default LessonCreationWizard;