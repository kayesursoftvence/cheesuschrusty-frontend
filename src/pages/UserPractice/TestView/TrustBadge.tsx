// src/components/test/TrustBadge.tsx

import type { JSX } from 'react';
// import type { TrustLevel } from './types/test.types';
import type { TrustLevel } from './test.types';

interface TrustBadgeProps {
  trust: TrustLevel;
  level: string;
}

export default function TrustBadge({ trust, level }: TrustBadgeProps): JSX.Element {
  const isVerified = trust === 'VERIFIED';

  return (
    <div
      className={`mt-8 rounded-xl overflow-hidden ${
        isVerified
          ? 'border border-emerald-500/30 bg-emerald-900/15'
          : 'border border-blue-500/30 bg-slate-800/50'
      }`}
    >
      <div
        className={`px-4 py-3 font-extrabold text-[0.75rem] uppercase tracking-wider flex items-center gap-2 ${
          isVerified
            ? 'bg-emerald-900/30 text-emerald-400 border-b border-emerald-500/20'
            : 'bg-blue-500/20 text-blue-400 border-b border-blue-500/20'
        }`}
      >
        <i className={`fas ${isVerified ? 'fa-shield-alt' : 'fa-certificate'}`}></i>
        CEFR {level} {isVerified ? 'VERIFIED' : 'OFFICIAL STANDARD'}
      </div>
      <div className="p-4 flex flex-wrap gap-4 justify-center font-mono text-[0.75rem] text-slate-200">
        <div className="flex items-center gap-2">
          <span className={isVerified ? 'text-emerald-400' : 'text-blue-400'}>Format:</span>
          <span className="opacity-90">Official</span>
          <i className="fas fa-check ml-1 text-emerald-500"></i>
        </div>
      </div>
    </div>
  );
}