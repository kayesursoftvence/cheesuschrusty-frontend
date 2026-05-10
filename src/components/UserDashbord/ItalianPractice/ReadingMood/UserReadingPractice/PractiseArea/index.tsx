 
import { useNavigate, useLocation } from "react-router-dom";
import ReadingExerciseComplete from "../../ReadingExerciseComplete";
import { useReadingSession } from "../../hooks/useReadingSession";
import PassageDisplay from "./PassageDisplay";
import QuestionDisplay from "./QuestionDisplay";
import { JSX } from "react";

// interface Props {
//                     title?: string;
//                 }

export default function PractiseArea(): JSX.Element {

  const navigate = useNavigate();
  const location = useLocation();
  const stateLessonId = location.state?.lessonId;
  
  const { state, actions } = useReadingSession(stateLessonId);
  
  const { 
    lessonId, 
    // currentQuestionIndex, 
    // selectedAnswer, 
    answers, 
    isComplete, 
    evaluationResult, 
    showTranslation, 
    italianPassage, 
    englishPassage, 
    questions, 
    // readingData, 
    // loading, 
    // error 
  } = state;
  console.log(questions)

  const { 
    // setShowTranslation, 
    // handleAnswerSelect, 
    // handleNext, 
    // handlePrevious, 
    handleRetry 
  } = actions;



  // Derived properties
  // const totalQuestions = questions.length;
  // const currentQuestion = questions[currentQuestionIndex];
  // const progressPercentage = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  const resultAnswers = questions.map((q) => ({
    question: q.question,
    userAnswer: answers[q.id] || "Not answered",
    correctAnswer: q.correctAnswer,
    isCorrect: answers[q.id] === q.correctAnswer,
  }));

  return (
    <div className="mx-auto px-6 py-8 ">
        <div className="flex flex-col xl:flex-row gap-8 ">
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
              <PassageDisplay />
              <QuestionDisplay />
            </>
          )}
        </div>
      </div>
  );
}