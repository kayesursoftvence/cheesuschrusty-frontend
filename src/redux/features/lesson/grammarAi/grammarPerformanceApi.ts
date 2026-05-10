/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/hooks/baseApi";

const BASE_URL = import.meta.env.VITE_AI_API_ENDPOINT || "https://cheesuschrusty-ai.onrender.com";

export const grammarPerformanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* =========================
       EVALUATE GRAMMAR PERFORMANCE
       POST /ai/user/evaluate/grammar-performance/
    ========================= */
    evaluateGrammarPerformance: builder.mutation<any, any>({
      query: (body) => ({
        url: `${BASE_URL}/ai/user/evaluate/grammar-performance/`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useEvaluateGrammarPerformanceMutation,
} = grammarPerformanceApi;
