import { AlertCircle, RefreshCcw } from "lucide-react";

type ExerciseErrorProps = {
  message?: string;
  onRetry?: () => void;
};

export default function Error({
  message = "We couldn’t load the exercise.",
  onRetry,
}: ExerciseErrorProps) {
  return (
    <div
      className="flex-1 flex flex-col gap-6 rounded-2xl shadow-sm p-8
                 dark:bg-gray-800 border dark:border-gray-700
                 bg-white border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-bold dark:text-white">
            Unable to load exercise
          </h2>
          <p className="text-sm opacity-70 dark:text-gray-300">
            Don’t worry — your progress is safe
          </p>
        </div>
      </div>

      {/* Error content */}
      <div
        className="rounded-xl border-2 border-dashed border-red-200
                   dark:border-red-900/40
                   bg-red-50/60 dark:bg-red-900/10
                   p-6 space-y-4"
      >
        <p className="text-base text-red-700 dark:text-red-300">
          {message}
        </p>

        <p className="text-sm text-red-600/80 dark:text-red-400/80">
          This could be caused by a temporary network issue or a server problem.
          Please try again.
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-2.5
                       rounded-lg font-medium
                       bg-red-600 hover:bg-red-700
                       text-white transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Retry Exercise
          </button>
        )}
      </div>

      {/* Footer hint */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        If the problem continues, refresh the page or contact support.
      </p>
    </div>
  );
}
