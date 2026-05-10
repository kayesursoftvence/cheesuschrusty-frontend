
import { useGetAdminDashboardQuery } from '@/redux/features/Admin/adminApi';
import React from 'react';
 
const AdminSubscriptionBreakdown: React.FC = () => {
  const { data: dashboardData, isLoading } = useGetAdminDashboardQuery();

  if (isLoading) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-lg dark:bg-gray-800">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 md:pr-40 dark:text-gray-200">
          Subscription Breakdown
        </h2>
        <div className="space-y-3 sm:space-y-4">
          {[1, 2].map((_, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
              </div>
              <div className="text-right space-y-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-8"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const subscriptionData = dashboardData?.data.subscriptionBreakdown;
  if (!subscriptionData) return null;

  const totalUsers = subscriptionData.freeUsers + subscriptionData.proSubscribers;
  const freePercentage = totalUsers > 0 ? Math.round((subscriptionData.freeUsers / totalUsers) * 100) : 0;
  const proPercentage = totalUsers > 0 ? Math.round((subscriptionData.proSubscribers / totalUsers) * 100) : 0;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg dark:bg-gray-800">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 md:pr-40 dark:text-gray-200">
        Subscription Breakdown
      </h2>
      <div className="space-y-3 sm:space-y-4">
        {/* Free Users */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-700"></div>
            <span className="text-sm sm:text-base font-semibold text-[#696D77] dark:text-gray-300 whitespace-nowrap">
              Free Users
            </span>
          </div>
          <div className="text-right">
            <div className="font-semibold text-sm sm:text-base text-[#3C424E] dark:text-gray-200">
              {subscriptionData.freeUsers}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {freePercentage}%
            </div>
          </div>
        </div>

        {/* Pro Subscribers */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500"></div>
            <span className="text-sm sm:text-base font-semibold text-[#696D77] dark:text-gray-300 whitespace-nowrap">
              Pro Subscribers
            </span>
          </div>
          <div className="text-right">
            <div className="font-semibold text-sm sm:text-base text-[#3C424E] dark:text-gray-200">
              {subscriptionData.proSubscribers}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {proPercentage}%
            </div>
          </div>
        </div>

        {/* Premium Percentage (if you want to show it separately) */}
        {subscriptionData.premiumPercentage > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-500"></div>
              <span className="text-sm sm:text-base font-semibold text-[#696D77] dark:text-gray-300 whitespace-nowrap">
                Premium Percentage
              </span>
            </div>
            <div className="text-right">
              <div className="font-semibold text-sm sm:text-base text-[#3C424E] dark:text-gray-200">
                {subscriptionData.premiumPercentage}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriptionBreakdown;







// import React from 'react';

// const AdminSubscriptionBreakdown: React.FC = () => (
//   <div className="bg-white p-4 sm:p-6 rounded-lg dark:bg-gray-800">
//     <h2 className="text-xl sm:text-2xl font-semibold mb-4 md:pr-40 dark:text-gray-200">Subscription Breakdown</h2>
//     <div className="space-y-3 sm:space-y-4">
//       {/* Free Users */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2 sm:gap-3">
//           <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-700"></div>
//           <span className="text-sm sm:text-base font-semibold text-[#696D77] dark:text-gray-300 whitespace-nowrap">
//             Free Users
//           </span>
//         </div>
//         <div className="text-right">
//           <div className="font-semibold text-sm sm:text-base text-[#3C424E] dark:text-gray-200">10,245</div>
//           <div className="text-xs text-gray-500 dark:text-gray-400">51.2%</div>
//         </div>
//       </div>

//       {/* Premium Users */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2 sm:gap-3">
//           <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500"></div>
//           <span className="text-sm sm:text-base font-semibold text-[#696D77] dark:text-gray-300 whitespace-nowrap">
//             Premium Users
//           </span>
//         </div>
//         <div className="text-right">
//           <div className="font-semibold text-sm sm:text-base text-[#3C424E] dark:text-gray-200">8,241</div>
//           <div className="text-xs text-gray-500 dark:text-gray-400">48.8%</div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default AdminSubscriptionBreakdown;