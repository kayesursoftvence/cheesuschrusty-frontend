/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';
import { LessonType, AIProvider } from './Type';

interface Step2ContentGenerationProps {
  lessonTitle: string;
  selectedLessonType: LessonType | '';
  selectedAIModel: AIProvider;
  prompt: string;
  generatedContent: any;
  apiError: string | null;
  generationSuccess: boolean;
  isGenerating: boolean;
  isSavingQuestionSet: boolean;
  getExamplePrompt: () => string;
  formatGeneratedContent: (content: any) => string;
  onSetPrompt: (prompt: string) => void;
  onGenerate: () => void;
  onReGenerate: () => void;
  onNextSubCategory: () => void;
  onBack: () => void;
}

const Step2ContentGeneration: React.FC<Step2ContentGenerationProps> = ({
  lessonTitle,
  selectedLessonType,
  selectedAIModel,
  // prompt,
  generatedContent,
  // apiError,
  // generationSuccess,
  isGenerating,
  isSavingQuestionSet,
  formatGeneratedContent,
  // onSetPrompt,
  // onGenerate,
  onNextSubCategory,
  onBack
}) => {
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
console.log(generatedContent)
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 relative">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4 cursor-pointer"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Setup
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lessonTitle}</h1>
            <div className="flex items-center mt-2">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full mr-3 font-medium">
                {selectedLessonType}
              </span>
              <span className="flex items-center text-green-600 dark:text-green-400">
                <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mr-2"></span>
                {selectedAIModel === AIProvider.OPEN_AI ? 'OpenAI' : 'Grok'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Generation Section */}
      {/* <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Generation</h3>
        
         {apiError && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 dark:text-red-400 mr-2" size={20} />
              <span className="text-red-700 dark:text-red-300 font-medium">Error: {apiError}</span>
            </div>
          </div>
        )}
        
        {generationSuccess && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="text-green-500 dark:text-green-400 mr-2" size={20} />
              <span className="text-green-700 dark:text-green-300 font-medium">Content generated successfully!</span>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter your prompt for content generation
          </label>
          <textarea
            value={prompt}
            onChange={(e) => onSetPrompt(e.target.value)}
            placeholder="Describe the content you want to generate..."
            rows={4}
            className="w-full  text-black dark:text-white dark:bg-gray-700 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none resize-none text-lg"
          />
        </div>

        <button
          onClick={onGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full py-4 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed font-medium flex items-center justify-center transition-colors text-lg cursor-pointer"
        >
          <Sparkles size={24} className="mr-3" />
          {isGenerating ? 'Generating Content...' : 'Generate Content with AI'}
        </button>
      </div> */}

       {generatedContent && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generated Content</h3>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                AI Generated
              </span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                {selectedAIModel === AIProvider.OPEN_AI ? 'OpenAI' : 'Grok'}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border-2 border-gray-100 dark:border-gray-600 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              <code className="block select-all">
                {formatGeneratedContent(generatedContent)}
              </code>
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <div className="flex-1 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center">
              <CheckCircle className="text-blue-600 dark:text-blue-400 mr-3" size={24} />
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                This lesson and its content have been automatically saved.
              </p>
            </div>
            <button
              onClick={onNextSubCategory}
              className="px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center cursor-pointer"
            >
              Finish & View Lessons
            </button>
          </div>
        </div>
      )}

      {/* Empty State when no content generated */}
      {!generatedContent && !isGenerating && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Content Preview
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your generated content will appear here after you click "Generate Content"
          </p>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 dark:border-purple-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            AI is creating content for your lesson...
          </p>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all animate-in zoom-in-95">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-6">
              <CheckCircle size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Confirm Lesson Content
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
              Are you sure you want to save this generated content? This will create the lesson and finalize the setup.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-all"
              >
                Review Again
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  onNextSubCategory();
                }}
                className="flex-1 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center"
              >
                {isSavingQuestionSet ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  'Yes, Save Content'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2ContentGeneration;