// MasterPrompts.tsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import QuestionGeneratorTab from './QuestionGeneratorTab';
import FeedbackEvaluatorTab from './FeedbackEvaluatorTab';
import {
  useGetMasterPromptQuestionsQuery,
  useGetMasterPromptFeedbackQuery,
  useUpdateMasterPromptQuestionsMutation,
  useUpdateMasterPromptFeedbackMutation,
} from '@/redux/features/masterPrompts/masterPromptsApi';

interface Tab {
  id: string;
  label: string;
}

interface PromptContent {
  title: string;
  lastUpdated: string;
  content: string;
}

const MasterPrompts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('question-generator');
  const [showVersionModal, setShowVersionModal] = useState<boolean>(false);
  const [currentPrompt, setCurrentPrompt] = useState<PromptContent>({
    title: '',
    lastUpdated: '',
    content: ''
  });

  // API hooks
  const {
    data: questionsData,
    isLoading: isLoadingQuestions,
    error: questionsError,
  } = useGetMasterPromptQuestionsQuery({page: 1, limit: 10});

  const {
    data: feedbackData,
    isLoading: isLoadingFeedback,
    error: feedbackError,
  } = useGetMasterPromptFeedbackQuery({page: 1, limit: 10});

  const [updateMasterPromptQuestions] = useUpdateMasterPromptQuestionsMutation();
  const [updateMasterPromptFeedback] = useUpdateMasterPromptFeedbackMutation();

  // Helper function to format ISO date to readable format
  const formatDate = (isoDate: string): string => {
    try {
      const date = new Date(isoDate);
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} by Admin`;
    } catch {
      return 'Unknown date';
    }
  };

  const tabs: Tab[] = [
    { id: 'question-generator', label: 'Question Generator' },
    { id: 'feedback-evaluator', label: 'Feedback Evaluator' },
    // { id: 'version-history', label: 'Version History' },
    // { id: 'analytics', label: 'Analytics' },
  ];

  // Get prompt content from API response data only
  const getPromptContent = (tabId: string): PromptContent | null => {
    switch (tabId) {
      case 'question-generator':
        if (questionsData?.data) {
          return {
            title: 'Question Generator Prompt',
            lastUpdated: formatDate(questionsData.data.updatedAt),
            content: questionsData.data.content,
          };
        }
        return null;
      case 'feedback-evaluator':
        if (feedbackData?.data) {
          return {
            title: 'Feedback Evaluator Prompt',
            lastUpdated: formatDate(feedbackData.data.updatedAt),
            content: feedbackData.data.content,
          };
        }
        return null;
      default:
        return null;
    }
  };

  // Set initial prompt content on component mount and when data changes
  useEffect(() => {
    const promptContent = getPromptContent(activeTab);
    if (promptContent) {
      setCurrentPrompt(promptContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, questionsData?.data, feedbackData?.data]);

  // Handle API errors
  useEffect(() => {
    if (questionsError) {
      console.error('Error fetching question generator prompt:', questionsError);
      toast.error('Failed to load question generator prompt from API.');
    }
    if (feedbackError) {
      console.error('Error fetching feedback evaluator prompt:', feedbackError);
      toast.error('Failed to load feedback evaluator prompt from API.');
    }
  }, [questionsError, feedbackError]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'question-generator' || tabId === 'feedback-evaluator') {
      const newPrompt = getPromptContent(tabId);
      if (newPrompt) {
        setCurrentPrompt(newPrompt);
      }
    }
  };

  const handlePromptUpdate = (updatedPrompt: PromptContent) => {
    setCurrentPrompt(updatedPrompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header Section */}
          <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Master Prompts</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage, test, and deploy AI prompt templates with full version control</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Production</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    relative px-5 py-4 text-sm font-medium transition-all duration-200
                    ${activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }
                  `}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {/* Version History Tab */}
            {activeTab === 'version-history' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Version History</h2>
                  <p className="text-gray-600 dark:text-gray-400">Track changes and rollback if needed</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Version</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Commit Message</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deployed</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <strong className="text-gray-900 dark:text-gray-100">v2.8</strong>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">Feedback Evaluator</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">Enhanced evidence quotation rules</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">Production</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">Jan 7, 2025</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">View Diff</button>
                              <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">Download</button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <strong className="text-gray-900 dark:text-gray-100">v2.1</strong>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">Question Generator</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">Added calibration metrics section</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">Production</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">Jan 5, 2025</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">View Diff</button>
                              <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">Download</button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">v2.7</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">Feedback Evaluator</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">Fixed borderline label logic</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">Archived</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">Dec 30, 2024</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">🔄 Rollback</button>
                              <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">View Diff</button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">v2.0</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">Question Generator</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">Major update: Added domain logic</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">Archived</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">Dec 28, 2024</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">🔄 Rollback</button>
                              <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">View Diff</button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Analytics</h2>
                  <p className="text-gray-600 dark:text-gray-400">Monitor prompt performance and usage metrics</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Question Generator Calls</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">3,284</div>
                    <div className="text-xs text-green-600 dark:text-green-400">↑ 234 this week</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Feedback Evaluator Calls</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">5,127</div>
                    <div className="text-xs text-green-600 dark:text-green-400">↑ 412 this week</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Avg Response Time</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">2.4s</div>
                    <div className="text-xs text-green-600 dark:text-green-400">↓ 0.3s from last week</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Error Rate</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">0.2%</div>
                    <div className="text-xs text-green-600 dark:text-green-400">↓ 0.1% from last week</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Usage by Task Type</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Most generated question types</p>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Listening (L-01)</span>
                        <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">847 questions</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Reading (R-02)</span>
                        <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">723 questions</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Writing (W-01)</span>
                        <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">612 questions</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Speaking (S-02)</span>
                        <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">489 questions</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Quality Metrics</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Average feedback scores</p>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Question Clarity</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">4.7 / 5.0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Feedback Helpfulness</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">4.8 / 5.0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">CEFR Accuracy</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">4.9 / 5.0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">User Satisfaction</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">4.6 / 5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Prompt Editor Tabs (Question Generator & Feedback Evaluator) */}
            {activeTab === 'question-generator' && (
              <>
                {isLoadingQuestions ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                      <div className="text-gray-500 dark:text-gray-400">Loading question generator prompt...</div>
                    </div>
                  </div>
                ) : questionsError ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="text-red-500 dark:text-red-400 mb-2">Failed to load prompt</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Please try refreshing the page</div>
                    </div>
                  </div>
                ) : questionsData?.data ? (
                  <QuestionGeneratorTab
                    prompt={currentPrompt}
                    onPromptUpdate={handlePromptUpdate}
                    onShowVersionModal={() => setShowVersionModal(true)}
                    updateMutation={updateMasterPromptQuestions}
                  />
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500 dark:text-gray-400">No prompt data available</div>
                  </div>
                )}
              </>
            )}
            {activeTab === 'feedback-evaluator' && (
              <>
                {isLoadingFeedback ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                      <div className="text-gray-500 dark:text-gray-400">Loading feedback evaluator prompt...</div>
                    </div>
                  </div>
                ) : feedbackError ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="text-red-500 dark:text-red-400 mb-2">Failed to load prompt</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Please try refreshing the page</div>
                    </div>
                  </div>
                ) : feedbackData?.data ? (
                  <FeedbackEvaluatorTab
                    prompt={currentPrompt}
                    onPromptUpdate={handlePromptUpdate}
                    onShowVersionModal={() => setShowVersionModal(true)}
                    updateMutation={updateMasterPromptFeedback}
                  />
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500 dark:text-gray-400">No prompt data available</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Version Comparison Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70" onClick={() => setShowVersionModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Version Comparison</h2>
              </div>
              <button
                onClick={() => setShowVersionModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Changes Overview */}
            <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Changes Overview</h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">v2.0 → v2.1</span>
            </div>

            {/* Comparison Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Version 2.0 */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">VERSION 2.0</h4>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-gray-800 dark:text-gray-200"># [SYSTEM_ROLE]</div>
                    <div className="text-gray-800 dark:text-gray-200">ROLE=ITALIAN_B1_CIVIC_GENERATOR</div>
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded">
                      MODE=STANDARD
                    </div>
                    <div className="text-gray-500 dark:text-gray-500">...</div>
                    <div className="text-gray-800 dark:text-gray-200"># [OUTPUT_SCHEMA]</div>
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded">
                      Simple output format
                    </div>
                  </div>
                </div>

                {/* Version 2.1 */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">VERSION 2.1</h4>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-gray-800 dark:text-gray-200"># [SYSTEM_ROLE]</div>
                    <div className="text-gray-800 dark:text-gray-200">ROLE=ITALIAN_B1_CIVIC_GENERATOR</div>
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                      MODE=STRICT_EXECUTION
                    </div>
                    <div className="text-gray-500 dark:text-gray-500">...</div>
                    <div className="text-gray-800 dark:text-gray-200"># [OUTPUT_SCHEMA]</div>
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                      Enhanced output with teacher/student separation
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                      # [CALIBRATION_METRICS]
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterPrompts;