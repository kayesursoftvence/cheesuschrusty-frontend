import React, {  useState } from "react";
import { Play, RotateCw, ChevronLeft, ChevronRight, Lock, Unlock } from "lucide-react";
import { FlashcardOverviewResponse, UserFlashcardOverview } from "@/redux/features/flashcards/flashcards.types";
import { useGetFlashcardOverviewQuery } from "@/redux/features/flashcards/flashcardsApi";
import { useGetMySubscriptionQuery } from "@/redux/features/subscriptions/subscriptionsApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
 
interface TopicCardProps {
  category: {
    id: number;
    title: string;
    totalCards: number;
    masteredCards: number;
    dueCards: number;
    isActiveSession: boolean;
  };
  onStart: (categoryId: number) => void;
  onResume: (categoryId: number) => void;
  isLocked: boolean;
  isFirstCard: boolean;
}

const TopicCard: React.FC<TopicCardProps> = ({
  category,
  onStart,
  onResume,
  isLocked,
  isFirstCard,
}) => {
  const {
    id: categoryId,
    title: categoryTitle,
    totalCards: total,
    masteredCards: mastered,
    dueCards: due,
    isActiveSession = false,
  } = category;

  const masteryPercent = total > 0 ? Math.round((mastered / total) * 100) : 0;

  // Check if card should be clickable
  const shouldLock = isLocked && !isFirstCard;
  const isDisabled = shouldLock;

  const handleCardClick = () => {
    if (shouldLock) {
      // Show upgrade modal or message
       toast.error("Card is locked. Please upgrade to pro.");
    }
  };

  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    if (!shouldLock) {
      callback();
    }
  };

  const Navigate=useNavigate();
  return (
    <div
      className={`relative transition-transform ${shouldLock ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'} active:scale-[0.98]`}
      onClick={handleCardClick}
    >
      {/* Card content */}
      <div className={`bg-white p-4 sm:p-5 rounded-xl shadow-sm border flex flex-col dark:bg-gray-900 h-full ${
        shouldLock ? 'border-gray-300 dark:border-gray-700 opacity-80' : 'border-gray-200 dark:border-gray-700'
      }`}>
        {/* Lock/Unlock indicator */}
        <div className="absolute top-3 right-3">
          {shouldLock ? (
            <Lock size={16} className="text-gray-400 dark:text-gray-500" />
          ) : (
            <Unlock size={16} className="text-green-500 dark:text-green-400" />
          )}
        </div>

        <h3 className={`text-base sm:text-lg font-bold line-clamp-2 pr-6 ${
          shouldLock ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-200'
        }`}>
          {categoryTitle}
          {isFirstCard && !shouldLock && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
              Free
            </span>
          )}
        </h3>

        <div className="flex justify-between text-xs sm:text-sm mt-3 mb-3 sm:mb-4">
          <p className={shouldLock ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-200'}>
            Total Cards
          </p>
          <span className={`font-semibold ${
            shouldLock ? 'text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'
          }`}>
            {total}
          </span>
        </div>

        <div className="flex justify-between text-xs sm:text-sm mb-2">
          <p className={shouldLock ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-200'}>
            Mastered
          </p>
          <span className={`font-semibold ${
            shouldLock ? 'text-gray-400 dark:text-gray-500' : 'text-green-600 dark:text-gray-200'
          }`}>
            {mastered} ({masteryPercent}%)
          </span>
        </div>

        <div className="flex justify-between text-xs sm:text-sm mb-4">
          <p className={shouldLock ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-200'}>
            Due
          </p>
          <span className={`font-semibold ${
            shouldLock ? 'text-gray-400 dark:text-gray-500' : 'text-red-600 dark:text-gray-200'
          }`}>
            {due}
          </span>
        </div>

        <div className="flex flex-col xs:flex-row gap-2 xs:gap-2 mt-auto pt-2">
          {isActiveSession && (
            <button
              onClick={(e) => handleButtonClick(e, () => onResume(categoryId))}
              disabled={isDisabled}
              className={`flex-1 flex items-center justify-center px-2 xs:px-3 py-2 text-xs xs:text-sm rounded-lg transition-colors ${
                isDisabled
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400 border border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700'
                  : 'cursor-pointer text-indigo-600 border border-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/30'
              }`}
            >
              <RotateCw size={14} className="mr-1 xs:mr-1" />
              <span className="truncate">Resume</span>
            </button>
          )}

          {!isActiveSession && (
            <button
              onClick={(e) => handleButtonClick(e, () => onStart(categoryId))}
              disabled={isDisabled}
              className={`flex-1 flex items-center justify-center px-2 xs:px-3 py-2 text-xs xs:text-sm font-medium rounded-lg transition-colors ${
                isDisabled
                  ? 'cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  : 'cursor-pointer bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
              }`}
            >
              <Play size={14} className="mr-1 xs:mr-1" />
              <span className="truncate">{isDisabled ? 'Locked' : 'Start'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Lock overlay for non-pro users without trial (except first card) */}
      {shouldLock && (
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-[1px] rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700">
          <div className="text-center p-4">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
              <Lock size={20} className="text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">
              Upgrade to unlock
            </p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                 Navigate("/#pricing")
              
              }}
               
              className="mt-2 cursor-pointer px-3 py-1 text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================
// Main Dashboard Component
// ==========================
interface FlashcardDashboardProps {
  overview?: UserFlashcardOverview;
  onStartPractice: (categoryId: number) => void;
  isLoading: boolean;
  onResumePractice: (categoryId: number) => void;
}

export const FlashcardDashboard: React.FC<FlashcardDashboardProps> = ({
  overview,
  onStartPractice,
  onResumePractice,
}) => {
  // Get subscription data
  const { data: subscriptionData } = useGetMySubscriptionQuery();
  const isLifetime = subscriptionData?.data?.planAlias === "PRO_LIFETIME" || subscriptionData?.data?.plan === "PRO_LIFETIME";
  const prodata = subscriptionData?.data.isPro || isLifetime;
  const hasUsedTrial = subscriptionData?.data.hasUsedTrial;

  // Get user role from localStorage
  const userData = localStorage.getItem("userData");
  const { role } = userData ? JSON.parse(userData) : { role: "freeuser" };

  // Determine if user should see locked cards
  // Logic: Lock cards if user is not pro AND hasn't used trial AND is free user
  const shouldLockCards = prodata === false && hasUsedTrial === false && role === "freeuser";
const Navigate=useNavigate();
  const { 
    data: overviewResponse, 
    
  } = useGetFlashcardOverviewQuery();

  const overviews = overviewResponse?.data as FlashcardOverviewResponse;

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const topicsPerPage = 6;

  const categories = overview?.categories || [];
  const totalPages = Math.ceil(categories.length / topicsPerPage);
  const startIndex = (currentPage - 1) * topicsPerPage;
  const endIndex = startIndex + topicsPerPage;
  const currentCategories = categories.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate visible page numbers for pagination
  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="mx-auto p-3 xs:p-4 sm:p-5 lg:p-6">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
          Advance Flashcard
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl">
          Master Italian vocabulary with spaced repetition
        </p>
        
        {/* Show upgrade message for free users without trial */}
        {shouldLockCards && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <Unlock size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-700 dark:text-blue-300">Free Plan Active</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                      First category is free! Upgrade to Pro to unlock all {categories.length} categories.
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => Navigate("/#pricing")}
                className="px-6 cursor-pointer py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-colors text-sm font-medium shadow-md hover:shadow-lg"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        )}

        {/* Show pro badge for pro users */}
        {prodata === true && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Unlock size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-green-700 dark:text-green-300">Pro Account Active</h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  All {categories.length} categories are unlocked! 🎉
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========== Lifetime Stats Section ========== */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Previously completed sessions
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
          Master Italian vocabulary with spaced repetition
        </p>

        <div className="grid grid-cols-2 min-[480px]:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-1">
              {overviews.lifetimeMetrics?.sessionsCompleted || 0}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Number of Sessions Completed</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-1">
              {overviews.lifetimeMetrics?.totalCardsStudied}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total Cards Studied</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
              {overviews.lifetimeMetrics?.averageScorePercentage}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Average Score</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
              {categories.length}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              {shouldLockCards ? 'Categories (1 Free)' : 'Total Categories'}
            </p>
          </div>
        </div>
      </div>

      {/* Resume Session Button */}
      

      {/* ========== Topic Grid ========== */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Flashcard Categories
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Unlocked</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span>Locked</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {currentCategories.map((category, index) => {
            const isFirstCardInPage = index === 0 && currentPage === 1;
            const shouldLock = shouldLockCards && !isFirstCardInPage;
            
            return (
              <TopicCard
                key={category.id}
                category={category}
                onStart={onStartPractice}
                onResume={onResumePractice}
                isLocked={shouldLock}
                isFirstCard={isFirstCardInPage}
              />
            );
          })}
        </div>
      </div>

      {/* ✅ Pagination Controls */}
      {categories.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 text-gray-700 dark:text-gray-300 mb-8 sm:mb-12">
          <div className="text-xs sm:text-sm order-2 sm:order-1">
            <p>
              Showing {startIndex + 1}-{Math.min(endIndex, categories.length)} of {categories.length} categories
              {shouldLockCards && (
                <span className="text-blue-600 dark:text-blue-400 font-medium ml-2">
                  ({categories.length - 1} locked for free users)
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`sm:hidden p-2 cursor-pointer rounded-lg border ${
                currentPage === 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-blue-600 border-blue-300 hover:bg-blue-50"
              }`}
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`hidden sm:flex cursor-pointer items-center px-4 py-2 rounded-lg border text-sm ${
                currentPage === 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-blue-600 border-blue-300 hover:bg-blue-50"
              }`}
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>

            <div className="hidden xs:flex items-center gap-1 sm:gap-2">
              {getVisiblePages().map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 sm:w-10 cursor-pointer sm:h-10 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <span className="xs:hidden text-sm font-medium text-center">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`sm:hidden cursor-pointer p-2 rounded-lg border ${
                currentPage === totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-blue-600 border-blue-300 hover:bg-blue-50"
              }`}
            >
              <ChevronRight size={16} />
            </button>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`hidden sm:flex cursor-pointer items-center px-4 py-2 rounded-lg border text-sm ${
                currentPage === totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-blue-600 border-blue-300 hover:bg-blue-50"
              }`}
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Upgrade reminder at bottom */}
      {shouldLockCards && categories.length > 1 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">🚀 Unlock All {categories.length} Categories</h3>
              <p className="text-indigo-100">
                Upgrade to Pro and get access to all flashcard categories, advanced statistics, 
                and priority support. Start your free trial today!
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => Navigate("/#pricing")}
                className="px-6 py-3 cursor-pointer bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
              >
                Start Free Trial
              </button>
              <button 
                onClick={() => Navigate("/#pricing")}
                className="px-6 py-3 cursor-pointer bg-black/20 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-black/30 transition-colors border border-white/30"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};








 