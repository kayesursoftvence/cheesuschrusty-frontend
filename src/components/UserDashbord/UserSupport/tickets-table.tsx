/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { PriorityTag } from "./priority-tag";
import { CategoryTag } from "./category-tag";
import { ChevronLeft, ChevronRight } from "lucide-react";
 
interface TicketsTableProps {
   myTicketsData?: any;
  onViewTicket: (ticketId: string | number) => void;
}

// In tickets-table.tsx, update the interface:
// interface TicketsTableProps {
//   myTicketsData?: any;
//   onViewTicket: (ticket: any) => void; // Changed from string | number to Ticket
// }



export const TicketsTable: React.FC<TicketsTableProps> = ({ myTicketsData, onViewTicket }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Detect the correct shape and extract ticket array
  const rawTickets = useMemo(() => {
    return Array.isArray(myTicketsData)
      ? myTicketsData
      : myTicketsData?.tickets || myTicketsData?.data || [];
  }, [myTicketsData]);

  // Format API response for display with error handling
  const allFormattedTickets = useMemo(() => {
    return rawTickets
      .filter((ticket: any) => ticket && ticket.id) // Filter out invalid tickets
      .map((ticket: any) => {
        try {
          // Get user info from ticket.user if available, otherwise from messages
          const userInfo = ticket.user || {};
          const firstMessage = ticket.messages?.[0];
          const sender = firstMessage?.sender || {};
          
          return {
            id: ticket.id,
            subject: ticket.subject || "No subject",
            responses: ticket.messages?.length || 0,
            user: userInfo.name || sender.name || userInfo.email?.split('@')[0] || "User",
            email: userInfo.email || sender.email || "Unknown",
            priority: ticket.priority 
              ? ticket.priority.charAt(0) + ticket.priority.slice(1).toLowerCase()
              : "Medium",
            category: ticket.status === "RESOLVED" || ticket.status === "CLOSED" 
              ? "Resolved" 
              : ticket.status === "IN_PROGRESS"
                ? "In Progress"
                : "Open",
            lastUpdate: ticket.updatedAt 
              ? new Date(ticket.updatedAt).toLocaleDateString("en-GB")
              : "N/A",
          };
        } catch (error) {
          console.error("Error formatting ticket:", error, ticket);
          return null;
        }
      })
      .filter((ticket: any) => ticket !== null); // Remove any null entries from errors
  }, [rawTickets]);

  // Calculate pagination
  const totalTickets = allFormattedTickets.length;
  const totalPages = Math.max(1, Math.ceil(totalTickets / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTickets = allFormattedTickets.slice(startIndex, endIndex);
  
  // Calculate showing range
  const startItem = totalTickets === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(endIndex, totalTickets);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!allFormattedTickets.length) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-6">
        No tickets found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Ticket number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Subject</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Last Update</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {paginatedTickets.map((ticket: any, index: number) => {
            const ticketNumber = startIndex + index + 1;
            return (
              <tr
                key={ticket.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">{ticketNumber}</td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-gray-200">{ticket.subject}</div>
                  <div className="text-xs text-gray-500">{ticket.responses} replies</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">{ticket.user}</div>
                  <div className="text-xs text-gray-500">{ticket.email}</div>
                </td>
                <td className="px-6 py-4"><PriorityTag priority={ticket.priority} /></td>
                <td className="px-6 py-4"><CategoryTag category={ticket.category} /></td>
                <td className="px-6 py-4 text-sm text-gray-500">{ticket.lastUpdate}</td>
                <td className="px-6 py-4">
                  <button
                    className="text-blue-600 underline dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewTicket(ticket.id as any);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Pagination - Always visible */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {startItem} to {endItem} of {totalTickets} tickets
        </p>
        {totalPages > 1 ? (
          <div className="flex gap-1 items-center">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border transition ${
                currentPage === 1
                  ? "border-gray-200 dark:border-gray-600 cursor-not-allowed opacity-50"
                  : "border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              }`}
            >
              <ChevronLeft size={18} className={`${currentPage === 1 ? "text-gray-400" : "text-gray-600 dark:text-gray-300"}`} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`cursor-pointer px-3 py-1 rounded-lg text-sm font-medium transition ${
                    currentPage === pageNumber 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border transition ${
                currentPage === totalPages
                  ? "border-gray-200 dark:border-gray-600 cursor-not-allowed opacity-50"
                  : "border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              }`}
            >
              <ChevronRight size={18} className={`${currentPage === totalPages ? "text-gray-400" : "text-gray-600 dark:text-gray-300"}`} />
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page 1 of 1
          </div>
        )}
      </div>
    </div>
  );
};
