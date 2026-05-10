/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
 import { XIcon, CheckIcon } from './icons';
import { useUpdatePlanMutation } from '@/redux/features/subscriptions/subscriptionsApi';
import { toast } from 'react-hot-toast';
import { AdminPlan } from '../Admin/types';
import { PlanUpdateRequest } from '@/redux/features/subscriptions/subscriptions.types';

interface EditPlanModalProps {
  plan: AdminPlan;
  onClose: () => void;
  onUpdate: (updatedPlan: Partial<AdminPlan>) => void;
}

const EditPlanModal: React.FC<EditPlanModalProps> = ({ plan, onClose, onUpdate }) => {
  const [price, setPrice] = useState(plan.price.toString());
  const [isActive, setIsActive] = useState(plan.isActive);
  const [stripePriceId, setStripePriceId] = useState(plan.stripePriceId || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatePlan] = useUpdatePlanMutation();

 


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsUpdating(true);

  try {
    const updatedData: PlanUpdateRequest = {
      price: parseFloat(price),
      isActive,
      // Handle the null case by converting it to undefined
      ...(stripePriceId ? { stripePriceId } : {}),
    };

    await updatePlan({
      alias: plan.alias,
      data: updatedData,
    }).unwrap();

    onUpdate(updatedData);
    toast.success('Plan updated successfully');
    onClose();
  } catch (error: any) {
    toast.error(error?.data?.message?.[0] || 'Failed to update plan');
  } finally {
    setIsUpdating(false);
  }
};


  return (
    <div 
      className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-200">
            Edit {plan.name} Plan
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
          >
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price (€)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 dark:text-gray-400">€</span>
              </div>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Billed per {plan.interval}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            LEMON SQUEEZY VARIANT ID
            </label>
            <input
              type="text"
              value={stripePriceId}
              onChange={(e) => setStripePriceId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="price_xxxxxxxxxxxxxx"
            />
          </div>

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer ${
                isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              } transition-colors`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              {isActive ? 'Plan is active' : 'Plan is inactive'}
            </span>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <CheckIcon />
                  Update Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlanModal;