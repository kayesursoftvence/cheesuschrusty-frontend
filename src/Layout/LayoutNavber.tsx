"use client"
import { ModeToggle } from "@/components/ThemeToggle/mode-toggle"
import { useGetMeQuery } from "@/redux/features/auth/authApi"
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import GoogleTranslate from "@/components/LanguageToggle/GoogleTranslate"

interface UserHeaderProps {
  userImage: string
  userName: string
  userRole: string
  themeIcon: string
  onThemeClick?: () => void
}

// Helper function to get initials from name
const getInitials = (name: string) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const LayoutNavber: React.FC<UserHeaderProps> = () => {
  const [showLogout] = useState(false)
  const navigate = useNavigate()
  // const handleProfileClick = () => {
  //   setShowLogout((prev) => !prev)
  // }
  const handleLogout = () => {
    navigate("/")
  }

  const { data: userData } = useGetMeQuery({});
  const role = userData?.data?.role;
  // const email = userData?.data?.email;
  // const subscriptionPlan = userData?.data?.subscriptionPlan;
  // const trialAvailable = userData?.data?.trialAvailable;
  const name = userData?.data?.name;
  const avatar = userData?.data?.avatar;
  //(role,email,subscriptionPlan,trialAvailable,name)

  // Determine settings route based on role
  const settingsRoute = role === 'SUPER_ADMIN' ? '/admin/settings' : '/user/settings';

  return (
    <div className="md:px-10 pl-5 pr-15 z-9999 bg-white border-b dark:border-b-[#536580] border-b-[#b9b6b6] py-5 flex items-center justify-between dark:bg-gray-900">
      {/* <div className="flex items-center gap-3 cursor-pointer" onClick={handleProfileClick}> */}
      <Link to={settingsRoute} className="flex items-center gap-3 cursor-pointer">
        {avatar ? (
          <img
            src={avatar}
            alt={name || "User"}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-sm font-bold border-2 border-gray-200 dark:border-gray-700">
            {getInitials(name || "User")}
          </div>
        )}
        <div className="flex flex-col">
          <div className="font-semibold text-sm text-gray-900 dark:text-white">{name || "Guest"}</div>
          <div className="text-xs text-gray-500 dark:text-gray-300">{role || "User"}</div>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <GoogleTranslate />
        {/* <LanguageToggle /> */}
        <ModeToggle />
      </div>
      {showLogout && (
        <div className="absolute top-5 left-70 transform -translate-x-1/2 w-full flex justify-center">
          <button
            onClick={handleLogout}
            className="text-sm bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
