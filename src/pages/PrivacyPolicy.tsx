
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { ModeToggle } from "@/components/ThemeToggle/mode-toggle";
// import { useTheme } from "@/components/ThemeToggle/theme-provider";
import { useTheme } from "@/hooks/use-theme";
import logoLight from "../assets/prontocorso/ProntoCorsoLogoLight-removebg-preview.png";
import logoDark from "../assets/prontocorso/ProntoCorsoLogoDark-removebg-preview.png";
import GoogleTranslate from "@/components/LanguageToggle/GoogleTranslate";

const PrivacyPolicy: React.FC = () => {
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
            <GoogleTranslate />
            {/* <LanguageToggle /> */}
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
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Last updated: January 7, 2026
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            {/* 1. Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                1. Introduction
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                ProntoCorso, operated by AltoAdige, LLC ("we," "our," or "us"), respects your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform at prontocorso.com (the "Service").
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                This policy complies with the EU General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and other applicable data protection laws.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4 font-semibold">
                Key Points: We collect minimal data needed to provide our service. You have full control over your data. We never sell your information. You can delete your account anytime.
              </p>
            </section>

            {/* 2. Data Controller */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                2. Data Controller
              </h2>
              <ul className="list-none pl-0 text-slate-700 dark:text-slate-300 space-y-2">
                <li><strong>Legal Entity:</strong> AltoAdige, LLC</li>
                <li><strong>Operating Name:</strong> ProntoCorso</li>
                <li><strong>Address:</strong> [Your Business Address]</li>
                <li><strong>Email:</strong> hello@prontocorso.com</li>
                <li><strong>EU Representative:</strong> [If applicable, per GDPR Article 27]</li>
              </ul>
            </section>

            {/* 3. Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                3. Information We Collect
              </h2>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                3.1 Information You Provide
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                When you create an account, we collect:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li><strong>Account Information:</strong> Email address, name, password (encrypted)</li>
                <li><strong>Profile Information:</strong> Language preferences, CEFR level, learning goals (optional)</li>
                <li><strong>Payment Information:</strong> Processed by LemonSqueezy (we do not store credit card details)</li>
                <li><strong>Communication Data:</strong> Messages you send to our support team</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                3.2 Information We Collect Automatically
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                When you use our Service, we automatically collect:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li><strong>Usage Data:</strong> Pages viewed, features used, time spent, lesson completions</li>
                <li><strong>Device Information:</strong> Browser type, operating system, device type, IP address</li>
                <li><strong>Performance Data:</strong> Test scores, exercise completions, progress metrics</li>
                <li><strong>Log Data:</strong> Access times, error logs, system events</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                3.3 Learning Data
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                To provide feedback and track progress, we collect:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li><strong>Exercise Responses:</strong> Your written answers, multiple-choice selections</li>
                <li><strong>Audio Recordings:</strong> Speaking exercise recordings (deleted after 30 days)</li>
                <li><strong>Transcripts:</strong> Speech-to-text transcriptions (deleted after 30 days)</li>
                <li><strong>Progress Metrics:</strong> Scores, completion rates, skill levels, learning streaks</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                3.4 Cookies and Tracking Technologies
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We use cookies to maintain your session and remember preferences. See our Cookie Policy for details.
              </p>
            </section>

            {/* 4. Legal Basis for Processing (GDPR) */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. Legal Basis for Processing (GDPR)
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                We process your data based on the following legal grounds:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li><strong>Contract Performance:</strong> To provide our Service and fulfill our Terms of Service</li>
                <li><strong>Legitimate Interests:</strong> To improve our Service, prevent fraud, ensure security</li>
                <li><strong>Consent:</strong> For marketing emails and optional analytics (you can withdraw anytime)</li>
                <li><strong>Legal Obligation:</strong> To comply with tax, accounting, and legal requirements</li>
              </ul>
            </section>

            {/* 5. How We Use Your Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                5. How We Use Your Information
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                We use your data to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li><strong>Provide the Service:</strong> Create your account, generate lessons, provide feedback</li>
                <li><strong>Personalize Experience:</strong> Recommend lessons, track progress, adapt difficulty</li>
                <li><strong>Process Payments:</strong> Handle subscriptions, invoices, refunds</li>
                <li><strong>Communicate:</strong> Send service updates, respond to support requests</li>
                <li><strong>Improve Service:</strong> Analyze usage patterns, fix bugs, develop new features</li>
                <li><strong>Security:</strong> Detect fraud, prevent abuse, protect user accounts</li>
                <li><strong>Legal Compliance:</strong> Meet regulatory requirements, respond to legal requests</li>
                <li><strong>Marketing:</strong> Send educational content and product updates (with consent, opt-out anytime)</li>
              </ul>
            </section>

            {/* 6. AI Processing and Third-Party Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                6. AI Processing and Third-Party Services
              </h2>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                6.1 AI Service Providers
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                We use AI services to generate lessons and provide feedback:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li><strong>OpenAI (GPT-4):</strong> Lesson generation, feedback evaluation, transcription</li>
                <li className="list-none ml-[-1.5rem] mt-1">Data Processing Agreement in place. Your data is NOT used to train their models.</li>
                <li><strong>xAI (Grok):</strong> Alternative lesson generation</li>
                <li className="list-none ml-[-1.5rem] mt-1">Data Processing Agreement in place. Your data is NOT used to train their models.</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                6.2 Other Third-Party Services
              </h3>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li><strong>LemonSqueezy:</strong> Payment processing (see their privacy policy)</li>
                <li><strong>Neon Database:</strong> Data storage (encrypted, EU servers available)</li>
                <li><strong>Cloudinary:</strong> Media hosting for images and audio</li>
                <li><strong>Google Cloud Translation:</strong> Optional translation features</li>
                <li><strong>Hostinger Reach:</strong> Email newsletters (only with your consent)</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-3">
                All third-party services are bound by Data Processing Agreements that comply with GDPR requirements.
              </p>
            </section>

            {/* 7. Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                7. Data Retention
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                We keep your data only as long as necessary:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li><strong>Account Data:</strong> Until you delete your account, plus 30 days for backup recovery</li>
                <li><strong>Progress Data:</strong> Retained to show learning history while account is active</li>
                <li><strong>Audio Recordings:</strong> Automatically deleted after 30 days</li>
                <li><strong>Transcripts:</strong> Automatically deleted after 30 days</li>
                <li><strong>Exercise Responses:</strong> Retained while account is active for progress tracking</li>
                <li><strong>Aggregated Analytics:</strong> Retained indefinitely (fully anonymized, cannot identify you)</li>
                <li><strong>Payment Records:</strong> 7 years (legal requirement for accounting)</li>
                <li><strong>Support Communications:</strong> 2 years for service improvement</li>
              </ul>
            </section>

            {/* 8. Your Rights (GDPR, CCPA, and Other Laws) */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                8. Your Rights (GDPR, CCPA, and Other Laws)
              </h2>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                8.1 Access and Portability
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>Access all personal data we hold about you</li>
                <li>Receive your data in a portable format (JSON/CSV)</li>
                <li>Transfer your data to another service</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                <strong>How:</strong> Go to Settings → Privacy → Download My Data
              </p>

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                8.2 Rectification
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                You can correct inaccurate data:
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                <strong>How:</strong> Go to Settings → Profile to update your information
              </p>

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                8.3 Deletion ("Right to be Forgotten")
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                You can delete your account and all associated data:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>All account information will be permanently deleted</li>
                <li>Progress, scores, and exercise history will be removed</li>
                <li>Backup copies are deleted within 30 days</li>
                <li>Anonymized analytics are retained (cannot identify you)</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                <strong>How:</strong> Go to Settings → Account → Delete My Account
              </p>

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                8.4 Restriction of Processing
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                You can request we limit how we use your data:
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                <strong>How:</strong> Contact us at hello@prontocorso.com
              </p>

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                8.5 Object to Processing
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                You can object to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>Marketing emails (click "Unsubscribe" in any email)</li>
                <li>Analytics cookies (disable in Settings → Privacy)</li>
                <li>Processing based on legitimate interests (contact us)</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                8.6 Withdraw Consent
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Where we rely on consent, you can withdraw it anytime:
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                <strong>How:</strong> Settings → Privacy → Manage Consents
              </p>

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                8.7 Lodge a Complaint
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                You have the right to complain to a supervisory authority:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li><strong>EU Users:</strong> Contact your national data protection authority</li>
                <li><strong>US Users:</strong> Contact the Federal Trade Commission (FTC)</li>
              </ul>
            </section>

            {/* 9. Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                9. Data Security
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                We protect your data using industry-standard security measures:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li><strong>Encryption in Transit:</strong> All data transmitted over HTTPS/TLS</li>
                <li><strong>Encryption at Rest:</strong> Database encryption for sensitive data</li>
                <li><strong>Password Security:</strong> Passwords hashed using bcrypt (we never store plain text)</li>
                <li><strong>Access Controls:</strong> Role-based access, principle of least privilege</li>
                <li><strong>Regular Audits:</strong> Security assessments and vulnerability scans</li>
                <li><strong>Secure Infrastructure:</strong> Hosted on secure, certified cloud providers</li>
                <li><strong>Backup Encryption:</strong> All backups are encrypted</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Despite our security measures, no system is 100% secure. If you believe your account has been compromised, contact us immediately.
              </p>
            </section>

            {/* 10. International Data Transfers */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                10. International Data Transfers
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                <strong>Data Location:</strong> Your data may be processed in:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>United States (our primary infrastructure)</li>
                <li>European Union (database replicas available)</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                <strong>For EU Users:</strong> We ensure adequate protection through:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                <li>Data Processing Agreements with all service providers</li>
                <li>Regular compliance assessments</li>
                <li>Option to store data in EU data centers (contact us)</li>
              </ul>
            </section>

            {/* 11. Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                11. Children's Privacy
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                Our Service is not intended for children under 16 years of age. We do not knowingly collect data from children under 16.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. We will delete the information within 30 days.
              </p>
            </section>

            {/* 12. Marketing and Communications */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                12. Marketing and Communications
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                <strong>What we send:</strong>
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li><strong>Transactional Emails:</strong> Account notifications, password resets, receipts (cannot opt-out)</li>
                <li><strong>Service Updates:</strong> Important changes to the Service (cannot opt-out)</li>
                <li><strong>Educational Content:</strong> Language tips, learning resources (opt-in)</li>
                <li><strong>Product Updates:</strong> New features, improvements (opt-in)</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                <strong>How to opt-out:</strong>
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li>Click "Unsubscribe" at the bottom of any marketing email</li>
                <li>Go to Settings → Notifications → Email Preferences</li>
                <li>Contact us at hello@prontocorso.com</li>
              </ul>
            </section>

            {/* 13. Automated Decision-Making */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                13. Automated Decision-Making
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                We use automated systems to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>Generate practice exercises tailored to your level</li>
                <li>Evaluate your responses and provide feedback</li>
                <li>Calculate scores and track progress</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                These automated decisions significantly affect your experience but do not have legal or similarly significant effects. You can always:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li>Request human review of AI-generated feedback</li>
                <li>Contest automated scores through support</li>
                <li>Ask questions about how decisions are made</li>
              </ul>
            </section>

            {/* 14. California Privacy Rights (CCPA) */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                14. California Privacy Rights (CCPA)
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                California residents have additional rights:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li><strong>Right to Know:</strong> What data we collect and how we use it</li>
                <li><strong>Right to Delete:</strong> Request deletion of your data</li>
                <li><strong>Right to Opt-Out:</strong> We do NOT sell your data (nothing to opt-out of)</li>
                <li><strong>Right to Non-Discrimination:</strong> We won't discriminate for exercising your rights</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                To exercise these rights: Email hello@prontocorso.com with "California Privacy Request" in the subject line.
              </p>
            </section>

            {/* 15. Do Not Track Signals */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                15. Do Not Track Signals
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We respect "Do Not Track" browser settings. When enabled, we will not use optional analytics cookies.
              </p>
            </section>

            {/* 16. Changes to This Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                16. Changes to This Policy
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                We may update this Privacy Policy to reflect changes in our practices or legal requirements.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                <strong>How we notify you:</strong>
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>Email notification for significant changes</li>
                <li>Prominent notice in the Service for 30 days</li>
                <li>Updated "Last modified" date at the top of this page</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Your continued use of the Service after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* 17. Contact Us */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                17. Contact Us
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                For privacy questions, to exercise your rights, or to file a complaint:
              </p>
              <ul className="list-none pl-0 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li><strong>Email:</strong> hello@prontocorso.com</li>
                <li><strong>Subject Line:</strong> "Privacy Request"</li>
                <li>
                  <strong>Mail:</strong><br />
                  ProntoCorso<br />
                  AltoAdige, LLC<br />
                  [Your Business Address]
                </li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong>Response Time:</strong> We respond to privacy requests within 30 days (GDPR requirement) or 45 days (CCPA requirement).
              </p>
            </section>

            {/* 18. Data Protection Officer */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                18. Data Protection Officer
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                For data protection inquiries:
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Email: hello@prontocorso.com
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Questions about your privacy? We're here to help. Email us at hello@prontocorso.com and we'll respond promptly.
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

export default PrivacyPolicy;













// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { ArrowLeft, User } from "lucide-react";
// import { useGetMeQuery } from "@/redux/features/auth/authApi";
// import { ModeToggle } from "@/components/ThemeToggle/mode-toggle";
//  import { useTheme } from "@/components/ThemeToggle/theme-provider";
// import logoLight from "../assets/prontocorso/ProntoCorsoLogoLight-removebg-preview.png";
// import logoDark from "../assets/prontocorso/ProntoCorsoLogoDark-removebg-preview.png";
// import GoogleTranslate from "@/components/LanguageToggle/GoogleTranslate";

// const PrivacyPolicy: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { data: userData } = useGetMeQuery({});
//   const { theme } = useTheme();
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   // Smart back navigation
//   const handleBack = () => {
//     const from = (location.state as { from?: string })?.from;
    
//     if (from) {
//       // If user came from a specific page (e.g., signup), go back there
//       navigate(from);
//     } else if (window.history.length > 1) {
//       // If there's browser history, go back
//       navigate(-1);
//     } else {
//       // Default fallback to home
//       navigate("/");
//     }
//   };

//   // Update dark mode status based on theme
//   useEffect(() => {
//     const updateDarkMode = () => {
//       if (theme === "dark") {
//         setIsDarkMode(true);
//       } else if (theme === "light") {
//         setIsDarkMode(false);
//       } else {
//         // theme === "system"
//         setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
//       }
//     };

//     updateDarkMode();

//     // Listen for system preference changes if theme is "system"
//     if (theme === "system") {
//       const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
//       const handleChange = () => setIsDarkMode(mediaQuery.matches);
//       mediaQuery.addEventListener("change", handleChange);
//       return () => mediaQuery.removeEventListener("change", handleChange);
//     }
//   }, [theme]);

//   return (
//     <>
      
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-slate-200 dark:border-gray-700 px-[5%] py-4 flex justify-between items-center z-50">
//         <div className="flex items-center gap-6">
//           <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tighter">
//             <img src={isDarkMode ? logoDark : logoLight} alt="ProntoCorso" className="h-10 rounded-full" />
           
//           </Link>
//           <div className="hidden lg:flex items-center gap-3 opacity-80">
//             <img
//               src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
//               className="h-7"
//               alt="App Store"
//             />
//             <img
//               src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
//               className="h-7"
//               alt="Google Play"
//             />
//           </div>
//         </div>
//         <div className="flex items-center gap-4">
//           {userData?.data ? (
//             <button
//               onClick={() => {
//                 const role = userData.data.role;
//                 if (role === "USER") {
//                   navigate("/user");
//                 } else if (["SUPER_ADMIN", "SUPORT_MANAGER", "CONTENT_MANAGER"].includes(role)) {
//                   navigate("/admin");
//                 } else {
//                   navigate("/user");
//                 }
//               }}
//               className="hidden w-full sm:flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 transition-colors border-r border-slate-200 dark:border-gray-700 pr-4 cursor-pointer"
//             >
//               <User className="w-5 h-5 ml-3" />
//             </button>
//           ) : (
//             <button
//               onClick={() => navigate("/login")}
//               className="hidden sm:block text-sm font-bold text-slate-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors border-r border-slate-200 dark:border-gray-700 pr-4 cursor-pointer"
//             >
//               Portal Login
//             </button>
//           )}
//           <button
//             onClick={() => navigate("/")}
//             className="bg-blue-700 dark:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-700/20 dark:shadow-blue-600/20 hover:bg-blue-800 dark:hover:bg-blue-700 transition-all cursor-pointer"
//           >
//             Home
//           </button>
//           <div className="flex items-center gap-2">
//             <GoogleTranslate />
//             {/* <LanguageToggle /> */}
//             <ModeToggle />
//           </div>
//         </div>
//       </nav>

//       <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 pt-24">
//         <div className="max-w-4xl mx-auto">
//           <button
//             onClick={handleBack}
//             className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-500 mb-8 font-semibold cursor-pointer transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back
//           </button>

//           <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
//             Privacy Policy
//           </h1>
//           <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
//             Last updated: {new Date().toLocaleDateString()}
//           </p>

//           <div className="prose prose-slate dark:prose-invert max-w-none">
//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
//                 GDPR Compliance
//               </h2>
//               <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
//                 We take your data privacy seriously. ProntoCorso collects only
//                 the information necessary to provide our test-prep services.
//                 Your practice data is encrypted and used solely for improving
//                 your personalized learning experience.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
//                 Information We Collect
//               </h2>
//               <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
//                 <li>Account information (email, name)</li>
//                 <li>Practice session data and progress</li>
//                 <li>Payment information (processed securely through Stripe)</li>
//                 <li>Usage analytics to improve our service</li>
//               </ul>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
//                 How We Use Your Data
//               </h2>
//               <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
//                 Your data is used exclusively to:
//               </p>
//               <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
//                 <li>Provide personalized learning experiences</li>
//                 <li>Track your progress and performance</li>
//                 <li>Process payments and manage subscriptions</li>
//                 <li>Send important service updates</li>
//               </ul>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
//                 Email Address Collection and Use (CalOPPA & GDPR Compliant)
//               </h2>
//               <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
//                 <strong className="font-bold">How We Collect Email Addresses:</strong>
//               </p>
//               <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
//                 <li>When you create an account on ProntoCorso</li>
//                 <li>When you subscribe to our newsletter ("La Frase del Giorno")</li>
//                 <li>When you contact our support team</li>
//                 <li>When you make a purchase or subscription</li>
//               </ul>
              
//               <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
//                 <strong className="font-bold">How We Use Your Email Address:</strong>
//               </p>
//               <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
//                 <li>To send you account-related notifications (login, password reset, subscription updates)</li>
//                 <li>To deliver your daily newsletter subscription (if opted in)</li>
//                 <li>To respond to your support inquiries</li>
//                 <li>To send important service updates and announcements</li>
//                 <li>To process and confirm your subscription payments</li>
//               </ul>

//               <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
//                 <strong className="font-bold">Email Marketing and Opt-Out:</strong>
//               </p>
//               <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
//                 We do not sell, rent, or share your email address with third parties for marketing purposes. 
//                 You can opt-out of marketing emails at any time by:
//               </p>
//               <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
//                 <li>Clicking the "unsubscribe" link in any marketing email</li>
//                 <li>Updating your preferences in your account settings</li>
//                 <li>Contacting us at privacy@prontocorso.com</li>
//               </ul>
//               <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
//                 <strong>Note:</strong> You cannot opt-out of transactional emails (account notifications, 
//                 payment confirmations, security alerts) as these are essential for service delivery.
//               </p>

//               <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
//                 <strong className="font-bold">Data Retention:</strong> We retain your email address for as 
//                 long as your account is active or as needed to provide services. If you delete your account, 
//                 we will delete your email address within 30 days, unless we are required to retain it for 
//                 legal or regulatory purposes.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
//                 Your Rights
//               </h2>
//               <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
//                 Under GDPR, you have the right to:
//               </p>
//               <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
//                 <li>Access your personal data</li>
//                 <li>Request correction of inaccurate data</li>
//                 <li>Request deletion of your data</li>
//                 <li>Object to processing of your data</li>
//                 <li>Data portability</li>
//               </ul>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
//                 Contact Us
//               </h2>
//               <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
//                 For privacy-related inquiries, please contact us through our
//                 support portal or email us at privacy@prontocorso.com
//               </p>
//             </section>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-white dark:bg-gray-900 text-slate-600 dark:text-gray-400 pt-20 pb-10 px-[5%] border-t border-slate-200 dark:border-gray-700">
//         <div className="max-w-7xl mx-auto">
//           {/* Disclaimer Text */}
//           <div className="mb-8">
//             <p className="text-xs leading-relaxed text-slate-500 dark:text-gray-300 text-center max-w-5xl mx-auto">
//               ProntoCorso is an independent educational tool. It accompanies your primary language education. We focus on preparation standards for exams including CILS, CELI, and PLIDA. We are not affiliated with these exam bodies. All content is original. It is not derived from official proprietary exam materials. We strictly adhere to the CEFR B1 Standard. This content is for practice purposes only. It does not guarantee a passing score. CILS is a trademark of the Università per Stranieri di Siena. CELI is a trademark of the Università per Stranieri di Perugia. PLIDA is a trademark of the Dante Alighieri Society. All other trademarks are the property of their respective owners.
//             </p>
//           </div>

//           {/* Footer Links and Copyright */}
//           <div className="text-center text-sm text-slate-600 dark:text-gray-400">
//             <Link to="/privacy" state={{ from: location.state?.from || "/" }} className="hover:text-slate-900 dark:hover:text-white transition-colors">
//               Privacy Policy
//             </Link>
//             <span className="mx-2">|</span>
//             <Link to="/terms" state={{ from: location.state?.from || "/" }} className="hover:text-slate-900 dark:hover:text-white transition-colors">
//               Terms of Service
//             </Link>
//             <span className="mx-2">|</span>
//             <span>© {new Date().getFullYear()} ProntoCorso</span>
//           </div>
//         </div>
//       </footer>
  
//     </>
   
//   );
// };

// export default PrivacyPolicy;

