import React, { useState } from 'react';

interface TestPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptType: 'question-generator' | 'feedback-evaluator';
}

const TestPromptModal: React.FC<TestPromptModalProps> = ({
  isOpen,
  onClose,
  // promptType,
}) => {
  const [aiProvider, setAiProvider] = useState('OpenAI (GPT-4 Turbo)');
  const [taskType, setTaskType] = useState('L-01: Listening (Short Interactions)');
  const [domain, setDomain] = useState('Health (SSN/Hospital)');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const handleRunTest = () => {
    setIsRunning(true);
    // Simulate test execution
    setTimeout(() => {
      setTestResults({
        success: true,
        task: taskType,
        domain: domain,
        provider: aiProvider,
        sampleQuestion: 'Hai bisogno di prenotare una visita medica presso il Servizio Sanitario Nazionale.\nTelefoni al numero verde e parli con un operatore...',
        responseTime: '2.2s',
        tokenCount: '1,222',
        aiProvider: 'OpenAI',
      });
      setIsRunning(false);
    }, 2000);
  };

  if (!isOpen) return null;

  const taskTypes = [
    'L-01: Listening (Short Interactions)',
    'L-02: Listening (Public Info)',
    'R-01: Reading (Information Search)',
    'R-02: Reading (Comprehension)',
    'W-01: Writing (Functional)',
    'S-01: Speaking (Transaction)',
    'S-02: Speaking (Monologue)',
  ];

  const domains = [
    'Health (SSN/Hospital)',
    'Education (School/Training)',
    'Work (Contracts/Safety)',
    'Housing (Rent/Condominium)',
    'Bureaucracy (City Hall/Post Office)',
    'Daily Commerce (Supermarket/Services)',
  ];

  const aiProviders = [
    'OpenAI (GPT-4 Turbo)',
    'OpenAI (GPT-3.5)',
    'Anthropic (Claude)',
    'Google (Gemini)',
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">⚡</span>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Run Test Case</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRunTest}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Run Test
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Configuration Section */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                AI Provider
              </label>
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                {aiProviders.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Task Type
              </label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                {taskTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Generate & Test Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleRunTest}
              disabled={isRunning}
              className="px-8 py-3 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-xl mr-2">🚀</span>
              {isRunning ? 'Running Test...' : 'Generate & Test'}
            </button>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="space-y-4">
              {/* Success Message */}
              <div className="flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-800 dark:text-green-300 font-medium">Test completed successfully!</span>
              </div>

              {/* Test Details */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-2">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Task:</span> {testResults.task}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Domain:</span> {testResults.domain}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Provider:</span> {testResults.provider}
                </div>
              </div>

              {/* Sample Generated Question */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Sample Generated Question:
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
                    {testResults.sampleQuestion}
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                  [Full test output would appear here in production]
                </p>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">RESPONSE TIME</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{testResults.responseTime}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">TOKEN COUNT</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{testResults.tokenCount}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">AI PROVIDER</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{testResults.aiProvider}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPromptModal;
