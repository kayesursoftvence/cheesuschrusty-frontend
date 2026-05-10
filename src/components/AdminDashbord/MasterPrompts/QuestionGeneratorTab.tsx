import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
// import ActionButtons from './ActionButtons';
import TestPromptModal from './TestPromptModal';
import { useUpdateMasterPromptQuestionsMutation } from '@/redux/features/masterPrompts/masterPromptsApi';

interface PromptContent {
  title: string;
  lastUpdated: string;
  content: string;
}

interface QuestionGeneratorTabProps {
  prompt: PromptContent;
  onPromptUpdate: (prompt: PromptContent) => void;
  onShowVersionModal: () => void;
  updateMutation: ReturnType<typeof useUpdateMasterPromptQuestionsMutation>[0];
}

const QuestionGeneratorTab: React.FC<QuestionGeneratorTabProps> = ({
  prompt,
  onPromptUpdate,
  // onShowVersionModal,
  updateMutation,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableContent, setEditableContent] = useState<string>(prompt.content);
  const [showTestModal, setShowTestModal] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    setEditableContent(prompt.content);
  }, [prompt.content]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditableContent(prompt.content);
  };

  const handleSaveClick = useCallback(async () => {
    if (!editableContent.trim()) {
      toast.error('Prompt content cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateMutation(editableContent).unwrap();
      
      if (result.success && result.data) {
        const updatedPrompt = {
          ...prompt,
          content: result.data.content,
          lastUpdated: `${new Date(result.data.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} by Admin`
        };
        onPromptUpdate(updatedPrompt);
        setIsEditing(false);
        toast.success('Prompt saved successfully!');
      } else {
        throw new Error(result.message || 'Failed to save prompt');
      }
    } catch (error: unknown) {
      console.error('Error saving prompt:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save prompt. Please try again.';
      toast.error((error as any)?.data?.message || errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [editableContent, updateMutation, prompt, onPromptUpdate]);

  const handleCancelClick = useCallback(() => {
    setIsEditing(false);
    setEditableContent(prompt.content);
  }, [prompt.content]);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(prompt.content);
    alert('Prompt copied to clipboard!');
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing && e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSaveClick();
      }
      if (isEditing && e.key === 'Escape') {
        handleCancelClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, handleSaveClick, handleCancelClick]);

  return (
    <>
      {/* Prompt Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{prompt.title}</h2>
            {/* <div className="flex items-center mt-2 space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {prompt.lastUpdated}
              </span>
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                v2.1
              </span>
            </div> */}
          </div>
          {/* <div className="flex space-x-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
              <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </button>
          </div> */}
        </div>

        {/* Stats Bar */}
        {/* <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Status</div>
            <div className="text-lg font-semibold text-blue-800 dark:text-blue-300">Active</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-sm text-green-600 dark:text-green-400 font-medium">Uses</div>
            <div className="text-lg font-semibold text-green-800 dark:text-green-300">1,247</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">Success Rate</div>
            <div className="text-lg font-semibold text-purple-800 dark:text-purple-300">94%</div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <div className="text-sm text-amber-600 dark:text-amber-400 font-medium">Avg. Response Time</div>
            <div className="text-lg font-semibold text-amber-800 dark:text-amber-300">1.2s</div>
          </div>
        </div> */}
      </div>

      {/* Prompt Template */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Prompt Template</h3>
          {/* <div className="flex space-x-2">
            <button 
              onClick={handleCopyClick}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              title="Copy to clipboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </button>
          </div> */}
        </div>

        <div className="relative">
          {isEditing ? (
            <textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              className="w-full h-[600px] bg-gray-900 dark:bg-gray-950 text-gray-100 dark:text-gray-200 p-8 rounded-xl text-sm font-mono leading-relaxed border border-gray-800 dark:border-gray-700 shadow-inner resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              spellCheck="false"
              autoFocus
            />
          ) : (
            <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 dark:text-gray-200 p-8 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed whitespace-pre-wrap border border-gray-800 dark:border-gray-700 shadow-inner min-h-[600px]">
              {prompt.content}
            </pre>
          )}
          <div className="absolute top-4 right-4 flex space-x-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSaveClick}
                  disabled={isSaving}
                  className="px-3 py-1 text-xs bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600 rounded transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save
                    </>
                  )}
                </button>
                <button 
                  onClick={handleCancelClick}
                  className="px-3 py-1 text-xs bg-gray-600 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600 rounded transition-colors flex items-center"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleCopyClick}
                  className="px-3 py-1 text-xs bg-gray-800 dark:bg-gray-700 text-gray-300 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-600 rounded transition-colors flex items-center"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
                <button 
                  onClick={handleEditClick}
                  className="px-3 py-1 text-xs bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 rounded transition-colors flex items-center"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              </>
            )}
          </div>
          
          {isEditing && (
            <div className="absolute bottom-4 left-4">
              <div className="text-xs text-gray-400 dark:text-gray-500 bg-gray-800 dark:bg-gray-900 px-2 py-1 rounded">
                Editing mode • Press Ctrl+S to save, Esc to cancel
              </div>
            </div>
          )}
        </div>
        
        {isEditing && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center text-blue-700 dark:text-blue-300">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">You are editing the prompt template. Changes will be saved when you click "Save".</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {/* <ActionButtons
        isEditing={isEditing}
        onTestPrompt={() => setShowTestModal(true)}
        onViewChanges={onShowVersionModal}
        onSaveOrEdit={isEditing ? handleSaveClick : handleEditClick}
      /> */}

      {/* Test Prompt Modal */}
      <TestPromptModal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
        promptType="question-generator"
      />
    </>
  );
};

export default QuestionGeneratorTab;
