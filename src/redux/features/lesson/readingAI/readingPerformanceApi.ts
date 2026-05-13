/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/features/reading/readingPerformanceApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface EvaluateReadingRequest {
  metadata: any;
  student_handout: any;
  teacher_pack: any;
  student_response: {
    answers: string[];
  };
}

export type PerformanceRequest = EvaluateReadingRequest;

export interface PerformanceResponse {
    feedback_card?: PerformanceResponse['feedback'];
    feedback: {
        header: string | { level: string; language: string; skill: string; };
        positive_points: {
            title: string;
            points: string[];
        };
        improvement_steps: {
            title: string;
            steps: string[];
        };
        cefr_profile: {
            title: string;
            details: {
                overall: string;
                comprehension: string;
                accuracy: string;
                range: string;
            };
        };
        score: {
            title: string;
            value: string;
            status: string;
        };
        readiness: {
            title: string;
            value: string;
            message: string;
        };
        power_tip: {
            title: string;
            tip: string;
            example: string;
        };
        motivational_close: {
            title: string;
            message: string;
            translation: string;
        };
    };
}
const baseurl = `${import.meta.env.VITE_AI_API_ENDPOINT || "https://cheesuschrusty-ai.onrender.com"}/ai/user/evaluate`;
 
export const readingPerformanceApi = createApi({
  reducerPath: 'readingPerformanceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseurl}/reading-performance/`,
    prepareHeaders: (headers) => {
      // Add any required headers (authorization, etc.)
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      headers.set('accept', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    evaluateReadingPerformance: builder.mutation< PerformanceResponse, PerformanceRequest>({
      query: (performanceData) => ({
        url: '',
        method: 'POST',
        body: performanceData,
      }),
    }),





    
  }),
});

export const { useEvaluateReadingPerformanceMutation } = readingPerformanceApi;