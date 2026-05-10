 
import React, { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
// import ReadingExerciseComplete from "../ReadingExerciseComplete";
import Header from "@/components/Header/Header";
import { useReadingSession } from "../hooks/useReadingSession";
// import { PassageDisplay } from "../components/PassageDisplay";
// import { QuestionDisplay } from "../components/QuestionDisplay";
import PractiseArea from "./PractiseArea";

const UserPractice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateLessonId = location.state?.lessonId;
  
  // Theme state
  const [darkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const { state, actions } = useReadingSession(stateLessonId);

  console.log(state, actions)
  
  const { 
    // lessonId, 
    // currentQuestionIndex, 
    // selectedAnswer, 
    // answers, 
    isComplete, 
    // evaluationResult, 
    // showTranslation, 
    italianPassage, 
    // englishPassage, 
    questions, 
    // readingData, 
    loading, 
    error 
  } = state;
  console.log(questions)

  const { 
    // setShowTranslation, 
    // handleAnswerSelect, 
    // handleNext, 
    // handlePrevious, 
    handleRetry 
  } = actions;

  // Save theme to localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Loading state
  if (loading && !isComplete) {
    return (
      <div className={`min-h-screen flex items-center justify-center dark:bg-gray-900 ${darkMode ? "" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading content...</p>
        </div>
      </div>
    );
  }

  // Error or empty state
  if (error || (!loading && (!italianPassage && questions.length === 0))) {
     return (
      <div className={` min-h-screen dark:bg-gray-900 dark:text-gray-200 ${darkMode ? "" : "bg-gray-50 text-gray-900"}`}>
        <div className="mx-auto px-6 py-8">
          <button onClick={() => navigate("/user/practice")} className="flex border dark:border-gray-700 p-3 cursor-pointer rounded-2xl items-center gap-2 mb-4">
            <ChevronLeft className="w-6 h-6" />
            <span className="font-semibold">Back To Practice</span>
          </button>
          <div className={`rounded-lg p-8 text-center dark:bg-gray-800 ${darkMode ? "" : "bg-white"}`}>
            <h2 className="text-xl font-semibold mb-4">{error || "Unable to Load Content"}</h2>
            <button onClick={handleRetry} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  // Derived properties
  // const totalQuestions = questions.length;
  // const currentQuestion = questions[currentQuestionIndex];
  // const progressPercentage = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  // const resultAnswers = questions.map((q) => ({
  //   question: q.question,
  //   userAnswer: answers[q.id] || "Not answered",
  //   correctAnswer: q.correctAnswer,
  //   isCorrect: answers[q.id] === q.correctAnswer,
  // }));

  return (
    <div className={`min-h-screen dark:bg-gray-900 dark:text-gray-200 text-gray-900 transition-colors duration-300`}>
      <div className="mx-auto px-6 py-4">
        <button onClick={() => navigate("/user/practice")} className="flex border dark:border-gray-700 p-3 cursor-pointer rounded-2xl items-center gap-2 mb-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6" />
          <span className="font-semibold">Back To Practice</span>
        </button>
        <Header title="Reading Practice" subtitle="Improve your Italian reading comprehension" /> 
      </div>
      <PractiseArea/>

      {/* <div className="mx-auto px-6 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {isComplete ? (
            <div className="w-full">
              <ReadingExerciseComplete 
                lessonId={Number(lessonId) || 0}
                answers={resultAnswers}
                passage={showTranslation ? englishPassage : italianPassage}
                evaluationResult={evaluationResult}
                onRetry={handleRetry}
                onContinue={() => navigate("/user/practice")}
              />
            </div>
          ) : (
            <>
              <PassageDisplay 
                readingData={readingData}
                showTranslation={showTranslation}
                setShowTranslation={setShowTranslation}
                italianPassage={italianPassage}
                englishPassage={englishPassage}
              />

              <QuestionDisplay 
                currentQuestion={currentQuestion}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={totalQuestions}
                progressPercentage={progressPercentage}
                selectedAnswer={selectedAnswer}
                handleAnswerSelect={handleAnswerSelect}
                handleNext={handleNext}
                handlePrevious={handlePrevious}
              />
            </>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default UserPractice;