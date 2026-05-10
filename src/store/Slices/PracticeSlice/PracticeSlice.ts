import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PracticeState, ExamMode, Skill, TaskType, Tier } from '../../../pages/UserPractice/types';

interface ExtendedPracticeState extends PracticeState {
  writingText: string;
  simulatedFeedbackTier: Tier;
  promptTab: 'generator' | 'feedback';
}

const initialState: ExtendedPracticeState = {
  view: 'dashboard',
  skill: '',
  type: null,
  domain: '',
  domainIt: '',
  tier: 'Free',
  mode: 'CITIZENSHIP',
  level: 'B1c',
  fullTaskId: '',
  writingText: '',
  simulatedFeedbackTier: 'Free',
  promptTab: 'generator',
};

const practiceSlice = createSlice({
  name: 'practice',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<ExamMode>) => {
      state.mode = action.payload;
      state.level = action.payload === 'CITIZENSHIP' ? 'B1c' : 'B1';
    },
    setSkill: (state, action: PayloadAction<Skill | ''>) => {
      state.skill = action.payload;
    },
    setType: (state, action: PayloadAction<TaskType | null>) => {
      state.type = action.payload;
      if (action.payload) {
        state.fullTaskId = `${action.payload.id}_${state.level}`;
      } else {
        state.fullTaskId = '';
      }
    },
    setDomain: (state, action: PayloadAction<{ en: string; it: string }>) => {
      state.domain = action.payload.en;
      state.domainIt = action.payload.it;
    },
    setTier: (state, action: PayloadAction<Tier>) => {
      state.tier = action.payload;
    },
    setWritingText: (state, action: PayloadAction<string>) => {
      state.writingText = action.payload;
    },
    setSimulatedFeedbackTier: (state, action: PayloadAction<Tier>) => {
      state.simulatedFeedbackTier = action.payload;
    },
    setPromptTab: (state, action: PayloadAction<'generator' | 'feedback'>) => {
      state.promptTab = action.payload;
    },
    resetPractice: (state) => {
      state.skill = '';
      state.type = null;
      state.domain = '';
      state.domainIt = '';
      state.writingText = '';
      state.fullTaskId = '';
    },
  },
});

export const {
  setMode,
  setSkill,
  setType,
  setDomain,
  setTier,
  setWritingText,
  setSimulatedFeedbackTier,
  setPromptTab,
  resetPractice,
} = practiceSlice.actions;

export default practiceSlice.reducer;