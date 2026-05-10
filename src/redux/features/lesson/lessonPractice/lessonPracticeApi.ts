

 

import { baseApi } from "@/redux/hooks/baseApi";
import { 
  GetNextLessonRequest, 
  GetNextLessonResponse,
  CompleteLessonRequest,
  CompleteLessonResponse
} from "./lessonPractice.types";

export const lessonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // GET: /lessons/filter?type=READING&level=b2
      getNextLesson: builder.query< GetNextLessonResponse, GetNextLessonRequest >({
        query: ({ type, level, domain, task_id }) => ({
          url: "/lessons/filter",
          method: "GET",
          params: { type, level, domain, task_id },
        }),
        providesTags: ["Lesson"],
      }),

    // POST: /lessons/{id}/complete
    completeLesson: builder.mutation< CompleteLessonResponse, { id: number } & CompleteLessonRequest >({
      query: ({ id, durationSeconds, accuracy, xpEarned }) => ({
        url: `/lessons/${id}/complete`,
        method: "POST",
        body: { durationSeconds, accuracy, xpEarned },
      }),
      invalidatesTags: ["Lesson", "Analytics"],
    }),
//get grouped lessons
    getGroupedLessons: builder.query<any, { page?: number; limit?: number; search?: string; type?: string; level?: string; domain?: string }>({
      query: (params) => ({
        url: '/lessons/grouped',
        method: 'GET',
        params,
      }),
      providesTags: ['GroupedLesson'],
    }),






  }),
});

export const {
  useGetNextLessonQuery,
  useLazyGetNextLessonQuery,
  useCompleteLessonMutation,
  useGetGroupedLessonsQuery,

} = lessonApi;










// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { baseApi } from "@/redux/hooks/baseApi";
// import { GetNextLessonRequest, GetNextLessonResponse } from "./lessonPractice.types";
 

// export const lessonApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
    
//     // GET: /lessons/next?type=READING
//     getNextLesson: builder.query<
//       GetNextLessonResponse,
//       GetNextLessonRequest
//     >({
//       query: ({ type }) => ({
//         url: "/lessons/next",
//         method: "GET",
//         params: { type },
//       }),
//       providesTags: ["Lesson"],
//     }),

//   }),
// });

// export const {
//   useGetNextLessonQuery,
//   useLazyGetNextLessonQuery,
// } = lessonApi;
