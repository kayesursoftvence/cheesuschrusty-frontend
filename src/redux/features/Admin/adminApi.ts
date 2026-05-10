 

import { baseApi } from "@/redux/hooks/baseApi";
import type {
  AdminDashboardResponse,
  AdminAnalyticsResponse,
} from "./admin.types";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: /admin/dashboard
    getAdminDashboard: builder.query<AdminDashboardResponse, void>({
      query: () => ({
        url: "/admin/dashboard",
        method: "GET",
      }),
      providesTags: ["AdminDashboard"],
    }),

    // GET: /admin/dashboard/analytics
    getAdminAnalytics: builder.query<AdminAnalyticsResponse, void>({
      query: () => ({
        url: "/admin/dashboard/analytics",
        method: "GET",
      }),
      providesTags: ["AdminAnalytics"],
    }),
  }),
});

export const {
  useGetAdminDashboardQuery,
  useGetAdminAnalyticsQuery,
} = adminApi;