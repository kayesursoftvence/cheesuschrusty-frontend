import { motion } from 'framer-motion';
import { useLocation, Outlet, Link } from 'react-router-dom';
import type { JSX } from 'react';
import { useGetGroupedLessonsQuery } from '@/redux/features/lesson/lessonPractice/lessonPracticeApi';


export default function PracticeLayout(): JSX.Element {
  const { data: aigroupdata } = useGetGroupedLessonsQuery({});
  console.log("aigroupdata", aigroupdata);
  console.log("aigroupdata", aigroupdata?.data);
  const { pathname } = useLocation();

  const activeLevel = aigroupdata?.data?.find((item: any) => {
    const levelLow = item.level_id.toLowerCase();
    const targetPath = levelLow === 'b1c' ? 'citizenship' : levelLow === 'b1' ? 'standard' : levelLow;
    return pathname.includes(targetPath);
  });



  console.log(aigroupdata)

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const activeSkills = activeLevel?.practises?.map((p: any) => capitalize(p.skill)) || [];

  const tabBase =
    'px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 flex items-center gap-3';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex-1 overflow-y-auto p-6 lg:p-10
                 bg-white text-slate-900
                 dark:bg-transparent dark:text-slate-100
                 [&::-webkit-scrollbar]:w-[6px]
                 [&::-webkit-scrollbar-track]:bg-slate-200
                 dark:[&::-webkit-scrollbar-track]:bg-slate-900
                 [&::-webkit-scrollbar-thumb]:bg-slate-400
                 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700
                 [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      <div className="w-full mx-auto">
        {/* Mode Switcher */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="inline-flex rounded-xl border p-1.5 shadow-sm
                       bg-white/90 border-slate-200
                       dark:bg-slate-900/80 dark:border-slate-800"
          >
            {aigroupdata?.data?.map((item: any) => {
              const levelLow = item.level_id.toLowerCase();
              // Mapping logic for current routing (best effort)
              // B1c -> citizenship, B1 -> standard
              const targetPath = levelLow === 'b1c' ? 'citizenship' : levelLow === 'b1' ? 'standard' : levelLow;
              const isActive = pathname.includes(targetPath);

              return (
                <Link
                  key={item.level_id}
                  to={`/user/practice/${targetPath}`}
                  className={`${tabBase} ${isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                    }`}
                >
                  <span
                    className="font-mono text-xs px-1.5 py-0.5 rounded border
                               bg-blue-100 text-blue-700 border-blue-200
                               dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-500/30"
                  >
                    IT
                  </span>
                  <span>
                    {item.level_id} {item.level_id.toLowerCase().includes('c') ? 'Cittadinanza' : 'Standard'}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div
          className="flex flex-col items-center mb-10 rounded-xl border border-dashed p-6
                     border-slate-300 bg-slate-50
                     dark:border-slate-500/30 dark:bg-slate-800/20"
        >
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-600 dark:text-emerald-400">
            <i className="fas fa-layer-group"></i>
            <strong>DEVELOPER HANDOFF:</strong> Dynamic UI rendering based on layout schema.
          </div>
        </div>

        <Outlet context={{ skills: activeSkills, level: activeLevel?.level_id }} />
      </div>
    </motion.div>
  );
}