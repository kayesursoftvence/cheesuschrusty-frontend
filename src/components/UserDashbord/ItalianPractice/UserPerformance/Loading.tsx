import type { JSX } from "react"
import Header from "@/components/Header/Header"


export default function Loading(): JSX.Element {
  return (
    <div className="min-h-screen dark:bg-gray-900 dark:text-gray-200 text-gray-900 transition-colors duration-300">
      <div className="mx-auto px-6 py-4">
        <div className="flex border dark:border-gray-700 p-3 rounded-2xl items-center gap-2 mb-4 animate-pulse">
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
        </div>
        <Header title="Reading Practice" subtitle="Improve your Italian reading comprehension" /> 
      </div>

      <div className="mx-auto px-6 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          <div className="w-full">
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
              <div className="max-w-4xl mx-auto">
                {/* Main Card Skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-8 animate-pulse">
                  {/* Header Gradient Skeleton */}
                  <div className="bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 py-6 px-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                  </div>

                  <div className="p-6 md:p-8">
                    {/* AI Evaluation Badge Skeleton */}
                    <div className="flex justify-center mb-6">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-48"></div>
                    </div>

                    {/* Score Section Skeleton */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center gap-3 mb-4">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-40"></div>
                      </div>

                      <div className="mb-6">
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-4"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto"></div>
                      </div>

                      <div className="max-w-2xl mx-auto mb-8">
                        <div className="flex justify-between text-sm mb-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                          <div className="h-full rounded-full bg-gradient-to-r from-gray-400 to-gray-500 w-3/4"></div>
                        </div>
                        <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded w-56 mx-auto"></div>
                      </div>
                    </div>

                    {/* Stats Grid Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-600">
                          <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded w-16 mx-auto mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mx-auto"></div>
                        </div>
                      ))}
                    </div>

                    {/* AI Analysis Section Skeleton */}
                    <div className="mb-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-xl w-12 h-12"></div>
                        <div>
                          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
                        </div>
                      </div>

                      {/* Title & Score Card Skeleton */}
                      <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 mb-6">
                        <div className="flex-1">
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-56 mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                          </div>
                          <div className="w-px h-10 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
                          <div className="text-center">
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                          </div>
                        </div>
                      </div>

                      {/* CEFR Metrics Skeleton */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="p-4 bg-white dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-2"></div>
                            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto"></div>
                          </div>
                        ))}
                      </div>

                      {/* Strengths & Improvements Skeleton */}
                      <div className="space-y-6">
                        {[1, 2].map((section) => (
                          <div key={section} className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[1, 2].map((item) => (
                                <div key={item} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-600">
                                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-3"></div>
                                  <div className="space-y-2">
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tips Section Skeleton */}
                    <div className="mb-8">
                      <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Button Skeleton */}
                    <div className="flex justify-center mt-8 mb-8">
                      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-48"></div>
                    </div>
                  </div>
                </div>

                {/* What's Next Section Skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 animate-pulse">
                  <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-32 mb-2"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}