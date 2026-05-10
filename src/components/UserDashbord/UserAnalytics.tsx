import React from "react";
import {
  Mic,
  Pencil,
  Headphones,
  TrendingUp,
  ArrowUpRight,
  BookA,
  Sparkles,
} from "lucide-react";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import timeicon from "../../assets/Dashbord/timeicon.svg";
import fireicon from "../../assets/Dashbord/fireicon2.svg";
import bookicon from "../../assets/Dashbord/bookopen.svg";
import tergeticon from "../../assets/Dashbord/tergeticon.svg";
import { useGetAdvancedAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { Link } from "react-router-dom";

// Summary Card
interface SummaryCardProps {
  title: string;
  value: string;
  icon: string | undefined;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon }) => (
  <div className="flex justify-between p-4 items-start bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex flex-col">
      <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300">
        {title}
      </p>
      <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
        {value}
        {""}
      </div>
    </div>
    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 animate-pulse">
      {icon ? (
        <img src={icon} alt="Icon" className="w-6 h-6 sm:w-8 sm:h-8" />
      ) : null}
    </div>
  </div>
);

// Skeleton for Summary Card
const SummaryCardSkeleton = () => (
  <div className="flex justify-between p-4 items-start bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="flex flex-col">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
    </div>
    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
  </div>
);

// Weekly Bar
interface WeeklyBarProps {
  day: string;
  accuracy: number;
  minutes: number;
  dailyGoalMinutess: number;
}

const WeeklyBar: React.FC<WeeklyBarProps> = ({
  day,
  accuracy,
  minutes,
  dailyGoalMinutess,
}) => (
  <div className="mb-4 border rounded-xl border-[#EBEBEB] p-3 dark:bg-gray-800">
    <div className="flex justify-between items-center text-xs sm:text-sm mb-3">
      <div className="font-semibold text-[#585858] dark:text-gray-300">
        {day}
      </div>
      <div
        className={`font-medium ${
          accuracy >= 70 ? "text-green-600" : "text-[#0E9F6E]"
        }`}
      >
        {accuracy}% Accuracy
      </div>
    </div>

    {/* Fixed ProgressBar */}
    <ProgressBar
      current={minutes}
      total={dailyGoalMinutess} // Use the goal as total
      color="bg-black" // or better: bg-green-500 or bg-blue-600
      height="h-3" // slightly taller for visibility
      rounded="rounded-full"
    />

    <div className="flex mt-3 justify-between text-[10px] sm:text-xs text-gray-500 dark:text-gray-300">
      <span>{minutes} min</span>
      <span>{dailyGoalMinutess} min goal</span>
    </div>
  </div>
);

// Weekly Bar Skeleton
const WeeklyBarSkeleton = () => (
  <div className="mb-4 border rounded-xl border-[#EBEBEB] p-3 dark:bg-gray-800 animate-pulse">
    <div className="flex justify-between items-center mb-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
    </div>
    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-3"></div>
    <div className="flex justify-between">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
    </div>
  </div>
);

// Skill Progress Card
const skillConfig: Record<
  string,
  { name: string; icon: React.ReactNode; color: string; bgGradient: string }
> = {
  reading: {
    name: "Reading",
    icon: <BookA className="w-6 h-6 text-white" />,
    color: "blue",
    bgGradient: "from-blue-500 to-blue-600",
  },
  listening: {
    name: "Listening",
    icon: <Headphones className="w-6 h-6 text-white" />,
    color: "orange",
    bgGradient: "from-orange-500 to-orange-600",
  },
  writing: {
    name: "Writing",
    icon: <Pencil className="w-6 h-6 text-white" />,
    color: "green",
    bgGradient: "from-green-500 to-green-600",
  },
  speaking: {
    name: "Speaking",
    icon: <Mic className="w-6 h-6 text-white" />,
    color: "purple",
    bgGradient: "from-purple-500 to-purple-600",
  },
};

// New SkillProgressCard component
interface SkillProgressCardProps {
  item: {
    skillArea: string;
    cefrLevel: string;
    confidenceLower: number;
    confidenceUpper: number;
    confidenceLevel: "LOW" | "MEDIUM" | "HIGH";
    performanceTrend: "improving" | "stable" | "declining";
    sessionsAnalyzed: number;
    message: string;
  };
}

