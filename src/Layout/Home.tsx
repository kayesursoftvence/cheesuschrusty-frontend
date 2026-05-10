/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  useGetActivePlansQuery,
  useCreateCheckoutSessionMutation,
} from "@/redux/features/subscriptions/subscriptionsApi";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { ModeToggle } from "@/components/ThemeToggle/mode-toggle";
//  import { useTheme } from "@/components/ThemeToggle/theme-provider";
import { useTheme } from "@/hooks/use-theme";
import CookieConsent from "@/components/CookieConsent/CookieConsent";
import logo from "../assets/prontocorso/ProntoCorsoLogoLight-removebg-preview.png";
import img from "../assets/prontocorso/ProntoCorsoLogoDark-removebg-preview.png";
import GoogleTranslate from "@/components/LanguageToggle/GoogleTranslate";
import singlelogo from "../assets/prontocorso/ProntoCorsoBadge-removebg-preview.png";
const EliteItalianMastery: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { data: userData } = useGetMeQuery({});
  // const { data: subscriptionData } = useGetMySubscriptionQuery(); // Unused after lint fix
  const { data: plansResponse, isLoading: plansLoading } =
    useGetActivePlansQuery();
  const [createCheckoutSession, { isLoading: checkoutLoading }] =
    useCreateCheckoutSessionMutation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processingPlanAlias, setProcessingPlanAlias] = useState<string | null>(null);
  // const [_isTrialUsed, setIsTrialUsed] = useState(false); // Removed as it is unused
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    const currentTimeout = timeoutRef.current;
    const currentAudio = audioRef.current;
    return () => {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, []);



  // Get active premium plans (excluding free plan)
  const premiumPlans = useMemo(() =>
    plansResponse?.data?.filter((plan: any) => plan.isActive && plan.price > 0) || [],
    [plansResponse]
  );


  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

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

  // Auto-select first plan
  useEffect(() => {
    if (premiumPlans.length > 0 && !selectedPlan) {
      setSelectedPlan(premiumPlans[0].alias);
    }
  }, [premiumPlans, selectedPlan]);

  const handleCheckout = async (planAlias?: string) => {
    if (!userData?.data) {
      toast.error("Please log in to subscribe");
      navigate("/login");
      return;
    }

    const planToProcess = planAlias || selectedPlan;
    if (!planToProcess) {
      toast.error("Please select a plan");
      return;
    }

    setProcessingPlanAlias(planToProcess);

    try {
      const result = await createCheckoutSession({
        planAlias: planToProcess,
      }).unwrap();

      if (result.data.checkoutUrl) {
        window.location.href = result?.data?.checkoutUrl;
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create checkout session");
      setProcessingPlanAlias(null);
    }
  };



  const handlePlayAudio = () => {
    if (isAudioPlaying) return;

    if (!("speechSynthesis" in window)) {
      toast.error("Speech synthesis is not supported in your browser.");
      return;
    }

    setIsAudioPlaying(true);
    setAudioProgress(0);

    const text =
      "Attenzione. Il treno Frecciarossa nove cinque zero quattro per Milano Centrale è in partenza dal binario quattro anziché dal binario due. Ci scusiamo per il disagio.";

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Function to get the sweetest, most attractive Italian voice
    const getBestItalianVoice = (): SpeechSynthesisVoice | null => {
      const voices = window.speechSynthesis.getVoices();

      // Priority: Italian voices (strongly prefer female for sweeter sound)
      const italianVoices = voices.filter((voice) =>
        voice.lang.startsWith("it") || voice.lang.startsWith("it-IT")
      );

      if (italianVoices.length === 0) {
        // Fallback: try to find any pleasant-sounding female voice
        const pleasantVoices = voices.filter((voice) =>
          voice.name.toLowerCase().includes("female") ||
          voice.name.toLowerCase().includes("zira") ||
          voice.name.toLowerCase().includes("samantha") ||
          voice.name.toLowerCase().includes("karen") ||
          voice.name.toLowerCase().includes("susan")
        );
        return pleasantVoices[0] || voices.find((voice) => voice.default) || voices[0] || null;
      }

      // Strongly prefer female Italian voices for sweeter, more attractive sound
      const sweetFemaleVoices = italianVoices.filter((voice) =>
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("zira") ||
        voice.name.toLowerCase().includes("elisa") ||
        voice.name.toLowerCase().includes("silvia") ||
        voice.name.toLowerCase().includes("chiara") ||
        voice.name.toLowerCase().includes("francesca") ||
        voice.name.toLowerCase().includes("alice") ||
        voice.name.toLowerCase().includes("sara")
      );

      if (sweetFemaleVoices.length > 0) {
        // Prefer premium/neural voices if available (usually sound better)
        const premiumVoice = sweetFemaleVoices.find((voice) =>
          voice.name.toLowerCase().includes("neural") ||
          voice.name.toLowerCase().includes("premium") ||
          voice.name.toLowerCase().includes("enhanced")
        );
        return premiumVoice || sweetFemaleVoices[0];
      }

      // Fallback to any female Italian voice
      const anyFemaleVoice = italianVoices.find((voice) =>
        !voice.name.toLowerCase().includes("male") &&
        !voice.name.toLowerCase().includes("diego") &&
        !voice.name.toLowerCase().includes("marco")
      );

      if (anyFemaleVoice) return anyFemaleVoice;

      // Last resort: any Italian voice
      return italianVoices[0];
    };

    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "it-IT";

    // Sweet and attractive voice settings
    utterance.rate = 0.82; // Slightly slower for more pleasant, clear speech
    utterance.pitch = 1.1; // Slightly higher pitch for sweeter, more attractive sound
    utterance.volume = 0.95; // Slightly softer volume for more pleasant listening

    // Select the best available Italian voice
    const selectedVoice = getBestItalianVoice();
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Track progress with better accuracy
    let startTime: number | null = null;
    let progressInterval: NodeJS.Timeout | null = null;
    const estimatedDuration = (text.length / 8) * 1000; // Better estimate: ~8 chars per second

    progressInterval = setInterval(() => {
      if (startTime) {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(95, (elapsed / estimatedDuration) * 100); // Cap at 95% until onend
        setAudioProgress(progress);
      }
    }, 50); // More frequent updates for smoother progress

    utterance.onstart = () => {
      startTime = Date.now();
      setAudioProgress(5); // Start at 5% when speech actually starts
    };

    utterance.onend = () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setIsAudioPlaying(false);
      setAudioProgress(100);
    };

    utterance.onerror = (event) => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setIsAudioPlaying(false);
      setAudioProgress(0);

      // More specific error messages
      const errorMessage = event.error === 'network'
        ? "Network error. Please check your connection."
        : event.error === 'synthesis-failed'
          ? "Speech synthesis failed. Please try again."
          : "Failed to play audio. Please try again.";

      toast.error(errorMessage);
    };

    // Wait for voices to load if needed (some browsers load voices asynchronously)
    const speakWithVoice = () => {
      const voice = getBestItalianVoice();
      if (voice) {
        utterance.voice = voice;
      }
      window.speechSynthesis.speak(utterance);
    };

    // Check if voices are already loaded
    if (window.speechSynthesis.getVoices().length > 0) {
      speakWithVoice();
    } else {
      // Wait for voices to load
      window.speechSynthesis.onvoiceschanged = () => {
        speakWithVoice();
        window.speechSynthesis.onvoiceschanged = null; // Remove listener after first use
      };
    }
  };

  const handleAnswer = (id: string) => {
    setSelectedAnswer(id);
    setShowFeedback(true);
  };

  // A/B Test Variant
  const AB_VARIANT = "A";
  const variantContent = {
    A: {
      title: (
        <>
          Confidence Built
          <br />
          <span className="text-blue-700 dark:text-blue-400">One Section at a Time.</span>
        </>
      ),
      desc: "The language requirement is a hurdle, not a barrier. We provide the tactical practice you need to walk into your B1c exam with total structural confidence.",
    },
    B: {
      title: (
        <>
          Pass Your Exam,
          <br />
          <span className="text-blue-700 dark:text-blue-400">Secure Your Citizenship.</span>
        </>
      ),
      desc: "Stop guessing and start passing. ProntoCorso is the precision engine built to get you through the B1c exam and into your life as a global citizen.",
    },
  };

  const currentVariant = variantContent[AB_VARIANT as keyof typeof variantContent];

  if (plansLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 text-slate-900 dark:text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 dark:border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-gray-400">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-slate-900 dark:text-white overflow-x-hidden bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-slate-200 dark:border-gray-700 px-[5%] py-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <Link to="/#home" className="text-2xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tighter">
              {/* Badge logo for small devices */}
              <img src={singlelogo} alt="ProntoCorso" className="w-12 h-12 md:hidden rounded-full" />
              {/* Regular logo for medium+ devices */}
              <img src={isDarkMode ? img : logo} alt="ProntoCorso" className="w-50 hidden md:block rounded-full" />
              {/* ProntoCorso */}
            </Link>
          </div>

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
                // User is logged in - navigate to dashboard based on role
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
            onClick={() => {
              const pricingSection = document.getElementById("pricing");
              pricingSection?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-blue-700 hidden	md:block  dark:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-700/20 dark:shadow-blue-600/20 hover:bg-blue-800 dark:hover:bg-blue-700 transition-all cursor-pointer"
          >
            Subscribe
          </button>

          <div className="flex items-center gap-2">
            {/* <LanguageToggle /> */}
            <GoogleTranslate />
            <ModeToggle />
            
            {/* Avatar dropdown for small devices only */}
            {!userData?.data && (
              <div className="relative md:hidden">
                <button
                  onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                >
                  <FaUserCircle className="w-6 h-6" />
                </button>
                
                {/* Dropdown Menu */}
                {isAvatarDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setIsAvatarDropdownOpen(false)}
                    />
                    <div className="absolute right-0 z-50 mt-2 w-32 rounded-lg border border-gray-200 bg-white shadow-lg dark:bg-gray-800 dark:border-gray-600">
                      <button
                        onClick={() => {
                          navigate("/login");
                          setIsAvatarDropdownOpen(false);
                        }}
                        className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm transition hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white text-left"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          navigate("/signup");
                          setIsAvatarDropdownOpen(false);
                        }}
                        className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm transition hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white text-left border-t border-gray-200 dark:border-gray-700"
                      >
                        Signup
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-40 pb-24 px-[5%] text-center bg-gradient-to-b from-blue-50/50 dark:from-gray-900 to-white dark:to-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-4 px-6 py-3 mb-8 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-full shadow-md dark:shadow-gray-900/50"
        >
          <div className="flex h-4 w-10 rounded-sm overflow-hidden border border-slate-200 dark:border-gray-700">
            <div className="h-full w-1/3 bg-[#009246]"></div>
            <div className="h-full w-1/3 dark:bg-white bg-white"></div>
            <div className="h-full w-1/3 bg-[#ce2b37]"></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-800 dark:text-gray-200 text-sm font-black uppercase tracking-[0.12em]">
              Italy B1c Citizenship Language Exam Mastery
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] font-serif text-slate-900 dark:text-white"
        >
          {currentVariant.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto text-xl text-slate-600 dark:text-gray-300 font-medium mb-10 leading-relaxed"
        >
          {currentVariant.desc}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center gap-6"
        >
          <button
            onClick={() => {
              if (userData?.data) {
                // User is logged in - navigate to dashboard based on role
                const role = userData.data.role;
                if (role === "USER") {
                  navigate("/user");
                } else if (["SUPER_ADMIN", "SUPORT_MANAGER", "CONTENT_MANAGER"].includes(role)) {
                  navigate("/admin");
                } else {
                  navigate("/user");
                }
              } else {
                // User not logged in - go to login page
                navigate("/login");
              }
            }}
            className="bg-blue-700 dark:bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-700/30 dark:shadow-blue-600/30 hover:scale-[1.02] transition-all hover:bg-blue-800 dark:hover:bg-blue-700 cursor-pointer"
          >
            {userData?.data ? "Go to Dashboard" : "Start Free Practice Section"}
          </button>

        </motion.div>
      </section>

      {/* Companion Text */}
      <section className="py-24 px-[5%] bg-white dark:bg-gray-900 border-y border-slate-100 dark:border-gray-800 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#009246]"></div>
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#ce2b37]"></div>

        <div className="max-w-7xl mx-auto text-center relative">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 dark:border-gray-700 rounded-lg bg-slate-50 dark:bg-gray-800">
            <div className="flex h-4 w-10 rounded-sm overflow-hidden border border-slate-200 dark:border-gray-700">
            <div className="h-full w-1/3 bg-[#009246]"></div>
            <div className="h-full w-1/3 dark:bg-white bg-white"></div>
            <div className="h-full w-1/3 bg-[#ce2b37]"></div>
          </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 ml-1">
                Official Exam Patterns
              </span>
            </div>
          </div>
          <p className="text-blue-600 dark:text-blue-400 font-bold text-xl mb-4 tracking-wide uppercase">
            Preparing for the CILS, CELI, or PLIDA?
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight font-serif text-slate-900 dark:text-white">
            Built to Complement Your Preparation
          </h2>
          <p className="text-xl text-slate-700 dark:text-gray-300 leading-relaxed font-medium mb-6">
            ProntoCorso is designed to work in conjunction with official{" "}
            <span className="font-bold">B1c</span> preparation courses. We are
            a specialized companion that builds confidence in test structure,
            content, and your ability to pass.
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 px-[5%] bg-slate-50/50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold mb-3 font-serif text-slate-900 dark:text-white">
              The Gateway to Your New Future
            </h3>
            <p className="text-slate-500 dark:text-gray-400 font-medium">
              Clear the <span className="text-slate-700 dark:text-gray-300 font-bold">B1c</span>{" "}
              hurdle and unlock permanent global advantages.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                icon: "🌍",
                title: "Global Mobility",
                desc: "Access 190+ countries with a top-tier passport.",
              },
              {
                icon: "🇪🇺",
                title: "EU Freedom",
                desc: "Live, work, and study freely across all EU nations.",
              },
              {
                icon: "⚖️",
                title: "Voting Rights",
                desc: "Gain a permanent political voice in Italy.",
              },
              {
                icon: "👨‍👩‍👧‍👦",
                title: "Family Legacy",
                desc: "Secure citizenship for your children automatically.",
              },
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/50"
              >
                <div className="text-2xl mb-3 ">{benefit.icon}</div>
                <h4 className="font-bold text-base text-slate-800 dark:text-gray-200 mb-1">
                  {benefit.title}
                </h4>
                <p className="text-base text-slate-500 dark:text-gray-400 leading-relaxed italic">
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Simulation */}
      <section
        id="sample"
        className="py-24 px-[5%] bg-white dark:bg-gray-900 scroll-mt-20"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white font-serif">
            Experience a <span className="text-blue-700 dark:text-blue-400">Real</span>{" "}
            <span className="font-bold">B1c</span> Scenario
          </h2>
          <p className="text-slate-500 dark:text-gray-400">Listen carefully and identify the situational logic.</p>
        </div>

        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-gray-900/50 border border-slate-200 dark:border-gray-700">
          <h4 className="font-bold text-slate-800 dark:text-gray-200 mb-2 uppercase tracking-widest text-xs">
            Ascolto/Listening Section 1: Daily Interactions
          </h4>

          <button
            onClick={handlePlayAudio}
            className="w-full relative overflow-hidden flex items-center gap-4 p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all mb-8 cursor-pointer"
          >
            <span className="text-2xl">
              {isAudioPlaying ? "🔊" : "▶️"}
            </span>
            <span className="font-bold text-slate-700 dark:text-gray-300">
              {isAudioPlaying
                ? "Listening to B1c Section..."
                : "Click to Play Audio Section"}
            </span>
            <div
              className="absolute bottom-0 left-0 h-1.5 bg-blue-600 transition-all duration-100"
              style={{ width: `${audioProgress}%` }}
            ></div>
          </button>

          <div className="grid grid-cols-1 gap-3">
            {[
              {
                id: "a",
                text: "Il treno per Milano è stato cancellato improvvisamente.",
                correct: false,
              },
              {
                id: "b",
                text: "I passeggeri devono spostarsi per salire a bordo del convoglio.",
                correct: true,
              },
              {
                id: "c",
                text: "Il treno 9504 sta arrivando con un forte ritardo alla stazione.",
                correct: false,
              },
              {
                id: "d",
                text: "La destinazione finale del treno è stata modificata poco fa.",
                correct: false,
              },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className={`w-full text-left p-5 rounded-xl border-2 font-semibold transition-all cursor-pointer ${selectedAnswer === option.id
                  ? option.correct
                    ? "border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-slate-900 dark:text-white"
                    : "border-rose-300 dark:border-rose-600 bg-rose-50 dark:bg-rose-900/30 text-slate-900 dark:text-white"
                  : "border-slate-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-500 text-slate-900 dark:text-gray-200"
                  }`}
              >
                {option.id.toUpperCase()}) {option.text}
              </button>
            ))}
          </div>

          {showFeedback && (
            <div
              className={`mt-8 p-6 rounded-2xl border-2 ${selectedAnswer === "b"
                ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700"
                : "bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-700"
                }`}
            >
              <div
                className={`font-black text-lg mb-2 ${selectedAnswer === "b"
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-rose-700 dark:text-rose-400"
                  }`}
              >
                {selectedAnswer === "b"
                  ? "Ottimo! Direct Answer Identified."
                  : "Not quite right."}
              </div>
              {selectedAnswer === "b" ? (
                <>
                  <div className="mb-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg italic text-slate-700 dark:text-gray-300 text-sm border dark:border-gray-700 leading-relaxed">
                    "Attenzione. Il treno Frecciarossa 9504 per Milano Centrale è
                    in partenza dal binario 4{" "}
                    <strong className="text-blue-700 dark:text-blue-400 font-bold">anziché</strong>{" "}
                    dal binario 2."
                  </div>
                  <div className="text-slate-700 dark:text-gray-300 leading-relaxed text-sm">
                    You correctly navigated the{" "}
                    <strong className="font-bold">anziché</strong> (instead of)
                    keyword. This matches the logic required for success.
                  </div>
                </>
              ) : (
                <div className="text-slate-700 dark:text-gray-300 leading-relaxed text-sm">
                  The speaker used the keyword{" "}
                  <strong className="font-bold text-rose-700 dark:text-rose-400">anziché</strong> to
                  indicate a situational change. These are standard exam
                  distractors.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="py-24 px-[5%] bg-white dark:bg-gray-900 text-slate-900 dark:text-white text-center scroll-mt-20"
      >
        <h2 className="text-4xl font-bold mb-12 font-serif text-slate-900 dark:text-white">
          Agile Growth for Your Success
        </h2>
        <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="flex-1 min-w-[300px] p-10 rounded-3xl bg-slate-50 dark:bg-gray-800/50 backdrop-blur-sm border border-slate-200 dark:border-gray-700 flex flex-col justify-between">
            <div>
              <h3 className="text-lg opacity-60 dark:opacity-80 font-semibold mb-2 text-slate-700 dark:text-gray-300">
                Free Practice
              </h3>
              <div className="text-4xl font-black mb-6 text-slate-900 dark:text-white">€0</div>
              <ul className="text-sm text-left space-y-4 mb-10 opacity-80 text-slate-700 dark:text-gray-300">
                <li>✅ 1 Random Practice Question Daily</li>
                <li>✅ La Frase del Giorno Newsletter</li>
                <li>✅ Basic Smart Flashcards</li>
              </ul>
            </div>
            {/* {!subscriptionData?.data?.isPro && !isTrialUsed && (
            <button
              onClick={() => navigate("/signup")}
              className="w-full bg-white/10 text-white py-4 rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
            >
              Start Now
            </button>
            )} */}
          </div>

          {/* Premium Plan */}
          {premiumPlans.length > 0 && (
            <div className="flex-1 min-w-[300px] p-10 rounded-3xl bg-blue-600 dark:bg-blue-700 shadow-2xl shadow-blue-600/20 dark:shadow-blue-700/20 border-2 border-emerald-400/30 dark:border-emerald-500/40 flex flex-col justify-between relative scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-400 dark:bg-emerald-500 text-blue-900 dark:text-white text-[10px] font-black uppercase px-4 py-1 rounded-full whitespace-nowrap">
              ✨7-Day Free Trial
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-white">Premium Support</h3>
                <div className="text-5xl font-black mb-2 text-white">
                  €{premiumPlans[0]?.price?.toFixed(2) || "29"}
                  <span className="text-2xl">/mo</span>
                </div>
                <p className="text-xs text-blue-100 dark:text-blue-200 font-bold mb-6 uppercase tracking-wider">
                  All Free features +
                </p>
                <ul className="text-sm text-left space-y-4 mb-10 text-white">
                  <li className="text-base font-bold text-yellow-200 dark:text-yellow-300 bg-yellow-500/20 dark:bg-yellow-500/30 px-3 py-2 rounded-lg border border-yellow-400/30 dark:border-yellow-400/40">
                    ✨ 7-Day Free Trial
                  </li>
                  {Array.isArray(premiumPlans[0]?.description) && premiumPlans[0]?.description.map((feature: string, idx: number) => (
                    <li key={idx} className="">
                      ✅ {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => {
                  setSelectedPlan(premiumPlans[0]?.alias);
                  handleCheckout(premiumPlans[0]?.alias);
                }}
                disabled={processingPlanAlias === premiumPlans[0]?.alias && checkoutLoading}
                className="w-full bg-white dark:bg-gray-100 text-blue-700 dark:text-blue-800 py-4 rounded-xl font-black text-lg hover:shadow-lg dark:hover:bg-white transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {processingPlanAlias === premiumPlans[0]?.alias && checkoutLoading
                  ? "Processing..."
                  : "Subscribe"}
              </button>
            </div>
          )}

          {/* Additional Premium Plans */}
          {premiumPlans.slice(1).map((plan) => (
            <div
              key={plan.alias}
              className={`flex-1 min-w-[300px] p-10 rounded-3xl bg-slate-50 dark:bg-gray-800/50 backdrop-blur-sm border border-slate-200 dark:border-gray-700 flex flex-col justify-between ${selectedPlan === plan.alias ? "border-blue-500 dark:border-blue-400" : ""
                }`}
            >
              <div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">{plan.name}</h3>
                <div className="text-4xl font-black mb-6 text-slate-900 dark:text-white">
                  €{plan.price?.toFixed(2)}
                </div>
                <ul className="text-sm text-left space-y-4 mb-10 opacity-80 text-slate-700 dark:text-gray-300">
               
                  {Array.isArray(plan.description) && plan.description.map((feature: string, idx: number) => (
                    <li key={idx}>✅ {feature}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => {
                  setSelectedPlan(plan.alias);
                  handleCheckout(plan.alias);
                }}
                disabled={processingPlanAlias === plan.alias && checkoutLoading}
                className="w-full bg-blue-700 dark:bg-blue-600 text-white py-4 rounded-xl font-bold border border-blue-600 dark:border-blue-500 hover:bg-blue-800 dark:hover:bg-blue-700 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {processingPlanAlias === plan.alias && checkoutLoading
                  ? "Processing..."
                  : "Subscribe"}
              </button>
            </div>
          ))}
        </div>

      

      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 text-slate-600 dark:text-gray-400 pt-20 pb-10 px-[5%] border-t border-slate-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16 mb-16 text-left">
            <div>
              <Link to="/#home" state={{ from: "/" }} className="flex items-center gap-4">
                <img src={isDarkMode ? img : logo} alt="ProntoCorso" className="w-50  mb-6 rounded-full" />

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
                        const pricingSection = document.getElementById("pricing");
                        pricingSection?.scrollIntoView({ behavior: "smooth" });
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
                    Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                      Terms of Service
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

      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
};

export default EliteItalianMastery;
