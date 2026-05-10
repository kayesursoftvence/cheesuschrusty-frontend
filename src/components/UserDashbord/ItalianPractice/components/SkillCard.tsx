import React from "react";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { CEFR_LEVELS } from "../constants";
import { SkillConfig } from "../types";
import { useGetMySubscriptionQuery } from "@/redux/features/subscriptions/subscriptionsApi";
import { useNavigate } from "react-router-dom";

interface SkillCardProps {
  skill: SkillConfig;
  showLevelSelector: boolean;
  loadingSkill: boolean;
  sessionLevel: string | undefined;
  onLevelSelect: (skillTitle: string, level: string) => void;
  onStartPractice: (skillTitle: string) => void;
  onCancelSelection: (val: null) => void;
}

export const SkillCard: React.FC<SkillCardProps> = React.memo(({
  skill,
  showLevelSelector,
  loadingSkill,
  sessionLevel,
  onLevelSelect,
  onStartPractice,
  onCancelSelection,
}) => {
  console.log(skill)
  const navigate = useNavigate();
  const [displayProgress, setDisplayProgress] = React.useState<number>(
    typeof skill.progress === 'number' ? skill.progress : Number(skill.progress) || 0
  );

  React.useEffect(() => {
    const next = typeof skill.progress === 'number' ? skill.progress : Number(skill.progress) || 0;
    // slight delay to allow transition CSS to animate
    setTimeout(() => setDisplayProgress(next), 50);
  }, [skill.progress]);
  const { data } = useGetMySubscriptionQuery();
    const isLifetime = data?.data?.planAlias === "PRO_LIFETIME" || data?.data?.plan === "PRO_LIFETIME";
    const prodata = data?.data?.isPro || isLifetime;
    // const hasUsedTrial = data?.data?.hasUsedTrial;
  // Unlocked if it's Reading Practice OR if the user has an active 7-day trial
  const isUnlocked = skill.title === "Reading" || (prodata === true );
  // const isUnlocked = skill.title === "Reading" || (prodata === true && hasUsedTrial === true);

  const handleClick = () => {
    if (isUnlocked) {
      onStartPractice(skill.title);
    } else {
      // Navigate to pricing section on home page using react-router
      navigate("/#pricing");
    }
  };

  return (
    <div className={`${skill.bgColor} dark:bg-gray-800 p-8 rounded-2xl shadow-xl transition-transform hover:scale-[1.02]`}>
      <div className="flex items-center gap-6 mb-6">
        <div className={`${skill.iconBg} p-4 rounded-2xl shadow-lg`}>
          <img src={skill.icon} className="w-10 h-10" alt="icon" />
        </div>
        <div>
          <h3 className="text-2xl font-bold dark:text-white">{skill.title}</h3>
          <p className="opacity-60 text-sm dark:text-gray-300">{skill.subtitle}</p>
        </div>
      </div>
      <ProgressBar progress={displayProgress || 0} color="bg-blue-600" />
      
      {showLevelSelector && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-600 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 dark:text-gray-400 text-center opacity-70">Expertise Level</p>
          <div className="grid grid-cols-3 gap-2">
            {CEFR_LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => onLevelSelect(skill.title, lvl)}
                className={`py-2 rounded-lg text-xs font-bold transition-all border-2 ${
                  sessionLevel === lvl 
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30" 
                    : "bg-white dark:bg-gray-800 border-transparent dark:text-gray-200 hover:border-gray-200 dark:hover:border-gray-600"
                } cursor-pointer`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleClick}
        className={`w-full py-4 mt-6 rounded-xl font-bold transition-all shadow-xl flex flex-col items-center justify-center cursor-pointer ${
          isUnlocked 
            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20 active:scale-95" 
            : "bg-slate-200 dark:bg-gray-700 text-slate-500 dark:text-gray-400 hover:bg-slate-300 dark:hover:bg-gray-600 shadow-slate-200/20 active:scale-98"
        }`}
      >
        {loadingSkill ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Loading...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>
              {isUnlocked 
                ? (showLevelSelector && sessionLevel ? `Start ${sessionLevel} Practice` : "Start Now")
                : "Upgrade to unlock"
              }
            </span>
            {!isUnlocked && (
              <span className="bg-amber-400 text-blue-900 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">
                PRO
              </span>
            )}
          </div>
        )}
      </button>

      {showLevelSelector && (
        <button 
          onClick={() => onCancelSelection(null)}
          className="w-full mt-3 text-[10px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100 dark:text-white transition-opacity cursor-pointer text-center"
        >
          Cancel Selection
        </button>
      )}
    </div>
  );
});

SkillCard.displayName = "SkillCard";
