/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

/* =======================
   Base URL
======================= */

const BASE_URL = import.meta.env.VITE_AI_API_ENDPOINT || "https://cheesuschrusty-server-lqeb.onrender.com";

/* =======================
   Types
======================= */

export interface TtsRequest {
  text: string;
}

export interface TtsResponse {
  success: boolean;
  data?: {
    audioUrl: string;
    transcription: any;
    text: any
  };
  audioUrl?: string;
  audioBase64?: string;
  message?: string;
}

export interface SttResponse {
  success: boolean;
  text: string;

  transcription: any;
  message: any;
  trim: any;
  data?: {
    audioUrl: string;
    transcription: any;
    text: any
    trim: any
  }

}

export interface PlayForTestingRequest {
  text: string;
}

export type PlayForTestingResponse = Blob | any;

/* =======================
   API
======================= */

export const audioApi = createApi({
  reducerPath: "audioApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({

    /* =======================
       POST: /audio/tts
    ======================= */
    textToSpeech: builder.mutation<Blob | TtsResponse, TtsRequest>({
      query: ({ text }) => ({
        url: `/audio/play-for-testing?text=${encodeURIComponent(text)}`,
        method: "GET",
        // Add responseHandler to handle binary data
        responseHandler: (response) => response.blob(),
        // You can also use:
        // responseHandler: 'blob',
      }),
      // Optional: Transform the response if needed
      transformResponse: async (response: Blob) => {
        // Create object URL from blob
        const blobUrl = URL.createObjectURL(response);
        return {
          success: true,
          audioUrl: blobUrl,
          isBlob: true
        };
      },
    }),

    /* =======================
       POST: /audio/stt/
       (FormData – NO Content-Type header)
    ======================= */
    speechToText: builder.mutation<any | string | SttResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("recordedfile", file);

        return {
          url: "/audio/stt/",
          method: "POST",
          body: formData,
        };
      },
    }),

    

    /* =======================
       GET: /audio/play-for-testing
    ======================= */
    playForTesting: builder.query<PlayForTestingResponse, PlayForTestingRequest >({
      query: ({ text }) => ({
        url: "/audio/play-for-testing",
        method: "GET",
        params: { text },
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: async (response: Blob) => {
        return URL.createObjectURL(response);
      },
    }),
    speechToTextPost: builder.mutation({
      query: (text) => ({
        url: "/audio/tts",
        method: "POST",
        body: { text },
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: async (response: Blob) => {
        const blobUrl = URL.createObjectURL(response);
        return {
          success: true,
          audioUrl: blobUrl,
          isBlob: true
        };
      },
    }),

  }),
});

/* =======================
   Hooks
======================= */

export const {
  useTextToSpeechMutation,
  useSpeechToTextMutation,
  usePlayForTestingQuery,
  useLazyPlayForTestingQuery,
  useSpeechToTextPostMutation
} = audioApi;
