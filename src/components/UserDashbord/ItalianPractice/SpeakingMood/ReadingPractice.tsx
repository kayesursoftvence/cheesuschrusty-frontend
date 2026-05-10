/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { Volume2, BookOpen, Mic, MicOff, CheckCircle, Loader2, MessageSquare } from 'lucide-react';
// import { ReadingPracticeProps } from './types';

const ReadingPractice: React.FC<any> = ({
  score,
  title,
  italianText,
  englishTranslation,
  prompt,
  isRecording,
  isProcessing,
  recordingTime,
  recordingScore,
  transcribedText, // Add this
  onMicClick,
  onContinue,
  onTryAgain,
  formatTime
}) => {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reading Aloud Practice
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {prompt || 'Read the Italian text aloud clearly and fluently'}
        </p>
      </div>


    {transcribedText && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
              What You Said
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 italic">
            "{transcribedText}"
          </p>
        </div>
      )}




      <div className="space-y-8">
        {/* Title */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
        </div>

        {/* Italian Text */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Read Aloud
            </span>
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-line">
              {italianText}
            </p>
          </div>
        </div>

        {/* Translation */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              English Translation
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            {englishTranslation}
          </p>
        </div>

        {/* Recording Section */}
        <div className="text-center">
          <div className="mb-8">
            <button
              onClick={onMicClick}
              disabled={isProcessing || (recordingScore !== null && !isRecording)}
              className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
                isRecording
                  ? 'bg-red-100 dark:bg-red-900/30 border-4 border-red-300 dark:border-red-700'
                  : (recordingScore !== null && !isRecording)
                  ? 'bg-gray-100 dark:bg-gray-700 border-4 border-gray-300 dark:border-gray-600'
                  : 'bg-purple-100 dark:bg-purple-900/30 border-4 border-purple-300 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-800/40'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? (
                <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-purple-600 dark:text-purple-400 animate-spin" />
              ) : isRecording ? (
                <div className="animate-pulse">
                  <MicOff className="w-12 h-12 md:w-16 md:h-16 text-red-600 dark:text-red-400" />
                </div>
              ) : (
                <Mic className="w-12 h-12 md:w-16 md:h-16 text-purple-600 dark:text-purple-400" />
              )}
              
              {isRecording && (
                <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-60"></div>
              )}
            </button>
            
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {isProcessing ? 'Processing your reading...' :
               isRecording ? `Recording... ${formatTime ? formatTime(recordingTime) : '00:00'}` :
               recordingScore !== null ? 'Recording complete!' :
               'Click microphone to start reading'}
            </p>
          </div>

          {/* Score Display */}
          {recordingScore !== null && (
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center justify-center gap-2 mb-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  Reading Score: {score}%
                </span>
              </div>
              
              <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-1000"
                  style={{ width: `${recordingScore}%` }}
                ></div>
              </div>
              
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                {recordingScore >= 90 ? 'Excellent reading! Perfect fluency! 🎉' :
                 recordingScore >= 75 ? 'Great job! Good pronunciation.' :
                 recordingScore >= 60 ? 'Good effort. Work on your pacing.' :
                 'Keep practicing. Focus on pronunciation and flow.'}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {recordingScore !== null && (
            <button
              onClick={onTryAgain}
              disabled={isProcessing}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Read Again
            </button>
          )}
          
          <button
            onClick={onContinue}
            disabled={isRecording || recordingScore === null || isProcessing}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isRecording || recordingScore === null || isProcessing
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Complete Exercise'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadingPractice;




 