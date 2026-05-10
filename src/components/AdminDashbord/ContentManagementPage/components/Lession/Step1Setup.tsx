import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { LessonType, AIProvider, getDomains } from './Type';

interface Step1SetupProps {
  selectedLessonType: LessonType | '';
  lessonTitle: string;
  selectedAIModel: AIProvider;
  isCreatingLessonApi: boolean;
  isGenerating?: boolean;
  domain: string;
  taskId: string;
  level: string;
  targetLanguage: string;
  onSetLessonType: (type: LessonType) => void;
  onSetLessonTitle: (title: string) => void;
  onSetAIModel: (model: AIProvider) => void;
  onSetDomain: (domain: string) => void;
  onSetTaskId: (taskId: string) => void;
  onSetLevel: (level: string) => void;
  onSetTargetLanguage: (targetLanguage: string) => void;
  onNext: () => void;
  onCancel: () => void;
}

const Step1Setup: React.FC<Step1SetupProps> = ({
  selectedLessonType,
  // lessonTitle,
  selectedAIModel,
  isCreatingLessonApi,
  isGenerating = false,
  domain,
  taskId,
  level,
  targetLanguage,
  onSetLessonType,
  // onSetLessonTitle,
  onSetAIModel,
  onSetDomain,
  onSetTaskId,
  onSetLevel,
  onSetTargetLanguage,
  onNext,
  onCancel
}) => {
  const lessonTypes = [
    { value: LessonType.READING, label: 'Reading', icon: '📖', description: 'Generate reading passages and comprehension questions' },
    { value: LessonType.WRITING, label: 'Writing', icon: '✍️', description: 'Create writing exercises and prompts' },
    { value: LessonType.LISTENING, label: 'Listening', icon: '👂', description: 'Generate audio exercises and dialogues' },
    { value: LessonType.SPEAKING, label: 'Speaking', icon: '🗣️', description: 'Create speaking practice exercises' }
  ];

  // const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

  // Get task ID suggestions based on selected lesson type
  const getTaskIdSuggestions = (): string => {
    switch (selectedLessonType) {
      case LessonType.READING:
        return 'r-01, r-02, r-03';
      case LessonType.LISTENING:
        return 'l-01, l-02, l-03';
      case LessonType.WRITING:
        return 'w-01, w-02, w-03';
      case LessonType.SPEAKING:
        return 's-01, s-02, s-03';
      default:
        return 'r-01, l-02, w-01, s-02';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Lesson Setup</h2>
        <p className="text-gray-600 dark:text-gray-400">Configure the basic settings for your new lesson</p>
      </div>

      {/* Select Test Type */}
      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-900 dark:text-white mb-4">
          Select Lesson Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessonTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onSetLessonType(type.value)}
              className={`flex cursor-pointer flex-col items-start p-6 border-2 rounded-xl transition-all text-left ${
                selectedLessonType === type.value
                  ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">{type.icon}</span>
                <span className="text-lg font-medium text-gray-900 dark:text-white">{type.label}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
            </button>
          ))}
        </div>
      </div>


      {/* Task ID Input */}
      {selectedLessonType && (
        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-900 dark:text-white mb-3">
            Task ID
          </label>
          <input
            type="text"
            value={taskId}
            onChange={(e) => onSetTaskId(e.target.value)}
            placeholder="e.g., r-01, r-02, l-01, l-02, w-01, w-02, s-01, s-02"
            className="w-full text-black dark:text-white dark:bg-gray-700 px-4 py-3 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
          />
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Suggestions: {getTaskIdSuggestions()}
          </div>
        </div>
      )}



      {/* Lesson Title */}
      {/* <div className="mb-8">
        <label className="block text-lg font-medium text-gray-900 dark:text-white mb-3">
          Lesson Title
        </label>
        <input
          type="text"
          value={lessonTitle}
          onChange={(e) => onSetLessonTitle(e.target.value)}
          placeholder="Enter a descriptive title for your lesson..."
          className="w-full text-black dark:text-white dark:bg-gray-700 px-4 py-3 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
        />
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Example: " Travel Planning Dialogue" or " Restaurant Conversations"
        </div>
      </div> */}

      {/* Select AI Model */}
      <div className="mb-10">
        <label className="block text-lg font-medium text-gray-900 dark:text-white mb-4">
          Select AI Model Provider
        </label>
        <div className="flex space-x-4">
          <button
            onClick={() => onSetAIModel(AIProvider.OPEN_AI)}
            className={`flex-1 cursor-pointer py-4 px-6 border-2 rounded-lg transition-all ${
              selectedAIModel === AIProvider.OPEN_AI
                ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                <Sparkles size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">OpenAI</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">GPT-4, DALL-E, etc.</div>
              </div>
            </div>
          </button>
          <button
            onClick={() => onSetAIModel(AIProvider.GROK)}
            className={`flex-1 cursor-pointer py-4 px-6 border-2 rounded-lg transition-all ${
              selectedAIModel === AIProvider.GROK
                ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                <Sparkles size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">Grok</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">xAI Model</div>
              </div>
            </div>
          </button>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-3">
          This will be sent as the "provider" field in the API request
        </div>
      </div>

      {/* Domain Selection */}
      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-900 dark:text-white mb-3">
          Domain
        </label>
        <select
          value={domain}
          onChange={(e) => onSetDomain(e.target.value)}
          className="w-full text-black dark:text-white dark:bg-gray-700 px-4 py-3 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
        >
          <option value="">Select a domain</option>
          {getDomains().map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Level Input */}
      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-900 dark:text-white mb-3">
          Level
        </label>
        <input
          type="text"
          value={level}
          onChange={(e) => onSetLevel(e.target.value)}
          placeholder="e.g., A1, A2, B1,,B1C, B2, C1, C2"
          className="w-full text-black dark:text-white dark:bg-gray-700 px-4 py-3 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
        />
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Example: A1, A2, B1,B1C, B2, C1, C2
        </div>
      </div>
      {/* <select
        value={level}
        onChange={(e) => onSetLevel(e.target.value)}
        className="w-full text-black dark:text-white dark:bg-gray-700 px-4 py-3 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
      >
        <option value="" disabled>Select level</option>
        {LEVELS.map((lvl) => (
          <option key={lvl} value={lvl}>
            {lvl}
          </option>
        ))}
      </select> */}


 




      {/* Target Language Input */}
      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-900 dark:text-white mb-3">
          Target Language
        </label>
        <input
          type="text"
          value={targetLanguage}
          onChange={(e) => onSetTargetLanguage(e.target.value)}
          placeholder="e.g., Italian, English, Spanish"
          className="w-full text-black dark:text-white dark:bg-gray-700 px-4 py-3 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
        />
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Example: Italian, English,Portuguese, Spanish, French,German
          {/* "Italian" | "English" | "French" | "German" | "Spanish" | "Portuguese" */}
        </div>
      </div>

      

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t dark:border-gray-700">
        <button
          onClick={onCancel}
          className="px-8 cursor-pointer py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onNext}
          disabled={!selectedLessonType || !selectedAIModel || !domain || !taskId || !level || !targetLanguage || isCreatingLessonApi || isGenerating}
          className="px-8 py-3 cursor-pointer bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed font-medium transition-colors flex items-center"
        >
          {(isCreatingLessonApi || isGenerating) ? 'Creating Lesson and Generating Content...' : 'Generate Lesson Content'}
          <ArrowLeft size={20} className="ml-2 rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default Step1Setup;