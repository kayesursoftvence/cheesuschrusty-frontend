import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';

// Sample data based on your Redux state
const SAMPLE_STATE =  {
    domain: "Environment",
    domainIt: "Ambiente",
    fullTaskId: "S-02_B1",
    level: "B1",
    mode: "STANDARD",
    promptTab: "generator",
    simulatedFeedbackTier: "Free",
    skill: "Speaking",
    tier: "Pro",
    type: {
      id: "S-02",
      it: "Produzione Orale - Immagine",
      name: "Speaking Image Description",
      configs: {
        STANDARD: {},
      },
      layouts: { STANDARD: "SPEAKING" },
      time: { STANDARD: 2 },
      trust: "OFFICIAL",
    },
    view: "test",
    writingText: "",
  }

export default function TestView(): JSX.Element {
  const navigate = useNavigate();

  // ✅ Using local sample data instead of Redux
  const state = SAMPLE_STATE;
  const [writingText, setWritingTextLocal] = useState(state.writingText);

  function onExit() {
    navigate('/user/practice');
  }

  function onSubmit() {
    console.log("practise submitted");
    navigate('/user/practice/test/feedback');
  }

  const layout = state.type.layouts[state.mode as keyof typeof state.type.layouts] || state.type.layouts['STANDARD'];
  // const config = state.type.configs[state.mode as keyof typeof state.type.configs] || state.type.configs['STANDARD'];
  const displayTime = state.type.time[state.mode as keyof typeof state.type.time] || state.type.time['STANDARD'];
  const trust = state.type.trust;

  const wordCount = useMemo(() => {
    return writingText.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
  }, [writingText]);

  const writingLimits = useMemo(() => {
    if (layout !== 'WRITING') return [0, 0];
    return [100, 200]; // default fallback
  }, [layout]);

  const wordStatus = useMemo(() => {
    if (wordCount < writingLimits[0]) return { text: `Too Short (<${writingLimits[0]})`, class: "bg-red-900/50 text-red-400" };
    if (wordCount > writingLimits[1]) return { text: `Too Long (>${writingLimits[1]})`, class: "bg-yellow-900/50 text-yellow-400" };
    return { text: `Perfect (${writingLimits[0]}-${writingLimits[1]})`, class: "bg-green-900/50 text-green-400" };
  }, [wordCount, writingLimits]);

  const handleWritingChange = (text: string) => {
    setWritingTextLocal(text);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="absolute inset-0 bg-[#0b0f1a] z-50 flex flex-col"
    >
      {/* Header */}
      <div className="relative z-50 p-4 border-b border-slate-800 flex justify-between items-center shadow-lg bg-[#0b0f1a]">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="z-50 relative cursor-pointer p-2 rounded-lg transition-colors duration-200 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-red-900/50">
            <i className="fas fa-times text-xl"></i>
          </button>
          <div>
            <div className="text-xs text-blue-400 font-bold uppercase tracking-widest">{state.skill} | {state.fullTaskId}</div>
            <h3 className="font-bold text-lg">Domain: {state.domain} ({state.domainIt})</h3>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <button onClick={onSubmit} className="bg-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-900/20">Submit All</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-[#0b0f1a] relative z-0">
        {/* Dev Data Panel */}
        <div className="bg-slate-800 border-b border-slate-700 p-4 text-xs font-mono text-slate-300">
          <div className="flex justify-between items-center mb-2">
            <strong className="text-emerald-400"><i className="fas fa-database mr-1"></i> DEV DATA HANDOFF EXPECTATION:</strong>
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700 text-blue-300">{state.fullTaskId}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 p-2 rounded border border-slate-700 break-all">
              <span className="text-slate-500 block mb-1">// 1. DB Input (Injected from JSON)</span>
              task_id: "{state.fullTaskId}",<br />
              layout: "{layout}",<br />
              domain: "{state.domain}",<br />
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-700 break-all">
              <span className="text-slate-500 block mb-1">// 2. User Output (Sent to LLM Grader)</span>
              candidate_response: {layout === 'SPEAKING' ? '{ transcript: "...", confidence_scores: [...] }' : layout === 'WRITING' ? '"..."' : '"User selected answers"'}
            </div>
          </div>
        </div>

        {/* Task Header */}
        <div className="bg-[#0b0f1a]/95 border-b border-blue-500/30 px-8 py-4 flex justify-between items-center relative z-30">
          <div>
            <div className="text-blue-400 font-extrabold uppercase text-base tracking-wider"><i className="fas fa-bullseye mr-2"></i> {state.type.name}</div>
            <p className="text-[0.8rem] text-slate-400 mt-0.5">Task {state.fullTaskId} • Mode: {state.mode}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-blue-600/20 border border-blue-400 text-white px-5 py-2.5 rounded-lg font-mono font-bold flex items-center gap-2 cursor-pointer transition-all duration-200 hover:bg-blue-600">
              <i className="fas fa-play"></i> Start Timer: {displayTime}:00
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-[#0b0f1a] [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full flex flex-col items-center">
          <div className="max-w-3xl w-full space-y-8">
            
            {/* Listening Audio Player */}
            {state.skill === 'Listening' && (
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button className="w-12 h-12 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-white text-xl transition"><i className="fas fa-play ml-1"></i></button>
                  <div>
                    <div className="font-bold text-white">Audio Stimulus Track</div>
                    <div className="text-xs text-slate-400 mt-1">Play limits enforce real exam conditions.</div>
                  </div>
                </div>
                <div className="text-left sm:text-right bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
                  <div className="text-sm font-bold text-yellow-500">Plays Remaining: 2</div>
                  <div className="text-xs text-slate-400">Do not pause during playback.</div>
                </div>
              </div>
            )}

            {/* Layout-based Content */}
            {layout === 'WRITING' ? (
              <div className="bg-slate-800/50 border border-white/5 rounded-xl p-8 space-y-6">
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 italic text-slate-300 text-lg">
                  "Scrivi un testo su: <strong>{state.domainIt}</strong>. Devi includere i seguenti punti..."
                  <div className="mt-2 text-sm text-blue-400 font-bold not-italic">Target: {writingLimits[0]} to {writingLimits[1]} words.</div>
                </div>
                <textarea 
                  value={writingText}
                  onChange={(e) => handleWritingChange(e.target.value)}
                  className="w-full h-96 bg-[#0b0f1a] p-6 border-2 border-slate-800 rounded-xl focus:border-blue-500 outline-none text-xl leading-relaxed text-slate-200" 
                  placeholder="Scrivi qui..."
                ></textarea>
                <div className="flex justify-between items-center px-2">
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Word Count: <span className="text-blue-400 text-2xl font-mono ml-2">{wordCount}</span></div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${wordStatus.class}`}>{wordStatus.text}</div>
                </div>
              </div>
            ) : layout === 'SPEAKING' ? (
              <div className="bg-slate-800/50 border border-white/5 rounded-xl p-10 relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
                <h2 className="text-2xl font-bold mb-6 text-purple-400 uppercase tracking-widest">Speaking Task: {state.domainIt}</h2>
                {state.type.id === 'S-02' && (
                  <div className="bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl h-64 flex items-center justify-center mb-6 relative overflow-hidden group">
                    <div className="text-center z-10 relative">
                      <i className="fas fa-image text-4xl text-slate-500 mb-2"></i>
                      <div className="text-sm font-bold text-slate-400">Cloudinary Asset Placeholder</div>
                    </div>
                  </div>
                )}
                <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl text-left mb-8 shadow-inner">
                  <p className="text-slate-300 text-lg italic leading-relaxed">"Immagina di essere in questa situazione: [Agent generates scenario for {state.domain}]. Parla di questo argomento per {state.type.id === 'S-01' ? '2 to 3 minutes' : '1.5 minutes'}."</p>
                </div>
                <div className="flex flex-col items-center justify-center space-y-4">
                  <button className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:bg-red-500 transition transform hover:scale-105"><i className="fas fa-microphone"></i></button>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Tap to Record</p>
                </div>
              </div>
            ) : (
              /* ✅ MCQ / Default Layout */
              <div className="bg-slate-800/50 border border-white/5 rounded-xl p-10 space-y-8 text-lg leading-loose text-slate-200">
                <div className="bg-blue-600/20 text-blue-300 border border-blue-500/30 p-4 rounded-lg mb-6 flex gap-3 text-base leading-normal">
                  <i className="fas fa-info-circle mt-1"></i>
                  <span className="font-bold">Instructions: Complete the task based on the provided stimulus.</span>
                </div>
                <p className="text-slate-500 italic">[Stimulus Content Placeholder for {layout}]</p>
                {/* <div className="space-y-4">
                  {[...Array(config.questions || 5)].map((_, i) => (
                    <div key={i} className="bg-slate-900/50 border border-white/5 transition-colors duration-200 hover:border-blue-500/30 p-6 rounded-xl space-y-4">
                      <p className="font-bold text-slate-200">{i + 1}. Sample question item for {state.domainIt}?</p>
                      {layout === 'MCQ' ? (
                        <div className="grid grid-cols-1 gap-3">
                          {[...Array(config.options || 4)].map((_, j) => (
                            <label key={j} className="p-3 border border-slate-700 rounded hover:bg-slate-800 cursor-pointer flex items-center gap-3">
                              <input type="radio" name={`q${i}`} /> Option {String.fromCharCode(65 + j)}
                            </label>
                          ))}
                        </div>
                      ) : (
                        <input type="text" className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-slate-300 outline-none focus:border-blue-500" placeholder="Type answer..." />
                      )}
                    </div>
                  ))}
                </div> */}
              </div>
            )}

            {/* Trust Badge */}
            <div className={`mt-8 rounded-xl overflow-hidden ${trust === 'VERIFIED' ? 'border border-emerald-500/30 bg-emerald-900/15' : 'border border-blue-500/30 bg-slate-800/50'}`}>
              <div className={`px-4 py-3 font-extrabold text-[0.75rem] uppercase tracking-wider flex items-center gap-2 ${trust === 'VERIFIED' ? 'bg-emerald-900/30 text-emerald-400 border-b border-emerald-500/20' : 'bg-blue-500/20 text-blue-400 border-b border-blue-500/20'}`}>
                <i className={`fas ${trust === 'VERIFIED' ? 'fa-shield-alt' : 'fa-certificate'}`}></i> 
                CEFR B1 {trust === 'VERIFIED' ? 'VERIFIED' : 'OFFICIAL STANDARD'}
              </div>
              <div className="p-4 flex flex-wrap gap-4 justify-center font-mono text-[0.75rem] text-slate-200">
                <div className="flex items-center gap-2"><span className={trust === 'VERIFIED' ? 'text-emerald-400' : 'text-blue-400'}>Format:</span><span className="opacity-90">Official</span><i className="fas fa-check ml-1 text-emerald-500"></i></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// export const TestView: React.FC<TestViewProps> = () => {
//   const dispatch = useDispatch();
//   const state = useSelector((state: RootState) => state.practice);
//   const writingText = state.writingText;

//   const layout = state.type?.layouts[state.mode] || state.type?.layouts['STANDARD'];
//   const config = state.type?.configs[state.mode] || state.type?.configs['STANDARD'];
//   const displayTime = state.type?.time[state.mode] || state.type?.time['STANDARD'];
//   const trust = state.type?.trust;

//   const wordCount = useMemo(() => {
//     return writingText.trim().split(/\s+/).filter(w => w.length > 0).length;
//   }, [writingText]);

//   const writingLimits = useMemo(() => {
//     if (layout !== 'WRITING') return [0, 0];
//     return state.mode === 'CITIZENSHIP' ? config.wordsCIT : config.wordsSTD;
//   }, [layout, state.mode, config]);

//   const wordStatus = useMemo(() => {
//     if (wordCount < writingLimits[0]) return { text: `Too Short (<${writingLimits[0]})`, class: "bg-red-900/50 text-red-400" };
//     if (wordCount > writingLimits[1]) return { text: `Too Long (>${writingLimits[1]})`, class: "bg-yellow-900/50 text-yellow-400" };
//     return { text: `Perfect (${writingLimits[0]}-${writingLimits[1]})`, class: "bg-green-900/50 text-green-400" };
//   }, [wordCount, writingLimits]);

//   const handleWritingChange = (text: string) => {
//     dispatch(setWritingText(text));
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: -20 }}
//       className="absolute inset-0 bg-[#0b0f1a] z-50 flex flex-col"
//     >
//       <div className="relative z-50 p-4 border-b border-slate-800 flex justify-between items-center shadow-lg bg-[#0b0f1a]">
//         <div className="flex items-center gap-4">
//           <button onClick={onExit} className="z-50 relative cursor-pointer p-2 rounded-lg transition-colors duration-200 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-red-900/50">
//             <i className="fas fa-times text-xl"></i>
//           </button>
//           <div>
//             <div className="text-xs text-blue-400 font-bold uppercase tracking-widest">{state.skill} | {state.fullTaskId}</div>
//             <h3 className="font-bold text-lg">Domain: {state.domain} ({state.domainIt})</h3>
//           </div>
//         </div>
//         <div className="flex items-center gap-8">
//           <button onClick={onSubmit} className="bg-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-900/20">Submit All</button>
//         </div>
//       </div>

//       <div className="flex-1 flex flex-col overflow-hidden bg-[#0b0f1a] relative z-0">
//         <div className="bg-slate-800 border-b border-slate-700 p-4 text-xs font-mono text-slate-300">
//           <div className="flex justify-between items-center mb-2">
//             <strong className="text-emerald-400"><i className="fas fa-database mr-1"></i> DEV DATA HANDOFF EXPECTATION:</strong>
//             <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700 text-blue-300">{state.fullTaskId}</span>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="bg-slate-900 p-2 rounded border border-slate-700 break-all">
//               <span className="text-slate-500 block mb-1">// 1. DB Input (Injected from JSON)</span>
//               task_id: "{state.fullTaskId}",<br />
//               layout: "{layout}",<br />
//               domain: "{state.domain}",<br />
//             </div>
//             <div className="bg-slate-900 p-2 rounded border border-slate-700 break-all">
//               <span className="text-slate-500 block mb-1">// 2. User Output (Sent to LLM Grader)</span>
//               candidate_response: {layout === 'SPEAKING' ? '{ transcript: "...", confidence_scores: [...] }' : layout === 'WRITING' ? '"..."' : '"User selected answers"'}
//             </div>
//           </div>
//         </div>

//         <div className="bg-bg-main/95 border-b border-blue-500/30 px-8 py-4 flex justify-between items-center relative z-30">
//           <div>
//             <div className="text-blue-primary font-extrabold uppercase text-base tracking-wider"><i className="fas fa-bullseye mr-2"></i> {state.type?.name}</div>
//             <p className="text-[0.8rem] text-text-secondary mt-0.5">Task {state.fullTaskId} • Mode: {state.mode}</p>
//           </div>
//           <div className="flex items-center gap-4">
//             <button className="bg-blue-600/20 border border-blue-primary text-white px-5 py-2.5 rounded-lg font-mono font-bold flex items-center gap-2 cursor-pointer transition-all duration-200 hover:bg-blue-600">
//               <i className="fas fa-play"></i> Start Timer: {displayTime}:00
//             </button>
//           </div>
//         </div>

//         <div className="flex-1 p-8 overflow-y-auto [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-bg-main [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full flex flex-col items-center">
//           <div className="max-w-3xl w-full space-y-8">
//             {state.skill === 'Listening' && (
//               <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div className="flex items-center gap-4">
//                   <button className="w-12 h-12 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-white text-xl transition"><i className="fas fa-play ml-1"></i></button>
//                   <div>
//                     <div className="font-bold text-white">Audio Stimulus Track</div>
//                     <div className="text-xs text-slate-400 mt-1">Play limits enforce real exam conditions.</div>
//                   </div>
//                 </div>
//                 <div className="text-left sm:text-right bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
//                   <div className="text-sm font-bold text-yellow-500">Plays Remaining: 2</div>
//                   <div className="text-xs text-slate-400">Do not pause during playback.</div>
//                 </div>
//               </div>
//             )}

//             {layout === 'WRITING' ? (
//               <div className="bg-bg-accent border border-white/5 rounded-xl p-8 space-y-6">
//                 <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 italic text-slate-300 text-lg">
//                   "Scrivi un testo su: <strong>{state.domainIt}</strong>. Devi includere i seguenti punti..."
//                   <div className="mt-2 text-sm text-blue-400 font-bold not-italic">Target: {writingLimits[0]} to {writingLimits[1]} words.</div>
//                 </div>
//                 <textarea 
//                   value={writingText}
//                   onChange={(e) => handleWritingChange(e.target.value)}
//                   className="w-full h-96 bg-[#0b0f1a] p-6 border-2 border-slate-800 rounded-xl focus:border-blue-500 outline-none text-xl leading-relaxed text-slate-200" 
//                   placeholder="Scrivi qui..."
//                 ></textarea>
//                 <div className="flex justify-between items-center px-2">
//                   <div className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Word Count: <span className="text-blue-400 text-2xl font-mono ml-2">{wordCount}</span></div>
//                   <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${wordStatus.class}`}>{wordStatus.text}</div>
//                 </div>
//               </div>
//             ) : layout === 'SPEAKING' ? (
//               <div className="bg-bg-accent border border-white/5 rounded-xl p-10 relative overflow-hidden text-center">
//                 <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
//                 <h2 className="text-2xl font-bold mb-6 text-purple-400 uppercase tracking-widest">Speaking Task: {state.domainIt}</h2>
//                 {state.type?.id === 'S-02' && (
//                   <div className="bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl h-64 flex items-center justify-center mb-6 relative overflow-hidden group">
//                     <div className="text-center z-10 relative">
//                       <i className="fas fa-image text-4xl text-slate-500 mb-2"></i>
//                       <div className="text-sm font-bold text-slate-400">Cloudinary Asset Placeholder</div>
//                     </div>
//                   </div>
//                 )}
//                 <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl text-left mb-8 shadow-inner">
//                   <p className="text-slate-300 text-lg italic leading-relaxed">"Immagina di essere in questa situazione: [Agent generates scenario for {state.domain}]. Parla di questo argomento per {state.type?.id === 'S-01' ? '2 to 3 minutes' : '1.5 minutes'}."</p>
//                 </div>
//                 <div className="flex flex-col items-center justify-center space-y-4">
//                   <button className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:bg-red-500 transition transform hover:scale-105"><i className="fas fa-microphone"></i></button>
//                   <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Tap to Record</p>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-bg-accent border border-white/5 rounded-xl p-10 space-y-8 text-lg leading-loose text-slate-200">
//                 <div className="bg-blue-600/20 text-blue-300 border border-blue-500/30 p-4 rounded-lg mb-6 flex gap-3 text-base leading-normal">
//                   <i className="fas fa-info-circle mt-1"></i>
//                   <span className="font-bold">Instructions: Complete the task based on the provided stimulus.</span>
//                 </div>
//                 <p className="text-slate-500 italic">[Stimulus Content Placeholder for {layout}]</p>
//                 <div className="space-y-4">
//                   {[...Array(config.questions || config.items || config.gaps || 5)].map((_, i) => (
//                     <div key={i} className="bg-bg-card border border-white/5 transition-colors duration-200 hover:border-blue-500/30 p-6 rounded-xl space-y-4">
//                       <p className="font-bold text-slate-200">{i+1}. Sample question item for {state.domainIt}?</p>
//                       {layout === 'MCQ' ? (
//                         <div className="grid grid-cols-1 gap-3">
//                           {[...Array(config.options || 4)].map((_, j) => (
//                             <label key={j} className="p-3 border border-slate-700 rounded hover:bg-slate-800 cursor-pointer flex items-center gap-3">
//                               <input type="radio" name={`q${i}`} /> Option {String.fromCharCode(65 + j)}
//                             </label>
//                           ))}
//                         </div>
//                       ) : (
//                         <input type="text" className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-slate-300 outline-none focus:border-blue-500" placeholder="Type answer..." />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div className={`mt-8 rounded-xl overflow-hidden ${trust === 'VERIFIED' ? 'border border-success-green/30 bg-emerald-900/15' : 'border border-blue-500/30 bg-slate-800/50'}`}>
//               <div className={`px-4 py-3 font-extrabold text-[0.75rem] uppercase tracking-wider flex items-center gap-2 ${trust === 'VERIFIED' ? 'bg-emerald-900/30 text-emerald-400 border-b border-success-green/20' : 'bg-blue-500/20 text-blue-400 border-b border-blue-500/20'}`}>
//                 <i className={`fas ${trust === 'VERIFIED' ? 'fa-shield-alt' : 'fa-certificate'}`}></i> 
//                 CEFR B1 {trust === 'VERIFIED' ? 'VERIFIED' : 'OFFICIAL STANDARD'}
//               </div>
//               <div className="p-4 flex flex-wrap gap-4 justify-center font-mono text-[0.75rem] text-slate-200">
//                 <div className="flex items-center gap-2"><span className={trust === 'VERIFIED' ? 'text-success-green' : 'text-blue-400'}>Format:</span><span className="opacity-90">Official</span><i className="fas fa-check ml-1 text-emerald-500"></i></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };