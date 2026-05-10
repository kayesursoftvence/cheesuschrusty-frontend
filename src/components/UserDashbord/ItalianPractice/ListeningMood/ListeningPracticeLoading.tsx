import type { JSX } from "react"

export default function ListeningPracticeLoading(): JSX.Element {
  return (
    <div className="min-h-screen p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      <div className="mx-auto max-w-7xl">
        {/* Back button skeleton */}
        <div className="flex border p-3 rounded-2xl items-center gap-2 mb-4 animate-pulse">
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
        </div>

        {/* Header skeleton */}
        <div className="mb-8 space-y-2">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-80 animate-pulse"></div>
        </div>

        {/* Progress bar skeleton */}
        <div className="mb-6">
          <div className="flex justify-between mb-2 animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gray-300 dark:bg-gray-700"></div>
          </div>
        </div>

        {/* Exercise header skeleton */}
        <div className="mb-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-64"></div>
            </div>
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>

        {/* Audio controller skeleton */}
        <div className="mb-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-36"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-28"></div>
              </div>
            </div>
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
          </div>
          
          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
              <div className="h-full w-2/5 bg-gray-300 dark:bg-gray-700"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i}
                className={`
                  ${i === 3 ? 'w-14 h-14' : 'w-12 h-12'}
                  bg-gray-300 dark:bg-gray-700 
                  rounded-full
                  ${i === 3 ? 'ring-4 ring-gray-100 dark:ring-gray-800/50' : ''}
                `}
              ></div>
            ))}
          </div>
        </div>

        {/* Question display skeleton */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 animate-pulse">
          {/* Tabs */}
          <div className="flex gap-3 mb-8">
            {[1, 2].map((i) => (
              <div 
                key={i}
                className="h-12 bg-gray-300 dark:bg-gray-700 rounded-xl w-36"
              ></div>
            ))}
          </div>

          {/* Questions grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i}
                className="h-14 bg-gray-300 dark:bg-gray-700 rounded-xl"
              ></div>
            ))}
          </div>

          {/* Current question content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            
            {/* Options skeleton */}
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i}
                  className="h-16 bg-gray-300 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-700/30"
                ></div>
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between pt-8">
              <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-xl w-36"></div>
              <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-xl w-36"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}