// aiApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  GenerateListeningRequest, GenerateListeningResponse,
  GenerateListeningBatchRequest, GenerateListeningBatchResponse
} from './aiApi.listening.types.ts';
import {
  GenerateWritingRequest, GenerateWritingResponse,
  GenerateWritingBatchRequest, GenerateWritingBatchResponse
} from './aiApi.writing.types.ts';
import {
  GenerateReadingRequest, GenerateReadingResponse,
  GenerateReadingBatchRequest, GenerateReadingBatchResponse
} from './aiApi.reading.types.ts';
import {
  GenerateGrammarRequest, GenerateGrammarResponse,
  GenerateGrammarBatchRequest, GenerateGrammarBatchResponse
} from './aiApi.grammar.types.ts';
import {
  GenerateSpeakingRequest, GenerateSpeakingResponse,
  GenerateSpeakingBatchRequest, GenerateSpeakingBatchResponse
} from './aiApi.speaking.types.ts';

type Task = {
  tasks_id: string;
  topic: string;
  schema: string;
};

type Practise = {
  skill: string;
  tasks: Task[];
};

export type PromptStructureLevel = {
  level_id: string;
  level_title: string;
  practises: Practise[];
};

// type StructuredData = {
//   data: Level[];
// };

export interface AIPromptStructureResponse {
  success: boolean;
  message: string;
  data: PromptStructureLevel[];
}


const createAiBaseQuery = (baseUrl: string) =>
  fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // const token = localStorage.getItem('token');
      // if (token) {
      //   headers.set('Authorization', `Bearer ${token}`);
      // }
      return headers;
    },
  });

const AI_API_URL = `${import.meta.env.VITE_AI_API_ENDPOINT}/ai`;

