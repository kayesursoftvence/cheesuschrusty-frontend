import type React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage?: number
  totalPages?: number
  totalItems?: number
  startItem?: number
  endItem?: number
  onPageChange?: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage = 1, 
  totalPages = 3,
  totalItems = 0,
  startItem = 1,
  endItem = 10,
  onPageChange
}) => {
  const handlePrevious = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && onPageChange) {
      onPageChange(page);
    }
  };

  // Don't render if no pages or only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="px-6 py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4 dark:border-gray-700 bg-white dark:bg-gray-900">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing {startItem} to {endItem} of {totalItems} tickets
      </p>
      <div className="flex gap-1 items-center">
        <button 
          onClick={handlePrevious}
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
              onClick={() => handlePageClick(pageNumber)}
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
          onClick={handleNext}
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
    </div>
  )
}
