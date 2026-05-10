import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import logoLight from "../../assets/prontocorso/ProntoCorsoLogoLight-removebg-preview.png";
import logoDark from "../../assets/prontocorso/ProntoCorsoLogoDark-removebg-preview.png";
import logo from "../../assets/prontocorso/ProntoCorsoBadge-removebg-preview (1).png";
import overviewIcon from "../../assets/Dashbord/fi_18.svg";
import Practiceicon from "../../assets/Dashbord/fi_17.svg";
import TrendingUpicon from "../../assets/Dashbord/fi_16.svg";
import Brainicon from "../../assets/Dashbord/fi_15.svg";
import Usersicon from "../../assets/Dashbord/fi_14.svg";
import Calendaricon from "../../assets/Dashbord/fi_13.svg";
import Settingsicon from "../../assets/Dashbord/fi_1.svg";
import Supporticon from "../../assets/Dashbord/fi_2.svg";

import {
  MdKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
  MdLogout,
} from "react-icons/md";

import { useGetMySubscriptionQuery } from "@/redux/features/subscriptions/subscriptionsApi";
// import { useTheme } from "@/components/ThemeToggle/theme-provider";
import { useTheme } from "@/hooks/use-theme";
import { useAppDispatch } from "@/hooks/useRedux";
import { logout } from "@/redux/features/auth/authSlice";
import Cookies from "js-cookie";
import { FaLock } from "react-icons/fa";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const UserSidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const dispatch = useAppDispatch();
  const { data: subscriptionData } = useGetMySubscriptionQuery();
  const isLifetime = subscriptionData?.data?.planAlias === "PRO_LIFETIME" || subscriptionData?.data?.plan === "PRO_LIFETIME";
  const prodata = (subscriptionData?.data?.isPro || isLifetime) ?? false;

  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("role");
    Cookies.remove("email");
    dispatch(logout());
    window.location.href = "/login";
  };

  // Update dark mode status based on theme
  useEffect(() => {
    const updateDarkMode = () => {
      if (theme === "dark") {
        setIsDarkMode(true);
      } else if (theme === "light") {
        setIsDarkMode(false);
      } else {
        // theme === "system"
        setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
      }
    };

    updateDarkMode();

    // Listen for system preference changes if theme is "system"
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => setIsDarkMode(mediaQuery.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const menuItems = [
    { path: "/user", label: "Pro Overview", icon: overviewIcon },
    { path: "/user/practice", label: "Practice", icon: Practiceicon },

    { path: "/user/analytics", label: "Advanced Analytics", icon: TrendingUpicon,disabled: !prodata },

    { path: "/user/flashcards", label: "Advanced Flashcards", icon: Brainicon },

    // PRO-only (visible but disabled if not pro)
    {
      path: "/user/leaderboard",
      label: "Pro Leaderboard",
      icon: Usersicon,
      disabled: !prodata,
    },
    {
      path: "/user/planner",
      label: "AI Study Planner",
      icon: Calendaricon,
      disabled: !prodata,
    },

    { path: "/user/settings", label: "Settings", icon: Settingsicon },
    { path: "/user/support", label: "Support", icon: Supporticon },
  ];

  return (
    <div
      className={`relative z-50 flex flex-col bg-[#EBEBEB] dark:bg-gray-900 border-r border-[#b9b6b6] dark:border-r-[#536580] transition-all duration-300 ease-in-out h-full ${
        sidebarOpen 
          ? (isCollapsed ? "w-20" : "w-64 sm:w-70") 
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
        <div className="md:px-3 pt-4 sm:pt-6">
          <Link to="/" className="block">
            <div
              className={`flex items-center gap-3 border-b border-[#b9b6b6] dark:border-b-[#536580] transition-all duration-300 pb-4 ${
                isCollapsed ? "justify-center px-2" : "px-4 sm:px-6"
              }`}
            >
              {isCollapsed ? (
                <img src={logo} alt="ProntoCorso" className="w-10 h-10 rounded-full" />
              ) : (
                <img 
                  src={isDarkMode ? logoDark : logoLight}
                  alt="ProntoCorso" 
                  className="transition-all duration-300 rounded-full w-50"
                />
              )}
              {!isCollapsed && (
                <h1 className="font-bold text-xl sm:text-2xl text-[#111827] dark:text-gray-200 truncate">
                 ProntoCorso
                </h1>
              )}
            </div>
          </Link>
        </div>
      )}

      {/* Menu */}
      {sidebarOpen && (
        <nav className="flex-1 overflow-y-auto mt-4 px-2 sm:px-3 pb-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isDisabled = item.disabled;

            return (
              <Link
                key={item.path}
                to={isDisabled ? "#" : item.path}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                    return;
                  }
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={`group flex font-semibold items-center gap-3 mb-2 rounded-lg transition-all duration-200 cursor-pointer
                  ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-800 text-gray-400"
                      : isActive
                      ? "bg-[#111827] dark:bg-[#AFC7FF] dark:text-[#111827] text-white shadow-md"
                      : "text-[#686565] dark:text-gray-200 hover:bg-[#111827] dark:hover:bg-gray-800 hover:text-white"
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
                    !isDisabled && "group-hover:scale-110"
                  }`}
                />

                {!isCollapsed && (
                  <span className="flex items-center gap-2 text-sm sm:text-base truncate">
                    {item.label}
                    {isDisabled && (
                      <span className="text-xs  text-black px-2 py-0.5 rounded whitespace-nowrap">
                        <FaLock className="text-xs dark:text-white" />
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
        <div className="p-3 border-t border-[#C6C8CB] dark:border-gray-700">
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
        <div className="hidden lg:block border-t border-[#C6C8CB] dark:border-gray-700 p-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
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









 