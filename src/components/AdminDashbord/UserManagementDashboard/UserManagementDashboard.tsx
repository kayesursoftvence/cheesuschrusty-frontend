/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import StatsCards from '../Overview/AdminStatsCards';
import SearchAndFilters from './SearchAndFilters';
import UserRow, { User } from './UserRow';
import { useNavigate } from 'react-router-dom';
import { 
  useGetStudentsQuery,
  useUpdateStudentStatusMutation,
   
} from '@/redux/features/userManagement/usermanagementApi';
import { toast } from 'react-hot-toast';

const avatarColors = [
  'bg-yellow-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-400', 'bg-cyan-400',
  'bg-yellow-600', 'bg-amber-500', 'bg-orange-400', 'bg-rose-400', 'bg-gray-400'
];

const UserManagementDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All Role' | 'Pro' | 'Free'>('All Role');
  const [statusFilter, setStatusFilter] = useState<'All Status' | 'Active' | 'Suspended'>('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 1000; // API limit - fetch many users
  const displayUsersPerPage = 10; // UI pagination - show 10 users per page
  
  const navigate = useNavigate();

  // Debug log for current state
 

  // Fetch students from API - always fetch page 1 with high limit for client-side pagination
  const { 
    data: studentsResponse, 
    isLoading: isLoadingStudents, 
    error: studentsError,
    refetch: refetchStudents
  } = useGetStudentsQuery({
    page: 1,
    limit: usersPerPage,
    search: searchTerm,
  });

  // Debug logs for students API
  

  // Fetch user metadata for stats
 

 

  // Debug logs for platform users API
 
  const [updateStudentStatus, { 
    error: updateError 
  }] = useUpdateStudentStatusMutation();

  // Debug logs for mutation
  useEffect(() => {
    if (updateError) {
      //('================ UPDATE STATUS ERROR ================');
      //('Update Error:', updateError);
    }
  }, [updateError]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

 




const transformUserData = (apiUser: any): User => {
  //('Transforming user:', apiUser);

  const role: 'Pro' | 'Free' = apiUser.subscriptionPlan === 'PRO' ? 'Pro' : 'Free';

  const transformedUser: User = {
    id: apiUser.id,
    name: apiUser.name || 'Unknown User',
    email: apiUser.email,
    role, // type is now correct
    status: apiUser.isActive
      ? 'Active'
      : apiUser.status === 'SUSPENDED'
      ? 'Suspended'
      : 'Suspended',
    progress: Math.min(
      ((apiUser.xp || 0) / 10) ||
      ((apiUser.lessonsCompleted || 0) * 10) ||
      ((apiUser.totalMinutesStudied || 0) / 10),
      100
    ),
    avatar: apiUser.avatar || null,
    subscriptionPlan: apiUser.subscriptionPlan,
    isActive: apiUser.isActive,
    xp: apiUser.xp || 0,
    lessonsCompleted: apiUser.lessonsCompleted || 0,
    totalMinutesStudied: apiUser.totalMinutesStudied || 0,
    currentLevel: apiUser.currentLevel || 'N/A'
  };

  //('Transformed user:', transformedUser);
  return transformedUser;
};








  // Get users from API response
  const apiUsers = studentsResponse?.data?.data || [];

  //('================ PROCESSED DATA ================');
  //('API Users Count:', apiUsers.length);
  //('Total Users:', totalUsers);
  //('Total Pages:', totalPages);
  //('First API User Raw:', apiUsers[0]);

  // Apply filters to API data
  const filteredUsers = apiUsers
    .map(transformUserData)
    .filter((user: User) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'All Role' || 
        (roleFilter === 'Pro' && user.subscriptionPlan === 'PRO') ||
        (roleFilter === 'Free' && user.subscriptionPlan === 'FREE');
      
      const matchesStatus = statusFilter === 'All Status' || 
        (statusFilter === 'Active' && user.isActive) ||
        (statusFilter === 'Suspended' && user.status === 'Suspended') ||
        (statusFilter === 'Suspended' && !user.isActive && user.status !== 'Suspended');
      
      const passesFilter = matchesSearch && matchesRole && matchesStatus;
      
   
      
      return passesFilter;
    });

  // Calculate client-side pagination
  const totalPages = Math.ceil(filteredUsers.length / displayUsersPerPage);
  const startIndex = (currentPage - 1) * displayUsersPerPage;
  const endIndex = startIndex + displayUsersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);
 
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && !isLoading) {
      setCurrentPage(page);
      // Scroll to top of table when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers to display (smart pagination)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 10;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };


  const handleEdit = (id: string) => {
    //('Edit user clicked:', id);
    navigate(`/admin/users/${id}`);
  };

  const handleSuspend = async (id: string) => {
    //('Suspend user clicked:', id);
    //('Current update status:', { isUpdatingStatus, updateError });
    
    try {
      //('Calling updateStudentStatus mutation...');
      await updateStudentStatus({
        id,
        status: 'SUSPENDED'
      }).unwrap();
      
      //('Update successful:', result);
      toast.success('User status updated successfully');
      
      // Refetch students to get updated data
      //('Refetching students...');
      refetchStudents();
      
    } catch (error: any) {
      console.error('Error updating user status:', error);
      console.error('Error details:', {
        message: error?.message,
        data: error?.data,
        status: error?.status
      });
      toast.error(error?.data?.message || 'Failed to update user status');
    }
  };
const getErrorMessage = (error: any) => {
  if (!error) return 'Failed to fetch user data';
  if ('data' in error && error.data?.message) return error.data.message;
  if ('error' in error && typeof error.error === 'string') return error.error;
  if ('message' in error && typeof error.message === 'string') return error.message;
  return 'Failed to fetch user data';
};
  // Combined loading state
  const isLoading = isLoadingStudents ;

  return (
    <div className="p-4 sm:p-6 lg:p-8 dark:bg-gray-900 dark:text-gray-200">
      <div className="flex flex-col mx-auto">
        {/* Header with debug info */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 dark:text-gray-200">
                User Management
              </h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                Welcome back! Here's what's happening with your platform today.
              </p>
            </div>
             
          </div>
          
          
        </div>

        <StatsCards />

        {/* Search and Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
              <p className="text-xs text-gray-500 mt-2">
                Fetching data from API...
              </p>
            </div>
          ) : studentsError ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Error Loading Users
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {getErrorMessage(studentsError)}|| {getErrorMessage(studentsError)}
              </p>
              <button
                onClick={() => refetchStudents()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Retry
              </button>
              <p className="text-xs text-gray-500 mt-4">
                Check browser console for detailed error information
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50 border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        Name
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        Email
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        Role
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      currentLevel
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        Progress
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {currentUsers.length > 0 ? (
                      currentUsers.map((user :any, index :number) => (
                        <UserRow
                          key={user.id}
                          user={user}
                          avatarColor={avatarColors[index % avatarColors.length]}
                          onEdit={() => handleEdit(user.id)}
                          onSuspend={() => handleSuspend(user.id)}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-lg font-medium mb-2">No users found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                            <button
                              onClick={() => {
                                setSearchTerm('');
                                setRoleFilter('All Role');
                                setStatusFilter('All Status');
                                setCurrentPage(1);
                              }}
                              className="mt-4 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"
                            >
                              Clear All Filters
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto">
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
                    Showing <span className="font-semibold">{filteredUsers.length > 0 ? startIndex + 1 : 0}</span> to{' '}
                    <span className="font-semibold">{Math.min(endIndex, filteredUsers.length)}</span> of{' '}
                    <span className="font-semibold">{filteredUsers.length}</span> users
                  </p>
                  {totalPages > 1 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center sm:text-left">
                      Page {currentPage} of {totalPages}
                    </p>
                  )}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isLoading}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base font-medium rounded-lg transition-colors cursor-pointer ${
                        currentPage === 1 || isLoading
                          ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                      }`}
                      aria-label="Previous page"
                    >
                      &lt;
                    </button>
                    {getPageNumbers().map((page, index) => {
                      if (page === 'ellipsis') {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="px-2 text-gray-500 dark:text-gray-400"
                          >
                            ...
                          </span>
                        );
                      }
                      const pageNum = page as number;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={isLoading}
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-medium rounded-lg transition-colors cursor-pointer min-w-[2.5rem] ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                              : isLoading
                              ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                          }`}
                          aria-label={`Go to page ${pageNum}`}
                          aria-current={currentPage === pageNum ? 'page' : undefined}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || isLoading}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base font-medium rounded-lg transition-colors cursor-pointer ${
                        currentPage === totalPages || isLoading
                          ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                      }`}
                      aria-label="Next page"
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        
      </div>
    </div>
  );
};

export default UserManagementDashboard;












// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from 'react';
// import StatsCards from '../Overview/AdminStatsCards';
// import SearchAndFilters from './SearchAndFilters';
// import UserRow, { User } from './UserRow';
// import { useNavigate } from 'react-router-dom';
// import { 
//   useGetStudentsQuery,
//   useUpdateStudentStatusMutation 
// } from '@/redux/features/userManagement/usermanagementApi';
// import { toast } from 'react-hot-toast';

// const avatarColors = [
//   'bg-yellow-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-400', 'bg-cyan-400',
//   'bg-yellow-600', 'bg-amber-500', 'bg-orange-400', 'bg-rose-400', 'bg-gray-400'
// ];

// const UserManagementDashboard: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [roleFilter, setRoleFilter] = useState<'All Role' | 'Pro' | 'Free'>('All Role');
//   const [statusFilter, setStatusFilter] = useState<'All Status' | 'Active' | 'Suspended' >('All Status');
//   const [currentPage, setCurrentPage] = useState(1);
//   const usersPerPage = 5;
  
//   const navigate = useNavigate();

//   // Fetch students from API
//   const { 
//     data: studentsResponse, 
//     isLoading, 
//     error 
//   } = useGetStudentsQuery({
//     page: currentPage,
//     limit: usersPerPage,
//     search: searchTerm,
//   });

//   const [updateStudentStatus] = useUpdateStudentStatusMutation();

//   // Handle API error
//   if (error) {
//     console.error('Error fetching students:', error);
//     toast.error('Failed to load users');
//   }

//   // Transform API data to match User interface
//   const transformUserData = (apiUser: any): User => ({
//     id: apiUser.id,
//     name: apiUser.name || 'Unknown User',
//     email: apiUser.email,
//     role: apiUser.subscriptionPlan === 'PRO' ? 'Pro' : 'Free',
//     status: apiUser.isActive ? 'Active' : 'Inactive',
//     progress: Math.min((apiUser.xp || 0) / 10, 100), // Calculate progress from XP
//     avatar: apiUser.avatar,
//     subscriptionPlan: apiUser.subscriptionPlan,
//     isActive: apiUser.isActive
//   });

//   // Get users from API response
//   const apiUsers = studentsResponse?.data?.data || [];
//   const totalUsers = studentsResponse?.data?.meta?.total || 0;
//   const totalPages = studentsResponse?.data?.meta?.totalPages || 1;

//   // Apply filters to API data
//   const filteredUsers = apiUsers
//     .map(transformUserData)
//     .filter((user: User) => {
//       const matchesSearch =
//         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
//       const matchesRole = roleFilter === 'All Role' || 
//         (roleFilter === 'Pro' && user.subscriptionPlan === 'PRO') ||
//         (roleFilter === 'Free' && user.subscriptionPlan === 'FREE');
      
//       const matchesStatus = statusFilter === 'All Status' || 
//         (statusFilter === 'Active' && user.isActive) ||
//         (statusFilter === 'Suspended' && user.status === 'Suspended') ||
//         (statusFilter === 'Inactive' && !user.isActive && user.status !== 'Suspended');
      
//       return matchesSearch && matchesRole && matchesStatus;
//     });

//   const currentUsers = filteredUsers.slice(0, usersPerPage);

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//       // API will automatically refetch with new page
//     }
//   };

//   const handleEdit = (id: string) => {
//     navigate(`/admin/users/${id}`);
//   };

//   const handleSuspend = async (id: string) => {
//     try {
//       await updateStudentStatus({
//         id,
//         status: 'SUSPENDED'
//       }).unwrap();
//       toast.success('User status updated successfully');
//     } catch (error) {
//       console.error('Error updating user status:', error);
//       toast.error('Failed to update user status');
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 dark:bg-gray-900 dark:text-gray-200">
//       <div className="flex flex-col mx-auto">
//         {/* Header */}
//         <div className="mb-6 sm:mb-8">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 dark:text-gray-200">
//             User Management
//           </h1>
//           <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
//             Welcome back! Here's what's happening with your platform today.
//           </p>
//         </div>

//         <StatsCards />

//         {/* Search and Filters */}
//         <SearchAndFilters
//           searchTerm={searchTerm}
//           setSearchTerm={setSearchTerm}
//           roleFilter={roleFilter}
//           setRoleFilter={setRoleFilter}
//           statusFilter={statusFilter}
//           setStatusFilter={setStatusFilter}
//         />

//         {/* Users Table */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
//           {isLoading ? (
//             <div className="p-8 text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full min-w-[600px]">
//                   <thead className="bg-gray-50 border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600">
//                     <tr>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
//                         Name
//                       </th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
//                         Email
//                       </th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
//                         Role
//                       </th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
//                         Status
//                       </th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
//                         Progress
//                       </th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
//                     {currentUsers.length > 0 ? (
//                       currentUsers.map((user : User, index: number) => (
//                         <UserRow
//                           key={user.id}
//                           user={user}
//                           avatarColor={avatarColors[index % avatarColors.length]}
//                           onEdit={() => handleEdit(user.id)}
//                           onSuspend={() => handleSuspend(user.id)}
//                         />
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
//                           No users found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 dark:border-gray-700">
//                 <p className="text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
//                   Showing {((currentPage - 1) * usersPerPage) + 1} to{' '}
//                   {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} users
//                 </p>
//                 <div className="flex items-center gap-1 sm:gap-2">
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className={`px-2 sm:px-3 py-1 cursor-pointer text-gray-600 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-700 ${
//                       currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
//                     }`}
//                   >
//                     &lt;
//                   </button>
//                   {Array.from({ length: totalPages }, (_, i) => (
//                     <button
//                       key={i + 1}
//                       onClick={() => handlePageChange(i + 1)}
//                       className={`px-2 sm:px-3 py-1 cursor-pointer rounded text-sm sm:text-base ${
//                         currentPage === i + 1 
//                           ? 'bg-blue-600 text-white' 
//                           : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
//                       }`}
//                     >
//                       {i + 1}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className={`px-2 sm:px-3 py-1 cursor-pointer text-gray-600 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-700 ${
//                       currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
//                     }`}
//                   >
//                     &gt;
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserManagementDashboard;









// // import React, { useState } from 'react';
// // import StatsCards from '../Overview/AdminStatsCards';
// // import SearchAndFilters from './SearchAndFilters';
// // import UserRow, { User } from './UserRow';
// // import { useNavigate } from 'react-router-dom';
// // import { useGetStudentsQuery } from '@/redux/features/userManagement/usermanagementApi';

// // const avatarColors = [
// //   'bg-yellow-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-400', 'bg-cyan-400',
// //   'bg-yellow-600', 'bg-amber-500', 'bg-orange-400', 'bg-rose-400', 'bg-gray-400'
// // ];

// // const UserManagementDashboard: React.FC = () => {
// //   const {data:AllStusent}=useGetStudentsQuery({})
// //   //(AllStusent)
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [roleFilter, setRoleFilter] = useState<'All Role' | 'Pro' | 'Free'>('All Role');
// //   const [statusFilter, setStatusFilter] = useState<'All Status' | 'Active' | 'Suspended'>('All Status');
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const usersPerPage = 5;

// //   const navigate = useNavigate();

// //   const users: User[] = [
// //     { id: 1, name: 'Cody Fisher', email: 'john.doe@email.com', role: 'Pro', status: 'Active', progress: 61, avatar: 'C' },
// //     { id: 2, name: 'Jerome Bell', email: 'sarah.wilson@email.com', role: 'Free', status: 'Suspended', progress: 18, avatar: 'J' },
// //     { id: 3, name: 'Jacob Jones', email: 'admin@store.com', role: 'Free', status: 'Active', progress: 61, avatar: 'J' },
// //     { id: 4, name: 'Albert Flores', email: 'contact@company.com', role: 'Pro', status: 'Active', progress: 50, avatar: 'A' },
// //     { id: 5, name: 'Theresa Webb', email: 'info@service.org', role: 'Free', status: 'Active', progress: 32, avatar: 'T' },
// //     { id: 6, name: 'Devon Lane', email: 'support@helpdesk.net', role: 'Free', status: 'Active', progress: 80, avatar: 'D' },
// //     { id: 7, name: 'Courtney Henry', email: 'marketing@business.com', role: 'Free', status: 'Active', progress: 75, avatar: 'C' },
// //     { id: 8, name: 'Ralph Edwards', email: 'feedback@community.org', role: 'Pro', status: 'Active', progress: 90, avatar: 'R' },
// //     { id: 9, name: 'Wade Warren', email: 'sales@ecommerce.com', role: 'Free', status: 'Active', progress: 20, avatar: 'W' },
// //     { id: 10, name: 'Arlene McCoy', email: 'hello@website.com', role: 'Pro', status: 'Active', progress: 40, avatar: 'A' },
// //   ];

// //   const filteredUsers = users.filter(user => {
// //     const matchesSearch =
// //       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       user.email.toLowerCase().includes(searchTerm.toLowerCase());
// //     const matchesRole = roleFilter === 'All Role' || user.role === roleFilter;
// //     const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter;
// //     return matchesSearch && matchesRole && matchesStatus;
// //   });

// //   // Pagination logic
// //   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
// //   const startIndex = (currentPage - 1) * usersPerPage;
// //   const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

// //   const handlePageChange = (page: number) => {
// //     if (page >= 1 && page <= totalPages) setCurrentPage(page);
// //   };

// //   const handleEdit = (id: number) => {
// //     navigate(`/admin/${id}`);
// //   };

// //   return (
// //     <div className="p-4 sm:p-6 lg:p-8 dark:bg-gray-900 dark:text-gray-200">
// //       <div className="flex flex-col mx-auto">
// //         {/* Header */}
// //         <div className="mb-6 sm:mb-8">
// //           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 dark:text-gray-200">User Management</h1>
// //           <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Welcome back! Here's what's happening with your platform today.</p>
// //         </div>

// //         <StatsCards />

// //         {/* Search and Filters */}
// //         <SearchAndFilters
// //           searchTerm={searchTerm}
// //           setSearchTerm={setSearchTerm}
// //           roleFilter={roleFilter}
// //           setRoleFilter={setRoleFilter}
// //           statusFilter={statusFilter}
// //           setStatusFilter={setStatusFilter}
// //         />

// //         {/* Users Table */}
// //         <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
// //           <div className="overflow-x-auto">
// //             <table className="w-full min-w-[600px]">
// //               <thead className="bg-gray-50 border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600">
// //                 <tr>
// //                   <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Name</th>
// //                   <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Email</th>
// //                   <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Role</th>
// //                   <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>
// //                   <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Progress</th>
// //                   <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
// //                 {currentUsers.map((user, index) => (
// //                   <UserRow
// //                     key={user.id}
// //                     user={user}
// //                     avatarColor={avatarColors[index % avatarColors.length]}
// //                     onEdit={() => handleEdit(user.id)}
// //                   />
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Pagination */}
// //           <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 dark:border-gray-700">
// //             <p className="text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
// //               Showing {startIndex + 1} to {Math.min(startIndex + usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
// //             </p>
// //             <div className="flex items-center gap-1 sm:gap-2">
// //               <button
// //                 onClick={() => handlePageChange(currentPage - 1)}
// //                 disabled={currentPage === 1}
// //                 className={`px-2 sm:px-3 py-1 cursor-pointer text-gray-600 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-700 ${
// //                   currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
// //                 }`}
// //               >
// //                 &lt;
// //               </button>
// //               {Array.from({ length: totalPages }, (_, i) => (
// //                 <button
// //                   key={i + 1}
// //                   onClick={() => handlePageChange(i + 1)}
// //                   className={`px-2 sm:px-3 py-1 cursor-pointer rounded text-sm sm:text-base ${
// //                     currentPage === i + 1 
// //                       ? 'bg-blue-600 text-white' 
// //                       : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
// //                   }`}
// //                 >
// //                   {i + 1}
// //                 </button>
// //               ))}
// //               <button
// //                 onClick={() => handlePageChange(currentPage + 1)}
// //                 disabled={currentPage === totalPages}
// //                 className={`px-2 sm:px-3 py-1 cursor-pointer text-gray-600 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-700 ${
// //                   currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
// //                 }`}
// //               >
// //                 &gt;
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default UserManagementDashboard;