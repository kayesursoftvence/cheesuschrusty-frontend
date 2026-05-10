/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const baseURL = import.meta.env.VITE_API_ENDPOINT;
// const baseURL = "https://cheesuschrusty-server-pja7.onrender.com";
if (!baseURL) {
  throw new Error("VITE_API_ENDPOINT is not defined");
}

const logoutAction = () => ({ type: "auth/loggedOut" });





const rawBaseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const accessToken = Cookies.get("accessToken"); // FIXED
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});


const baseQueryWithRefresh: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = Cookies.get("refreshToken");

    if (refreshToken) {
      const refreshResult: any = await rawBaseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult?.data?.access_token) {
        // SAVE NEW TOKEN CORRECTLY
        Cookies.set("accessToken", refreshResult.data.access_token, { expires: 7 });

        if (refreshResult.data.refreshToken) {
          Cookies.set("refreshToken", refreshResult.data.refreshToken, { expires: 30 });
        }

        // retry original request
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logoutAction());
      }
    } else {
      api.dispatch(logoutAction());
    }
  }

  return result;
};


export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: [
    "User",
    "Dashboard",
    "Users",
    "Students",
    "UserMeta",
    "PlatformUsers",
    "Courses",
    "PlatformSettings",
    "SecuritySettings",
    "Lessons",
    "BrandingSettings",
    "Tickets",
    "TicketStats",
    "NotificationSettings",
    "FlashcardCategories",
    "FlashcardOverview",
    "FlashcardCategory",
    "SubscriptionInfo",
    "Lessons",
    "Lesson",
    "LessonQuestionSet",
    "LessonQuestion",
    "Plans",
    "AiStudyPlan",
    "StudyPlan",
    "AdminAnalytics",
    "AdminDashboard",
    "Leaderboard",
    "MasterPromptQuestions",
    "MasterPromptFeedback",
    "IntegrationCredentials",
    "IntegrationUsage",
    "IntegrationUsageSummary",
    "GroupedLesson",
    "Analytics"

  ],
  endpoints: () => ({}),
});
