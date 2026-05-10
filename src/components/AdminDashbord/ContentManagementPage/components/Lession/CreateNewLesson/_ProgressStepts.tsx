// ProgressSteps.tsx
import type { JSX } from 'react';

export interface Props {
  getStepStatus: (step: number) => 'completed' | 'active' | 'pending';
}

interface ProgressStepProps {
  number: number;
  label: string;
  status: 'completed' | 'active' | 'pending';
}

const ProgressStep: React.FC<ProgressStepProps> = ({ number, label, status }) => {
  const numberClasses = [
    'w-10 h-10 rounded-full flex items-center justify-center font-bold text-base relative z-[2] border-2 transition-all duration-300',
    status === 'completed'
      ? 'bg-emerald-500 border-emerald-500 text-white'
      : status === 'active'
        ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_0_4px_rgba(59,130,246,0.2)]'
        : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400',
  ].join(' ');

  const labelClasses = [
    'text-[13px] font-semibold text-center',
    status === 'completed' || status === 'active'
      ? 'text-gray-900 dark:text-gray-100'
      : 'text-gray-500 dark:text-gray-400',
  ].join(' ');

  return (
    <div className="flex flex-col items-center gap-2 flex-1 max-w-[140px] relative">
      <div className={numberClasses}>
        {status === 'completed' ? '✓' : number}
      </div>
      <div className={labelClasses}>{label}</div>
    </div>
  );
};

const ProgressConnector: React.FC<{ completed?: boolean }> = ({ completed }) => (
  <div
    className={[
      'h-0.5 flex-1 -mx-2 mb-8 relative z-[1]',
      completed ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-600',
    ].join(' ')}
  />
);

export default function ProgressSteps({ getStepStatus }: Props): JSX.Element {
  return (
    <div className="flex items-center justify-center gap-4 mb-10 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 max-md:grid max-md:grid-cols-2 max-md:gap-5">
      <ProgressStep number={1} label="Select Level" status={getStepStatus(1)} />
      <ProgressConnector completed={getStepStatus(1) === 'completed'} />
      <ProgressStep number={2} label="Choose Task" status={getStepStatus(2)} />
      <ProgressConnector completed={getStepStatus(2) === 'completed'} />
      <ProgressStep number={3} label="Pick Domain" status={getStepStatus(3)} />
      <ProgressConnector completed={getStepStatus(3) === 'completed'} />
      <ProgressStep number={4} label="Configure" status={getStepStatus(4)} />
      <ProgressConnector completed={getStepStatus(4) === 'completed'} />
      <ProgressStep number={5} label="Generate" status={getStepStatus(5)} />
    </div>
  );
}