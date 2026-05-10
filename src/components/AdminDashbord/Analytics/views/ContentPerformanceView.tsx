/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ContentPerformanceView: React.FC<{ data: any[] }> = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.lesson.substring(0, 15) + "...", // Shortening long names
    views: item.views
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
      <h3 className="text-lg font-semibold">Content Performance</h3>
      <p className="text-sm text-gray-500 mb-6">Views for top lessons</p>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: '#374151', color: '#fff' }} />
            <Legend />
            <Bar dataKey="views" fill="#8b5cf6" name="Views" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContentPerformanceView;