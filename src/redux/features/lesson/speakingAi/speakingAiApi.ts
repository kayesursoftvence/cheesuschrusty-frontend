import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
 

const BASE_URL = `${import.meta.env.VITE_AI_API_ENDPOINT || "https://cheesuschrusty-ai.onrender.com"}/ai/user`;

export const speakingAiApi = createApi({
  reducerPath: "speakingAiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({

    // 🎙️ Pronunciation Performance
    pronunciationPerformance: builder.mutation ({
      query: ({ audio, expected_text }) => {
        const formData = new FormData();
        formData.append("audio", audio);

        return {
          url: `/evaluate/pronunciation-performance?expected_text=${encodeURIComponent(
            expected_text
          )}`,
          method: "POST",
          body: formData,
        };
      },
    }),

    // 📖 Reading Aloud Speaking Performance
    readingAloudSpeakingPerformance: builder.mutation ({
      query: ({ audio, expected_text }) => {
        const formData = new FormData();
        formData.append("audio", audio);

        return {
          url: `/evaluate/reading-aloud-speaking-performance?expected_text=${encodeURIComponent(
            expected_text
          )}`,
          method: "POST",
          body: formData,
        };
      },
    }),

    // 🗣️ Speaking Performance (with payload)
    speakingPerformance: builder.mutation ({
      query: (data) => ({
        url: "/evaluate/speaking-performance/",
        method: "POST",
        body: data,
      }),
    }),

    // 💬 Conversation Practice Chat
    conversationPracticeChat: builder.mutation ({
      query: (data) => ({
        url: "/practice/conversation-practice-chat/",
        method: "POST",
        body: data,
      }),
    }),

  }),
});

export const {
  usePronunciationPerformanceMutation,
  useReadingAloudSpeakingPerformanceMutation,
  useSpeakingPerformanceMutation,
  useConversationPracticeChatMutation,
} = speakingAiApi;
