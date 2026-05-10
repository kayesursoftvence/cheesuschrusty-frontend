import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/ThemeToggle/mode-toggle";
//  import { useTheme } from "@/components/ThemeToggle/theme-provider";
import { useTheme } from "@/hooks/use-theme";
import logoLight from "../assets/prontocorso/ProntoCorsoLogoLight-removebg-preview.png";
import logoDark from "../assets/prontocorso/ProntoCorsoLogoDark-removebg-preview.png";
 import GoogleTranslate from "@/components/LanguageToggle/GoogleTranslate";
const Navbar: React.FC = () => {
  // const navigate = useNavigate();
  const [isOpen] = useState(false);
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

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

 

  return (
    <nav className=" dark:bg-gray-800 shadow-lg  ">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white  flex gap-2 items-center text-2xl font-bold">
            <img src={isDarkMode ? logoDark : logoLight} alt="logo" className="h-10 rounded-full" />
              {/* <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400">ProntoCorso</h1> */}
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 items-center gap-2">
          <GoogleTranslate />
          {/* <SingleTranslateButton /> */}
            {/* <LanguageToggle /> */}
            <ModeToggle/>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
          <GoogleTranslate />
          {/* <SingleTranslateButton /> */}
            {/* <LanguageToggle /> */}
            <ModeToggle/>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="text-white block hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-white block hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium"
            >
              About
            </Link>
            <Link
              to="/services"
              className="text-white block hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium"
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="text-white block hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
