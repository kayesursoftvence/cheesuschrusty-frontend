/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/redux/hooks/baseApi";

// Type for update profile request
interface UpdateUserProfileRequest {
  name?: string;
  weeklyUpdateEnabled?: boolean;
  streakRemindersEnabled?: boolean;
  achievementAlertsEnabled?: boolean;
  dailyGoalMinutes?: number;
  avatar?: File | null;
}

// Types for study planner
interface StudyPlanActivities {
  monday?: string[];
  tuesday?: string[];
  wednesday?: string[];
  thursday?: string[];
  friday?: string[];
  saturday?: string[];
  sunday?: string[];
  weeklyGoal?: string;
}

interface CreateStudyPlanRequest {
  activities: StudyPlanActivities;
}

interface StudyPlanResponse {
  id: string;
  generatedAt: string;
  activities: StudyPlanActivities;
}

export const usermanagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ---------------- Students ----------------

    getStudents: builder.query({
      query: (params) => ({
        url: "/users/students",
        method: "GET",
        params,
      }),
      providesTags: ["Students"],
    }),

    getSingleStudent: builder.query({
      query: (id: string) => ({
        url: `/users/students/${id}`,
        method: "GET",
      }),
      providesTags: (id) => [{ type: "Students", id }],
    }),

    deleteStudent: builder.mutation({
      query: (id: string) => ({
        url: `/users/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Students"],
    }),

    updateStudentStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: string }) => ({
        url: `/users/students/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Students"],
    }),

    updateStudent: builder.mutation({
      query: ({ id, ...data }: { id: string;[key: string]: any }) => ({
        url: `/users/students/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Students"],
    }),

    // ---------------- User Metadata ----------------

    getUserMetadata: builder.query({
      query: () => ({
        url: "/users/metadata",
        method: "GET",
      }),
      providesTags: ["UserMeta"],
    }),

    // ---------------- Platform Users ----------------

    getPlatformUsers: builder.query({
      query: () => ({
        url: "/users/platform-users",
        method: "GET",
      }),
      providesTags: ["PlatformUsers"],
    }),

    createPlatformUser: builder.mutation({
      query: (data) => ({
        url: "/users/platform-users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PlatformUsers"],
    }),

    deletePlatformUser: builder.mutation({
      query: (id: string) => ({
        url: `/users/platform-users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PlatformUsers"],
    }),

    // ---------------- User Profile ----------------

    updateUserProfile: builder.mutation<any, UpdateUserProfileRequest>({
      query: (data) => {
        const formData = new FormData();

        if (data.name !== undefined && data.name !== null) {
          formData.append("name", data.name);
        }
        if (data.weeklyUpdateEnabled !== undefined) {
          formData.append("weeklyUpdateEnabled", String(data.weeklyUpdateEnabled));
        }
        if (data.streakRemindersEnabled !== undefined) {
          formData.append("streakRemindersEnabled", String(data.streakRemindersEnabled));
        }
        if (data.achievementAlertsEnabled !== undefined) {
          formData.append("achievementAlertsEnabled", String(data.achievementAlertsEnabled));
        }
        if (data.dailyGoalMinutes !== undefined && data.dailyGoalMinutes !== null) {
          formData.append("dailyGoalMinutes", String(data.dailyGoalMinutes));
        }
        if (data.avatar) {
          formData.append("avatar", data.avatar);
        }

        return {
          url: "/users/profile",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["User"],
    }),

    // ---------------- Study Planner ----------------

    // POST /users/study-planner - Create or update AI study plan
    createOrUpdateStudyPlan: builder.mutation<{ success: boolean; message: string; data: StudyPlanResponse }, CreateStudyPlanRequest>({
      query: (data) => ({
        url: "/users/study-planner",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AiStudyPlan"],
    }),

    // GET /users/study-planner - Get current study plan
    getStudyPlan: builder.query<{ success: boolean; data: StudyPlanResponse }, void>({
      query: () => ({
        url: "/users/study-planner",
        method: "GET",
      }),
      providesTags: ["AiStudyPlan"],
    }),

  }),
});

export const {
  useGetStudentsQuery,
  useGetSingleStudentQuery,
  useDeleteStudentMutation,
  useUpdateStudentStatusMutation,
  useUpdateStudentMutation,
  useGetUserMetadataQuery,
  useGetPlatformUsersQuery,
  useCreatePlatformUserMutation,
  useDeletePlatformUserMutation,
  useUpdateUserProfileMutation,
  useCreateOrUpdateStudyPlanMutation,
  useGetStudyPlanQuery,
} = usermanagementApi;

