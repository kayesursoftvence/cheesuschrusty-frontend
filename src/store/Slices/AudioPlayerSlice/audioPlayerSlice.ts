import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AudioPlayerState {
  audioSource: string;
  audioLoading: boolean;
  audioError: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  speed: number;
  volume: number;
}

const initialState: AudioPlayerState = {
  audioSource: "",
  audioLoading: false,
  audioError: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  speed: 1,
  volume: 1,
};

const audioPlayerSlice = createSlice({
  name: "audioPlayer",
  initialState,
  reducers: {
    setAudioSource: (state, action: PayloadAction<string>) => {
      state.audioSource = action.payload;
      state.audioError = null;
    },
    setAudioLoading: (state, action: PayloadAction<boolean>) => {
      state.audioLoading = action.payload;
    },
    setAudioError: (state, action: PayloadAction<string | null>) => {
      state.audioError = action.payload;
      state.audioLoading = false;
      state.isPlaying = false;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setSpeed: (state, action: PayloadAction<number>) => {
      state.speed = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    resetAudioState: (state) => {
      return { ...initialState, speed: state.speed, volume: state.volume };
    },
  },
});

export const {
  setAudioSource,
  setAudioLoading,
  setAudioError,
  setIsPlaying,
  setCurrentTime,
  setDuration,
  setSpeed,
  setVolume,
  resetAudioState,
} = audioPlayerSlice.actions;

export default audioPlayerSlice.reducer;
