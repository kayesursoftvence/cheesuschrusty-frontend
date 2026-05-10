
import React from "react";
import caricon from "../../../assets/Dashbord/shioingcar.svg";
import boxicon from "../../../assets/Dashbord/box-delivery 1.svg";
import { useGetAdminDashboardQuery } from "@/redux/features/Admin/adminApi";
 // Add this for user type
 
// Helper function to format timestamp
const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

// Helper function to get activity icon
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'user':
      return boxicon; // Using existing box icon for user registration
    case 'ticket':
      return caricon; // Using existing car icon for tickets
    case 'subscription':
      return caricon; // Using car icon for subscriptions
    case 'content':
      return boxicon; // Using box icon for content
    default:
      return boxicon;
  }
};

// Helper function to get activity title from message
const getActivityTitle = (type: string, message: string): string => {
  if (type === 'user') {
    return "New user registration";
  } else if (type === 'ticket') {
    return "Support request";
  }
  // Extract title from message or use type
  return message.split(':')[0] || type.charAt(0).toUpperCase() + type.slice(1) + " activity";
};

// Helper function to get activity description
const getActivityDescription = (_type: string, message: string): string => {
  const parts = message.split(':');
  if (parts.length > 1) {
    return parts[1].trim();
  }
  return message;
};

const AdminRecentActivity: React.FC = () => {
  const { data: dashboardData, isLoading } = useGetAdminDashboardQuery();

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold dark:text-gray-200">Recent Activity</h2>
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="space-y-5 mt-6">
          {[1, 2, 3, 4, 5].map((_, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const activities = dashboardData?.data.recentActivity || [];

  return (
    <div className="bg-white p-6 rounded-lg dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold dark:text-gray-200">Recent Activity</h2>
        <button className="text-blue-500 text-sm cursor-pointer dark:text-blue-400 hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-5 mt-6">
        {activities.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-center py-4">
            No recent activity
          </div>
        ) : (
          activities.map((activity, idx) => (
            <div key={idx} className="flex gap-3">
              <div
                className={`w-8 h-8 rounded flex items-center justify-center ${
                  activity.type === "user" ? "bg-yellow-100 dark:bg-yellow-900" : 
                  activity.type === "ticket" ? "bg-blue-100 dark:bg-blue-900" : 
                  "bg-purple-100 dark:bg-purple-900"
                }`}
              >
                <img 
                  src={getActivityIcon(activity.type)} 
                  alt={activity.type} 
                  className="w-4 h-4 object-contain"
                />
              </div>

              <div className="flex-1">
                <div className="font-medium text-xl dark:text-gray-200">
                  {getActivityTitle(activity.type, activity.message)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {getActivityDescription(activity.type, activity.message)}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {formatTimeAgo(activity.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminRecentActivity;











// import React from "react";
// import caricon from "../../../assets/Dashbord/shioingcar.svg"; // ✅ include extension
// import boxicon from "../../../assets/Dashbord/box-delivery 1.svg"; // ✅ ok

// interface Activity {
//   type: "user" | "subscription" | "task" | "support";
//   title: string;
//   desc: string;
//   time: string;
// }

// const activities: Activity[] = [
//   {
//     type: "user",
//     title: "New user registration",
//     desc: "Sarah Johnson joined the platform",
//     time: "2h ago",
//   },
//   {
//     type: "subscription",
//     title: "New Pro subscription",
//     desc: "Michael Chen upgraded to Pro plan",
//     time: "Yesterday",
//   },
//   {
//     type: "task",
//     title: "Deck completed",
//     desc: 'Emma Davis completed "Spanish Basics" deck',
//     time: "Yesterday",
//   },
//   {
//     type: "subscription",
//     title: "New Pro subscription",
//     desc: "Michael Chan upgraded to Pro plan",
//     time: "Yesterday",
//   },
//   {
//     type: "support",
//     title: "Support ticket",
//     desc: "Alex opened request ticket Ann",
//     time: "Yesterday",
//   },
// ];

// const AdminRecentActivity: React.FC = () => (
//   <div className="bg-white p-6 rounded-lg dark:bg-gray-800">
//     <div className="flex items-center justify-between mb-4">
//       <h2 className="text-2xl font-semibold dark:text-gray-200">Recent Activity</h2>
//       <button className="text-blue-500 text-sm cursor-pointer dark:text-blue-400">View all</button>
//     </div>

//     <div className="space-y-5 mt-6">
//       {activities.map((activity, idx) => (
//         <div key={idx} className="flex gap-3">
//           <div
//             className={`w-8 h-8 rounded flex items-center justify-center   ${
//               activity.type === "user" ? "bg-yellow-100" : "bg-purple-100"
//             }`} 
//           >
//             {activity.type === "user" && <img src={boxicon} alt="User" />}
//             {activity.type === "subscription" && <img src={caricon} alt="Subscription" />}
//             {activity.type === "task" && <img src={caricon} alt="Task" />}
//             {activity.type === "support" && <img src={caricon} alt="Support" />}
//           </div>

//           <div className="flex-1">
//             <div className="font-medium text-xl dark:text-gray-200">{activity.title}</div>
//             <div className="text-sm text-gray-500 dark:text-gray-400">{activity.desc}</div>
//             <div className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</div>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// export default AdminRecentActivity;
