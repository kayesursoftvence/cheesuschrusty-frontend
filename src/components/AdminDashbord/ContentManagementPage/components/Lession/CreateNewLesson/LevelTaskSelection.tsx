import React, { useMemo, useState } from 'react';
import type { JSX } from 'react';
import { CEFRLevel, TaskType, TaskIdType } from './types';
import Card from './Card';
import StepNavigation from './StepNavigation';
import { useGetAIPromptStructureQuery, PromptStructureLevel } from '@/redux/features/aiApi/aiApi';

interface LevelOption {
  name: string;
  badge: string;
  disabled: boolean;
  value?: CEFRLevel;
}

interface TaskOption {
  value: TaskType;
  icon: string;
  name: string;
  subtasks: {
    id: TaskIdType;
    label: string;
    format: string;
  }[];
  description: string;
}

interface Props {
  selectedLevel: CEFRLevel;
  selectedTask: TaskType;
  selectedTaskId: TaskIdType;
  onLevelChange: (level: CEFRLevel) => void;
  onTaskChange: (task: TaskType) => void;
  onTaskIdSelect: (taskId: TaskIdType) => void;
  onNext: () => void;
}

const getSkillIcon = (skill: string): string => {
  switch (skill.toLowerCase()) {
    case 'listening':
      return '🎧';
    case 'reading':
      return '📖';
    case 'grammar':
      return '📝';
    case 'writing':
      return '✍️';
    case 'speaking':
      return '💬';
    default:
      return '📋';
  }
};

