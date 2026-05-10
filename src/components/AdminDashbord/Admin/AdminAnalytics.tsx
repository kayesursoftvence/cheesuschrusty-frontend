import React, { useState, useMemo } from 'react';
// import { useGetAdminAnalyticsQuery } from './analyticsApi';
import StatCard from '../Analytics/componentes/StatCard';
import TabButton from '../Analytics/componentes/TabButton';
import { UserIcon, CrownIcon, ChartPieIcon, ThumbsUpIcon } from '../Analytics/componentes/icons';
import { useGetAdminAnalyticsQuery } from '@/redux/features/AdminAnalysApi/AdminAnalysApi';
import UserEngagementView from '../Analytics/views/UserEngagementView';
import ContentPerformanceView from '../Analytics/views/ContentPerformanceView';
import LearningProgressView from '../Analytics/views/LearningProgressView';
import UserRetentionView from '../Analytics/views/UserRetentionView';
// import UserEngagementView from './views/UserEngagementView';
// import ContentPerformanceView from './views/ContentPerformanceView';
// import LearningProgressView from './views/LearningProgressView';
// import UserRetentionView from './views/UserRetentionView';

type Tab = 'User Engagement' | 'Content Performance' | 'Learning Progress' | 'User Retention';

const AnalyticsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('User Engagement');
  const { data: response, isLoading, isError } = useGetAdminAnalyticsQuery();

  const analyticsData = response?.data;

  const statCards = useMemo(() => {
    if (!analyticsData) return [];
    return [
      { title: 'Daily Active Users', value: analyticsData.stats.dailyActiveUsers.toString(), icon: <ThumbsUpIcon />, iconBg: 'bg-orange-100', iconColor: 'text-orange-500' },
      { title: 'Avg. Study Time', value: analyticsData.stats.avgStudyTime, icon: <CrownIcon />, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-500' },
      { title: 'Content Completion', value: analyticsData.stats.contentCompletion, icon: <ChartPieIcon />, iconBg: 'bg-green-100', iconColor: 'text-green-500' },
      { title: 'User Retention', value: analyticsData.stats.userRetention, icon: <UserIcon />, iconBg: 'bg-blue-100', iconColor: 'text-blue-500' },
    ];
  }, [analyticsData]);

  if (isLoading) return <div className="p-10 text-center">Loading Analytics...</div>;
  if (isError) return <div className="p-10 text-center text-red-500">Error loading data.</div>;

  const tabs: Tab[] = ['User Engagement', 'Content Performance', 'Learning Progress', 'User Retention'];

  return (
    <div className="min-h-screen p-4 sm:p-6 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <div className="mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
          <p className="text-gray-500 text-sm dark:text-gray-400">Real-time platform performance overview.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(card => <StatCard key={card.title} {...card} />)}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-1 mb-8 dark:bg-gray-800 overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            {tabs.map(tab => (
              <TabButton key={tab} label={tab} isActive={activeTab === tab} onClick={() => setActiveTab(tab)} />
            ))}
          </div>
        </div>

        <div>
          {activeTab === 'User Engagement' && <UserEngagementView data={analyticsData} />}
          {activeTab === 'Content Performance' && <ContentPerformanceView data={analyticsData.contentPerformance} />}
          {activeTab === 'Learning Progress' && <LearningProgressView data={analyticsData} />}
          {activeTab === 'User Retention' && <UserRetentionView insights={analyticsData.keyInsights} stats={analyticsData.stats} />}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsApp;