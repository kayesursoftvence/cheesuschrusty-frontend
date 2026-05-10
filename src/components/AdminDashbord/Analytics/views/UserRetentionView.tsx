/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const UserRetentionView: React.FC<{ insights: string[], stats: any }> = ({ insights, stats }) => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm dark:bg-gray-800 text-center">
        <h3 className="text-xl font-bold mb-2">Overall Retention Rate</h3>
        <div className="text-6xl font-black text-indigo-600 dark:text-indigo-400">
          {stats.userRetention}
        </div>
        <p className="text-gray-500 mt-2">Active users in the last 7 days</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-4">Key Insights from AI</h3>
        <ul className="space-y-3">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
              {insight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserRetentionView;