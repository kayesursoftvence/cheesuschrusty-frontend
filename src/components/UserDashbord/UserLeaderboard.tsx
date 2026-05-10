/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Flame, Star, BookOpen, Trophy } from 'lucide-react';
import { FaHeadphonesAlt, FaPenFancy, FaMicrophone } from "react-icons/fa";
import { useGetLeaderboardQuery } from '@/redux/features/studyPlan/studyPlanApi';

const UserLeaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alltime' | 'daily' | 'weekly' | 'monthly'>('alltime');

  const { data, isLoading, isError } = useGetLeaderboardQuery(activeTab);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center p-10 text-red-500 font-semibold">Failed to load leaderboard.</div>
    );
  }

  const { yourPosition, top10Learners, yourSkill, quickStats } = data.data;

  // Type safety handles
  const myRank = yourPosition?.rank ?? 0;
  const myTotalXp = yourPosition?.totalXp ?? 0;
  const myStreak = yourPosition?.dailyStreak ?? 0;
  const myPoints = yourPosition?.periodPoints ?? 0;

  const getSkillConfig = (area: string) => {
    const name = area.toLowerCase();
    if (name === 'reading') return { icon: BookOpen, color: "text-[#0B5FFF]", bg: "bg-[#0B5FFF]" };
    if (name === 'listening') return { icon: FaHeadphonesAlt, color: "text-[#FF6E51]", bg: "bg-[#FF6E51]" };
    if (name === 'writing') return { icon: FaPenFancy, color: "text-[#0E9F6E]", bg: "bg-[#0E9F6E]" };
    if (name === 'speaking') return { icon: FaMicrophone, color: "text-[#C535FE]", bg: "bg-[#C535FE]" };
    return { icon: Star, color: "text-gray-500", bg: "bg-gray-500" };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 md:p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Pro Leader Board</h1>
          <p className="text-sm text-gray-500">Compete with premium learners worldwide</p>
        </div>

      </header>

      {/* User Status Banner */}
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-800 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-400 rounded-full shadow-sm">
            <Star className="text-white fill-white" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-green-700 uppercase">Your Position</p>
            <h2 className="text-4xl font-black text-green-900 dark:text-green-400">
              #{myRank > 0 ? myRank : 'N/A'}
            </h2>
          </div>
        </div>

        <div className="flex gap-8 sm:gap-12">
          <div className="text-center">
            <p className="text-2xl font-bold text-black dark:text-white">{myTotalXp}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Total XP</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-black dark:text-white">{myStreak}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Streak</p>
          </div>
          <div className="text-center border-l pl-8 border-green-200">
            <p className="text-2xl font-bold text-black dark:text-white">{myPoints}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Points</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Column */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center p-5 border-b gap-4">
            <h3 className="font-bold text-gray-800 dark:text-white">Top 10 Learners</h3>
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
              {['alltime', 'daily', 'weekly', 'monthly'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t as any)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition ${activeTab === t
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {top10Learners.map((learner:any) => (
              <div key={learner.rank} className="flex items-center p-4 dark:hover:bg-gray-900 transition">
                <div className={`w-8 font-bold ${learner.rank <= 3 ? 'text-yellow-500' : 'text-gray-400'}`}>
                  {learner.rank === 1 ? <Trophy size={16} /> : `#${learner.rank}`}
                </div>
                <img
                  src={learner.avatar ?? `https://ui-avatars.com/api/?name=${learner.name}&background=random`}
                  className="w-10 h-10 rounded-full mr-4 object-cover"
                  alt={learner.name}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 dark:text-white truncate">{learner.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] dark:bg-[#FFFFFF] dark:text-black  px-1.5 py-0.5 rounded shadow font-bold uppercase">{learner.declaredLevel}</span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-500">
                      <Flame size={10} className="text-orange-500" /> {learner.streak} streak
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-gray-900 dark:text-white">{learner.points}</p>
                  <p className="text-[9px] text-gray-400 uppercase font-bold">Points</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold mb-6">Your Skills</h3>
            {yourSkill.map((skill:any) => {
              const conf = getSkillConfig(skill.skillArea);
              return (
                <div key={skill.skillArea} className="mb-4">
                  <div className="flex justify-between mb-1 items-center">
                    <div className="flex items-center gap-2">
                      <conf.icon className={conf.color} size={14} />
                      <span className="capitalize font-bold text-xs">{skill.skillArea}</span>
                    </div>
                    <span className="font-bold text-xs">{skill.points}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full">
                    <div className={`${conf.bg} h-full rounded-full`} style={{ width: `${skill.points}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm py-2 border-b">
                <span className="text-gray-500">Period Points</span>
                <span className="font-bold">{quickStats.periodPoints}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b">
                <span className="text-gray-500">Total Badges</span>
                <span className="font-bold">{quickStats.totalBadges}</span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-gray-500">Current Level</span>
                <span className="font-bold text-green-600">{quickStats.currentLevel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLeaderboard;