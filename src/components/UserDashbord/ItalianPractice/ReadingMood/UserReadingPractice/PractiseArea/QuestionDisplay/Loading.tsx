import type { JSX } from "react"

export default function Loading(): JSX.Element {
    return (
        <div
          className="flex-1 flex flex-col gap-6 rounded-2xl shadow-sm p-8
                     dark:bg-gray-800 border dark:border-gray-700
                     bg-white border-gray-100 animate-pulse"
        >
          {/* Header: Instructions + Timer */}
          <div className="flex justify-between items-center mb-6 gap-5">
            {/* Instructions */}
            <div className="flex-1 space-y-3">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-md" />
              <div className="space-y-2 pl-4">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md" />
                <div className="h-4 w-[90%] bg-gray-200 dark:bg-gray-700 rounded-md" />
                <div className="h-4 w-[80%] bg-gray-200 dark:bg-gray-700 rounded-md" />
              </div>
            </div>
    
            {/* Timer */}
            <div className="flex items-center gap-2 px-4 py-2 border rounded-lg w-30
                            border-gray-200 dark:border-gray-700">
              <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-md" />
            </div>
          </div>
    
          {/* Questions */}
          <div className="space-y-6">
            {[1, 2, 3, 4].map((_, idx) => (
              <div
                key={idx}
                className="w-full p-4 rounded-xl border-2
                           border-gray-100 dark:border-gray-700
                           bg-gray-50 dark:bg-blue-50/5 space-y-3"
              >
                {/* Question line */}
                <div className="flex items-center gap-3">
                  <div className="h-5 w-6 bg-gray-200 dark:bg-gray-700 rounded-md" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md" />
                </div>
    
                {/* Input skeleton */}
                <div className="ml-auto h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded-md" />
              </div>
            ))}
    
            {/* Submit button */}
            <div className="flex justify-between mt-8">
              <div className="h-10 w-28 bg-gray-300 dark:bg-gray-700 rounded-lg" />
            </div>
          </div>
        </div>
      );
}