import { ChevronLeft, RefreshCw, Brain, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header/Header";
import type { JSX } from "react";

// Hook & Utils 
import usePerformanceData from "./hooks/usePerformanceData";
import { getScoreInfo, getColors } from "./utils/scoreUtils";

// Components
import Loading from "./Loading";
import HeroSection from "./components/HeroSection";
import StatsGrid from "./components/StatsGrid";
import AIFeedbackCard from "./components/AIFeedbackCard";
import AnswerReviewSection from "./components/AnswerReviewSection";
import TipsSection from "./components/TipsSection";
import WhatsNextSection from "./components/WhatsNextSection";

export default function UserPerformance(): JSX.Element {
  const navigate = useNavigate();
  
  // =================== DATA FROM HOOK ===================
  const { isLoading,
          isError,
          errorData,
          data,
          normalizedData,
          percentage,
          totalQuestions,
          correctCount,
          tips,
          answerReviewData,
          config } = usePerformanceData();

  // =================== DERIVED VALUES ===================
  const scoreInfo = getScoreInfo(percentage);
  const colors = getColors(percentage);
  const isSaving = false;

  const handleSave = () => {
    console.log("Saving results and navigating to new lesson...");
    navigate("/user/practice/reading");
  };

  // =================== LOADING / ERROR STATES ===================
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold">Error loading lesson data</p>
          <pre className="mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded text-left overflow-auto max-w-lg">
            {JSON.stringify(errorData, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  if (isLoading) return <Loading />;

  // =================== RENDER ===================
  return (
    <div className={`min-h-screen dark:bg-gray-900 dark:text-gray-200 text-gray-900 transition-colors duration-300`}>
      <div className="mx-auto px-6 py-4">
        <button 
          onClick={() => navigate(config.backLink)} 
          className="flex border dark:border-gray-700 p-3 cursor-pointer rounded-2xl items-center gap-2 mb-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="font-semibold">Back To Practice</span>
        </button>
        <Header title={config.title} subtitle={config.subtitle} /> 
      </div>

      <div className="mx-auto px-6 py-8 ">
        <div className="flex flex-col xl:flex-row gap-8">
          <div className="w-full">
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
                  {/* Hero Section */}
                  <HeroSection 
                    percentage={percentage}
                    scoreInfo={scoreInfo}
                    colors={colors}
                    scoreValue={normalizedData?.score?.value || "0 / 0"}
                    title={`${config.title} Complete!`}
                  />

                  <div className="px-6 md:px-8 pb-8">
                    {/* AI Evaluation Badge */}
                    {data && (
                      <div className="flex justify-center mb-6">
                        <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                          data 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        }`}>
                          <Brain className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {data ? 'AI Evaluation Complete' : 'Calculating...'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Stats Grid */}
                    <StatsGrid 
                      cefrOverall={normalizedData?.cefr_profile?.details?.overall || "N/A"}
                      correctCount={correctCount}
                      totalQuestions={totalQuestions}
                    />

                    {/* AI Feedback Card */}
                    {normalizedData && <AIFeedbackCard normalizedData={normalizedData} />}

                    {/* Answer Review */}
                    <AnswerReviewSection answerReviewData={answerReviewData} />

                    {/* Tips */}
                    <TipsSection tips={tips} />

                    {/* Try New Lesson Button */}
                    <div className="flex justify-center mt-8 mb-8">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            Try New Lesson
                            <RefreshCw className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* What's Next */}
                <WhatsNextSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}