import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { ModeToggle } from "@/components/ThemeToggle/mode-toggle";
//  import { useTheme } from "@/components/ThemeToggle/theme-provider";
import { useTheme } from "@/hooks/use-theme";
import logoLight from "../assets/prontocorso/ProntoCorsoLogoLight-removebg-preview.png";
import logoDark from "../assets/prontocorso/ProntoCorsoLogoDark-removebg-preview.png";
import GoogleTranslate from "@/components/LanguageToggle/GoogleTranslate";

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: userData } = useGetMeQuery({});
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Smart back navigation
  const handleBack = () => {
    const from = (location.state as { from?: string })?.from;
    
    if (from) {
      // If user came from a specific page (e.g., signup), go back there
      navigate(from);
    } else if (window.history.length > 1) {
      // If there's browser history, go back
      navigate(-1);
    } else {
      // Default fallback to home
      navigate("/");
    }
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

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-slate-200 dark:border-gray-700 px-[5%] py-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tighter">
            <img src={isDarkMode ? logoDark : logoLight} alt="ProntoCorso" className="h-10 rounded-full" />
          
          </Link>
          <div className="hidden lg:flex items-center gap-3 opacity-80">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
              className="h-7"
              alt="App Store"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              className="h-7"
              alt="Google Play"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          {userData?.data ? (
            <button
              onClick={() => {
                const role = userData.data.role;
                if (role === "USER") {
                  navigate("/user");
                } else if (["SUPER_ADMIN", "SUPORT_MANAGER", "CONTENT_MANAGER"].includes(role)) {
                  navigate("/admin");
                } else {
                  navigate("/user");
                }
              }}
              className="hidden w-full sm:flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 transition-colors border-r border-slate-200 dark:border-gray-700 pr-4 cursor-pointer"
            >
              <User className="w-5 h-5 ml-3" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:block text-sm font-bold text-slate-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors border-r border-slate-200 dark:border-gray-700 pr-4 cursor-pointer"
            >
              Portal Login
            </button>
          )}
          <button
            onClick={() => navigate("/")}
            className="bg-blue-700 dark:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-700/20 dark:shadow-blue-600/20 hover:bg-blue-800 dark:hover:bg-blue-700 transition-all cursor-pointer"
          >
            Home
          </button>
          <div className="flex items-center gap-2">
            {/* <LanguageToggle /> */}
            <GoogleTranslate />
            <ModeToggle />
          </div>
        </div>
      </nav>

      <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-500 mb-8 font-semibold cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Service Description
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                ProntoCorso is a tactical study companion designed to help you
                prepare for the Italy B1c Citizenship Language Exam. We provide
                practice questions, flashcards, and learning modules to complement
                your primary language education.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                No Guarantee of Results - Legal Disclaimer
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                <strong className="font-bold text-red-600 dark:text-red-400">
                  IMPORTANT: ProntoCorso does not guarantee, warrant, or promise that you will pass 
                  any official B1c language examination, including but not limited to CILS, CELI, or PLIDA exams.
                </strong>
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                ProntoCorso is a tactical study companion and practice tool. We are not affiliated with, 
                endorsed by, or connected to any official examination body, including:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>Università per Stranieri di Siena (CILS)</li>
                <li>Università per Stranieri di Perugia (CELI)</li>
                <li>Dante Alighieri Society (PLIDA)</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Our service is designed to complement, not replace, formal language education and 
                official preparation courses. Your success on any examination depends on numerous factors 
                beyond our control, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>Your individual language proficiency and study habits</li>
                <li>The specific requirements and format of the official examination</li>
                <li>Your performance on the examination day</li>
                <li>Changes in examination standards or formats</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                <strong className="font-bold">By using ProntoCorso, you acknowledge and agree that:</strong>
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>We make no representations or warranties regarding examination outcomes</li>
                <li>Your use of our service is at your own risk</li>
                <li>We are not responsible for any failure to pass any examination</li>
                <li>No refunds will be provided based on examination results</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                User Responsibilities
              </h2>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li>Provide accurate account information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the service in accordance with these terms</li>
                <li>Not share your account with others</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Subscription and Payments
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Subscriptions are billed monthly or annually as selected. You may
                cancel your subscription at any time. Cancellation takes effect at
                the end of your current billing period. Refunds are handled on a
                case-by-case basis.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Limitation of Liability
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                <strong className="font-bold">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong>
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                ProntoCorso, its affiliates, officers, directors, employees, and agents shall not be 
                liable for any indirect, incidental, special, consequential, or punitive damages, 
                including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>Loss of profits, revenue, data, or use</li>
                <li>Failure to pass any examination or achieve any educational goal</li>
                <li>Costs of substitute services</li>
                <li>Any damages resulting from reliance on our service</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Our total liability to you for all claims arising from or related to your use of 
                ProntoCorso shall not exceed the amount you paid to us in the twelve (12) months 
                preceding the claim, or €50 (fifty euros), whichever is greater.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                <strong className="font-bold">Some jurisdictions do not allow the exclusion or limitation 
                of incidental or consequential damages, so the above limitation may not apply to you.</strong>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                For questions about these terms, please contact us through our
                support portal or email us at support@prontocorso.com
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 text-slate-600 dark:text-gray-400 pt-20 pb-10 px-[5%] border-t border-slate-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16 mb-16 text-left">
            <div>
              <Link to="/#home" state={{ from: "/" }} className="flex items-center gap-4">
                <img src={isDarkMode ? logoDark : logoLight} alt="ProntoCorso" className="w-50  mb-6 rounded-full" />

              </Link>
              <p className="text-sm leading-relaxed mb-8 text-slate-600 dark:text-gray-400">
                Empowering citizenship applicants with the specific tactical
                skills needed to pass the <span className="font-bold text-slate-900 dark:text-white">B1c</span> exam.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h5 className="text-slate-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-widest">
                  Portal
                </h5>
                <ul className="space-y-4 text-sm font-semibold">
                  <li>
                    <button
                      onClick={() => navigate("/login")}
                      className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      Login
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        navigate("/#pricing");
                        // Wait for navigation, then scroll to pricing section
                        setTimeout(() => {
                          const pricingSection = document.getElementById("pricing");
                          if (pricingSection) {
                            pricingSection.scrollIntoView({ behavior: "smooth" });
                          } else {
                            // If element not found immediately, try again after a short delay
                            setTimeout(() => {
                              const pricingSection = document.getElementById("pricing");
                              pricingSection?.scrollIntoView({ behavior: "smooth" });
                            }, 500);
                          }
                        }, 100);
                      }}
                      className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      Subscribe
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="text-slate-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-widest">
                  Legal
                </h5>
                <ul className="space-y-4 text-sm font-semibold">
                  <li>
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <h5 className="text-slate-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-widest">
                About
              </h5>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-gray-400 italic">
                ProntoCorso is an independent tool built to accompany your
                primary language education. Focused on CILS, CELI, and PLIDA
                preparation.
              </p>
            </div>
          </div>

          {/* Disclaimer Text */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-gray-700">
            <p className="text-sm leading-relaxed text-slate-500 dark:text-gray-300 text-center max-w-5xl mx-auto">
              ProntoCorso is an independent educational tool. It accompanies your primary language education. We focus on preparation standards for exams including CILS, CELI, and PLIDA. We are not affiliated with these exam bodies. All content is original. It is not derived from official proprietary exam materials. We strictly adhere to the CEFR B1 Standard. This content is for practice purposes only. It does not guarantee a passing score. CILS is a trademark of the Università per Stranieri di Siena. CELI is a trademark of the Università per Stranieri di Perugia. PLIDA is a trademark of the Dante Alighieri Society. All other trademarks are the property of their respective owners.
            </p>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-gray-400">
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Privacy Policy
            </a> |   <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Terms of Service
            </a>  |  © {new Date().getFullYear()} ProntoCorso.
          </p>
        </div>
      </footer>
    </>
  );
};

export default TermsOfService;

