import { Brain, TrendingUp, RefreshCw, Star } from "lucide-react";
import type { JSX } from "react";
import type { NormalizedReadingFeedback } from "../types";

interface AIFeedbackCardProps {
  normalizedData: NormalizedReadingFeedback;
}

export default function AIFeedbackCard({ normalizedData }: AIFeedbackCardProps): JSX.Element {
  return (
    <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 md:p-8 border border-blue-100 dark:border-gray-700 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
          <Brain className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {normalizedData.cefr_profile.title}
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {`${normalizedData.header.level || ''} ${normalizedData.header.target_language || ''} - ${normalizedData.header.skill || ''}`}
          </p>
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Score Card */}
        {normalizedData.score && (
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-blue-100 dark:border-gray-700 shadow-sm">
            <div className="flex-1">
              <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-1">{normalizedData.score.title}</h4>
              <p className="text-sm text-gray-500">{normalizedData.score.status}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-4xl font-black text-blue-600 block leading-none">
                  {normalizedData.score.value}
                </span>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
              {normalizedData.cefr_profile?.details?.overall && (
                <div className="text-center">
                  <span className="text-2xl font-bold text-purple-600 block">
                    {normalizedData.cefr_profile.details.overall.replace(/[[\]]/g, '')}
                  </span>
                  <p className="text-sm font-black uppercase text-purple-400 tracking-tighter">CEFR</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CEFR Detailed Metrics */}
        {normalizedData.cefr_profile?.details && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(normalizedData.cefr_profile.details).map(([key, val]) => {
              if (key.toLowerCase() === 'overall') return null;
              return (
                <div key={key} className="p-4 bg-white dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700 text-center shadow-sm">
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">{key}</p>
                  <p className="text-xl font-bold text-purple-600">{String(val).replace(/[[\]]/g, '')}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Readiness Section */}
        {normalizedData.readiness && (
          <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100 dark:border-orange-900/30 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-1">{normalizedData.readiness.title}</h4>
              <p className="text-sm text-orange-800 dark:text-orange-200">{normalizedData.readiness.message}</p>
            </div>
            <div className="text-2xl font-black text-orange-600 dark:text-orange-400">
              {normalizedData.readiness.percentage}
            </div>
          </div>
        )}

        {/* Strengths */}
        {normalizedData.strengths && normalizedData.strengths.points.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
              <h4 className="font-bold uppercase tracking-widest text-xs">{normalizedData.strengths.title}</h4>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {normalizedData.strengths.points.map((p, i) => (
                <div key={i} className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                  <p className="text-sm text-emerald-900 dark:text-emerald-100 leading-relaxed">{p}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvements */}
        {normalizedData.improvements && normalizedData.improvements.points.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <RefreshCw className="w-5 h-5" />
              <h4 className="font-bold uppercase tracking-widest text-xs">{normalizedData.improvements.title}</h4>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {normalizedData.improvements.points.map((p, i) => (
                <div key={i} className="bg-indigo-50/50 dark:bg-indigo-900/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex flex-col group">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 flex-1">{p}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Power Tip */}
        {normalizedData.power_tip && (
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                </div>
                <h4 className="font-black uppercase tracking-widest text-sm">{normalizedData.power_tip.title}</h4>
              </div>
              <p className="text-lg font-medium mb-6 leading-relaxed block">{normalizedData.power_tip.explanation}</p>
              {normalizedData.power_tip.example && (
                <div className="p-4 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10">
                  <p className="text-xs uppercase font-black tracking-widest opacity-40 mb-2">Try this now</p>
                  <p className="text-sm italic opacity-90 leading-relaxed font-serif">"{normalizedData.power_tip.example}"</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Motivational Close */}
        {normalizedData.motivational_close && (
          <div className="text-center py-6 border-t border-gray-100 dark:border-gray-700 mt-8">
            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500 mb-2">
              {normalizedData.motivational_close.title}
            </p>
            {normalizedData.motivational_close.message && (
              <p className="text-md text-gray-600 dark:text-gray-300 font-medium mb-1">
                {typeof normalizedData.motivational_close.message === 'string' 
                  ? normalizedData.motivational_close.message 
                  : normalizedData.motivational_close.message.target_language}
              </p>
            )}
            {normalizedData.motivational_close.target_language && !normalizedData.motivational_close.message && (
              <p className="text-md text-gray-600 dark:text-gray-300 font-medium mb-1">{normalizedData.motivational_close.target_language}</p>
            )}
            {normalizedData.motivational_close.translation && (
              <p className="text-sm font-bold opacity-30 uppercase tracking-widest">{normalizedData.motivational_close.translation}</p>
            )}
            {normalizedData.motivational_close.primary_language && !normalizedData.motivational_close.translation && (
              <p className="text-sm font-bold opacity-30 uppercase tracking-widest">{normalizedData.motivational_close.primary_language}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
