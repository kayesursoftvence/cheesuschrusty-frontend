/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { Lesson, DeleteConfirmationState, LessonType } from './Type';
import PageLoader from '@/Layout/PageLoader';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface LessonsListViewProps {
  lessons: any;
  paginationMeta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  currentPage: number;
  searchTerm: string;
  selectedTypeFilter: LessonType | '';
  isLoadingLessons: boolean;
  isDeleting: boolean;
  deleteConfirmation: DeleteConfirmationState;
  selectedLesson: Lesson | null;
  isModalOpen: boolean;
  lessonDetails: any;
  isLoadingDetails: boolean;
  onCreateLesson: () => void;
  onViewDetails: (lesson: Lesson) => void;
  onDeleteLesson: (lessonId: string, lessonTitle: string) => void;
  onCloseModal: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onTypeFilterChange: (type: LessonType | '') => void;
  previewQuestionSets?: any[];
  isLoadingPreview?: boolean;
  formatGeneratedContent?: (content: any) => string;
  onUpdateQuestionSet?: (lessonId: string, content: any, prompt?: string) => Promise<void>;
  isSavingQuestionSet?: boolean;
}

const LessonsListView: React.FC<LessonsListViewProps> = ({
  lessons,
  paginationMeta,
  currentPage,
  searchTerm,
  selectedTypeFilter,
  isLoadingLessons,
  isDeleting,
  deleteConfirmation,
  selectedLesson,
  isModalOpen,
  lessonDetails,
  isLoadingDetails,
  onCreateLesson,
  onViewDetails,
  onDeleteLesson,
  onCloseModal,
  onConfirmDelete,
  onCancelDelete,
  onPageChange,
  onSearchChange,
  onTypeFilterChange,
  previewQuestionSets = [],
  isLoadingPreview = false,
  formatGeneratedContent,
  onUpdateQuestionSet,
  isSavingQuestionSet = false
}) => {
  console.log("lessonDetails", lessonDetails);
  // State for edit mode
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState<string>('');



  // Reset edit state when modal closes or preview refreshes
  useEffect(() => {
    if (!isModalOpen) {
      setIsEditing(false);
      setEditedContent('');
    }
  }, [isModalOpen, previewQuestionSets]);

  const handleStartEdit = (currentContent: any) => {
    setIsEditing(true);
    setEditedContent(JSON.stringify(currentContent, null, 2));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent('');
  };

  const handleSaveEdit = async (questionSet: any) => {
    if (!onUpdateQuestionSet || !selectedLesson) return;

    let contentToSave;
    try {
      contentToSave = JSON.parse(editedContent);
    } catch {
      toast.error('Invalid JSON format. Please check your content.');
      return;
    }

    try {
      await onUpdateQuestionSet(
        selectedLesson.id,
        contentToSave,
        questionSet.prompt
      );
      setIsEditing(false);
      setEditedContent('');
    } catch {
      // Error handling is handled in the parent handler
    }
  };

  // Skill specific text colors
  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'READING': return 'text-orange-600 dark:text-orange-400';
      case 'WRITING': return 'text-green-600 dark:text-green-400';
      case 'LISTENING': return 'text-blue-600 dark:text-blue-400';
      case 'SPEAKING': return 'text-purple-600 dark:text-purple-400';
      case 'GRAMMAR': return 'text-pink-600 dark:text-pink-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    onPageChange(1); // Reset to first page on search
  };

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTypeFilterChange(e.target.value as LessonType | '');
    onPageChange(1); // Reset to first page on filter change
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Lessons</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Create and organize your learning lessons</p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search lessons by title..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          <div className="w-full sm:w-48">
            <select
              value={selectedTypeFilter}
              onChange={handleTypeFilterChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="">All Types</option>
              <option value={LessonType.READING}>Reading</option>
              <option value={LessonType.WRITING}>Writing</option>
              <option value={LessonType.LISTENING}>Listening</option>
              <option value={LessonType.SPEAKING}>Speaking</option>
              <option value={LessonType.GRAMMAR}>Grammar</option>
            </select>
          </div>

          <Link to="/admin/content/lessons/create-new-lesson"
            // <button

            onClick={onCreateLesson}
            className="px-6 py-2 cursor-pointer bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium whitespace-nowrap"
          >
            + Create Lesson
            {/* </button> */}

          </Link>
        </div>

        {/* Lessons List */}
        {isLoadingLessons ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading lessons...</div>
        ) : lessons?.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6">
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No lessons found. {searchTerm || selectedTypeFilter ? 'Try adjusting your search or filters.' : 'Click "Create Lesson" to get started.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              {lessons?.map((lesson: any) => {

                console.log(lesson)
                return (<div key={lesson.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 group flex flex-col">
                  {/* Card Header: Status & ID */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${lesson.isPublished ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                        {lesson.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      ID: {lesson.id}
                    </span>
                  </div>

                  {/* Lesson Identifiers */}
                  <div className="mb-4">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-normal mb-1">
                      Skill: <span className={`font-bold uppercase ${getSkillColor(lesson.SKILL)}`}>{lesson.SKILL}</span>
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-normal mb-1 group-hover:text-blue-600 transition-colors">
                      Title: <span className="text-gray-900 dark:text-white text-xl font-medium">{lesson.LESSON_TITLE || lesson.title || 'Untitled Lesson'}</span>
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-normal">
                        Task ID: <span className="text-blue-600 dark:text-blue-400 font-bold">{lesson.TASK_ID || lesson.id}</span>
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-normal">
                        Domain: <span className="text-gray-700 dark:text-gray-200">{lesson.DOMAIN || lesson.domain || 'N/A'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Attributes Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 border border-gray-100 dark:border-gray-600">
                      <p className="text-[12px] text-gray-400   font-normal mb-0.5">Level</p>
                      <p className="text-base font-semibold text-gray-800 dark:text-gray-100  ">{lesson.LEVEL_ID || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 border border-gray-100 dark:border-gray-600">
                      <p className="text-[12px] text-gray-400   font-normal mb-0.5">Provider</p>
                      <p className="text-base font-semibold text-gray-800 dark:text-gray-100">{lesson.provider || lesson.PROVIDER || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 border border-gray-100 dark:border-gray-600">
                      <p className="text-[12px] text-gray-400   font-normal mb-0.5">Target Lang</p>
                      <p className="text-base font-semibold text-gray-800 dark:text-gray-100 truncate">{lesson.TARGET_LANGUAGE || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 border border-gray-100 dark:border-gray-600">
                      <p className="text-[12px] text-gray-400   font-normal mb-0.5">Difficulty</p>
                      <p className="text-base font-semibold text-gray-800 dark:text-gray-100  ">{lesson.DIFFICULTY || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 border border-gray-100 dark:border-gray-600">
                      <p className="text-[12px] text-gray-400   font-normal mb-0.5">Native Lang</p>
                      <p className="text-base font-semibold text-gray-800 dark:text-gray-100 truncate">{lesson.NATIVE_LANGUAGE || 'N/A'}</p>
                    </div>
                    {/* <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 border border-gray-100 dark:border-gray-600">
                      <p className="text-[12px] text-gray-400   font-normal mb-0.5">Time (s)</p>
                      <p className="text-base font-semibold text-gray-800 dark:text-gray-100">{lesson.TASK_TIME || 0}s</p>
                    </div> */}
                    {/* <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 border border-gray-100 dark:border-gray-600">
                      <p className="text-[12px] text-gray-400   font-normal mb-0.5">Test Mode</p>
                      <p className="text-base font-semibold text-gray-800 dark:text-gray-100  ">{lesson.TEST_MODE || 'OFF'}</p>
                    </div> */}
                    {/* <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 border border-gray-100 dark:border-gray-600">
                      <p className="text-[12px] text-gray-400   font-normal mb-0.5">Total Sec</p>
                      <p className="text-base font-semibold text-gray-800 dark:text-gray-100">{lesson.SECTION_TOTAL || 0}</p>
                    </div> */}

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 border border-gray-100 dark:border-gray-600">
                      <p className="text-[12px] text-gray-400   font-normal mb-0.5">Created At</p>
                      <p className="text-base font-bold text-gray-800 dark:text-gray-100">
                        {lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => onViewDetails(lesson)}
                      className="flex-1 px-4 py-2.5 cursor-pointer bg-blue-600 dark:bg-blue-500 text-white text-sm font-bold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                    >
                      <Eye size={18} />
                      View Content
                    </button>
                    <button
                      onClick={() => onDeleteLesson(lesson.id, lesson.TASK_ID || lesson.task_id || 'unnamed')}
                      disabled={isDeleting}
                      className="px-4 py-2.5 cursor-pointer bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>)
              }
              )}
            </div>

            {/* Pagination Controls */}
            {paginationMeta && paginationMeta.totalPages > 1 && (
              <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {((currentPage - 1) * paginationMeta.limit) + 1} to {Math.min(currentPage * paginationMeta.limit, paginationMeta.total)} of {paginationMeta.total} lessons
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(paginationMeta.totalPages, 5) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-2 cursor-pointer rounded-lg transition-colors ${page === currentPage
                          ? 'bg-blue-600 dark:bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === paginationMeta.totalPages}
                    className="px-4 py-2 cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Lesson Details Modal */}
        {isModalOpen && (
          <div className="absolute inset-0 md:mt-16 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-20">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lesson Detail View</h2>
                <button
                  onClick={onCloseModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl leading-none cursor-pointer"
                >
                  ×
                </button>
              </div>

              {isLoadingDetails ? (
                <div className="text-center py-12"><PageLoader /></div>
              ) : lessonDetails ? (
                <div className="space-y-8">
                  {/* Basic Info */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Lesson Information</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 mb-1">Title</div>
                        <div className="text-gray-900 dark:text-white font-bold uppercase truncate" title={lessonDetails.data.LESSON_TITLE || lessonDetails.data.title}>
                          {lessonDetails.data.LESSON_TITLE || lessonDetails.data.title || 'Untitled'}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 mb-1">Task ID</div>
                        <div className="text-gray-900 dark:text-white font-medium">{lessonDetails.data.TASK_ID || lessonDetails.data.task_id || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 mb-1">Domain</div>
                        <div className="text-gray-900 dark:text-white font-medium uppercase">{lessonDetails.data.DOMAIN || lessonDetails.data.domain || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 mb-1">Skill</div>
                        <div className="text-gray-900 dark:text-white font-medium uppercase">{lessonDetails.data.SKILL || lessonDetails.data.skill || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 mb-1">Level</div>
                        <div className="text-gray-900 dark:text-white font-medium uppercase">{lessonDetails.data.LEVEL_ID || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 mb-1">Target Language</div>
                        <div className="text-gray-900 dark:text-white font-medium">{lessonDetails.data.TARGET_LANGUAGE || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 mb-1">Difficulty</div>
                        <div className="text-gray-900 dark:text-white font-medium uppercase">{lessonDetails.data.DIFFICULTY || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 mb-1">Time (s)</div>
                        <div className="text-gray-900 dark:text-white font-medium">{lessonDetails.data.TASK_TIME || 0}s</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 mb-1">Native Language</div>
                        <div className="text-gray-900 dark:text-white font-medium">{lessonDetails.data.NATIVE_LANGUAGE || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 mb-1">Test Mode</div>
                        <div className="text-gray-900 dark:text-white font-medium uppercase">{lessonDetails.data.TEST_MODE || 'OFF'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 mb-1">AI Provider</div>
                        <div className="text-gray-900 dark:text-white font-medium">{lessonDetails.data.provider || lessonDetails.data.PROVIDER || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 mb-1">Created At</div>
                        <div className="text-gray-900 dark:text-white font-medium">
                          {lessonDetails.data.createdAt ? new Date(lessonDetails.data.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Lesson Content</h3>
                    {isLoadingPreview ? (
                      <div className="text-center py-12">
                        <PageLoader />
                        <p className="mt-4 text-gray-500">Loading content...</p>
                      </div>
                    ) : previewQuestionSets.length > 0 ? (
                      <div className="space-y-6">
                        {previewQuestionSets.map((questionSet, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                              <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                Question Set Data
                              </h4>
                              {onUpdateQuestionSet && selectedLesson && (
                                <div className="flex items-center gap-3">
                                  {isEditing ? (
                                    <>
                                      <button
                                        onClick={() => handleSaveEdit(questionSet)}
                                        disabled={isSavingQuestionSet}
                                        className="px-4 py-2 text-sm font-bold bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2 shadow-md shadow-blue-500/20"
                                      >
                                        {isSavingQuestionSet ? (
                                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                        ) : 'Save Changes'}
                                      </button>
                                      <button
                                        onClick={handleCancelEdit}
                                        disabled={isSavingQuestionSet}
                                        className="px-4 py-2 text-sm font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => handleStartEdit(questionSet.content)}
                                      className="px-4 py-2 text-sm font-bold bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-green-500/20"
                                    >
                                      Edit Content
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-100 dark:border-gray-600 p-6 overflow-hidden shadow-inner">
                              {isEditing ? (
                                <textarea
                                  value={editedContent}
                                  onChange={(e) => setEditedContent(e.target.value)}
                                  className="w-full h-[400px] font-mono text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border-none focus:ring-0 outline-none resize-none"
                                  placeholder="Edit JSON content directly..."
                                />
                              ) : (
                                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 dark:text-gray-300 leading-relaxed max-h-[500px] overflow-y-auto">
                                  <code className="block">
                                    {formatGeneratedContent
                                      ? formatGeneratedContent(questionSet.content || questionSet)
                                      : JSON.stringify(questionSet.content || questionSet, null, 2)}
                                  </code>
                                </pre>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                        No content associated with this lesson yet.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-red-600 font-medium">Error loading lesson details.</div>
              )}

              <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
                <button
                  onClick={onCloseModal}
                  className="w-full px-6 py-3 cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmation.isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} className="text-red-600 dark:text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">Delete Lesson?</h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-white">"{deleteConfirmation.lessonTitle}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={onCancelDelete}
                  className="flex-1 cursor-pointer px-6 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-bold transition-all"
                >
                  Keep It
                </button>
                <button
                  onClick={onConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-red-600 dark:bg-red-500 text-white rounded-xl hover:bg-red-700 dark:hover:bg-red-600 cursor-pointer font-bold shadow-lg shadow-red-500/30 transition-all flex items-center justify-center"
                >
                  {isDeleting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : 'Delete Forever'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonsListView;