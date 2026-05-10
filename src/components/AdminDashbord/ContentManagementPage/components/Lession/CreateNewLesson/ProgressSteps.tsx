// ProgressSteps.tsx
import type { JSX } from 'react';

export interface Props {
  getStepStatus: (step: number) => 'completed' | 'active' | 'pending';
  onStepClick?: (step: number) => void;
}

interface ProgressStepProps {
  number: number;
  label: string;
  status: 'completed' | 'active' | 'pending';
  onClick?: () => void;
}

const ProgressStep: React.FC<ProgressStepProps> = ({ number, label, status, onClick }) => {
  const isClickable = status === 'completed' || status === 'active';

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
    <div
      className={[
        'flex flex-col items-center gap-2 flex-1 max-w-[140px] relative',
        isClickable ? 'cursor-pointer group' : 'cursor-default',
      ].join(' ')}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div
        className={[
          numberClasses,
          isClickable ? 'group-hover:scale-110' : '',
        ].join(' ')}
      >
        {status === 'completed' ? '✓' : number}
      </div>
      <div className={labelClasses}>{label}</div>
    </div>
  );
};

const ProgressConnector: React.FC<{ completed?: boolean }> = ({ completed }) => (
  <div
    className={[
      'h-0.5 flex-1 -mx-2 mb-8 relative z-[1] transition-colors duration-300',
      completed ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-600',
    ].join(' ')}
  />
);

export default function ProgressSteps({ getStepStatus, onStepClick }: Props): JSX.Element {
  return (
    <div className="flex items-center justify-center gap-4 mb-10 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 max-md:grid max-md:grid-cols-2 max-md:gap-5">
      <ProgressStep
        number={1}
        label="Select Level & Task Type"
        status={getStepStatus(1)}
        onClick={() => onStepClick?.(1)}
      />
      <ProgressConnector completed={getStepStatus(1) === 'completed'} />
      <ProgressStep
        number={2}
        label="Pick Domain"
        status={getStepStatus(2)}
        onClick={() => onStepClick?.(2)}
      />
      {/* <ProgressConnector completed={getStepStatus(2) === 'completed'} />
      <ProgressStep
        number={3}
        label="Difficulty Level"
        status={getStepStatus(3)}
        onClick={() => onStepClick?.(3)}
      /> */}
      {/* <ProgressConnector completed={getStepStatus(3) === 'completed'} />
      <ProgressStep
        number={4}
        label="Time & Length"
        status={getStepStatus(4)}
        onClick={() => onStepClick?.(4)}
      /> */}
      <ProgressConnector completed={getStepStatus(2) === 'completed'} />
      <ProgressStep
        number={5}
        label="Generation Mode"
        status={getStepStatus(5)}
        onClick={() => onStepClick?.(5)}
      />
      <ProgressConnector completed={getStepStatus(5) === 'completed'} />
      <ProgressStep
        number={6}
        label="Configure"
        status={getStepStatus(6)}
        onClick={() => onStepClick?.(6)}
      />
      <ProgressConnector completed={getStepStatus(6) === 'completed'} />
      <ProgressStep
        number={7}
        label="Generate"
        status={getStepStatus(7)}
        onClick={() => onStepClick?.(7)}
      />
    </div>
  );
}