/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LearningProgressView: React.FC<{ data: any }> = ({ data }) => {
  const studyData = data.studyTimeDistribution.map((item: any) => ({
    name: item.date,
    minutes: item.minutes
  }));

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
        <h3 className="text-lg font-semibold">Study Time (Minutes)</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={studyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="minutes" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LearningProgressView;