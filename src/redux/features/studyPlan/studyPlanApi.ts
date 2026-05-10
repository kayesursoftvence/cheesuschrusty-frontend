import { baseApi } from "@/redux/hooks/baseApi";

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string | null;
  totalXp?: number;
  points: number;
  streak: number;
  declaredLevel: string;
  estimatedLevel: string;
}

export interface SkillArea {
  skillArea: string;
  points: number;
}

export interface LeaderboardResponse {
  success: boolean;
  data: {
    yourPosition: LeaderboardUser & {
      periodPoints: number;
      dailyStreak: number;
    };
    top10Learners: LeaderboardUser[];
    yourSkill: SkillArea[];
    quickStats: {
      periodPoints: number;
      totalBadges: number;
      currentLevel: string;
    };
  };
}

export const studyPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: /users/study-planner
    getStudyPlan: builder.query({
      query: () => ({
        url: "/users/study-planner",
        method: "GET",
      }),
      providesTags: ["StudyPlan"],
    }),

    // POST: /users/study-planner (Create or Update)
    createOrUpdateStudyPlan: builder.mutation({
      query: (data) => ({
        url: "/users/study-planner",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["StudyPlan"],
    }),
    getLeaderboard: builder.query ({
      query: (period) => ({
        url: `/leaderboard/pro?period=${period}`,
        method: "GET",
      }),
      providesTags: ["Leaderboard"],
    }),
  }),
});

export const {
  useGetStudyPlanQuery,
  useCreateOrUpdateStudyPlanMutation,
  useGetLeaderboardQuery,
} = studyPlanApi;