const formatLabel = (value: string): string => {
  if (!value) return '';

  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getLevelBadge = (levelTitle: string): string => {
  return levelTitle ? formatLabel(levelTitle) : 'Available';
};

const getTaskDescription = (skill: string, subtaskCount: number): string => {
  const skillLabel = formatLabel(skill);
  return `${skillLabel} practice with ${subtaskCount} task${subtaskCount > 1 ? 's' : ''}`;
};

const mapLevelsToOptions = (levels: PromptStructureLevel[] = []): LevelOption[] => {
  return levels.map((level) => ({
    name: level.level_id,
    badge: getLevelBadge(level.level_title),
    disabled: false,
    value: level.level_id as CEFRLevel,
  }));
};

const mapPractisesToTaskOptions = (level?: PromptStructureLevel): TaskOption[] => {
  if (!level) return [];

  return level.practises.map((practise) => ({
    value: practise.skill as TaskType,
    icon: getSkillIcon(practise.skill),
    name: formatLabel(practise.skill),
    description: getTaskDescription(practise.skill, practise.tasks.length),
    subtasks: practise.tasks.map((task) => ({
      id: task.tasks_id as TaskIdType,
      label: task.topic,
      format: task.schema,
    })),
  }));
};

export default function LevelTaskSelection({
  selectedLevel,
  selectedTask,
  selectedTaskId,
  onLevelChange,
  onTaskChange,
  onTaskIdSelect,
  onNext,
}: Props): JSX.Element {
  const [showValidation, setShowValidation] = useState(false);

  const { data, isLoading, isError } = useGetAIPromptStructureQuery();

  const levelOptions = useMemo(
    () => mapLevelsToOptions(data?.data ?? []),
    [data]
  );

  const selectedLevelData = useMemo(
    () => data?.data?.find((level) => level.level_id === selectedLevel),
    [data, selectedLevel]
  );

  const availableTasks = useMemo(
    () => mapPractisesToTaskOptions(selectedLevelData),
    [selectedLevelData]
  );

  const canProceed = Boolean(selectedTask && selectedTaskId);

  const handleNext = () => {
    if (!canProceed) {
      setShowValidation(true);
      return;
    }
    onNext();
  };

  const handleLevelChange = (level: CEFRLevel) => {
    onLevelChange(level);
    onTaskChange(null as unknown as TaskType);
    onTaskIdSelect(null as unknown as TaskIdType);
    setShowValidation(false);
  };

  const handleTaskSelect = (task: TaskType) => {
    onTaskChange(task);
    setShowValidation(false);

    const taskOption = availableTasks.find((t) => t.value === task);

    if (taskOption && taskOption.subtasks.length === 1) {
      onTaskIdSelect(taskOption.subtasks[0].id);
    } else {
      onTaskIdSelect(null as unknown as TaskIdType);
    }
  };

  const handleSubtaskSelect = (
    e: React.MouseEvent<HTMLButtonElement>,
    subtaskId: TaskIdType,
  ) => {
    e.stopPropagation();
    onTaskIdSelect(subtaskId);
  };

  const getTaskIdDisplay = (task: TaskOption): string => {
    return task.subtasks.map((s) => s.id).join(' / ');
  };

  const isSubtaskOfCurrentTask = (
    subtaskId: TaskIdType,
    task: TaskOption,
  ): boolean => {
    return task.subtasks.some((s) => s.id === subtaskId);
  };

  return (
    <div>
      <Card
        title="CEFR Level & Task Type"
        description="Select the proficiency level and task type for this lesson"
        status={selectedTask && selectedTaskId ? 'completed' : 'required'}
      >
        {/* Level Grid */}
        <div className="mb-6">
          <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span>🎯</span>
            <span>Proficiency Level</span>
          </h3>

          {isLoading ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Loading levels...
            </div>
          ) : isError ? (
            <div className="text-sm text-red-500 dark:text-red-400">
              Failed to load levels.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {levelOptions.map((level) => {
                const isActive = level.value === selectedLevel;
                const isDisabled = level.disabled;

                return (
                  <button
                    key={level.name}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => level.value && handleLevelChange(level.value)}
                    className={[
                      'border-2 rounded-xl py-5 px-4 text-center transition-all duration-200',
                      isDisabled
                        ? 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                        : isActive
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:-translate-y-0.5 cursor-pointer',
                    ].join(' ')}
                  >
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {level.name}
                    </div>
                    <span
                      className={[
                        'inline-block text-[11px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide text-white',
                        isDisabled ? 'bg-gray-300 dark:bg-gray-500' : 'bg-amber-500',
                      ].join(' ')}
                    >
                      {level.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Task Selection */}
        <div className="p-6 bg-gray-100 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
          <div className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span>📋</span>
            <span>Select Task Type</span>
            <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">
              ({selectedLevel} Track)
            </span>
          </div>

          {isLoading ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Loading task types...
            </div>
          ) : isError ? (
            <div className="text-sm text-red-500 dark:text-red-400">
              Failed to load task types.
            </div>
          ) : availableTasks.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              No tasks available for the selected level.
            </div>
          ) : (
            <div className="grid gap-3">
              {availableTasks.map((task) => {
                const hasSubtasks = task.subtasks.length > 1;
                const isActive = selectedTask === task.value;

                return (
                  <div
                    key={task.value}
                    onClick={() => handleTaskSelect(task.value)}
                    className={[
                      'border-2 rounded-lg p-4 text-left transition-all duration-200 w-full cursor-pointer',
                      isActive
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
                        {task.icon} {task.name}
                      </span>

                      {typeof selectedTaskId === 'string' &&
                      isSubtaskOfCurrentTask(selectedTaskId, task) ? (
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-300 font-mono">
                          {selectedTaskId}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 font-mono">
                          {getTaskIdDisplay(task)}
                        </span>
                      )}
                    </div>

                    <div className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
                      {task.description}
                    </div>

                    {isActive && hasSubtasks && (
                      <div className="mt-3 py-2 pl-4 border-l-[3px] border-blue-500 dark:border-blue-400">
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-400 block mb-2">
                          Select specific type:
                        </span>

                        <div className="flex flex-wrap gap-2">
                          {task.subtasks.map((subtask) => {
                            const isSubtaskActive = selectedTaskId === subtask.id;

                            return (
                              <button
                                key={subtask.id}
                                type="button"
                                onClick={(e) => handleSubtaskSelect(e, subtask.id)}
                                className={[
                                  'px-4 py-2 text-xs font-medium rounded-lg border transition-all flex flex-col items-start',
                                  isSubtaskActive
                                    ? 'border-blue-500 bg-blue-500 dark:bg-blue-600 text-white'
                                    : 'border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-400',
                                ].join(' ')}
                              >
                                <span className="font-bold">
                                  {subtask.id}: {subtask.label}
                                </span>
                                <span
                                  className={[
                                    'text-[10px] mt-0.5',
                                    isSubtaskActive
                                      ? 'text-blue-100'
                                      : 'text-gray-400 dark:text-gray-500',
                                  ].join(' ')}
                                >
                                  {subtask.format}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {isActive && !hasSubtasks && task.subtasks[0] && (
                      <div className="mt-3 py-2 pl-4 border-l-[3px] border-blue-500 dark:border-blue-400">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {task.subtasks[0].id}
                          </span>
                          {' · '}
                          {task.subtasks[0].format}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <StepNavigation
          currentStep={1}
          totalSteps={5}
          canGoNext={true}
          onBack={() => {}}
          onNext={handleNext}
          showValidation={showValidation && !canProceed}
          validationMessage="Please select a task type and specific task to continue"
        />
      </Card>
    </div>
  );
}
// import React, { useState } from 'react';
// import { CEFRLevel, TaskType, TaskIdType } from './types';
// import Card from './Card';
// import StepNavigation from './StepNavigation';
// import type { JSX } from 'react';
// import { useGetAIPromptStructureQuery, PromptStructureLevel, AIPromptStructureResponse } from '@/redux/features/aiApi/aiApi';




// // interface LevelOption {
// //   name: string;
// //   badge: string;
// //   disabled: boolean;
// //   value?: CEFRLevel;
// // }

// // interface TaskOption {
// //   value: TaskType;
// //   icon: string;
// //   name: string;
// //   subtasks: {
// //     id: TaskIdType;
// //     label: string;
// //     format: string;
// //   }[];
// //   description: string;
// // }

// interface LevelOption {
//   name: string;
//   badge: string;
//   disabled: boolean;
//   value?: CEFRLevel;
// }

// interface TaskOption {
//   value: TaskType;
//   icon: string;
//   name: string;
//   subtasks: {
//     id: TaskIdType;
//     label: string;
//     format: string;
//   }[];
//   description: string;
// }

// const getSkillIcon = (skill: string): string => {
//   switch (skill.toLowerCase()) {
//     case 'listening':
//       return '🎧';
//     case 'reading':
//       return '📖';
//     case 'grammar':
//       return '📝';
//     case 'writing':
//       return '✍️';
//     case 'speaking':
//       return '💬';
//     default:
//       return '📋';
//   }
// };

// interface Props {
//   selectedLevel: CEFRLevel;
//   selectedTask: TaskType;
//   selectedTaskId: TaskIdType;
//   onLevelChange: (level: CEFRLevel) => void;
//   onTaskChange: (task: TaskType) => void;
//   onTaskIdSelect: (taskId: TaskIdType) => void;
//   onNext: () => void;
// }

// const LEVEL_OPTIONS: LevelOption[] = [
//   { name: 'A1', badge: 'Coming Soon', disabled: true },
//   { name: 'A2', badge: 'Coming Soon', disabled: true },
//   { name: 'B1c', badge: 'Citizenship', disabled: false, value: 'B1c' },
//   { name: 'B1', badge: 'Standard', disabled: false, value: 'B1' },
//   { name: 'B2', badge: 'Coming Soon', disabled: true },
//   { name: 'C1', badge: 'Coming Soon', disabled: true },
//   { name: 'C2', badge: 'Coming Soon', disabled: true },
// ];

// // Task configurations for B1 Standard
// const B1_TASKS: TaskOption[] = [
//   {
//     value: 'listening',
//     icon: '🎧',
//     name: 'Listening',
//     description: 'Audio comprehension exercises with multiple choice and matching questions',
//     subtasks: [
//       { id: 'L-01', label: 'Short Interactions', format: 'MCQ | 6 questions | 3 options' },
//       { id: 'L-02', label: 'Public Info', format: 'MCQ | 5 questions | 4 options' },
//       { id: 'L-03', label: 'Matching', format: 'Matching | 5 items' },
//     ],
//   },
//   {
//     value: 'reading',
//     icon: '📖',
//     name: 'Reading',
//     description: 'Text comprehension with multiple choice, matching, and true/false activities',
//     subtasks: [
//       { id: 'R-01', label: 'Comprehension', format: 'MCQ | 6 questions | 4 options' },
//       { id: 'R-02', label: 'Heading Match', format: 'Matching | 5 headings' },
//       { id: 'R-03', label: 'True/False', format: 'TrueFalse | 5 statements' },
//     ],
//   },
//   {
//     value: 'grammar',
//     icon: '📝',
//     name: 'Grammar',
//     description: 'Grammar exercises including MCQ, gap fill, transformation, and error recognition',
//     subtasks: [
//       { id: 'G-01', label: 'Multiple Choice', format: 'MCQ | 8 questions | 4 options' },
//       { id: 'G-02', label: 'Gap Fill', format: 'GapFill | 8 items' },
//       { id: 'G-03', label: 'Transformation', format: 'Transformation | 6 items' },
//       { id: 'G-04', label: 'Error Recognition', format: 'ErrorRecognition | 8 items' },
//     ],
//   },
//   {
//     value: 'writing',
//     icon: '✍️',
//     name: 'Writing',
//     description: 'Functional email or narrative writing tasks',
//     subtasks: [
//       { id: 'W-01', label: 'Formal Writing', format: 'Writing | 120–150 words' },
//       { id: 'W-02', label: 'Informal Writing', format: 'Writing | 100–120 words' },
//     ],
//   },
//   {
//     value: 'speaking',
//     icon: '💬',
//     name: 'Speaking',
//     description: 'Dialogue transactions and monologue presentations',
//     subtasks: [
//       { id: 'S-01', label: 'Transaction', format: 'Speaking | 90 seconds' },
//       { id: 'S-02', label: 'Image Description', format: 'Speaking | 90 seconds | Image-based' },
//     ],
//   },
// ];

// // Task configurations for B1c Citizenship
// const B1C_TASKS: TaskOption[] = [
//   {
//     value: 'listening',
//     icon: '🎧',
//     name: 'Listening',
//     description: 'Audio comprehension exercises with multiple choice questions',
//     subtasks: [
//       { id: 'L-01', label: 'Short Interactions', format: 'MCQ | 6 questions | 3 options' },
//       { id: 'L-02', label: 'Public Info', format: 'MCQ | 5 questions | 3 options' },
//     ],
//   },
//   {
//     value: 'reading',
//     icon: '📖',
//     name: 'Reading',
//     description: 'Text comprehension with multiple choice and matching activities',
//     subtasks: [
//       { id: 'R-01', label: 'Comprehension', format: 'MCQ | 6 questions | 3 options' },
//       { id: 'R-02', label: 'Information Match', format: 'Matching | 5 items' },
//     ],
//   },
//   {
//     value: 'writing',
//     icon: '✍️',
//     name: 'Writing',
//     description: 'Functional email or narrative writing (100-120 words)',
//     subtasks: [
//       { id: 'W-01', label: 'Functional Writing', format: 'Writing | 100–120 words' },
//     ],
//   },
//   {
//     value: 'speaking',
//     icon: '💬',
//     name: 'Speaking',
//     description: 'Dialogue transactions and presentations',
//     subtasks: [
//       { id: 'S-01', label: 'Transaction', format: 'Speaking | 90 seconds' },
//     ],
//   },
// ];

// // Helper to get tasks based on level
// const getTasksForLevel = (level: CEFRLevel): TaskOption[] => {
//   switch (level) {
//     case 'B1':
//       return B1_TASKS;
//     case 'B1c':
//       return B1C_TASKS;
//     default:
//       return B1_TASKS;
//   }
// };

// export default function LevelTaskSelection({
//   selectedLevel,
//   selectedTask,
//   selectedTaskId,
//   onLevelChange,
//   onTaskChange,
//   onTaskIdSelect,
//   onNext,
// }: Props): JSX.Element {
//   const [showValidation, setShowValidation] = useState(false);
//   const canProceed = selectedTask !== null && selectedTaskId !== null;

//   // Get available tasks for current level
//   const availableTasks = getTasksForLevel(selectedLevel);

//   const { data, isLoading, isError }  = useGetAIPromptStructureQuery()

//   console.log(data)
//   const handleNext = () => {
//     if (!canProceed) {
//       setShowValidation(true);
//       return;
//     }
//     onNext();
//   };

//   const handleLevelChange = (level: CEFRLevel) => {
//     onLevelChange(level);
//     // Reset task selection when level changes since available tasks differ
//     onTaskChange(null as unknown as TaskType);
//     onTaskIdSelect(null as unknown as TaskIdType);
//     setShowValidation(false);
//   };

//   const handleTaskSelect = (task: TaskType) => {
//     onTaskChange(task);
//     setShowValidation(false);
    
//     // Auto-select first subtask if only one exists
//     const taskOption = availableTasks.find(t => t.value === task);
//     if (taskOption && taskOption.subtasks.length === 1) {
//       onTaskIdSelect(taskOption.subtasks[0].id);
//     } else {
//       // Reset subtask selection when task changes
//       onTaskIdSelect(null as unknown as TaskIdType);
//     }
//   };

//   const handleSubtaskSelect = (
//     e: React.MouseEvent<HTMLButtonElement>,
//     subtaskId: TaskIdType,
//   ) => {
//     e.stopPropagation();
//     onTaskIdSelect(subtaskId);
//   };

//   // Get display string for task IDs
//   const getTaskIdDisplay = (task: TaskOption): string => {
//     return task.subtasks.map(s => s.id).join(' / ');
//   };

//   // Check if a subtask belongs to the current task
//   const isSubtaskOfCurrentTask = (subtaskId: TaskIdType, task: TaskOption): boolean => {
//     return task.subtasks.some(s => s.id === subtaskId);
//   };

//   return (
//     <div>
//       <Card
//         title="CEFR Level & Task Type"
//         description="Select the proficiency level and task type for this lesson"
//         status={selectedTask && selectedTaskId ? 'completed' : 'required'}
//       >
//         {/* ── Level Grid ─────────────────────────────────── */}
//         <div className="mb-6">
//           <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
//             <span>🎯</span>
//             <span>Proficiency Level</span>
//           </h3>

//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//             {LEVEL_OPTIONS.map((level) => {
//               const isActive = level.value === selectedLevel;
//               const isDisabled = level.disabled;

//               return (
//                 <button
//                   key={level.name}
//                   type="button"
//                   disabled={isDisabled}
//                   onClick={() => level.value && handleLevelChange(level.value)}
//                   className={[
//                     'border-2 rounded-xl py-5 px-4 text-center transition-all duration-200',
//                     isDisabled
//                       ? 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
//                       : isActive
//                         ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
//                         : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:-translate-y-0.5 cursor-pointer',
//                   ].join(' ')}
//                 >
//                   <div className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
//                     {level.name}
//                   </div>
//                   <span
//                     className={[
//                       'inline-block text-[11px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide text-white',
//                       isDisabled ? 'bg-gray-300 dark:bg-gray-500' : 'bg-amber-500',
//                     ].join(' ')}
//                   >
//                     {level.badge}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* ── Task Selection ─────────────────────────────── */}
//         <div className="p-6 bg-gray-100 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
//           <div className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
//             <span>📋</span>
//             <span>Select Task Type</span>
//             <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">
//               ({selectedLevel} Track)
//             </span>
//           </div>

//           <div className="grid gap-3">
//             {availableTasks.map((task) => {
//               const hasSubtasks = task.subtasks.length > 1;
//               const isActive = selectedTask === task.value;
              
//               return (
//                 <div
//                   key={task.value}
//                   onClick={() => handleTaskSelect(task.value)}
//                   className={[
//                     'border-2 rounded-lg p-4 text-left transition-all duration-200 w-full cursor-pointer',
//                     isActive
//                       ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
//                       : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20',
//                   ].join(' ')}
//                 >
//                   {/* Task header */}
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
//                       {task.icon} {task.name}
//                     </span>
//                     {
//                       typeof selectedTaskId === 'string' && isSubtaskOfCurrentTask(selectedTaskId, task)
//                         ? <span className="text-xs font-bold text-blue-700 dark:text-blue-300 font-mono">{selectedTaskId}</span>
//                         : <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 font-mono">{getTaskIdDisplay(task)}</span>
//                     }
//                   </div>

//                   {/* Description */}
//                   <div className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
//                     {task.description}
//                   </div>

//                   {/* Subtask selector (only when active + multiple subtasks) */}
//                   {isActive && hasSubtasks && (
//                     <div className="mt-3 py-2 pl-4 border-l-[3px] border-blue-500 dark:border-blue-400">
//                       <span className="text-xs font-semibold text-gray-800 dark:text-gray-400 block mb-2">
//                         Select specific type:
//                       </span>
//                       <div className="flex flex-wrap gap-2">
//                         {task.subtasks.map((subtask) => {
//                           const isSubtaskActive = selectedTaskId === subtask.id;
//                           return (
//                             <button
//                               key={subtask.id}
//                               type="button"
//                               onClick={(e) => handleSubtaskSelect(e, subtask.id)}
//                               className={[
//                                 'px-4 py-2 text-xs font-medium rounded-lg border transition-all flex flex-col items-start',
//                                 isSubtaskActive
//                                   ? 'border-blue-500 bg-blue-500 dark:bg-blue-600 text-white'
//                                   : 'border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-400',
//                               ].join(' ')}
//                             >
//                               <span className="font-bold">{subtask.id}: {subtask.label}</span>
//                               <span className={[
//                                 'text-[10px] mt-0.5',
//                                 isSubtaskActive ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'
//                               ].join(' ')}>
//                                 {subtask.format}
//                               </span>
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}

//                   {/* Show format info for single subtask when active */}
//                   {isActive && !hasSubtasks && (
//                     <div className="mt-3 py-2 pl-4 border-l-[3px] border-blue-500 dark:border-blue-400">
//                       <span className="text-xs text-gray-500 dark:text-gray-400">
//                         <span className="font-semibold text-gray-700 dark:text-gray-300">{task.subtasks[0].id}</span>
//                         {' · '}{task.subtasks[0].format}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <StepNavigation
//           currentStep={1}
//           totalSteps={7}
//           canGoNext={true}
//           onBack={() => {}}
//           onNext={handleNext}
//           showValidation={showValidation && !canProceed}
//           validationMessage="Please select a task type and specific task to continue"
//         />
//       </Card>
//     </div>
//   );
// }

// // Export for use in other components if needed
// export { B1_TASKS, B1C_TASKS, getTasksForLevel };