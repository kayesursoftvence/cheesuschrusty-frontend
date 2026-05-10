import React from 'react';
 import { PencilIcon, ToggleOnIcon, ToggleOffIcon } from './icons';
import { AdminPlan } from '../Admin/types';

interface PlanCardProps {
  plan: AdminPlan;
  onEdit: (plan: AdminPlan) => void;
  onToggleStatus: (plan: AdminPlan) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onEdit, onToggleStatus }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 flex flex-col justify-between p-4 sm:p-6 rounded-xl shadow-sm border ${
      plan.isActive 
        ? 'border-green-200 dark:border-green-800' 
        : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 truncate">{plan.name}</h3>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
              plan.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {plan.isActive ? 'Active' : 'Inactive'}
            </span>
            {plan.isPopular && (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 whitespace-nowrap">
                Popular
              </span>
            )}
          </div>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            {Array.isArray(plan.description) && plan.description.map((description: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-400 dark:text-gray-500 mr-2 mt-1">•</span>
                <span className="flex-1">{description}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-1 truncate">Alias: {plan.alias}</p>
          {plan.stripePriceId && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">
              Stripe ID: {plan.stripePriceId}
            </p>
          )}
        </div>
        <div className="text-left sm:text-right w-full sm:w-auto">
          <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
            €{plan.price.toFixed(2)}/{plan.interval}
          </p>
          {plan.activeUsers !== undefined && (
            <p className="text-xs sm:text-sm text-blue-600 font-semibold dark:text-blue-400">
              {plan.activeUsers} active users
            </p>
          )}
        </div>
      </div>
      
      <div className="mb-4 sm:mb-6">
        <h4 className="font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-2">Features</h4>
        <ul className="space-y-1 sm:space-y-2 text-gray-600 dark:text-gray-400">
          {plan?.features?.map((feature: string, index: number) => (
            <li key={index} className="flex items-start">
              <span className="text-gray-400 dark:text-gray-500 mr-2 mt-1">•</span>
              <span className="text-xs sm:text-sm flex-1">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onClick={() => onEdit(plan)}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer text-sm sm:text-base"
        >
          <PencilIcon />
          <span className="ml-1 sm:ml-2">Edit Plan</span>
        </button>
        <button
          onClick={() => onToggleStatus(plan)}
          className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer text-sm sm:text-base ${
            plan.isActive
              ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
              : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
          }`}
        >
          {plan.isActive ? <ToggleOffIcon /> : <ToggleOnIcon />}
          <span className="ml-1 sm:ml-2">{plan.isActive ? 'Deactivate' : 'Activate'}</span>
        </button>
      </div>
    </div>
  );
};

export default PlanCard;