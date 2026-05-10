import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../store/Slices/AuthSlice/authSlice";
import counterReducer from "../store/Slices/counterSlice/counterSlice";
import formReducer from "../store/Slices/FormSlice/FormSlice";
import audioPlayerReducer from "../store/Slices/AudioPlayerSlice/audioPlayerSlice";
import { baseApi } from "@/redux/hooks/baseApi";
import { speakingAiApi } from "@/redux/features/lesson/speakingAi/speakingAiApi";
import { audioApi } from "@/redux/features/audio/audioApi";
import { writingPerformanceApi } from "@/redux/features/lesson/writingAi/writingPerformanceApi";
import { readingPerformanceApi } from "@/redux/features/lesson/readingAI/readingPerformanceApi";
import { aiApi } from "@/redux/features/aiApi/aiApi";
import practiceReducer from "@/store/Slices/PracticeSlice/PracticeSlice"



export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [speakingAiApi.reducerPath]: speakingAiApi.reducer,
    [audioApi.reducerPath]: audioApi.reducer,
    [writingPerformanceApi.reducerPath]: writingPerformanceApi.reducer,
    [readingPerformanceApi.reducerPath]: readingPerformanceApi.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
    
       practice: practiceReducer,
           auth: authReducer,
        counter: counterReducer,
           form: formReducer,
    audioPlayer: audioPlayerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      baseApi.middleware, 
      speakingAiApi.middleware, 
      audioApi.middleware, 
      writingPerformanceApi.middleware, 
      readingPerformanceApi.middleware,
      aiApi.middleware // Added aiApi middleware
    ),
});

// ✅ Enables refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;