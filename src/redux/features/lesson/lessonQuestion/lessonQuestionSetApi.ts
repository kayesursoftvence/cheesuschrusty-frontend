// /* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/hooks/baseApi";
// import type { LessonQuestionSetResponse, UpsertLessonQuestionSetRequest, GetLessonQuestionSetRequest } from "./lessonQuestionSet.types";

export const lessonQuestionSetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLessonQuestionSet: builder.query({
      query: ({ lessonId }) => ({
        url: `/questionset/${lessonId}`,
        method: "GET",
      }),
      providesTags: (_r, _e, arg) =>
        arg?.lessonId
          ? [{ type: "LessonQuestionSet", id: arg.lessonId }]
          : [{ type: "LessonQuestionSet", id: "LIST" }],
    }),

    upsertLessonQuestionSet: builder.mutation({
      query: (data) => ({
        url: "/questionset",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_r, _e, arg) =>
        arg?.lessonId
          ? [{ type: "LessonQuestionSet", id: arg.lessonId }]
          : [{ type: "LessonQuestionSet", id: "LIST" }],
    }),
  }),
});

export const { useGetLessonQuestionSetQuery,
               useLazyGetLessonQuestionSetQuery,
               useUpsertLessonQuestionSetMutation } = lessonQuestionSetApi;

