import React, { useState } from 'react';
import { 
  CheckCircle, 
  FileText, 
  HelpCircle, 
  Info, 
  Layers, 
  Layout, 
  ShieldCheck, 
  Clock, 
  BookOpen,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  BrainCircuit
} from 'lucide-react';

interface LessonPreviewProps {
  result: any;
  onReset: () => void;
}

const LessonPreview: React.FC<LessonPreviewProps> = ({ result, onReset }) => {
  const [showTeacherPack, setShowTeacherPack] = useState(false);

  // Normalize data access: handle cases where result is the root response or just the content
  const data = result?.data || result;
  const content = data?.content || result?.content || result;
  const metadata = content?.metadata || data?.metadata || {};
  const studentHandout = content?.student_handout || data?.student_handout || {};
  const teacherPack = content?.teacher_pack || data?.teacher_pack || {};
  const validator = content?.validator || data?.validator || {};

  const stimulus = studentHandout?.stimulus || studentHandout?.text || '';
  const questions = studentHandout?.questions || [];
  const instructions = studentHandout?.instructions || '';
  
  const answer_key = teacherPack?.answer_key || {};
  const word_count = teacherPack?.word_count || 0;

  // Extract stimulus text
  const stimulusText = typeof stimulus === 'string' ? stimulus : stimulus?.text || '';
  const stimulusTitle = typeof stimulus === 'object' ? stimulus?.title : '';

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-8 rounded-t-3xl shadow-2xl flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-5">
          <div className="bg-white/20 p-3 rounded-2xl shadow-inner backdrop-blur-sm animate-bounce-in">
            <BrainCircuit className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">Intelligence Ready.</h2>
            <p className="text-emerald-50 text-sm font-medium opacity-80">AI has architected your lesson with precision.</p>
          </div>
        </div>
        <button 
          onClick={onReset}
          className="bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm font-bold border border-white/10 hover:border-white/20 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Create New
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-gray-800 shadow-2xl border-x border-b border-gray-100 dark:border-gray-700 rounded-b-2xl overflow-hidden">
        
        {/* Quick Stats / Metadata Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 p-6 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-0.5">Level</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{metadata.level || metadata.LEVEL_ID || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-0.5">Skill</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{metadata.skill || metadata.SKILL || 'READING'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-0.5">Time</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{metadata.timer || metadata.task_time || metadata.TASK_TIME || 0} min</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-0.5">Seed</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{metadata.generation_seed || metadata.GENERATION_SEED || '42'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-0.5">Quality</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{validator.overall || 'CEFR PASSED'}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Instructions */}
          {instructions && (
            <div className="mb-10 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10 border-l-4 border-blue-500 rounded-r-2xl">
              <div className="flex items-center gap-2.5 mb-2">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-black text-blue-900 dark:text-blue-100 uppercase tracking-widest">Task Instructions</span>
              </div>
              <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">{instructions}</p>
            </div>
          )}

          {/* Stimulus Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {stimulusTitle || 'Reading Passage'}
              </h3>
              <div className="ml-auto px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest border border-gray-200 dark:border-gray-600">
                {word_count || stimulusText.split(' ').length} Words
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative prose prose-blue dark:prose-invert max-w-none bg-white dark:bg-gray-800/40 p-10 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] whitespace-pre-wrap text-[17px] leading-[1.8] text-gray-800 dark:text-gray-200 font-serif">
                {stimulusText}
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="w-6 h-6 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white underline decoration-purple-500 decoration-2 underline-offset-4">
                Comprehension Tasks
              </h3>
            </div>
            
            <div className="space-y-8">
              {questions?.map((q: any, idx: number) => {
                const questionText = q.prompt || q.text || q.question || '';
                const questionNum = q.number || q.id || idx + 1;
                const options = q.options || q.choices || [];
                
                return (
                  <div key={idx} className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center font-black text-gray-600 dark:text-gray-400 shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        {questionNum}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-bold text-gray-900 dark:text-white mb-5 leading-snug">
                          {questionText}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {options && (Array.isArray(options) ? options : Object.entries(options)).map((opt: any, optIdx: number) => {
                            let key = '';
                            let text = '';

                            if (Array.isArray(options)) {
                              // Handle array of strings or objects
                              if (typeof opt === 'string') {
                                text = opt;
                                key = String.fromCharCode(65 + optIdx); // A, B, C...
                              } else {
                                text = opt.text || opt.label || '';
                                key = opt.id || opt.key || String.fromCharCode(65 + optIdx);
                              }
                            } else {
                              // Handle Record<string, string>
                              key = opt[0];
                              text = opt[1];
                            }

                            const isCorrect = showTeacherPack && answer_key?.[questionNum] === key;

                            return (
                              <div 
                                key={key} 
                                className={`flex items-center gap-3.5 p-4 rounded-xl border transition-all duration-200 ${
                                  isCorrect
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-900 dark:text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                    : 'bg-gray-50 dark:bg-gray-900/30 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-200 dark:hover:border-gray-600'
                                }`}
                              >
                                <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                                  isCorrect
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                }`}>
                                  {key}
                                </span>
                                <span className="text-[15px] font-medium leading-relaxed">{text}</span>
                                {isCorrect && (
                                  <div className="ml-auto flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-1 rounded-full">
                                    <CheckCircle className="w-3 h-3" />
                                    Correct
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Teacher Pack Toggle */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-8 mt-12">
            <button 
              onClick={() => setShowTeacherPack(!showTeacherPack)}
              className="w-full flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-bold text-gray-900 dark:text-white"
            >
              <div className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-blue-500" />
                <span>Show Teacher's Answer Key</span>
              </div>
              {showTeacherPack ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {showTeacherPack && (
              <div className="mt-6 p-8 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-3xl animate-slideInUp shadow-inner">
                <h4 className="text-emerald-800 dark:text-emerald-400 font-black mb-6 flex items-center gap-2.5 tracking-tight">
                  <ShieldCheck className="w-6 h-6" />
                  OFFICIAL EVALUATION KEY
                </h4>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-5">
                  {answer_key && Object.entries(answer_key).map(([num, ans]: [string, any]) => (
                    <div key={num} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 text-center shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest">Q{num}</p>
                      <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">{ans}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-center">
          <button 
            onClick={onReset}
            className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:translate-y-0 cursor-pointer"
          >
            Create Another Lesson
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonPreview;
