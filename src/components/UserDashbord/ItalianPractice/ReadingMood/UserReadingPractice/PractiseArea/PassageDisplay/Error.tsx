import { AlertTriangle, RefreshCcw } from "lucide-react";

type Props = {
                message?: string;
                onRetry?: () => void;
            };

export default function Error({ message = "We couldn’t load the reading content.", onRetry, }: Props) {
  return (
    <div className="flex-[1.2] flex flex-col gap-6 rounded-2xl shadow-sm p-8
                    dark:bg-gray-800 border dark:border-gray-700
                    bg-white border-gray-100">

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-2xl font-bold dark:text-white">
            Something went wrong
          </h2>
          <p className="text-sm opacity-70 dark:text-gray-300">
            Please try again in a moment
          </p>
        </div>
      </div>

      {/* Error content */}
      <div className="rounded-xl border-2 border-dashed border-red-200 dark:border-red-900/40
                      bg-red-50/50 dark:bg-red-900/10 p-6 space-y-4">

        <p className="text-base text-red-700 dark:text-red-300">
          {message}
        </p>

        <p className="text-sm text-red-600/80 dark:text-red-400/80">
          This may be caused by a network issue or temporary server problem.
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5
                       rounded-xl font-medium
                       bg-red-600 hover:bg-red-700
                       text-white transition"
          >
            <RefreshCcw className="w-4 h-4" />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
