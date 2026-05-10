import { ReactNode } from "react";

export enum LessonType {
  READING = "READING",
  WRITING = "WRITING",
  LISTENING = "LISTENING",
  SPEAKING = "SPEAKING"
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
}

export interface DailyGoalProgressProps {
  currentMinutes: number;
  totalMinutes: number;
  timeLeft: string;
}

export interface SkillArea {
  skillArea: string;
  title: string;
  progress: number;
}

export interface SkillConfig {
  icon: string;
  title: string;
  bgColor: string;
  iconBg: string;
  subtitle?: string;
  progress?: number;
  duration?: string;
}

export interface PracticeAnalytics {
  dailyGoalProgress: {
    minutesToday: number;
    dailyGoal: number;
    message: string;
  };
  todayStats: {
    sessions: number;
    studyTimeMinutes: number;
    averageAccuracy: number;
  };
  practiceAreas: SkillArea[];
}
