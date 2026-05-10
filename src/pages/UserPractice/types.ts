export type ExamMode = 'CITIZENSHIP' | 'STANDARD';
export type Tier = 'Free' | 'Pro';
export type Skill = 'Reading' | 'Listening' | 'Grammar' | 'Writing' | 'Speaking';
import type { ReactNode } from "react";

export interface Domain {
  id: string;
  en: string;
  it: string;
  icon: string;
  mode?: 'STANDARD_ONLY';
}

export interface TaskType {
  id: string;
  name: string;
  it: string;
  time: { [key: string]: number | null };
  layouts: { [key: string]: string };
  configs: { [key: string]: any };
  trust: 'OFFICIAL' | 'VERIFIED';
  mode?: 'STANDARD_ONLY';
}

export interface SkillIconMeta {
  icon: ReactNode;
  color: string;
}

export interface ColorClasses {
  border: string;
  bg: string;
  text: string;
  btnHover: string;
}

export interface PracticeState {
  view: 'dashboard' | 'types' | 'domains' | 'test' | 'feedback' | 'prompts';
  skill: Skill | '';
  type: TaskType | null;
  domain: string;
  domainIt: string;
  tier: Tier;
  mode: ExamMode;
  level: string;
  fullTaskId: string;
}

export interface ExamConfigItem {
  id: string;
  skills: Skill[];
  color: string;
}

export type ExamConfig = Record<string, ExamConfigItem>;

