/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

import Header from '@/components/Header/Header';
import ExerciseHeader from '../ExerciseHeader';
import lisdteningicon from "../../../../assets/Dashbord/microhead.svg";
import { AudioController } from './components/AudioController';
import { PHASES } from './types';
import type { JSX } from "react";
import ListeningPracticeLoading from './ListeningPracticeLoading';
import useListeningPracticeData from './hooks/useListeningPracticeData';
import ListeningPracticeQuizArea from './ListeningPracticeQuizArea';
// import useAudioPlayer from './hooks/useAudioPlayer'; 

export default function ListeningPractice(): JSX.Element {
  const navigate = useNavigate();
  
  // 1. Data fetching
  const { isLoading: isDataLoading, isError, data: listeningTask } = useListeningPracticeData();
  console.log(listeningTask)

  // 2. Local state

  const [showTips, setShowTips] = useState(false);



  // Derived state
  const questions = listeningTask?.questions || [];
  // const instructions = listeningTask?.instructions || "";

  // Early returns MUST come after ALL hooks
  if (isDataLoading) {
    return <ListeningPracticeLoading />;
  }

  if (isError || !listeningTask || questions.length === 0) {
    return renderErrorState(isError, navigate);
  }


  function backToPractice() {
    navigate("/user/practice");
  }

  const handleToggleTips = () => {
    setShowTips(prev => !prev);
  };


  return (
    <div className="min-h-screen p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      <div className="mx-auto max-w-7xl">
        {/* Back Button */}
        <button 
          onClick={backToPractice} 
          className="flex border p-3 rounded-2xl items-center gap-2 mb-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="font-semibold">Back To Practice</span>
        </button>

        {/* Header */}
        <Header 
          title="Listening Practice" 
          subtitle="Improve your Italian listening comprehension" 
        />

        {/* Exercise Header */}
        <ExerciseHeader 
          title="Listening Comprehension" 
          icon={lisdteningicon} 
          description="Listen to the audio and answer comprehension questions" 
          showTips={showTips} 
          onToggleTips={handleToggleTips} 
        />

        {/* Audio Controller */}
        <AudioController 
          key={listeningTask?.meta?.taskId || 'audio-controller'}
          phase={PHASES.QUESTIONS}
          showTips={showTips}
        />

        <ListeningPracticeQuizArea instructions={listeningTask?.instructions } questions={listeningTask?.questions} lessonId={listeningTask?.lessonId}  /> 

      </div>
    </div>
  );
}

// Helper function for error state
function renderErrorState(isError: boolean, navigate: any) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      <div className="mx-auto p-6">
        <button 
          onClick={() => navigate("/user/practice")} 
          className="flex border p-3 rounded-2xl items-center gap-2 mb-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" /> 
          <span className="font-semibold">Back To Practice</span>
        </button>
        <div className="rounded-lg p-8 text-center bg-gray-100 dark:bg-gray-800">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">
            {isError ? "Unable to Load Content" : "No Content Available"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {isError ? "Failed to load listening practice content. Please try again." : "No listening exercises available."}
          </p>
          <button 
            onClick={() => navigate("/user/practice")} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors"
          >
            Return to Practice
          </button>
        </div>
      </div>
    </div>
  );
}
