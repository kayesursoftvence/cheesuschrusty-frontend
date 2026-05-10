/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { 
  User, 
  Mic, 
  MicOff, 
  Loader2, 
  MessageSquare,
  PlayCircle,
  CheckCircle,
  RefreshCw,
  Volume2
} from 'lucide-react';

interface ConversationPracticeProps {
  prompt: string;
  isRecording: boolean;
  isProcessing: boolean;
  recordingTime: number;
  recordingScore: number | null;
  conversationHistory: Array<{
    user: string | null;
    bot: any | null;
    timestamp: string;
    exchangeNumber: number;
  }>;
  conversationStep: number;
  isConversationStarted: boolean;
  isConversationComplete: boolean;
  onMicClick: () => void;
  onContinue: () => void;
  onTryAgain: () => void;
  onStartConversation: () => void;
  formatTime?: (time: number) => string;
 dialogue: Array<{
  english: string;
  italian: string;
  speaker: string;
  phonetic: string;
}>;
}

const ConversationPractice: React.FC<ConversationPracticeProps> = ({
  prompt,
  isRecording,
  isProcessing,
  recordingTime,
  recordingScore,
  conversationHistory,
  conversationStep,
  isConversationStarted,
  isConversationComplete,
  onMicClick,
  onContinue,
  onTryAgain,
  onStartConversation,
  formatTime
}) => {
  // Conversation completed screen
  if (isConversationComplete && recordingScore !== null) {
    return (
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Conversation Complete! 🎉
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Final score: <span className="font-bold text-4xl text-green-600 dark:text-green-400">
            {recordingScore}%
          </span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onTryAgain}
            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <PlayCircle className="w-5 h-5" />
            Continue Practice
          </button>
        </div>
      </div>
    );
  }

  // Start conversation screen
  if (!isConversationStarted) {
    return (
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Conversation Practice
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            {prompt || 'Start a conversation with AI in Italian'}
          </p>
        </div>

        {/* How it works */}
        <div className="mb-10">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-8 rounded-2xl border border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Volume2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              Automatic Conversation Flow
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold text-blue-700 dark:text-blue-300">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Start Conversation</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">AI will begin the conversation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold text-blue-700 dark:text-blue-300">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Speak & Click</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Click mic, speak in Italian, click again</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold text-green-700 dark:text-green-300">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Auto STT</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Voice automatically converted to text</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold text-purple-700 dark:text-purple-300">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Auto AI Response</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Text auto-sent to AI for response</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Start button */}
        <div className="text-center">
          <button
            onClick={onStartConversation}
            disabled={isProcessing}
            className="px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 mx-auto"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-7 h-7 animate-spin" />
                <span>Starting Conversation...</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-7 h-7" />
                <span>Start Conversation</span>
              </>
            )}
          </button>
          <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
            AI will start the conversation in Italian
          </p>
        </div>
      </div>
    );
  }

  // Conversation in progress
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full mb-4">
          <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
          <span className="font-semibold text-blue-700 dark:text-blue-300">
            Conversation in Progress
          </span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Italian Conversation Practice
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Exchange {Math.max(0, conversationStep - 1)} • Speak naturally in Italian
        </p>
      </div>

      {/* Chat History */}
      <div className="mb-10">
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 max-h-[500px] overflow-y-auto">
          {conversationHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                AI is Waiting for Your Response
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Click the microphone below to start speaking
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {conversationHistory.map((exchange, index) => (
                <div key={index} className="space-y-6">
                  
                  {/* USER MESSAGE - RIGHT SIDE */}
                  {exchange.user && (
                    <div className="flex justify-end">
                      <div className="flex items-start max-w-[80%]">
                        <div className="order-2 ml-4">
                          <div className="flex items-center justify-end gap-2 mb-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(exchange.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                            <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                              You
                            </span>
                          </div>
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-5 rounded-2xl rounded-tr-none shadow-lg">
                            <p className="text-lg font-medium">
                              {exchange.user}
                            </p>
                          </div>
                        </div>
                        <div className="order-1 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI MESSAGE - LEFT SIDE */}
                  {exchange.bot && (
                    <div className="flex justify-start">
                      <div className="flex items-start max-w-[80%]">
                        <div className="order-1 mr-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-lg">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="order-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                              AI Partner
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(exchange.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-5 rounded-2xl rounded-tl-none shadow-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                              {exchange.bot.message}
                            </p>
                            
                            {exchange.bot.phonetic && (
                              <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                  Pronunciation Guide:
                                </p>
                                <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                                  {exchange.bot.phonetic}
                                </p>
                              </div>
                            )}
                            
                            <div className="pt-4 border-t border-blue-200 dark:border-blue-700">
                              <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">English Translation:</span> {exchange.bot.translation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recording Section */}
      <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="mb-8">
          <button
            onClick={onMicClick}
            disabled={isProcessing || isConversationComplete}
            className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center mx-auto transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              isRecording
                ? 'bg-gradient-to-r from-red-500 to-red-600 border-4 border-red-300 dark:border-red-700 shadow-2xl animate-pulse'
                : isProcessing
                ? 'bg-gradient-to-r from-gray-400 to-gray-500 border-4 border-gray-300 dark:border-gray-600 cursor-not-allowed shadow-lg'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 border-4 border-blue-300 dark:border-blue-700 shadow-2xl hover:shadow-3xl'
            }`}
          >
            {isProcessing ? (
              <div className="text-center">
                <Loader2 className="w-16 h-16 text-white animate-spin mx-auto" />
                <span className="sr-only">Processing...</span>
              </div>
            ) : isRecording ? (
              <>
                <div className="text-center">
                  <MicOff className="w-16 h-16 text-white mx-auto" />
                  <span className="sr-only">Stop Recording</span>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-40"></div>
                <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping opacity-20 delay-300"></div>
              </>
            ) : (
              <div className="text-center">
                <Mic className="w-16 h-16 text-white mx-auto" />
                <span className="sr-only">Start Recording</span>
              </div>
            )}
          </button>
          
          <div className="mt-6 space-y-2">
            <p className={`text-lg font-medium ${
              isProcessing 
                ? 'text-blue-600 dark:text-blue-400'
                : isRecording
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {isProcessing 
                ? '🔄 Auto-Processing: Speech → Text → AI Response...' 
                : isRecording 
                ? `🔴 Recording... ${formatTime ? formatTime(recordingTime) : '00:00'}`
                : conversationHistory.length === 0
                ? '🎤 Click to start speaking'
                : '🎤 Click to continue conversation'}
            </p>
            
            {isRecording && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Speak clearly in Italian. Will auto-convert to text and get AI response.
              </p>
            )}
            
            {isProcessing && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Converting speech</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Getting AI response</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <button
            onClick={onTryAgain}
            disabled={isProcessing || isRecording}
            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Restart Conversation
          </button>
          
          {conversationHistory.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <span className="font-semibold text-blue-700 dark:text-blue-300">
                  Exchange {Math.max(0, conversationStep - 1)}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {conversationHistory.filter(ex => ex.user).length} responses
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationPractice;








// import React from 'react';
// import { MessageSquare, User, Mic, MicOff, CheckCircle, PlayCircle, Loader2, RefreshCw } from 'lucide-react';
// import { ConversationPracticeProps } from './types';

// const ConversationPractice: React.FC<ConversationPracticeProps> = ({
//   prompt,
//   isRecording,
//   isProcessing,
//   recordingTime,
//   recordingScore,
//   conversationHistory,
//   conversationStep,
//   isConversationStarted,
//   isConversationComplete,
//   onStartConversation,
//   onMicClick,
//   onContinue,
//   onTryAgain,
//   formatTime
// }) => {
//   // If conversation is complete, show score
//   if (isConversationComplete && recordingScore !== null) {
//     return (
//       <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
//         <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
//           <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
//         </div>
        
//         <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//           Conversation Complete! 🎉
//         </h3>
//         <p className="text-gray-600 dark:text-gray-400 mb-6">
//           Final score: <span className="font-bold text-2xl">{recordingScore}%</span>
//         </p>
        
//         <div className="flex gap-3 justify-center">
//           <button
//             onClick={onTryAgain}
//             className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
//           >
//             <RefreshCw className="w-4 h-4" />
//             Try Again
//           </button>
//           <button
//             onClick={onContinue}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
//           >
//             Continue
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Show Start Conversation button if not started
//   if (!isConversationStarted) {
//     return (
//       <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center gap-2 mb-2">
//             <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//               Conversation Practice
//             </h2>
//           </div>
//           <p className="text-gray-600 dark:text-gray-400">
//             {prompt || 'Start a conversation with AI in Italian'}
//           </p>
//         </div>

//         <div className="mb-8">
//           <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
//               How to Start
//             </h3>
//             <ol className="text-gray-700 dark:text-gray-300 space-y-2 pl-5 list-decimal">
//               <li>Click <strong>"Start Conversation"</strong> - AI will begin</li>
//               <li>Click microphone button to record your response</li>
//               <li>Your voice will be converted to text automatically</li>
//               <li>AI will reply, continue the conversation naturally</li>
//             </ol>
//           </div>
//         </div>

//         <div className="text-center">
//           <button
//             onClick={onStartConversation}
//             disabled={isProcessing}
//             className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isProcessing ? (
//               <>
//                 <Loader2 className="w-6 h-6 animate-spin" />
//                 Starting Conversation...
//               </>
//             ) : (
//               <>
//                 <PlayCircle className="w-6 h-6" />
//                 Start Conversation
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Conversation started
//   return (
//     <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
//       <div className="text-center mb-8">
//         <div className="flex items-center justify-center gap-2 mb-2">
//           <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//             {conversationHistory.length === 0 ? 'Ready to Speak' : 'Conversation in Progress'}
//           </h2>
//         </div>
//         <div className="text-sm text-gray-600 dark:text-gray-400">
//           {conversationHistory.length === 0 
//             ? 'Click microphone to start speaking'
//             : `Exchange ${conversationStep - 1} • Speak in Italian`}
//         </div>
//       </div>

//       {/* Conversation History */}
//       {conversationHistory.length > 0 && (
//         <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto p-2">
//           {conversationHistory.map((exchange, index) => (
//             <div key={index} className="space-y-4">
//               {/* User Message (if exists) */}
//               {exchange.user && (
//                 <div className="flex items-start gap-3 ml-8">
//                   <div className="flex-1 text-right">
//                     <div className="font-medium text-green-600 dark:text-green-400 mb-2">
//                       You
//                     </div>
//                     <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
//                       <p className="text-lg text-gray-900 dark:text-white">
//                         {exchange.user}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
//                     <User className="w-5 h-5 text-green-600 dark:text-green-400" />
//                   </div>
//                 </div>
//               )}

//               {/* AI Message */}
//               {exchange.bot && (
//                 <div className="flex items-start gap-3">
//                   <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
//                     <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                   </div>
//                   <div className="flex-1">
//                     <div className="font-medium text-blue-600 dark:text-blue-400 mb-2">
//                       AI Partner
//                     </div>
//                     <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
//                       <p className="text-lg text-gray-900 dark:text-white mb-2">
//                         {exchange.bot.message}
//                       </p>
//                       {exchange.bot.phonetic && (
//                         <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-mono">
//                           {exchange.bot.phonetic}
//                         </p>
//                       )}
//                       <p className="text-sm text-gray-500 dark:text-gray-400 border-t border-blue-100 dark:border-blue-800 pt-2">
//                         <span className="font-medium">English:</span> {exchange.bot.translation}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Recording Section */}
//       <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
//         <div className="mb-6">
//           <button
//             onClick={onMicClick}
//             disabled={isProcessing || isConversationComplete}
//             className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
//               isRecording
//                 ? 'bg-red-500 hover:bg-red-600 border-4 border-red-300 dark:border-red-700 animate-pulse'
//                 : isProcessing
//                 ? 'bg-gray-400 border-4 border-gray-300 dark:border-gray-600 cursor-not-allowed'
//                 : 'bg-blue-500 hover:bg-blue-600 border-4 border-blue-300 dark:border-blue-700'
//             }`}
//           >
//             {isProcessing ? (
//               <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-white animate-spin" />
//             ) : isRecording ? (
//               <>
//                 <MicOff className="w-12 h-12 md:w-16 md:h-16 text-white" />
//                 <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-60"></div>
//               </>
//             ) : (
//               <Mic className="w-12 h-12 md:w-16 md:h-16 text-white" />
//             )}
//           </button>
          
//           <p className="mt-4 text-gray-600 dark:text-gray-400">
//             {isProcessing 
//               ? 'Processing your response...' 
//               : isRecording 
//               ? `Recording... ${formatTime ? formatTime(recordingTime) : '00:00'} - Click to STOP`
//               : conversationHistory.length === 0
//               ? 'Click microphone to start speaking'
//               : 'Click microphone to continue conversation'}
//           </p>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
//           <button
//             onClick={onTryAgain}
//             disabled={isProcessing || isRecording}
//             className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2"
//           >
//             <RefreshCw className="w-4 h-4" />
//             Restart Conversation
//           </button>
          
//           {conversationHistory.length > 0 && (
//             <div className="text-sm text-gray-600 dark:text-gray-400">
//               Exchange {conversationStep - 1}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConversationPractice;








// import React from 'react';
// import { MessageSquare, User, Mic, MicOff, CheckCircle, PlayCircle, Loader2, RefreshCw, Volume2 } from 'lucide-react';
// import { ConversationPracticeProps } from './types';

// const ConversationPractice: React.FC<ConversationPracticeProps> = ({
//   prompt,
//   isRecording,
//   isProcessing,
//   recordingTime,
//   recordingScore,
//   conversationHistory,
//   conversationStep,
//   isConversationStarted,
//   isConversationComplete,
//   showMicAfterStart, // NEW
//   onStartConversation,
//   onMicClick,
//   onContinue,
//   onTryAgain,
//   formatTime
// }) => {
//   // If conversation is complete, show score
//   if (isConversationComplete && recordingScore !== null) {
//     return (
//       <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
//         <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
//           <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
//         </div>
        
//         <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//           Conversation Complete! 🎉
//         </h3>
//         <p className="text-gray-600 dark:text-gray-400 mb-6">
//           Final score: <span className="font-bold text-2xl">{recordingScore}%</span>
//         </p>
        
//         <div className="flex gap-3 justify-center">
//           <button
//             onClick={onTryAgain}
//             className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
//           >
//             <RefreshCw className="w-4 h-4" />
//             Try Again
//           </button>
//           <button
//             onClick={onContinue}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
//           >
//             Continue
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Show Start Conversation button if not started
//   if (!isConversationStarted) {
//     return (
//       <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center gap-2 mb-2">
//             <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//               Conversation Practice
//             </h2>
//           </div>
//           <p className="text-gray-600 dark:text-gray-400">
//             {prompt || 'Start a conversation with AI in Italian'}
//           </p>
//         </div>

//         <div className="mb-8">
//           <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
//               <Volume2 className="w-5 h-5" />
//               Voice Conversation Flow
//             </h3>
//             <ol className="text-gray-700 dark:text-gray-300 space-y-3">
//               <li className="flex items-start gap-2">
//                 <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
//                 <span>Click <strong>"Start Conversation"</strong> button</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
//                 <span>Microphone button will appear - <strong>click to record</strong> your first message</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
//                 <span>Your voice will be converted to text and sent to AI automatically</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">4</span>
//                 <span>AI will respond - continue the conversation naturally</span>
//               </li>
//             </ol>
//           </div>
//         </div>

//         <div className="text-center">
//           <button
//             onClick={onStartConversation}
//             disabled={isProcessing}
//             className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
//           >
//             {isProcessing ? (
//               <>
//                 <Loader2 className="w-6 h-6 animate-spin" />
//                 Starting...
//               </>
//             ) : (
//               <>
//                 <PlayCircle className="w-6 h-6" />
//                 Start Conversation
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Conversation started - Show microphone or conversation history
//   return (
//     <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
//       <div className="text-center mb-8">
//         <div className="flex items-center justify-center gap-2 mb-2">
//           <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//             {conversationHistory.length > 0 ? 'Conversation in Progress' : 'Start Speaking'}
//           </h2>
//         </div>
//         <div className="text-sm text-gray-600 dark:text-gray-400">
//           {conversationHistory.length > 0 
//             ? `Exchange ${conversationStep} • Speak in Italian`
//             : 'Click microphone to begin'}
//         </div>
//       </div>

//       {/* Conversation History */}
//       {conversationHistory.length > 0 && (
//         <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto p-2">
//           {conversationHistory.map((exchange, index) => (
//             <div key={index} className="space-y-4">
//               {/* User Message */}
//               {exchange.user && (
//                 <div className="flex items-start gap-3 ml-8">
//                   <div className="flex-1 text-right">
//                     <div className="font-medium text-green-600 dark:text-green-400 mb-2">
//                       You
//                     </div>
//                     <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
//                       <p className="text-lg text-gray-900 dark:text-white">
//                         {exchange.user}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
//                     <User className="w-5 h-5 text-green-600 dark:text-green-400" />
//                   </div>
//                 </div>
//               )}

//               {/* AI Message */}
//               {exchange.bot && (
//                 <div className="flex items-start gap-3">
//                   <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
//                     <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                   </div>
//                   <div className="flex-1">
//                     <div className="font-medium text-blue-600 dark:text-blue-400 mb-2">
//                       AI Partner
//                     </div>
//                     <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
//                       <p className="text-lg text-gray-900 dark:text-white mb-2">
//                         {exchange.bot.message}
//                       </p>
//                       {exchange.bot.phonetic && (
//                         <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-mono">
//                           {exchange.bot.phonetic}
//                         </p>
//                       )}
//                       <p className="text-sm text-gray-500 dark:text-gray-400 border-t border-blue-100 dark:border-blue-800 pt-2">
//                         <span className="font-medium">English:</span> {exchange.bot.translation}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Recording Section - Always show after Start Conversation */}
//       {(showMicAfterStart || conversationHistory.length > 0) && (
//         <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
//           <div className="mb-6">
//             <button
//               onClick={onMicClick}
//               disabled={isProcessing || isConversationComplete}
//               className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
//                 isRecording
//                   ? 'bg-red-500 hover:bg-red-600 border-4 border-red-300 dark:border-red-700 animate-pulse'
//                   : isProcessing
//                   ? 'bg-gray-400 border-4 border-gray-300 dark:border-gray-600 cursor-not-allowed'
//                   : 'bg-blue-500 hover:bg-blue-600 border-4 border-blue-300 dark:border-blue-700'
//               }`}
//             >
//               {isProcessing ? (
//                 <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-white animate-spin" />
//               ) : isRecording ? (
//                 <>
//                   <MicOff className="w-12 h-12 md:w-16 md:h-16 text-white" />
//                   <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-60"></div>
//                 </>
//               ) : (
//                 <Mic className="w-12 h-12 md:w-16 md:h-16 text-white" />
//               )}
//             </button>
            
//             <p className="mt-4 text-gray-600 dark:text-gray-400">
//               {isProcessing 
//                 ? 'Processing your response...' 
//                 : isRecording 
//                 ? `Recording... ${formatTime ? formatTime(recordingTime) : '00:00'} - Click to STOP`
//                 : conversationHistory.length === 0
//                 ? 'Click microphone to start speaking'
//                 : 'Click microphone to continue conversation'}
//             </p>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
//             <button
//               onClick={onTryAgain}
//               disabled={isProcessing || isRecording}
//               className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2"
//             >
//               <RefreshCw className="w-4 h-4" />
//               Restart Conversation
//             </button>
            
//             {conversationHistory.length > 0 && (
//               <div className="text-sm text-gray-600 dark:text-gray-400">
//                 Exchange {conversationStep}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConversationPractice;
 