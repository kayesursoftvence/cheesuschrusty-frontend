import readingicon from "../../../assets/Dashbord/reading.svg";
import lesteningicon from "../../../assets/Dashbord/listening.svg";
import writingicon from "../../../assets/Dashbord/writing.svg";
import speakingicon from "../../../assets/Dashbord/speaking.svg";
import { SkillConfig } from "./types";

export const SKILL_CONFIGS: Record<string, SkillConfig> = {
  reading: { 
    icon: readingicon, 
    title: "Reading", 
    bgColor: "bg-blue-50", 
    iconBg: "bg-gradient-to-r from-[#0B5FFF] to-[#6C9AF0]" 
  },
  listening: { 
    icon: lesteningicon, 
    title: "Listening", 
    bgColor: "bg-orange-50", 
    iconBg: "bg-gradient-to-r from-[#F97316] to-[#FB923C]" 
  },
  writing: { 
    icon: writingicon, 
    title: "Writing", 
    bgColor: "bg-green-50", 
    iconBg: "bg-gradient-to-r from-[#0E9F6E] to-[#11D090]" 
  },
  speaking: { 
    icon: speakingicon, 
    title: "Speaking", 
    bgColor: "bg-red-50", 
    iconBg: "bg-gradient-to-r from-[#BA0BFF] to-[#E19FFB]" 
  }
};

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const DEFAULT_DAILY_GOAL = { 
  minutesToday: 0, 
  dailyGoal: 30, 
  message: "30 min left" 
};

export const DEFAULT_TODAY_STATS = { 
  sessions: 0, 
  studyTimeMinutes: 0, 
  averageAccuracy: 0 
};
