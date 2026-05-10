import React from "react";
import {  TrendingUp } from "lucide-react";
// import { useGetMySubscriptionQuery } from "@/redux/features/subscriptions/subscriptionsApi";
 
interface Achievement {
  title: string; // ← changed from "name"
  icon: string; // ← now a string emoji (like "👋"), not a React component
  date: string; // ← changed from "time"
}

interface AchievementsCardProps {
  achievements: Achievement[];
}

export const UserAchievementsCard: React.FC<AchievementsCardProps> = ({

 
  achievements,
}) => {

  // const { data } = useGetMySubscriptionQuery();
  // const prodata = data?.data?.isPro;
  // const hasUsedTrial = data?.data?.hasUsedTrial;
  // const isDisabled = prodata === true && hasUsedTrial === true;

  return (
    (
      <div className="bg-white dark:bg-[#34485D] rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Recent Achievements
        </h3>
    
        <div className="space-y-3">
          {achievements.map((ach) => (
            <div
              key={ach.title}
              className={`flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition border border-gray-100 dark:border-gray-700`}
            >
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 mr-3">
                {/* Render emoji directly since icon is a string */}
                <span className="text-2xl">{ach.icon}</span>
              </div>
    
              <div className="flex-grow">
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {ach.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {ach.date}
                </p>
              </div>
    
              <TrendingUp className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </div>
          ))}
        </div>
    
        {/* <Link to="/user/achievements" className="w-full border cursor-pointer border-[#333] text-[#333] mt-8 font-semibold py-3 rounded-xl hover:bg-gray-50 dark:border-gray-300 dark:text-gray-200 dark:hover:bg-gray-800 transition duration-150">
          View All Achievements
        </Link> */}
      </div>
    )
  )
};
