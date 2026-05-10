// src/components/test/TaskHeader.tsx

import type { JSX } from 'react';
import CountdownTimer from './CountdownTimer';
import normalize from '../normalize';

interface TaskHeaderProps {
  data: any;
  isRunning?: boolean;
}

export default function TaskHeader({ data, isRunning }: TaskHeaderProps): JSX.Element {
  const normalizedData = normalize(data)
  const domain = normalizedData?.header?.domain
  const topic = normalizedData?.header?.topic
  const fullTaskId = `${normalizedData?.header?.level}_${normalizedData?.header?.taskId}`
  const reaminingTime = data?.data?.content?.header?.section_total

  return (
    <div className="bg-[#0b0f1a]/95 border-b border-blue-500/30 px-8 py-4 flex justify-between items-center relative z-30">
      <div>
        <div className="text-blue-400 font-extrabold uppercase text-base tracking-wider">
          <i className="fas fa-bullseye mr-2"></i> {topic}
        </div>
        <p className="text-[0.8rem] text-slate-400 mt-0.5">
          Task {fullTaskId} • Domain: {domain}
        </p>
      </div>

      {/* Reverse clock */}
      <CountdownTimer
        seconds={reaminingTime}
        isRunning={isRunning}
        onFinish={() => console.log("finish 30 second timer")}
      />
    </div>
  );
}