/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react"
import type { Ticket } from "./types"
import { useGetMyTicketsQuery } from "@/redux/features/tickets/ticketsApi"
import PageLoader from "@/Layout/PageLoader"

interface StatsCardsProps {
  tickets: Ticket[]
  statsData?: {
    totalTickets: number
    openTickets: number
    inProgressTickets: number
    resolvedTickets: number
    averageResponseTime: string
  }
  userRole?: string
}

export const StatsCards: React.FC<StatsCardsProps> = ({  statsData, userRole }) => {
  const { data: myTicketsData, isLoading: isLoadingTickets } = useGetMyTicketsQuery({});

  if (isLoadingTickets) {
    return <PageLoader />
  }

  // Get raw tickets from API response
  const rawTickets = Array.isArray(myTicketsData)
    ? myTicketsData
    : myTicketsData?.tickets || myTicketsData?.data || [];

  // Calculate stats from API response
  const totalTickets = rawTickets.length;
  const openTicketsCount = rawTickets.filter((ticket: any) => ticket.status === "OPEN").length;
  const resolvedTicketsCount = rawTickets.filter((ticket: any) => 
    ticket.status === "RESOLVED" || ticket.status === "CLOSED"
  ).length;
  

  // Get last update date - create a copy before sorting to avoid read-only error
  
  
  

  // For admin users, use provided statsData if available
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';
  
  const stats = isAdmin && statsData
    ? [
        { label: "Total Tickets", value: statsData.totalTickets || totalTickets },
        { label: "Open Tickets", value: statsData.openTickets + statsData.inProgressTickets },
        { label: "Resolved Today", value: statsData.resolvedTickets || 0 },
        { label: "Avg Response Time", value: statsData.averageResponseTime || "2.4 Hours" },
        { label: "Satisfaction", value: "4.6/5" },
      ]
    : [
        { label: "My Tickets", value: totalTickets },
        { label: "Open Tickets", value: openTicketsCount },
        { label: "Resolved", value: resolvedTicketsCount },
        //  { label: "Last Update", value: lastUpdate },
      ]

  // If no tickets for regular users
  if (!isAdmin && totalTickets === 0) {
    return (
      <div className="px-8 py-6 mb-4 rounded-md">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
            No tickets found
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            You haven't created any support tickets yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-8 py-6 mb-4 rounded-md">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {stat.label}
            </p>
            <p className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-gray-100">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}








 