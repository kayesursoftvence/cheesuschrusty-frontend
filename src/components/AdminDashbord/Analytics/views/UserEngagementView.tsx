/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const UserEngagementView: React.FC<{ data: any }> = ({ data }) => {
  // Generate Y-axis ticks: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50
  const yAxisTicks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

  // 1. Daily Activity Mapping
  const chartData = data?.dailyUserActivity?.map((item: any) => ({
    name: item.date,
    activeUsers: item.activeUsers
  })) || [];

  // 2. Learning Progress by Level Mapping (Dynamic)
  const progressByLevelData = data?.learningProgressByLevel?.map((item: any) => ({
    name: item.level,
    users: item.users,
    // Note: API te 'progress' field na thakle default 0 deya hoyeche
    progress: item.progress ?? 0
  })) || [];

  return (
    <div className="space-y-8">
      {/* Daily Activity Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Daily User Activity</h3>
        <p className="text-sm text-gray-500 mb-6 dark:text-gray-400">Active users over the past week</p>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#A0AEC0' }} stroke="#A0AEC0" />
              <YAxis 
                tick={{ fontSize: 12, fill: '#A0AEC0' }} 
                stroke="#A0AEC0"
                domain={[0, 30]}
                ticks={yAxisTicks}
              />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area
                type="monotone"
                dataKey="activeUsers"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Learning Progress by Level Bar Chart (Dynamic) */}
      <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Learning Progress by Level</h3>
        <p className="text-sm text-gray-500 mb-6 dark:text-gray-400">User distribution and average progress</p>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={progressByLevelData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#A0AEC0' }} stroke="#A0AEC0" />
              <YAxis tick={{ fontSize: 12, fill: '#A0AEC0' }} stroke="#A0AEC0" />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="users" fill="#8b5cf6" name="Users" radius={[4, 4, 0, 0]} />
              <Bar dataKey="progress" fill="#14b8a6" name="Progress" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserEngagementView;