import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import logoLight from "../../assets/prontocorso/ProntoCorsoLogoLight-removebg-preview.png";
import logoDark from "../../assets/prontocorso/ProntoCorsoLogoDark-removebg-preview.png";
import logo from "../../assets/prontocorso/ProntoCorsoBadge-removebg-preview (1).png";
import pluginIcon from "../../assets/prontocorso/plug-in-icon.svg";
import mailBox from "../../assets/prontocorso/open-mailbox-with-raised-flag.svg";
import overviewIcon from "../../assets/Dashbord/fi_7.svg";
import usermanagementicon from "../../assets/Dashbord/fi_5.svg";
import contentmanagementicon from "../../assets/Dashbord/fi_4.svg";
import Subscriptionicon from "../../assets/Dashbord/fi_6.svg";
import Analyticsicon from "../../assets/Dashbord/fi_3.svg";
import Supporticon from "../../assets/Dashbord/fi_2.svg";
import Settingsicon from "../../assets/Dashbord/fi_1.svg";
import prompt from "../../assets/Dashbord/think.svg"
import {
  MdKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
  MdLogout,
} from "react-icons/md";
import { useAppDispatch } from "@/hooks/useRedux";
import { logout } from "@/redux/features/auth/authSlice";
import Cookies from "js-cookie";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
// import { useTheme } from "@/components/ThemeToggle/theme-provider";
import { useTheme } from "@/hooks/use-theme";
import { FaLock } from "react-icons/fa";
 import type { JSX } from 'react';
 
interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}
 
 export default function AdminSidebar({ sidebarOpen, setSidebarOpen, }: Props): JSX.Element {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetMeQuery({});

  //   updateDarkMode();
  //   // Listen for system preference changes if theme is "system"
  //   if (theme === "system") {
  //     const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  //     const handleChange = () => setIsDarkMode(mediaQuery.matches);
  //     mediaQuery.addEventListener("change", handleChange);
  //     return () => mediaQuery.removeEventListener("change", handleChange);
  //   }
  // }, [theme]);
  
  if (isLoading) return <>Loading...</>;

  const role = data?.data?.role?.toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("role");
    Cookies.remove("email");
    dispatch(logout());
    window.location.href = "/login";
  };

  // const newslaterFunnelIcon = <span className="nav-icon" role="img" aria-label="mailbox">📬</span>

  const menuItems = [
    { path: "/admin", label: "Overview", icon: overviewIcon },
    { path: "/admin/users", label: "User Management", icon: usermanagementicon },
    { path: "/admin/content", label: "Content Management", icon: contentmanagementicon },
    { path: "/admin/subscription", label: "Subscription", icon: Subscriptionicon },
    { path: "/admin/analytics", label: "Analytics", icon: Analyticsicon },
    { path: "/admin/support", label: "Support", icon: Supporticon },
    { path: "/admin/settings", label: "Settings", icon: Settingsicon },
    { path: "/admin/master-prompt", label: "Master Prompt", icon: prompt },


    // New
    // { path: "/admin/email-settings", label: "Email Settings", icon: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Fluent_Emoji_Color_1f4e7.svg" },
    { path: "/admin/api-integrations", label: "API Integrations", icon: pluginIcon },
    { path: "/admin/newslatter-funnel", label: "Newslatter Funnel", icon: mailBox }
  ];

  const adminMenuWithPermissions = menuItems.map((item) => {
    if (role === "CONTENT_MANAGER") {
      return { ...item, disabled: item.path !== "/admin/content" && item.path !== "/admin/settings" };
    }

    if (role === "SUPORT_MANAGER") {
      return { ...item, disabled: item.path !== "/admin/support" && item.path !== "/admin/settings" };
    }

    return { ...item, disabled: false };
  });

  return (
    <div
      className={`relative z-50 flex flex-col bg-[#EBEBEB] dark:bg-[#1F1F1F] border-r border-[#C6C8CB] dark:border-[#444444] transition-all duration-300 ease-in-out h-full ${
        sidebarOpen 
          ? (isCollapsed ? "w-20" : "w-64 sm:w-72") 
          : "w-0 overflow-hidden"
      }`}
    >
      {/* Mobile Close Button */}
      {sidebarOpen && (
        <div className="absolute top-3 right-3 lg:hidden z-10">
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 bg-gray-900 dark:bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors cursor-pointer shadow-lg"
            aria-label="Close menu"
          >
            ✖
          </button>
        </div>
      )}

      {/* Logo */}
      {sidebarOpen && (
        <div className="px-3 pt-4 sm:pt-6">
          <Link to="/" className="block">
            <div
              className={`flex items-center gap-3 border-b border-[#C6C8CB] dark:border-[#444444] transition-all duration-300 pb-4 ${
                isCollapsed ? "justify-center px-2" : "px-4 sm:px-6"
              }`}
            >
              {isCollapsed ? (
                <img src={logo} alt="ProntoCorso" className="w-10 h-10 rounded-full" />
              ) : (
                <img 
                  src={theme === 'dark' ? logoDark : logoLight}
                  alt="ProntoCorso" 
                  className="transition-all duration-300 rounded-full w-50"
                />
              )}
            </div>
          </Link>
        </div>
      )}

      {/* Menu */}
      {sidebarOpen && (
        <nav className="flex-1 overflow-y-auto mt-4 px-2 sm:px-3 pb-4 hide-scrollbar">
          {adminMenuWithPermissions.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.disabled ? "#" : item.path}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                    return;
                  }
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={`group flex items-center gap-3 mb-2 rounded-lg transition-all duration-200 cursor-pointer
                  ${
                    item.disabled
                      ? "opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-800 text-gray-400"
                      : isActive
                      ? "bg-[#111827] text-white dark:bg-[#333333] shadow-md"
                      : "text-[#5e5e5e] hover:bg-[#111827] hover:text-white dark:text-gray-300 dark:hover:bg-[#333333]"
                  }
                  ${isCollapsed ? "justify-center px-3 py-3" : "px-3 sm:px-4 py-2.5 sm:py-3"}
                `}
              >
                <img 
                  src={item.icon} 
                  alt={item.label} 
                  className={`flex-shrink-0 transition-transform duration-200 ${
                    isCollapsed ? "w-6 h-6 sm:w-7 sm:h-7" : "w-5 h-5 sm:w-6 sm:h-6"
                  } ${
                    !item.disabled && "group-hover:scale-110"
                  }`}
                />
                {!isCollapsed && (
                  <span className="flex items-center gap-2 text-sm sm:text-base truncate">
                    {item.label}
                    {item.disabled && (
                      <span className="text-xs   text-white px-2 py-0.5 rounded whitespace-nowrap">
                       <FaLock className="text-xs dark:text-white text-black" />
                      </span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      )}

      {/* Logout */}
      {sidebarOpen && (
        <div className="p-3 border-t border-[#C6C8CB] dark:border-[#444444]">
          <button
            onClick={handleLogout}
            className={`group w-full cursor-pointer flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <MdLogout className={isCollapsed ? "w-6 h-6 sm:w-7 sm:h-7 dark:text-white text-black" : "w-5 h-5 sm:w-6 sm:h-6 dark:text-white text-black"} />
            {!isCollapsed && <span className="text-sm sm:text-base dark:text-white text-black">Logout</span>}
          </button>
        </div>
      )}

      {/* Collapse Button - Desktop only */}
      {sidebarOpen && (
        <div className="hidden lg:block border-t border-[#C6C8CB] dark:border-[#444444] p-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full gap-2 px-3 py-2 rounded-lg bg-white dark:bg-[#333333] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#444444] transition-colors cursor-pointer"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <MdOutlineKeyboardDoubleArrowRight className="text-2xl sm:text-3xl" />
            ) : (
              <div className="flex items-center gap-3">
                <MdKeyboardDoubleArrowLeft className="text-2xl sm:text-3xl" />
                <span className="text-sm sm:text-base">Collapse</span>
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
};


















// import { Link, useLocation } from "react-router-dom";
// import React, { useState } from "react";
// import itimg from "../../assets/cube-group.png";
// import overviewIcon from "../../assets/Dashbord/fi_7.svg";
// import usermanagementicon from "../../assets/Dashbord/fi_5.svg";
// import contentmanagementicon from "../../assets/Dashbord/fi_4.svg";
// import Subscriptionicon from "../../assets/Dashbord/fi_6.svg";
// import Analyticsicon from "../../assets/Dashbord/fi_3.svg";
// import Supporticon from "../../assets/Dashbord/fi_2.svg";
// import Settingsicon from "../../assets/Dashbord/fi_1.svg";
// import { MdKeyboardDoubleArrowLeft, MdLogout } from "react-icons/md";
// import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
// import { useAppDispatch } from "@/hooks/useRedux";
// import { logout } from "@/redux/features/auth/authSlice";
// import Cookies from "js-cookie";
// import { useGetMeQuery } from "@/redux/features/auth/authApi";


// interface AdminSidebarProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: (open: boolean) => void;
// }

// const AdminSidebar: React.FC<AdminSidebarProps> = ({
//   sidebarOpen,
//   setSidebarOpen,
// }) => {
//   const location = useLocation();
//   const [isCollapsed, setIsCollapsed] = useState(false);

// const dispatch = useAppDispatch();
// const {data}=useGetMeQuery({})
// const role=data?.data?.role
// const handleLogout = () => {
//   // Clear Redux state & localStorage
//   localStorage.removeItem("accessToken");
//   localStorage.removeItem("refreshToken");
//   localStorage.removeItem("role");
//   localStorage.removeItem("email");
//   Cookies.remove("accessToken");
//   Cookies.remove("refreshToken");
//   Cookies.remove("role");
//   Cookies.remove("email");
//   dispatch(logout());
//          // clears Redux state
  
//   // Optionally redirect to login page
//   window.location.href = "/login"; // or use navigate from react-router
// };




//   const menuItems = [
//     { path: "/admin", label: "Overview", icon: overviewIcon },
//     { path: "/admin/users", label: "User Management", icon: usermanagementicon },
//     { path: "/admin/content", label: "Content Management", icon: contentmanagementicon },
//     { path: "/admin/subscription", label: "Subscription", icon: Subscriptionicon },
//     { path: "/admin/analytics", label: "Analytics", icon: Analyticsicon },
//     { path: "/admin/support", label: "Support", icon: Supporticon },
//     { path: "/admin/settings", label: "Settings", icon: Settingsicon },
//   ];



// const filteredMenuItems = menuItems.filter((item) => {
//   if (role === "CONTENT_MANAGER") {
//     return item.path === "/admin/content";
//   }

//   if (role === "SUPORT_MANAGER") {
//     return item.path === "/admin/support";
//   }

//   // ADMIN or any other role
//   return true;
// });



//   return (
//     <>
//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div 
//           className="lg:hidden fixed inset-0 bg-black/50 bg-opacity-50 z-40"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
      
//       {/* Sidebar */}
//       <div
//         className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-[#EBEBEB] dark:bg-[#1F1F1F] border-r border-[#C6C8CB] dark:border-[#444444] text-white transition-all duration-300 ease-in-out ${
//           sidebarOpen 
//             ? (isCollapsed ? "w-20 translate-x-0" : "w-72 translate-x-0") 
//             : "-translate-x-full lg:translate-x-0 lg:w-20"
//         }`}
//       >
//         {/* Close Button for mobile */}
//         <div className="absolute top-4 right-4 lg:hidden z-50">
//           <button
//             onClick={() => setSidebarOpen(false)}
//             className="hover:cursor-pointer w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Logo */}
//         <div className={`px-3 ${!sidebarOpen ? 'lg:px-2' : ''}`}>
//           <div
//             className={`flex items-center gap-3 border-b border-b-[#C6C8CB] dark:border-b-[#444444] transition-all duration-300 ${
//               isCollapsed || !sidebarOpen ? "justify-center px-2 py-5" : "px-6 py-6"
//             }`}
//           >
//             <img
//               className={`transition-all duration-300 ${
//                 isCollapsed || !sidebarOpen ? "w-10" : "w-11"
//               }`}
//               src={itimg}
//               alt="Logo"
//             />
//             {(!isCollapsed && sidebarOpen) && (
//               <h1 className="font-bold text-2xl text-[#111827] dark:text-white">
//                 B1 Italian
//               </h1>
//             )}
//           </div>
//         </div>

//         {/* Menu Items */}
//         <nav className="flex-1 justify-between flex flex-col overflow-y-auto mt-4 p-3">
//           <div>
//             {filteredMenuItems.map((item) => {
//             const isActive = location.pathname === item.path;
//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={`group flex items-center gap-3 mb-2 px-4 py-3 rounded-lg transition-all duration-200 ${
//                   isActive
//                     ? "bg-[#111827] text-white dark:bg-[#333333] dark:text-white"
//                     : "text-[#5e5e5e] hover:bg-[#111827]   hover:text-white dark:text-gray-300 dark:hover:bg-[#333333]"
//                 } ${(isCollapsed || !sidebarOpen) ? "justify-center px-2" : ""}`}
//                 onClick={() => {
//                   // Close sidebar on mobile when a menu item is clicked
//                   if (window.innerWidth < 1024) {
//                     setSidebarOpen(false);
//                   }
//                 }}
//               >
//                 <img
//                   src={item.icon}
//                   alt={item.label}
//                   className="w-6 h-6 transition-transform duration-200 group-hover:scale-110"
//                 />
//                 {(!isCollapsed && sidebarOpen) && (
//                   <span className=" dark:text-white  group-hover:text-white">
//                     {item.label}
//                   </span>
//                 )}
//               </Link>
//             );
//           })}
//           </div>

//  {/* Logout */}
//           <div>
//   <button
//     onClick={handleLogout}
//     className={`group w-full  flex items-center gap-3 mb-2 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200
//       text-[#5e5e5e] hover:bg-[#111827] hover:text-white 
//       dark:text-gray-300 dark:hover:bg-[#333333]
//       ${(isCollapsed || !sidebarOpen) ? "justify-center px-2" : ""}
//     `}
//   >
//     <MdLogout className="w-6 h-6 text-red-500" />
//     {!isCollapsed && <span  className="text-red-500">Logout</span>}
//   </button>
// </div>



//         </nav>

//         {/* Collapse / Expand Toggle (Desktop only) */}
//         {sidebarOpen && (
//           <div className="hidden lg:block border-t border-[#C6C8CB] dark:border-[#444444] p-3">
//             <button
//               onClick={() => setIsCollapsed(!isCollapsed)}
//               className="flex cursor-pointer text-[#7E7E7E] dark:text-gray-300 hover:bg-[#111827] hover:text-white justify-center w-full gap-2 px-3 py-2 rounded-lg bg-white dark:bg-[#333333] transition-all duration-200"
//             >
//               {isCollapsed ? (
//                 <MdOutlineKeyboardDoubleArrowRight className="text-3xl" />
//               ) : (
//                 <>
//                   <MdKeyboardDoubleArrowLeft className="text-3xl" />
//                   <span className="text-base pt-1 text-[#111827] dark:text-white">Collapse</span>
//                 </>
//               )}
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default AdminSidebar;