const SkillProgressCard: React.FC<SkillProgressCardProps> = ({ item }) => {
  const config = skillConfig[item.skillArea] || skillConfig.reading;

  const getConfidenceColor = () => {
    switch (item.confidenceLevel) {
      case "HIGH":
        return "text-green-600 bg-green-100";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-100";
      case "LOW":
      default:
        return "text-red-600 bg-red-100";
    }
  };

  const getTrendIcon = () => {
    switch (item.performanceTrend) {
      case "improving":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "declining":
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      case "stable":
      default:
        return <div className="w-4 h-4 border-t-2 border-gray-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${config.bgGradient}`}
        >
          {config.icon}
        </div>
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getConfidenceColor()}`}
          >
            {item.confidenceLevel}
          </span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        {config.name}
      </h3>
      <p className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 mt-1">
        {item.cefrLevel}
      </p>

      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        {item.sessionsAnalyzed} session{item.sessionsAnalyzed !== 1 ? "s" : ""}{" "}
        completed
      </p>

      {/* Confidence Range Progress Bar */}
      <div className="mt-5">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Confidence Range</span>
          <span>
            {item.confidenceLower}% – {item.confidenceUpper}%
          </span>
        </div>
        <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          {/* Solid confidence (lower bound) */}
          <div
            className={`absolute left-0 top-0 h-full bg-gradient-to-r ${config.bgGradient} opacity-90`}
            style={{ width: `${item.confidenceLower}%` }}
          />
          {/* Potential confidence (upper bound extension) */}
          <div
            className={`absolute top-0 h-full bg-gradient-to-r ${config.bgGradient} opacity-30`}
            style={{
              left: `${item.confidenceLower}%`,
              width: `${item.confidenceUpper - item.confidenceLower}%`,
            }}
          />
        </div>
      </div>

      {/* Motivational message */}
      <p className="mt-4 text-sm italic text-gray-600 dark:text-gray-300">
        {item.message}
      </p>
    </div>
  );
};
// Skill Card Skeleton
const SkillCardSkeleton = () => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 dark:bg-gray-800 h-full animate-pulse">
    <div className="flex justify-between items-start mb-3">
      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
  </div>
);

// Achievement Item
interface AchievementItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const AchievementItem: React.FC<AchievementItemProps> = ({
  icon,
  title,
  subtitle,
}) => (
  <div className="flex items-center p-3 bg-gray-50 rounded-lg mb-2 dark:bg-gray-700">
    <div className="mr-3 text-gray-600 dark:text-gray-300">{icon}</div>
    <div>
      <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">
        {title}
      </p>
      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
        {subtitle}
      </p>
    </div>
  </div>
);

// Achievement Skeleton
const AchievementSkeleton = () => (
  <div className="flex items-center p-3 bg-gray-50 rounded-lg mb-2 dark:bg-gray-700 animate-pulse">
    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full mr-3"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-40 mb-2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
    </div>
  </div>
);

// Recent Session Item
interface RecentSessionItemProps {
  title: string;
  time: string;
  accuracy: string;
}

const RecentSessionItem: React.FC<RecentSessionItemProps> = ({
  title,
  time,
  accuracy,
}) => {
  const accuracyNumber = parseInt(accuracy.replace("%", ""), 10);

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 mb-2 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center">
        <div className="mr-3 text-indigo-600 dark:text-indigo-400"></div>
        <div>
          <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white">
            {title}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            {time}
          </p>
        </div>
      </div>
      <span
        className={`text-xs sm:text-sm font-bold ${
          accuracyNumber >= 90 ? "text-green-600" : "text-blue-600"
        }`}
      >
        {accuracy}
      </span>
    </div>
  );
};

// Recent Session Skeleton
const RecentSessionSkeleton = () => (
  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 animate-pulse">
    <div className="flex items-center flex-1">
      <div className="mr-3 w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
    <div className="h-5 w-12 bg-gray-200 dark:bg-gray-600 rounded"></div>
  </div>
);

// Main Component
export const UserAnalytics: React.FC = () => {
  const { data, isLoading } = useGetAdvancedAnalyticsQuery({});
  const { data: userData } = useGetMeQuery({});

  const weeklyProgress = data?.data?.weeklyPerformance || [];
  const skillProgres = data?.data?.skillProgress || [];
  const recentSessionss = data?.data?.recentSessions || [];
  const myRecentAchievements = data?.data?.recentAchievements;
  const dailyGoalMinutess = userData?.data?.dailyGoalMinutes || 0;

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Advanced Analytics rr
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base">
        Track your progress and achievements in Italian learning
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 sm:mb-10">
        {isLoading ? (
          <>
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
          </>
        ) : (
          <>
            <SummaryCard
              title="This Week"
              value={
                data?.data?.thisWeekMinutes
                  ? `${data.data.thisWeekMinutes}m`
                  : "0m"
              }
              icon={timeicon}
            />
            <SummaryCard
              title="Current Streak"
              value={
                data?.data?.currentStreak
                  ? `${data.data.currentStreak} Days`
                  : "0 Days"
              }
              icon={fireicon}
            />
            <SummaryCard
              title="Avg. Accuracy"
              value={
                data?.data?.averageAccuracy
                  ? `${data.data.averageAccuracy}%`
                  : "0%"
              }
              icon={tergeticon}
            />
            <SummaryCard
              title="Total Lessons"
              value={data?.data?.totalLessons?.toString() || "0"}
              icon={bookicon}
            />
          </>
        )}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Weekly Performance */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800">
            <h2 className="text-lg sm:text-xl font-bold dark:text-white text-gray-900 flex items-center mb-3 sm:mb-4">
              <TrendingUp className="w-4 h-4 text-black dark:text-white sm:w-5 sm:h-5 text-indigo-600 mr-2" />
              Weekly Performance
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6">
              Study time and accuracy over the past week
            </p>
            <div className="space-y-4">
              {isLoading ? (
                <>
                  <WeeklyBarSkeleton />
                  <WeeklyBarSkeleton />
                  <WeeklyBarSkeleton />
                  <WeeklyBarSkeleton />
                  <WeeklyBarSkeleton />
                  <WeeklyBarSkeleton />
                  <WeeklyBarSkeleton />
                </>
              ) : weeklyProgress.length > 0 ? (
                weeklyProgress.map((item: any) => (
                  <WeeklyBar
                    key={item.day}
                    day={item.day}
                    accuracy={item.accuracy}
                    minutes={item.minutes}
                    dailyGoalMinutess={dailyGoalMinutess}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No weekly data yet
                </p>
              )}
            </div>
          </div>

          {/* Skill Progress */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center   ">
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mr-2 mb-2" />
              Skill Progress
            </h2>
            <h3 className="text-base text-gray-500 dark:text-gray-400 sm:mb-6 ml-7">CEFR Confidence Level Analysis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isLoading ? (
                Array(4)
                  .fill(0)
                  .map((_, i) => <SkillCardSkeleton key={i} />)
              ) : skillProgres.length > 0 ? (
                skillProgres.map((item: any) => (
                  <SkillProgressCard key={item.skillArea} item={item} />
                ))
              ) : (
                <p className="col-span-2 text-center text-gray-500 dark:text-gray-400 py-8">
                  No skill progress data yet. Start practicing to see your CEFR
                  levels!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Achievements */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800">
            <h2 className="text-lg dark:text-white sm:text-xl font-bold text-gray-900 mb-4">
              Recent Achievements
            </h2>
            <div className="space-y-2">
              {isLoading ? (
                <>
                  <AchievementSkeleton />
                  <AchievementSkeleton />
                  <AchievementSkeleton />
                </>
              ) : myRecentAchievements?.length > 0 ? (
                myRecentAchievements.map((achievement: any, index: number) => (
                  <AchievementItem
                    key={index}
                    icon={<span className="text-2xl">{achievement.icon}</span>}
                    title={achievement.title}
                    subtitle={achievement.date}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No achievements yet. Keep practicing!
                </p>
              )}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800">
            <h2 className="text-lg  dark:text-white sm:text-xl font-bold text-gray-900 mb-4">
              Recent Sessions
            </h2>
            <div className="space-y-3">
              {isLoading ? (
                <>
                  <RecentSessionSkeleton />
                  <RecentSessionSkeleton />
                  <RecentSessionSkeleton />
                  <RecentSessionSkeleton />
                </>
              ) : recentSessionss.length > 0 ? (
                recentSessionss.map((session: any, index: number) => (
                  <RecentSessionItem
                    key={index}
                    title={session.title}
                    time={session.date}
                    accuracy={session.accuracy}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                  No recent sessions yet. Start practicing!
                </p>
              )}
            </div>

            <Link to={"/user/practice"} className="w-full mt-6 py-2.5 sm:py-3 bg-indigo-600 cursor-pointer text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center text-sm sm:text-base">
              <Sparkles size={18} className="mr-2" />
              Start New Session
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;
