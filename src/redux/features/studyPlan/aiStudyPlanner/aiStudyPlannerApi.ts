 
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/* =======================
   Types
======================= */

export type AiProvider = "grok" | "openai" | "claude" | string;

export interface AiStudyPlannerRequest {
  provider: AiProvider;
  focus_areas: string[];
  target: string;
  daily_study_time: number; // minutes
  days_per_week: number;
  level: "Beginner" | "Intermediate" | "Advanced" | string;
}

export interface AiStudyPlannerResponse {
  total_hours: string;
  duration_weeks: number;
  daily_activities: number;
  weekly_objectives: number;
  suggested_weekly_plan: string[];
  message?: string;
  error?: string;
  success: boolean;
  italian: {
    daily_activities: number;
    duration_weeks: number;
    weekly_objectives: number;
    total_hours: string;
    piano_settimanale_suggerito: string[];
}
}

/* =======================
   Create separate AI API instance
======================= */

export const aiApi = createApi({
  reducerPath: 'aiApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_AI_API_ENDPOINT || "https://cheesuschrusty-ai.onrender.com"}/`,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // POST: Generate AI Study Plan
    generateAiStudyPlanner: builder.mutation ({
      query: (body) => ({
        url: '/ai/admin/generate/ai-study-planner/',
        method: 'POST',
        body,
      }),
    }),
  }),
});

/* =======================
   Hooks
======================= */

export const {
  useGenerateAiStudyPlannerMutation,
} = aiApi;