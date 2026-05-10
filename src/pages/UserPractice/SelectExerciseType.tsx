import { useMemo } from 'react';
import { motion } from 'framer-motion';
// import { TaskType } from './types';
import { TASK_REGISTRY } from './constants';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { JSX } from 'react';

type SkillKey = keyof typeof TASK_REGISTRY;

import { useGetGroupedLessonsQuery } from '@/redux/features/lesson/lessonPractice/lessonPracticeApi';

export default function SelectExerciseType(): JSX.Element {

  const navigate = useNavigate();
  const { type, level } = useParams();
  const { data: aigroupdata } = useGetGroupedLessonsQuery({});

  const capitalize = (str: string) => str ? str[0].toUpperCase() + str.slice(1) : str;
  const _type = capitalize(type as string);

  const levelKey = (level ?? 'STANDARD').toUpperCase();

  // Find the active level in the API data
  const activeLevelData = aigroupdata?.data?.find((item: any) => {
    const levelLow = item.level_id.toLowerCase();
    const targetPath = levelLow === 'b1c' ? 'citizenship' : levelLow === 'b1' ? 'standard' : levelLow;
    return level?.toLowerCase() === targetPath || level?.toLowerCase() === levelLow;
  });

  // Find the specific practice (skill) in that level
  const activePractise = activeLevelData?.practises?.find((p: any) => p.skill.toLowerCase() === type?.toLowerCase());

  // Filter types based on tasks returned from API
  const availableTypes = useMemo(() => {
    if (!activePractise?.tasks) return [];

    return activePractise.tasks.map((apiTask: any) => {
      // Lookup base metadata from local TASK_REGISTRY using tasks_id
      const skillTasks = TASK_REGISTRY[_type as SkillKey] || [];
      const localTask = skillTasks.find(t => t.id === apiTask.tasks_id);

      return {
        ...localTask,
        ...apiTask, // API data (topic, schema, etc) overrides local if needed
        id: apiTask.tasks_id,
        name: apiTask.topic || localTask?.name || apiTask.tasks_id, // prioritize topic as name
      };
    });
  }, [activePractise, _type]);

  const displayLevel = activeLevelData?.level_id || levelKey;

  console.log(levelKey)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 p-6 lg:p-10 overflow-y-auto [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-bg-main [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      <div className="w-full mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 z-50 relative cursor-pointer p-2 rounded-lg transition-colors duration-200 hover:bg-white/10"
        >
          <i className="fas fa-arrow-left"></i> ← Back
        </button>

        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
          {_type}: Select Exercise Type
        </h2>

        <div className="space-y-4">

          {/* render Item  */}
          {availableTypes.map((type: any) => {
            const isStdOnly = type.mode === 'STANDARD_ONLY';
            const displayTime = (type.time as Record<string, number>)?.[levelKey] || type.time?.['STANDARD'] || 0;
            const fullId = `${type.id}_${displayLevel}`;
            const displayLayout = (type.layouts as Record<string, string>)?.[levelKey] || type.layouts?.['STANDARD'] || 'N/A';
            console.log(type)
            return (
              <Link
                to={`/user/practice/${level}/${_type.toLowerCase()}/${type.id}/domains`}
                key={type.id}
                className="group p-6 rounded-2xl flex justify-between items-center cursor-pointer 
                           bg-white border border-slate-200 shadow-sm
                           dark:bg-slate-900/40 dark:border-white/5 dark:shadow-none
                           hover:border-blue-500 hover:shadow-lg hover:-translate-y-1
                           dark:hover:bg-slate-800/60 dark:hover:border-blue-500
                           transition-all duration-300 relative overflow-hidden"
              >
                {/* Background Accent Gradient (Visible on hover) */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-mono text-sm mb-1">
                    <span className="opacity-70">{fullId}</span>
                    {isStdOnly && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 px-2 py-0.5 rounded-full ml-3 font-bold border border-emerald-200 dark:border-emerald-500/20">
                        OFFICIAL STD
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300">
                    {type.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">Schema: {displayLayout}</span>
                  </div>
                </div>

                <div className="relative z-10 text-right">
                  <div className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-2 justify-end">
                    <i className="far fa-clock text-blue-500"></i>
                    <span>Rec: ~{displayTime}m</span>
                  </div>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <i className="fas fa-chevron-right text-blue-500"></i>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}