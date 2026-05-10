import type { JSX } from "react";
import type { ScoreInfo, ColorScheme } from "../types";

interface HeroSectionProps {
  percentage: number;
  scoreInfo: ScoreInfo;
  colors: ColorScheme;
  scoreValue: string;
  title: string;
}

export default function HeroSection({ percentage, scoreInfo, colors, scoreValue, title }: HeroSectionProps): JSX.Element {
  return (
    <>
      <div className={`bg-gradient-to-r ${colors.primary} py-6 px-8 text-center`}>
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <div className={`${scoreInfo.color} transform scale-125`}>
                  {scoreInfo.icon}
                </div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎉</span>
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {title}
        </h1>
        <p className="text-white/90 text-lg">
          {scoreInfo.message}
        </p>
      </div>

      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className={`px-4 py-2 ${colors.secondary} rounded-full`}>
              <span className={`text-sm font-semibold ${colors.text}`}>
                {scoreInfo.badge} Level
              </span>
            </div>
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {scoreValue}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
              {percentage}%
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-lg">
              Final Score
            </div>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Beginner</span>
              <span>Expert</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${colors.primary} transition-all duration-2000 ease-out`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {scoreInfo.subMessage}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
