import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { useGetMySubscriptionQuery } from "@/redux/features/subscriptions/subscriptionsApi";
import { Link } from "react-router-dom";

const UserWeeklyProgressCard = ({
  progress,
  title,
  subtitle,
  buttonText,
  onButtonClick,
  stats,
}: any) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
 const { data } = useGetMySubscriptionQuery();
const isLifetime = data?.data?.planAlias === "PRO_LIFETIME" || data?.data?.plan === "PRO_LIFETIME";
const prodata = data?.data?.isPro || isLifetime;
const hasUsedTrial = data?.data?.hasUsedTrial;
// const isDisabled = prodata === true && hasUsedTrial === true;


  return (
    <div className="p-6 bg-white dark:bg-[#34485D] rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h2>
        <p className="text-sm text-[#A7A7A7] dark:text-gray-400">{subtitle}</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Weekly Goal
          </span>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {clampedProgress}%
          </span>
        </div>
        <ProgressBar
          progress={clampedProgress}
          color="bg-[#111827]"
          className="h-3"
        />
      </div>

      <div className="flex justify-around py-4 mb-6">
        {stats.map((stat: any, index: any) => (
          <div key={index} className="text-center">
            <div className="text-xs font-medium text-[#A7A7A7] dark:text-gray-400 mb-1">
              {stat.label}
            </div>
            <div className="text-lg font-bold text-[#333] dark:text-gray-200">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
      {prodata === true && hasUsedTrial === true && (
        <Link
          to="analytics"
          onClick={onButtonClick}
          className="w-full block text-center border cursor-pointer border-[#333] text-[#333] font-semibold py-3 rounded-xl hover:bg-gray-50 dark:border-gray-300 dark:text-gray-200 dark:hover:bg-gray-800 transition duration-150"
        >
          {buttonText}
        </Link>
      ) 
      // : (
        // <Link
        //   to="analytics"
        //   onClick={onButtonClick}
        //   className="w-full block text-center border cursor-pointer border-[#333] text-[#333] font-semibold py-3 rounded-xl hover:bg-gray-50 dark:border-gray-300 dark:text-gray-200 dark:hover:bg-gray-800 transition duration-150"
        // >
        //   {buttonText}
        // </Link>
      }
    </div>
  );
};
export default UserWeeklyProgressCard;
