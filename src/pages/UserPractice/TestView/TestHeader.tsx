import type { JSX } from 'react';
import normalize from './normalize';


interface TestHeaderProps {
  data: any;
  onExit: () => void;
  onSubmit: () => void;
}

export default function TestHeader({ data, onExit, onSubmit }: TestHeaderProps): JSX.Element {
  const normalizedData = normalize(data)
  console.log(normalizedData)
  const domain = normalizedData?.header?.domain
  const topic = normalizedData?.header?.topic
  const skill = normalizedData?.header?.skill
  const fullTaskId = `${normalizedData?.header?.level}_${normalizedData?.header?.taskId}`

  return (
    <div className="relative z-50 p-4 border-b border-slate-800 flex justify-between items-center shadow-lg bg-white dark:bg-[#0b0f1a]">
      <div className="flex items-center gap-4">
        <button
          onClick={onExit}
          className="z-50 relative cursor-pointer p-2 rounded-lg transition-colors duration-200 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-red-900/50"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
        <div>
          <div className="text-xs text-blue-400 font-bold uppercase tracking-widest">
            {skill} | {fullTaskId}
          </div>
          <h3 className="font-bold text-lg">
            Domain: {domain} ({topic})
          </h3>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <button
          onClick={onSubmit}
          className="bg-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-900/20 cursor-pointer"
        >
          Submit All
        </button>
      </div>
    </div>
  );
}