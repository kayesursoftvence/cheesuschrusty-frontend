 
import { baseApi } from "@/redux/hooks/baseApi";
import type {
  MasterPromptResponse,
} from "./masterPrompts.types";

export const masterPromptsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: /prompts/master-prompt-questions
    getMasterPromptQuestions: builder.query({
      query: () => ({
        url: "/prompts/master-prompt-questions",
        method: "GET",
      }),
      providesTags: ["MasterPromptQuestions"],
    }),

    // POST: /prompts/master-prompt-questions
    updateMasterPromptQuestions: builder.mutation<
      MasterPromptResponse,
      string
    >({
      query: (promptText) => ({
        url: "/prompts/master-prompt-questions",
        method: "POST",
        body: promptText,
        headers: {
          "Content-Type": "text/plain",
        },
      }),
      invalidatesTags: ["MasterPromptQuestions"],
    }),

    // GET: /prompts/master-prompt-feedback
    getMasterPromptFeedback: builder.query({
      query: () => ({
        url: "/prompts/master-prompt-feedback",
        method: "GET",
      }),
      providesTags: ["MasterPromptFeedback"],
    }),

    // POST: /prompts/master-prompt-feedback
    updateMasterPromptFeedback: builder.mutation<
      MasterPromptResponse,
      string
    >({
      query: (promptText) => ({
        url: "/prompts/master-prompt-feedback",
        method: "POST",
        body: promptText,
        headers: {
          "Content-Type": "text/plain",
        },
      }),
      invalidatesTags: ["MasterPromptFeedback"],
    }),
  }),
});

export const {
  useGetMasterPromptQuestionsQuery,
  useUpdateMasterPromptQuestionsMutation,
  useGetMasterPromptFeedbackQuery,
  useUpdateMasterPromptFeedbackMutation,
} = masterPromptsApi;
