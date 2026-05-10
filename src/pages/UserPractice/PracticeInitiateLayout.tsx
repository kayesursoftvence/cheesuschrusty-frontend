import { motion } from "framer-motion";
import { useState } from "react";

// Types
type Skill = 'Reading' | 'Listening' | 'Grammar' | 'Writing' | 'Speaking';
type ExamMode = 'CITIZENSHIP' | 'STANDARD';

// Exam configuration
const EXAM_CONFIG = {
  CITIZENSHIP: { 
    id: 'B1_CIT', 
    skills: ['Reading', 'Listening', 'Writing', 'Speaking'] as Skill[], 
    color: 'blue' 
  },
  STANDARD: { 
    id: 'B1_STD', 
    skills: ['Reading', 'Listening', 'Grammar', 'Writing', 'Speaking'] as Skill[], 
    color: 'emerald' 
  }
};

// Skill icons and colors
const SKILL_ICONS: Record<Skill, { icon: string; color: string }> = {
  Reading: { icon: 'fa-book-open', color: 'blue' },
  Listening: { icon: 'fa-headphones-alt', color: 'orange' },
  Grammar: { icon: 'fa-puzzle-piece', color: 'pink' },
  Writing: { icon: 'fa-pencil-alt', color: 'green' },
  Speaking: { icon: 'fa-microphone-alt', color: 'purple' }
};

// Utility: Get Tailwind classes based on skill color
const getSkillColorClasses = (color: string) => {
  const map = {
    blue: {
      border: 'border-l-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      text: 'text-blue-600 dark:text-blue-400',
      hover: 'hover:bg-blue-600'
    },
    orange: {
      border: 'border-l-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-500/10',
      text: 'text-orange-600 dark:text-orange-400',
      hover: 'hover:bg-orange-600'
    },
    pink: {
      border: 'border-l-pink-500',
      bg: 'bg-pink-50 dark:bg-pink-500/10',
      text: 'text-pink-600 dark:text-pink-400',
      hover: 'hover:bg-pink-600'
    },
    green: {
      border: 'border-l-green-500',
      bg: 'bg-green-50 dark:bg-green-500/10',
      text: 'text-green-600 dark:text-green-400',
      hover: 'hover:bg-green-600'
    },
    purple: {
      border: 'border-l-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-500/10',
      text: 'text-purple-600 dark:text-purple-400',
      hover: 'hover:bg-purple-600'
    },
  };
  return map[color as keyof typeof map] || map.blue;
};

export default function PracticeInitiateLayout() {
  const [mode, setMode] = useState<ExamMode>('CITIZENSHIP');

  const handleSwitchMode = (newMode: ExamMode) => {
    setMode(newMode);
  };

  const handleSelectSkill = (skill: Skill) => {
    console.log('Selected skill:', skill);
    // Navigate to next step (e.g. task types)
    // onSelectSkill(skill);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="
        flex-1 overflow-y-auto p-6 lg:p-10
        bg-slate-50 text-slate-900
        dark:bg-slate-950 dark:text-white
        [&::-webkit-scrollbar]:w-[6px]
        [&::-webkit-scrollbar-track]:bg-slate-200
        dark:[&::-webkit-scrollbar-track]:bg-gray-800
        [&::-webkit-scrollbar-thumb]:bg-slate-400
        dark:[&::-webkit-scrollbar-thumb]:bg-slate-700
        [&::-webkit-scrollbar-thumb]:rounded-full
      "
    >
      <div className="w-full mx-auto">
        {/* Mode Switcher */}
        <div
          className="
            flex flex-col items-center mb-10 p-6 rounded-xl
            border border-dashed
            border-slate-300/70 bg-white/80
            dark:border-slate-500/30 dark:bg-slate-800/20
            shadow-sm dark:shadow-none
          "
        >
          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
            <i className="fas fa-layer-group"></i>
            <strong>EXAM MODE</strong>
          </div>

          <div
            className="
              inline-flex bg-slate-100 border border-slate-200 rounded-xl p-1.5
              dark:bg-slate-900/80 dark:border-slate-800
            "
          >
            <button
              onClick={() => handleSwitchMode('CITIZENSHIP')}
              className={`
                px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 flex items-center gap-3
                ${
                  mode === 'CITIZENSHIP'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                }
              `}
            >
              <span
                className="
                  font-mono text-xs px-1.5 py-0.5 rounded border
                  bg-blue-100 text-blue-700 border-blue-300
                  dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-500/30
                "
              >
                IT
              </span>
              B1 Cittadinanza
            </button>

            <button
              onClick={() => handleSwitchMode('STANDARD')}
              className={`
                px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 flex items-center gap-3
                ${
                  mode === 'STANDARD'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                }
              `}
            >
              <span
                className="
                  font-mono text-xs px-1.5 py-0.5 rounded border
                  bg-emerald-100 text-emerald-700 border-emerald-300
                  dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-500/30
                "
              >
                IT
              </span>
              B1 Standard
            </button>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXAM_CONFIG[mode].skills.map((skill) => {
            const { icon, color } = SKILL_ICONS[skill];
            const { border, bg, text, hover } = getSkillColorClasses(color);

            return (
              <motion.div
                key={skill}
                whileHover={{ y: -4 }}
                onClick={() => handleSelectSkill(skill)}
                className={`
                  p-8 rounded-2xl border-l-4 ${border}
                  bg-white border border-slate-200
                  dark:bg-slate-800/50 dark:border-white/5
                  cursor-pointer transition-all duration-300
                  hover:shadow-lg hover:border-opacity-80
                  dark:hover:shadow-xl dark:hover:border-opacity-60
                  group
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`
                      w-12 h-12 rounded-xl flex items-center justify-center text-xl
                      ${bg} ${text}
                    `}
                  >
                    <i className={`fas ${icon}`}></i>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {skill}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Practice {skill.toLowerCase()} tasks
                </p>

                <button
                  className={`
                    mt-6 w-full py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition
                    bg-slate-900 text-white hover:bg-slate-700
                    dark:bg-slate-700 dark:text-white dark:${hover} 
                    group-hover:bg-opacity-90
                  `}
                >
                  Start Practice
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}