import React from 'react';
import { KpiData } from './types';

interface KpiCardProps {
  kpi: KpiData;
}

const KpiCard: React.FC<KpiCardProps> = ({ kpi }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm flex items-center space-x-3 sm:space-x-4">
      <div className="bg-gray-100 dark:bg-gray-700 p-2 sm:p-3 rounded-full flex-shrink-0">
        <div className="w-6 h-6 sm:w-8 sm:h-8">
          {kpi.icon}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{kpi.title}</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 truncate">{kpi.value}</p>
      </div>
    </div>
  );
};

export default KpiCard;
