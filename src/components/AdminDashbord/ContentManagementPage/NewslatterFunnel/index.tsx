import type { JSX } from 'react';
import { useGetAdminDashboardQuery } from '@/redux/features/Admin/adminApi';
// import {
//   useGetUsageSummaryQuery,
//   useSyncIntegrationMutation
// } from '@/redux/features/IntegrationApi/integrationApi';
// import { IntegrationProvider } from '@/redux/features/IntegrationApi/integration.types';
// import { toast } from 'react-hot-toast';

export default function NewslatterFunnel(): JSX.Element {
  const { data: dashboardResponse, isLoading: isLoadingDashboard } = useGetAdminDashboardQuery();
  // const { data: usageResponse, isLoading: isLoadingUsage, refetch: refetchUsage } = useGetUsageSummaryQuery();
  // const [syncIntegration, { isLoading: isSyncing }] = useSyncIntegrationMutation();

  const stats = dashboardResponse?.data?.stats;
  const breakdown = dashboardResponse?.data?.subscriptionBreakdown;
  // const usageData = usageResponse?.data;

  // Find Mailjet usage from the breakdown
  // const mailjetUsage = usageData?.breakdown.find(b => b.provider === IntegrationProvider.MAILJET);

  // const handleSyncNewsletter = async () => {
  //   try {
  //     await syncIntegration(IntegrationProvider.MAILJET).unwrap();
  //     toast.success('Newsletter data synchronized successfully!');

  //     // Refetch data to ensure UI is up-to-date
  //     refetchDashboard();
  //     refetchUsage();

  //     // Full page refresh as requested by user, with a small delay to show the toast
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, 1000);
  //   } catch (error: any) {
  //     toast.error(error?.data?.message || 'Failed to sync newsletter data');
  //   }
  // };

  const totalSubscribers = stats?.totalUsers || 0;
  const freeUsers = breakdown?.freeUsers || 0;
  const proSubscribers = breakdown?.proSubscribers || 0;
  const newsletterOnly = Math.max(0, totalSubscribers - freeUsers - proSubscribers);

  // Calculate percentages
  const freeRate = totalSubscribers > 0 ? ((freeUsers / totalSubscribers) * 100).toFixed(1) : '0';
  const proRate = totalSubscribers > 0 ? ((proSubscribers / totalSubscribers) * 100).toFixed(1) : '0';
  const freeToProRate = freeUsers > 0 ? ((proSubscribers / freeUsers) * 100).toFixed(1) : '0';

  return (
    <section id="page-newsletter" className="block">
      <div className="mb-8 flex justify-between items-start gap-6">
        <div className="flex-1">
          <h1 className="font-['Fraunces'] text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
            Newsletter Funnel
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-[700px]">
            Track newsletter subscribers and conversion metrics
          </p>
        </div>
        {/* <button
          onClick={handleSyncNewsletter}
          disabled={isSyncing}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
        >
          {isSyncing ? '🔄 Syncing...' : '🔄 Sync Newsletter'}
        </button> */}
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Total Subscribers</div>
          <div className="text-[32px] font-bold text-gray-900 dark:text-white mb-1">
            {isLoadingDashboard ? '...' : totalSubscribers.toLocaleString()}
          </div>
          <div className="text-sm font-semibold text-green-600 dark:text-green-400">↑ From all channels</div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Newsletter → Free</div>
          <div className="text-[32px] font-bold text-gray-900 dark:text-white mb-1">{freeRate}%</div>
          <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">Conversion to registration</div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Free → Pro</div>
          <div className="text-[32px] font-bold text-gray-900 dark:text-white mb-1">{freeToProRate}%</div>
          <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">Upgrade velocity</div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Newsletter → Pro</div>
          <div className="text-[32px] font-bold text-gray-900 dark:text-white mb-1">{proRate}%</div>
          <div className="text-sm font-semibold text-green-600 dark:text-green-400">Final conversion rate</div>
        </div>
      </div>

      {/* Grid 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-7 shadow-sm mb-6">
          <h3 className="font-['Fraunces'] text-xl font-bold mb-1.5 text-gray-900 dark:text-white">
            Subscriber Segments
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Breakdown by user status</p>
          <div className="grid gap-4 mt-5">
            <div className="flex justify-between items-center text-gray-900 dark:text-gray-100">
              <span>Newsletter Only</span>
              <span className="font-bold">{isLoadingDashboard ? '...' : newsletterOnly.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-gray-900 dark:text-gray-100">
              <span>Free Users</span>
              <span className="font-bold">{isLoadingDashboard ? '...' : freeUsers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-gray-900 dark:text-gray-100">
              <span>Pro Subscribers</span>
              <span className="font-bold">{isLoadingDashboard ? '...' : proSubscribers.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-7 shadow-sm mb-6">
          <h3 className="font-['Fraunces'] text-xl font-bold mb-1.5 text-gray-900 dark:text-white">
            Email Infrastructure (Mailjet)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Real-time API performance</p>
          {isLoadingUsage ? (
            <div className="animate-pulse flex space-y-4 flex-col mt-5">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ) : mailjetUsage ? (
            <div className="grid gap-4 mt-5">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total API Calls</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{mailjetUsage.requestCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Infrastructure Cost</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">${mailjetUsage.totalCostUsd.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
                <span className="text-green-600 dark:text-green-400 font-bold">● System Active</span>
              </div>
            </div>
          ) : (
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-center">
              <p className="text-sm text-gray-500">No Mailjet usage data found for this cycle.</p>
              <button
                onClick={handleSyncNewsletter}
                className="mt-2 text-xs text-blue-600 font-bold hover:underline"
              >
                Trigger Sync
              </button>
            </div>
          )}
        </div> */}
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-7 shadow-sm mb-6">
        <h3 className="font-['Fraunces'] text-xl font-bold mb-1.5 text-gray-900 dark:text-white">
          Conversion Funnel
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Subscriber journey visualization</p>
        <div className="grid gap-4 mt-5">
          <div className="flex items-center gap-4">
            <div className="flex-[0_0_140px] font-semibold text-gray-900 dark:text-white">Newsletter Sign-up</div>
            <div
              className="flex-1 h-10 rounded-lg flex items-center px-4 text-white font-semibold"
              style={{
                background: 'linear-gradient(to right, #3b82f6, #dbeafe)'
              }}
            >
              {totalSubscribers} (100%)
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-[0_0_140px] font-semibold text-gray-900 dark:text-white">Free Registration</div>
            <div
              className="flex-1 h-9 rounded-lg flex items-center px-4 text-white font-semibold"
              style={{
                background: 'linear-gradient(to right, #3b82f6, #93c5fd)',
                maxWidth: `${Math.max(10, parseFloat(freeRate))}%`
              }}
            >
              {freeUsers} ({freeRate}%)
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-[0_0_140px] font-semibold text-gray-900 dark:text-white">Pro Upgrade</div>
            <div
              className="flex-1 h-8 rounded-lg flex items-center px-4 text-white font-semibold"
              style={{
                background: 'linear-gradient(to right, #2563eb, #bfdbfe)',
                maxWidth: `${Math.max(5, parseFloat(proRate))}%`
              }}
            >
              {proSubscribers} ({proRate}%)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

