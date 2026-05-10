import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
 

const BASE_URL = `${import.meta.env.VITE_AI_API_ENDPOINT || "https://cheesuschrusty-ai.onrender.com"}/ai/user/evaluate`;

export const writingPerformanceApi = createApi({
  reducerPath: "writingPerformanceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/writing-performance/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({

    // POST: /ai/user/evaluate/writing-performance
    evaluateWritingPerformance: builder.mutation ({
      query: (performanceData) => ({
        url: "",
        method: "POST",
        body: performanceData,
      }),
    }),

  }),
});

export const {
  useEvaluateWritingPerformanceMutation,
} = writingPerformanceApi;
