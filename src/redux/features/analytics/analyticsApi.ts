import { baseApi } from "@/redux/hooks/baseApi";

const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdvancedAnalytics: builder.query({
      query: () => ({
        url: "/analytics/advanced",
        method: "GET",
      }),
    }),
    getOverviewAnalytics: builder.query({
      query: () => ({
        url: "/analytics/overview",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),
    getPracticeAnalytics: builder.query({
      query: () => ({
        url: "/analytics/practice",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),
  }),
});

export const { useGetAdvancedAnalyticsQuery, useGetOverviewAnalyticsQuery, useGetPracticeAnalyticsQuery } =
  analyticsApi;
