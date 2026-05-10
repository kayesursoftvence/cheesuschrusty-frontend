import type { JSX } from "react";

export interface ScoreInfo {
  color: string;
  icon: JSX.Element;
  message: string;
  badge: string;
  subMessage: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  text: string;
}

export interface AnswerReviewItem {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface NormalizedScore {
  title: string;
  value: string;
  status: string;
}

export interface NormalizedSection {
  title: string;
  points: string[];
}

export interface NormalizedCEFRProfile {
  title: string;
  details: Record<string, string>;
}

export interface NormalizedReadiness {
  title: string;
  message: string;
  percentage: string;
}

export interface NormalizedPowerTip {
  title: string;
  explanation: string;
  example?: string;
}

export interface NormalizedMotivationalClose {
  title: string;
  message?: string | { target_language?: string };
  target_language?: string;
  translation?: string;
  primary_language?: string;
}

export interface NormalizedHeader {
  level?: string;
  target_language?: string;
  skill?: string;
}

export interface NormalizedReadingFeedback {
  header: NormalizedHeader;
  score: NormalizedScore;
  cefr_profile: NormalizedCEFRProfile;
  strengths: NormalizedSection;
  improvements: NormalizedSection;
  readiness: NormalizedReadiness | null;
  power_tip: NormalizedPowerTip | null;
  motivational_close: NormalizedMotivationalClose | null;
}
