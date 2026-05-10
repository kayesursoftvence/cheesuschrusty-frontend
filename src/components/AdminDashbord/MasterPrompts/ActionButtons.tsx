import React from 'react';

interface ActionButtonsProps {
  isEditing: boolean;
  onTestPrompt: () => void;
  onViewChanges: () => void;
  onSaveOrEdit: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isEditing,
  onTestPrompt,
  onViewChanges,
  onSaveOrEdit,
}) => {
  return (
    <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
      <button 
        onClick={onTestPrompt}
        className="px-6 py-3 bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center"
      >
        <span className="text-xl mr-2">🧪</span>
        Test Prompt
      </button>
      <button 
        onClick={onViewChanges}
        className="px-6 py-3 bg-purple-500 dark:bg-purple-600 hover:bg-purple-600 dark:hover:bg-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center"
      >
        <span className="text-xl mr-2">📊</span>
        View Changes
      </button>
      <button 
        onClick={onSaveOrEdit}
        className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center ${
          isEditing 
            ? 'bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white' 
            : 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white'
        }`}
      >
        <span className="text-xl mr-2">💾</span>
        {isEditing ? 'Save Draft' : 'Edit Prompt'}
      </button>
      {/* <button className="px-6 py-3 bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center">
        <span className="text-xl mr-2">🚀</span>
        Deploy
      </button> */}
    </div>
  );
};

export default ActionButtons;
