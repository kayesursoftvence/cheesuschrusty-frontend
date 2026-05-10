import { ColorClasses, Skill } from '@/pages/UserPractice/types';
import { EXAM_CONFIG } from './constants';
import SkillCard from './SkillCard';
import type { JSX } from 'react';
import { ReactNode } from 'react';
import { FaBookOpen, FaHeadphonesAlt, FaPuzzlePiece, FaPencilAlt, FaMicrophoneAlt } from 'react-icons/fa';


import { useParams, useOutletContext } from 'react-router-dom';

export interface Props {
  track?: string;
}

export default function TaskRegistries({ track: propTrack }: Props): JSX.Element {
  const { track: urlTrack } = useParams();
  const { skills: contextSkills, level: contextLevel } = useOutletContext<{ skills: Skill[], level: string }>() || {};

  const rawTrack = urlTrack || propTrack || "";
  const track = rawTrack.toUpperCase();

  // Determine which config to use. Fallback to STANDARD if the track is unknown.
  const config = EXAM_CONFIG[track as keyof typeof EXAM_CONFIG] || EXAM_CONFIG.STANDARD;

  // Final skills list: prefer dynamic skills from context if available
  const displaySkills = contextSkills && contextSkills.length > 0 ? contextSkills : config.skills;

  console.log('Context Level:', contextLevel);
  console.log('Display Skills:', displaySkills);

  console.log('Config:', config);
  console.log('Track:', track);

  const levelMap: Record<string, string> = {
    CITIZENSHIP: "B1c",
    STANDARD: "B1"
  };


  if (!config) return <div className="text-gray-500">Invalid track</div>;

  const getSkillColorClasses = (color: string): ColorClasses => {
    const mapping: Record<string, ColorClasses> = {
      blue: { border: 'border-l-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-400', btnHover: 'hover:bg-blue-600 dark:hover:bg-blue-600' },
      orange: { border: 'border-l-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-400', btnHover: 'hover:bg-orange-600 dark:hover:bg-orange-600' },
      pink: { border: 'border-l-pink-500', bg: 'bg-pink-500/10', text: 'text-pink-400', btnHover: 'hover:bg-pink-600 dark:hover:bg-pink-600' },
      green: { border: 'border-l-green-500', bg: 'bg-green-500/10', text: 'text-green-400', btnHover: 'hover:bg-green-600 dark:hover:bg-green-600' },
      purple: { border: 'border-l-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-400', btnHover: 'hover:bg-purple-600 dark:hover:bg-purple-600' }
    };
    return mapping[color] || mapping.blue;
  };

  const SKILL_ICONS: Record<Skill, { icon: ReactNode; color: string }> = {
    'Reading': { icon: <FaBookOpen />, color: 'blue' },
    'Listening': { icon: <FaHeadphonesAlt />, color: 'orange' },
    'Grammar': { icon: <FaPuzzlePiece />, color: 'pink' },
    'Writing': { icon: <FaPencilAlt />, color: 'green' },
    'Speaking': { icon: <FaMicrophoneAlt />, color: 'purple' },
  };



  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
      {
        displaySkills.map((skill) => {
          const meta = SKILL_ICONS[skill];
          const colorClasses = getSkillColorClasses(meta.color);
          if (!meta) return null;

          return (
            <SkillCard
              key={skill}
              level={contextLevel || levelMap[track] || "B1"}
              skill={skill}
              meta={meta}
              colorClasses={colorClasses}
            />
          );
        })}
    </div>
  );
}