export const aiApi = createApi({
  reducerPath: 'aiApi',
  baseQuery: createAiBaseQuery(AI_API_URL),
  tagTypes: ['Reading', 'Listening', 'Writing', 'Speaking', 'Grammar'],
  endpoints: (builder) => ({
    getAIPromptStructure: builder.query<AIPromptStructureResponse, void>({
      query: () => ({
        url: `/admin/master-prompt-structure`,
        method: 'GET',
      }),
    }),
    // ─────────────────────────────────────────
    // ─── Reading ─────────────────────────────
    // ─────────────────────────────────────────

    // POST /ai/admin/generate/reading-comprehension/
    generateReading: builder.mutation<GenerateReadingResponse, GenerateReadingRequest>({
      query: (body) => ({
        url: '/admin/generate/reading-comprehension/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Reading'],
    }),

    // POST /ai/admin/generate/reading-comprehension/batch/
    generateReadingBatch: builder.mutation<GenerateReadingBatchResponse, GenerateReadingBatchRequest>({
      query: (body) => ({
        url: '/admin/generate/reading-comprehension/batch/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Reading'],
    }),

    // // GET /ai/admin/generate/reading-comprehension/batch/{job_id}/
    getReadingBatchStatus: builder.query({
      query: ({ job_id }) => ({
        url: `/admin/generate/reading-comprehension/batch/${job_id}/`,
        method: 'GET',
      }),
      providesTags: ['Reading'],
    }),

    // // POST /ai/user/evaluate/reading-performance/
    // evaluateReading: builder.mutation<EvaluateReadingResponse, EvaluateReadingRequest>({
    //   query: (body) => ({
    //     url: '/user/evaluate/reading-performance/',
    //     method: 'POST',
    //     body,
    //   }),
    // }),

    // ─────────────────────────────────────────
    // ─── Listening ───────────────────────────
    // ─────────────────────────────────────────

    // POST /ai/admin/generate/listening-comprehension/
    generateListening: builder.mutation<GenerateListeningResponse, GenerateListeningRequest>({
      query: (body) => ({
        url: '/admin/generate/listening-comprehension/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Listening'],
    }),

    // POST /ai/admin/generate/listening-comprehension/batch/

    generateListeningBatch: builder.mutation<GenerateListeningBatchResponse, GenerateListeningBatchRequest>({
      query: (body) => ({
        url: '/admin/generate/listening-comprehension/batch/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Listening'],
    }),

    // // GET /ai/admin/generate/listening-comprehension/batch/{job_id}/
    getListeningBatchStatus: builder.query({
      query: ({ job_id }) => ({
        url: `/admin/generate/listening-comprehension/batch/${job_id}/`,
        method: 'GET',
      }),
      providesTags: ['Listening'],
    }),

    // // POST /ai/user/evaluate/listening-performance/
    // evaluateListening: builder.mutation<EvaluateListeningResponse, EvaluateListeningRequest>({
    //   query: (body) => ({
    //     url: '/user/evaluate/listening-performance/',
    //     method: 'POST',
    //     body,
    //   }),
    // }),

    // ─────────────────────────────────────────
    // ─── Writing ─────────────────────────────
    // ─────────────────────────────────────────

    // POST /ai/admin/generate/writing-practice/
    generateWriting: builder.mutation<GenerateWritingResponse, GenerateWritingRequest>({
      query: (body) => ({
        url: '/admin/generate/writing-practice/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Writing'],
    }),

    // POST /ai/admin/generate/writing-comprehension/batch/

    generateWritingBatch: builder.mutation<GenerateWritingBatchResponse, GenerateWritingBatchRequest>({
      query: (body) => ({
        url: '/admin/generate/writing-comprehension/batch/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Writing'],
    }),

    // // GET /ai/admin/generate/writing-comprehension/batch/{job_id}/
    getWritingBatchStatus: builder.query({
      query: ({ job_id }) => ({
        url: `/admin/generate/writing-comprehension/batch/${job_id}/`,
        method: 'GET',
      }),
      providesTags: ['Writing'],
    }),

    // // POST /ai/user/evaluate/writing-performance/
    // evaluateWriting: builder.mutation<EvaluateWritingResponse, EvaluateWritingRequest>({
    //   query: (body) => ({
    //     url: '/user/evaluate/writing-performance/',
    //     method: 'POST',
    //     body,
    //   }),
    // }),

    // ─────────────────────────────────────────
    // ─── Speaking ────────────────────────────
    // ─────────────────────────────────────────

    // POST /ai/admin/generate/speaking-practice/
    generateSpeaking: builder.mutation<GenerateSpeakingResponse, GenerateSpeakingRequest>({
      query: (body) => ({
        url: '/admin/generate/speaking-practice/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Speaking'],
    }),

    // POST /ai/admin/generate/speaking-exercise/batch/
    generateSpeakingBatch: builder.mutation<GenerateSpeakingBatchResponse, GenerateSpeakingBatchRequest>({
      query: (body) => ({
        url: '/admin/generate/speaking-exercise/batch/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Speaking'],
    }),

    // // GET /ai/admin/generate/speaking-exercise/batch/{job_id}/
    getSpeakingBatchStatus: builder.query({
      query: ({ job_id }) => ({
        url: `/admin/generate/speaking-exercise/batch/${job_id}/`,
        method: 'GET',
      }),
      providesTags: ['Speaking'],
    }),

    // // POST /ai/user/evaluate/pronunciation-performance
    // evaluatePronunciation: builder.mutation<EvaluatePronunciationResponse, EvaluatePronunciationRequest>({
    //   query: (body) => ({
    //     url: '/user/evaluate/pronunciation-performance',
    //     method: 'POST',
    //     body,
    //   }),
    // }),

    // // POST /ai/user/evaluate/reading-aloud-speaking-performance
    // evaluateReadingAloud: builder.mutation<EvaluateReadingAloudResponse, EvaluateReadingAloudRequest>({
    //   query: (body) => ({
    //     url: '/user/evaluate/reading-aloud-speaking-performance',
    //     method: 'POST',
    //     body,
    //   }),
    // }),

    // POST /ai/user/evaluate/speaking-performance/
    // evaluateSpeaking: builder.mutation<EvaluateSpeakingResponse, EvaluateSpeakingRequest>({
    //   query: (body) => ({
    //     url: '/user/evaluate/speaking-performance/',
    //     method: 'POST',
    //     body,
    //   }),
    // }),

    // // POST /ai/user/practice/conversation-practice-chat/
    // conversationPracticeChat: builder.mutation<ConversationPracticeChatResponse, ConversationPracticeChatRequest>({
    //   query: (body) => ({
    //     url: '/user/practice/conversation-practice-chat/',
    //     method: 'POST',
    //     body,
    //   }),
    // }),

    // ─────────────────────────────────────────
    // ─── Grammar ─────────────────────────────
    // ─────────────────────────────────────────

    // POST /ai/admin/generate/grammar-practice/
    generateGrammar: builder.mutation<GenerateGrammarResponse, GenerateGrammarRequest>({
      query: (body) => ({
        url: '/admin/generate/grammar-practice/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Grammar'],
    }),

    // POST /ai/admin/generate/grammar-exercise/batch/
    generateGrammarBatch: builder.mutation<GenerateGrammarBatchResponse, GenerateGrammarBatchRequest>({
      query: (body) => ({
        url: '/admin/generate/grammar-exercise/batch/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Grammar'],
    }),

    // GET /ai/admin/generate/grammar-exercise/batch/{job_id}/
    getGrammarBatchStatus: builder.query({
      query: ({ job_id }) => ({
        url: `/admin/generate/grammar-exercise/batch/${job_id}/`,
        method: 'GET',
      }),
      providesTags: ['Grammar'],
    }),

    // // POST /ai/user/evaluate/grammar-performance/
    // evaluateGrammar: builder.mutation<EvaluateGrammarResponse, EvaluateGrammarRequest>({
    //   query: (body) => ({
    //     url: '/user/evaluate/grammar-performance/',
    //     method: 'POST',
    //     body,
    //   }),
    // }),

    // GET /lessons/grouped
    // getGroupedLessons: builder.query<any, { page?: number; limit?: number; search?: string; type?: string; level?: string; domain?: string }>({
    //   query: (params) => ({
    //     url: '/lessons/grouped',
    //     method: 'GET',
    //     params,
    //   }),
    //   providesTags: ['GroupedLesson'],
    // }),
  }),
});


// generateReadingBatch
// generateListeningBatch
// generateWritingBatch
// generateSpeakingBatch
// generateGrammarBatch
export const {
  useGetAIPromptStructureQuery,
  // Reading
  useGenerateReadingMutation,
  useGenerateReadingBatchMutation,
  useGetReadingBatchStatusQuery,
  // useGenerateReadingBatchMutation,
  // useEvaluateReadingMutation,
  // Listening
  useGenerateListeningMutation,
  useGenerateListeningBatchMutation,
  useGetListeningBatchStatusQuery,

  // useGenerateListeningBatchMutation,
  // useEvaluateListeningMutation,
  // Writing
  useGenerateWritingMutation,
  useGenerateWritingBatchMutation,
  useGetWritingBatchStatusQuery,

  // useGenerateWritingBatchMutation,
  // useEvaluateWritingMutation,
  // Speaking
  useGenerateSpeakingMutation,
  useGenerateSpeakingBatchMutation,
  useGetSpeakingBatchStatusQuery,

  // useGenerateSpeakingBatchMutation,
  // useEvaluatePronunciationMutation,
  // useEvaluateReadingAloudMutation,
  // useEvaluateSpeakingMutation,
  // useConversationPracticeChatMutation,
  // Grammar
  useGenerateGrammarMutation,
  useGenerateGrammarBatchMutation,
  useGetGrammarBatchStatusQuery,
  useLazyGetReadingBatchStatusQuery,
  useLazyGetListeningBatchStatusQuery,
  useLazyGetWritingBatchStatusQuery,
  useLazyGetSpeakingBatchStatusQuery,
  useLazyGetGrammarBatchStatusQuery,
  // useGenerateGrammarBatchMutation,

  // useEvaluateGrammarMutation,
  // useGetGroupedLessonsQuery,
} = aiApi;