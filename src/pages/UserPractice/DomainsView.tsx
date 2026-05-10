import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setTier, setDomain } from '@/store/Slices/PracticeSlice/PracticeSlice';
import { Tier } from './types';
import { DOMAINS } from './constants';
import { useNavigate } from 'react-router-dom';
import type { JSX } from 'react';

import { useParams } from 'react-router-dom';


import { useGetGroupedLessonsQuery } from '@/redux/features/lesson/lessonPractice/lessonPracticeApi';

export default function DomainsView(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: aigroupdata } = useGetGroupedLessonsQuery({});

  const state = useSelector((state: RootState) => state.practice);
  const params = useParams();
  const { level, type, taskId } = params;

  // Find the active level in the API data
  const activeLevelData = aigroupdata?.data?.find((item: any) => {
    const levelLow = item.level_id.toLowerCase();
    const targetPath = levelLow === 'b1c' ? 'citizenship' : levelLow === 'b1' ? 'standard' : levelLow;
    return level?.toLowerCase() === targetPath || level?.toLowerCase() === levelLow;
  });

  // Find the specific practice (skill) in that level
  const activePractise = activeLevelData?.practises?.find((p: any) => p.skill.toLowerCase() === type?.toLowerCase());

  // Find the specific task
  const activeTask = activePractise?.tasks?.find((t: any) => t.tasks_id === taskId);

  // Extract domains from the active task
  const apiDomains = useMemo(() => activeTask?.domains || [], [activeTask]);

  const filteredDomains = useMemo(() => {
    if (apiDomains.length === 0) return [];

    // Known mappings between local IDs and API names
    const mapping: Record<string, string> = {
      'Salute': 'HEALTH',
      'Lavoro': 'WORK',
      'Burocrazia': 'BUREAUCRACY',
      'Abitazione': 'HOUSING',
      'Educazione': 'EDUCATION',
      'Commercio': 'COMMERCE',
      'Cultura': 'CULTURE',
      'Societa': 'SOCIETY'
    };

    return DOMAINS.map(d => {
      const mappedName = mapping[d.id] || d.en.toUpperCase();
      const apiEntry = apiDomains.find((ad: any) => ad.name.toUpperCase() === mappedName);

      if (!apiEntry) return null;

      return {
        ...d,
        isProFromAPI: apiEntry.is_pro // Use API's pro status
      };
    }).filter((d): d is any => d !== null);
  }, [apiDomains]);

  const freeIndex = useMemo(() => {
    if (filteredDomains.length === 0) return -1;
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    return dayOfYear % filteredDomains.length;
  }, [filteredDomains]);

  const onSetTier = (tier: Tier) => {
    dispatch(setTier(tier));
  };

  const launchTest = (domainId: string, domain: string) => {
    const domainObj = filteredDomains.find(d => d.id === domainId);
    if (domainObj) {
      dispatch(setDomain({ en: domainObj.en, it: domainObj.it }));
      navigate(`/user/practice/${type}/test?level=${level}&task=${taskId}&domain=${domain}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 p-6 lg:p-10 overflow-y-auto [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-bg-main [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 z-50 relative cursor-pointer p-2 rounded-lg transition-colors duration-200 hover:bg-white/10">
          <i className="fas fa-arrow-left"></i> ←Back
        </button>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 dark:text-white">Select Domain</h2>
            <p className="text-slate-500 text-sm">Choose context. Unlock specific domains with Pro.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button onClick={() => onSetTier('Free')} className={`inline-block px-4 py-2 rounded-lg text-[0.875rem] font-bold transition-all duration-200 ${state.tier === 'Free' ? 'dark:bg-blue-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-white/5 text-text-secondary'}`}>Free</button>
            <button onClick={() => onSetTier('Pro')} className={`inline-block px-4 py-2 rounded-lg text-[0.875rem] font-bold transition-all duration-200 ${state.tier === 'Pro' ? 'dark:bg-blue-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-white/5 text-text-secondary'}`}>Pro <i className="fas fa-crown text-yellow-400 ml-1"></i></button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 ">
          {filteredDomains.map((d, index) => {
            const isFreeToday = index === freeIndex;
            // A domain is locked if: 
            // 1. User is on Free tier AND 
            // 2. The domain is NOT the free one of the day OR it is explicitly marked as pro in API
            const isLocked = state.tier === 'Free' && !isFreeToday && d.isProFromAPI;

            // domain items 
            return (
              <div
                key={d.id}
                onClick={() => isLocked ? alert('Upgrade to Pro to unlock specific domains!') : launchTest(d.id, d.en)}
                className={`group p-6 rounded-2xl flex flex-col items-center gap-4 transition-all duration-300 relative overflow-hidden
                           bg-white border border-slate-200 shadow-sm
                           dark:bg-slate-900/40 dark:border-white/5 dark:shadow-none
                           ${isLocked 
                             ? 'opacity-60 cursor-not-allowed filter grayscale-[0.5]' 
                             : 'cursor-pointer hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 dark:hover:bg-slate-800/60'
                           }`}
              >
                {/* Lock Overlay */}
                {isLocked && (
                  <div className="absolute inset-0 bg-slate-900/10 dark:bg-bg-main/70 flex items-center justify-center z-10 backdrop-blur-[1px]">
                    <i className="fas fa-lock text-3xl text-yellow-400 drop-shadow-md"></i>
                  </div>
                )}

                <div className="text-4xl group-hover:scale-110 transition-transform duration-300 transform-gpu">
                  {d.icon}
                </div>

                <div className="flex flex-col items-center text-center">
                  <span className="font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                    {d.en}
                  </span>
                  <span className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium italic uppercase tracking-wider">
                    {d.it}
                  </span>
                  
                  {isFreeToday && state.tier === 'Free' && (
                    <div className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full mt-3 border border-emerald-200 dark:border-emerald-500/40 flex items-center gap-1 shadow-sm">
                      <i className="fas fa-calendar-day"></i> 
                      <span>Free Today</span>
                    </div>
                  )}
                </div>

                {/* Hover Indicator */}
                {!isLocked && (
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fas fa-play text-[10px] text-blue-500/50"></i>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

