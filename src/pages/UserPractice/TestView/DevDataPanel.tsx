import type { JSX } from 'react';
import type { 
  // LayoutType, 
  TestState } from './test.types';
import normalize from './normalize';

interface DevDataPanelProps {
  data: any;
  state: TestState;
}

// Ensure the parameter can handle undefined or provide a default
// function getExpectedOutput(layout: LayoutType | undefined): string {
//   if (!layout) return '"No layout provided"';
  
//   switch (layout) {
//     case 'SPEAKING':
//       return '{ transcript: "...", confidence_scores: [...] }';
//     case 'WRITING':
//       return '"<full_essay_text>"';
//     case 'MCQ':
//       return '{ answers: [{ q: 1, selected: "B" }, ...] }';
//     case 'MATCHING':
//       return '{ pairs: [{ item: 1, match: "C" }, ...] }';
//     case 'TRUEFALSE':
//       return '{ answers: [{ statement: 1, value: true }, ...] }';
//     case 'GAP_FILL':
//       return '{ answers: [{ gap: 1, value: "word" }, ...] }';
//     case 'TRANSFORMATION':
//       return '{ answers: [{ item: 1, rewrite: "..." }, ...] }';
//     case 'ERROR_RECOGNITION':
//       return '{ answers: [{ item: 1, error: "...", correction: "..." }, ...] }';
//     default:
//       return '"Unknown layout"';
//   }
// }

export default function DevDataPanel({ data, state }: DevDataPanelProps): JSX.Element {
  const normalizedData = normalize(data);
  console.log(normalizedData)
  // Extract values with fallbacks to avoid "undefined" strings in UI
  // const topic = normalizedData?.header?.topic ?? 'N/A';
  // const skill = normalizedData?.header?.skill ?? '';
  // const level = normalizedData?.header?.level ?? 'N/A';
  // const taskId = normalizedData?.header?.taskId ?? 'N/A';
  // const domain = normalizedData?.header?.domain ?? 'N/A';
  
  // const fullTaskId = `${level}_${taskId}`;
  // const layout = normalizedData?.header?.layout as LayoutType | undefined;

  // Safe string formatting for Skill
  // const formattedSkill = skill 
  //   ? skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase() 
  //   : 'N/A';

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-700 p-4 text-xs font-mono text-slate-500 dark:text-slate-300">
      <div className="flex justify-between items-center mb-2">
        <strong className="text-emerald-400">
          <i className="fas fa-database mr-1"></i> DEV DATA HANDOFF EXPECTATION:
        </strong>
        <span className="dark:bg-slate-900 px-2 py-1 rounded border border-slate-700 text-blue-300">
          {state.fullTaskId}
        </span>
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded border border-slate-300 dark:border-slate-700 break-all px-4">
          <span className="text-slate-900 dark:text-slate-500 block mb-1">// 1. DB Input (Injected from JSON)</span>
          task_id: "{fullTaskId}",<br />
          layout: "{layout ?? 'UNKNOWN'}",<br />
          domain: "{`${domain} | ${topic}`}",<br />
          skill: "{formattedSkill}",
        </div>
        <div className="text-slate-500 dark:bg-slate-900 p-2 rounded border dark:border-slate-700 break-all">
          <span className="text-slate-900 dark:text-slate-500 block mb-1">// 2. User Output (Sent to LLM Grader)</span>
          candidate_response: {getExpectedOutput(layout)}
        </div>
      </div> */}
    </div>
  );
}