import { Award, TrendingUp, Target, RefreshCw } from "lucide-react";
import type { ScoreInfo, ColorScheme } from "../types";

/**
 * Parse score string like "80 / 100" to percentage number
 */
export function getPercentage(value: string): number {
  if (!value || !value.includes("/")) return 0;

  const parts = value.split("/");
  const obtained = parseFloat(parts[0].replace(/[^0-9.]/g, ""));
  const total = parseFloat(parts[1].replace(/[^0-9.]/g, ""));

  if (!total || isNaN(obtained) || isNaN(total)) return 0;

  return Math.round((obtained / total) * 100);
}

/**
 * Get score info (icon, message, badge) based on percentage
 */
export function getScoreInfo(score: number): ScoreInfo {
  if (score >= 90) {
    return {
      color: "text-green-500",
      icon: <Award className="w-12 h-12" />,
      message: "Excellent! You've mastered this lesson.",
      badge: "Advanced",
      subMessage: "You're in the top 10% of learners"
    };
  } else if (score >= 75) {
    return {
      color: "text-blue-500",
      icon: <TrendingUp className="w-12 h-12" />,
      message: "Great job! You're making solid progress.",
      badge: "Intermediate",
      subMessage: "You're progressing faster than average"
    };
  } else if (score >= 60) {
    return {
      color: "text-yellow-500",
      icon: <Target className="w-12 h-12" />,
      message: "Good effort! Keep practicing to improve.",
      badge: "Developing",
      subMessage: "With more practice, you'll reach intermediate"
    };
  } else {
    return {
      color: "text-orange-500",
      icon: <RefreshCw className="w-12 h-12" />,
      message: "Keep trying! Every attempt makes you better.",
      badge: "Beginner",
      subMessage: "Everyone starts somewhere - consistency is key"
    };
  }
}

/**
 * Get color scheme based on percentage
 */
export function getColors(score: number): ColorScheme {
  if (score >= 90) {
    return {
      primary: "from-green-500 to-emerald-600",
      secondary: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-800 dark:text-green-300"
    };
  } else if (score >= 75) {
    return {
      primary: "from-blue-500 to-cyan-600",
      secondary: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-800 dark:text-blue-300"
    };
  } else if (score >= 60) {
    return {
      primary: "from-yellow-500 to-amber-600",
      secondary: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-800 dark:text-yellow-300"
    };
  } else {
    return {
      primary: "from-orange-500 to-red-600",
      secondary: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-800 dark:text-orange-300"
    };
  }
}
