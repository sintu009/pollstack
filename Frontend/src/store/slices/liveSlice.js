import { createSlice } from "@reduxjs/toolkit";

const liveSlice = createSlice({
  name: "live",
  initialState: {
    totalResponses: 0,
    questionSummaries: null,
    isConnected: false,
    lastEvent: null,
    lastUpdatedAt: null,
    feed: [],
  },
  reducers: {
    setConnected: (state, { payload }) => { state.isConnected = payload; },
    updateLiveData: (state, { payload }) => {
      state.lastEvent = payload;
      state.lastUpdatedAt = new Date().toISOString();

      if (payload.totalResponses !== undefined) state.totalResponses = payload.totalResponses;
      if (payload.questionSummaries) state.questionSummaries = payload.questionSummaries;

      // Live answer progress (user clicking Next)
      if (payload.type === "ANSWER_PROGRESS") {
        state.feed.unshift({
          id: Date.now(),
          type: "progress",
          questionTitle: payload.questionTitle,
          selectedText: payload.selectedText,
          questionIndex: payload.questionIndex,
          totalQuestions: payload.totalQuestions,
          timestamp: payload.timestamp,
        });
        if (state.feed.length > 30) state.feed.pop();
      }

      // Final submission
      if (payload.type === "NEW_RESPONSE") {
        state.feed.unshift({
          id: Date.now(),
          type: "submission",
          totalResponses: payload.totalResponses,
          submittedAt: payload.submittedAt || new Date().toISOString(),
          latestAnswers: payload.latestAnswers || [],
        });
        if (state.feed.length > 30) state.feed.pop();
      }
    },
    resetLive: (state) => {
      state.totalResponses = 0;
      state.questionSummaries = null;
      state.lastEvent = null;
      state.feed = [];
    },
  },
});

export const { setConnected, updateLiveData, resetLive } = liveSlice.actions;
export default liveSlice.reducer;
