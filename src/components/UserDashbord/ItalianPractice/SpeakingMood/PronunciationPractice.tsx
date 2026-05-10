import React from 'react';
import { Mic, MicOff, Volume2, CheckCircle, Loader2 } from 'lucide-react';
// import { PronunciationPracticeProps } from './types';

 export const PronunciationPractice: React.FC<any> = ({
  phrase,
  isRecording,
  isProcessing,
  recordingTime,
  recordingScore,
  onMicClick,
  onContinue,
  onTryAgain,
  isLastPhrase = false,
  formatTime
}) => {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pronunciation Practice
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Speak the phrase clearly and match the pronunciation
        </p>
      </div>

      <div className="space-y-8">
        {/* Italian Phrase */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Listen & Repeat
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
            {phrase.phrase}
          </h3>
          <p className="text-center text-gray-600 dark:text-gray-300 text-lg font-mono">
            {phrase.phonetic}
          </p>
        </div>

        {/* Translation */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-700 dark:text-gray-300">
            <span className="font-medium">English:</span> {phrase.translation}
          </p>
        </div>

        {/* Recording Section */}
        <div className="text-center">
          <div className="mb-8">
            <button
              onClick={onMicClick}
              // REMOVED disabled={isRecording} - Let user click to stop!
              className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 border-4 border-red-300 dark:border-red-700 animate-pulse'
                  : isProcessing
                  ? 'bg-gray-400 border-4 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 border-4 border-blue-300 dark:border-blue-700'
              }`}
            >
              {isProcessing ? (
                <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-white animate-spin" />
              ) : isRecording ? (
                <>
                  <MicOff className="w-12 h-12 md:w-16 md:h-16 text-white" />
                  <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-60"></div>
                </>
              ) : (
                <Mic className="w-12 h-12 md:w-16 md:h-16 text-white" />
              )}
            </button>
            
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {isProcessing 
                ? 'Processing your pronunciation...' 
                : isRecording 
                ? `Recording... ${formatTime ? formatTime(recordingTime) : '00:00'} - Click to STOP`
                : recordingScore !== null 
                ? 'Recording complete! Score: ' + recordingScore + '%'
                : 'Click microphone to START recording'}
            </p>
          </div>

          {/* Score Display */}
          {recordingScore !== null && (
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center justify-center gap-2 mb-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  Pronunciation Score: {recordingScore}%
                </span>
              </div>
              
               <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000"
                  style={{ width: `${recordingScore}%` }}
                ></div>
              </div>
              
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                {recordingScore >= 90 ? 'Excellent pronunciation! 🎉' :
                 recordingScore >= 75 ? 'Good job! Keep practicing.' :
                 recordingScore >= 60 ? 'Not bad. Try again for better accuracy.' :
                 'Needs more practice. Focus on the phonetic guide.'}
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
              Try Again
            </button>
          )}
          
          <button
            onClick={onContinue}
            disabled={isRecording || recordingScore === null || isProcessing}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isRecording || recordingScore === null || isProcessing
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isProcessing ? 'Processing...' :
             isLastPhrase ? 'Complete Exercise' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PronunciationPractice;








 