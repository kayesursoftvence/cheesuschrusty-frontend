import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import adminimg from "../../assets/adminimg.svg";
import themeicon from "../../assets/Component 10.svg";
import { LayoutNavber } from "../LayoutNavber";
import { AiOutlineMenuFold } from "react-icons/ai";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Function to check if the screen is mobile or desktop
  const checkIfMobile = () => {
    const mobile = window.innerWidth < 1024; // lg breakpoint
    setIsMobile(mobile);
    // On desktop, sidebar should be open by default
    if (!mobile) {
      setSidebarOpen(true);
    }
  };

  useEffect(() => {
    // Check on initial load
    checkIfMobile();

    // Event listener to handle window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const handleclick = () => {
    alert("clicked");
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5] dark:bg-[#191919] relative overflow-hidden">
      {/* Sidebar - Overlay on mobile, fixed on desktop */}
      <div
        className={`fixed lg:static inset-0 lg:inset-auto z-50 lg:z-auto transition-all duration-300 ${
          sidebarOpen ? "block" : "hidden lg:block"
        }`}
      >
        {/* Mobile overlay backdrop */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <div className="relative h-full">
          <AdminSidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative w-full lg:w-auto">
        {/* Mobile Menu Toggle Button */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(true)}
           className="fixed top-6 right-4 z-40 w-9 h-9 dark:bg-[#0A0A0A] text-white rounded-lg flex items-center justify-center  border border-gray-300 dark:border-gray-700  dark:hover:bg-gray-700 transition-colors cursor-pointer lg:hidden"
            aria-label="Open menu"
          >
            <AiOutlineMenuFold className="w-5 h-5 text-black dark:text-white" />
          </button>
        )}

        {/* Top Navigation */}
        <div className="sticky top-0 z-30">
          <LayoutNavber
            userImage={adminimg}
            userName="Darlene Robertson"
            userRole="Admin"
            themeIcon={themeicon}
            onThemeClick={handleclick}
          />
        </div>
        
        {/* Main content area */}
        <div className="flex-1 overflow-auto  lg:p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;