import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = Cookies.get("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set("cookie-consent", "accepted", { expires: 365 });
    setShowBanner(false);
    // Show success toast
    toast.success("Cookie preferences saved! Thank you for your consent.", {
      duration: 3000,
      position: "bottom-center",
      style: {
        background: "var(--toast-bg, #10b981)",
        color: "var(--toast-color, #ffffff)",
      },
    });
    // Initialize analytics/tracking here after consent
    initializeTracking();
  };

  const handleReject = () => {
    Cookies.set("cookie-consent", "rejected", { expires: 365 });
    setShowBanner(false);
    // Don't initialize tracking
  };

  const initializeTracking = () => {
    // Add your analytics initialization here
    // Example: Google Analytics, etc.
    // Only call this if user accepts
    if (typeof window !== "undefined" && (window as any).gtag) {
      // Initialize tracking scripts
      // Example: window.gtag('consent', 'update', { analytics_storage: 'granted' });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-700 shadow-2xl dark:shadow-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Cookie Consent
            </h3>
            <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
              By clicking "Accept All", you consent to our use of cookies. You can also choose to reject non-essential cookies.
              <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                Learn more
              </a>
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleReject}
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-gray-300 bg-slate-100 dark:bg-gray-800 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 text-sm font-semibold text-white bg-blue-700 dark:bg-blue-600 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors cursor-pointer shadow-lg dark:shadow-blue-900/50"
            >
              Accept All
            </button>
            <button
              onClick={handleReject}
              className="p-2 text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

