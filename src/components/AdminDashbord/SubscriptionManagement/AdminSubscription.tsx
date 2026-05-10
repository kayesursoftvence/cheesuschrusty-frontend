import { useState, useEffect } from 'react';
import { useGetActivePlansQuery, useUpdatePlanMutation } from '@/redux/features/subscriptions/subscriptionsApi';
import KpiCard from './KpiCard';
import PlanCard from './PlanCard';
 import {  KpiData } from './types';
import { MoneyIcon, CrownIcon, ChartIcon, UserIcon } from './icons';
import { toast } from 'react-hot-toast';
import EditPlanModal from './EditPlanModal';
import { AdminPlan } from '../Admin/types';
import { useGetAdminDashboardQuery } from '@/redux/features/Admin/adminApi';
 
const initialKpiData: KpiData[] = [
  { title: 'Monthly Revenue', value: '€0', icon: <MoneyIcon /> },
  { title: 'Active Subscriptions', value: '0', icon: <CrownIcon /> },
  { title: 'Conversion Rate', value: '0%', icon: <ChartIcon /> },
  { title: 'Avg. Revenue Per User', value: '€0', icon: <UserIcon /> },
];

function AdminSubscription() {
  const { data: plansResponse, isLoading, refetch } = useGetActivePlansQuery();
  const [updatePlan] = useUpdatePlanMutation();
  
  const [kpiData, setKpiData] = useState<KpiData[]>(initialKpiData);
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<AdminPlan | null>(null);
  const { data: dashboardData } = useGetAdminDashboardQuery();
  // Transform API plans to AdminPlan format
  useEffect(() => {
    if (plansResponse?.data) {
      const apiPlans = plansResponse.data;
      
      const transformedPlans: AdminPlan[] = apiPlans.map((plan, index) => ({
        id: index + 1,
        alias: plan.alias,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        interval: plan.interval,
        stripePriceId: plan.stripePriceId,
        isActive: plan.isActive,
        features: plan.features,
        currency: plan.currency,
        orderIndex: plan.orderIndex,
        activeUsers: 0,
      }));
      
      setPlans(transformedPlans);
    }
  }, [plansResponse]);

  // Transform stats data into KPI array
  useEffect(() => {
    if (dashboardData?.data?.stats) {
      const stats = dashboardData.data.stats;
      
      // Calculate conversion rate
      const conversionRate = stats.totalUsers > 0 
        ? ((stats.proSubscribers / stats.totalUsers) * 100).toFixed(1)
        : '0';
      
      // Transform stats object into KpiData array
      const transformedKpis: KpiData[] = [
        {
          title: 'Monthly Revenue',
          value: `€${(stats.monthlyRevenue || 0).toFixed(2)}`,
          icon: <MoneyIcon />
        },
        {
          title: 'Pro Subscribers',
          value: (stats.proSubscribers || 0).toString(),
          icon: <CrownIcon />
        },
        {
          title: 'Conversion Rate',
          value: `${conversionRate}%`,
          icon: <ChartIcon />
        },
        {
          title: 'Avg. Revenue Per User',
          value: `€${(stats.arpu || 0).toFixed(2)}`,
          icon: <UserIcon />
        },
      ];
      
      setKpiData(transformedKpis);
    }
  }, [dashboardData]);

  const handleEditPlan = (plan: AdminPlan) => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleUpdatePlan = async (updatedPlanData: Partial<AdminPlan>) => {
    if (!selectedPlan) return;

    try {
      await updatePlan({
        alias: selectedPlan.alias,
        data: {
          price: updatedPlanData.price,
          isActive: updatedPlanData.isActive,
            stripePriceId: updatedPlanData.stripePriceId as string | undefined,
        },
      }).unwrap();

      toast.success('Plan updated successfully');
      refetch(); // Refresh the plans list
      setIsEditModalOpen(false);
    } catch {
      toast.error('Failed to update plan');
    }
  };

  const handleTogglePlanStatus = async (plan: AdminPlan) => {
    try {
      await updatePlan({
        alias: plan.alias,
        data: { isActive: !plan.isActive },
      }).unwrap();

      toast.success(`Plan ${!plan.isActive ? 'activated' : 'deactivated'} successfully`);
      refetch();
    } catch  {
      toast.error('Failed to update plan status');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className=" mx-auto px-4 sm:px-6  py-4 sm:py-6 lg:py-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-200">Subscription Management</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Manage subscription plans and monitor performance metrics
            </p>
          </div>
          
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {kpiData.map((kpi, index) => (
            <KpiCard key={kpi.title || index} kpi={kpi} />
          ))}
        </section>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-200 mb-4 sm:mb-6">
            Subscription Plans
            <span className="ml-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              ({plans.filter(p => p.isActive).length} active plans)
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onEdit={handleEditPlan}
                onToggleStatus={handleTogglePlanStatus}
              />
            ))}
          </div>

          {plans.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">No plans found</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">
                No subscription plans are currently configured. Please check your Stripe integration.
              </p>
            </div>
          )}
        </div>
      </div>

      {isEditModalOpen && selectedPlan && (
        <EditPlanModal
          plan={selectedPlan}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPlan(null);
          }}
          onUpdate={handleUpdatePlan}
        />
      )}
    </div>
  );
}

export default AdminSubscription;