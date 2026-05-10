import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import NotFound from "../pages/NotFound";
import UserLayout from "@/Layout/UserLayout/UserLayout";
import { UserOverview } from "@/components/UserDashbord/Overviwe/UserOverview";
import { UserAnalytics } from "@/components/UserDashbord/UserAnalytics";
import AdminLayout from "@/Layout/AdminLayout/AdminLayout";
import AdminUserManagement from "@/components/AdminDashbord/Admin/AdminUserManagement";
import AdminSubscription from "@/components/AdminDashbord/SubscriptionManagement/AdminSubscription";
import AdminAnalytics from "@/components/AdminDashbord/Admin/AdminAnalytics";
import AdminOverview from "@/components/AdminDashbord/Overview/AdminOverview";
import AdminSupport from "@/components/AdminDashbord/Admin/AdminSupport";
import AdminSettings from "@/components/AdminDashbord/Admin/AdminSettings";
import UserDetailsPage from "@/components/AdminDashbord/UserManagementDashboard/UserDetailsPage/UserDetailsPage";
import ContentManagementPage from "@/components/AdminDashbord/ContentManagementPage/ContentManagementPage";
import UserFlashcards from "@/components/UserDashbord/UserFlashcards";
import UserStudyPlanner from "@/components/UserDashbord/UserStudyPlanner";
// import ProtectedRoute from "@/components/Athontication copy/ProtectedRoute";
import Login from "@/components/Athontication copy/login/Login";
import Signup from "@/components/Athontication copy/Signup";
import VerifyAccount from "@/components/Athontication copy/VerifyAccount";
import ResetPasswordForm from "@/components/Athontication copy/login/ResetPasswordForm";
import Unauthorized from "@/components/Athontication copy/Unauthorized";
import ForgotPasswordForm from "@/components/Athontication copy/login/ForgotPasswordForm";
import UserSupportDashbord from "@/components/UserDashbord/UserSupport/UserSupportDashbord";
import EliteItalianMastery from "@/Layout/Home";
import SubletHomePage from "@/Layout/subletHomePage";
import CategoryDetail from "@/components/AdminDashbord/ContentManagementPage/components/CategoryDetail";
import FlashcardDecks from "@/components/AdminDashbord/ContentManagementPage/components/FlashcardDecks";
import PhraseOfTheDay from "@/components/AdminDashbord/ContentManagementPage/components/PhraseOfTheDay";
import LessonsContainer from "@/components/AdminDashbord/ContentManagementPage/components/Lession/LessonsContainer";
import PaymentSuccess from "@/components/UserDashbord/Subscription/PaymentSuccess";
import { UserSettings } from "@/components/UserDashbord/UserSettings";
import PreviousPlansPage from "@/components/UserDashbord/UserAiStudyPlanner/PreviousPlansPage";
import UserLeaderboard from "@/components/UserDashbord/UserLeaderboard";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import MasterPrompts from "@/components/AdminDashbord/MasterPrompts/MasterPrompts";
import EmailVerify from "@/components/Athontication copy/EmailVerify";
import EmailVerificationSuccess from "@/components/Athontication copy/login/EmailVerificationSuccess";
import EmailVerificationFailed from "@/components/Athontication copy/login/EmailVerificationFailed";
import CreateNewLesson from "@/components/AdminDashbord/ContentManagementPage/components/Lession/CreateNewLesson/CreateNewLesson";
import NewslatterFunnel from "@/components/AdminDashbord/ContentManagementPage/NewslatterFunnel";
import APIIntegrations from "@/components/AdminDashbord/ContentManagementPage/APIIntegrations";
import EmailSettings from "@/components/AdminDashbord/ContentManagementPage/EmailSettings";
import PracticeLayout from "@/pages/UserPractice/PracticeLayout";
import SelectExerciseType from "@/pages/UserPractice/SelectExerciseType";
import DomainsView from "@/pages/UserPractice/DomainsView";
import { Navigate } from "react-router-dom";
import TaskRegistries from "@/pages/UserPractice/TaskRegistries";
import TestView from "@/pages/UserPractice/TestView";
import FeedbackView from "@/pages/UserPractice/FeedbackView";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <EliteItalianMastery /> },
      {
        path: 'subscribe/success',

        element: <PaymentSuccess />
      },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "verify-email",
        element: <EmailVerify />,
      },
      {
        path: "/email-verification-success",
        element: <EmailVerificationSuccess />,
      },
      {
        path: "/email-verification-failed",
        element: <EmailVerificationFailed />,
      },
      {
        path: "verified",
        element: <VerifyAccount />,
      },
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "reset",
        element: <ResetPasswordForm />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordForm />,
      },
      {
        path: "privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "terms",
        element: <TermsOfService />,
      },
      {
        path: "subhomepag",
        element: <SubletHomePage />,
      },
      {
        path: "user",
        element: (
          // <ProtectedRoute allowedRoles={["USER"]}>
            <UserLayout />
          // </ProtectedRoute>
        ),
        children: [
          { index: true, element: <UserOverview /> },
          { path: "analytics", element: <UserAnalytics /> },
          { path: "flashcards", element: <UserFlashcards /> },
          { path: "leaderboard", element: <UserLeaderboard /> },
          { path: "planner", element: <UserStudyPlanner /> },
          { path: "previous-plans", element: <PreviousPlansPage /> }, // Add Previous Plans

          { path: "settings", element: <UserSettings /> },
          { path: "support", element: <UserSupportDashbord /> },
          {
            path: "practice",
            element: <PracticeLayout/>,
            children: [
              { index: true, element: <Navigate to="citizenship" replace /> },
              { path: ":track", element: <TaskRegistries /> },    
            ],
            // *******************************************************************
            //                Previous version code...
            // *******************************************************************
            // children: [
            //   {     path: "reading", 
            //      element: <UserReadingPractice /> ,

            //     //  children: [
            //     //   { path: "performance", element: <Performance /> },
            //     // ],
            //   },
            //   {    path: "performance/:lessonId", 
            //     element: <UserPerformance /> 
            //  },
            //   { path: "listening", element: <ListeningPractice /> },
            //   { path: "writing", element: <WritingPractice /> },
            //   { path: "speaking", element: <SpeakingPractice /> },
            // ],
          },
          { path: "practice/:level/:type/select-exercise", element: <SelectExerciseType /> },
          // /practice/listening/L-01
          { path: "practice/:level/:type/:taskId/domains", element: <DomainsView /> },
          
          // Templete only 
          // { path: "practice/test", element: <TestView /> },

          { path: "practice/:skill/test", element: <TestView /> },
          // { path: "practice/test/listening", element: <TestView /> },
          // { path: "practice/test/speaking", element: <TestView /> },
          // { path: "practice/test/speaking", element: <TestView /> },




          { path: "practice/test/feedback", element: <FeedbackView /> },
        ],
      },
      {
        path: "admin",
        element: (
          // <ProtectedRoute allowedRoles={["SUPER_ADMIN", "SUPORT_MANAGER", "CONTENT_MANAGER"]}>
            <AdminLayout />
          // </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminOverview /> },
          { path: "users", element: <AdminUserManagement /> },
          {
            path: "users/:id",
            element: <UserDetailsPage />,
          },
          {
            path: "content",
            children: [
              {
                index: true,
                element: <ContentManagementPage />
              },
              {
                path: "flashcards",
                children: [
                  {
                    index: true,
                    element: <FlashcardDecks />
                  },
                  {
                    path: "category/:id",
                    element: <CategoryDetail />,
                  },
                  {
                    path: "category/:id/edit",
                    element: <CategoryDetail />,
                  },
                ]
              },
              {
                path: "lessons",
                element: <LessonsContainer />
              },
              {
                path: "lessons/create-new-lesson",
                element: <CreateNewLesson />
              },
              {
                path: "phrase-of-the-day",
                element: <PhraseOfTheDay />
              },
            ]
          },
          { path: "subscription", element: <AdminSubscription /> },
          { path: "analytics", element: <AdminAnalytics /> },
          { path: "support", element: <AdminSupport /> },
          { path: "settings", element: <AdminSettings /> },
          { path: "master-prompt", element: <MasterPrompts /> },

          { path: "email-settings", element: <EmailSettings /> },
          { path: "api-integrations", element: <APIIntegrations /> },
          { path: "newslatter-funnel", element: <NewslatterFunnel /> },

        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default routes;
