import React from "react";
import { StatCardProps } from "../types";

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-5 rounded-xl shadow-md flex flex-col justify-between dark:text-gray-100 h-full">
      <div className="flex justify-between items-start mb-2">
        <p className="text-xs xs:text-sm sm:text-base text-[#A7A7A7] dark:text-gray-300 font-medium">{title}</p>
        <span className="text-indigo-500 text-lg sm:text-xl lg:text-2xl">{icon}</span>
      </div>
      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
    </div>
  );
};
