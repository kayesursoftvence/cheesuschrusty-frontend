import { Skill, SkillIconMeta, ColorClasses } from './types';
import { useDispatch } from 'react-redux';
import { setSkill } from '@/store/Slices/PracticeSlice/PracticeSlice';
import { useNavigate } from 'react-router-dom';
import type { JSX } from 'react';
// import { useLocation } from 'react-router-dom';

export interface Props {
  skill: Skill;
  meta: SkillIconMeta;
  colorClasses: ColorClasses;
  level: string;
}

export default function SkillCard({ skill, meta, colorClasses, level }: Props): JSX.Element {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const location = useLocation()

    // const mode = location.pathname.split('/').at(-1)
    function selectSkill(skill: Skill) {
        dispatch(setSkill(skill as Skill));
        navigate(`/user/practice/${level}/${skill.toLowerCase()}/select-exercise`);
    }
    // bg-bg-card
  return (
    <div 
      className={` p-8 rounded-2xl border-l-4 ${colorClasses.border} light:bg-slate-50  dark:hover:bg-slate-800  border border-gray-100  dark:border-y-white/5 dark:border-r-white/5 transition-all duration-300 relative overflow-hidden dark:hover:border-y-blue-primary dark:hover:border-r-blue-primary hover:-translate-y-0.5`}
      onClick={() => selectSkill(skill)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${colorClasses.bg} ${colorClasses.text} rounded-xl flex items-center justify-center text-xl`}>
          {/* <i className={`fas ${meta.icon}`}></i> */}
          {meta.icon}
        </div>
      </div>
      <h3 className="text-xl font-bold">{skill}</h3>
      <p className="text-slate-400 text-sm mt-1">Start {skill} tasks</p>
      <button className={`cursor-pointer mt-6 w-full py-2.5 bg-slate-200 dark:bg-slate-700 hover:text-slate-100  rounded-lg font-bold transition text-sm uppercase tracking-wide ${colorClasses.btnHover}`}>
        Select
      </button>
    </div>
  );
}


