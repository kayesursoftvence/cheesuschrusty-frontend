"use client"

import { useState, useEffect } from "react"
import type {
    PageType,
    TabType,
    Ticket,
} from "./types"
import { DashboardHeader } from "./dashboard-header"
import { StatsCards } from "./stats-cards"
import { DashboardContent } from "./dashboard-content"
import { TicketDetailView } from "./ticket-detail-view"
  import { TicketResponse } from "@/redux/features/tickets/tickets.types"
import { useGetMeQuery } from "@/redux/features/auth/authApi"
import {   useGetMyTicketsQuery, useGetTicketsQuery, useGetTicketStatsQuery } from "@/redux/features/tickets/ticketsApi"
  
// Helper function to map API response to local Ticket type
const mapApiTicketToLocal = (apiTicket: TicketResponse): Ticket => {
  const user = apiTicket.user;
   
  return {
    id: apiTicket.id,
    subject: apiTicket.subject,
    responses: apiTicket.messages.length,
    user: user.name || user.email.split('@')[0],
    email: user.email,
    priority: apiTicket.priority.charAt(0) + apiTicket.priority.slice(1).toLowerCase(),
    category: apiTicket.status === 'RESOLVED' || apiTicket.status === 'CLOSED' 
      ? 'Resolved' 
      : apiTicket.status === 'IN_PROGRESS' 
        ? 'In Progress' 
        : 'Open',
    lastUpdate: new Date(apiTicket.updatedAt).toLocaleDateString('en-GB'),
    status: apiTicket.status === 'RESOLVED' || apiTicket.status === 'CLOSED' ? 'Resolved' : 'Open',
    joined: new Date(user.createdAt).toLocaleDateString('en-GB'),
    subscription: 'Pro', // This would come from user subscription data
    created: new Date(apiTicket.createdAt).toLocaleString('en-GB'),
    lastUpdateTime: new Date(apiTicket.updatedAt).toLocaleTimeString('en-GB'),
    categoryDetail: 'Support', // Default category
    assignee: 'Unassigned', // You might want to add assignee to your API
    conversation: apiTicket.messages.map(msg => ({
      sender: msg.sender?.name || (msg.sender?.role === 'USER' ? user.name || 'User' : 'Support Agent'),
      role: msg.sender?.role === 'USER' ? 'User' : 'Support',
      time: new Date(msg.createdAt).toLocaleString('en-GB'),
      message: msg.message,
    })),
  };
};

export default function UserSupportDashboard() {
    const [currentPage, setCurrentPage] = useState<PageType>("dashboard")
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>()
    const [messageInput, setMessageInput] = useState<string>("")
    const [activeTab, setActiveTab] = useState<TabType>("allTickets")
    //(selectedTicket)
    // Get current user info
    const { data: userData, isLoading: userLoading } = useGetMeQuery({});
    const currentUserId = userData?.id;
    const userRole = userData?.role;
 
    // Check if user is admin
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' || userRole === 'SUPORT_MANAGER' || userRole === 'CONTENT_MANAGER';

    // Fetch tickets based on user role
    const { data: adminTicketsData, isLoading: adminTicketsLoading } = useGetTicketsQuery(
      isAdmin ? { page: 1, limit: 20 } : {},
      { skip: !isAdmin || !currentUserId }
    );
    
    const { data: myTicketsData, isLoading: myTicketsLoading } = useGetMyTicketsQuery(
      undefined,
      { skip: isAdmin || !currentUserId }
    );
    
    const { data: ticketStatsData } = useGetTicketStatsQuery(undefined, {
      skip: !isAdmin
    });

    const [tickets, setTickets] = useState<Ticket[]>([])
    const [knowledgeArticles] = useState([])
    const [teamMembers] = useState([])
 



useEffect(() => {
  if (isAdmin) {
    // Admin: getTickets returns TicketsListResponse with nested data.data structure
    if (adminTicketsData?.data?.data && Array.isArray(adminTicketsData.data.data)) {
      const mappedTickets = adminTicketsData.data.data.map(mapApiTicketToLocal);
      setTickets(mappedTickets);
      // Auto-select first ticket for admin
      if (mappedTickets.length > 0 && !selectedTicket) {
        setSelectedTicket(mappedTickets[0]);
      }
    }
  } else if (myTicketsData && Array.isArray(myTicketsData)) {
    // User: getMyTickets returns TicketResponse[] directly
    const mappedTickets = myTicketsData.map(mapApiTicketToLocal);
    setTickets(mappedTickets);
    // Auto-select first ticket for user
    if (mappedTickets.length > 0 && !selectedTicket) {
      setSelectedTicket(mappedTickets[0]);
    }
  }
}, [adminTicketsData, myTicketsData, isAdmin, selectedTicket]);









    const handleViewTicket = (ticketId: string): void => {
        setSelectedTicket(ticketId as unknown as Ticket)
        setCurrentPage("detail")
    }



 


    const handleBackToDashboard = (): void => {
        setCurrentPage("dashboard")
        setSelectedTicket(null)
        setMessageInput("")
    }

   



    

    const handleAddTicket = (ticket: Ticket): void => {
        setTickets((prev) => [...prev, ticket])
    }

    const handleMarkAsResolved = async (): Promise<void> => {
        if (!selectedTicket) return

        // You would call useUpdateTicketStatusMutation here
        // For now, just update local state
        const updatedTickets = tickets.map((t) =>
            t.id === selectedTicket.id
                ? ({
                    ...t,
                    status: "Resolved",
                    category: "Resolved",
                } as Ticket)
                : t,
        )
        setTickets(updatedTickets)
        setSelectedTicket((prev) => prev ? { ...prev, status: "Resolved", category: "Resolved" } : null)
    }

    const isLoading = userLoading || adminTicketsLoading || myTicketsLoading

    // --- DASHBOARD PAGE RENDER ---
    if (currentPage === "dashboard") {
        if (isLoading) {
            return (
                <div className="min-h-screen font-sans bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                    </div>
                </div>
            )
        }

        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
                <DashboardHeader />
                <StatsCards 
                    tickets={tickets} 
                    statsData={ticketStatsData}
                    userRole={userRole}
                />
                <DashboardContent
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tickets={tickets}
                    knowledgeArticles={knowledgeArticles}
                    teamMembers={teamMembers}
                    onViewTicket={handleViewTicket}
                    onAddTicket={handleAddTicket}
                    userRole={userRole}
                    currentUserId={currentUserId}
                />
            </div>
        )
    }

    // --- TICKET DETAIL PAGE RENDER ---
    if (currentPage === "detail" && selectedTicket) {
        return (
            <TicketDetailView
                ticket={selectedTicket}
                messageInput={messageInput}
                onMessageChange={setMessageInput}
                 onMarkAsResolved={handleMarkAsResolved}
                onBackToDashboard={handleBackToDashboard}
                userRole={userRole}
                currentUserId={currentUserId}
            />
        )
    }

    return <div className="p-10 text-center">Loading Dashboard...</div>
}











 