/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/hooks/baseApi";


export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
        getAdminAnalytics: builder.query<any, void>({
          query: () => '/admin/dashboard/analytics',
        }),
      }),
});

export const {useGetAdminAnalyticsQuery} = analyticsApi;
