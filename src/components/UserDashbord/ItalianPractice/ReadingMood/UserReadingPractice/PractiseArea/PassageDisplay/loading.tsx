import type { JSX } from "react"

export default function Loading(): JSX.Element {
  return (
    <div className="flex-[1.2] flex flex-col gap-6 rounded-2xl shadow-sm p-8
                    dark:bg-gray-800 border dark:border-gray-700 bg-white border-gray-100
                    animate-pulse">

      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gray-200 dark:bg-gray-700 w-14 h-14" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-md" />
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded-md" />
          </div>
        </div>
      </div>

      {/* Reading blocks skeleton */}
      <div className="space-y-6">
        {[1, 2, 3].map((_, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border-2 bg-gray-50 border-gray-100
                       dark:bg-blue-50/5 dark:border-gray-700 space-y-4"
          >
            {/* Title */}
            <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md" />

            {/* Paragraph lines */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md" />
              <div className="h-4 w-[95%] bg-gray-200 dark:bg-gray-700 rounded-md" />
              <div className="h-4 w-[90%] bg-gray-200 dark:bg-gray-700 rounded-md" />
              <div className="h-4 w-[80%] bg-gray-200 dark:bg-gray-700 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}