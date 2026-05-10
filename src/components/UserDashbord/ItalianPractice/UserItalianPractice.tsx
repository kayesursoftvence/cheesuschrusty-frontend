 
import React, { useEffect } from "react";
import { ClockIcon, TargetIcon } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import { GiBookmarklet } from "react-icons/gi";
// import { useGetMeQuery } from "@/redux/features/auth/authApi";
// import { useGetMySubscriptionQuery } from "@/redux/features/subscriptions/subscriptionsApi";
import { useGetPracticeAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";

import { StatCard } from "./components/StatCard";
import { DailyGoalProgress } from "./components/DailyGoalProgress";
import { SkillCard } from "./components/SkillCard";
import { usePracticeFlow } from "./hooks/usePracticeFlow";
import { SKILL_CONFIGS, DEFAULT_DAILY_GOAL, DEFAULT_TODAY_STATS } from "./constants";
import { SkillArea } from "./types";

const UserItalianPractice: React.FC = () => {
  const location = useLocation();
  // const { data: userData } = useGetMeQuery({});
  // const { data: subscriptionData } = useGetMySubscriptionQuery();
  const { data: practiceAnalytics, refetch } = useGetPracticeAnalyticsQuery({});
console.log(practiceAnalytics)
   const {
    loadingSkill,
    showLevelSelector,
    setShowLevelSelector,
    sessionLevels,
    handleLevelSelection,
    handlePracticeStart
  } = usePracticeFlow(refetch);

  const dailyGoalData = practiceAnalytics?.data?.dailyGoalProgress || DEFAULT_DAILY_GOAL;
  const todayStatsData = practiceAnalytics?.data?.todayStats || DEFAULT_TODAY_STATS;
  const practiceAreas = (practiceAnalytics?.data?.practiceAreas || []) as SkillArea[];

  useEffect(() => {
    console.log("[UserItalianPractice] Practice Analytics Data:", {
      fullData: practiceAnalytics,
      dailyGoalProgress: dailyGoalData,
      todayStats: todayStatsData,
      practiceAreasCount: practiceAreas.length,
      practiceAreas: practiceAreas
    });
  }, [practiceAnalytics, dailyGoalData, todayStatsData, practiceAreas,refetch ],);

  const skills = practiceAreas.map((area) => {
    const skillKey = area.skillArea.toLowerCase();
    const config = SKILL_CONFIGS[skillKey] || SKILL_CONFIGS.reading;
    
    if (!SKILL_CONFIGS[skillKey]) {
      console.warn(`[UserItalianPractice] No config found for skillArea: "${area.skillArea}". Falling back to reading.`);
    }

    return { 
      ...config, 
      subtitle: area.title, 
      progress: Math.min(100, area.progress),
      duration: "10 min" 
    };
  });

  useEffect(() => {
    console.log("[UserItalianPractice] Final Processed Skills:", skills);
  }, [skills]);

  // Ensure fresh analytics on mount and keep polling as a fallback
  // React.useEffect(() => {
  //   if (typeof refetch === 'function') {
  //     refetch();
  //     const id = setInterval(() => {
  //       try { refetch(); } catch (e) { /* ignore */ }
  //     }, 15000);
  //     return () => clearInterval(id);
  //   }
  //   return undefined;
  // }, [refetch]);

  const isNested = location.pathname.startsWith("/user/practice/") && location.pathname !== "/user/practice";
  const thisNested = location.pathname.startsWith("/freeuser/practice/") && location.pathname !== "/freeuser/practice";

  if (isNested || thisNested) return <Outlet />;

  return (
    <div className="min-h-screen p-3 sm:p-6 lg:p-10 dark:bg-gray-900 ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold dark:text-white mb-8">Practice Italian</h1>
        
        <DailyGoalProgress 
          currentMinutes={dailyGoalData.minutesToday} 
          totalMinutes={dailyGoalData.dailyGoal} 
          timeLeft={dailyGoalData.message} 
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Sessions" value={todayStatsData.sessions} icon={<GiBookmarklet />} />
          <StatCard title="Study Time" value={`${todayStatsData.studyTimeMinutes} min`} icon={<ClockIcon />} />
          <StatCard title="Accuracy" value={`${todayStatsData.averageAccuracy}%`} icon={<TargetIcon />} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
          {skills.map((skill, index) => (
            <SkillCard
              key={index}
              skill={skill}
              showLevelSelector={showLevelSelector === skill.title}
              loadingSkill={loadingSkill === skill.title}
              sessionLevel={sessionLevels[skill.title]}
              onLevelSelect={handleLevelSelection}
              onStartPractice={handlePracticeStart}
              onCancelSelection={setShowLevelSelector}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserItalianPractice;