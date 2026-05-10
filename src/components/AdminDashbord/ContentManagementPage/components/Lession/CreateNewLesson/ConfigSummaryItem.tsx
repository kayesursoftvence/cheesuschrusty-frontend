// ConfigSummaryItem.tsx
import React from 'react';

interface ConfigSummaryItemProps {
  icon: string;
  label: string;
  value: string;
  isPlaceholder?: boolean;
  isComplete?: boolean;
}

const ConfigSummaryItem: React.FC<ConfigSummaryItemProps> = ({
  icon,
  label,
  value,
  isPlaceholder = false,
  isComplete = false,
}) => (
  <div className="flex items-center gap-3 mb-3 p-3 bg-white/10 rounded-lg transition-all duration-200 hover:bg-white/[0.15]">
    <div className="text-xl w-8 h-8 bg-white/[0.15] rounded-lg flex items-center justify-center">
      {icon}
    </div>
    <div className="flex-1">
      <div className="text-[11px] opacity-80 uppercase tracking-wider mb-0.5">
        {label}
      </div>
      <div className={`text-sm font-semibold ${isPlaceholder ? 'italic opacity-60' : ''}`}>
        {value}
      </div>
    </div>
    <div
      className={[
        'w-2 h-2 rounded-full',
        isComplete ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-white/30',
      ].join(' ')}
    />
  </div>
);

export default ConfigSummaryItem;